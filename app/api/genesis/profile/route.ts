import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[v0] Fetching genesis profile for user:', user.id)

    // Frontend will manage onboarding state locally via localStorage
    const defaultProfile = {
      user_id: user.id,
      onboarding_completed: false, // Will be managed by frontend localStorage
      personality_type: null,
      sage_affinities: {},
      onboarding_answers: {},
      unlocked_sages: ['origin-sage'], // Everyone gets Origin Sage for free
      created_at: new Date().toISOString()
    }

    console.log('[v0] Returning default Genesis profile')

    return NextResponse.json(defaultProfile)
  } catch (error) {
    console.error('[v0] Error fetching genesis profile:', error)
    return NextResponse.json(
      { 
        onboarding_completed: false, 
        personality_type: null,
        sage_affinities: {},
        unlocked_sages: ['origin-sage']
      },
      { status: 200 }
    )
  }
}
