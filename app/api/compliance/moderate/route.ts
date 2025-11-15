import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ContentModerator } from '@/lib/compliance/content-moderator'

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

    const { content, sessionId, sageTwinId, isAIGenerated } = await request.json()

    // Get session and Sage Twin config
    const { data: session } = await supabase
      .from('live_sessions')
      .select('*, sage_twin_id')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const { data: sageTwin } = await supabase
      .from('sage_twins')
      .select('*')
      .eq('id', session.sage_twin_id)
      .single()

    // Initialize moderator with Sage Twin config
    const moderator = new ContentModerator({
      filterLevel: sageTwin?.content_filter_level || 'moderate',
      blockedTopics: sageTwin?.blocked_topics || [],
      allowedTopics: sageTwin?.allowed_topics || [],
      requiresHumanApproval: sageTwin?.requires_human_approval || false,
      safeModeEnabled: session?.safe_mode_enabled || true
    })

    // Moderate content
    const result = isAIGenerated 
      ? await moderator.moderateAIResponse(content, sageTwinId, sessionId)
      : await moderator.moderateText(content, { isAIGenerated: false, sessionId })

    // Log moderation event
    await supabase
      .from('live_session_audit_logs')
      .insert({
        session_id: sessionId,
        event_type: result.flagged ? 'compliance_flag' : 'sage_response',
        event_description: `Content moderation: ${result.approved ? 'Approved' : 'Blocked'}`,
        actor_type: 'system',
        event_data: {
          content_preview: content.substring(0, 100),
          moderation_result: result,
          ai_generated: isAIGenerated
        },
        compliance_level: result.severity,
        requires_review: !result.approved || result.flagged
      })

    return NextResponse.json({
      approved: result.approved,
      flagged: result.flagged,
      reason: result.reason,
      severity: result.severity,
      aiWatermark: result.aiWatermark
    })
  } catch (error: any) {
    console.error('[v0] Moderation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
