import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceRoleClient()

    const { data: task, error: taskError } = await supabase.from("tasks").select("*").eq("id", params.id).single()

    if (taskError) throw taskError

    let plan = null
    try {
      const planQuery = supabase
        .from("plans")
        .select("*")
        .eq("task_id", params.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      const { data: planData, error: planError } = await planQuery

      if (!planError && planData) {
        plan = planData
      }
    } catch (err: any) {
      // Gracefully handle missing plans table
      console.log("[v0] Plans table not available:", err.message)
      plan = null
    }

    let auditEvents: any[] = []
    try {
      const auditQuery = supabase
        .from("audit_events")
        .select("*")
        .eq("task_id", params.id)
        .order("timestamp", { ascending: false })

      const { data: auditData, error: auditError } = await auditQuery

      if (!auditError && auditData) {
        auditEvents = auditData
      }
    } catch (err: any) {
      // Gracefully handle missing audit_events table
      console.log("[v0] Audit events table not available:", err.message)
      auditEvents = []
    }

    return NextResponse.json({
      ...task,
      plan,
      auditEvents,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceRoleClient()
    const body = await request.json()

    const { data, error } = await supabase.from("tasks").update(body).eq("id", params.id).select().single()

    if (error) throw error

    try {
      await supabase.from("audit_events").insert({
        task_id: params.id,
        actor: "system",
        action: "task_updated",
        after: body,
      })
    } catch (err) {
      console.log("[v0] Could not log audit event:", err)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
