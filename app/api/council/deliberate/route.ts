import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { conductCouncilVoting } from "@/lib/council/voting"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query, agentIds, queryType, consensusThreshold } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const serviceSupabase = createServiceRoleClient()

    // Fetch agents
    const { data: agents, error: agentsError } = await serviceSupabase.from("agents").select("*").in("id", agentIds)

    if (agentsError) throw agentsError

    if (!agents || agents.length === 0) {
      return NextResponse.json({ error: "No agents found" }, { status: 404 })
    }

    console.log(`[v0] Starting council session with ${agents.length} agents`)

    // Create council session
    const { data: session, error: sessionError } = await serviceSupabase
      .from("council_sessions")
      .insert({
        user_id: user?.id || null,
        query,
        query_type: queryType || "complex",
        status: "deliberating",
        consensus_threshold: consensusThreshold || 0.66,
      })
      .select()
      .single()

    if (sessionError) throw sessionError

    // Add participants
    const participants = agents.map((agent) => ({
      session_id: session.id,
      agent_id: agent.id,
      weight: 1.0,
    }))

    await serviceSupabase.from("council_participants").insert(participants)

    // Conduct voting
    const result = await conductCouncilVoting(query, agents, consensusThreshold || 0.66)

    // Save deliberations
    const deliberationsData = result.deliberations.map((d) => ({
      session_id: session.id,
      agent_id: d.agentId,
      phase: d.phase,
      content: d.content,
      reasoning: d.reasoning,
      confidence: d.confidence,
      cited_laws: d.citedLaws,
    }))

    await serviceSupabase.from("agent_deliberations").insert(deliberationsData)

    // Save votes
    const votesData = result.votes.map((v) => ({
      session_id: session.id,
      agent_id: v.agentId,
      vote: v.vote,
      reasoning: v.reasoning,
      confidence: v.confidence,
      conditions: v.conditions ? { conditions: v.conditions } : null,
      weight: v.weight,
    }))

    await serviceSupabase.from("agent_votes").insert(votesData)

    // Save results
    await serviceSupabase.from("vote_results").insert({
      session_id: session.id,
      total_votes: result.totalVotes,
      approve_count: result.approveCount,
      reject_count: result.rejectCount,
      abstain_count: result.abstainCount,
      conditional_count: result.conditionalCount,
      weighted_approval: result.weightedApproval,
      consensus_reached: result.consensusReached,
      final_recommendation: result.finalRecommendation,
    })

    // Update session status
    await serviceSupabase
      .from("council_sessions")
      .update({
        status: result.consensusReached ? "consensus_reached" : "no_consensus",
        final_decision: result.finalRecommendation,
        completed_at: new Date().toISOString(),
      })
      .eq("id", session.id)

    console.log("[v0] Council session completed:", result.finalRecommendation)

    return NextResponse.json({
      sessionId: session.id,
      result,
    })
  } catch (error: any) {
    console.error("[v0] Council deliberation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get council session details
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 })
    }

    const serviceSupabase = createServiceRoleClient()

    // Fetch session
    const { data: session, error: sessionError } = await serviceSupabase
      .from("council_sessions")
      .select("*")
      .eq("id", sessionId)
      .single()

    if (sessionError) throw sessionError

    // Fetch participants with agent details
    const { data: participants } = await serviceSupabase
      .from("council_participants")
      .select("*, agents(*)")
      .eq("session_id", sessionId)

    // Fetch deliberations
    const { data: deliberations } = await serviceSupabase
      .from("agent_deliberations")
      .select("*, agents(name, role)")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    // Fetch votes
    const { data: votes } = await serviceSupabase
      .from("agent_votes")
      .select("*, agents(name, role)")
      .eq("session_id", sessionId)

    // Fetch results
    const { data: results } = await serviceSupabase
      .from("vote_results")
      .select("*")
      .eq("session_id", sessionId)
      .single()

    return NextResponse.json({
      session,
      participants,
      deliberations,
      votes,
      results,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching council session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
