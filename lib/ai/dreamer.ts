/**
 * AI Dreamer System - Analyzes user behavior and generates personalized improvement proposals
 * This is the core of the self-evolving platform
 */
import { createServiceClient } from '@/lib/supabase/service-role'
import { generateChatResponseSync } from '@/lib/ai-client'
import { ObservabilityCollector } from '@/lib/ai/observability'
import { GovernanceChecker, type GovernanceContext } from '@/lib/governance/policy'
import type { 
  AIProposal, 
  UserPersonalization, 
  ObservabilityEvent,
  MemorySummary 
} from '@/lib/types/personalization'

export class DreamerSystem {
  /**
   * Analyze user behavior and generate improvement proposals
   * This runs periodically (e.g., daily) for each user
   */
  static async analyzeAndPropose(userId: string): Promise<AIProposal[]> {
    console.log('[Dreamer] Starting analysis for user:', userId)
    
    try {
      // 1. Gather observability signals
      const events = await ObservabilityCollector.getRecentEvents(userId, 200)
      
      if (events.length < 10) {
        console.log('[Dreamer] Not enough data to analyze for user:', userId)
        return []
      }

      // 2. Analyze patterns
      const navigationPatterns = ObservabilityCollector.analyzeNavigationPatterns(events)
      const frictionPoints = ObservabilityCollector.identifyFrictionPoints(events)
      const timeOnPage = this.calculateTimeOnPage(events)
      const successSignals = this.identifySuccessSignals(events)

      // 3. Get user's current personalization context
      const personalization = await this.getUserPersonalization(userId)

      // 4. Generate proposals using AI
      const rawProposals = await this.generateProposals({
        userId,
        navigationPatterns,
        frictionPoints,
        timeOnPage,
        successSignals,
        memorySummary: personalization?.memorySummary || this.getDefaultMemorySummary(),
        currentPreferences: personalization?.uxPreferences || {},
      })

      // 5. Filter proposals through governance layer
      const governanceContext: GovernanceContext = {
        userId,
        currentPreferences: personalization?.uxPreferences || {},
        userHistory: personalization?.memorySummary || this.getDefaultMemorySummary(),
        platformConfig: {},
      }

      const approvedProposals: AIProposal[] = []
      
      for (const proposal of rawProposals) {
        // Sanitize proposal first
        const sanitized = GovernanceChecker.sanitizeProposal(proposal)
        
        // Run governance checks
        const governanceResult = await GovernanceChecker.checkProposal(sanitized, governanceContext)
        
        if (governanceResult.approved) {
          approvedProposals.push(sanitized)
          console.log('[Dreamer] Proposal approved by governance:', sanitized.title)
        } else {
          console.warn('[Dreamer] Proposal blocked by governance:', {
            title: sanitized.title,
            violations: governanceResult.violations,
          })
          
          // Log the blocked proposal for audit
          await this.logBlockedProposal(userId, sanitized, governanceResult)
        }
      }

      // 6. Save approved proposals to database
      const savedProposals = await this.saveProposals(userId, approvedProposals)

      console.log('[Dreamer] Generated', savedProposals.length, 'approved proposals for user:', userId)
      return savedProposals // Return proposals with correct IDs
    } catch (error) {
      console.error('[Dreamer] Error analyzing user:', error)
      return []
    }
  }

