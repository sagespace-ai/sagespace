/**
 * Centralized AI Chat Client for SageSpace
 * 
 * This is the ONLY source of truth for all LLM requests in SageSpace.
 * All chat UIs must use this module instead of calling providers directly.
 * 
 * Environment Variables:
 * - GROQ_API_KEY or API_KEY_GROQ_API_KEY: Groq API key (REQUIRED)
 * - TEXT_MODEL: Model identifier (defaults to llama-3.3-70b-versatile)
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

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getModel(): string {
  const textModel = process.env.TEXT_MODEL || '';
  
  // If TEXT_MODEL is set to a GPT or OpenAI model, ignore it and use Groq model
  if (textModel.includes('gpt-') || textModel.includes('openai/')) {
    console.log('[v0] [chatClient] Ignoring incompatible TEXT_MODEL:', textModel);
    return 'llama-3.3-70b-versatile';
  }
  
  // If TEXT_MODEL is a valid Groq model, use it
  if (textModel) {
    return textModel;
  }
  
  // Default to fast Groq model
  return 'llama-3.3-70b-versatile';
}

/**
 * Main chat function - handles all LLM requests through Groq API
 * Uses Groq API key authentication
 */
export async function runChat(options: ChatOptions): Promise<ChatResponse> {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = options
  
  const model = getModel();

  console.log('[v0] [chatClient] Starting chat request')
  console.log('[v0] [chatClient] Messages count:', messages.length)
  console.log('[v0] [chatClient] Model:', model)

  const apiKey = process.env.GROQ_API_KEY || process.env.API_KEY_GROQ_API_KEY

  if (!apiKey) {
    const error = new Error(
      'GROQ_API_KEY is not configured. Please set GROQ_API_KEY in your environment variables (Settings → Vars section).'
    )
    console.error('[v0] [chatClient] FATAL: GROQ_API_KEY not found')
    throw error
  }

  // Build final messages array
  const finalMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages

  console.log('[v0] [chatClient] Calling Groq API at:', GROQ_API_URL)
  console.log('[v0] [chatClient] Using API key auth (length:', apiKey.length, ')')

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    console.log('[v0] [chatClient] Groq API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] [chatClient] Groq API error:', errorText.slice(0, 500))
      throw new Error(`Groq API HTTP ${response.status}: ${errorText.slice(0, 200)}`)
    }

    const data = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Groq API returned no choices')
    }

    const content = data.choices[0].message?.content
    if (!content) {
      throw new Error('Groq API returned empty content')
    }

    console.log('[v0] [chatClient] Groq API success, response length:', content.length)

    return {
      content,
      model: data.model || model,
    }
  } catch (error: any) {
    console.error('[v0] [chatClient] Groq API call failed:', error.message)
    throw new Error(`Groq API error: ${error.message}`)
  }
}
