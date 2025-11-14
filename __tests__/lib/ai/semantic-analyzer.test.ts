/**
 * Tests for Semantic Analyzer
 */

import { describe, it, expect } from 'vitest'
import { SemanticAnalyzer } from '@/lib/ai/semantic-analyzer'

describe('SemanticAnalyzer', () => {
  describe('classifyComplexity', () => {
    it('should classify short queries as simple', () => {
      const events = [
        { metadata: { query: 'hello' }, eventType: 'query', createdAt: new Date().toISOString() },
        { metadata: { query: 'test' }, eventType: 'query', createdAt: new Date().toISOString() },
      ]
      const complexity = SemanticAnalyzer.classifyComplexity(events as any)
      expect(complexity).toBe('simple')
    })

    it('should classify long queries as complex', () => {
      const events = [
        { 
          metadata: { query: 'This is a very long and complex query that contains many words and detailed information about a specific topic that requires comprehensive analysis' },
          eventType: 'query',
          createdAt: new Date().toISOString()
        },
      ]
      const complexity = SemanticAnalyzer.classifyComplexity(events as any)
      expect(complexity).toBe('complex')
    })
  })

  describe('calculateSemanticDrift', () => {
    it('should return 100 for identical topics', () => {
      const oldTopics = ['coding', 'design', 'AI']
      const newTopics = ['coding', 'design', 'AI']
      const drift = SemanticAnalyzer.calculateSemanticDrift(oldTopics, newTopics)
      expect(drift).toBe(100)
    })

    it('should return 0 for completely different topics', () => {
      const oldTopics = ['coding', 'design', 'AI']
      const newTopics = ['cooking', 'music', 'sports']
      const drift = SemanticAnalyzer.calculateSemanticDrift(oldTopics, newTopics)
      expect(drift).toBe(0)
    })

    it('should return 50 for neutral case', () => {
      const drift = SemanticAnalyzer.calculateSemanticDrift([], [])
      expect(drift).toBe(50)
    })
  })
})
