/**
 * Client-Safe Type Definitions for the No-Code Agent Builder
 * This file has NO server-side imports and can be safely used in client components
 */

export type TriggerType = 'user-asks' | 'schedule' | 'event' | 'webhook'
export type ConditionType = 'topic-is' | 'sentiment-is' | 'user-role' | 'time-of-day' | 'custom'
export type ActionType = 'use-sage' | 'run-council' | 'summarize' | 'search' | 'integrate' | 'publish'

export interface AgentTrigger {
  id: string
  type: TriggerType
  config: {
    pattern?: string // For user-asks
    schedule?: string // Cron expression
    eventType?: string // For event
    webhookUrl?: string // For webhook
  }
}

export interface AgentCondition {
  id: string
  type: ConditionType
  operator: 'equals' | 'contains' | 'matches' | 'greater-than' | 'less-than'
  value: string
  logicOperator?: 'AND' | 'OR' // How it connects to next condition
}

export interface AgentAction {
  id: string
  type: ActionType
  config: {
    sageId?: string
    councilQuery?: string
    summaryLength?: '3-bullets' | 'paragraph' | 'detailed'
    searchQuery?: string
    integrationId?: string
    integrationAction?: string
    publishToMemory?: boolean
    responseFormat?: string
  }
}

export interface AgentFlowBlock {
  id: string
  type: 'trigger' | 'condition' | 'action'
  data: AgentTrigger | AgentCondition | AgentAction
  position: { x: number; y: number }
  connections: string[] // IDs of connected blocks
}

export interface AgentBehaviorConfig {
  name: string
  description: string
  domain: string
  domainScope: string
  offScope: string
  personality: {
    directness: number // 0-100
    empathy: number // 0-100
    formality: number // 0-100
    creativity: number // 0-100
  }
  reasoning: {
    style: 'chain-of-thought' | 'compressed' | 'structured' | 'top-k'
    maxSteps: number
    requiresCitations: boolean
  }
  capabilities: string[]
  integrations: {
    integrationId: string
    permissions: string[]
    requiresApprovalPerUse: boolean
  }[]
  flowBlocks: AgentFlowBlock[]
  tier: 'free' | 'explorer' | 'voyager' | 'astral' | 'oracle'
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  config: Partial<AgentBehaviorConfig>
  isPublic: boolean
  createdBy: string
  usageCount: number
}
