import { NextResponse } from 'next/server'
import { ai } from '@/lib/ai-client'
import type { HealthCheckResponse } from '@/lib/ai/types'

export const runtime = 'edge'

/**
 * Charter-Compliant AI Health Check
 * Verifies Groq-first routing and zero-cost operation
 */
export async function GET() {
  const startTime = Date.now()

  try {
    // Run trivial prompt to test routing
    const result = await ai.runChat(
      [{ role: 'user', content: 'Hello' }],
      { maxTokens: 10 },
      'free' // Always test with free tier
    )

    const latencyMs = Date.now() - startTime

    const response: HealthCheckResponse = {
      provider: result.routingDecision.provider as any,
      ok: true,
      latencyMs,
      tier: 'core',
      charterAligned: result.routingDecision.provider === 'groq', // Must be Groq for free tier
      timestamp: new Date(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: HealthCheckResponse = {
      provider: 'groq',
      ok: false,
      latencyMs: Date.now() - startTime,
      tier: 'core',
      charterAligned: false,
      timestamp: new Date(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
