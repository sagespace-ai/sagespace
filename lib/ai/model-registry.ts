/**
 * Cost-Aware Model Registry
 * Single source of truth for all AI models with cost, latency, quality, and governance metadata
 * Ensures Charter compliance: Groq-first, zero-cost operation, HF gated behind premium
 */

import type { 
  ModelProvider, 
  AccessLevel, 
  Capability, 
  ModelMetadata, 
  ModelRegistry 
} from './types'

export * from './types' // Re-export for backwards compatibility

export const MODEL_REGISTRY: ModelRegistry = {
  // GROQ MODELS (PRIMARY - FREE TIER)
  'groq/llama-3.3-70b-versatile': {
    id: 'groq/llama-3.3-70b-versatile',
    provider: 'groq',
    displayName: 'Llama 3.3 70B (Groq Turbo)',
    description: 'Ultra-fast general purpose model, perfect for Playground and Council',
    costTier: 'free',
    costEstimatePerMToken: 0,
    latencyTier: 'ultra-fast',
    qualityTier: 'excellent',
    maxTokens: 8192,
    supportsStreaming: true,
    accessLevel: ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial'],
    governanceApproved: true,
    capabilities: {
      chat: true,
      embeddings: false,
      vision: false,
      audio: false,
      reasoning: true,
    }
  },
  
  'groq/mixtral-8x7b-32768': {
    id: 'groq/mixtral-8x7b-32768',
    provider: 'groq',
    displayName: 'Mixtral 8x7B (Groq Fast)',
    description: 'Lightning-fast reasoning model for Council deliberations',
    costTier: 'free',
    costEstimatePerMToken: 0,
    latencyTier: 'ultra-fast',
    qualityTier: 'high',
    maxTokens: 32768,
    supportsStreaming: true,
    accessLevel: ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial'],
    governanceApproved: true,
    capabilities: {
      chat: true,
      embeddings: false,
      vision: false,
      audio: false,
      reasoning: true,
    }
  },
  
  'groq/llama-3.1-8b-instant': {
    id: 'groq/llama-3.1-8b-instant',
    provider: 'groq',
    displayName: 'Llama 3.1 8B Instant',
    description: 'Ultra-low-latency model for real-time interactions',
    costTier: 'free',
    costEstimatePerMToken: 0,
    latencyTier: 'ultra-fast',
    qualityTier: 'good',
    maxTokens: 8192,
    supportsStreaming: true,
    accessLevel: ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial'],
    governanceApproved: true,
    capabilities: {
      chat: true,
      embeddings: false,
      vision: false,
      audio: false,
      reasoning: false,
    }
  },
  
  // VERCEL AI GATEWAY (FALLBACK - LOW COST)
  'vercel-gateway/gpt-4o-mini': {
    id: 'vercel-gateway/gpt-4o-mini',
    provider: 'vercel-gateway',
    displayName: 'GPT-4o Mini (Gateway)',
    description: 'Fallback model when Groq is unavailable',
    costTier: 'low',
    costEstimatePerMToken: 0.15,
    latencyTier: 'fast',
    qualityTier: 'excellent',
    maxTokens: 16384,
    supportsStreaming: true,
    accessLevel: ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial'],
    governanceApproved: true,
    capabilities: {
      chat: true,
      embeddings: false,
      vision: true,
      audio: false,
      reasoning: true,
    }
  },
  
  // HUGGINGFACE MODELS (PREMIUM-GATED, DISABLED BY DEFAULT)
  'huggingface/meta-llama/Llama-3.2-11B-Vision': {
    id: 'huggingface/meta-llama/Llama-3.2-11B-Vision',
    provider: 'huggingface',
    displayName: 'Llama 3.2 Vision (HF)',
    description: 'Vision-language model for image understanding (Premium only)',
    costTier: 'premium',
    costEstimatePerMToken: 0.5,
    latencyTier: 'standard',
    qualityTier: 'excellent',
    maxTokens: 4096,
    supportsStreaming: false,
    accessLevel: ['oracle', 'celestial'],
    requiresFeatureFlag: 'ENABLE_HUGGINGFACE',
    governanceApproved: false, // DISABLED BY DEFAULT per Charter
    capabilities: {
      chat: true,
      embeddings: false,
      vision: true,
      audio: false,
      reasoning: false,
    }
  },
  
  'huggingface/sentence-transformers/all-MiniLM-L6-v2': {
    id: 'huggingface/sentence-transformers/all-MiniLM-L6-v2',
    provider: 'huggingface',
    displayName: 'MiniLM Embeddings (HF)',
    description: 'Text embeddings for semantic search (Premium only)',
    costTier: 'premium',
    costEstimatePerMToken: 0.02,
    latencyTier: 'fast',
    qualityTier: 'high',
    maxTokens: 512,
    supportsStreaming: false,
    accessLevel: ['astral', 'oracle', 'celestial'],
    requiresFeatureFlag: 'ENABLE_HUGGINGFACE',
    governanceApproved: false, // DISABLED BY DEFAULT per Charter
    capabilities: {
      chat: false,
      embeddings: true,
      vision: false,
      audio: false,
      reasoning: false,
    }
  },
}

