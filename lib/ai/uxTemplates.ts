/**
 * UX Template Library - Concrete, actionable proposal templates
 * Part of Dreamer v2 system for generating specific improvement suggestions
 */

import type { AIProposal } from '@/lib/types/personalization'

export enum PageType {
  CORE_ACTION = 'core_action',
  DISCOVERY = 'discovery',
  UTILITY = 'utility',
  INSIGHT = 'insight',
  ONBOARDING = 'onboarding',
}

export const PAGE_CLASSIFICATION: Record<string, PageType> = {
  '/playground': PageType.CORE_ACTION,
  '/council': PageType.CORE_ACTION,
  '/multiverse': PageType.DISCOVERY,
  '/persona-editor': PageType.DISCOVERY,
  '/marketplace': PageType.DISCOVERY,
  '/settings': PageType.UTILITY,
  '/profile': PageType.UTILITY,
  '/memory': PageType.INSIGHT,
  '/observatory': PageType.INSIGHT,
  '/genesis': PageType.ONBOARDING,
  '/demo': PageType.DISCOVERY,
}

function getPageLabel(path: string): string {
  const labels: Record<string, string> = {
    '/playground': 'Playground',
    '/council': 'Council',
    '/multiverse': 'Multiverse',
    '/persona-editor': 'Studio',
    '/marketplace': 'Marketplace',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/memory': 'Memory',
    '/observatory': 'Observatory',
    '/genesis': 'Genesis',
    '/demo': 'Hub',
  }
  return labels[path] || path
}

