import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { EmergencyStopController } from '@/lib/compliance/content-moderator'

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

    const { sessionId, reason } = await request.json()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is creator of session
    const { data: session } = await supabase
      .from('live_sessions')
      .select('creator_id')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const { data: creator } = await supabase
      .from('live_session_creators')
      .select('user_id')
      .eq('id', session.creator_id)
      .single()

    if (creator?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Trigger emergency stop
    const controller = new EmergencyStopController()
    const result = await controller.triggerEmergencyStop(
      sessionId,
      reason,
      user.id
    )

    // End session immediately
    await supabase
      .from('live_sessions')
      .update({
        status: 'ended',
        actual_end: new Date().toISOString()
      })
      .eq('id', sessionId)

    // Log emergency stop
    await supabase
      .from('live_session_audit_logs')
      .insert({
        session_id: sessionId,
        event_type: 'emergency_stop',
        event_description: `Emergency stop triggered: ${reason}`,
        actor_user_id: user.id,
        actor_type: 'creator',
        event_data: {
          reason,
          timestamp: new Date().toISOString()
        },
        compliance_level: 'critical',
        requires_review: true
      })

    return NextResponse.json({
      success: true,
      auditLogId: result.auditLogId
    })
  } catch (error: any) {
    console.error('[v0] Emergency stop error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
