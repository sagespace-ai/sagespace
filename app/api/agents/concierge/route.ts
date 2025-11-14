import { NextRequest, NextResponse } from 'next/server'
import { SageConciergeAgent, ConciergeRequest } from '@/lib/agents'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ConciergeRequest = await request.json()
    
    const agent = new SageConciergeAgent()
    const response = await agent.execute(body)

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Concierge Agent API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
