/**
 * Admin endpoint to manually trigger Dreamer analysis for testing
 * In production, this would be called by a cron job
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { DreamerSystem } from '@/lib/ai/dreamer'

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Admin] Triggering Dreamer analysis for user:', user.id)

    // Run analysis
    const proposals = await DreamerSystem.analyzeAndPropose(user.id)
    
    // Update memory summary
    await DreamerSystem.updateMemorySummary(user.id)

    return NextResponse.json({
      success: true,
      proposalsGenerated: proposals.length,
      proposals: proposals.map(p => ({
        title: p.title,
        impactLevel: p.impactLevel,
        type: p.proposalType,
      })),
    })
  } catch (error: any) {
    console.error('[Admin Dreamer] Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
