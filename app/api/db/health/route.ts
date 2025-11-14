/**
 * Database Health Check
 * Verifies Supabase connection with fast read
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const start = Date.now()
  
  try {
    const supabase = await createClient()
    await supabase.from('profiles').select('count').limit(1).single()
    
    const latencyMs = Date.now() - start

    return NextResponse.json({
      ok: true,
      latencyMs,
      provider: 'supabase',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        latencyMs: Date.now() - start,
        provider: 'supabase',
        error: error.message,
      },
      { status: 503 }
    )
  }
}
