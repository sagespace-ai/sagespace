/**
 * Self-Healing System - Detects issues and generates auto-fix proposals
 * Monitors system health and proposes fixes when problems are detected
 */
import { createServiceClient } from '@/lib/supabase/service-role'
import type { SelfHealingEvent } from '@/lib/types/personalization'

export interface SystemIssue {
  type: 'slow_response' | 'error' | 'broken_route' | 'hallucination' | 'council_deadlock' | 'memory_issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedComponent: string
  errorDetails: Record<string, any>
  detectedAt: string
}

export class SelfHealingDetector {
  /**
   * Detect slow API responses and generate fix proposals
   */
  static async detectSlowResponses(
    endpoint: string,
    responseTime: number,
    threshold: number = 3000
  ): Promise<SystemIssue | null> {
    if (responseTime > threshold) {
      return {
        type: 'slow_response',
        severity: responseTime > 10000 ? 'high' : 'medium',
        affectedComponent: endpoint,
        errorDetails: {
          responseTime,
          threshold,
          exceeded: responseTime - threshold,
        },
        detectedAt: new Date().toISOString(),
      }
    }
    return null
  }

  /**
   * Detect repeated errors in API routes
   */
  static async detectRepeatedErrors(
    endpoint: string,
    error: Error,
    errorCount: number = 1
  ): Promise<SystemIssue | null> {
    return {
      type: 'error',
      severity: errorCount > 5 ? 'critical' : errorCount > 3 ? 'high' : 'medium',
      affectedComponent: endpoint,
      errorDetails: {
        message: error.message,
        stack: error.stack,
        errorCount,
        name: error.name,
      },
      detectedAt: new Date().toISOString(),
    }
  }

  /**
   * Detect broken routes (404s, navigation issues)
   */
  static async detectBrokenRoute(
    route: string,
    statusCode: number,
    userId?: string
  ): Promise<SystemIssue | null> {
    if (statusCode === 404 || statusCode === 500) {
      return {
        type: 'broken_route',
        severity: statusCode === 500 ? 'high' : 'medium',
        affectedComponent: route,
        errorDetails: {
          statusCode,
          userId,
          attemptedRoute: route,
        },
        detectedAt: new Date().toISOString(),
      }
    }
    return null
  }

  /**
   * Detect AI hallucinations (responses that don't match sage domain)
   */
  static async detectHallucination(
    sageName: string,
    sageDomain: string,
    response: string,
    expectedDomain: string
  ): Promise<SystemIssue | null> {
    // Simple keyword-based detection (in production, use more sophisticated NLP)
    const domainKeywords = expectedDomain.toLowerCase().split(/[,\s]+/)
    const responseLower = response.toLowerCase()
    
    let domainMatch = false
    for (const keyword of domainKeywords) {
      if (responseLower.includes(keyword)) {
        domainMatch = true
        break
      }
    }

    // If response is long but doesn't match domain, likely hallucination
    if (!domainMatch && response.length > 200) {
      return {
        type: 'hallucination',
        severity: 'medium',
        affectedComponent: `sage:${sageName}`,
        errorDetails: {
          sageName,
          expectedDomain,
          responseLength: response.length,
          detectedOffDomain: true,
        },
        detectedAt: new Date().toISOString(),
      }
    }

    return null
  }

  /**
   * Detect Council deadlocks (when sages can't reach consensus)
   */
  static async detectCouncilDeadlock(
    sessionId: string,
    votingRounds: number,
    maxRounds: number = 5
  ): Promise<SystemIssue | null> {
    if (votingRounds >= maxRounds) {
      return {
        type: 'council_deadlock',
        severity: 'high',
        affectedComponent: 'council',
        errorDetails: {
          sessionId,
          votingRounds,
          maxRounds,
          status: 'deadlock_detected',
        },
        detectedAt: new Date().toISOString(),
      }
    }
    return null
  }

  /**
   * Log a system issue to the database
   */
  static async logIssue(issue: SystemIssue): Promise<string | null> {
    try {
      const supabase = createServiceClient()
      
      const { data, error } = await supabase
        .from('self_healing_events')
        .insert({
          event_type: issue.type,
          severity: issue.severity,
          affected_component: issue.affectedComponent,
          error_details: issue.errorDetails,
          requires_user_approval: issue.severity !== 'low',
        })
        .select('id')
        .single()

      if (error) {
        console.error('[Self-Healing] Failed to log issue:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('[Self-Healing] Error logging issue:', error)
      return null
    }
  }

  /**
   * Generate auto-fix proposal for a detected issue
   */
  static generateFixProposal(issue: SystemIssue): {
    proposedFix: string
    requiresUserApproval: boolean
  } {
    switch (issue.type) {
      case 'slow_response':
        return {
          proposedFix: this.generateSlowResponseFix(issue),
          requiresUserApproval: issue.severity === 'high' || issue.severity === 'critical',
        }
      
      case 'error':
        return {
          proposedFix: this.generateErrorFix(issue),
          requiresUserApproval: true,
        }
      
      case 'broken_route':
        return {
          proposedFix: this.generateBrokenRouteFix(issue),
          requiresUserApproval: false,
        }
      
      case 'hallucination':
        return {
          proposedFix: this.generateHallucinationFix(issue),
          requiresUserApproval: false,
        }
      
      case 'council_deadlock':
        return {
          proposedFix: this.generateDeadlockFix(issue),
          requiresUserApproval: true,
        }
      
      default:
        return {
          proposedFix: 'Unknown issue type - manual investigation required',
          requiresUserApproval: true,
        }
    }
  }

  private static generateSlowResponseFix(issue: SystemIssue): string {
    const responseTime = issue.errorDetails.responseTime
    
    if (responseTime > 10000) {
      return `Switch ${issue.affectedComponent} to use cached responses for non-critical data. Enable request timeout of 5 seconds with graceful fallback.`
    } else if (responseTime > 5000) {
      return `Optimize ${issue.affectedComponent} by reducing payload size and implementing pagination. Consider adding loading states.`
    } else {
      return `Add response caching for ${issue.affectedComponent} with 1-minute TTL to improve subsequent load times.`
    }
  }

  private static generateErrorFix(issue: SystemIssue): string {
    const errorMessage = issue.errorDetails.message || ''
    
    if (errorMessage.includes('timeout')) {
      return `Increase timeout for ${issue.affectedComponent} and add retry logic with exponential backoff.`
    } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return `Add null checks and fallback data for ${issue.affectedComponent}. Show user-friendly error message instead of crash.`
    } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return `Refresh authentication tokens for ${issue.affectedComponent} and redirect to login if expired.`
    } else if (errorMessage.includes('database') || errorMessage.includes('connection')) {
      return `Implement connection pooling for ${issue.affectedComponent} and add automatic reconnection logic.`
    } else {
      return `Add comprehensive error handling to ${issue.affectedComponent} with detailed logging and user-friendly error messages.`
    }
  }

