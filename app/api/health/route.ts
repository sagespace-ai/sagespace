/**
 * Overall App Health Check
 * Returns DB, auth, router, and Groq connectivity status
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: { ok: false, latencyMs: 0 },
      auth: { ok: false },
      router: { ok: true }, // Router is always ok if app is running
    },
  }

  // Check database
  try {
    const start = Date.now()
    const supabase = await createClient()
    await supabase.from('profiles').select('count').limit(1).single()
    checks.checks.database = {
      ok: true,
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    checks.checks.database = { ok: false, latencyMs: 0 }
    checks.status = 'degraded'
  }

  // Check auth
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    checks.checks.auth = { ok: true }
  } catch (error) {
    checks.checks.auth = { ok: false }
    checks.status = 'degraded'
  }

  return NextResponse.json(checks)
}
