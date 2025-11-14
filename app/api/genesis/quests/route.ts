import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Mock quest data that works without database
const MOCK_QUESTS = [
  {
    id: 'first-conversation',
    title: 'First Conversation',
    description: 'Start your first chat with Origin Sage',
    icon: '💬',
    progress: 0,
    maxProgress: 1,
    status: 'active',
    rewards: { xp: 50 }
  },
  {
    id: 'explore-playground',
    title: 'Explore the Playground',
    description: 'Try different conversation modes',
    icon: '🎮',
    progress: 0,
    maxProgress: 3,
    status: 'active',
    rewards: { xp: 100 }
  },
  {
    id: 'daily-streak',
    title: 'Build Your Streak',
    description: 'Come back 3 days in a row',
    icon: '🔥',
    progress: 1,
    maxProgress: 3,
    status: 'active',
    rewards: { xp: 150 }
  },
  {
    id: 'council-session',
    title: 'Consult the Council',
    description: 'Get perspectives from multiple sages',
    icon: '🏛️',
    progress: 0,
    maxProgress: 1,
    status: 'active',
    rewards: { xp: 200 }
  },
  {
    id: 'unlock-sage',
    title: 'Unlock Your First Premium Sage',
    description: 'Upgrade to Pro and unlock a new sage',
    icon: '✨',
    progress: 0,
    maxProgress: 1,
    status: 'locked',
    rewards: { xp: 500 }
  }
]

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ quests: MOCK_QUESTS })
  } catch (error) {
    console.error('[v0] Error fetching quests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    )
  }
}
</parameter>
