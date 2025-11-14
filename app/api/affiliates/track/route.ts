import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, interactionType } = await request.json()

    if (!productId || !interactionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_affiliate_interactions')
      .insert({
        user_id: user.id,
        product_id: productId,
        interaction_type: interactionType
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Affiliates API] Error tracking interaction:', error)
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    )
  }
}
