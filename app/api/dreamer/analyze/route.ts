/**
 * API endpoint to trigger Dreamer analysis for a user
 * Can be called manually or scheduled via cron
 */
import { NextResponse } from 'next/server'
import { DreamerSystem } from '@/lib/ai/dreamer'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // Get current user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Dreamer API] Starting analysis for user:', user.id)

    // Run Dreamer analysis
    const proposals = await DreamerSystem.analyzeAndPropose(user.id)

    // Also update memory summary
    await DreamerSystem.updateMemorySummary(user.id)

    return NextResponse.json({
      success: true,
      proposalsGenerated: proposals.length,
      proposals: proposals.map(p => ({
        id: p.id, // Now contains the actual database ID
        title: p.title,
        impactLevel: p.impactLevel,
      })),
    })
  } catch (error: any) {
    console.error('[Dreamer API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate proposals', details: error.message },
      { status: 500 }
    )
  }
}

// Cron endpoint for scheduled analysis
export async function GET(request: Request) {
  try {
    // Verify this is a cron request (check Authorization header)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: In production, iterate through active users and run analysis
    console.log('[Dreamer Cron] Running scheduled analysis')

    return NextResponse.json({ success: true, message: 'Cron job executed' })
  } catch (error: any) {
    console.error('[Dreamer Cron] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
