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

    const { sessionId, amount, message, isAnonymous } = await request.json()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user && !isAnonymous) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get session details to find creator
    const { data: session } = await supabase
      .from('live_sessions')
      .select('creator_id')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get creator's Stripe account
    const { data: creator } = await supabase
      .from('live_session_creators')
      .select('user_id')
      .eq('id', session.creator_id)
      .single()

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        session_id: sessionId,
        user_id: user?.id || 'anonymous',
        type: 'live_session_tip'
      },
      application_fee_amount: Math.round(amount * 100 * 0.15), // 15% platform fee
      transfer_data: {
        destination: creator?.user_id, // Creator's Stripe Connect account
      },
    })

    // Record tip in database
    const { data: tip } = await supabase
      .from('live_session_tips')
      .insert({
        session_id: sessionId,
        tipper_user_id: user?.id,
        tipper_username: user?.email?.split('@')[0] || 'Anonymous',
        amount_usd: amount,
        message: message,
        is_anonymous: isAnonymous,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        creator_earnings: amount * 0.85,
        platform_fee: amount * 0.15
      })
      .select()
      .single()

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      tipId: tip.id
    })
  } catch (error: any) {
    console.error('[v0] Error processing tip:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
