import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const errorReport = await request.json()

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('error_reports')
      .insert({
        user_id: user?.id || errorReport.userId,
        message: errorReport.message,
        stack: errorReport.stack,
        component_stack: errorReport.componentStack,
        url: errorReport.url,
        user_agent: errorReport.userAgent,
        severity: errorReport.severity,
        timestamp: new Date(errorReport.timestamp).toISOString()
      })

    if (error) {
      console.error('[v0] Failed to save error report:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error in error reporting:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
