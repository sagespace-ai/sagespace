import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streakEngine } from '@/lib/engagement/streak-engine'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const streak = await streakEngine.getUserStreak(user.id)
    return NextResponse.json({ streak })
  } catch (error) {
    console.error('[v0] Error fetching streak:', error)
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedStreak = await streakEngine.updateStreak(user.id)
    const rewards = streakEngine.getStreakRewards(updatedStreak.currentStreak)

    return NextResponse.json({ 
      streak: updatedStreak,
      rewards 
    })
  } catch (error) {
    console.error('[v0] Error updating streak:', error)
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 })
  }
}
