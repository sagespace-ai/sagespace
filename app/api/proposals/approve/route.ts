/**
 * API endpoint to approve an AI proposal and apply changes
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'
import { GovernanceChecker, type GovernanceContext } from '@/lib/governance/policy'

export async function POST(request: Request) {
  try {
    console.log('[v0] [Approve Proposal] Starting approval process...')
    
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('[v0] [Approve Proposal] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { proposalId } = await request.json()
    console.log('[v0] [Approve Proposal] Proposal ID:', proposalId, 'User:', user.id)

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID required' }, { status: 400 })
    }

    const serviceSupabase = createServiceClient()

    const { data: proposal, error: fetchError } = await serviceSupabase
      .from('ai_proposal_history')
      .select('*')
      .eq('id', proposalId)
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('[v0] [Approve Proposal] Fetched proposal:', proposal, 'Error:', fetchError)

    if (fetchError || !proposal) {
      console.log('[v0] [Approve Proposal] Proposal not found')
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    const { data: personalization } = await serviceSupabase
      .from('user_personalization')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('[v0] [Approve Proposal] Current personalization:', personalization)

    const governanceContext: GovernanceContext = {
      userId: user.id,
      currentPreferences: personalization?.ux_preferences || {},
      userHistory: personalization?.memory_summary || {},
      platformConfig: {},
    }

    const governanceResult = await GovernanceChecker.checkProposal(proposal, governanceContext)

    console.log('[v0] [Approve Proposal] Governance result:', governanceResult)

    if (!governanceResult.approved) {
      console.error('[Approve Proposal] Governance check failed:', governanceResult.violations)
      return NextResponse.json({
        error: 'Proposal failed final governance check',
        violations: governanceResult.violations,
      }, { status: 403 })
    }

    console.log('[v0] [Approve Proposal] Updating proposal status to approved...')
    const { error: updateError } = await serviceSupabase
      .from('ai_proposal_history')
      .update({
        status: 'approved',
        user_decision_at: new Date().toISOString(),
        governance_approved: true,
        governance_reasoning: 'Passed all governance checks',
      })
      .eq('id', proposalId)

    if (updateError) {
      console.error('[v0] [Approve Proposal] Update error:', updateError)
    }

    console.log('[v0] [Approve Proposal] Applying proposal changes...')
    await applyProposalChanges(user.id, proposal)

    console.log('[v0] [Approve Proposal] Updating design karma...')
    await updateDesignKarma(user.id, 'approved')

    console.log('[v0] [Approve Proposal] Removing from pending proposals...')
    await removePendingProposal(user.id, proposalId)

    console.log('[v0] [Approve Proposal] ✅ Success! Proposal approved and applied')
    return NextResponse.json({ 
      success: true, 
      message: 'Proposal approved and applied',
      proposalTitle: proposal.title,
      changesApplied: proposal.proposed_changes
    })
  } catch (error: any) {
    console.error('[v0] [Approve Proposal API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function applyProposalChanges(userId: string, proposal: any) {
  console.log('[v0] [Apply Proposal Changes] Starting for user:', userId, 'Type:', proposal.proposal_type)
  
  const serviceSupabase = createServiceClient()

  const { data: personalization } = await serviceSupabase
    .from('user_personalization')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  console.log('[v0] [Apply Proposal Changes] Current personalization:', personalization)

  if (!personalization) {
    console.log('[v0] [Apply Proposal Changes] No personalization record found')
    return
  }

  // Apply changes based on proposal type
  switch (proposal.proposal_type) {
    case 'ux_change':
      console.log('[v0] [Apply Proposal Changes] Applying UX changes:', proposal.proposed_changes)
      const updatedUxPreferences = {
        ...personalization.ux_preferences,
        ...proposal.proposed_changes,
      }
      const { error: uxError } = await serviceSupabase
        .from('user_personalization')
        .update({ ux_preferences: updatedUxPreferences })
        .eq('user_id', userId)
      
      console.log('[v0] [Apply Proposal Changes] UX update result. Error:', uxError)
      break

    case 'feature_toggle':
      console.log('[v0] [Apply Proposal Changes] Toggling features:', proposal.proposed_changes)
      const updatedFeatureFlags = {
        ...personalization.feature_flags,
        ...proposal.proposed_changes,
      }
      const { error: featureError } = await serviceSupabase
        .from('user_personalization')
        .update({ feature_flags: updatedFeatureFlags })
        .eq('user_id', userId)
      
      console.log('[v0] [Apply Proposal Changes] Feature toggle result. Error:', featureError)
      break

    default:
      console.log('[v0] [Apply Proposal Changes] Applying generic changes:', proposal.proposed_changes)
      const updatedFlags = {
        ...personalization.feature_flags,
        [`proposal_${proposal.id}`]: proposal.proposed_changes,
      }
      const { error: genericError } = await serviceSupabase
        .from('user_personalization')
        .update({ feature_flags: updatedFlags })
        .eq('user_id', userId)
      
      console.log('[v0] [Apply Proposal Changes] Generic update result. Error:', genericError)
  }

  console.log('[v0] [Apply Proposal Changes] Marking proposal as applied...')
  const { error: appliedError } = await serviceSupabase
    .from('ai_proposal_history')
    .update({
      status: 'applied',
      applied_at: new Date().toISOString(),
    })
    .eq('id', proposal.id)
  
  console.log('[v0] [Apply Proposal Changes] ✅ Applied successfully. Error:', appliedError)
}

async function updateDesignKarma(userId: string, action: 'approved' | 'rejected') {
  console.log('[v0] [Update Design Karma] Action:', action, 'for user:', userId)
  
  const serviceSupabase = createServiceClient()

  const { data: karma } = await serviceSupabase
    .from('user_design_karma')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  console.log('[v0] [Update Design Karma] Current karma:', karma)

  const karmaPoints = action === 'approved' ? 10 : 5
  const newKarmaTotal = (karma?.karma_points || 0) + karmaPoints
  const newArchitectLevel = Math.floor(newKarmaTotal / 100) + 1

  console.log('[v0] [Update Design Karma] New karma total:', newKarmaTotal, 'New level:', newArchitectLevel)

  const { error: karmaError } = await serviceSupabase
    .from('user_design_karma')
    .upsert({
      user_id: userId,
      karma_points: newKarmaTotal,
      architect_level: newArchitectLevel,
      proposals_reviewed: (karma?.proposals_reviewed || 0) + 1,
      proposals_approved: action === 'approved' ? (karma?.proposals_approved || 0) + 1 : karma?.proposals_approved || 0,
      proposals_rejected: action === 'rejected' ? (karma?.proposals_rejected || 0) + 1 : karma?.proposals_rejected || 0,
      review_streak: (karma?.review_streak || 0) + 1,
      longest_review_streak: Math.max((karma?.longest_review_streak || 0), (karma?.review_streak || 0) + 1),
      last_review_at: new Date().toISOString(),
    })
  
  console.log('[v0] [Update Design Karma] ✅ Updated successfully. Error:', karmaError)
}

async function removePendingProposal(userId: string, proposalId: string) {
  console.log('[v0] [Remove Pending] Removing proposal:', proposalId, 'for user:', userId)
  
  const serviceSupabase = createServiceClient()

  const { data: personalization } = await serviceSupabase
    .from('user_personalization')
    .select('ai_proposals')
    .eq('user_id', userId)
    .maybeSingle()

  console.log('[v0] [Remove Pending] Current AI proposals:', personalization?.ai_proposals)

  if (personalization) {
    const aiProposals = personalization.ai_proposals || { pendingChanges: [], approvedCount: 0, rejectedCount: 0, reviewStreak: 0 }
    const beforeCount = aiProposals.pendingChanges.length
    aiProposals.pendingChanges = aiProposals.pendingChanges.filter((p: any) => p.id !== proposalId)
    const afterCount = aiProposals.pendingChanges.length
    aiProposals.approvedCount++

    console.log('[v0] [Remove Pending] Removed proposal. Before:', beforeCount, 'After:', afterCount)

    const { error: removeError } = await serviceSupabase
      .from('user_personalization')
      .update({ ai_proposals: aiProposals })
      .eq('user_id', userId)
    
    console.log('[v0] [Remove Pending] ✅ Removed successfully. Error:', removeError)
  }
}
