import { NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/ai-client"

export async function POST(request: Request) {
  try {
    const { messages, agentId, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array required" }, { status: 400 })
    }

    console.log("[Chat API] Processing request:", {
      messageCount: messages.length,
      agentId,
      conversationId,
    })

    const result = await generateChatResponse({
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      systemPrompt: `You are a helpful AI agent in the SageSpace platform. You follow the Five Laws of Sage AI:
1. Prioritize human well-being and safety
2. Provide accurate, truthful information
3. Respect user privacy and data
4. Be transparent about capabilities and limitations
5. Encourage learning and growth${agentId ? `\n\nYou are currently acting as agent: ${agentId}` : ""}`,
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
