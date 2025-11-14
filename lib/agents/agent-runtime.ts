/**
 * Agent Runtime - Executes custom agents built in Studio
 */

import { ISO42001ComplianceEngine, type ComplianceContext } from '@/lib/compliance/iso42001-engine'
import { GovernanceChecker } from '@/lib/governance/policy'
import { IntegrationManager, type IntegrationType } from '@/lib/integrations/integration-registry'
import type { AgentBehaviorConfig, AgentFlowBlock } from './agent-builder-types'

export interface AgentExecutionContext {
  userId: string
  sessionId: string
  agentId: string
  userMessage: string
  conversationHistory: { role: string; content: string }[]
  userTier: string
}

export interface AgentExecutionResult {
  response: string
  usedIntegrations: IntegrationType[]
  complianceLog: any
  metadata: {
    processingTimeMs: number
    tokenCount: number
    flowSteps: string[]
  }
}

export class AgentRuntime {
  /**
   * Execute an agent based on its configuration
   */
  static async execute(
    config: AgentBehaviorConfig,
    context: AgentExecutionContext,
    supabase: any
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now()
    const flowSteps: string[] = []
    const usedIntegrations: IntegrationType[] = []
    
    console.log('[v0] Agent Runtime: Starting execution for', config.name)
    
    // Create compliance context
    const complianceContext = ISO42001ComplianceEngine.createContext({
      userId: context.userId,
      sessionId: context.sessionId,
      agentId: context.agentId,
      inputData: context.userMessage,
      dataSources: [{ type: 'user-input', origin: 'playground' }],
    })
    
    // Check if user has required tier
    if (config.tier && !this.checkTierAccess(config.tier, context.userTier)) {
      throw new Error(`This agent requires ${config.tier} tier or higher`)
    }
    
    // Execute flow blocks
    let response = ''
    
    for (const block of config.flowBlocks || []) {
      flowSteps.push(`${block.type}: ${block.id}`)
      
      if (block.type === 'trigger') {
        // Triggers are evaluated elsewhere, skip in runtime
        continue
      }
      
      if (block.type === 'condition') {
        const conditionMet = await this.evaluateCondition(block, context)
        flowSteps.push(`condition-result: ${conditionMet}`)
        if (!conditionMet) {
          break // Stop flow if condition fails
        }
      }
      
      if (block.type === 'action') {
        const actionResult = await this.executeAction(block, context, usedIntegrations, supabase)
        response += actionResult + '\n\n'
        flowSteps.push(`action-result: ${actionResult.substring(0, 50)}...`)
      }
    }
    
    // If no flow blocks or no response yet, use personality-based response
    if (!response.trim()) {
      response = await this.generatePersonalityResponse(config, context, supabase)
    }
    
    const processingTime = Date.now() - startTime
    
    // Governance check
    const governanceResult = await GovernanceChecker.checkProposal(
      {
        proposal_type: 'agent_response',
        proposed_changes: { response },
      },
      {
        userId: context.userId,
        currentPreferences: {},
        userHistory: {},
        platformConfig: {},
      }
    )
    
    if (!governanceResult.approved) {
      console.error('[Agent Runtime] Governance check failed:', governanceResult.violations)
      throw new Error('Response failed governance checks')
    }
    
    // Create audit log
    const auditLog = ISO42001ComplianceEngine.createAuditLog({
      context: complianceContext,
      input: context.userMessage,
      output: response,
      inputTokens: context.userMessage.length / 4,
      outputTokens: response.length / 4,
      processingTimeMs: processingTime,
      governanceResult: {
        passed: governanceResult.approved,
        violations: governanceResult.violations.map(v => v.reason || ''),
      },
    })
    
    // Save audit log
    await ISO42001ComplianceEngine.saveAuditLog(auditLog, supabase)
    
    // Save to agent execution history
    await supabase.from('agent_execution_history').insert({
      agent_id: context.agentId,
      user_id: context.userId,
      execution_type: 'chat',
      integrations_used: usedIntegrations,
      input_summary: context.userMessage.substring(0, 500),
      output_summary: response.substring(0, 500),
      risk_level: complianceContext.riskLevel,
      compliance_checks_passed: governanceResult.approved,
      execution_time_ms: processingTime,
      metadata: { flowSteps },
    })
    
    return {
      response: response.trim(),
      usedIntegrations,
      complianceLog: auditLog,
      metadata: {
        processingTimeMs: processingTime,
        tokenCount: response.length / 4,
        flowSteps,
      },
    }
  }
  
