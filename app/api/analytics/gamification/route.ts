import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gamificationAnalytics } from '@/lib/analytics/gamification-metrics'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metrics = await gamificationAnalytics.getUserMetrics(user.id)
    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('[v0] Error fetching gamification metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
