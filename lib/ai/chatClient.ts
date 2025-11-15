export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatOptions {
  messages: ChatMessage[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface ChatResponse {
  content: string
  model: string
}

// Get Groq API key (try both env var names)
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.API_KEY_GROQ_API_KEY

// Default model - use Groq-compatible model
const TEXT_MODEL = process.env.TEXT_MODEL || ""
const isGPTModel = TEXT_MODEL.includes("gpt-") || TEXT_MODEL.includes("openai/")
const DEFAULT_MODEL = isGPTModel ? "llama-3.3-70b-versatile" : (TEXT_MODEL || "llama-3.3-70b-versatile")

/**
 * Main chat function - handles ALL LLM requests through Groq API
 * Uses GROQ_API_KEY with standard Bearer token auth
 */
export async function runChat(options: ChatOptions): Promise<ChatResponse> {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = options

  console.log('[v0] [chatClient] Starting chat request')
  console.log('[v0] [chatClient] Messages count:', messages.length)
  console.log('[v0] [chatClient] Model:', DEFAULT_MODEL)

  // Validate API key presence
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set. Please add it in Settings → Vars.")
  }

  // Build final messages array
  const finalMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages

  console.log('[v0] [chatClient] Calling Groq API')

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: finalMessages,
          temperature,
          max_tokens: maxTokens,
        }),
      }
    )

    console.log('[v0] [chatClient] Groq API response status:', response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error('[v0] [chatClient] Groq API error:', text.slice(0, 500))
      throw new Error(`Groq API error (${response.status}): ${text.slice(0, 200)}`)
    }

    const data = await response.json()

    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      throw new Error("No reply content from Groq API.")
    }

    console.log('[v0] [chatClient] Success, response length:', reply.length)

    return {
      content: reply,
      model: data.model || DEFAULT_MODEL,
    }
  } catch (error: any) {
    console.error('[v0] [chatClient] Groq API call failed:', error.message)
    throw new Error(`Chat API error: ${error.message}`)
  }
}
