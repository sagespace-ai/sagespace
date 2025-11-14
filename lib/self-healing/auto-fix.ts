/**
 * Self-Healing Auto-Fix System
 * Converts detected system issues into actionable Dreamer proposals
 */

import { createServiceClient } from '@/lib/supabase/service-role'
import { SelfHealingDetector, type SystemIssue } from './detector'
import { UXTemplateLibrary } from '@/lib/ai/uxTemplates'
import { GovernanceChecker, type GovernanceContext } from '@/lib/governance/policy'
import type { AIProposal } from '@/lib/types/personalization'

export class SelfHealingAutoFix {
  /**
   * Convert a system issue into an AI proposal
   */
  static async generateProposalFromIssue(
    userId: string,
    issue: SystemIssue
  ): Promise<AIProposal | null> {
    try {
      const { proposedFix, requiresUserApproval } = SelfHealingDetector.generateFixProposal(issue)

      // Create an AI proposal for the fix
      const proposal: AIProposal = {
        id: crypto.randomUUID(),
        proposalType: 'ux_change',
        title: this.generateProposalTitle(issue),
        description: proposedFix,
        expectedBenefit: this.generateExpectedBenefit(issue),
        impactLevel: this.mapSeverityToImpact(issue.severity),
        proposedChanges: {
          type: 'self_healing_fix',
          issueType: issue.type,
          affectedComponent: issue.affectedComponent,
          autoApplyable: !requiresUserApproval,
          fix: proposedFix,
        },
        aiReasoning: `Detected ${issue.type} in ${issue.affectedComponent}. ${this.generateReasoning(issue)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        metadata: {
          selfHealing: true,
          issueId: issue.detectedAt,
          severity: issue.severity,
          requiresApproval: requiresUserApproval,
        },
      }

      // Run through governance
      const governanceContext: GovernanceContext = {
        userId,
        currentPreferences: {},
        userHistory: { favoriteFeatures: [], usagePatterns: {}, preferredSages: [], avoidedFeatures: [], peakActivityHours: [] },
        platformConfig: {},
      }

      const governanceResult = await GovernanceChecker.checkProposal(proposal, governanceContext)

      if (!governanceResult.approved) {
        console.warn('[Self-Healing] Proposal blocked by governance:', governanceResult.violations)
        return null
      }

      // Save proposal
      const saved = await this.saveProposal(userId, proposal)
      return saved
    } catch (error) {
      console.error('[Self-Healing] Error generating proposal from issue:', error)
      return null
    }
  }

  /**
   * Save self-healing proposal to database
   */
  private static async saveProposal(userId: string, proposal: AIProposal): Promise<AIProposal | null> {
    try {
      const supabase = createServiceClient()

      const { data, error } = await supabase
        .from('ai_proposal_history')
        .insert({
          user_id: userId,
          proposal_type: proposal.proposalType,
          proposal_title: proposal.title,
          proposal_description: proposal.description,
          expected_benefit: proposal.expectedBenefit,
          impact_level: proposal.impactLevel,
          proposed_changes: proposal.proposedChanges,
          ai_reasoning: proposal.aiReasoning,
          status: 'pending',
          generated_by: 'self_healing_v1',
        })
        .select('id')
        .single()

      if (error) {
        console.error('[Self-Healing] Error saving proposal:', error)
        return null
      }

      // Add to user personalization
      await this.addToPersonalization(userId, { ...proposal, id: data.id })

      return { ...proposal, id: data.id }
    } catch (error) {
      console.error('[Self-Healing] Error saving proposal:', error)
      return null
    }
  }

  /**
   * Add proposal to user personalization
   */
  private static async addToPersonalization(userId: string, proposal: AIProposal): Promise<void> {
    try {
      const supabase = createServiceClient()

      const { data: existing } = await supabase
        .from('user_personalization')
        .select('ai_proposals')
        .eq('user_id', userId)
        .maybeSingle()

      const currentProposals = existing?.ai_proposals || {
        pendingChanges: [],
        approvedCount: 0,
        rejectedCount: 0,
        reviewStreak: 0,
      }

      currentProposals.pendingChanges = [
        proposal,
        ...currentProposals.pendingChanges,
      ].slice(0, 10)

      await supabase
        .from('user_personalization')
        .upsert({
          user_id: userId,
          ai_proposals: currentProposals,
          last_updated: new Date().toISOString(),
        })
    } catch (error) {
      console.error('[Self-Healing] Error adding to personalization:', error)
    }
  }

  /**
   * Generate proposal title from issue
   */
  private static generateProposalTitle(issue: SystemIssue): string {
    switch (issue.type) {
      case 'slow_response':
        return `Speed Up ${issue.affectedComponent}`
      case 'error':
        return `Fix Errors in ${issue.affectedComponent}`
      case 'broken_route':
        return `Repair Navigation to ${issue.affectedComponent}`
      case 'hallucination':
        return `Improve AI Accuracy for ${issue.affectedComponent}`
      case 'council_deadlock':
        return 'Fix Council Deliberation Deadlock'
      case 'memory_issue':
        return 'Resolve Memory System Issues'
      default:
        return `Fix Issue in ${issue.affectedComponent}`
    }
  }

  /**
   * Generate expected benefit
   */
  private static generateExpectedBenefit(issue: SystemIssue): string {
    switch (issue.type) {
      case 'slow_response':
        const responseTime = issue.errorDetails.responseTime
        return `Reduce load time from ${Math.round(responseTime / 1000)}s to under 3s`
      case 'error':
        return 'Eliminate errors and improve reliability'
      case 'broken_route':
        return 'Restore navigation and prevent 404 errors'
      case 'hallucination':
        return 'Ensure AI stays within its domain of expertise'
      case 'council_deadlock':
        return 'Enable Council to reach decisions faster'
      case 'memory_issue':
        return 'Restore access to conversation history'
      default:
        return 'Improve system stability and user experience'
    }
  }

  /**
   * Map severity to impact level
   */
  private static mapSeverityToImpact(severity: string): 'low' | 'medium' | 'high' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'high'
      case 'medium':
        return 'medium'
      case 'low':
      default:
        return 'low'
    }
  }

  /**
   * Generate AI reasoning
   */
  private static generateReasoning(issue: SystemIssue): string {
    const severity = issue.severity
    const type = issue.type

    if (type === 'slow_response') {
      return `Response time of ${Math.round(issue.errorDetails.responseTime / 1000)}s exceeds acceptable threshold. Users may experience frustration.`
    }

    if (type === 'error') {
      const errorCount = issue.errorDetails.errorCount || 1
      return `This error has occurred ${errorCount} times recently. Fixing it will improve platform reliability.`
    }

    if (type === 'broken_route') {
      return `Users are encountering ${issue.errorDetails.statusCode} errors when accessing this route. This breaks the user experience.`
    }

    if (type === 'hallucination') {
      return `The AI is responding outside its designated domain. This reduces trustworthiness and accuracy.`
    }

    if (type === 'council_deadlock') {
      return `Council deliberation has reached maximum rounds without consensus. This prevents users from getting answers.`
    }

    return `System detected ${severity} severity ${type} that requires attention.`
  }

  /**
   * Apply an approved self-healing proposal
   */
  static async applyApprovedProposal(proposalId: string): Promise<boolean> {
    try {
      const supabase = createServiceClient()

      // Get proposal details
      const { data: proposal, error } = await supabase
        .from('ai_proposal_history')
        .select('*')
        .eq('id', proposalId)
        .single()

      if (error || !proposal) {
        console.error('[Self-Healing] Proposal not found:', proposalId)
        return false
      }

      // Mark as applied
      await supabase
        .from('ai_proposal_history')
        .update({
          status: 'approved',
          applied_at: new Date().toISOString(),
        })
        .eq('id', proposalId)

      console.log('[Self-Healing] Applied proposal:', proposal.proposal_title)
      return true
    } catch (error) {
      console.error('[Self-Healing] Error applying proposal:', error)
      return false
    }
  }

  /**
   * Check if system should auto-apply a low-risk fix
   */
  static shouldAutoApply(proposal: AIProposal): boolean {
    // Only auto-apply if:
    // 1. Impact level is low
    // 2. Metadata indicates it's safe
    // 3. Proposal type is self-healing
    return (
      proposal.impactLevel === 'low' &&
      proposal.metadata?.selfHealing === true &&
      proposal.metadata?.requiresApproval === false
    )
  }
}
