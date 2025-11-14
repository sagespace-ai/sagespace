# Dreamer v2: The Complete Specification

**Version**: 2.0  
**Status**: Implementation Guide  
**Last Updated**: 2025-01-14

This document provides the complete technical specification for implementing Dreamer v2, the AI-powered UX analyst and architect system that makes SageSpace self-evolving.

---

## Overview

Dreamer v2 transforms generic AI suggestions into concrete, actionable, template-based improvements by combining:

1. **Behavioral Signal Collection** - Track what users actually do
2. **Semantic Analysis** - Understand why they do it
3. **Page Classification** - Context-aware recommendations
4. **UX Template Library** - Concrete, proven patterns
5. **Scoring Model** - Rank proposals by value
6. **Governance Filters** - Ensure safety and compliance

---

## Part 1: Behavioral Signal Collection

### What to Track

\`\`\`typescript
interface UserBehaviorEvent {
  userId: string | null
  event: string
  data: {
    // Navigation
    from_page?: string
    to_page?: string
    time_spent_ms?: number
    
    // Interactions
    sage_id?: string
    sage_category?: string
    mood_selected?: string
    query_text?: string
    
    // Success/Friction
    session_completed?: boolean
    error_occurred?: boolean
    retry_count?: number
    abandoned?: boolean
  }
  createdAt: Date
}
\`\`\`

### Events to Collect

**Navigation Events:**
- `PAGE_VIEW` - User lands on page
- `PAGE_EXIT` - User leaves page
- `PAGE_TRANSITION` - User navigates between pages

**Interaction Events:**
- `SAGE_SELECTED` - User picks a Sage
- `SAGE_CATEGORY_BROWSED` - User filters by category
- `MOOD_CHANGED` - User adjusts mood selector
- `QUERY_SUBMITTED` - User sends message
- `COUNCIL_ESCALATED` - User escalates to Council

**Success Events:**
- `SESSION_COMPLETED` - Long engagement (> 5 min)
- `PERSONA_SAVED` - User creates custom Sage
- `CONVERSATION_BOOKMARKED` - User saves to Memory

**Friction Events:**
- `RAGE_CLICK` - Multiple clicks in < 1 sec
- `FLOW_ABANDONED` - User exits mid-task
- `ERROR_ENCOUNTERED` - API/UI error
- `RETRY_NEEDED` - User retries action

### Implementation

\`\`\`typescript
// lib/ai/observability.ts
export class ObservabilityCollector {
  async trackEvent(event: UserBehaviorEvent): Promise<void> {
    // Insert into observability_events table
    await supabase.from('observability_events').insert({
      user_id: event.userId,
      event_type: event.event,
      page_path: event.data.from_page || event.data.to_page,
      metadata: event.data,
      created_at: event.createdAt
    })
  }
  
  async getPatterns(userId: string, since: Date): Promise<UserPattern> {
    const events = await this.getEventsSince(userId, since)
    
    return {
      frequentPages: this.analyzePageFrequency(events),
      preferredSages: this.analyzeSageUsage(events),
      commonTransitions: this.analyzeNavigationFlow(events),
      frictionPoints: this.identifyFriction(events),
      successPatterns: this.identifySuccess(events)
    }
  }
}
\`\`\`

---

## Part 2: Dreamer v2 Proposal Engine

### Page Classification

Every page in SageSpace belongs to one of these categories:

\`\`\`typescript
enum PageType {
  CORE_ACTION = 'core_action',    // Playground, Council
  DISCOVERY = 'discovery',          // Multiverse, Studio
  UTILITY = 'utility',              // Settings, Profile
  INSIGHT = 'insight',              // Memory, Observatory
  ONBOARDING = 'onboarding'         // Genesis
}

const PAGE_CLASSIFICATION: Record<string, PageType> = {
  '/playground': PageType.CORE_ACTION,
  '/council': PageType.CORE_ACTION,
  '/multiverse': PageType.DISCOVERY,
  '/persona-editor': PageType.DISCOVERY,
  '/settings': PageType.UTILITY,
  '/profile': PageType.UTILITY,
  '/memory': PageType.INSIGHT,
  '/observatory': PageType.INSIGHT,
  '/genesis': PageType.ONBOARDING
}
\`\`\`

### Proposal Types

Dreamer v2 supports 12 concrete proposal types:

1. **Navigation Shortcuts** - Add quick-access buttons
2. **Sage Recommendations** - Suggest specific Sages
3. **Layout Adjustments** - Reposition components
4. **Component Repositioning** - Move panels, cards
5. **CTA Improvements** - Enhance call-to-action buttons
6. **Persona Suggestions** - Recommend custom Sages
7. **Background Variants** - Adjust cosmic theme
8. **Onboarding Flow Updates** - Streamline Genesis
9. **Studio Template Suggestions** - Preset persona configs
10. **Memory Enhancements** - Add filters, search
11. **Error-Avoidance Recommendations** - Prevent friction
12. **Performance Optimization** - Speed improvements

### Semantic Analysis

\`\`\`typescript
async function analyzeSemantics(userId: string): Promise<SemanticProfile> {
  const events = await getRecentEvents(userId, { days: 30 })
  
  // Extract text from queries and transcripts
  const texts = events
    .filter(e => e.event === 'QUERY_SUBMITTED')
    .map(e => e.data.query_text)
  
  // Generate embeddings (using OpenAI or similar)
  const embeddings = await generateEmbeddings(texts)
  
  // Cluster to find topics
  const topics = clusterEmbeddings(embeddings)
  
  return {
    dominantTopics: topics.slice(0, 5),
    preferredMoods: extractMoods(events),
    sageAffinities: extractSagePreferences(events),
    queryComplexity: analyzeQueryLength(events)
  }
}
\`\`\`

### Proposal Generation

\`\`\`typescript
// lib/ai/dreamer.ts
export class DreamerV2 {
  async generateProposals(userId: string): Promise<AIProposal[]> {
    // 1. Gather behavioral patterns
    const patterns = await this.observability.getPatterns(userId, thirtyDaysAgo)
    
    // 2. Perform semantic analysis
    const semantics = await this.analyzeSemantics(userId)
    
    // 3. Classify user's page usage
    const pageUsage = this.classifyPageUsage(patterns.frequentPages)
    
    // 4. Generate template-based proposals
    const proposals: AIProposal[] = []
    
    // If user heavily uses Playground
    if (pageUsage.CORE_ACTION > 0.5) {
      proposals.push(await this.uxTemplates.navigationShortcut({
        from: '/demo',
        to: '/playground',
        reason: `You visit Playground ${Math.round(pageUsage.CORE_ACTION * 100)}% of the time`
      }))
    }
    
    // If user has preferred Sages
    if (semantics.sageAffinities.length > 0) {
      proposals.push(await this.uxTemplates.sageRecommendation({
        sageIds: semantics.sageAffinities.slice(0, 3),
        reason: 'Based on your conversation topics and patterns'
      }))
    }
    
    // If user has friction in Studio
    if (patterns.frictionPoints.some(f => f.page === '/persona-editor')) {
      proposals.push(await this.uxTemplates.studioTemplate({
        templates: ['Technical Expert', 'Creative Writer'],
        reason: 'Speed up persona creation with templates'
      }))
    }
    
    // 5. Score proposals
    const scoredProposals = proposals.map(p => ({
      ...p,
      score: this.scoring.calculate(p, patterns, semantics)
    }))
    
    // 6. Filter out low-value proposals
    return scoredProposals.filter(p => p.score >= 50)
  }
}
\`\`\`

---

## Part 3: UX Template Library

### Template Structure

\`\`\`typescript
// lib/ai/uxTemplates.ts
export class UXTemplateLibrary {
  // Navigation Improvements
  async navigationShortcut(params: {
    from: string
    to: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      title: `Add Quick Access to ${getPageLabel(params.to)}`,
      description: `Add a prominent button on ${getPageLabel(params.from)} to jump directly to ${getPageLabel(params.to)}`,
      category: 'navigation',
      expectedBenefit: 'Save 2 clicks per session',
      aiReasoning: params.reason,
      impactLevel: 'medium',
      change: {
        type: 'add_component',
        target: `${params.from}_quick_actions`,
        config: {
          component: 'Button',
          props: {
            href: params.to,
            label: `Go to ${getPageLabel(params.to)}`,
            variant: 'cosmic'
          }
        }
      },
      uxTemplateId: 'navigation_shortcut_v1',
      score: 0 // Will be calculated
    }
  }
  
  // Layout Enhancements
  async layoutAdjustment(params: {
    page: string
    component: string
    newPosition: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      title: `Move ${params.component} on ${getPageLabel(params.page)}`,
      description: `Relocate ${params.component} to ${params.newPosition} for better visibility`,
      category: 'layout',
      expectedBenefit: 'Reduce time to find key features',
      aiReasoning: params.reason,
      impactLevel: 'low',
      change: {
        type: 'reposition_component',
        target: `${params.page}_${params.component}`,
        config: {
          newPosition: params.newPosition
        }
      },
      uxTemplateId: 'layout_adjustment_v1',
      score: 0
    }
  }
  
  // Studio Improvements
  async studioTemplate(params: {
    templates: string[]
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      title: 'Add Persona Templates to Studio',
      description: `Pre-fill Studio with ${params.templates.join(', ')} templates for faster creation`,
      category: 'studio',
      expectedBenefit: 'Save 5-10 minutes per persona',
      aiReasoning: params.reason,
      impactLevel: 'high',
      change: {
        type: 'add_templates',
        target: 'studio_templates',
        config: {
          templates: params.templates.map(name => ({
            name,
            presets: getTemplatePresets(name)
          }))
        }
      },
      uxTemplateId: 'studio_template_v1',
      score: 0
    }
  }
  
  // Memory Improvements
  async memoryFilter(params: {
    filterType: 'mood' | 'date' | 'sage'
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      title: `Add ${capitalize(params.filterType)} Filter to Memory`,
      description: `Filter conversations by ${params.filterType} for easier recall`,
      category: 'memory',
      expectedBenefit: 'Find conversations 3x faster',
      aiReasoning: params.reason,
      impactLevel: 'medium',
      change: {
        type: 'add_filter',
        target: 'memory_filters',
        config: {
          filterType: params.filterType
        }
      },
      uxTemplateId: 'memory_filter_v1',
      score: 0
    }
  }
}
\`\`\`

---

## Part 4: Proposal Scoring Model

### Formula

\`\`\`typescript
finalScore = 
  (0.3 * impactScore) +
  (0.25 * likelihoodScore) +
  (0.2 * userFitScore) +
  (0.15 * noveltyScore) +
  (0.1 * effortScoreInverse)
\`\`\`

### Implementation

\`\`\`typescript
// lib/ai/scoring.ts
export class ProposalScoring {
  calculate(
    proposal: AIProposal,
    patterns: UserPattern,
    semantics: SemanticProfile
  ): number {
    const impact = this.scoreImpact(proposal)
    const likelihood = this.scoreLikelihood(proposal, patterns)
    const userFit = this.scoreUserFit(proposal, semantics)
    const novelty = this.scoreNovelty(proposal)
    const effort = this.scoreEffort(proposal)
    
    return (
      0.3 * impact +
      0.25 * likelihood +
      0.2 * userFit +
      0.15 * novelty +
      0.1 * (100 - effort) // Inverse effort
    )
  }
  
  private scoreImpact(proposal: AIProposal): number {
    // Does it fix a real pain point? Reduce clicks/time?
    if (proposal.category === 'navigation') return 80
    if (proposal.category === 'layout') return 60
    if (proposal.category === 'studio') return 90
    if (proposal.category === 'memory') return 70
    return 50
  }
  
  private scoreLikelihood(proposal: AIProposal, patterns: UserPattern): number {
    // How likely is user to use this feature?
    const pageUsage = patterns.frequentPages.find(p => 
      proposal.change.target.includes(p.page)
    )
    return pageUsage ? pageUsage.visitRate * 100 : 30
  }
  
  private scoreUserFit(proposal: AIProposal, semantics: SemanticProfile): number {
    // Does it match user's behavior and semantic preferences?
    // High if proposal aligns with dominant topics or preferred sages
    return 70 // Simplified - real impl would check semantic alignment
  }
  
  private scoreNovelty(proposal: AIProposal): number {
    // Is it not repetitive? Check proposal history
    // Return lower score if similar proposal was rejected recently
    return 80 // Simplified
  }
  
  private scoreEffort(proposal: AIProposal): number {
    // Estimated complexity (higher effort = lower score)
    if (proposal.change.type === 'add_component') return 20
    if (proposal.change.type === 'reposition_component') return 10
    if (proposal.change.type === 'add_templates') return 40
    return 30
  }
}
\`\`\`

---

## Part 5: Governance Engine v1

### 10 Strict Policies

\`\`\`typescript
// lib/governance/policy.ts
export enum PolicyType {
  NO_SAFETY_REMOVAL = 'NO_SAFETY_REMOVAL',
  NO_DATA_EXFILTRATION = 'NO_DATA_EXFILTRATION',
  PRESERVE_LEGAL = 'PRESERVE_LEGAL',
  RESPECT_PRIVACY = 'RESPECT_PRIVACY',
  MAINTAIN_CORE = 'MAINTAIN_CORE',
  NO_BREAKING_CHANGES = 'NO_BREAKING_CHANGES',
  NO_MANIPULATION = 'NO_MANIPULATION',
  FAIR_MONETIZATION = 'FAIR_MONETIZATION',
  SAGE_DOMAIN_BOUNDARIES = 'SAGE_DOMAIN_BOUNDARIES',
  NO_HALLUCINATIONS = 'NO_HALLUCINATIONS'
}

export class GovernanceEngine {
  async evaluateProposal(proposal: AIProposal): Promise<GovernanceResult> {
    const violations: PolicyViolation[] = []
    
    // Policy 1: No removal of safety features
    if (this.removesSafetyFeature(proposal)) {
      violations.push({
        policy: PolicyType.NO_SAFETY_REMOVAL,
        severity: 'critical',
        reason: 'Cannot remove logout, auth, or safety controls'
      })
    }
    
    // Policy 2: No data exfiltration
    if (this.exfiltratesData(proposal)) {
      violations.push({
        policy: PolicyType.NO_DATA_EXFILTRATION,
        severity: 'critical',
        reason: 'Cannot add external data sending without explicit consent'
      })
    }
    
    // Policy 3: Preserve legal requirements
    if (this.violatesLegal(proposal)) {
      violations.push({
        policy: PolicyType.PRESERVE_LEGAL,
        severity: 'critical',
        reason: 'Cannot modify terms, privacy policy, or legal pages'
      })
    }
    
    // Policy 4: Respect privacy settings
    if (this.violatesPrivacy(proposal)) {
      violations.push({
        policy: PolicyType.RESPECT_PRIVACY,
        severity: 'high',
        reason: 'Cannot override user privacy preferences'
      })
    }
    
    // Policy 5: Maintain core functionality
    if (this.breaksCore(proposal)) {
      violations.push({
        policy: PolicyType.MAINTAIN_CORE,
        severity: 'high',
        reason: 'Cannot disable Playground, Council, or Memory'
      })
    }
    
    // Policy 6: No breaking changes
    if (this.causesBreakingChange(proposal)) {
      violations.push({
        policy: PolicyType.NO_BREAKING_CHANGES,
        severity: 'high',
        reason: 'Change would break existing user workflows'
      })
    }
    
    // Policy 7: No manipulative patterns
    if (this.isManipulative(proposal)) {
      violations.push({
        policy: PolicyType.NO_MANIPULATION,
        severity: 'high',
        reason: 'Cannot add dark patterns or manipulative UI'
      })
    }
    
    // Policy 8: Fair monetization only
    if (this.isUnfairMonetization(proposal)) {
      violations.push({
        policy: PolicyType.FAIR_MONETIZATION,
        severity: 'medium',
        reason: 'Cannot add paywalls to free features'
      })
    }
    
    // Policy 9: Respect Sage domain boundaries
    if (this.violatesSageDomain(proposal)) {
      violations.push({
        policy: PolicyType.SAGE_DOMAIN_BOUNDARIES,
        severity: 'medium',
        reason: 'Cannot suggest Sages outside their expertise'
      })
    }
    
    // Policy 10: No hallucinations
    if (this.hallucinatesFeature(proposal)) {
      violations.push({
        policy: PolicyType.NO_HALLUCINATIONS,
        severity: 'high',
        reason: 'Cannot reference non-existent features or pages'
      })
    }
    
    const approved = violations.filter(v => v.severity === 'critical').length === 0
    
    return {
      approved,
      violations,
      blockedReason: !approved ? violations.map(v => v.reason).join('; ') : null
    }
  }
}
\`\`\`

---

## Part 6: Feature Flag System

### How Feature Flags Work

\`\`\`typescript
// Example: Navigation shortcut feature flag
{
  "playground_quick_access": {
    "enabled": true,
    "config": {
      "fromPage": "/demo",
      "toPage": "/playground",
      "buttonLabel": "Quick Playground Access",
      "position": "top_actions"
    }
  }
}
\`\`\`

### Applying Feature Flags

\`\`\`typescript
// In React components
export function HubQuickActions() {
  const { featureFlags } = usePersonalization()
  
  if (!featureFlags.playground_quick_access?.enabled) {
    return null
  }
  
  const config = featureFlags.playground_quick_access.config
  
  return (
    <div className={`quick-actions ${config.position}`}>
      <Button href={config.toPage}>
        {config.buttonLabel}
      </Button>
    </div>
  )
}
\`\`\`

---

## Implementation Checklist

### Phase 1: Foundation
- [x] Database tables created (UserBehavior, ai_proposal_history)
- [x] Basic observability tracking
- [x] Governance engine v1 (10 policies)
- [x] Feature flag storage

### Phase 2: Dreamer v2 Core
- [ ] Semantic analysis (embeddings)
- [ ] Page classification system
- [ ] UX Template Library (12 proposal types)
- [ ] Proposal scoring model
- [ ] Enhanced Dreamer engine

### Phase 3: User Experience
- [x] Gamified approval console (Architect XP, streaks)
- [ ] Feature flag UI integration across all pages
- [ ] Visual mock previews for proposals
- [ ] "Ask Why" detailed reasoning modal

### Phase 4: Self-Healing
- [x] Error detection and monitoring
- [ ] Auto-fix proposal generation
- [ ] Self-healing suggestions in Adaptive Mode

### Phase 5: Polish & Testing
- [ ] Comprehensive test suite
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] User onboarding for Adaptive Mode

---

## Success Metrics

1. **Proposal Quality**: 80%+ user approval rate on generated proposals
2. **Behavioral Coverage**: 95%+ of key user actions tracked
3. **Semantic Accuracy**: 85%+ proposals align with user's actual needs
4. **Governance Safety**: 0 unsafe proposals reach users
5. **Performance**: Dreamer analysis completes in < 5 seconds
6. **User Engagement**: 60%+ users review proposals regularly
7. **Feature Flag Stability**: 0 UI breaks from applied flags

---

## Questions & Support

For questions about Dreamer v2 implementation, see:
- `/docs/SUCCESS_CRITERIA.md` - High-level goals
- `/docs/TECHNICAL.md` - Architecture details
- `/docs/USER_GUIDE.md` - User-facing features

Contact: engineering@sagespace.ai
