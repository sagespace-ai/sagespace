import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's progress and level
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('level, xp')
      .eq('user_id', user.id)
      .single()

    const userLevel = userProgress?.level || 1

    // Fetch available quests
    const { data: availableQuests } = await supabase
      .from('quest_definitions')
      .select('*')
      .lte('required_level', userLevel)
      .eq('is_active', true)

    // Fetch user's quest progress
    const { data: questProgress } = await supabase
      .from('user_quest_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'completed'])

    return NextResponse.json({
      availableQuests: availableQuests || [],
      activeQuests: questProgress?.filter(q => q.status === 'active') || [],
      completedQuests: questProgress?.filter(q => q.status === 'completed') || [],
      userLevel
    })
  } catch (error) {
    console.error('[v0] Error fetching quests:', error)
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { questId, action } = await request.json()

    if (action === 'start') {
      // Start a new quest
      const { data, error } = await supabase
        .from('user_quest_progress')
        .insert({
          user_id: user.id,
          quest_id: questId,
          status: 'active',
          steps_completed: {}
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, quest: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Error managing quest:', error)
    return NextResponse.json({ error: 'Failed to manage quest' }, { status: 500 })
  }
}
