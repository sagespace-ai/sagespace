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

    const { data: memories, error } = await supabase
      .from("agent_memories")
      .select("*")
      .eq("agent_id", agentId)
      .order("importance", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ memories: memories || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching memories:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
