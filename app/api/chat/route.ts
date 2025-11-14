import { NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/ai-client"
import { SAGE_TEMPLATES } from "@/lib/sage-templates"
import { createPlaygroundGraph } from "@/lib/ai/orchestration/playground-graph"
import { createServerClient } from "@/lib/supabase/server"
import { monitoredAPIRoute } from "@/lib/self-healing/middleware"

async function chatHandler(request: Request) {
  try {
    const { messages, agentId, conversationId, sageId, useOrchestration } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array required" }, { status: 400 })
    }

    console.log("[Chat API] Processing request:", {
      messageCount: messages.length,
      agentId,
      sageId,
      conversationId,
      useOrchestration,
    })

    if (useOrchestration && sageId && conversationId) {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const sage = SAGE_TEMPLATES.find((s) => s.id === sageId)
        
        if (sage) {
          const graph = createPlaygroundGraph(sageId, user.id)
          
          const result = await graph.execute({
            messages,
            context: {
              sage,
              conversationId,
              userId: user.id,
            },
          })

          const lastMessage = result.messages[result.messages.length - 1]
          
          return NextResponse.json({
            message: lastMessage,
            metadata: {
              errors: result.errors,
              steps: result.metadata,
            },
          })
        }
      }
    }

    // Fallback to simple mode
    const sage = sageId ? SAGE_TEMPLATES.find((s) => s.id === sageId) : undefined

    const result = await generateChatResponse({
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      sage: sage as any,
      mode: "single",
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[Chat API] LLM request failed:", {
      error: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "LLM_GATEWAY_ERROR",
        message: error.message || "Failed to generate response",
        details: "The AI service encountered an error. Please try again.",
      },
      { status: 500 },
    )
  }
}

export const POST = monitoredAPIRoute(chatHandler, 'chat')
