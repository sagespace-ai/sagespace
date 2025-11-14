/**
 * Proposal Scoring Model
 * Calculates priority scores for AI-generated proposals
 * 
 * Formula: 0.3*impact + 0.25*likelihood + 0.2*userFit + 0.15*novelty + 0.1*effortInverse
 */

import type { AIProposal } from '@/lib/types/personalization'
import type { ObservabilityEvent } from './observability'

export interface UserPattern {
  frequentPages: Array<{ page: string; visitRate: number }>
  preferredSages: string[]
  commonTransitions: Array<{ fromPage: string; toPage: string; count: number }>
  frictionPoints: Array<{ page: string; component: string; count: number }>
  successPatterns: Array<{ action: string; page: string; count: number }>
}

export interface SemanticProfile {
  dominantTopics: string[]
  preferredMoods: string[]
  sageAffinities: string[]
  queryComplexity: 'simple' | 'moderate' | 'complex'
  averageSessionLength: number
}

export class ProposalScoring {
  /**
   * Calculate final score for a proposal
   * Score range: 0-100
   * Threshold for approval: >= 50
   */
  calculate(
    proposal: AIProposal,
    patterns: UserPattern,
    semantics: SemanticProfile
  ): number {
    const impact = this.scoreImpact(proposal)
    const likelihood = this.scoreLikelihood(proposal, patterns)
    const userFit = this.scoreUserFit(proposal, semantics, patterns)
    const novelty = this.scoreNovelty(proposal)
    const effort = this.scoreEffort(proposal)

    const finalScore = (
      0.3 * impact +
      0.25 * likelihood +
      0.2 * userFit +
      0.15 * novelty +
      0.1 * (100 - effort) // Inverse effort: easier = higher score
    )

    console.log('[Scoring]', proposal.title, {
      impact,
      likelihood,
      userFit,
      novelty,
      effort,
      final: Math.round(finalScore)
    })

    return Math.round(finalScore)
  }

  /**
   * Score impact: Does it solve a real problem or add significant value?
   */
  private scoreImpact(proposal: AIProposal): number {
    const { impactLevel, proposalType } = proposal

    // Base score from declared impact level
    const impactScores = {
      low: 40,
      medium: 70,
      high: 95
    }
    let score = impactScores[impactLevel] || 50

    // Boost for high-value proposal types
    if (proposalType === 'sage_recommendation') score += 10
    if (proposalType === 'feature_toggle') score += 5
    
    // Boost for error prevention and performance
    if (proposal.proposedChanges?.type === 'error_prevention') score += 15
    if (proposal.proposedChanges?.type === 'performance_optimization') score += 10

    return Math.min(score, 100)
  }

  /**
   * Score likelihood: How likely is the user to actually use this feature?
   */
  private scoreLikelihood(proposal: AIProposal, patterns: UserPattern): number {
    const changes = proposal.proposedChanges

    // For navigation shortcuts, check if user frequently makes that transition
    if (changes?.type === 'add_navigation_shortcut') {
      const transition = patterns.commonTransitions.find(
        t => t.fromPage === changes.fromPage && t.toPage === changes.toPage
      )
      if (transition) {
        // High likelihood if they do this transition often
        const rate = transition.count / patterns.commonTransitions.reduce((sum, t) => sum + t.count, 1)
        return Math.min(rate * 200, 100) // Scale up
      }
      return 30 // Low if not in patterns
    }

    // For sage recommendations, check if those sages are in preferred list
    if (changes?.type === 'add_sage_favorites') {
      const recommendedSages = changes.sageNames || []
      const matchCount = recommendedSages.filter(sage => 
        patterns.preferredSages.includes(sage)
      ).length
      return (matchCount / recommendedSages.length) * 100
    }

    // For page-specific changes, check page visit frequency
    if (changes?.page) {
      const pageVisit = patterns.frequentPages.find(p => p.page === changes.page)
      if (pageVisit) {
        return pageVisit.visitRate * 100
      }
      return 20 // Low likelihood if rarely visited
    }

    // Default: moderate likelihood
    return 60
  }

  /**
   * Score user fit: Does this align with user's behavior and preferences?
   */
  private scoreUserFit(
    proposal: AIProposal,
    semantics: SemanticProfile,
    patterns: UserPattern
  ): number {
    let score = 50 // Base score

    // If proposal addresses a friction point, high fit
    const changeType = proposal.proposedChanges?.type
    if (changeType === 'error_prevention') {
      const errorPage = proposal.proposedChanges?.page
      const hasFriction = patterns.frictionPoints.some(f => f.page === errorPage)
      if (hasFriction) score += 30
    }

    // If proposal relates to frequently used features, high fit
    if (changeType === 'add_navigation_shortcut') {
      const targetPage = proposal.proposedChanges?.toPage
      const isFrequent = patterns.frequentPages.some(p => p.page === targetPage)
      if (isFrequent) score += 20
    }

    // If proposal matches sage affinities
    if (changeType === 'add_sage_favorites' || changeType === 'suggest_persona_creation') {
      const hasAffinity = semantics.sageAffinities.length > 0
      if (hasAffinity) score += 25
    }

    // If proposal improves a success pattern
    const successPage = proposal.proposedChanges?.page
    const hasSuccess = patterns.successPatterns.some(s => s.page === successPage)
    if (hasSuccess) score += 15

    return Math.min(score, 100)
  }

  /**
   * Score novelty: Is this a fresh suggestion or repetitive?
   */
  private scoreNovelty(proposal: AIProposal): number {
    // TODO: In production, check against proposal history
    // For now, assume all proposals are novel
    // Real implementation would:
    // 1. Check if similar proposal was rejected recently
    // 2. Check if proposal was already implemented
    // 3. Lower score for duplicate suggestions
    
    return 80 // Default: reasonably novel
  }

  /**
   * Score effort: How complex is this to implement?
   * Lower effort = higher score (inverted in final formula)
   */
  private scoreEffort(proposal: AIProposal): number {
    const changeType = proposal.proposedChanges?.type

    // Simple changes
    if (changeType === 'add_navigation_shortcut') return 15
    if (changeType === 'reposition_component') return 20
    if (changeType === 'adjust_component_layout') return 25
    if (changeType === 'enhance_cta') return 20
    if (changeType === 'adjust_background') return 10

    // Moderate complexity
    if (changeType === 'add_sage_favorites') return 30
    if (changeType === 'add_memory_filter') return 35
    if (changeType === 'update_onboarding') return 40

    // Higher complexity
    if (changeType === 'add_studio_templates') return 50
    if (changeType === 'suggest_persona_creation') return 55
    if (changeType === 'error_prevention') return 45
    if (changeType === 'performance_optimization') return 60

    return 40 // Default: moderate effort
  }
}
