import { createServerClient } from '@/lib/supabase/server'
import { GovernanceChecker } from '@/lib/governance/policy'
import { ISO42001ComplianceEngine } from '@/lib/compliance/iso42001-engine'
import { NextRequest, NextResponse } from 'next/server'
import type { AgentBehaviorConfig } from '@/lib/agents/agent-builder-types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const config: AgentBehaviorConfig = await request.json()
    
    // Validate agent configuration
    if (!config.name || !config.domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 })
    }
    
    // Governance check
    const governanceResult = await GovernanceChecker.checkProposal(
      {
        proposal_type: 'agent_creation',
        proposal_description: `Create agent: ${config.name}`,
        proposed_changes: config,
      },
      {
        userId: user.id,
        currentPreferences: {},
        userHistory: {},
        platformConfig: {},
      }
    )
    
    if (!governanceResult.approved) {
      return NextResponse.json({
        error: 'Agent failed governance checks',
        violations: governanceResult.violations,
      }, { status: 403 })
    }
    
    // Create compliance context
    const complianceContext = ISO42001ComplianceEngine.createContext({
      userId: user.id,
      sessionId: `agent-create-${Date.now()}`,
      agentId: `agent-${Date.now()}`,
      inputData: JSON.stringify(config),
      dataSources: [{ type: 'user-input', origin: 'studio-builder' }],
    })
    
    // Save agent to database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: user.id,
        name: config.name,
        description: config.description,
        domain_scope: config.domainScope,
        off_scope: config.offScope,
        role: config.domain,
        status: 'active',
      })
      .select()
      .single()
    
    if (error) {
      console.error('[Agent Save] Database error:', error)
      return NextResponse.json({ error: 'Failed to save agent' }, { status: 500 })
    }
    
    // Log compliance audit
    const auditLog = ISO42001ComplianceEngine.createAuditLog({
      context: complianceContext,
      input: JSON.stringify(config),
      output: `Agent created: ${agent.id}`,
      inputTokens: JSON.stringify(config).length / 4,
      outputTokens: 50,
      processingTimeMs: 100,
      governanceResult: {
        passed: true,
        violations: [],
      },
    })
    
    await ISO42001ComplianceEngine.saveAuditLog(auditLog, supabase)
    
    return NextResponse.json({ success: true, agentId: agent.id })
  } catch (error) {
    console.error('[Agent Save API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save agent' },
      { status: 500 }
    )
  }
}
