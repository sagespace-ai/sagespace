/**
 * System Status Endpoint
 * Returns current load status and degradation state
 */

import { NextResponse } from 'next/server'
import { loadMonitor } from '@/lib/monitoring/load-aware'
import { metrics } from '@/lib/monitoring/metrics'
import { circuitBreakers } from '@/lib/monitoring/circuit-breaker'

export async function GET() {
  const status = loadMonitor.getStatus()
  const allMetrics = metrics.getAllMetrics()
  
  return NextResponse.json({
    status: status.mode,
    load: {
      aiLatencyHigh: status.aiLatencyHigh,
      errorRateHigh: status.errorRateHigh,
    },
    limits: {
      councilParticipants: status.councilParticipantLimit,
      maxResponseLength: status.maxResponseLength,
      memorySummarizationEnabled: status.memorySummarizationEnabled,
    },
    circuitBreakers: {
      groq: circuitBreakers.groq.getState(),
      gateway: circuitBreakers.gateway.getState(),
      supabase: circuitBreakers.supabase.getState(),
    },
    metrics: allMetrics,
  })
}
