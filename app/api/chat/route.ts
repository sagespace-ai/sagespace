import { NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/ai-client"
import { SAGE_TEMPLATES } from "@/lib/sage-templates"

export async function POST(request: Request) {
  try {
    const { messages, agentId, conversationId, sageId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array required" }, { status: 400 })
    }

    console.log("[Chat API] Processing request:", {
      messageCount: messages.length,
      agentId,
      sageId,
      conversationId,
    })

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