  /**
   * Check if user has required tier access
   */
  private static checkTierAccess(requiredTier: string, userTier: string): boolean {
    const tiers = ['free', 'explorer', 'voyager', 'astral', 'oracle', 'celestial']
    return tiers.indexOf(userTier) >= tiers.indexOf(requiredTier)
  }
  
  /**
   * Evaluate a condition block
   */
  private static async evaluateCondition(
    block: AgentFlowBlock,
    context: AgentExecutionContext
  ): Promise<boolean> {
    const condition = block.data as any
    const message = context.userMessage.toLowerCase()
    
    switch (condition.type) {
      case 'topic-is':
        return message.includes(condition.value.toLowerCase())
      case 'sentiment-is':
        // Simplified sentiment analysis
        const positive = ['happy', 'great', 'good', 'excellent', 'love']
        const negative = ['sad', 'bad', 'angry', 'hate', 'terrible']
        if (condition.value === 'positive') {
          return positive.some(word => message.includes(word))
        }
        if (condition.value === 'negative') {
          return negative.some(word => message.includes(word))
        }
        return true
      default:
        return true
    }
  }
  
  /**
   * Execute an action block
   */
  private static async executeAction(
    block: AgentFlowBlock,
    context: AgentExecutionContext,
    usedIntegrations: IntegrationType[],
    supabase: any
  ): Promise<string> {
    const action = block.data as any
    
    switch (action.type) {
      case 'use-sage':
        // Delegate to another sage
        return `[Delegated to sage: ${action.config.sageId}]`
      
      case 'summarize':
        return this.generateSummary(context.userMessage, action.config.summaryLength)
      
      case 'search':
        return `[Search results for: ${action.config.searchQuery}]`
      
      case 'integrate':
        // Validate integration access
        const integrationId = action.config.integrationId as IntegrationType
        const validationResult = await IntegrationManager.validateIntegrationUse({
          integrationId,
          agentId: context.agentId,
          userId: context.userId,
          action: action.config.integrationAction || 'read',
          data: {},
        })
        
        if (!validationResult.approved) {
          return `[Integration blocked: ${validationResult.reason}]`
        }
        
        usedIntegrations.push(integrationId)
        return `[Used integration: ${integrationId}]`
      
      case 'publish':
        if (action.config.publishToMemory) {
          await supabase.from('messages').insert({
            conversation_id: context.sessionId,
            agent_id: context.agentId,
            role: 'assistant',
            content: context.userMessage,
          })
          return '[Published to memory]'
        }
        return '[Published]'
      
      default:
        return '[Unknown action]'
    }
  }
  
  /**
   * Generate summary based on length preference
   */
  private static generateSummary(text: string, length: string): string {
    switch (length) {
      case '3-bullets':
        return `Key points:\n• Main idea 1\n• Main idea 2\n• Main idea 3`
      case 'paragraph':
        return `In summary: ${text.substring(0, 200)}...`
      case 'detailed':
        return `Detailed analysis: ${text}`
      default:
        return text
    }
  }
  
  /**
   * Generate response based on agent personality
   */
  private static async generatePersonalityResponse(
    config: AgentBehaviorConfig,
    context: AgentExecutionContext,
    supabase: any
  ): Promise<string> {
    // Build personality-aware system prompt
    const personality = config.personality || {
      directness: 50,
      empathy: 50,
      formality: 50,
      creativity: 50,
    }
    
    let stylePrompt = ''
    
    if (personality.directness > 70) {
      stylePrompt += 'Be direct and concise. '
    } else if (personality.directness < 30) {
      stylePrompt += 'Be thoughtful and elaborate. '
    }
    
    if (personality.empathy > 70) {
      stylePrompt += 'Show warmth and understanding. '
    }
    
    if (personality.formality > 70) {
      stylePrompt += 'Use professional language. '
    } else if (personality.formality < 30) {
      stylePrompt += 'Use casual, friendly language. '
    }
    
    if (personality.creativity > 70) {
      stylePrompt += 'Be creative and imaginative. '
    }
    
    const systemPrompt = `You are ${config.name}. ${config.description}

Domain: ${config.domain}
Domain Scope: ${config.domainScope}
Off-Scope: ${config.offScope}

Style: ${stylePrompt}

Respond to the user's message while staying within your domain boundaries.`
    
    // Use Groq for response (Charter-mandated)
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...context.conversationHistory,
            { role: 'user', content: context.userMessage },
          ],
          temperature: personality.creativity / 100,
          max_tokens: 1000,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Groq API error')
      }
      
      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('[Agent Runtime] Groq API error:', error)
      return `I apologize, but I'm having trouble generating a response right now. Please try again.`
    }
  }
}
