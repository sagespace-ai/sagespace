/**
 * API endpoint to approve and apply a self-healing fix
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    // Get the event
    const serviceSupabase = createServiceClient()
    const { data: event, error: fetchError } = await serviceSupabase
      .from('self_healing_events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Mark as approved and applied
    await serviceSupabase
      .from('self_healing_events')
      .update({
        user_approved: true,
        fix_applied: true,
        fix_successful: null, // Will be determined after applying
        resolved_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    return NextResponse.json({
      success: true,
      message: 'Fix approved and will be applied',
    })
  } catch (error: any) {
    console.error('[Approve Fix API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
