/**
 * ISO 42001 Compliance Engine - Core compliance tracking for AI operations
 * Tracks data provenance, model provenance, risk classification, and audit logs
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type DataSource = 'user-input' | 'external-integration' | 'memory' | 'knowledge-base'
export type ModelProvider = 'groq' | 'gateway' | 'huggingface' | 'local'

export interface ComplianceContext {
  // Data Provenance
  dataSources: {
    type: DataSource
    origin: string
    timestamp: string
    userId?: string
  }[]
  
  // Model Provenance
  modelUsed: {
    provider: ModelProvider
    modelId: string
    version: string
    routingReason: string
  }
  
  // Risk Classification
  riskLevel: RiskLevel
  riskFactors: string[]
  requiresHumanReview: boolean
  
  // Guardrail Enforcement
  guardrailsApplied: {
    guardrailId: string
    description: string
    passed: boolean
    timestamp: string
  }[]
  
  // User Context
  userId: string
  sessionId: string
  agentId?: string
  
  // Audit Trail
  correlationId: string
}

export interface ComplianceLog {
  id: string
  timestamp: string
  correlationId: string
  
  // Who/What
  userId: string
  sessionId: string
  agentId?: string
  
  // Input
  inputSummary: string
  inputTokenCount: number
  dataSources: DataSource[]
  
  // Processing
  modelProvider: ModelProvider
  modelId: string
  modelVersion: string
  routingReason: string
  processingTimeMs: number
  
  // Output
  outputSummary: string
  outputTokenCount: number
  riskLevel: RiskLevel
  riskFactors: string[]
  
  // Compliance
  guardrailsPassed: boolean
  requiresHumanReview: boolean
  humanReviewCompleted: boolean
  humanReviewerId?: string
  
  // Governance
  governanceChecksPassed: boolean
  governanceViolations: string[]
  
  // Metadata
  metadata: Record<string, any>
}

export class ISO42001ComplianceEngine {
  /**
   * Create a new compliance context for an AI operation
   */
  static createContext(params: {
    userId: string
    sessionId: string
    agentId?: string
    inputData: string
    dataSources: { type: DataSource; origin: string }[]
  }): ComplianceContext {
    const correlationId = `iso-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      dataSources: params.dataSources.map(source => ({
        ...source,
        timestamp: new Date().toISOString(),
        userId: params.userId,
      })),
      modelUsed: {
        provider: 'groq', // Default to Groq per Charter
        modelId: 'llama-3.3-70b-versatile',
        version: '1.0',
        routingReason: 'Charter-mandated Groq-first routing',
      },
      riskLevel: this.classifyRisk(params.inputData, params.dataSources),
      riskFactors: this.identifyRiskFactors(params.inputData),
      requiresHumanReview: false,
      guardrailsApplied: [],
      userId: params.userId,
      sessionId: params.sessionId,
      agentId: params.agentId,
      correlationId,
    }
  }
  
  /**
   * Classify risk level based on input and data sources
   */
  private static classifyRisk(input: string, sources: { type: DataSource }[]): RiskLevel {
    const inputLower = input.toLowerCase()
    
    // Critical risk: External integrations + sensitive actions
    if (sources.some(s => s.type === 'external-integration')) {
      if (inputLower.includes('execute') || inputLower.includes('send') || inputLower.includes('delete')) {
        return 'critical'
      }
      return 'high'
    }
    
    // High risk: Code execution, financial, legal
    if (inputLower.includes('code') || inputLower.includes('script') || 
        inputLower.includes('financial') || inputLower.includes('legal advice')) {
      return 'high'
    }
    
    // Medium risk: Planning, workflow changes
    if (inputLower.includes('plan') || inputLower.includes('workflow') || inputLower.includes('automate')) {
      return 'medium'
    }
    
    // Low risk: Q&A, summaries
    return 'low'
  }
  
  /**
   * Identify specific risk factors
   */
  private static identifyRiskFactors(input: string): string[] {
    const factors: string[] = []
    const inputLower = input.toLowerCase()
    
    if (inputLower.includes('personal') || inputLower.includes('private')) {
      factors.push('personal-data')
    }
    if (inputLower.includes('financial') || inputLower.includes('payment')) {
      factors.push('financial-data')
    }
    if (inputLower.includes('medical') || inputLower.includes('health')) {
      factors.push('health-data')
    }
    if (inputLower.includes('code') || inputLower.includes('execute')) {
      factors.push('code-execution')
    }
    if (inputLower.includes('send') || inputLower.includes('share') || inputLower.includes('export')) {
      factors.push('data-exfiltration-risk')
    }
    
    return factors
  }
  
  /**
   * Update context with model information
   */
  static updateModelInfo(
    context: ComplianceContext,
    modelInfo: {
      provider: ModelProvider
      modelId: string
      version: string
      routingReason: string
    }
  ): ComplianceContext {
    return {
      ...context,
      modelUsed: modelInfo,
    }
  }
  
  /**
   * Apply a guardrail check
   */
  static applyGuardrail(
    context: ComplianceContext,
    guardrail: {
      guardrailId: string
      description: string
      passed: boolean
    }
  ): ComplianceContext {
    const updated = {
      ...context,
      guardrailsApplied: [
        ...context.guardrailsApplied,
        {
          ...guardrail,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    
    // If any critical guardrail fails, require human review
    if (!guardrail.passed && (context.riskLevel === 'high' || context.riskLevel === 'critical')) {
      updated.requiresHumanReview = true
    }
    
    return updated
  }
  
  /**
   * Create audit log entry
   */
  static createAuditLog(params: {
    context: ComplianceContext
    input: string
    output: string
    inputTokens: number
    outputTokens: number
    processingTimeMs: number
    governanceResult: {
      passed: boolean
      violations: string[]
    }
  }): ComplianceLog {
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      correlationId: params.context.correlationId,
      
      // Who/What
      userId: params.context.userId,
      sessionId: params.context.sessionId,
      agentId: params.context.agentId,
      
      // Input
      inputSummary: params.input.substring(0, 500), // First 500 chars
      inputTokenCount: params.inputTokens,
      dataSources: params.context.dataSources.map(s => s.type),
      
      // Processing
      modelProvider: params.context.modelUsed.provider,
      modelId: params.context.modelUsed.modelId,
      modelVersion: params.context.modelUsed.version,
      routingReason: params.context.modelUsed.routingReason,
      processingTimeMs: params.processingTimeMs,
      
      // Output
      outputSummary: params.output.substring(0, 500),
      outputTokenCount: params.outputTokens,
      riskLevel: params.context.riskLevel,
      riskFactors: params.context.riskFactors,
      
      // Compliance
      guardrailsPassed: params.context.guardrailsApplied.every(g => g.passed),
      requiresHumanReview: params.context.requiresHumanReview,
      humanReviewCompleted: false,
      
      // Governance
      governanceChecksPassed: params.governanceResult.passed,
      governanceViolations: params.governanceResult.violations,
      
      // Metadata
      metadata: {
        guardrails: params.context.guardrailsApplied,
      },
    }
  }
  
  /**
   * Save audit log to database
   */
  static async saveAuditLog(log: ComplianceLog, supabase: any): Promise<void> {
    const { error } = await supabase
      .from('compliance_audit_logs')
      .insert({
        id: log.id,
        correlation_id: log.correlationId,
        user_id: log.userId,
        session_id: log.sessionId,
        agent_id: log.agentId,
        input_summary: log.inputSummary,
        input_token_count: log.inputTokenCount,
        data_sources: log.dataSources,
        model_provider: log.modelProvider,
        model_id: log.modelId,
        model_version: log.modelVersion,
        routing_reason: log.routingReason,
        processing_time_ms: log.processingTimeMs,
        output_summary: log.outputSummary,
        output_token_count: log.outputTokenCount,
        risk_level: log.riskLevel,
        risk_factors: log.riskFactors,
        guardrails_passed: log.guardrailsPassed,
        requires_human_review: log.requiresHumanReview,
        governance_checks_passed: log.governanceChecksPassed,
        governance_violations: log.governanceViolations,
        metadata: log.metadata,
        created_at: log.timestamp,
      })
    
    if (error) {
      console.error('[ISO42001] Failed to save audit log:', error)
      throw new Error('Failed to save compliance audit log')
    }
  }
  
  /**
   * Generate compliance report for a user or time period
   */
  static async generateComplianceReport(params: {
    supabase: any
    userId?: string
    startDate?: string
    endDate?: string
    riskLevel?: RiskLevel
  }): Promise<{
    totalOperations: number
    riskBreakdown: Record<RiskLevel, number>
    modelProviderBreakdown: Record<ModelProvider, number>
    guardrailsFailures: number
    governanceViolations: number
    requiresReviewCount: number
    averageProcessingTime: number
  }> {
    let query = params.supabase
      .from('compliance_audit_logs')
      .select('*')
    
    if (params.userId) {
      query = query.eq('user_id', params.userId)
    }
    if (params.startDate) {
      query = query.gte('created_at', params.startDate)
    }
    if (params.endDate) {
      query = query.lte('created_at', params.endDate)
    }
    if (params.riskLevel) {
      query = query.eq('risk_level', params.riskLevel)
    }
    
    const { data: logs, error } = await query
    
    if (error) {
      console.error('[ISO42001] Failed to fetch logs for report:', error)
      throw new Error('Failed to generate compliance report')
    }
    
    const report = {
      totalOperations: logs?.length || 0,
      riskBreakdown: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      } as Record<RiskLevel, number>,
      modelProviderBreakdown: {
        groq: 0,
        gateway: 0,
        huggingface: 0,
        local: 0,
      } as Record<ModelProvider, number>,
      guardrailsFailures: 0,
      governanceViolations: 0,
      requiresReviewCount: 0,
      averageProcessingTime: 0,
    }
    
    if (!logs || logs.length === 0) return report
    
    let totalProcessingTime = 0
    
    for (const log of logs) {
      // Risk breakdown
      report.riskBreakdown[log.risk_level as RiskLevel]++
      
      // Model provider breakdown
      report.modelProviderBreakdown[log.model_provider as ModelProvider]++
      
      // Guardrails failures
      if (!log.guardrails_passed) {
        report.guardrailsFailures++
      }
      
      // Governance violations
      if (!log.governance_checks_passed) {
        report.governanceViolations++
      }
      
      // Requires review
      if (log.requires_human_review) {
        report.requiresReviewCount++
      }
      
      // Processing time
      totalProcessingTime += log.processing_time_ms || 0
    }
    
    report.averageProcessingTime = totalProcessingTime / logs.length
    
    return report
  }
}
