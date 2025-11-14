/**
 * API endpoint to view self-healing events and approve fixes
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent self-healing events
    const serviceSupabase = createServiceClient()
    const { data: events, error } = await serviceSupabase
      .from('self_healing_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ events: events || [] })
  } catch (error: any) {
    console.error('[Self-Healing Events API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
