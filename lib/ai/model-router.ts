/**
 * Model Router - Charter-compliant intelligent model selection
 * Groq-first routing with fallback to Gateway, HF gated behind premium
 * Prevents unexpected cost spikes and enforces governance
 */

import { generateText, streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import type { AccessLevel, Capability, ModelMetadata } from './types'
import { 
  getModelMetadata, 
  isModelAvailable, 
  getDefaultModelForCapability,
} from './model-registry'
import { log, generateCorrelationId } from '@/lib/monitoring/logging'
import { metrics, checkSloViolation } from '@/lib/monitoring/metrics'
import { circuitBreakers } from '@/lib/monitoring/circuit-breaker'

// Initialize providers
const groq = createGroq({
  apiKey: process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY,
})

export interface RoutingContext {
  userAccessLevel: AccessLevel
  featureFlags?: Record<string, boolean>
  preferredProvider?: 'groq' | 'vercel-gateway' | 'huggingface'
  capability?: Capability // Use centralized Capability type
  costLimit?: number // Max cost per million tokens in USD
  maxCostPerCall?: number // Alias for backwards compatibility
}

export interface RoutingDecision {
  modelId: string
  provider: string
  reasoning: string
  estimatedCost: number
  fallbackUsed: boolean
}

/**
 * Route to the optimal model based on context and Charter rules
 * ALWAYS prefers Groq unless explicitly overridden by premium features
 */
export async function routeModel(context: RoutingContext): Promise<RoutingDecision> {
  const start = Date.now()
  const correlationId = generateCorrelationId()
  
  log.info('Model routing started', {
    correlationId,
    route: 'model-router',
    userAccessLevel: context.userAccessLevel,
    capability: context.capability,
  })

  const {
    userAccessLevel,
    featureFlags = {},
    preferredProvider,
    capability = 'chat',
    costLimit = context.maxCostPerCall ?? Infinity // Support both costLimit and maxCostPerCall
  } = context

  // Step 1: Try preferred provider if specified
  if (preferredProvider) {
    const model = getDefaultModelForCapability(capability, userAccessLevel)
    if (model && model.provider === preferredProvider) {
      const availability = isModelAvailable(model.id, userAccessLevel, featureFlags)
      if (availability.available && model.costEstimatePerMToken <= costLimit) {
        return {
          modelId: model.id,
          provider: model.provider,
          reasoning: `User preferred ${preferredProvider}`,
          estimatedCost: model.costEstimatePerMToken,
          fallbackUsed: false
        }
      }
    }
  }

  // Step 2: Default to Groq (Charter compliance)
  const groqModel = getDefaultModelForCapability(capability, userAccessLevel)
  if (groqModel && groqModel.provider === 'groq') {
    const latencyMs = Date.now() - start
    
    log.info('Model routed to Groq', {
      correlationId,
      provider: 'groq',
      model: groqModel.id,
      latencyMs,
    })
    
    metrics.increment('router.groq.success')
    metrics.recordLatency('router.latency', latencyMs)
    
    return {
      modelId: groqModel.id,
      provider: 'groq',
      reasoning: 'Groq selected per Charter (zero-cost, ultra-fast)',
      estimatedCost: 0,
      fallbackUsed: false
    }
  }

  // Step 3: Fallback to Vercel AI Gateway
  const gatewayModel = getModelMetadata('vercel-gateway/gpt-4o-mini')
  if (gatewayModel && gatewayModel.costEstimatePerMToken <= costLimit) {
    const availability = isModelAvailable(gatewayModel.id, userAccessLevel, featureFlags)
    if (availability.available) {
      return {
        modelId: gatewayModel.id,
        provider: 'vercel-gateway',
        reasoning: 'Groq unavailable, fallback to Gateway (low-cost)',
        estimatedCost: gatewayModel.costEstimatePerMToken,
        fallbackUsed: true
      }
    }
  }

  // Step 4: Premium fallback (HF) only if explicitly enabled
  if (featureFlags['ENABLE_HUGGINGFACE'] && userAccessLevel !== 'free' && userAccessLevel !== 'explorer') {
    const hfModels = Object.values(require('./model-registry').MODEL_REGISTRY)
      .filter((m: ModelMetadata) => 
        m.provider === 'huggingface' && 
        m.capabilities[capability] &&
        m.costEstimatePerMToken <= costLimit
      )
    
    if (hfModels.length > 0) {
      const hfModel = hfModels[0]
      return {
        modelId: hfModel.id,
        provider: 'huggingface',
        reasoning: 'Premium HF model (monetization justified)',
        estimatedCost: hfModel.costEstimatePerMToken,
        fallbackUsed: true
      }
    }
  }

  // Step 5: No models available
  const error = new Error(
    `No models available for capability: ${capability}, access level: ${userAccessLevel}`
  )
  
  log.error('Model routing failed', {
    correlationId,
    errorMessage: error.message,
    capability,
    userAccessLevel,
  })
  
  metrics.increment('router.errors')
  
  throw error
}

/**
 * Generate text with automatic model routing
 */
export async function routedGenerateText(
  prompt: string,
  context: RoutingContext,
  options?: {
    system?: string
    temperature?: number
    maxTokens?: number
  }
) {
  const start = Date.now()
  const correlationId = generateCorrelationId()
  
  const provider = context.preferredProvider || 'groq'
  const breaker = circuitBreakers[provider as keyof typeof circuitBreakers]
  
  if (!breaker) {
    throw new Error(`No circuit breaker for provider: ${provider}`)
  }
  
  try {
    const result = await breaker.execute(async () => {
      const decision = await routeModel(context)
      
      log.info('Generating text', {
        correlationId,
        provider: decision.provider,
        model: decision.modelId,
        promptLength: prompt.length,
      })
      
      // Map provider to actual model instance
      let modelInstance
      if (decision.provider === 'groq') {
        modelInstance = groq(decision.modelId.replace('groq/', ''))
      } else if (decision.provider === 'vercel-gateway') {
        modelInstance = decision.modelId
      } else {
        throw new Error(`Provider ${decision.provider} not yet implemented`)
      }

      const textResult = await generateText({
        model: modelInstance,
        prompt,
        system: options?.system,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens
      })

      const latencyMs = Date.now() - start
      
      log.info('Text generated successfully', {
        correlationId,
        provider: decision.provider,
        latencyMs,
        tokenEstimate: textResult.text.length / 4, // rough estimate
      })
      
      metrics.recordLatency(`ai.${decision.provider}.latency`, latencyMs)
      metrics.increment(`ai.${decision.provider}.success`)
      
      const sloViolated = checkSloViolation('playground.chat.latency', latencyMs)
      if (sloViolated) {
        log.warn('SLO violation detected', {
          correlationId,
          metric: 'playground.chat.latency',
          value: latencyMs,
          threshold: 3000,
        })
      }

      return {
        ...textResult,
        routingDecision: decision
      }
    })
    
    return result
  } catch (error: any) {
    const latencyMs = Date.now() - start
    
    log.error('Text generation failed', {
      correlationId,
      provider,
      latencyMs,
      errorMessage: error.message,
    })
    
    metrics.increment(`ai.${provider}.error`)
    
    throw error
  }
}

/**
 * Stream text with automatic model routing
 */
export async function routedStreamText(
  prompt: string,
  context: RoutingContext,
  options?: {
    system?: string
    temperature?: number
    maxTokens?: number
  }
) {
  const start = Date.now()
  const correlationId = generateCorrelationId()
  
  const provider = context.preferredProvider || 'groq'
  const breaker = circuitBreakers[provider as keyof typeof circuitBreakers]
  
  if (!breaker) {
    throw new Error(`No circuit breaker for provider: ${provider}`)
  }
  
  try {
    const result = await breaker.execute(async () => {
      const decision = await routeModel(context)
      
      log.info('Streaming text', {
        correlationId,
        provider: decision.provider,
        model: decision.modelId,
        promptLength: prompt.length,
      })
      
      // Map provider to actual model instance
      let modelInstance
      if (decision.provider === 'groq') {
        modelInstance = groq(decision.modelId.replace('groq/', ''))
      } else if (decision.provider === 'vercel-gateway') {
        modelInstance = decision.modelId
      } else {
        throw new Error(`Provider ${decision.provider} not yet implemented`)
      }

      const streamResult = await streamText({
        model: modelInstance,
        prompt,
        system: options?.system,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens
      })

      const latencyMs = Date.now() - start
      
      log.info('Text streamed successfully', {
        correlationId,
        provider: decision.provider,
        latencyMs,
        tokenEstimate: streamResult.text.length / 4, // rough estimate
      })
      
      metrics.recordLatency(`ai.${decision.provider}.latency`, latencyMs)
      metrics.increment(`ai.${decision.provider}.success`)
      
      const sloViolated = checkSloViolation('playground.chat.latency', latencyMs)
      if (sloViolated) {
        log.warn('SLO violation detected', {
          correlationId,
          metric: 'playground.chat.latency',
          value: latencyMs,
          threshold: 3000,
        })
      }

      return {
        ...streamResult,
        routingDecision: decision
      }
    })
    
    return result
  } catch (error: any) {
    const latencyMs = Date.now() - start
    
    log.error('Text streaming failed', {
      correlationId,
      provider,
      latencyMs,
      errorMessage: error.message,
    })
    
    metrics.increment(`ai.${provider}.error`)
    
    throw error
  }
}

/**
 * Get routing decision without executing (for UI display)
 */
export async function previewRouting(context: RoutingContext): Promise<RoutingDecision> {
  return routeModel(context)
}
