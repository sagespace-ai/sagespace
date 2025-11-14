/**
 * Conversation Manager with Cost Optimization
 * Implements Charter-compliant memory management
 */

import { createServerClient } from '../supabase/server'
import { getMemoryConfig, shouldCompress, getExpiryDate } from './cost-optimizer'
import type { AccessLevel } from '../ai/model-registry'
import { routedGenerateText } from '../ai/model-router'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  userId: string
  title: string
  messages: Message[]
  compressed: boolean
  compressionSummary?: string
  messageCount: number
  expiresAt?: Date
}

/**
 * Create new conversation with TTL
 */
export async function createConversation(
  userId: string,
  title: string,
  accessLevel: AccessLevel
): Promise<string> {
  const supabase = await createServerClient()
  const config = getMemoryConfig(accessLevel)
  const expiresAt = getExpiryDate(config)
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title,
      expires_at: expiresAt,
      embeddings_enabled: config.enableEmbeddings
    })
    .select('id')
    .single()
  
  if (error) throw error
  
  console.log('[v0] [Memory] Created conversation with TTL:', {
    conversationId: data.id,
    expiresAt,
    ttlDays: config.ttlDays
  })
  
  return data.id
}

/**
 * Add message to conversation with auto-compression
 */
export async function addMessage(
  conversationId: string,
  message: Message,
  accessLevel: AccessLevel
): Promise<void> {
  const supabase = await createServerClient()
  const config = getMemoryConfig(accessLevel)
  
  // Insert message
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: message.role,
      content: message.content
    })
  
  if (error) throw error
  
  // Update message count
  const { data: conversation } = await supabase
    .from('conversations')
    .select('message_count, compressed')
    .eq('id', conversationId)
    .single()
  
  if (!conversation) return
  
  const newCount = (conversation.message_count || 0) + 1
  
  // Check if compression is needed
  if (shouldCompress(newCount, config) && !conversation.compressed) {
    await compressConversation(conversationId, accessLevel)
  }
  
  // Update count
  await supabase
    .from('conversations')
    .update({ message_count: newCount })
    .eq('id', conversationId)
  
  console.log('[v0] [Memory] Added message, count:', newCount)
}

/**
 * Compress conversation into summary
 */
async function compressConversation(
  conversationId: string,
  accessLevel: AccessLevel
): Promise<void> {
  const supabase = await createServerClient()
  
  // Get all messages
  const { data: messages } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (!messages || messages.length === 0) return
  
  console.log('[v0] [Memory] Compressing conversation with', messages.length, 'messages')
  
  // Generate summary using cost-aware routing
  const transcript = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n\n')
  
  const result = await routedGenerateText(
    transcript,
    {
      userAccessLevel: accessLevel,
      capability: 'chat',
      costLimit: 0 // Free tier only
    },
    {
      system: 'Summarize this conversation in 2-3 sentences, capturing key topics and outcomes.',
      maxTokens: 150,
      temperature: 0.5
    }
  )
  
  // Store summary and mark as compressed
  await supabase
    .from('conversations')
    .update({
      compressed: true,
      compression_summary: result.text
    })
    .eq('id', conversationId)
  
  // Delete old messages, keep only last 10
  const keepIds = messages.slice(-10).map(m => m.id)
  await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId)
    .not('id', 'in', `(${keepIds.join(',')})`)
  
  console.log('[v0] [Memory] Compressed conversation, kept', keepIds.length, 'recent messages')
}

/**
 * Clean up expired conversations
 */
export async function cleanupExpiredConversations(): Promise<number> {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .rpc('cleanup_expired_conversations')
  
  const deletedCount = data || 0
  
  if (deletedCount > 0) {
    console.log('[v0] [Memory] Cleaned up', deletedCount, 'expired conversations')
  }
  
  return deletedCount
}
