import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let events, error

    if (!user) {
      console.log("[v0] Fetching timeline anonymously with service role")
      const serviceSupabase = createServiceRoleClient()
      let query = serviceSupabase
        .from("timeline_events")
        .select("*")
        .is("user_id", null)
        .order("created_at", { ascending: false })

      if (conversationId) {
        query = query.eq("conversation_id", conversationId)
      }

      const result = await query
      events = result.data
      error = result.error
    } else {
      let query = supabase.from("timeline_events").select("*").order("created_at", { ascending: false })

      if (conversationId) {
        query = query.eq("conversation_id", conversationId)
      }

      const result = await query
      events = result.data
      error = result.error
    }

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const serialized = events.map((event) => ({
      ...event,
      timestamp: event.created_at,
      conversationId: event.conversation_id,
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching timeline:", error)
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 })
  }
}
