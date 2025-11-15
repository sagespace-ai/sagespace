/**
 * Centralized AI Client for SageSpace
 * CHARTER-COMPLIANT: Uses Groq-first model router for all LLM requests
 * All AI calls go through cost-aware routing with governance enforcement
 */
import { streamText, generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { routedStreamText, routedGenerateText, type RoutingContext } from './ai/model-router'
import type { AccessLevel } from './ai/types'
import { log, generateCorrelationId } from '@/lib/monitoring/logging'
import { metrics } from '@/lib/monitoring/metrics'

// Initialize Groq provider for direct fallback only
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
  userAccessLevel?: AccessLevel
  sage?: any
  mode?: string
}

export const ai = {
  /**
   * Run a chat completion with Charter-compliant routing
   */
  async runChat(
    messages: Array<{ role: string; content: string }>,
    options: {
      temperature?: number
      maxTokens?: number
    } = {},
    userAccessLevel: AccessLevel = 'free',
  ) {
    const prompt = messages[messages.length - 1].content
    
    const result = await routedGenerateText(
      prompt,
      {
        capability: 'chat',
        userAccessLevel,
        maxCostPerCall: 0.01,
      },
      {
        temperature: options.temperature ?? 0.7,
        maxTokens: options.maxTokens ?? 1000,
      }
    )

    console.log('[v0] Chat routed to:', result.routingDecision.provider)

    return {
      text: result.text,
      routingDecision: result.routingDecision,
    }
  },

  /**
   * Run a streaming chat completion
   */
  async runChatStream(
    messages: Array<{ role: string; content: string }>,
    options: {
      temperature?: number
      maxTokens?: number
    } = {},
    userAccessLevel: AccessLevel = 'free',
  ) {
    const prompt = messages[messages.length - 1].content
    
    const result = await routedStreamText(
      prompt,
      {
        capability: 'chat',
        userAccessLevel,
      },
      {
        temperature: options.temperature ?? 0.7,
        maxTokens: options.maxTokens ?? 1000,
      }
    )

    console.log('[v0] Stream routed to:', result.routingDecision.provider)

    return {
      stream: result.stream,
      routingDecision: result.routingDecision,
    }
  },

  /**
   * Run Council deliberation step
   */
  async runCouncilStep(
    prompt: string,
    userAccessLevel: AccessLevel = 'free',
  ) {
    const result = await routedGenerateText(
      prompt,
      {
        capability: 'chat',
        userAccessLevel,
        maxCostPerCall: 0.002,
      },
      {
        temperature: 0.8,
        maxTokens: 200,
      }
    )

    return {
      text: result.text,
      routingDecision: result.routingDecision,
    }
  },

  /**
   * Run summarization (memory compression)
   */
  async runSummarization(
    text: string,
    userAccessLevel: AccessLevel = 'free',
  ) {
    const result = await routedGenerateText(
      `Summarize the following conversation in 2-3 sentences:\n\n${text}`,
      {
        capability: 'chat',
        userAccessLevel,
        maxCostPerCall: 0.001,
      },
      {
        temperature: 0.3,
        maxTokens: 150,
      }
    )

    return {
      summary: result.text,
      routingDecision: result.routingDecision,
    }
  },

  /**
   * Run embedding (only for premium tiers per Charter)
   */
  async runEmbedding(
    text: string,
    userAccessLevel: AccessLevel,
  ) {
    // Charter: Embeddings disabled for free/explorer/voyager
    if (['free', 'explorer', 'voyager'].includes(userAccessLevel)) {
      throw new Error('Embeddings require Astral tier or higher per Charter')
    }

    throw new Error('Embeddings not yet implemented')
  },
}

/**
 * Generate a streaming chat response using Charter-compliant routing
 * ALWAYS uses Groq unless explicitly premium tier with feature flags
 * @returns StreamTextResult for use with toUIMessageStreamResponse()
 */
