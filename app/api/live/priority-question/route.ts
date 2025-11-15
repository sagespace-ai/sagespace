import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const PRIORITY_QUESTION_PRICE = 2.99

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

    const { sessionId, questionText } = await request.json()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(PRIORITY_QUESTION_PRICE * 100),
      currency: 'usd',
      metadata: {
        session_id: sessionId,
        user_id: user.id,
        type: 'priority_question',
        question: questionText
      }
    })

    // Record priority question
    const { data: message } = await supabase
      .from('live_session_messages')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        username: user.email?.split('@')[0] || 'User',
        message_text: questionText,
        message_type: 'question',
        platform: 'sagespace'
      })
      .select()
      .single()

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      messageId: message.id
    })
  } catch (error: any) {
    console.error('[v0] Error processing priority question:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
