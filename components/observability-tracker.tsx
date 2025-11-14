/**
 * Observability Tracker - Client-side component to track user interactions
 * Automatically captures page views, clicks, and other events
 */
"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ObservabilityTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/observability/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_view',
            eventCategory: 'navigation',
            pagePath: pathname,
            metadata: {
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
            },
          }),
        })
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('[Observability] Page view tracking failed:', error)
      }
    }

    trackPageView()
  }, [pathname])

  useEffect(() => {
    // Track clicks on interactive elements
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Only track clicks on buttons, links, and interactive elements
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('[data-track]')) {
        const componentName = target.getAttribute('data-track') || target.textContent?.slice(0, 50) || 'unknown'
        
        try {
          await fetch('/api/observability/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'click',
              eventCategory: 'interaction',
              pagePath: pathname,
              actionName: componentName,
              metadata: {
                elementType: target.tagName,
                timestamp: new Date().toISOString(),
              },
            }),
          })
        } catch (error) {
          console.debug('[Observability] Click tracking failed:', error)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  // This component doesn't render anything
  return null
}

/**
 * Helper to manually track custom events
 */
export async function trackEvent(eventType: string, details: {
  eventCategory: string
  actionName?: string
  metadata?: Record<string, any>
}) {
  try {
    await fetch('/api/observability/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        eventCategory: details.eventCategory,
        pagePath: window.location.pathname,
        actionName: details.actionName,
        metadata: {
          ...details.metadata,
          timestamp: new Date().toISOString(),
        },
      }),
    })
  } catch (error) {
    console.debug('[Observability] Custom event tracking failed:', error)
  }
}
