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

    const { data: evolution, error } = await supabase
      .from("agent_evolution")
      .select("*")
      .eq("agent_id", agentId)
      .order("version", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ evolution: evolution || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching evolution:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
