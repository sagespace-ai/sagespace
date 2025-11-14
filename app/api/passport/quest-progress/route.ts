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
    const { questKey, increment = 1 } = body

    if (!questKey) {
      return NextResponse.json({ error: 'Quest key required' }, { status: 400 })
    }

    // Get quest details
    const { data: quest } = await supabase
      .from('passport_quests')
      .select('*')
      .eq('key', questKey)
      .single()

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    // Get current progress
    const { data: progress } = await supabase
      .from('user_quest_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('quest_key', questKey)
      .maybeSingle()

    const currentSteps = progress?.steps_completed || 0
    const newSteps = Math.min(currentSteps + increment, quest.steps_total)
    const completed = newSteps >= quest.steps_total

    // Upsert progress
    const { error: upsertError } = await supabase
      .from('user_quest_progress')
      .upsert({
        user_id: user.id,
        quest_key: questKey,
        steps_completed: newSteps,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })

    if (upsertError) {
      console.error('[API] Error updating quest progress:', upsertError)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Award XP if quest completed
    if (completed && !progress?.completed) {
      await supabase.rpc('add_xp', {
        user_id_input: user.id,
        xp_amount: quest.xp_reward,
      })
    }

    return NextResponse.json({
      success: true,
      stepsCompleted: newSteps,
      completed,
      xpAwarded: completed && !progress?.completed ? quest.xp_reward : 0,
    })
  } catch (error) {
    console.error('[API] Error in /api/passport/quest-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
