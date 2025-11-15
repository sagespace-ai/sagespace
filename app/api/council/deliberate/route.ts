import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { runChat } from '@/lib/ai/chatClient'
import { monitoredAPIRoute } from '@/lib/self-healing/middleware'

async function councilHandler(request: Request) {
  console.log('[v0] [Council API] Request received')

  try {
    const body = await request.json()
    const { query, agentIds } = body

    console.log('[v0] [Council API] Parsed body:', { query: query?.slice(0, 50), agentIds })

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    if (!agentIds || agentIds.length === 0) {
      return NextResponse.json({ error: 'At least one agent ID is required' }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[v0] [Council API] User:', user?.id || 'anonymous')

    const { data: agents } = await supabase.from('agents').select('*').in('id', agentIds).limit(5)

    const councilAgents = agents && agents.length > 0 ? agents : []

    if (councilAgents.length === 0) {
      console.warn('[v0] [Council API] No agents found in DB, using template sages')
      const { SAGE_TEMPLATES } = await import('@/lib/sage-templates')

      const templateSages = agentIds
        .map((id: string) => SAGE_TEMPLATES.find((s) => s.id === id))
        .filter(Boolean)
        .slice(0, 5)

      if (templateSages.length === 0) {
        return NextResponse.json(
          { error: 'No agents available for council deliberation' },
          { status: 404 },
        )
      }

      const systemPrompt = `You are facilitating a council discussion with the following experts:
${templateSages.map((a: any, i: number) => `${i + 1}. ${a.name} - ${a.role || 'Expert'}${a.domain ? ` (${a.domain})` : ''}`).join('\n')}

Provide a balanced response that synthesizes perspectives from all council members, highlighting areas of agreement and noting any differing viewpoints.`

      console.log('[v0] [Council API] Calling runChat with template sages')

      const result = await runChat({
        messages: [{ role: 'user', content: query }],
        systemPrompt,
        temperature: 0.8,
        maxTokens: 1500,
      })

      return NextResponse.json({
        response: result.content,
        agents: templateSages.map((a: any) => ({ name: a.name, role: a.role })),
        model: result.model,
      })
    }

    const systemPrompt = `You are facilitating a council discussion with the following experts:
${councilAgents.map((a, i) => `${i + 1}. ${a.name} - ${a.role || 'Expert'}${a.expertise ? ` (${a.expertise})` : ''}`).join('\n')}

Provide a balanced response that synthesizes perspectives from all council members, highlighting areas of agreement and noting any differing viewpoints.`

    console.log('[v0] [Council API] Calling runChat with DB agents')

    const result = await runChat({
      messages: [{ role: 'user', content: query }],
      systemPrompt,
      temperature: 0.8,
      maxTokens: 1500,
    })

    return NextResponse.json({
      response: result.content,
      agents: councilAgents.map((a) => ({ name: a.name, role: a.role })),
      model: result.model,
    })
  } catch (error: any) {
    console.error('[v0] [Council API] Error:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    })

    const aiGatewayKeyPresent = !!process.env.AI_GATEWAY_API_KEY

    return NextResponse.json(
      {
        error: 'COUNCIL_ERROR',
        message: error.message || 'Council deliberation failed',
        details: error.message,
        envStatus: {
          aiGatewayKeyPresent,
        },
        helpMessage: !aiGatewayKeyPresent
          ? 'AI_GATEWAY_API_KEY is not configured. Please add it in Settings → Vars section.'
          : 'The council service encountered an error. Please try again.',
      },
      { status: 500 },
    )
  }
}

export const POST = monitoredAPIRoute(councilHandler, 'council')
