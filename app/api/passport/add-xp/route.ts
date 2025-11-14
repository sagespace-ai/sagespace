import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { awardXP } from '@/lib/utils/passport-helpers'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, reason } = body

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 })
    }

    // Get current progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('xp')
      .eq('user_id', user.id)
      .single()

    const currentXP = progress?.xp || 0
    const result = awardXP(currentXP, amount)

    // Update XP and level
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        xp: result.newXP,
        level: result.newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('[API] Error updating XP:', updateError)
      return NextResponse.json({ error: 'Failed to update XP' }, { status: 500 })
    }

    return NextResponse.json({
      newXP: result.newXP,
      newLevel: result.newLevel,
      leveledUp: result.leveledUp,
      oldLevel: result.oldLevel,
      xpAdded: amount,
      reason,
    })
  } catch (error) {
    console.error('[API] Error in /api/passport/add-xp:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
