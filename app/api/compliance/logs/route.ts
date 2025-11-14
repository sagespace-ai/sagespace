import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const riskLevel = searchParams.get('riskLevel')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let query = supabase
      .from('compliance_audit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (riskLevel) {
      query = query.eq('risk_level', riskLevel)
    }
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    const { data: logs, error } = await query
    
    if (error) {
      console.error('[Compliance Logs API] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }
    
    return NextResponse.json({ logs })
  } catch (error) {
    console.error('[Compliance Logs API] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch compliance logs' }, { status: 500 })
  }
}
