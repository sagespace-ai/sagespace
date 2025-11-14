import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { personalityType, affinities, answers } = body

    console.log('[v0] Completing onboarding for user:', user.id)
    console.log('[v0] Personality:', personalityType)
    console.log('[v0] Affinities:', JSON.stringify(affinities))

    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('xp, level')
      .eq('user_id', user.id)
      .maybeSingle()

    const newXP = (currentProgress?.xp || 0) + 100

    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        xp: newXP,
        level: currentProgress?.level || 1,
        last_active: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    console.log('[v0] Awarded 100 XP for onboarding completion')
    console.log('[v0] Onboarding completed successfully!')

    return NextResponse.json({ 
      success: true,
      xpAwarded: 100,
      newXP,
      message: 'Onboarding completed! Welcome to SageSpace.',
      genesisData: {
        personalityType,
        affinities,
        answers,
        completedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[v0] Error completing onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
