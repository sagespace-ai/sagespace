/**
 * Load-Aware Degradation System
 * Automatically reduces features under high load
 */

import { metrics } from './metrics'

export interface SystemStatus {
  mode: 'normal' | 'light' | 'degraded'
  aiLatencyHigh: boolean
  errorRateHigh: boolean
  councilParticipantLimit: number
  maxResponseLength: number
  memorySummarizationEnabled: boolean
}

class LoadMonitor {
  private status: SystemStatus = {
    mode: 'normal',
    aiLatencyHigh: false,
    errorRateHigh: false,
    councilParticipantLimit: 5,
    maxResponseLength: 2000,
    memorySummarizationEnabled: true,
  }

  private checkInterval: NodeJS.Timeout | null = null

  start() {
    if (this.checkInterval) return
    
    // Check system health every 30 seconds
    this.checkInterval = setInterval(() => {
      this.updateStatus()
    }, 30000)
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private updateStatus() {
    // Check AI latency
    const aiLatency = metrics.getMetrics('ai.groq.latency')
    const aiLatencyHigh = aiLatency ? aiLatency.p95 > 5000 : false

    // Check error rate
    const totalRequests = metrics.getCounter('chat.success') + metrics.getCounter('chat.error')
    const errorRate = totalRequests > 0 
      ? metrics.getCounter('chat.error') / totalRequests 
      : 0
    const errorRateHigh = errorRate > 0.05 // 5% error rate

    // Determine mode
    let mode: SystemStatus['mode'] = 'normal'
    if (aiLatencyHigh || errorRateHigh) {
      mode = errorRateHigh ? 'degraded' : 'light'
    }

    // Update limits based on mode
    this.status = {
      mode,
      aiLatencyHigh,
      errorRateHigh,
      councilParticipantLimit: mode === 'degraded' ? 3 : mode === 'light' ? 4 : 5,
      maxResponseLength: mode === 'degraded' ? 1000 : mode === 'light' ? 1500 : 2000,
      memorySummarizationEnabled: mode !== 'degraded',
    }

    if (mode !== 'normal') {
      console.log('[Load Monitor] System in', mode, 'mode:', this.status)
    }
  }

  getStatus(): SystemStatus {
    return { ...this.status }
  }
}

export const loadMonitor = new LoadMonitor()

// Auto-start in production
if (typeof window === 'undefined') {
  loadMonitor.start()
}
