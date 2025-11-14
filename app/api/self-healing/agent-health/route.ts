import { createServerClient } from '@/lib/supabase/server'
import { AgentBuilderHealer } from '@/lib/self-healing/agent-builder-healer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { agentId } = await request.json()
    
    // Load agent
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', user.id)
      .single()
    
    if (error || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    
    const config = {
      name: agent.name,
      description: agent.description,
      domain: agent.role,
      domainScope: agent.domain_scope,
      offScope: agent.off_scope,
      personality: { directness: 50, empathy: 50, formality: 50, creativity: 50 },
      reasoning: { style: 'chain-of-thought' as const, maxSteps: 5, requiresCitations: true },
      capabilities: [],
      integrations: [],
      flowBlocks: [],
      tier: 'free' as const,
    }
    
    // Run health check
    const healthCheck = await AgentBuilderHealer.checkAgentHealth(agentId, config, supabase)
    
    // Auto-fix if requested
    const autoFixableIssues = healthCheck.issues.filter(i => i.autoFixable)
    let fixResult = null
    
    if (autoFixableIssues.length > 0) {
      fixResult = await AgentBuilderHealer.autoFixAgent(agentId, config, autoFixableIssues, supabase)
    }
    
    return NextResponse.json({
      healthCheck,
      fixResult,
    })
  } catch (error) {
    console.error('[Agent Health API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check agent health' },
      { status: 500 }
    )
  }
}

// Periodic health check endpoint (called by cron or system)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Run periodic health checks
    const results = await AgentBuilderHealer.runPeriodicHealthChecks(supabase)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('[Periodic Agent Health] Error:', error)
    return NextResponse.json(
      { error: 'Failed to run periodic health checks' },
      { status: 500 }
    )
  }
}
