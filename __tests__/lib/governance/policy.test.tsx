/**
 * Tests for Governance Policy System
 */

import { describe, it, expect } from 'vitest'
import { GovernanceChecker } from '@/lib/governance/policy'
import type { AIProposal } from '@/lib/types/personalization'

describe('GovernanceChecker', () => {
  const mockProposal: AIProposal = {
    id: '1',
    proposalType: 'ux_change',
    title: 'Test Proposal',
    description: 'Test description',
    expectedBenefit: 'Test benefit',
    impactLevel: 'medium',
    proposedChanges: { type: 'add_navigation_shortcut' },
    aiReasoning: 'Test reasoning',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  const mockContext = {
    userId: 'test-user',
    currentPreferences: {},
    userHistory: {
      favoriteFeatures: [],
      usagePatterns: {},
      preferredSages: [],
      avoidedFeatures: [],
      peakActivityHours: [],
    },
    platformConfig: {},
  }

  describe('checkProposal', () => {
    it('should approve valid proposals', async () => {
      const result = await GovernanceChecker.checkProposal(mockProposal, mockContext)
      expect(result.approved).toBe(true)
      expect(result.violations).toHaveLength(0)
    })

    it('should block proposals with security violations', async () => {
      const maliciousProposal = {
        ...mockProposal,
        proposedChanges: { type: 'execute_script', script: 'alert("XSS")' }
      }
      const result = await GovernanceChecker.checkProposal(maliciousProposal, mockContext)
      expect(result.approved).toBe(false)
    })
  })

  describe('sanitizeProposal', () => {
    it('should remove script tags from proposals', () => {
      const unsafeProposal = {
        ...mockProposal,
        description: 'Test <script>alert("XSS")</script> description'
      }
      const sanitized = GovernanceChecker.sanitizeProposal(unsafeProposal)
      expect(sanitized.description).not.toContain('<script>')
    })
  })
})
