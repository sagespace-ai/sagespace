// Performance monitoring utilities for production

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = []

  static recordMetric(name: string, value: number) {
    const rating = this.getRating(name, value)
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now()
    }
    
    this.metrics.push(metric)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[v0] Performance:', metric)
    }
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric)
    }
  }

  private static getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'FCP': { good: 1800, poor: 3000 },
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'TTFB': { good: 800, poor: 1800 }
    }

    const threshold = thresholds[name]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private static sendToAnalytics(metric: PerformanceMetric) {
    // Send to your analytics service (Vercel Analytics, Google Analytics, etc.)
    if (typeof window !== 'undefined' && 'sendBeacon' in navigator) {
      const body = JSON.stringify(metric)
      navigator.sendBeacon('/api/analytics/performance', body)
    }
  }

  static getMetrics() {
    return this.metrics
  }

  static clearMetrics() {
    this.metrics = []
  }
}

// Web Vitals reporting
export function reportWebVitals(metric: any) {
  PerformanceMonitor.recordMetric(metric.name, metric.value)
}
