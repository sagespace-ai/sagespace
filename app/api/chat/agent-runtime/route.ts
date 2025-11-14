import { createServerClient } from '@/lib/supabase/server'
import { AgentRuntime } from '@/lib/agents/agent-runtime'
import type { AgentBehaviorConfig } from '@/lib/agents/agent-builder-types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { agentId, message, conversationHistory, sessionId } = body
    
    // Load agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', user.id)
      .single()
    
    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    
    // Get user tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()
    
    const userTier = subscription?.plan_id || 'free'
    
    // Build agent config from database record
    const config: AgentBehaviorConfig = {
      name: agent.name,
      description: agent.description,
      domain: agent.role,
      domainScope: agent.domain_scope,
      offScope: agent.off_scope,
      personality: {
        directness: 50,
        empathy: 50,
        formality: 50,
        creativity: 50,
      },
      reasoning: {
        style: 'chain-of-thought',
        maxSteps: 5,
        requiresCitations: true,
      },
      capabilities: [],
      integrations: [],
      flowBlocks: [],
      tier: 'free',
    }
    
    // Execute agent
    const result = await AgentRuntime.execute(config, {
      userId: user.id,
      sessionId: sessionId || `session-${Date.now()}`,
      agentId,
      userMessage: message,
      conversationHistory: conversationHistory || [],
      userTier,
    }, supabase)
    
    return NextResponse.json({
      response: result.response,
      metadata: result.metadata,
      usedIntegrations: result.usedIntegrations,
    })
  } catch (error) {
    console.error('[Agent Runtime API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute agent' },
      { status: 500 }
    )
  }
}
