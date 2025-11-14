import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('genesis_profiles')
      .select('onboarding_completed, personality_type, sage_affinities')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      onboardingCompleted: profile?.onboarding_completed || false,
      personalityType: profile?.personality_type || null,
      affinities: profile?.sage_affinities || {}
    })
  } catch (error) {
    console.error('[v0] Error fetching genesis status:', error)
    return NextResponse.json(
      { onboardingCompleted: false, personalityType: null, affinities: {} },
      { status: 200 }
    )
  }
}
