import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceRoleClient()
    const { agentIds } = await request.json()

    // Update task metadata with assigned agents
    const { data: task, error } = await supabase
      .from("tasks")
      .update({
        purpose: {
          ...((await supabase.from("tasks").select("purpose").eq("id", params.id).single()).data?.purpose || {}),
          assignedAgents: agentIds,
        },
        status: "executing",
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    // Log audit event
    await supabase.from("audit_events").insert({
      task_id: params.id,
      actor: "human",
      action: "agents_assigned",
      after: { agentIds },
    })

    return NextResponse.json(task)
  } catch (error: any) {
    console.error("[v0] Error assigning agents:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
