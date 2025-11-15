/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROOT CAUSES IDENTIFIED & FIXED:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PROBLEMS BEFORE THIS FIX:
 * 1. Using Groq API directly (https://api.groq.com) instead of AI Gateway
 * 2. Multiple scattered AI clients across codebase (aiGateway.ts, model-router.ts, etc.)
 * 3. AI SDK (generateText, streamText) usage that requires OIDC authentication
 * 4. Inconsistent env var names (AI_GATEWAY_API_KEY, GROQ_API_KEY, API_KEY_GROQ_API_KEY, etc.)
 * 5. Components making direct provider API calls instead of using server routes
 * 6. Error messages referencing wrong env vars or suggesting OIDC token setup
 * 
 * HOW THIS FIX RESOLVES IT:
 * - Single source of truth: this file is the ONLY AI chat client
 * - Uses Vercel AI Gateway URL: https://ai-gateway.vercel.sh/v1/chat/completions
 * - Uses only AI_GATEWAY_API_KEY with Bearer token auth (no OIDC)
 * - Standardized error handling with helpful messages
 * - All chat UIs now call /api/chat which uses this module
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

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

// Default model from TEXT_MODEL env or fallback
const DEFAULT_MODEL = process.env.TEXT_MODEL ?? "openai/gpt-4o-mini"

/**
 * Main chat function - handles ALL LLM requests through Vercel AI Gateway
 * Uses AI_GATEWAY_API_KEY with standard Bearer token auth (NOT OIDC)
 */
export async function runChat(options: ChatOptions): Promise<ChatResponse> {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = options

  console.log('[v0] [chatClient] Starting chat request')
  console.log('[v0] [chatClient] Messages count:', messages.length)
  console.log('[v0] [chatClient] Model:', DEFAULT_MODEL)

  // Validate API key presence
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI_GATEWAY_API_KEY is not set.")
  }

  // Build final messages array
  const finalMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages

  console.log('[v0] [chatClient] Calling AI Gateway at: https://ai-gateway.vercel.sh/v1/chat/completions')

  try {
    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
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

    console.log('[v0] [chatClient] AI Gateway response status:', response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error('[v0] [chatClient] AI Gateway error:', text.slice(0, 500))
      throw new Error(`Upstream AI error (${response.status}): ${text.slice(0, 200)}`)
    }

    const data = await response.json()

    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      throw new Error("No reply content from AI Gateway.")
    }

    console.log('[v0] [chatClient] Success, response length:', reply.length)

    return {
      content: reply,
      model: data.model || DEFAULT_MODEL,
    }
  } catch (error: any) {
    console.error('[v0] [chatClient] AI Gateway call failed:', error.message)
    throw new Error(`AI Gateway error: ${error.message}`)
  }
}
