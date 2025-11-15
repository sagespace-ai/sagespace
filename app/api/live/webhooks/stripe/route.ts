import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')!

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

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

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const { type, session_id } = paymentIntent.metadata

        if (type === 'live_session_tip') {
          // Update tip status
          await supabase
            .from('live_session_tips')
            .update({ payment_status: 'completed' })
            .eq('stripe_payment_intent_id', paymentIntent.id)

          // Update session revenue
          await supabase.rpc('increment_session_revenue', {
            p_session_id: session_id,
            p_amount: paymentIntent.amount / 100
          })
        }

        if (type === 'sage_card_purchase') {
          // Confirm card purchase and increment sold count
          await supabase.rpc('complete_card_purchase', {
            p_payment_intent_id: paymentIntent.id
          })
        }

        if (type === 'priority_question') {
          // Mark question as priority (already created in database)
          const { question, user_id } = paymentIntent.metadata
          
          await supabase
            .from('live_session_messages')
            .update({ 
              message_type: 'question',
              is_highlighted: true 
            })
            .eq('session_id', session_id)
            .eq('user_id', user_id)
            .eq('message_text', question)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const { type } = paymentIntent.metadata

        if (type === 'live_session_tip') {
          await supabase
            .from('live_session_tips')
            .update({ payment_status: 'failed' })
            .eq('stripe_payment_intent_id', paymentIntent.id)
        }

        if (type === 'sage_card_purchase') {
          // Remove failed purchase attempt
          await supabase
            .from('sage_card_purchases')
            .delete()
            .eq('stripe_payment_intent_id', paymentIntent.id)
        }
        break
      }

      default:
        console.log('[v0] Unhandled Stripe event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[v0] Stripe webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