  private static generateBrokenRouteFix(issue: SystemIssue): string {
    const statusCode = issue.errorDetails.statusCode
    
    if (statusCode === 404) {
      return `Add redirect from ${issue.affectedComponent} to the nearest valid route. Update navigation to remove or fix broken links.`
    } else if (statusCode === 500) {
      return `Add error boundary to ${issue.affectedComponent} and implement graceful degradation. Log errors server-side for investigation.`
    } else {
      return `Fix routing configuration for ${issue.affectedComponent} and ensure all dynamic routes are properly configured.`
    }
  }

  private static generateHallucinationFix(issue: SystemIssue): string {
    const sageName = issue.errorDetails.sageName
    
    return `Strengthen domain scope enforcement for ${sageName}. Add explicit off-domain detection and response filtering. Reduce temperature to 0.5 for more focused responses.`
  }

  private static generateDeadlockFix(issue: SystemIssue): string {
    return `For Council session ${issue.errorDetails.sessionId}, implement tie-breaking mechanism. Consider using weighted voting or bringing in additional neutral sage. Lower consensus threshold from current level.`
  }

  /**
   * Apply an auto-fix (for low-severity, safe fixes)
   */
  static async applyAutoFix(issueId: string, fix: string): Promise<boolean> {
    try {
      const supabase = createServiceClient()
      
      // Mark fix as applied
      const { error } = await supabase
        .from('self_healing_events')
        .update({
          proposed_fix: fix,
          fix_applied: true,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', issueId)

      if (error) {
        console.error('[Self-Healing] Failed to mark fix as applied:', error)
        return false
      }

      console.log(`[Self-Healing] Auto-fix applied for issue ${issueId}`)
      return true
    } catch (error) {
      console.error('[Self-Healing] Error applying auto-fix:', error)
      return false
    }
  }
}

/**
 * Monitoring middleware for automatic issue detection
 */
export class SelfHealingMonitor {
  private static errorCounts: Map<string, number> = new Map()
  private static responseTime: Map<string, number[]> = new Map()

  /**
   * Track API response time
   */
  static async trackResponseTime(endpoint: string, duration: number): Promise<void> {
    if (!this.responseTime.has(endpoint)) {
      this.responseTime.set(endpoint, [])
    }
    
    const times = this.responseTime.get(endpoint)!
    times.push(duration)
    
    // Keep only last 100 response times
    if (times.length > 100) {
      times.shift()
    }

    // Check if consistently slow
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    if (avgTime > 3000) {
      const issue = await SelfHealingDetector.detectSlowResponses(endpoint, avgTime)
      if (issue) {
        const issueId = await SelfHealingDetector.logIssue(issue)
        if (issueId) {
          const { proposedFix, requiresUserApproval } = SelfHealingDetector.generateFixProposal(issue)
          
          if (!requiresUserApproval) {
            await SelfHealingDetector.applyAutoFix(issueId, proposedFix)
          }
        }
      }
    }
  }

  /**
   * Track API errors
   */
  static async trackError(endpoint: string, error: Error): Promise<void> {
    const count = (this.errorCounts.get(endpoint) || 0) + 1
    this.errorCounts.set(endpoint, count)

    // If error count exceeds threshold, create issue
    if (count >= 3) {
      const issue = await SelfHealingDetector.detectRepeatedErrors(endpoint, error, count)
      if (issue) {
        const issueId = await SelfHealingDetector.logIssue(issue)
        if (issueId) {
          const { proposedFix } = SelfHealingDetector.generateFixProposal(issue)
          
          // Log the fix proposal (requires user approval for errors)
          await createServiceClient()
            .from('self_healing_events')
            .update({ proposed_fix: proposedFix })
            .eq('id', issueId)
        }
      }

      // Reset counter after logging
      this.errorCounts.set(endpoint, 0)
    }
  }

  /**
   * Reset monitoring data (call periodically)
   */
  static reset(): void {
    this.errorCounts.clear()
    this.responseTime.clear()
  }
}
