import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { achievementKey } = body

    if (!achievementKey) {
      return NextResponse.json({ error: 'Achievement key required' }, { status: 400 })
    }

    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_key', achievementKey)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ message: 'Achievement already unlocked' })
    }

    // Get achievement details
    const { data: achievement } = await supabase
      .from('passport_achievements')
      .select('xp_reward')
      .eq('key', achievementKey)
      .single()

    // Unlock achievement
    const { error: unlockError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        achievement_key: achievementKey,
      })

    if (unlockError) {
      console.error('[API] Error unlocking achievement:', unlockError)
      return NextResponse.json({ error: 'Failed to unlock achievement' }, { status: 500 })
    }

    // Award XP if applicable
    if (achievement?.xp_reward) {
      await supabase.rpc('add_xp', { 
        user_id_input: user.id, 
        xp_amount: achievement.xp_reward 
      })
    }

    return NextResponse.json({
      success: true,
      xpAwarded: achievement?.xp_reward || 0,
    })
  } catch (error) {
    console.error('[API] Error in /api/passport/unlock-achievement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
