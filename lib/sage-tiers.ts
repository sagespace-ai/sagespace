/**
 * Sage Tiering System with Cost-Level Awareness
 * Enforces Charter: Core Sages use Groq-only, Premium Sages can use HF
 */

import type { AccessLevel } from './ai/model-registry'

export type SageTier = 'core' | 'extended' | 'experimental' | 'premium'
export type SageCostLevel = 'free' | 'low' | 'medium' | 'premium'

export interface SageTierConfig {
  tier: SageTier
  displayName: string
  description: string
  costLevel: SageCostLevel
  allowedProviders: ('groq' | 'vercel-gateway' | 'huggingface')[]
  requiresAccessLevel: AccessLevel
  features: {
    streaming: boolean
    reasoning: boolean
    multimodal: boolean
    customInstructions: boolean
    memoryEnabled: boolean
    councilVoting: boolean
  }
  limits: {
    maxMessagesPerDay: number
    maxTokensPerMessage: number
    maxConcurrentSessions: number
  }
}

/**
 * Sage Tier Definitions per Charter Addendum
 */
export const SAGE_TIERS: Record<SageTier, SageTierConfig> = {
  core: {
    tier: 'core',
    displayName: 'Core Sages',
    description: 'Free, Groq-powered Sages available to all users',
    costLevel: 'free',
    allowedProviders: ['groq'],
    requiresAccessLevel: 'free',
    features: {
      streaming: true,
      reasoning: true,
      multimodal: false,
      customInstructions: false,
      memoryEnabled: true,
      councilVoting: true
    },
    limits: {
      maxMessagesPerDay: 100,
      maxTokensPerMessage: 4096,
      maxConcurrentSessions: 3
    }
  },
  
  extended: {
    tier: 'extended',
    displayName: 'Extended Sages',
    description: 'Enhanced Sages with Gateway fallback (Explorer+)',
    costLevel: 'low',
    allowedProviders: ['groq', 'vercel-gateway'],
    requiresAccessLevel: 'explorer',
    features: {
      streaming: true,
      reasoning: true,
      multimodal: false,
      customInstructions: true,
      memoryEnabled: true,
      councilVoting: true
    },
    limits: {
      maxMessagesPerDay: 500,
      maxTokensPerMessage: 8192,
      maxConcurrentSessions: 5
    }
  },
  
  experimental: {
    tier: 'experimental',
    displayName: 'Experimental Sages',
    description: 'Beta features, Groq-only (Voyager+)',
    costLevel: 'free',
    allowedProviders: ['groq'],
    requiresAccessLevel: 'voyager',
    features: {
      streaming: true,
      reasoning: true,
      multimodal: false,
      customInstructions: true,
      memoryEnabled: true,
      councilVoting: true
    },
    limits: {
      maxMessagesPerDay: 1000,
      maxTokensPerMessage: 16384,
      maxConcurrentSessions: 10
    }
  },
  
  premium: {
    tier: 'premium',
    displayName: 'Premium Sages',
    description: 'Multimodal HF models (Oracle+)',
    costLevel: 'premium',
    allowedProviders: ['groq', 'vercel-gateway', 'huggingface'],
    requiresAccessLevel: 'oracle',
    features: {
      streaming: true,
      reasoning: true,
      multimodal: true,
      customInstructions: true,
      memoryEnabled: true,
      councilVoting: true
    },
    limits: {
      maxMessagesPerDay: -1, // Unlimited
      maxTokensPerMessage: 32768,
      maxConcurrentSessions: -1 // Unlimited
    }
  }
}

/**
 * Check if user can access a Sage tier
 */
export function canAccessSageTier(
  sageTier: SageTier,
  userAccessLevel: AccessLevel
): boolean {
  const tierConfig = SAGE_TIERS[sageTier]
  const accessLevels: AccessLevel[] = ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial']
  const requiredIndex = accessLevels.indexOf(tierConfig.requiresAccessLevel)
  const userIndex = accessLevels.indexOf(userAccessLevel)
  return userIndex >= requiredIndex
}

/**
 * Get available Sage tiers for user
 */
export function getAvailableSageTiers(userAccessLevel: AccessLevel): SageTierConfig[] {
  return Object.values(SAGE_TIERS).filter(tier => 
    canAccessSageTier(tier.tier, userAccessLevel)
  )
}

/**
 * Get cost estimate for Sage interaction
 */
export function estimateSageCost(
  sageTier: SageTier,
  messageCount: number,
  avgTokensPerMessage: number
): number {
  const tierConfig = SAGE_TIERS[sageTier]
  
  // Groq is always free
  if (tierConfig.allowedProviders.includes('groq') && !tierConfig.allowedProviders.includes('huggingface')) {
    return 0
  }
  
  // Gateway fallback has minimal cost
  if (tierConfig.costLevel === 'low') {
    return (messageCount * avgTokensPerMessage / 1000000) * 0.15 // $0.15 per M tokens
  }
  
  // Premium tier HF models
  if (tierConfig.costLevel === 'premium') {
    return (messageCount * avgTokensPerMessage / 1000000) * 0.5 // $0.50 per M tokens
  }
  
  return 0
}
