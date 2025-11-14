import { NextRequest, NextResponse } from 'next/server'
import { SageAffiliateAgent, AffiliateRequest } from '@/lib/agents'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: AffiliateRequest = await request.json()
    
    const agent = new SageAffiliateAgent()
    const response = await agent.execute(body)

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Affiliate Agent API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
