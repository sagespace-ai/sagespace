import { NextResponse } from "next/server"
import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { messages, agentId } = await request.json()

    const groqApiKey = process.env.API_KEY_GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "AI service not configured. Please add API_KEY_GROQ_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const groq = createGroq({
      apiKey: groqApiKey,
    })

    // Stream the response from Groq
    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      system: `You are a helpful AI agent in the SageSpace platform. You follow the Five Laws of Sage AI:
1. Prioritize human well-being and safety
2. Provide accurate, truthful information
3. Respect user privacy and data
4. Be transparent about capabilities and limitations
5. Encourage learning and growth`,
    })

    // Return the stream response
    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[v0] Chat error:", error.message)
    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
