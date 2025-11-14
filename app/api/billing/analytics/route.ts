import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscription data
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get all purchases (themes)
    const { data: themePurchases } = await supabase
      .from('user_themes')
      .select('theme_id, purchased_at')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })

    // Get Genesis purchases
    const { data: genesisPurchases } = await supabase
      .from('genesis_purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })

    // Get observability usage stats
    const { data: interactions } = await supabase
      .from('observability_events')
      .select('event_type, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    // Calculate total spent
    let totalSpent = 0
    if (subscription && subscription.tier !== 'explorer') {
      // Assume monthly billing
      const subscriptionPrice = {
        voyager: 9,
        astral: 19,
        oracle: 49,
        celestial: 99
      }[subscription.tier] || 0
      
      totalSpent += subscriptionPrice
    }

    // Add theme purchases (assume $4.99 each for now)
    totalSpent += (themePurchases?.length || 0) * 4.99

    // Add Genesis purchases
    const genesisTotalSpent = genesisPurchases?.reduce((sum, p) => sum + parseFloat(p.price_paid), 0) || 0
    totalSpent += genesisTotalSpent

    // Usage stats
    const usageStats = {
      last30Days: {
        interactions: interactions?.length || 0,
        sageChats: interactions?.filter(i => i.event_type === 'sage_chat').length || 0,
        councilSessions: interactions?.filter(i => i.event_type === 'council_session').length || 0
      }
    }

    return NextResponse.json({
      subscription,
      purchases: {
        themes: themePurchases || [],
        genesis: genesisPurchases || [],
        total: (themePurchases?.length || 0) + (genesisPurchases?.length || 0)
      },
      spending: {
        totalLifetime: totalSpent,
        thisMonth: totalSpent, // Simplified
        subscriptionValue: subscription?.tier !== 'explorer' ? totalSpent : 0,
        oneTimePurchases: (themePurchases?.length || 0) * 4.99 + genesisTotalSpent
      },
      usage: usageStats
    })
  } catch (error) {
    console.error('[v0] [Billing Analytics] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
