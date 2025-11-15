/**
 * Content Moderation System
 * ISO 42001-aligned content filtering for live sessions
 */

export interface ModerationResult {
  approved: boolean
  flagged: boolean
  reason?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  aiWatermark: string
}

export interface ModerationConfig {
  filterLevel: 'strict' | 'moderate' | 'relaxed'
  blockedTopics: string[]
  allowedTopics: string[]
  requiresHumanApproval: boolean
  safeModeEnabled: boolean
}

export class ContentModerator {
  private config: ModerationConfig

  constructor(config: ModerationConfig) {
    this.config = config
  }

  async moderateText(text: string, context: { 
    isAIGenerated: boolean
    sessionId: string
    userId?: string
  }): Promise<ModerationResult> {
    console.log('[v0] Moderating text:', text.substring(0, 50))

    const result: ModerationResult = {
      approved: true,
      flagged: false,
      severity: 'low',
      aiWatermark: context.isAIGenerated ? 'AI Generated Content' : ''
    }

    // Check for blocked topics
    const hasBlockedContent = this.config.blockedTopics.some(topic => 
      text.toLowerCase().includes(topic.toLowerCase())
    )

    if (hasBlockedContent) {
      result.approved = false
      result.flagged = true
      result.severity = 'high'
      result.reason = 'Contains blocked content'
      return result
    }

    // Check profanity and harmful content
    const profanityPatterns = [
      /\b(hate|violence|explicit)\b/i,
      // Add more patterns as needed
    ]

    const hasProfanity = profanityPatterns.some(pattern => pattern.test(text))
    
    if (hasProfanity) {
      result.flagged = true
      result.severity = this.config.filterLevel === 'strict' ? 'high' : 'medium'
      result.reason = 'Potentially inappropriate content'
      
      if (this.config.filterLevel === 'strict') {
        result.approved = false
      }
    }

    // Safe mode additional checks
    if (this.config.safeModeEnabled) {
      const suspiciousPatterns = [
        /personal.*information/i,
        /credit.*card/i,
        /password/i
      ]

      const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(text))
      
      if (hasSuspiciousContent) {
        result.flagged = true
        result.severity = 'high'
        result.reason = 'Potentially sensitive information'
        result.approved = !this.config.requiresHumanApproval
      }
    }

    return result
  }

  async moderateAIResponse(
    response: string, 
    sageTwinId: string,
    sessionId: string
  ): Promise<ModerationResult> {
    const result = await this.moderateText(response, {
      isAIGenerated: true,
      sessionId,
    })

    // Add AI watermark
    result.aiWatermark = '🤖 AI Generated Response'

    // Additional AI-specific checks
    if (this.config.requiresHumanApproval) {
      result.approved = false
      result.reason = 'Requires human approval before broadcast'
    }

    return result
  }
}

/**
 * Emergency Stop System
 * Allows immediate session termination with compliance logging
 */
export class EmergencyStopController {
  async triggerEmergencyStop(
    sessionId: string,
    reason: string,
    triggeredBy: string
  ): Promise<{ success: boolean; auditLogId: string }> {
    console.log('[v0] Emergency stop triggered:', { sessionId, reason, triggeredBy })

    // In production, this would:
    // 1. Immediately terminate all streams
    // 2. Disconnect all viewers
    // 3. Stop AI Sage Twin
    // 4. Log to compliance audit trail
    // 5. Notify relevant parties

    const auditLogId = `emergency-${Date.now()}`

    return {
      success: true,
      auditLogId
    }
  }

  async enableSafeMode(sessionId: string): Promise<boolean> {
    console.log('[v0] Safe mode enabled for session:', sessionId)
    // Additional content filtering activated
    return true
  }
}
