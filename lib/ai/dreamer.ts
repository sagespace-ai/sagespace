/**
 * AI Dreamer System - Analyzes user behavior and generates personalized improvement proposals
 * This is the core of the self-evolving platform
 */
import { createServiceClient } from '@/lib/supabase/service-role'
import { generateChatResponseSync } from '@/lib/ai-client'
import { ObservabilityCollector } from '@/lib/ai/observability'
import { GovernanceChecker, type GovernanceContext } from '@/lib/governance/policy'
import { UXTemplateLibrary, PAGE_CLASSIFICATION, PageType } from '@/lib/ai/uxTemplates'
import { ProposalScoring, type UserPattern, type SemanticProfile } from '@/lib/ai/scoring'
import { SemanticAnalyzer } from '@/lib/ai/semantic-analyzer'
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

      const userPattern: UserPattern = {
        frequentPages: this.calculatePageFrequency(events),
        preferredSages: this.extractPreferredSages(events),
        commonTransitions: navigationPatterns,
        frictionPoints,
        successPatterns: successSignals,
      }

      const personalization = await this.getUserPersonalization(userId)
      const previousTopics = personalization?.memorySummary?.favoriteFeatures || []
      
      const semanticAnalysis = await SemanticAnalyzer.analyze(events, previousTopics)

      const semanticProfile: SemanticProfile = {
        dominantTopics: semanticAnalysis.dominantTopics,
        preferredMoods: this.extractPreferredMoods(events),
        sageAffinities: userPattern.preferredSages,
        queryComplexity: semanticAnalysis.queryComplexity,
        averageSessionLength: this.calculateAverageSessionLength(events),
      }

      const uxTemplates = new UXTemplateLibrary()
      const scoring = new ProposalScoring()
      const rawProposals: AIProposal[] = []

      // Template 1: Navigation shortcuts for frequent transitions
      const topTransitions = navigationPatterns.slice(0, 3)
      for (const transition of topTransitions) {
        if (transition.count >= 5) { // Only if user does this frequently
          const proposal = await uxTemplates.navigationShortcut({
            from: transition.fromPage,
            to: transition.toPage,
            visitCount: transition.count,
            reason: `You navigate from ${transition.fromPage} to ${transition.toPage} ${transition.count} times, making it one of your most common paths.`
          })
          rawProposals.push(proposal)
        }
      }

      // Template 2: Sage recommendations
      if (userPattern.preferredSages.length > 0) {
        const proposal = await uxTemplates.sageRecommendation({
          sageNames: userPattern.preferredSages.slice(0, 3),
          reason: `Based on your conversation history, these are your most-used Sages.`,
          usageCount: userPattern.preferredSages.length * 5, // Estimate
        })
        rawProposals.push(proposal)
      }

      // Template 10: Memory filters if user has many conversations
      const memoryVisits = userPattern.frequentPages.find(p => p.page === '/memory')
      if (memoryVisits && memoryVisits.visitRate > 0.1) {
        const proposal = await uxTemplates.memoryFilter({
          filterType: 'sage',
          reason: 'You frequently visit Memory. Adding filters would help you find conversations faster.',
          conversationCount: 10, // TODO: Get actual count
        })
        rawProposals.push(proposal)
      }

      // Template 11: Error prevention for friction points
      const topFriction = frictionPoints.slice(0, 2)
      for (const friction of topFriction) {
        if (friction.count >= 3) {
          const proposal = await uxTemplates.errorAvoidance({
            errorType: 'User Flow Interruption',
            page: friction.page,
            preventionStrategy: `Add clearer guidance or validation for ${friction.component}`,
            reason: `You've encountered issues with ${friction.component} on ${friction.page} ${friction.count} times.`,
            occurrenceCount: friction.count,
          })
          rawProposals.push(proposal)
        }
      }

      const scoredProposals = rawProposals.map(proposal => ({
        ...proposal,
        metadata: {
          ...proposal.metadata,
          score: scoring.calculate(proposal, userPattern, semanticProfile)
        }
      }))

      const qualityProposals = scoredProposals.filter(p => 
        (p.metadata?.score || 0) >= 50
      )

      console.log('[Dreamer] Generated', rawProposals.length, 'proposals,', qualityProposals.length, 'passed scoring threshold')

      // 7. Filter proposals through governance layer
      const governanceContext: GovernanceContext = {
        userId,
        currentPreferences: personalization?.uxPreferences || {},
        userHistory: personalization?.memorySummary || this.getDefaultMemorySummary(),
        platformConfig: {},
      }

      const approvedProposals: AIProposal[] = []
      
      for (const proposal of qualityProposals) {
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

      // 8. Save approved proposals to database
      const savedProposals = await this.saveProposals(userId, approvedProposals)

      console.log('[Dreamer] Generated', savedProposals.length, 'approved proposals for user:', userId)
      return savedProposals
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

  private static calculatePageFrequency(events: ObservabilityEvent[]): Array<{ page: string; visitRate: number }> {
    const pageViews = events.filter(e => e.eventType === 'page_view')
    const total = pageViews.length
    const pageCounts: Record<string, number> = {}

    pageViews.forEach(e => {
      const page = e.pagePath || 'unknown'
      pageCounts[page] = (pageCounts[page] || 0) + 1
    })

    return Object.entries(pageCounts)
      .map(([page, count]) => ({
        page,
        visitRate: count / total
      }))
      .sort((a, b) => b.visitRate - a.visitRate)
  }

  private static extractPreferredMoods(events: ObservabilityEvent[]): string[] {
    const moods = events
      .filter(e => e.metadata?.mood)
      .map(e => e.metadata!.mood)
    
    const moodCounts: Record<string, number> = {}
    moods.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })

    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood]) => mood)
  }

  private static calculateAverageSessionLength(events: ObservabilityEvent[]): number {
    // Calculate based on time between first and last event per day
    const eventsByDay: Record<string, ObservabilityEvent[]> = {}
    
    events.forEach(e => {
      const day = new Date(e.createdAt).toDateString()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(e)
    })

    const sessionLengths = Object.values(eventsByDay).map(dayEvents => {
      const times = dayEvents.map(e => new Date(e.createdAt).getTime()).sort()
      return (times[times.length - 1] - times[0]) / 1000 / 60 // minutes
    })

    return sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length || 0
  }
}
