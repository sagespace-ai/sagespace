/**
 * API endpoint to reject an AI proposal
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { proposalId, reason } = await request.json()

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID required' }, { status: 400 })
    }

    const serviceSupabase = createServiceClient()

    // Update proposal status to rejected
    await serviceSupabase
      .from('ai_proposal_history')
      .update({
        status: 'rejected',
        user_decision_at: new Date().toISOString(),
        user_feedback: reason || 'User rejected',
      })
      .eq('id', proposalId)
      .eq('user_id', user.id)

    // Update design karma
    await updateDesignKarma(user.id, 'rejected')

    // Remove from pending proposals
    await removePendingProposal(user.id, proposalId)

    return NextResponse.json({ success: true, message: 'Proposal rejected' })
  } catch (error: any) {
    console.error('[Reject Proposal API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function updateDesignKarma(userId: string, action: 'rejected') {
  const serviceSupabase = createServiceClient()

  const { data: karma } = await serviceSupabase
    .from('user_design_karma')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const karmaPoints = 5 // Points for reviewing (even if rejected)
  const newKarmaTotal = (karma?.karma_points || 0) + karmaPoints
  const newArchitectLevel = Math.floor(newKarmaTotal / 100) + 1

  await serviceSupabase
    .from('user_design_karma')
    .upsert({
      user_id: userId,
      karma_points: newKarmaTotal,
      architect_level: newArchitectLevel,
      proposals_reviewed: (karma?.proposals_reviewed || 0) + 1,
      proposals_rejected: (karma?.proposals_rejected || 0) + 1,
      review_streak: (karma?.review_streak || 0) + 1,
      longest_review_streak: Math.max((karma?.longest_review_streak || 0), (karma?.review_streak || 0) + 1),
      last_review_at: new Date().toISOString(),
    })
}

async function removePendingProposal(userId: string, proposalId: string) {
  const serviceSupabase = createServiceClient()

  const { data: personalization } = await serviceSupabase
    .from('user_personalization')
    .select('ai_proposals')
    .eq('user_id', userId)
    .maybeSingle()

  if (personalization) {
    const aiProposals = personalization.ai_proposals || { pendingChanges: [], approvedCount: 0, rejectedCount: 0, reviewStreak: 0 }
    aiProposals.pendingChanges = aiProposals.pendingChanges.filter((p: any) => p.id !== proposalId)
    aiProposals.rejectedCount++

    await serviceSupabase
      .from('user_personalization')
      .update({ ai_proposals: aiProposals })
      .eq('user_id', userId)
  }
}
