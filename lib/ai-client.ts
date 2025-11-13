/**
 * Centralized AI Client for SageSpace
 * Uses Groq directly for all LLM requests
 */
import { streamText, generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

// Initialize Groq provider with API key
const groq = createGroq({
  apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
})

const DEFAULT_MODEL = groq("llama-3.3-70b-versatile")
const CHAT_MODEL = groq("llama-3.3-70b-versatile")
const COUNCIL_MODEL = groq("mixtral-8x7b-32768")

// Validate configuration at module load
if (!process.env.API_KEY_GROQ_API_KEY && !process.env.GROQ_API_KEY) {
  console.warn("[AI Client] No GROQ_API_KEY configured - LLM requests will fail")
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface GenerateChatOptions {
  messages: ChatMessage[]
  model?: any
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

/**
 * Generate a streaming chat response using Groq
 * @returns StreamTextResult for use with toUIMessageStreamResponse()
 */
export async function generateChatResponse({
  messages,
  model = CHAT_MODEL,
  systemPrompt,
  maxTokens = 2000,
  temperature = 0.7,
}: GenerateChatOptions) {
  console.log("[AI Client] Generating chat response with model:", model)

  try {
    const result = await streamText({
      model,
      messages: systemPrompt ? [{ role: "system" as const, content: systemPrompt }, ...messages] : messages,
      maxOutputTokens: maxTokens,
      temperature,
    })

    return result
  } catch (error: any) {
    console.error("[AI Client] Error generating chat response:", {
      message: error.message,
      model,
      stack: error.stack,
    })
    throw new Error(`LLM request failed: ${error.message}`)
  }
}

/**
 * Generate a non-streaming chat response for cases where streaming isn't needed
 */
export async function generateChatResponseSync({
  messages,
  model = CHAT_MODEL,
  systemPrompt,
  maxTokens = 2000,
  temperature = 0.7,
}: GenerateChatOptions) {
  console.log("[AI Client] Generating sync chat response with model:", model)

  try {
    const result = await generateText({
      model,
      messages: systemPrompt ? [{ role: "system" as const, content: systemPrompt }, ...messages] : messages,
      maxOutputTokens: maxTokens,
      temperature,
    })

    return result
  } catch (error: any) {
    console.error("[AI Client] Error generating sync chat response:", {
      message: error.message,
      model,
      stack: error.stack,
    })
    throw new Error(`LLM request failed: ${error.message}`)
  }
}

/**
 * Generate a council/multi-sage response
 */
export async function generateCouncilResponse({
  messages,
  agents,
  model = COUNCIL_MODEL,
}: {
  messages: ChatMessage[]
  agents: Array<{ name: string; role: string; expertise?: string }>
  model?: any
}) {
  console.log("[AI Client] Generating council response with", agents.length, "agents")

  const systemPrompt = `You are facilitating a council discussion with the following experts:
${agents.map((a, i) => `${i + 1}. ${a.name} - ${a.role}${a.expertise ? ` (${a.expertise})` : ""}`).join("\n")}

Provide a balanced response that synthesizes perspectives from all council members, highlighting areas of agreement and noting any differing viewpoints. Follow the Five Laws of Sage AI:
1. Prioritize human well-being and safety
2. Provide accurate, truthful information
3. Respect user privacy and data
4. Be transparent about capabilities and limitations
5. Encourage learning and growth`

  try {
    const result = await streamText({
      model,
      messages: [{ role: "system" as const, content: systemPrompt }, ...messages],
      maxOutputTokens: 3000,
      temperature: 0.8,
    })

    return result
  } catch (error: any) {
    console.error("[AI Client] Error generating council response:", {
      message: error.message,
      model,
      agentCount: agents.length,
      stack: error.stack,
    })
    throw new Error(`Council LLM request failed: ${error.message}`)
  }
}