  /**
   * Generate AI-powered improvement proposals based on user behavior
   */
  private static async generateProposals(context: {
    userId: string
    navigationPatterns: Array<{ fromPage: string; toPage: string; count: number }>
    frictionPoints: Array<{ page: string; component: string; count: number }>
    timeOnPage: Record<string, number>
    successSignals: Array<{ action: string; page: string; count: number }>
    memorySummary: MemorySummary
    currentPreferences: any
  }): Promise<AIProposal[]> {
    const systemPrompt = `You are the Dreamer AI, an intelligent system that analyzes user behavior and suggests personalized UX/UI improvements for SageSpace, an AI platform.

Your role is to:
1. Analyze user navigation patterns, friction points, and success signals
2. Generate 1-3 specific, actionable improvement proposals
3. Each proposal must be practical, measurable, and user-centered

IMPORTANT RULES:
- Only suggest changes that genuinely improve the user experience
- Be specific - provide exact UI changes, not vague suggestions
- Consider the user's existing preferences and patterns
- Focus on reducing friction and enhancing successful workflows
- Never suggest removing safety features or compliance requirements
- Keep proposals simple and implementable

Return your response as a JSON array of proposals with this structure:
[
  {
    "proposalType": "ux_change" | "feature_toggle" | "workflow_automation" | "sage_recommendation" | "theme_variant",
    "title": "Brief title (max 50 chars)",
    "description": "Clear description of the change",
    "expectedBenefit": "What improvement the user will see",
    "impactLevel": "low" | "medium" | "high",
    "proposedChanges": { detailed object of exact changes },
    "aiReasoning": "Why you're suggesting this based on the data"
  }
]`

    const userMessage = `Analyze this user's behavior and suggest 1-3 improvements:

NAVIGATION PATTERNS (top 5):
${context.navigationPatterns.slice(0, 5).map(p => `- ${p.fromPage} → ${p.toPage} (${p.count} times)`).join('\n')}

FRICTION POINTS:
${context.frictionPoints.length > 0 ? context.frictionPoints.slice(0, 3).map(f => `- ${f.page} / ${f.component}: ${f.count} issues`).join('\n') : 'None detected'}

TIME ON PAGE (avg seconds):
${Object.entries(context.timeOnPage).slice(0, 5).map(([page, time]) => `- ${page}: ${Math.round(time)}s`).join('\n')}

SUCCESS SIGNALS:
${context.successSignals.slice(0, 5).map(s => `- ${s.action} on ${s.page}: ${s.count} successes`).join('\n')}

USER PREFERENCES:
- Favorite features: ${context.memorySummary.favoriteFeatures.join(', ') || 'Not yet determined'}
- Preferred sages: ${context.memorySummary.preferredSages.join(', ') || 'Not yet determined'}
- Current theme: ${context.currentPreferences.theme || 'cosmic'}

Based on this data, what UX improvements would benefit this specific user?`

    try {
      const result = await generateChatResponseSync({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        maxTokens: 2000,
      })

      // Parse the AI response
      const responseText = result.text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      
      if (!jsonMatch) {
        console.warn('[Dreamer] AI response did not contain valid JSON array')
        return []
      }

      const proposalsData = JSON.parse(jsonMatch[0])
      
      // Convert to AIProposal objects
      const proposals: AIProposal[] = proposalsData.map((p: any) => ({
        id: crypto.randomUUID(),
        proposalType: p.proposalType || 'ux_change',
        title: p.title,
        description: p.description,
        expectedBenefit: p.expectedBenefit,
        impactLevel: p.impactLevel || 'medium',
        proposedChanges: p.proposedChanges,
        aiReasoning: p.aiReasoning,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }))

      return proposals
    } catch (error) {
      console.error('[Dreamer] Error generating proposals:', error)
      return []
    }
  }

