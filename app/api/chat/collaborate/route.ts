import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { autoDetectAndCollaborate } from "@/lib/collaboration/agent-to-agent"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query, primaryAgentId } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const serviceSupabase = createServiceRoleClient()

    // Fetch primary agent
    const { data: primaryAgent, error: primaryError } = await serviceSupabase
      .from("agents")
      .select("*")
      .eq("id", primaryAgentId)
      .single()

    if (primaryError) throw primaryError

    // Fetch all available agents for potential collaboration
    const { data: availableAgents, error: agentsError } = await serviceSupabase
      .from("agents")
      .select("*")
      .eq("status", "active")
      .neq("id", primaryAgentId)

    if (agentsError) throw agentsError

    console.log(`[v0] Auto-detecting collaboration need for query from ${primaryAgent.name}`)

    // Auto-detect and collaborate if needed
    const { collaborated, result } = await autoDetectAndCollaborate(query, primaryAgent, availableAgents || [])

    if (!collaborated) {
      return NextResponse.json({
        collaborated: false,
        message: "No collaboration needed - single agent can handle this",
      })
    }

    console.log(`[v0] Collaboration completed with ${result?.messages.length} messages`)

    // Save conversation to database
    const { data: conversation, error: convError } = await serviceSupabase
      .from("agent_conversations")
      .insert({
        user_id: user?.id || null,
        title: `Collaboration: ${query.substring(0, 50)}...`,
        trigger_type: "automatic",
        trigger_reason: "Threshold detection triggered collaboration",
        status: "completed",
        metadata: { originalQuery: query },
      })
      .select()
      .single()

    if (convError) {
      console.error("[v0] Error creating conversation:", convError)
    } else {
      // Save messages
      const messagesData = result?.messages.map((msg) => ({
        conversation_id: conversation.id,
        from_agent_id: msg.fromAgentId,
        to_agent_id: msg.toAgentId,
        message_type: msg.messageType,
        content: msg.content,
        context: msg.context || null,
        requires_response: msg.requiresResponse,
      }))

      if (messagesData) {
        await serviceSupabase.from("agent_messages").insert(messagesData)
      }

      // Log interactions
      const allAgentIds = Array.from(new Set(result?.messages.map((m) => m.fromAgentId)))
      const interactions = []

      for (let i = 0; i < allAgentIds.length; i++) {
        for (let j = i + 1; j < allAgentIds.length; j++) {
          interactions.push({
            conversation_id: conversation.id,
            agent_a_id: allAgentIds[i],
            agent_b_id: allAgentIds[j],
            interaction_type: "collaboration",
            outcome: result?.outcome,
            confidence: result?.confidence,
          })
        }
      }

      if (interactions.length > 0) {
        await serviceSupabase.from("agent_interactions").insert(interactions)
      }
    }

    return NextResponse.json({
      collaborated: true,
      conversationId: conversation?.id,
      result,
    })
  } catch (error: any) {
    console.error("[v0] Collaboration error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
