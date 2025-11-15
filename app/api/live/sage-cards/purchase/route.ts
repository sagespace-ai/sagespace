import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { cardId, sessionId } = await request.json()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get card details
    const { data: card } = await supabase
      .from('sage_cards')
      .select('*, creator_id')
      .eq('id', cardId)
      .single()

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    // Check if card is still available
    if (card.limited_quantity && card.sold_count >= card.limited_quantity) {
      return NextResponse.json({ error: 'Card sold out' }, { status: 400 })
    }

    // Get creator info for revenue split
    const { data: creator } = await supabase
      .from('live_session_creators')
      .select('user_id')
      .eq('id', card.creator_id)
      .single()

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(card.price_usd * 100),
      currency: 'usd',
      metadata: {
        card_id: cardId,
        session_id: sessionId,
        user_id: user.id,
        type: 'sage_card_purchase'
      },
      application_fee_amount: Math.round(card.price_usd * 100 * 0.20), // 20% platform fee
      transfer_data: {
        destination: creator?.user_id,
      },
    })

    // Reserve the card (will be confirmed on payment success)
    const { data: purchase } = await supabase
      .from('sage_card_purchases')
      .insert({
        card_id: cardId,
        session_id: sessionId,
        buyer_user_id: user.id,
        price_paid: card.price_usd,
        stripe_payment_intent_id: paymentIntent.id
      })
      .select()
      .single()

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      purchaseId: purchase.id
    })
  } catch (error: any) {
    console.error('[v0] Error processing Sage Card purchase:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
