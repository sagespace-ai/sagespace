/**
 * Observability Collection System - Tracks user behavior for AI analysis
 */
import { createServiceClient } from '@/lib/supabase/service-role'

export interface ObservabilityEvent {
  userId: string | null // Allow null for anonymous users
  eventType: 'page_view' | 'click' | 'error' | 'success' | 'friction'
  eventCategory: string
  pagePath?: string
  actionName?: string
  componentName?: string
  metadata?: Record<string, any>
  createdAt: string
}

export class ObservabilityCollector {
  /**
   * Track a user event
   */
  static async trackEvent(
    userId: string | null, // Allow null for anonymous users
    eventType: ObservabilityEvent['eventType'],
    eventCategory: string,
    details: {
      pagePath?: string
      actionName?: string
      componentName?: string
      metadata?: Record<string, any>
    }
  ): Promise<void> {
    try {
      const supabase = createServiceClient()

      await supabase.from('observability_events').insert({
        user_id: userId,
        event_type: eventType,
        event_category: eventCategory,
        page_path: details.pagePath,
        action_name: details.actionName,
        component_name: details.componentName,
        metadata: details.metadata || {},
      })
    } catch (error) {
      // Silently fail - don't interrupt user experience
      console.debug('[Observability] Event tracking failed:', error)
    }
  }

  /**
   * Get recent events for a user
   */
  static async getRecentEvents(userId: string, limit: number = 100): Promise<ObservabilityEvent[]> {
    try {
      const supabase = createServiceClient()

      const { data, error } = await supabase
        .from('observability_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(row => ({
        userId: row.user_id,
        eventType: row.event_type,
        eventCategory: row.event_category,
        pagePath: row.page_path,
        actionName: row.action_name,
        componentName: row.component_name,
        metadata: row.metadata || {},
        createdAt: row.created_at,
      }))
    } catch (error) {
      console.error('[Observability] Error fetching events:', error)
      return []
    }
  }

  /**
   * Analyze navigation patterns
   */
  static analyzeNavigationPatterns(events: ObservabilityEvent[]): Array<{
    fromPage: string
    toPage: string
    count: number
  }> {
    const pageViews = events.filter(e => e.eventType === 'page_view')
    const transitionMap = new Map<string, number>()

    for (let i = 1; i < pageViews.length; i++) {
      const fromPage = pageViews[i - 1].pagePath || 'unknown'
      const toPage = pageViews[i].pagePath || 'unknown'
      const key = `${fromPage}::${toPage}`
      
      transitionMap.set(key, (transitionMap.get(key) || 0) + 1)
    }

    return Array.from(transitionMap.entries())
      .map(([key, count]) => {
        const [fromPage, toPage] = key.split('::')
        return { fromPage, toPage, count }
      })
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Identify friction points (errors, abandoned actions)
   */
  static identifyFrictionPoints(events: ObservabilityEvent[]): Array<{
    page: string
    component: string
    count: number
  }> {
    const frictionEvents = events.filter(e => e.eventType === 'error' || e.eventType === 'friction')
    const frictionMap = new Map<string, number>()

    for (const event of frictionEvents) {
      const key = `${event.pagePath || 'unknown'}::${event.componentName || 'unknown'}`
      frictionMap.set(key, (frictionMap.get(key) || 0) + 1)
    }

    return Array.from(frictionMap.entries())
      .map(([key, count]) => {
        const [page, component] = key.split('::')
        return { page, component, count }
      })
      .sort((a, b) => b.count - a.count)
  }
}
