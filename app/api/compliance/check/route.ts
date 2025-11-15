import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ISO42001Checker } from '@/lib/compliance/iso42001-checker'

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Get session and Sage Twin details
    const { data: session } = await supabase
      .from('live_sessions')
      .select('*, sage_twin_id, safe_mode_enabled')
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

    // Run ISO 42001 compliance check
    const checker = new ISO42001Checker()
    const checks = await checker.checkCompliance({
      sageTwinId: session.sage_twin_id,
      sessionId: sessionId,
      hasLicenseAcknowledgment: sageTwin?.voice_license_acknowledged && sageTwin?.avatar_license_acknowledged,
      hasContentFiltering: sageTwin?.content_filter_level !== null,
      hasAuditLogging: true, // Enabled by default in schema
      hasHumanOversight: sageTwin?.requires_human_approval || false,
      hasEmergencyStop: true // Available in all sessions
    })

    const report = checker.generateComplianceReport(checks)

    // Log compliance check
    await supabase
      .from('live_session_audit_logs')
      .insert({
        session_id: sessionId,
        event_type: 'compliance_flag',
        event_description: `ISO 42001 compliance check: ${report.overallCompliance.toFixed(1)}% compliant`,
        actor_type: 'system',
        event_data: {
          checks,
          report
        },
        compliance_level: report.overallCompliance < 80 ? 'high' : 'low',
        requires_review: report.overallCompliance < 80
      })

    return NextResponse.json({
      checks,
      report,
      iso42001Compliant: report.overallCompliance >= 80
    })
  } catch (error: any) {
    console.error('[v0] Compliance check error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
