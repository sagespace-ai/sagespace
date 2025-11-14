/**
 * Middleware wrapper for automatic self-healing monitoring
 */
import { SelfHealingMonitor } from './detector'

export function withSelfHealing<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  componentName: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now()
    
    try {
      const result = await handler(...args)
      
      // Track response time
      const duration = Date.now() - startTime
      await SelfHealingMonitor.trackResponseTime(componentName, duration)
      
      return result
    } catch (error) {
      // Track error
      await SelfHealingMonitor.trackError(componentName, error as Error)
      
      // Re-throw to maintain normal error handling
      throw error
    }
  }) as T
}

/**
 * Helper to wrap API route handlers with self-healing
 */
export function monitoredAPIRoute(
  handler: (request: Request) => Promise<Response>,
  routeName: string
): (request: Request) => Promise<Response> {
  return withSelfHealing(handler, `api:${routeName}`)
}
