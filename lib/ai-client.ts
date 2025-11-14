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
}: GenerateChatOptions) {
  const start = Date.now()
  const correlationId = generateCorrelationId()
  
  log.info('Chat response started', {
    correlationId,
    route: 'chat',
    messageCount: messages.length,
    userAccessLevel,
  })

  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
    
    const result = await routedStreamText(
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

    const latencyMs = Date.now() - start
    
    log.info('Chat response generated', {
      correlationId,
      provider: result.routingDecision.provider,
      latencyMs,
    })
    
    metrics.recordLatency('chat.response.latency', latencyMs)
    metrics.increment('chat.success')
    
    return result
  } catch (error: any) {
    const latencyMs = Date.now() - start
    
    log.error('Chat response failed', {
      correlationId,
      route: 'chat',
      latencyMs,
      errorMessage: error.message,
      errorCode: 'LLM_GATEWAY_ERROR',
    })
    
    metrics.increment('chat.error')
    
    throw new Error(`LLM request failed: ${error.message}`)
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
