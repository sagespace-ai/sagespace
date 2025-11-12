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

    const { data: events, error } = await client
      .from("audit_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50)

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        return NextResponse.json({ error: "Table not found", setup_required: true }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(events || [])
  } catch (error) {
    console.error("[v0] Error fetching audit events:", error)
    return NextResponse.json({ error: "Failed to fetch audit events" }, { status: 500 })
  }
}
