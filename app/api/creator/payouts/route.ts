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

    const { amount } = await request.json()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get creator profile
    const { data: creator } = await supabase
      .from('live_session_creators')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!creator) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    // Check available balance
    if (amount > creator.total_revenue) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Create Stripe payout (requires Stripe Connect setup)
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        creator_id: creator.id,
        user_id: user.id
      }
    }, {
      stripeAccount: creator.user_id // Creator's Stripe Connect account
    })

    // Update creator balance
    await supabase
      .from('live_session_creators')
      .update({
        total_revenue: creator.total_revenue - amount
      })
      .eq('id', creator.id)

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      amount: amount
    })
  } catch (error: any) {
    console.error('[v0] Error processing payout:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
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

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get creator earnings summary
    const { data: creator } = await supabase
      .from('live_session_creators')
      .select('total_revenue, total_earnings')
      .eq('user_id', user.id)
      .single()

    if (!creator) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    // Get revenue breakdown
    const { data: tips } = await supabase
      .from('live_session_tips')
      .select('creator_earnings')
      .eq('payment_status', 'completed')

    const { data: cards } = await supabase
      .from('sage_card_purchases')
      .select('price_paid')

    const tipsTotal = tips?.reduce((sum, tip) => sum + Number(tip.creator_earnings), 0) || 0
    const cardsTotal = (cards?.reduce((sum, card) => sum + Number(card.price_paid), 0) || 0) * 0.80

    return NextResponse.json({
      availableBalance: creator.total_revenue,
      totalEarnings: creator.total_earnings,
      breakdown: {
        tips: tipsTotal,
        sageCards: cardsTotal,
        priorityQuestions: creator.total_earnings - tipsTotal - cardsTotal
      }
    })
  } catch (error: any) {
    console.error('[v0] Error fetching payout info:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
