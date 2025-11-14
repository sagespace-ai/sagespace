/**
 * Memory Cost Optimization
 * Ensures memory operations use cost-efficient strategies per Charter Addendum
 * - Groq embeddings only (no HF unless premium)
 * - Summaries stored instead of raw transcripts
 * - TTL aging for stale conversations
 * - Only use embeddings when needed
 */

import type { AccessLevel } from '../ai/model-registry'

export interface MemoryConfig {
  userAccessLevel: AccessLevel
  enableEmbeddings: boolean
  maxStoredMessages: number
  ttlDays: number
  compressionThreshold: number // Messages before summarization
}

/**
 * Get memory configuration based on user tier (cost-aware)
 */
export function getMemoryConfig(userAccessLevel: AccessLevel): MemoryConfig {
  switch (userAccessLevel) {
    case 'free':
      return {
        userAccessLevel: 'free',
        enableEmbeddings: false, // No embeddings for free tier
        maxStoredMessages: 50,
        ttlDays: 7,
        compressionThreshold: 10
      }
    
    case 'explorer':
      return {
        userAccessLevel: 'explorer',
        enableEmbeddings: false, // Still no embeddings
        maxStoredMessages: 100,
        ttlDays: 14,
        compressionThreshold: 15
      }
    
    case 'voyager':
      return {
        userAccessLevel: 'voyager',
        enableEmbeddings: false, // No embeddings until Astral+
        maxStoredMessages: 200,
        ttlDays: 30,
        compressionThreshold: 20
      }
    
    case 'astral':
      return {
        userAccessLevel: 'astral',
        enableEmbeddings: true, // Enable embeddings for semantic search
        maxStoredMessages: 500,
        ttlDays: 60,
        compressionThreshold: 30
      }
    
    case 'oracle':
    case 'celestial':
      return {
        userAccessLevel,
        enableEmbeddings: true,
        maxStoredMessages: -1, // Unlimited
        ttlDays: -1, // No expiry
        compressionThreshold: 50
      }
  }
}

/**
 * Determine if a conversation needs compression
 */
export function shouldCompress(
  messageCount: number,
  config: MemoryConfig
): boolean {
  return messageCount >= config.compressionThreshold
}

/**
 * Determine if embeddings should be generated
 */
export function shouldGenerateEmbeddings(
  config: MemoryConfig,
  messageImportance: 'low' | 'medium' | 'high'
): boolean {
  // Never generate for free/explorer/voyager
  if (!config.enableEmbeddings) {
    return false
  }
  
  // For paid tiers, only generate for medium+ importance
  return messageImportance !== 'low'
}

/**
 * Calculate memory cost estimate
 */
export function estimateMemoryCost(
  messageCount: number,
  config: MemoryConfig,
  useEmbeddings: boolean
): number {
  // Groq embeddings are free
  if (!useEmbeddings || !config.enableEmbeddings) {
    return 0
  }
  
  // Even with embeddings enabled, Groq provides them for free
  // HF embeddings would cost ~$0.02 per M tokens but we don't use them
  return 0
}

/**
 * Get TTL expiry date
 */
export function getExpiryDate(config: MemoryConfig): Date | null {
  if (config.ttlDays === -1) {
    return null // No expiry
  }
  
  const now = new Date()
  now.setDate(now.getDate() + config.ttlDays)
  return now
}
