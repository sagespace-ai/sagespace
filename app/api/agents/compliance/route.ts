import { NextRequest, NextResponse } from 'next/server'
import { SageComplianceAgent, ComplianceRequest } from '@/lib/agents'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ComplianceRequest = await request.json()
    
    const agent = new SageComplianceAgent()
    const response = await agent.execute(body)

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Compliance Agent API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to validate compliance' },
      { status: 500 }
    )
  }
}