/**
 * Get model metadata by ID
 */
export function getModelMetadata(modelId: string): ModelMetadata | null {
  return MODEL_REGISTRY[modelId] || null
}

/**
 * Get all models available for a given access level
 */
export function getModelsForAccessLevel(accessLevel: AccessLevel): ModelMetadata[] {
  return Object.values(MODEL_REGISTRY).filter(model => 
    model.accessLevel.includes(accessLevel) && model.governanceApproved
  )
}

/**
 * Get all models by provider
 */
export function getModelsByProvider(provider: ModelProvider): ModelMetadata[] {
  return Object.values(MODEL_REGISTRY).filter(model => model.provider === provider)
}

/**
 * Get default model for a capability
 * Always prefers Groq models per Charter
 */
export function getDefaultModelForCapability(
  capability: keyof ModelMetadata['capabilities'],
  accessLevel: AccessLevel = 'free'
): ModelMetadata | null {
  const availableModels = getModelsForAccessLevel(accessLevel)
    .filter(model => model.capabilities[capability])
    .sort((a, b) => {
      // Prefer Groq (free) over others
      if (a.provider === 'groq' && b.provider !== 'groq') return -1
      if (a.provider !== 'groq' && b.provider === 'groq') return 1
      
      // Then by cost tier
      const costOrder = { free: 0, low: 1, medium: 2, premium: 3 }
      const costDiff = costOrder[a.costTier] - costOrder[b.costTier]
      if (costDiff !== 0) return costDiff
      
      // Then by latency
      const latencyOrder = { 'ultra-fast': 0, fast: 1, standard: 2, slow: 3 }
      return latencyOrder[a.latencyTier] - latencyOrder[b.latencyTier]
    })
  
  return availableModels[0] || null
}

/**
 * Check if a model is available for a user
 */
export function isModelAvailable(
  modelId: string,
  userAccessLevel: AccessLevel,
  featureFlags: Record<string, boolean> = {}
): { available: boolean; reason?: string } {
  const model = getModelMetadata(modelId)
  
  if (!model) {
    return { available: false, reason: 'Model not found' }
  }
  
  if (!model.governanceApproved) {
    return { available: false, reason: 'Model not approved by governance' }
  }
  
  if (!model.accessLevel.includes(userAccessLevel)) {
    return { available: false, reason: `Requires ${model.accessLevel[0]} tier or higher` }
  }
  
  if (model.requiresFeatureFlag && !featureFlags[model.requiresFeatureFlag]) {
    return { available: false, reason: 'Feature flag not enabled' }
  }
  
  return { available: true }
}
