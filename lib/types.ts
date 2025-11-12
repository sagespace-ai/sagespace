// Core types for SageSpace application

export type Agent = {
  id: string
  name: string
  description: string
  avatar?: string
  status: "active" | "idle" | "thinking"
  role: string
  createdAt: Date
}

export type Message = {
  id: string
  conversationId: string
  agentId: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
  }
}

export type Conversation = {
  id: string
  title: string
  description?: string
  participants: Agent[]
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  archived: boolean
}

export type TimelineEvent = {
  id: string
  conversationId: string
  type: "message" | "agent_joined" | "agent_left" | "conversation_started" | "conversation_ended"
  title: string
  description?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export type Setting = {
  id: string
  key: string
  value: any
  category: "display" | "behavior" | "privacy" | "notifications"
  description: string
  type: "string" | "number" | "boolean" | "select"
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export type TaskPurpose = {
  who: string
  why: string
  legalBasis: string
  retentionWindow: number // days
}

export type Task = {
  id: string
  userId: string
  intent: string
  purpose: TaskPurpose
  status: "pending" | "planning" | "executing" | "reviewing" | "approved" | "rejected" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  requiresPreApproval: boolean
  createdAt: Date
  updatedAt: Date
}

export type PlanStep = {
  id: string
  action: string
  agentRole: string
  toolsRequired: string[]
  dependencies: string[] // step IDs
  acceptanceCriteria: string
  estimatedRisk: number // 0-1
}

export type Plan = {
  id: string
  taskId: string
  steps: PlanStep[]
  riskScore: number
  rationale: string
  signature: string
  createdAt: Date
}

export type PolicyRule = {
  id: string
  name: string
  version: string
  scope: string[]
  conditions: Record<string, any>
  actions: string[]
  jurisdiction?: string
}

export type Policy = {
  id: string
  rules: PolicyRule[]
  version: string
  effectiveFrom: Date
  createdAt: Date
}

export type RiskAssessment = {
  pii: string[]
  licensing: "ok" | "unknown" | "restricted"
  hallucination: number // 0-1
  safetyFlags: string[]
}

export type MessageEnvelope = {
  taskId: string
  actor: "planner" | "orchestrator" | "researcher" | "critic" | "judge" | "safety" | "creator"
  intent: "plan" | "retrieve" | "analyze" | "compose" | "verify" | "adjudicate"
  inputs: Record<string, any>
  outputs?: {
    claims: string[]
    artifacts: any[]
    citations: string[]
  }
  risk: RiskAssessment
  policy: {
    id: string
    version: string
  }
  provenance: {
    tools: string[]
    timestamps: Record<string, Date>
  }
  confidence: number
  signature: string
  createdAt: Date
}

export type AuditEvent = {
  id: string
  taskId: string
  timestamp: Date
  actor: string
  action: string
  before: any
  after: any
  signature: string
  metadata?: Record<string, any>
}

export type Approval = {
  id: string
  taskId: string
  stepId?: string
  reviewerId: string
  decision: "approved" | "rejected" | "modified"
  justification: string
  modifications?: Record<string, any>
  createdAt: Date
}

export type AgentRole =
  | "planner"
  | "orchestrator"
  | "researcher"
  | "creator"
  | "critic"
  | "judge"
  | "safety"
  | "memory"
  | "tool"

export type GovernanceAgent = Agent & {
  role: AgentRole
  trustScore: number
  allowedTools: string[]
  scopes: string[]
  capabilities: string[]
}