function generateId(): string {
  return crypto.randomUUID()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * UX Template Library
 * Provides 12 concrete proposal types with specific templates
 */
export class UXTemplateLibrary {
  /**
   * Template 1: Navigation Shortcuts
   * Add quick-access buttons between frequently visited pages
   */
  async navigationShortcut(params: {
    from: string
    to: string
    visitCount: number
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Add Quick Access to ${getPageLabel(params.to)}`,
      description: `Add a prominent "Go to ${getPageLabel(params.to)}" button on ${getPageLabel(params.from)} for faster navigation`,
      expectedBenefit: `Save 2-3 clicks per session. You visit ${getPageLabel(params.to)} ${params.visitCount} times from ${getPageLabel(params.from)}.`,
      aiReasoning: params.reason,
      impactLevel: 'medium',
      proposedChanges: {
        type: 'add_navigation_shortcut',
        fromPage: params.from,
        toPage: params.to,
        buttonConfig: {
          label: `Go to ${getPageLabel(params.to)}`,
          variant: 'cosmic',
          position: 'hero_actions',
        },
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 2: Sage Recommendations
   * Suggest specific Sages based on usage patterns
   */
  async sageRecommendation(params: {
    sageNames: string[]
    reason: string
    usageCount: number
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'sage_recommendation',
      title: `Pin Your Favorite Sages: ${params.sageNames.slice(0, 3).join(', ')}`,
      description: `Add ${params.sageNames.join(', ')} to your quick-access favorites bar for instant access`,
      expectedBenefit: `Start conversations faster. You've used these Sages ${params.usageCount} times recently.`,
      aiReasoning: params.reason,
      impactLevel: 'high',
      proposedChanges: {
        type: 'add_sage_favorites',
        sageNames: params.sageNames,
        displayLocation: 'playground_favorites',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 3: Layout Adjustments
   * Reposition components for better visibility
   */
  async layoutAdjustment(params: {
    page: string
    component: string
    currentPosition: string
    newPosition: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Reorganize ${getPageLabel(params.page)} Layout`,
      description: `Move ${params.component} from ${params.currentPosition} to ${params.newPosition} for easier access`,
      expectedBenefit: 'Reduce time to find key features by 30-40%',
      aiReasoning: params.reason,
      impactLevel: 'low',
      proposedChanges: {
        type: 'reposition_component',
        page: params.page,
        component: params.component,
        from: params.currentPosition,
        to: params.newPosition,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 4: Component Repositioning
   * Move specific UI elements based on usage
   */
  async componentReposition(params: {
    page: string
    componentId: string
    newLayout: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Improve ${getPageLabel(params.page)} Component Layout`,
      description: `Adjust ${params.componentId} position to ${params.newLayout} layout`,
      expectedBenefit: 'Better visual hierarchy and easier navigation',
      aiReasoning: params.reason,
      impactLevel: 'medium',
      proposedChanges: {
        type: 'adjust_component_layout',
        page: params.page,
        componentId: params.componentId,
        newLayout: params.newLayout,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 5: CTA Improvements
   * Enhance call-to-action buttons
   */
  async ctaImprovement(params: {
    page: string
    ctaName: string
    currentStyle: string
    suggestedStyle: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Enhance "${params.ctaName}" Button on ${getPageLabel(params.page)}`,
      description: `Update ${params.ctaName} button from ${params.currentStyle} to ${params.suggestedStyle} style`,
      expectedBenefit: 'Increase engagement and make primary actions more obvious',
      aiReasoning: params.reason,
      impactLevel: 'low',
      proposedChanges: {
        type: 'enhance_cta',
        page: params.page,
        ctaName: params.ctaName,
        styleChange: {
          from: params.currentStyle,
          to: params.suggestedStyle,
        },
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 6: Persona Suggestions
   * Recommend custom Sage creation based on topics
   */
  async personaSuggestion(params: {
    personaName: string
    domain: string
    topicsDiscussed: string[]
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'sage_recommendation',
      title: `Create a Custom "${params.personaName}" Sage`,
      description: `We noticed you frequently discuss ${params.topicsDiscussed.join(', ')}. Create a specialized ${params.personaName} Sage for ${params.domain}.`,
      expectedBenefit: `Get more relevant responses tailored to ${params.domain} discussions`,
      aiReasoning: params.reason,
      impactLevel: 'high',
      proposedChanges: {
        type: 'suggest_persona_creation',
        personaTemplate: {
          name: params.personaName,
          domain: params.domain,
          specialization: params.topicsDiscussed,
        },
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 7: Background Variants
   * Adjust cosmic theme intensity
   */
  async backgroundVariant(params: {
    currentIntensity: string
    suggestedIntensity: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'theme_variant',
      title: `Adjust Cosmic Background Intensity`,
      description: `Change background from ${params.currentIntensity} to ${params.suggestedIntensity} intensity`,
      expectedBenefit: 'Better readability and visual comfort',
      aiReasoning: params.reason,
      impactLevel: 'low',
      proposedChanges: {
        type: 'adjust_background',
        intensityChange: {
          from: params.currentIntensity,
          to: params.suggestedIntensity,
        },
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 8: Onboarding Flow Updates
   * Streamline Genesis Chamber experience
   */
  async onboardingUpdate(params: {
    step: string
    improvement: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Streamline Genesis Onboarding Step: ${params.step}`,
      description: `${params.improvement} in the ${params.step} onboarding step`,
      expectedBenefit: 'Faster onboarding and clearer guidance for new features',
      aiReasoning: params.reason,
      impactLevel: 'medium',
      proposedChanges: {
        type: 'update_onboarding',
        step: params.step,
        improvement: params.improvement,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 9: Studio Template Suggestions
   * Pre-fill Studio with persona templates
   */
  async studioTemplate(params: {
    templates: Array<{ name: string; description: string }>
    usagePatterns: string[]
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'feature_toggle',
      title: `Add ${params.templates.length} Persona Templates to Studio`,
      description: `Pre-configure Studio with ${params.templates.map(t => t.name).join(', ')} templates based on your usage`,
      expectedBenefit: `Create custom Sages 5-10 minutes faster with pre-filled templates`,
      aiReasoning: params.reason,
      impactLevel: 'high',
      proposedChanges: {
        type: 'add_studio_templates',
        templates: params.templates,
        triggerPatterns: params.usagePatterns,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 10: Memory Enhancements
   * Add filters and search capabilities
   */
  async memoryFilter(params: {
    filterType: 'mood' | 'date' | 'sage' | 'topic'
    reason: string
    conversationCount: number
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'feature_toggle',
      title: `Add ${capitalize(params.filterType)} Filter to Memory`,
      description: `Filter your ${params.conversationCount} saved conversations by ${params.filterType}`,
      expectedBenefit: 'Find past conversations 3-5x faster',
      aiReasoning: params.reason,
      impactLevel: 'medium',
      proposedChanges: {
        type: 'add_memory_filter',
        filterType: params.filterType,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 11: Error-Avoidance Recommendations
   * Prevent common friction points
   */
  async errorAvoidance(params: {
    errorType: string
    page: string
    preventionStrategy: string
    reason: string
    occurrenceCount: number
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Prevent "${params.errorType}" Error on ${getPageLabel(params.page)}`,
      description: `${params.preventionStrategy} to avoid the ${params.errorType} error you've encountered ${params.occurrenceCount} times`,
      expectedBenefit: 'Eliminate friction and improve reliability',
      aiReasoning: params.reason,
      impactLevel: 'high',
      proposedChanges: {
        type: 'error_prevention',
        page: params.page,
        errorType: params.errorType,
        strategy: params.preventionStrategy,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Template 12: Performance Optimization
   * Speed up slow pages or interactions
   */
  async performanceOptimization(params: {
    page: string
    currentLoadTime: number
    targetLoadTime: number
    optimization: string
    reason: string
  }): Promise<AIProposal> {
    return {
      id: generateId(),
      proposalType: 'ux_change',
      title: `Speed Up ${getPageLabel(params.page)} Loading`,
      description: `${params.optimization} to reduce load time from ${params.currentLoadTime}s to ${params.targetLoadTime}s`,
      expectedBenefit: `${Math.round(((params.currentLoadTime - params.targetLoadTime) / params.currentLoadTime) * 100)}% faster page loads`,
      aiReasoning: params.reason,
      impactLevel: 'medium',
      proposedChanges: {
        type: 'performance_optimization',
        page: params.page,
        optimization: params.optimization,
        metrics: {
          current: params.currentLoadTime,
          target: params.targetLoadTime,
        },
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }
}
