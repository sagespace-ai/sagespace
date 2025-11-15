import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
    const eventType = searchParams.get('eventType')

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build query
    let query = supabase
      .from('live_session_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    const { data: logs, error } = await query

    if (error) throw error

    return NextResponse.json({
      logs,
      total: logs?.length || 0
    })
  } catch (error: any) {
    console.error('[v0] Audit logs error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
