import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createSageAgentGraph } from "@/lib/langchain/agent-graph"
import { HumanMessage } from "@langchain/core/messages"

export async function POST(request: Request) {
  try {
    const { agentId, message, threadId } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Fetch agent
    let agent
    if (!user) {
      const serviceSupabase = createServiceRoleClient()
      const { data } = await serviceSupabase.from("agents").select("*").eq("id", agentId).single()
      agent = data
    } else {
      const { data } = await supabase.from("agents").select("*").eq("id", agentId).single()
      agent = data
    }

    if (!agent) {
      return new Response("Agent not found", { status: 404 })
    }

    const graph = await createSageAgentGraph({
      agentId: agent.id,
      agentName: agent.name,
      agentRole: agent.role,
      purpose: agent.purpose || "To assist and collaborate",
      harmonyScore: agent.harmony_score || 75,
      ethicsAlignment: agent.ethics_alignment || 85,
    })

    // Create a readable stream for SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await graph.stream(
            {
              messages: [new HumanMessage(message)],
              agentId: agent.id,
              agentRole: agent.role,
              harmonyScore: agent.harmony_score || 75,
              ethicsAlignment: agent.ethics_alignment || 85,
              pendingAction: null,
              requiresApproval: false,
            },
            {
              configurable: { thread_id: threadId || `chat-${agentId}-${Date.now()}` },
            },
          )

          for await (const chunk of result) {
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Streaming error:", error)
    return new Response("Failed to stream chat", { status: 500 })
  }
}
