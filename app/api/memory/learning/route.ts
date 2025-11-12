import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const agentId = url.searchParams.get("agentId")

    if (!agentId) {
      return NextResponse.json({ error: "agentId required" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data: learningEvents, error } = await supabase
      .from("agent_learning_events")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ learningEvents: learningEvents || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching learning events:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
