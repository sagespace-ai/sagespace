/**
 * Circuit Breaker & Load Shedding
 * Prevents cascade failures and provides graceful degradation
 */

export type CircuitState = 'closed' | 'open' | 'half-open'

interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
  windowMs: number
}

class CircuitBreaker {
  private state: CircuitState = 'closed'
  private failureCount: number = 0
  private successCount: number = 0
  private lastFailureTime: number = 0
  private failureWindow: number[] = []

  constructor(
    public name: string,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 1 minute
      windowMs: 60000,
    }
  ) {}

  getState(): CircuitState {
    // Check if circuit should transition from open to half-open
    if (this.state === 'open' && Date.now() - this.lastFailureTime > this.config.timeout) {
      this.state = 'half-open'
      this.successCount = 0
    }

    return this.state
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const state = this.getState()

    if (state === 'open') {
      throw new Error(`Circuit breaker [${this.name}] is OPEN - request rejected`)
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0

    if (this.state === 'half-open') {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed'
        this.successCount = 0
      }
    }
  }

  private onFailure() {
    const now = Date.now()
    this.lastFailureTime = now

    // Clean up old failures outside window
    this.failureWindow = this.failureWindow.filter(
      (time) => now - time < this.config.windowMs
    )
    this.failureWindow.push(now)

    this.failureCount = this.failureWindow.length

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
    }
  }

  reset() {
    this.state = 'closed'
    this.failureCount = 0
    this.successCount = 0
    this.failureWindow = []
  }
}

export const circuitBreakers = {
  groq: new CircuitBreaker('groq'),
  gateway: new CircuitBreaker('gateway'),
  supabase: new CircuitBreaker('supabase'),
}

export function getCircuitBreaker(name: string): CircuitBreaker {
  return circuitBreakers[name as keyof typeof circuitBreakers]
}
