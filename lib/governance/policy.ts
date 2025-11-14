/**
 * Governance Layer - Safety and compliance filters for AI proposals
 * Ensures no unsafe, manipulative, or non-compliant changes are suggested or applied
 */

export interface GovernancePolicy {
  id: string
  name: string
  category: 'safety' | 'compliance' | 'privacy' | 'functionality' | 'ethics'
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: (proposal: any, context: any) => GovernanceCheckResult
}

export interface GovernanceCheckResult {
  passed: boolean
  reason?: string
  recommendation?: string
  blockedBy?: string
}

export interface GovernanceContext {
  userId: string
  currentPreferences: any
  userHistory: any
  platformConfig: any
}

/**
 * Core governance policies that all proposals must pass
 */
export const GOVERNANCE_POLICIES: GovernancePolicy[] = [
  // SAFETY POLICIES
  {
    id: 'no-remove-safety-features',
    name: 'Preserve Safety Features',
    category: 'safety',
    severity: 'critical',
    description: 'Never suggest removing or disabling safety features',
    check: (proposal, context) => {
      const dangerousChanges = [
        'disable',
        'remove',
        'turn off',
        'deactivate',
        'bypass',
      ]
      
      const proposalText = JSON.stringify(proposal).toLowerCase()
      const safetyKeywords = ['safety', 'security', 'moderation', 'filter', 'protection']
      
      for (const keyword of safetyKeywords) {
        if (proposalText.includes(keyword)) {
          for (const danger of dangerousChanges) {
            if (proposalText.includes(danger)) {
              return {
                passed: false,
                reason: 'Proposal attempts to modify safety features',
                blockedBy: 'no-remove-safety-features',
              }
            }
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  {
    id: 'no-data-exfiltration',
    name: 'Prevent Data Exfiltration',
    category: 'safety',
    severity: 'critical',
    description: 'Block proposals that could leak user data',
    check: (proposal, context) => {
      const suspiciousPatterns = [
        'external api',
        'send data to',
        'export to',
        'webhook',
        'third-party',
        'external service',
      ]
      
      const proposalText = JSON.stringify(proposal).toLowerCase()
      
      for (const pattern of suspiciousPatterns) {
        if (proposalText.includes(pattern)) {
          // Check if it's an approved integration
          if (!proposalText.includes('approved') && !proposalText.includes('verified')) {
            return {
              passed: false,
              reason: 'Proposal may attempt unauthorized data sharing',
              blockedBy: 'no-data-exfiltration',
            }
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  // COMPLIANCE POLICIES
  {
    id: 'preserve-legal-requirements',
    name: 'Maintain Legal Requirements',
    category: 'compliance',
    severity: 'critical',
    description: 'Never remove legally required functionality (GDPR, privacy policies, etc.)',
    check: (proposal, context) => {
      const legalKeywords = [
        'privacy policy',
        'terms of service',
        'gdpr',
        'data rights',
        'consent',
        'cookie notice',
        'age verification',
      ]
      
      const proposalText = JSON.stringify(proposal).toLowerCase()
      const removeKeywords = ['hide', 'remove', 'disable', 'delete']
      
      for (const legal of legalKeywords) {
        if (proposalText.includes(legal)) {
          for (const remove of removeKeywords) {
            if (proposalText.includes(remove)) {
              return {
                passed: false,
                reason: 'Cannot modify legally required elements',
                blockedBy: 'preserve-legal-requirements',
              }
            }
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  {
    id: 'no-privacy-violations',
    name: 'Respect Privacy Settings',
    category: 'privacy',
    severity: 'critical',
    description: 'Cannot suggest changes that violate user privacy preferences',
    check: (proposal, context) => {
      // Check if proposal tries to make private data public
      if (proposal.proposed_changes?.visibility === 'public' && 
          context.currentPreferences?.visibility === 'private') {
        return {
          passed: false,
          reason: 'Cannot change private data to public without explicit consent',
          blockedBy: 'no-privacy-violations',
        }
      }
      
      // Check if proposal tries to enable data sharing when user disabled it
      if (proposal.proposed_changes?.allowIndexing === true && 
          context.currentPreferences?.allowIndexing === false) {
        return {
          passed: false,
          reason: 'Cannot enable data sharing when user explicitly disabled it',
          blockedBy: 'no-privacy-violations',
        }
      }
      
      return { passed: true }
    },
  },
  
  // FUNCTIONALITY POLICIES
  {
    id: 'no-core-feature-removal',
    name: 'Preserve Core Features',
    category: 'functionality',
    severity: 'high',
    description: 'Cannot suggest removing core platform features',
    check: (proposal, context) => {
      const coreFeatures = [
        'playground',
        'council',
        'memory',
        'profile',
        'settings',
        'navigation',
        'authentication',
        'payment',
      ]
      
      const proposalText = JSON.stringify(proposal).toLowerCase()
      
      for (const feature of coreFeatures) {
        if (proposalText.includes(feature) && 
            (proposalText.includes('remove') || proposalText.includes('hide permanently'))) {
          return {
            passed: false,
            reason: `Cannot remove core feature: ${feature}`,
            blockedBy: 'no-core-feature-removal',
            recommendation: 'Consider hiding or customizing instead of removing',
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  {
    id: 'no-breaking-changes',
    name: 'Prevent Breaking Changes',
    category: 'functionality',
    severity: 'high',
    description: 'Block proposals that would break existing workflows',
    check: (proposal, context) => {
      // Check if proposal removes navigation items user frequently uses
      if (proposal.proposal_type === 'ux_change' && 
          context.userHistory?.favoriteFeatures?.length > 0) {
        
        const proposalText = JSON.stringify(proposal).toLowerCase()
        
        for (const favorite of context.userHistory.favoriteFeatures) {
          if (proposalText.includes(favorite.toLowerCase()) && 
              proposalText.includes('remove')) {
            return {
              passed: false,
              reason: `Cannot remove frequently used feature: ${favorite}`,
              blockedBy: 'no-breaking-changes',
              recommendation: 'This feature is used regularly by the user',
            }
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  // ETHICS POLICIES
  {
    id: 'no-manipulative-patterns',
    name: 'Prevent Dark Patterns',
    category: 'ethics',
    severity: 'high',
    description: 'Block manipulative UX patterns and dark patterns',
    check: (proposal, context) => {
      const darkPatterns = [
        'make harder to cancel',
        'hide unsubscribe',
        'force upgrade',
        'fake urgency',
        'trick user',
        'misleading',
        'deceptive',
        'confusing on purpose',
      ]
      
      const proposalText = JSON.stringify(proposal).toLowerCase()
      
      for (const pattern of darkPatterns) {
        if (proposalText.includes(pattern)) {
          return {
            passed: false,
            reason: 'Proposal contains manipulative patterns',
            blockedBy: 'no-manipulative-patterns',
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  {
    id: 'no-excessive-monetization',
    name: 'Fair Monetization',
    category: 'ethics',
    severity: 'medium',
    description: 'Prevent overly aggressive monetization suggestions',
    check: (proposal, context) => {
      const proposalText = JSON.stringify(proposal).toLowerCase()
      
      // Check for paywall on core free features
      if (proposalText.includes('paywall') || proposalText.includes('require payment')) {
        const freeFeatures = ['basic chat', 'profile', 'settings']
        
        for (const feature of freeFeatures) {
          if (proposalText.includes(feature)) {
            return {
              passed: false,
              reason: 'Cannot add paywall to core free features',
              blockedBy: 'no-excessive-monetization',
            }
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  // DOMAIN-SPECIFIC POLICIES
  {
    id: 'sage-domain-integrity',
    name: 'Maintain Sage Domain Boundaries',
    category: 'functionality',
    severity: 'medium',
    description: 'Ensure sage domain scopes are not violated',
    check: (proposal, context) => {
      if (proposal.proposal_type === 'sage_recommendation') {
        const proposalText = JSON.stringify(proposal).toLowerCase()
        
        // Check if proposal suggests a sage operate outside its domain
        if (proposalText.includes('out of scope') || 
            proposalText.includes('off-domain')) {
          return {
            passed: false,
            reason: 'Proposal violates sage domain boundaries',
            blockedBy: 'sage-domain-integrity',
          }
        }
      }
      
      return { passed: true }
    },
  },
  
  {
    id: 'no-hallucination-encouragement',
    name: 'Prevent AI Hallucinations',
    category: 'safety',
    severity: 'high',
    description: 'Block suggestions that could increase hallucination risk',
    check: (proposal, context) => {
      const proposalText = JSON.stringify(proposal).toLowerCase()
      
      const dangerousChanges = [
        'disable fact checking',
        'remove citations',
        'skip verification',
        'increase creativity to maximum',
        'ignore domain scope',
      ]
      
      for (const change of dangerousChanges) {
        if (proposalText.includes(change)) {
          return {
            passed: false,
            reason: 'Proposal could increase hallucination risk',
            blockedBy: 'no-hallucination-encouragement',
          }
        }
      }
      
      return { passed: true }
    },
  },
]

/**
 * Main governance checker - runs all policies against a proposal
 */
export class GovernanceChecker {
  /**
   * Check if a proposal passes all governance policies
   */
  static async checkProposal(
    proposal: any,
    context: GovernanceContext
  ): Promise<{ approved: boolean; violations: GovernanceCheckResult[]; warnings: GovernanceCheckResult[] }> {
    const violations: GovernanceCheckResult[] = []
    const warnings: GovernanceCheckResult[] = []
    
    for (const policy of GOVERNANCE_POLICIES) {
      try {
        const result = policy.check(proposal, context)
        
        if (!result.passed) {
          if (policy.severity === 'critical' || policy.severity === 'high') {
            violations.push({
              ...result,
              reason: `[${policy.name}] ${result.reason}`,
            })
          } else {
            warnings.push({
              ...result,
              reason: `[${policy.name}] ${result.reason}`,
            })
          }
        }
      } catch (error) {
        console.error(`[Governance] Error checking policy ${policy.id}:`, error)
        // If a policy check fails, fail safe and block the proposal
        violations.push({
          passed: false,
          reason: `Policy check failed: ${policy.name}`,
          blockedBy: policy.id,
        })
      }
    }
    
    return {
      approved: violations.length === 0,
      violations,
      warnings,
    }
  }
  
  /**
   * Get human-readable report of governance check
   */
  static generateReport(checkResult: {
    approved: boolean
    violations: GovernanceCheckResult[]
    warnings: GovernanceCheckResult[]
  }): string {
    if (checkResult.approved && checkResult.warnings.length === 0) {
      return 'Proposal passed all governance checks'
    }
    
    let report = ''
    
    if (checkResult.violations.length > 0) {
      report += 'VIOLATIONS (Proposal Blocked):\n'
      for (const violation of checkResult.violations) {
        report += `- ${violation.reason}\n`
        if (violation.recommendation) {
          report += `  Recommendation: ${violation.recommendation}\n`
        }
      }
    }
    
    if (checkResult.warnings.length > 0) {
      report += '\nWARNINGS (Review Carefully):\n'
      for (const warning of checkResult.warnings) {
        report += `- ${warning.reason}\n`
        if (warning.recommendation) {
          report += `  Recommendation: ${warning.recommendation}\n`
        }
      }
    }
    
    return report
  }
  
  /**
   * Sanitize a proposal - remove dangerous elements
   */
  static sanitizeProposal(proposal: any): any {
    // Remove any script tags, dangerous HTML, or code injection attempts
    const sanitized = JSON.parse(JSON.stringify(proposal))
    
    // Sanitize text fields
    const textFields = ['title', 'description', 'expected_benefit', 'ai_reasoning']
    for (const field of textFields) {
      if (sanitized[field]) {
        sanitized[field] = this.sanitizeText(sanitized[field])
      }
    }
    
    return sanitized
  }
  
  private static sanitizeText(text: string): string {
    // Remove script tags and dangerous HTML
    let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    sanitized = sanitized.replace(/javascript:/gi, '')
    sanitized = sanitized.replace(/on\w+\s*=/gi, '') // Remove event handlers
    
    return sanitized
  }
}
