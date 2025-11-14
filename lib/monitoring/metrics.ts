/**
 * Metrics & SLOs Module
 * Tracks performance and error rates for observability
 */

interface MetricData {
  count: number
  sum: number
  min: number
  max: number
  values: number[]
}

class MetricsStore {
  private metrics: Map<string, MetricData> = new Map()
  private counters: Map<string, number> = new Map()

  increment(metric: string, value: number = 1) {
    const current = this.counters.get(metric) || 0
    this.counters.set(metric, current + value)
  }

  recordLatency(metric: string, latencyMs: number) {
    const data = this.metrics.get(metric) || {
      count: 0,
      sum: 0,
      min: Infinity,
      max: 0,
      values: [],
    }

    data.count++
    data.sum += latencyMs
    data.min = Math.min(data.min, latencyMs)
    data.max = Math.max(data.max, latencyMs)
    data.values.push(latencyMs)

    // Keep only last 100 values for memory efficiency
    if (data.values.length > 100) {
      data.values.shift()
    }

    this.metrics.set(metric, data)
  }

  getMetrics(metric: string) {
    const data = this.metrics.get(metric)
    if (!data || data.count === 0) return null

    const sorted = [...data.values].sort((a, b) => a - b)
    const p50Index = Math.floor(sorted.length * 0.5)
    const p95Index = Math.floor(sorted.length * 0.95)
    const p99Index = Math.floor(sorted.length * 0.99)

    return {
      count: data.count,
      avg: data.sum / data.count,
      min: data.min,
      max: data.max,
      p50: sorted[p50Index] || 0,
      p95: sorted[p95Index] || 0,
      p99: sorted[p99Index] || 0,
    }
  }

  getCounter(metric: string): number {
    return this.counters.get(metric) || 0
  }

  getAllMetrics() {
    const all: Record<string, any> = {}
    
    for (const [key, value] of this.counters) {
      all[key] = value
    }
    
    for (const [key] of this.metrics) {
      all[key] = this.getMetrics(key)
    }
    
    return all
  }

  reset() {
    this.metrics.clear()
    this.counters.clear()
  }
}

export const metrics = new MetricsStore()

// SLO Definitions
export const SLOs = {
  PLAYGROUND_CHAT_P95_MS: 3000,
  COUNCIL_RESPONSE_P95_MS: 7000,
  ERROR_RATE_THRESHOLD: 0.01, // 1%
}

export function checkSloViolation(metric: string, value: number): boolean {
  switch (metric) {
    case 'playground.chat.latency':
      return value > SLOs.PLAYGROUND_CHAT_P95_MS
    case 'council.response.latency':
      return value > SLOs.COUNCIL_RESPONSE_P95_MS
    default:
      return false
  }
}