  /**
   * Save proposals to the database
   */
  private static async saveProposals(userId: string, proposals: AIProposal[]): Promise<AIProposal[]> {
    const supabase = createServiceClient()
    const savedProposals: AIProposal[] = []

    for (const proposal of proposals) {
      try {
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
            generated_by: 'dreamer_v1',
          })
          .select('id')
          .single()

        if (error) {
          console.error('[Dreamer] Error saving proposal:', error)
          continue
        }

        const savedProposal: AIProposal = {
          ...proposal,
          id: data.id, // Use the actual database ID
        }
        
        savedProposals.push(savedProposal)
        console.log('[v0] [Dreamer] Saved proposal with ID:', data.id)
      } catch (error) {
        console.error('[Dreamer] Error saving proposal:', error)
      }
    }

    await this.updatePersonalizationProposals(userId, savedProposals)
    
    return savedProposals
  }

  /**
   * Update user personalization with new proposals
   */
  private static async updatePersonalizationProposals(userId: string, newProposals: AIProposal[]): Promise<void> {
    const supabase = createServiceClient()

    try {
      console.log('[v0] [Dreamer] Updating personalization with', newProposals.length, 'new proposals')
      console.log('[v0] [Dreamer] New proposal IDs:', newProposals.map(p => p.id))
      
      // Get existing personalization
      const { data: existing } = await supabase
        .from('user_personalization')
        .select('ai_proposals')
        .eq('user_id', userId)
        .maybeSingle()

      const currentProposals = existing?.ai_proposals || { 
        pendingChanges: [], 
        approvedCount: 0, 
        rejectedCount: 0, 
        reviewStreak: 0 
      }
      
      console.log('[v0] [Dreamer] Existing pending count:', currentProposals.pendingChanges.length)
      
      // Verify each existing proposal ID actually exists in the database
      const existingIds = currentProposals.pendingChanges.map((p: AIProposal) => p.id)
      
      if (existingIds.length > 0) {
        const { data: validProposals } = await supabase
          .from('ai_proposal_history')
          .select('id')
          .in('id', existingIds)
          .eq('status', 'pending')
        
        const validIds = new Set(validProposals?.map(p => p.id) || [])
        console.log('[v0] [Dreamer] Valid existing IDs:', Array.from(validIds))
        
        // Filter out proposals with invalid IDs
        currentProposals.pendingChanges = currentProposals.pendingChanges.filter(
          (p: AIProposal) => validIds.has(p.id)
        )
        
        console.log('[v0] [Dreamer] After filtering invalid IDs, pending count:', currentProposals.pendingChanges.length)
      }
      
      // Add new proposals to pending (they all have valid database IDs)
      currentProposals.pendingChanges = [
        ...newProposals,
        ...currentProposals.pendingChanges,
      ].slice(0, 10) // Keep max 10 pending proposals

      console.log('[v0] [Dreamer] Final pending count:', currentProposals.pendingChanges.length)
      console.log('[v0] [Dreamer] Final proposal IDs:', currentProposals.pendingChanges.map((p: any) => p.id))

      // Upsert personalization
      const { error } = await supabase
        .from('user_personalization')
        .upsert({
          user_id: userId,
          ai_proposals: currentProposals,
          last_updated: new Date().toISOString(),
        })
      
      if (error) {
        console.error('[v0] [Dreamer] Error upserting personalization:', error)
      } else {
        console.log('[v0] [Dreamer] ✅ Successfully updated personalization')
      }
    } catch (error) {
      console.error('[Dreamer] Error updating personalization proposals:', error)
    }
  }

  /**
   * Get user's current personalization settings
   */
  private static async getUserPersonalization(userId: string): Promise<UserPersonalization | null> {
    const supabase = createServiceClient()

    try {
      const { data, error } = await supabase
        .from('user_personalization')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) return null

      return data as unknown as UserPersonalization
    } catch (error) {
      return null
    }
  }

  /**
   * Calculate average time spent on each page
   */
  private static calculateTimeOnPage(events: ObservabilityEvent[]): Record<string, number> {
    const pageViews = events.filter(e => e.eventType === 'page_view').sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const timeMap: Record<string, { total: number; count: number }> = {}

    for (let i = 1; i < pageViews.length; i++) {
      const prevPage = pageViews[i - 1].pagePath || 'unknown'
      const prevTime = new Date(pageViews[i - 1].createdAt).getTime()
      const currTime = new Date(pageViews[i].createdAt).getTime()
      const duration = (currTime - prevTime) / 1000 // seconds

      // Ignore durations > 5 minutes (likely user left tab)
      if (duration < 300) {
        if (!timeMap[prevPage]) {
          timeMap[prevPage] = { total: 0, count: 0 }
        }
        timeMap[prevPage].total += duration
        timeMap[prevPage].count++
      }
    }

    // Calculate averages
    const averages: Record<string, number> = {}
    for (const [page, data] of Object.entries(timeMap)) {
      averages[page] = data.total / data.count
    }

    return averages
  }

  /**
   * Identify success signals from events
   */
  private static identifySuccessSignals(events: ObservabilityEvent[]): Array<{ action: string; page: string; count: number }> {
    const successEvents = events.filter(e => e.eventType === 'success')
    const successMap: Map<string, { action: string; page: string; count: number }> = new Map()

    for (const event of successEvents) {
      const key = `${event.pagePath}::${event.actionName}`
      const existing = successMap.get(key)
      
      if (existing) {
        existing.count++
      } else {
        successMap.set(key, {
          action: event.actionName || 'unknown',
          page: event.pagePath || 'unknown',
          count: 1,
        })
      }
    }

    return Array.from(successMap.values()).sort((a, b) => b.count - a.count)
  }

  /**
   * Get default memory summary for new users
   */
  private static getDefaultMemorySummary(): MemorySummary {
    return {
      favoriteFeatures: [],
      usagePatterns: {},
      preferredSages: [],
      avoidedFeatures: [],
      peakActivityHours: [],
    }
  }

  /**
   * Update user's memory summary based on recent activity
   */
  static async updateMemorySummary(userId: string): Promise<void> {
    const events = await ObservabilityCollector.getRecentEvents(userId, 500)
    
    if (events.length < 20) return // Not enough data

    const memorySummary: MemorySummary = {
      favoriteFeatures: this.extractFavoriteFeatures(events),
      usagePatterns: this.extractUsagePatterns(events),
      preferredSages: this.extractPreferredSages(events),
      avoidedFeatures: this.extractAvoidedFeatures(events),
      peakActivityHours: this.extractPeakHours(events),
    }

    const supabase = createServiceClient()
    await supabase
      .from('user_personalization')
      .upsert({
        user_id: userId,
        memory_summary: memorySummary,
      })
  }

  private static extractFavoriteFeatures(events: ObservabilityEvent[]): string[] {
    const pageCounts: Record<string, number> = {}
    
    events.filter(e => e.eventType === 'page_view').forEach(e => {
      const page = e.pagePath || 'unknown'
      pageCounts[page] = (pageCounts[page] || 0) + 1
    })

    return Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page]) => page)
  }

  private static extractUsagePatterns(events: ObservabilityEvent[]): Record<string, number> {
    const patterns: Record<string, number> = {}
    
    events.forEach(e => {
      const key = `${e.eventType}_${e.eventCategory}`
      patterns[key] = (patterns[key] || 0) + 1
    })

    return patterns
  }

  private static extractPreferredSages(events: ObservabilityEvent[]): string[] {
    const sageCounts: Record<string, number> = {}
    
    events.forEach(e => {
      if (e.metadata?.sageName) {
        sageCounts[e.metadata.sageName] = (sageCounts[e.metadata.sageName] || 0) + 1
      }
    })

    return Object.entries(sageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sage]) => sage)
  }

  private static extractAvoidedFeatures(events: ObservabilityEvent[]): string[] {
    // Features that were visited once but never returned to
    const visited = new Set<string>()
    const returned = new Set<string>()
    
    events.filter(e => e.eventType === 'page_view').forEach(e => {
      const page = e.pagePath || 'unknown'
      if (visited.has(page)) {
        returned.add(page)
      }
      visited.add(page)
    })

    return Array.from(visited).filter(page => !returned.has(page))
  }

  private static extractPeakHours(events: ObservabilityEvent[]): number[] {
    const hourCounts: Record<number, number> = {}
    
    events.forEach(e => {
      const hour = new Date(e.createdAt).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    return Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => Number.parseInt(hour))
  }

  /**
   * Log blocked proposals for audit and improvement
   */
  private static async logBlockedProposal(
    userId: string,
    proposal: AIProposal,
    governanceResult: any
  ): Promise<void> {
    const supabase = createServiceClient()
    
    try {
      await supabase.from('ai_proposal_history').insert({
        user_id: userId,
        proposal_type: proposal.proposalType,
        proposal_title: proposal.title,
        proposal_description: proposal.description,
        expected_benefit: proposal.expectedBenefit,
        impact_level: proposal.impactLevel,
        proposed_changes: proposal.proposedChanges,
        ai_reasoning: proposal.aiReasoning,
        status: 'rejected',
        governance_approved: false,
        governance_reasoning: GovernanceChecker.generateReport(governanceResult),
        generated_by: 'dreamer_v1',
      })
    } catch (error) {
      console.error('[Dreamer] Error logging blocked proposal:', error)
    }
  }
}
