/**
 * Self-Healing Integration for Agent Builder
 * Detects and auto-fixes issues with custom agents
 */

import type { AgentBehaviorConfig } from '@/lib/agents/agent-builder-types'
import { GovernanceChecker } from '@/lib/governance/policy'

export interface AgentHealthCheck {
  agentId: string
  agentName: string
  issues: AgentIssue[]
  healthScore: number // 0-100
  lastChecked: string
}

export interface AgentIssue {
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'config' | 'integration' | 'compliance' | 'performance'
  description: string
  autoFixable: boolean
  proposedFix?: any
}

export class AgentBuilderHealer {
  /**
   * Run health check on an agent
   */
  static async checkAgentHealth(
    agentId: string,
    config: AgentBehaviorConfig,
    supabase: any
  ): Promise<AgentHealthCheck> {
    const issues: AgentIssue[] = []
    
    // Check 1: Missing required fields
    if (!config.name || config.name.trim() === '') {
      issues.push({
        severity: 'critical',
        category: 'config',
        description: 'Agent name is missing',
        autoFixable: true,
        proposedFix: { name: 'Untitled Agent' },
      })
    }
    
    if (!config.domain) {
      issues.push({
        severity: 'high',
        category: 'config',
        description: 'Agent domain is not set',
        autoFixable: true,
        proposedFix: { domain: 'General' },
      })
    }
    
    // Check 2: Domain scope validation
    if (config.domainScope && config.domainScope.length < 20) {
      issues.push({
        severity: 'medium',
        category: 'config',
        description: 'Domain scope is too vague',
        autoFixable: false,
      })
    }
    
    // Check 3: Integration permissions
    if (config.integrations && config.integrations.length > 0) {
      for (const integration of config.integrations) {
        // Check if integration exists in registry
        const { data: userIntegration } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('integration_type', integration.integrationId)
          .eq('is_active', true)
          .single()
        
        if (!userIntegration) {
          issues.push({
            severity: 'high',
            category: 'integration',
            description: `Integration '${integration.integrationId}' is not connected`,
            autoFixable: false,
          })
        }
      }
    }
    
    // Check 4: Flow block validation
    if (config.flowBlocks && config.flowBlocks.length > 0) {
      const triggers = config.flowBlocks.filter(b => b.type === 'trigger')
      if (triggers.length === 0) {
        issues.push({
          severity: 'medium',
          category: 'config',
          description: 'No trigger blocks defined - agent may not respond',
          autoFixable: true,
          proposedFix: {
            addBlock: {
              type: 'trigger',
              data: { type: 'user-asks', config: {} },
            },
          },
        })
      }
      
      // Check for orphaned blocks (no connections)
      const orphanedBlocks = config.flowBlocks.filter(b => b.connections.length === 0)
      if (orphanedBlocks.length > 1) {
        issues.push({
          severity: 'low',
          category: 'config',
          description: `${orphanedBlocks.length} blocks are not connected`,
          autoFixable: false,
        })
      }
    }
    
    // Check 5: Governance compliance
    const governanceResult = await GovernanceChecker.checkProposal(
      {
        proposal_type: 'agent_health_check',
        proposed_changes: config,
      },
      {
        userId: 'system',
        currentPreferences: {},
        userHistory: {},
        platformConfig: {},
      }
    )
    
    if (!governanceResult.approved) {
      for (const violation of governanceResult.violations) {
        issues.push({
          severity: 'critical',
          category: 'compliance',
          description: violation.reason || 'Governance violation',
          autoFixable: false,
        })
      }
    }
    
    // Check 6: Performance issues
    if (config.reasoning?.maxSteps && config.reasoning.maxSteps > 10) {
      issues.push({
        severity: 'medium',
        category: 'performance',
        description: 'Max reasoning steps is very high - may be slow',
        autoFixable: true,
        proposedFix: { 'reasoning.maxSteps': 5 },
      })
    }
    
    // Calculate health score
    const criticalCount = issues.filter(i => i.severity === 'critical').length
    const highCount = issues.filter(i => i.severity === 'high').length
    const mediumCount = issues.filter(i => i.severity === 'medium').length
    const lowCount = issues.filter(i => i.severity === 'low').length
    
    let healthScore = 100
    healthScore -= criticalCount * 30
    healthScore -= highCount * 20
    healthScore -= mediumCount * 10
    healthScore -= lowCount * 5
    healthScore = Math.max(0, healthScore)
    
    return {
      agentId,
      agentName: config.name || 'Unknown',
      issues,
      healthScore,
      lastChecked: new Date().toISOString(),
    }
  }
  
