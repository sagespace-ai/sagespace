// Error tracking and reporting for production

export interface ErrorReport {
  message: string
  stack?: string
  componentStack?: string
  url: string
  userAgent: string
  timestamp: number
  userId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class ErrorTracker {
  private static errors: ErrorReport[] = []

  static captureError(error: Error, severity: ErrorReport['severity'] = 'medium', userId?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: Date.now(),
      userId,
      severity
    }

    this.errors.push(report)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[v0] Error tracked:', report)
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(report)
    }
  }

  static captureReactError(error: Error, errorInfo: { componentStack: string }, userId?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: Date.now(),
      userId,
      severity: 'high'
    }

    this.errors.push(report)

    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(report)
    }
  }

  static getRecentErrors(limit: number = 50): ErrorReport[] {
    return this.errors.slice(-limit)
  }

  static clearErrors() {
    this.errors = []
  }

  private static async sendToErrorService(report: ErrorReport) {
    try {
      await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      })
    } catch (e) {
      console.error('[v0] Failed to send error report:', e)
    }
  }
}
