import { createServerClient } from '@/lib/supabase/server'
import { ISO42001ComplianceEngine, type ComplianceLog } from '@/lib/compliance/iso42001-engine'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const log: ComplianceLog = await request.json()
    
    // Validate log structure
    if (!log.correlationId || !log.userId || !log.modelProvider) {
      return NextResponse.json({ error: 'Invalid audit log structure' }, { status: 400 })
    }
    
    // Save to database
    await ISO42001ComplianceEngine.saveAuditLog(log, supabase)
    
    return NextResponse.json({ success: true, logId: log.id })
  } catch (error) {
    console.error('[Compliance Audit Log API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save audit log' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const riskLevel = searchParams.get('riskLevel') as any
    
    // Generate compliance report
    const report = await ISO42001ComplianceEngine.generateComplianceReport({
      supabase,
      userId: user.id,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      riskLevel: riskLevel || undefined,
    })
    
    return NextResponse.json(report)
  } catch (error) {
    console.error('[Compliance Report API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    )
  }
}
