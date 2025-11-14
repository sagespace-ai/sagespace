import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { focusAreas, journeyModes, timeCommitment, preferredSages, onboardingCompleted } = body

    const updates: any = { updated_at: new Date().toISOString() }
    if (focusAreas !== undefined) updates.focus_areas = focusAreas
    if (journeyModes !== undefined) updates.journey_modes = journeyModes
    if (timeCommitment !== undefined) updates.time_commitment = timeCommitment
    if (preferredSages !== undefined) updates.preferred_sages = preferredSages
    if (onboardingCompleted !== undefined) updates.onboarding_completed = onboardingCompleted

    const { error: upsertError } = await supabase
      .from('passport_preferences')
      .upsert({
        user_id: user.id,
        ...updates,
      })

    if (upsertError) {
      console.error('[API] Error updating preferences:', upsertError)
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error in /api/passport/preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
