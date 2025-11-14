import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { updateStreak } from '@/lib/utils/streak-system'
import { XP_REWARDS } from '@/lib/utils/level-system'

export async function POST() {
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
    
    // Get current progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (progressError || !progress) {
      // Create progress if it doesn't exist
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          xp: XP_REWARDS.DAILY_LOGIN,
          level: 1,
          streak_days: 1,
          longest_streak: 1,
          last_active: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (createError) {
        console.error('[API] Error creating progress:', createError)
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        xp: XP_REWARDS.DAILY_LOGIN,
        level: 1,
        streakDays: 1,
        longestStreak: 1,
        xpGained: XP_REWARDS.DAILY_LOGIN,
        streakIncreased: true,
      })
    }
    
    // Calculate streak update
    const { newStreak, longestStreak, earnedBonus } = updateStreak(
      new Date(progress.last_active),
      progress.streak_days,
      progress.longest_streak
    )
    
    // Calculate XP to award
    let xpGained = 0
    if (earnedBonus) {
      xpGained = XP_REWARDS.DAILY_LOGIN
      if (newStreak % 7 === 0) {
        // Bonus every 7 days
        xpGained += XP_REWARDS.STREAK_BONUS
      }
    }
    
    const newXP = progress.xp + xpGained
    
    // Update progress
    const { data: updated, error: updateError } = await supabase
      .from('user_progress')
      .update({
        xp: newXP,
        streak_days: newStreak,
        longest_streak: longestStreak,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('[API] Error updating progress:', updateError)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      xp: newXP,
      level: updated.level,
      streakDays: newStreak,
      longestStreak: longestStreak,
      xpGained,
      streakIncreased: earnedBonus,
    })
  } catch (error) {
    console.error('[API] Error in /api/user/progress/heartbeat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
