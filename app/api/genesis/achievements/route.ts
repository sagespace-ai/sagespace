import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Mock achievements that work without database
const MOCK_ACHIEVEMENTS = [
  {
    id: 'joined',
    title: 'Joined SageSpace',
    description: 'Welcome to the universe of wisdom',
    icon: '🌟',
    unlocked_at: new Date().toISOString()
  },
  {
    id: 'first-quest',
    title: 'Quest Beginner',
    description: 'Completed your first quest',
    icon: '🎯',
    unlocked_at: new Date().toISOString()
  },
  {
    id: 'level-1',
    title: 'Level 1 Explorer',
    description: 'Reached level 1',
    icon: '⭐',
    unlocked_at: new Date().toISOString()
  }
]

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ achievements: MOCK_ACHIEVEMENTS })
  } catch (error) {
    console.error('[v0] Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
