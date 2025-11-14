/**
 * Tests for Proposal Scoring Model
 */

import { describe, it, expect } from 'vitest'
import { ProposalScoring } from '@/lib/ai/scoring'
import type { AIProposal } from '@/lib/types/personalization'

describe('ProposalScoring', () => {
  const scoring = new ProposalScoring()

  const mockPattern = {
    frequentPages: [{ page: '/playground', visitRate: 0.4 }],
    preferredSages: ['Sage1'],
    commonTransitions: [{ fromPage: '/demo', toPage: '/playground', count: 10 }],
    frictionPoints: [],
    successPatterns: [],
  }

  const mockSemantics = {
    dominantTopics: ['coding', 'AI'],
    preferredMoods: ['focused'],
    sageAffinities: ['Sage1'],
    queryComplexity: 'moderate' as const,
    averageSessionLength: 15,
  }

  describe('calculate', () => {
    it('should score high-impact proposals highly', () => {
      const proposal: AIProposal = {
        id: '1',
        proposalType: 'ux_change',
        title: 'Test',
        description: 'Test',
        expectedBenefit: 'Test',
        impactLevel: 'high',
        proposedChanges: { type: 'error_prevention' },
        aiReasoning: 'Test',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      const score = scoring.calculate(proposal, mockPattern, mockSemantics)
      expect(score).toBeGreaterThan(60)
    })

    it('should score low-impact proposals lower', () => {
      const proposal: AIProposal = {
        id: '1',
        proposalType: 'ux_change',
        title: 'Test',
        description: 'Test',
        expectedBenefit: 'Test',
        impactLevel: 'low',
        proposedChanges: {},
        aiReasoning: 'Test',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      const score = scoring.calculate(proposal, mockPattern, mockSemantics)
      expect(score).toBeLessThan(70)
    })

    it('should boost score for navigation shortcuts matching patterns', () => {
      const proposal: AIProposal = {
        id: '1',
        proposalType: 'ux_change',
        title: 'Add shortcut',
        description: 'Test',
        expectedBenefit: 'Test',
        impactLevel: 'medium',
        proposedChanges: { 
          type: 'add_navigation_shortcut',
          fromPage: '/demo',
          toPage: '/playground'
        },
        aiReasoning: 'Test',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      const score = scoring.calculate(proposal, mockPattern, mockSemantics)
      expect(score).toBeGreaterThan(50)
    })
  })
})
