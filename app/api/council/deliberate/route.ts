import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateCouncilResponse } from "@/lib/ai-client"
import { createCouncilGraph } from "@/lib/ai/orchestration/council-graph"
import { monitoredAPIRoute } from "@/lib/self-healing/middleware"
import type { AccessLevel } from "@/lib/ai/model-registry"

async function councilHandler(request: Request) {
  try {
    const { query, agentIds, useOrchestration } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    let userAccessLevel: AccessLevel = 'free'
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()
      
      // Map subscription tier to access level
      userAccessLevel = (profile?.subscription_tier || 'free') as AccessLevel
    }

    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .in("id", agentIds || [])
      .limit(5)

    if (error) throw error

    const councilAgents = agents || []

    if (councilAgents.length === 0) {
      return NextResponse.json({ error: "No agents available for council deliberation" }, { status: 404 })
    }

    console.log("[Council API] Starting deliberation with", councilAgents.length, "agents", "- Access level:", userAccessLevel)

    if (useOrchestration) {      
      if (user) {
        const graph = createCouncilGraph(
          councilAgents.map(a => a.id),
          user.id
        )

        const result = await graph.execute({
          messages: [{ role: 'user', content: query }],
          context: {
            agentIds,
            userId: user.id,
          },
        })

        const lastMessage = result.messages[result.messages.length - 1]
        
        return NextResponse.json({
          message: lastMessage,
          perspectives: result.context.perspectives,
          synthesis: result.context.synthesis,
          metadata: {
            errors: result.errors,
            steps: result.metadata,
          },
        })
      }
    }

    const result = await generateCouncilResponse({
      messages: [{ role: "user", content: query }],
      agents: councilAgents.map((a) => ({
        name: a.name,
        role: a.role || "Expert",
        expertise: a.expertise,
      })),
      userAccessLevel, // Charter compliance: enables cost-aware routing
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[Council API] Deliberation error:", {
      error: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      {
        error: "COUNCIL_ERROR",
        message: error.message,
        details: "The council deliberation encountered an error.",
      },
      { status: 500 },
    )
  }
}

export const POST = monitoredAPIRoute(councilHandler, 'council')
