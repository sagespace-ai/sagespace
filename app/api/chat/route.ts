import { NextResponse } from "next/server"
import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { messages, agentId } = await request.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]

    // Simple response for now - you can integrate with Groq or other AI providers
    const response = await streamText({
      model: process.env.API_KEY_GROQ_API_KEY ? "groq/llama-3.3-70b-versatile" : "openai/gpt-4",
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      system: "You are a helpful AI agent in the SageSpace platform, guided by the Five Laws of Sage AI.",
    })

    // For simplicity, return a simple response
    return NextResponse.json({
      message:
        "This is a demo response from the SageSpace AI agent. The full AI integration will connect to your configured provider (Groq, OpenAI, etc.).",
    })
  } catch (error: any) {
    console.error("[v0] Chat error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
