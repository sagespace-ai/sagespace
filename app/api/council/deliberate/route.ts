import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateCouncilResponse } from "@/lib/ai-client"

export async function POST(request: Request) {
  try {
    const { query, agentIds } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const supabase = await createClient()

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

    console.log("[Council API] Starting deliberation with", councilAgents.length, "agents")

    const result = await generateCouncilResponse({
      messages: [{ role: "user", content: query }],
      agents: councilAgents.map((a) => ({
        name: a.name,
        role: a.role || "Expert",
        expertise: a.expertise,
      })),
    })

    // Return streaming response
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
