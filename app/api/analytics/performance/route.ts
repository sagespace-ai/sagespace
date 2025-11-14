import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()
    const supabase = await createServerClient()
    
    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Store performance metric
    await supabase.from('performance_metrics').insert({
      user_id: user?.id || null,
      metric_name: metric.name,
      metric_value: metric.value,
      rating: metric.rating,
      timestamp: new Date(metric.timestamp).toISOString(),
      user_agent: request.headers.get('user-agent'),
      url: request.headers.get('referer')
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Performance tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
