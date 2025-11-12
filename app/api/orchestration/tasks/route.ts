import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const client = user ? supabase : createServiceRoleClient()

    const { data: tasks, error } = await client.from("tasks").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        return NextResponse.json({ error: "Table not found", setup_required: true }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(tasks || [])
  } catch (error) {
    console.error("[v0] Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { intent, purpose, priority, requiresHumanApproval } = body

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const client = user ? supabase : createServiceRoleClient()

    const { data: task, error } = await client
      .from("tasks")
      .insert({
        user_id: user?.id || null,
        intent: intent || "User requested task",
        purpose: purpose || {},
        priority: priority || "medium",
        status: "pending",
        requires_pre_approval: requiresHumanApproval || false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating task:", error)
      throw error
    }

    // Log audit event
    await client.from("audit_events").insert({
      task_id: task.id,
      timestamp: new Date().toISOString(),
      actor: user?.email || "anonymous",
      action: "task_created",
      after: task,
      metadata: { taskId: task.id, priority },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[v0] Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
