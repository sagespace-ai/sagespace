/**
 * Semantic Analyzer for Dreamer v2
 * Analyzes user queries and interactions to understand topic preferences
 * Uses AI to classify and cluster semantic patterns
 */

import { generateChatResponseSync } from '@/lib/ai-client'
import type { ObservabilityEvent } from './observability'

export interface SemanticAnalysis {
  dominantTopics: string[]
  topicClusters: Record<string, number>
  queryComplexity: 'simple' | 'moderate' | 'complex'
  semanticDrift: number // How much user's interests are changing
}

export class SemanticAnalyzer {
  /**
   * Analyze topics from user queries and interactions
   */
  static async analyzeTopics(events: ObservabilityEvent[]): Promise<string[]> {
    // Extract text from events (queries, page names, interactions)
    const textSamples = events
      .filter(e => e.metadata?.query || e.actionName)
      .map(e => e.metadata?.query || e.actionName || '')
      .filter(text => text.length > 5)
      .slice(0, 50) // Analyze last 50 interactions

    if (textSamples.length < 5) {
      return []
    }

    try {
      const prompt = `Analyze these user interactions and identify the 3-5 dominant topics or themes. Return ONLY a JSON array of topic strings.

Interactions:
${textSamples.join('\n')}

Return format: ["topic1", "topic2", "topic3"]`

      const result = await generateChatResponseSync({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        maxTokens: 200,
      })

      const jsonMatch = result.text.match(/\[[\s\S]*?\]/)
      if (jsonMatch) {
        const topics = JSON.parse(jsonMatch[0])
        return topics.slice(0, 5)
      }

      return []
    } catch (error) {
      console.error('[SemanticAnalyzer] Error analyzing topics:', error)
      return []
    }
  }

  /**
   * Classify query complexity based on length and structure
   */
  static classifyComplexity(events: ObservabilityEvent[]): 'simple' | 'moderate' | 'complex' {
    const queries = events
      .filter(e => e.metadata?.query)
      .map(e => e.metadata!.query)

    if (queries.length === 0) return 'moderate'

    const avgLength = queries.reduce((sum, q) => sum + q.length, 0) / queries.length
    const avgWords = queries.reduce((sum, q) => sum + q.split(' ').length, 0) / queries.length

    // Simple: short queries, few words
    if (avgLength < 50 && avgWords < 8) return 'simple'
    
    // Complex: long queries, many words
    if (avgLength > 150 || avgWords > 20) return 'complex'
    
    // Moderate: everything else
    return 'moderate'
  }

  /**
   * Calculate how quickly user's interests are changing
   * Returns 0-100 where 100 = very stable, 0 = constantly changing
   */
  static calculateSemanticDrift(oldTopics: string[], newTopics: string[]): number {
    if (oldTopics.length === 0 || newTopics.length === 0) {
      return 50 // Neutral if insufficient data
    }

    const overlap = oldTopics.filter(topic => newTopics.includes(topic)).length
    const stability = (overlap / Math.max(oldTopics.length, newTopics.length)) * 100

    return Math.round(stability)
  }

  /**
   * Group topics into meaningful clusters
   */
  static clusterTopics(topics: string[]): Record<string, number> {
    const clusters: Record<string, number> = {}

    // Simple frequency-based clustering
    for (const topic of topics) {
      const normalized = topic.toLowerCase().trim()
      clusters[normalized] = (clusters[normalized] || 0) + 1
    }

    return clusters
  }

  /**
   * Perform comprehensive semantic analysis
   */
  static async analyze(
    events: ObservabilityEvent[],
    previousTopics: string[] = []
  ): Promise<SemanticAnalysis> {
    const dominantTopics = await this.analyzeTopics(events)
    const topicClusters = this.clusterTopics(dominantTopics)
    const queryComplexity = this.classifyComplexity(events)
    const semanticDrift = this.calculateSemanticDrift(previousTopics, dominantTopics)

    return {
      dominantTopics,
      topicClusters,
      queryComplexity,
      semanticDrift,
    }
  }
}
