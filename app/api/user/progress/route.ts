import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { computeLevelFromXP } from '@/lib/utils/level-system'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    
    if (!progress) {
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          xp: 0,
          level: 1,
          streak_days: 0,
          longest_streak: 0,
          last_active: new Date().toISOString(),
          onboarding_completed: false,
          personality_type: null,
          sage_affinities: {},
          onboarding_answers: [],
        })
        .select()
        .single()
      
      if (createError) {
        console.error('[v0] Error creating progress:', createError)
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        xp: 0,
        level: 1,
        streakDays: 0,
        longestStreak: 0,
        onboarding_completed: false,
        personality_type: null,
        sage_affinities: {},
      })
    }
    
    // Compute level from XP (in case it's out of sync)
    const computedLevel = computeLevelFromXP(progress.xp)
    
    return NextResponse.json({
      xp: progress.xp,
      level: computedLevel,
      streakDays: progress.streak_days,
      longestStreak: progress.longest_streak,
      lastActive: progress.last_active,
      onboarding_completed: progress.onboarding_completed || false,
      personality_type: progress.personality_type,
      sage_affinities: progress.sage_affinities || {},
    })
  } catch (error) {
    console.error('[v0] Error in /api/user/progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
