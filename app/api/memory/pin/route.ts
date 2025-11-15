import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { memoryId, pinned } = await request.json()

    if (!memoryId) {
      return NextResponse.json({ error: "Memory ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("timeline_events")
      .update({
        metadata: {
          pinned,
        },
      })
      .eq("id", memoryId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error pinning memory:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, memory: data })
  } catch (error: any) {
    console.error("[v0] Error in pin API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
