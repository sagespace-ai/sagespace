/**
 * API endpoint to get/update user personalization settings
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user personalization
    const serviceSupabase = createServiceClient()
    const { data, error } = await serviceSupabase
      .from('user_personalization')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    // If no personalization exists, create default
    if (!data) {
      const defaultPersonalization = {
        user_id: user.id,
        ux_preferences: {
          theme: 'cosmic',
          density: 'comfortable',
          animations: true,
          navigationStyle: 'sidebar',
          fontSize: 'medium',
          colorAccent: 'cyan',
        },
        feature_flags: {},
        ai_proposals: {
          pendingChanges: [],
          approvedCount: 0,
          rejectedCount: 0,
          reviewStreak: 0,
        },
        memory_summary: {
          favoriteFeatures: [],
          usagePatterns: {},
          preferredSages: [],
          avoidedFeatures: [],
          peakActivityHours: [],
        },
      }

      await serviceSupabase.from('user_personalization').insert(defaultPersonalization)

      return NextResponse.json(defaultPersonalization)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Personalization API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    const serviceSupabase = createServiceClient()
    const { data, error } = await serviceSupabase
      .from('user_personalization')
      .upsert({
        user_id: user.id,
        ...updates,
      })
      .select()
      .maybeSingle()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Personalization API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
