/**
 * API endpoint to get user's design karma stats
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

    const serviceSupabase = createServiceClient()
    const { data, error } = await serviceSupabase
      .from('user_design_karma')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    // Return default karma if none exists
    if (!data) {
      return NextResponse.json({
        karmaPoints: 0,
        architectLevel: 1,
        proposalsReviewed: 0,
        proposalsApproved: 0,
        proposalsRejected: 0,
        reviewStreak: 0,
        longestReviewStreak: 0,
      })
    }

    return NextResponse.json({
      karmaPoints: data.karma_points,
      architectLevel: data.architect_level,
      proposalsReviewed: data.proposals_reviewed,
      proposalsApproved: data.proposals_approved,
      proposalsRejected: data.proposals_rejected,
      reviewStreak: data.review_streak,
      longestReviewStreak: data.longest_review_streak,
    })
  } catch (error: any) {
    console.error('[Design Karma API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
