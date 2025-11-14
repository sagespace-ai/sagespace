// Type definitions for the personalization and AI evolution system

export interface UXPreferences {
  theme: 'cosmic' | 'minimal' | 'vibrant'
  density: 'compact' | 'comfortable' | 'spacious'
  animations: boolean
  navigationStyle: 'sidebar' | 'topbar' | 'compact'
  fontSize: 'small' | 'medium' | 'large'
  colorAccent: 'cyan' | 'purple' | 'pink' | 'green'
}

export interface FeatureFlags {
  [featureKey: string]: boolean | string | number
}

export interface AIProposal {
  id: string
  proposalType: 'ux_change' | 'feature_toggle' | 'workflow_automation' | 'sage_recommendation' | 'theme_variant'
  title: string
  description: string
  expectedBenefit: string
  impactLevel: 'low' | 'medium' | 'high'
  proposedChanges: Record<string, any>
  aiReasoning: string
  status: 'pending' | 'approved' | 'rejected' | 'applied'
  createdAt: string
  visualPreview?: string
}

export interface AIProposalData {
  pendingChanges: AIProposal[]
  approvedCount: number
  rejectedCount: number
  reviewStreak: number
}

export interface MemorySummary {
  favoriteFeatures: string[]
  usagePatterns: Record<string, number>
  preferredSages: string[]
  avoidedFeatures: string[]
  peakActivityHours: number[]
}

export interface ObservabilityData {
  navigationPatterns: NavigationPattern[]
  timeOnPage: Record<string, number>
  frictionPoints: FrictionPoint[]
  successSignals: SuccessSignal[]
  lastCollectedAt: string | null
}

export interface NavigationPattern {
  fromPage: string
  toPage: string
  count: number
  avgTimeBeforeNavigation: number
}

export interface FrictionPoint {
  page: string
  component: string
  issueType: 'slow_load' | 'repeated_clicks' | 'abandon' | 'error'
  count: number
  lastOccurred: string
}

export interface SuccessSignal {
  action: string
  page: string
  count: number
  avgCompletionTime: number
}

export interface GovernanceContext {
  safetyLevel: 'permissive' | 'moderate' | 'strict'
  complianceFlags: string[]
  restrictedFeatures: string[]
}

export interface UserPersonalization {
  userId: string
  uxPreferences: UXPreferences
  featureFlags: FeatureFlags
  aiProposals: AIProposalData
  memorySummary: MemorySummary
  observabilityData: ObservabilityData
  governanceContext: GovernanceContext
  createdAt: string
  lastUpdated: string
}

export interface ObservabilityEvent {
  id: string
  userId: string
  eventType: 'page_view' | 'click' | 'abandon' | 'success' | 'error' | 'navigation'
  eventCategory: 'navigation' | 'interaction' | 'completion' | 'friction'
  pagePath?: string
  componentName?: string
  actionName?: string
  metadata: Record<string, any>
  sessionId?: string
  createdAt: string
}

export interface SelfHealingEvent {
  id: string
  eventType: 'slow_response' | 'error' | 'broken_route' | 'hallucination' | 'council_deadlock'
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedComponent: string
  errorDetails: Record<string, any>
  proposedFix: string
  fixApplied: boolean
  fixSuccessful?: boolean
  requiresUserApproval: boolean
  userApproved?: boolean
  createdAt: string
  resolvedAt?: string
}

export interface DesignKarma {
  userId: string
  karmaPoints: number
  architectLevel: number
  proposalsReviewed: number
  proposalsApproved: number
  proposalsRejected: number
  reviewStreak: number
  longestReviewStreak: number
  lastReviewAt?: string
  createdAt: string
}
