import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user subscription tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()
    
    const userTier = subscription?.plan_id || 'free'
    
    // Get connected integrations
    const { data: integrations } = await supabase
      .from('user_integrations')
      .select('integration_type')
      .eq('user_id', user.id)
      .eq('is_active', true)
    
    const connected = integrations?.map(i => i.integration_type) || []
    
    return NextResponse.json({ userTier, connected })
  } catch (error) {
    console.error('[Integrations List API] Error:', error)
    return NextResponse.json({ error: 'Failed to load integrations' }, { status: 500 })
  }
}
