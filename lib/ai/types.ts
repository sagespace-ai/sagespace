/**
 * Charter-Compliant AI Types
 * Single source of truth for all AI/ML type definitions in SageSpace
 */

// ===== Provider & Model Types =====

export type ModelProvider = 'groq' | 'vercel-gateway' | 'huggingface'

export type AccessLevel = 'free' | 'explorer' | 'voyager' | 'astral' | 'oracle' | 'celestial'

export type InferenceMode = 'groq-fast' | 'gateway-fallback' | 'premium-multimodal'

export type Capability = 
  | 'chat' 
  | 'council' 
  | 'summarization' 
  | 'embedding' 
  | 'vision' 
  | 'audio'

// ===== Model Registry Types =====

export interface ModelMetadata {
  id: string
  provider: ModelProvider
  costPerToken: number
  latencyMs: number
  capabilities: Capability[]
  accessLevel: AccessLevel[]
  enabled: boolean
  governanceApproved: boolean
  requiresPremium: boolean
}

export interface ModelRegistry {
  [modelId: string]: ModelMetadata
}

// ===== Routing Types =====

export interface RoutingContext {
  capability: Capability
  userAccessLevel: AccessLevel
  maxCostPerCall?: number
  preferredProvider?: ModelProvider
  featureFlags?: Record<string, boolean>
}

export interface RoutingDecision {
  modelId: string
  provider: string
  reasoning: string
  estimatedCost: number
  charterCompliant: boolean
}

// ===== Council Types =====

export interface CouncilPerspective {
  sageName: string
  perspective: string
  reasoning: string
}

export interface CouncilResponse {
  perspectives: CouncilPerspective[]
  synthesis: string
  confidence: number
  routingDecision: RoutingDecision
}

// ===== Memory Types =====

export interface MemoryConfig {
  userAccessLevel: AccessLevel
  enableEmbeddings: boolean
  maxConversations: number
  ttlDays: number
  autoCompress: boolean
  compressionThreshold: number
}

export interface ConversationSummary {
  conversationId: string
  summary: string
  tokenCount: number
  createdAt: Date
}

// ===== Sage Tier Types =====

export type SageTier = 'core' | 'extended' | 'experimental' | 'premium'

export interface SageTierConfig {
  tier: SageTier
  displayName: string
  description: string
  minAccessLevel: AccessLevel
  allowedProviders: ModelProvider[]
  maxTokensPerRequest: number
  dailyLimit: number
  costEstimate: number
}

// ===== Observability Types =====

export interface AIMetrics {
  provider: ModelProvider
  modelId: string
  capability: Capability
  latencyMs: number
  tokenCount: number
  cost: number
  userAccessLevel: AccessLevel
  timestamp: Date
  success: boolean
  error?: string
}

// ===== Health Check Types =====

export interface HealthCheckResponse {
  provider: ModelProvider
  ok: boolean
  latencyMs: number
  tier: SageTier
  charterAligned: boolean
  timestamp: Date
}