export async function generateChatResponse({
  messages,
  model,
  systemPrompt,
  maxTokens = 2000,
  temperature = 0.7,
  userAccessLevel = 'free',
  sage,
  mode,
}: GenerateChatOptions & { sage?: any; mode?: string }) {
  const start = Date.now()
  const correlationId = generateCorrelationId()
  
  try {
    console.log('[v0] generateChatResponse: Starting', {
      messageCount: messages.length,
      hasSage: !!sage,
      mode,
      userAccessLevel,
    })
    
    const apiKey = process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('[v0] API key missing:', {
        hasAPIKeyGroq: !!process.env.API_KEY_GROQ_API_KEY,
        hasGroqApiKey: !!process.env.GROQ_API_KEY,
        envKeys: Object.keys(process.env).filter(k => k.includes('GROQ')),
      })
      const error = new Error(
        'GROQ_API_KEY is not configured. Add API_KEY_GROQ_API_KEY or GROQ_API_KEY in environment variables.'
      )
      error.name = 'GROQ_API_KEY_MISSING'
      throw error
    }

    // Build system prompt
    let finalSystemPrompt = systemPrompt
    if (sage && !systemPrompt) {
      finalSystemPrompt = `You are ${sage.name}, ${sage.description}\n\nPersonality: ${sage.personality}\n\nRespond in character with helpful guidance.`
    }

    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
    
    console.log('[v0] Prepared prompt:', {
      promptLength: prompt.length,
      hasSystemPrompt: !!finalSystemPrompt,
      systemPromptLength: finalSystemPrompt?.length,
    })
    
    console.log('[v0] Calling routedStreamText')
    
    let result
    try {
      result = await routedStreamText(
        prompt,
        {
          userAccessLevel,
          capability: 'chat',
          costLimit: 0,
        },
        {
          system: finalSystemPrompt,
          maxTokens,
          temperature
        }
      )
    } catch (routingError: any) {
      console.error('[v0] routedStreamText failed:', {
        name: routingError.name,
        message: routingError.message,
        stack: routingError.stack?.split('\n').slice(0, 5),
      })
      throw routingError
    }

    const latencyMs = Date.now() - start
    
    console.log('[v0] routedStreamText completed:', {
      latencyMs,
      hasResult: !!result,
      resultType: typeof result,
      hasToUIMethod: typeof result?.toUIMessageStreamResponse === 'function',
      methodType: typeof result?.toUIMessageStreamResponse,
    })
    
    if (typeof result?.toUIMessageStreamResponse !== 'function') {
      console.error('[v0] CRITICAL: Missing toUIMessageStreamResponse method!', {
        result: result,
        resultKeys: result ? Object.keys(result) : 'null',
        resultPrototype: result ? Object.getPrototypeOf(result) : 'null',
      })
      throw new Error('Invalid response from routedStreamText - missing toUIMessageStreamResponse method')
    }
    
    log.info('Chat response generated', { correlationId, latencyMs })
    metrics.recordLatency('chat.response.latency', latencyMs)
    
    console.log('[v0] Returning result with preserved methods')
    return result
  } catch (error: any) {
    console.error('[v0] generateChatResponse: Fatal error:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    })
    
    // Re-throw with enhanced context
    const enhancedError = new Error(`Chat generation failed: ${error.message}`)
    enhancedError.name = error.name || 'CHAT_GENERATION_ERROR'
    enhancedError.stack = error.stack
    throw enhancedError
  }
}

/**
 * Generate a non-streaming chat response with Charter-compliant routing
 */
export async function generateChatResponseSync({
  messages,
  model,
  systemPrompt,
  maxTokens = 2000,
  temperature = 0.7,
  userAccessLevel = 'free',
}: GenerateChatOptions) {
  console.log("[AI Client] Generating sync chat response (Charter-compliant routing)")

  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
    
    const result = await routedGenerateText(
      prompt,
      {
        userAccessLevel,
        capability: 'chat',
        costLimit: 0,
      },
      {
        system: systemPrompt,
        maxTokens,
        temperature
      }
    )

    console.log("[AI Client] Routed to:", result.routingDecision.provider)
    
    return result
  } catch (error: any) {
    console.error("[AI Client] Error generating sync chat response:", {
      message: error.message,
      stack: error.stack,
    })
    throw new Error(`LLM request failed: ${error.message}`)
  }
}

/**
 * Generate a council/multi-sage response with Charter-compliant routing
 * OPTIMIZED: Uses cost-aware routing, Groq-first
 */
export async function generateCouncilResponse({
  messages,
  agents,
  model,
  userAccessLevel = 'free',
}: {
  messages: ChatMessage[]
  agents: Array<{ name: string; role: string; expertise?: string }>
  model?: any
  userAccessLevel?: AccessLevel
}) {
  console.log("[AI Client] Generating council response with", agents.length, "agents (Charter-compliant)")

  const systemPrompt = `You are facilitating a council discussion with the following experts:
${agents.map((a, i) => `${i + 1}. ${a.name} - ${a.role}${a.expertise ? ` (${a.expertise})` : ""}`).join("\n")}

Provide a balanced response that synthesizes perspectives from all council members, highlighting areas of agreement and noting any differing viewpoints. Follow the Five Laws of Sage AI:
1. Prioritize human well-being and safety
2. Provide accurate, truthful information
3. Respect user privacy and data
4. Be transparent about capabilities and limitations
5. Encourage learning and growth`

  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
    
    const result = await routedStreamText(
      prompt,
      {
        userAccessLevel,
        capability: 'reasoning', // Council needs reasoning capability
        costLimit: 0,
      },
      {
        system: systemPrompt,
        maxTokens: 3000,
        temperature: 0.8
      }
    )

    console.log("[AI Client] Council routed to:", result.routingDecision.provider)
    
    return result
  } catch (error: any) {
    console.error("[AI Client] Error generating council response:", {
      message: error.message,
      agentCount: agents.length,
      stack: error.stack,
    })
    throw new Error(`Council LLM request failed: ${error.message}`)
  }
}

/**
 * Search Spotify for tracks, artists, or playlists
 * Uses the /api/spotify/search endpoint
 */
export async function searchSpotify({
  query,
  type = "track",
  limit = 10,
}: {
  query: string
  type?: "track" | "artist" | "playlist" | "album"
  limit?: number
}): Promise<any> {
  console.log("[AI Client] Searching Spotify for:", { query, type, limit })

  try {
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Spotify search failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("[AI Client] Spotify search results:", data)
    return data
  } catch (error: any) {
    console.error("[AI Client] Spotify search error:", error.message)
    throw new Error(`Spotify search failed: ${error.message}`)
  }
}
