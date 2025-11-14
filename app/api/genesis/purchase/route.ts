import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { GENESIS_UNLOCKS } from '@/config/genesis-unlocks'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { unlockId } = body

    const unlock = GENESIS_UNLOCKS.find(u => u.id === unlockId)
    if (!unlock) {
      return NextResponse.json({ error: 'Invalid unlock' }, { status: 400 })
    }

    console.log(`[v0] [Genesis Purchase] User ${user.id} purchasing ${unlockId}`)

    // TODO: Integrate with Stripe for actual payment
    // For now, we'll just record the purchase in the database

    // Record purchase
    const { error: purchaseError } = await supabase
      .from('genesis_purchases')
      .insert({
        user_id: user.id,
        unlock_id: unlock.id,
        unlock_type: unlock.type,
        price_paid: unlock.price,
        purchased_at: new Date().toISOString()
      })

    if (purchaseError) {
      console.error('[v0] [Genesis Purchase] Error:', purchaseError)
      return NextResponse.json({ error: 'Purchase failed' }, { status: 500 })
    }

    // Apply bonus XP if included
    if (unlock.contents.bonusXP) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('xp')
        .eq('user_id', user.id)
        .single()

      if (progress) {
        await supabase
          .from('user_progress')
          .update({ xp: progress.xp + unlock.contents.bonusXP })
          .eq('user_id', user.id)
      }
    }

    console.log(`[v0] [Genesis Purchase] Purchase successful`)
    
    return NextResponse.json({ 
      success: true, 
      unlock,
      bonusXP: unlock.contents.bonusXP || 0
    })
  } catch (error) {
    console.error('[v0] [Genesis Purchase] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
