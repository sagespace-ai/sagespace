/**
 * Centralized AI Chat Client for SageSpace
 * 
 * This is the ONLY source of truth for all LLM requests in SageSpace.
 * All chat UIs must use this module instead of calling providers directly.
 * 
 * Environment Variables:
 * - AI_GATEWAY_API_KEY: Vercel AI Gateway authentication (REQUIRED)
 * - TEXT_MODEL: Model identifier (defaults to "openai/gpt-4o-mini")
 * 
 * IMPORTANT: Uses API key authentication only, NOT OIDC tokens.
 * Never reference VERCEL_OIDC_TOKEN or x-vercel-oidc-token.
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

const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const DEFAULT_MODEL = process.env.TEXT_MODEL || "openai/gpt-4o-mini";

/**
 * Main chat function - handles all LLM requests through Vercel AI Gateway
 * Uses API key authentication, NOT OIDC
 */
export async function runChat(options: ChatOptions): Promise<ChatResponse> {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = options

  console.log('[v0] [chatClient] Starting chat request')
  console.log('[v0] [chatClient] Messages count:', messages.length)
  console.log('[v0] [chatClient] Model:', DEFAULT_MODEL)

  const apiKey = process.env.AI_GATEWAY_API_KEY

  if (!apiKey) {
    const error = new Error(
      'AI_GATEWAY_API_KEY is not configured. Please set AI_GATEWAY_API_KEY in your environment variables (Settings → Vars section).'
    )
    console.error('[v0] [chatClient] FATAL: AI_GATEWAY_API_KEY not found')
    throw error
  }

  // Build final messages array
  const finalMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages

  console.log('[v0] [chatClient] Calling AI Gateway at:', AI_GATEWAY_URL)
  console.log('[v0] [chatClient] Using API key auth (length:', apiKey.length, ')')

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // NO x-vercel-oidc-token header
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    console.log('[v0] [chatClient] AI Gateway response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] [chatClient] AI Gateway error:', errorText.slice(0, 500))
      throw new Error(`AI Gateway HTTP ${response.status}: ${errorText.slice(0, 200)}`)
    }

    const data = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI Gateway returned no choices')
    }

    const content = data.choices[0].message?.content
    if (!content) {
      throw new Error('AI Gateway returned empty content')
    }

    console.log('[v0] [chatClient] AI Gateway success, response length:', content.length)

    return {
      content,
      model: data.model || DEFAULT_MODEL,
    }
  } catch (error: any) {
    console.error('[v0] [chatClient] AI Gateway call failed:', error.message)
    throw new Error(`AI Gateway error: ${error.message}`)
  }
}