  /**
   * Auto-fix agent issues
   */
  static async autoFixAgent(
    agentId: string,
    config: AgentBehaviorConfig,
    issues: AgentIssue[],
    supabase: any
  ): Promise<{ fixed: boolean; newConfig: AgentBehaviorConfig; fixLog: string[] }> {
    const fixLog: string[] = []
    let newConfig = { ...config }
    let fixedAny = false
    
    for (const issue of issues) {
      if (!issue.autoFixable || !issue.proposedFix) continue
      
      try {
        // Apply proposed fix
        if (issue.proposedFix.name) {
          newConfig.name = issue.proposedFix.name
          fixLog.push(`Fixed: Set agent name to '${issue.proposedFix.name}'`)
          fixedAny = true
        }
        
        if (issue.proposedFix.domain) {
          newConfig.domain = issue.proposedFix.domain
          fixLog.push(`Fixed: Set domain to '${issue.proposedFix.domain}'`)
          fixedAny = true
        }
        
        if (issue.proposedFix.addBlock) {
          newConfig.flowBlocks = newConfig.flowBlocks || []
          newConfig.flowBlocks.push({
            id: `block-${Date.now()}`,
            ...issue.proposedFix.addBlock,
            position: { x: 100, y: 100 },
            connections: [],
          })
          fixLog.push(`Fixed: Added trigger block`)
          fixedAny = true
        }
        
        if (issue.proposedFix['reasoning.maxSteps']) {
          newConfig.reasoning = newConfig.reasoning || { style: 'chain-of-thought', maxSteps: 5, requiresCitations: true }
          newConfig.reasoning.maxSteps = issue.proposedFix['reasoning.maxSteps']
          fixLog.push(`Fixed: Reduced max steps to ${issue.proposedFix['reasoning.maxSteps']}`)
          fixedAny = true
        }
      } catch (error) {
        console.error('[v0] Failed to apply fix:', error)
        fixLog.push(`Failed: ${issue.description}`)
      }
    }
    
    // Save fixed config to database if any fixes were applied
    if (fixedAny) {
      const { error } = await supabase
        .from('agents')
        .update({
          name: newConfig.name,
          domain_scope: newConfig.domainScope,
          role: newConfig.domain,
        })
        .eq('id', agentId)
      
      if (error) {
        console.error('[v0] Failed to save auto-fixed agent:', error)
      } else {
        fixLog.push('Saved fixes to database')
      }
      
      // Log to self-healing events
      await supabase.from('self_healing_events').insert({
        event_type: 'agent_auto_fix',
        affected_component: `agent:${agentId}`,
        severity: 'medium',
        proposed_fix: JSON.stringify(fixLog),
        fix_applied: true,
        fix_successful: !error,
        requires_user_approval: false,
      })
    }
    
    return {
      fixed: fixedAny,
      newConfig,
      fixLog,
    }
  }
  
  /**
   * Run periodic health checks on all agents
   */
  static async runPeriodicHealthChecks(supabase: any): Promise<{
    totalAgents: number
    healthyAgents: number
    unhealthyAgents: number
    autoFixedAgents: number
  }> {
    const { data: agents } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'active')
    
    if (!agents || agents.length === 0) {
      return { totalAgents: 0, healthyAgents: 0, unhealthyAgents: 0, autoFixedAgents: 0 }
    }
    
    let healthyAgents = 0
    let unhealthyAgents = 0
    let autoFixedAgents = 0
    
    for (const agent of agents) {
      const config: AgentBehaviorConfig = {
        name: agent.name,
        description: agent.description,
        domain: agent.role,
        domainScope: agent.domain_scope,
        offScope: agent.off_scope,
        personality: { directness: 50, empathy: 50, formality: 50, creativity: 50 },
        reasoning: { style: 'chain-of-thought', maxSteps: 5, requiresCitations: true },
        capabilities: [],
        integrations: [],
        flowBlocks: [],
        tier: 'free',
      }
      
      const healthCheck = await this.checkAgentHealth(agent.id, config, supabase)
      
      if (healthCheck.healthScore >= 80) {
        healthyAgents++
      } else {
        unhealthyAgents++
        
        // Auto-fix if possible
        const autoFixableIssues = healthCheck.issues.filter(i => i.autoFixable)
        if (autoFixableIssues.length > 0) {
          const fixResult = await this.autoFixAgent(agent.id, config, autoFixableIssues, supabase)
          if (fixResult.fixed) {
            autoFixedAgents++
            console.log(`[v0] Auto-fixed agent ${agent.id}:`, fixResult.fixLog)
          }
        }
      }
    }
    
    return {
      totalAgents: agents.length,
      healthyAgents,
      unhealthyAgents,
      autoFixedAgents,
    }
  }
}
