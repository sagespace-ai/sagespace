/**
 * Structured Logging & Request Tracing
 * Provides centralized logging with correlation IDs and structured fields
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  correlationId?: string
  route?: string
  userId?: string
  provider?: 'groq' | 'vercel-gateway' | 'huggingface'
  model?: string
  latencyMs?: number
  tokenEstimate?: number
  errorCode?: string
  errorMessage?: string
  [key: string]: any
}

class Logger {
  private correlationId: string | null = null

  setCorrelationId(id: string) {
    this.correlationId = id
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      correlationId: context?.correlationId || this.correlationId,
      ...context,
    }

    const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    logMethod(`[${level.toUpperCase()}]`, JSON.stringify(logEntry))

    return logEntry
  }

  debug(message: string, context?: LogContext) {
    return this.log('debug', message, context)
  }

  info(message: string, context?: LogContext) {
    return this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    return this.log('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    return this.log('error', message, context)
  }
}

export const log = new Logger()

export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`
}
