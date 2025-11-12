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

    const { data: approvals, error } = await client
      .from("approvals")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Approvals fetch error:", error)
      if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
        return NextResponse.json({ setup_required: true }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(approvals || [])
  } catch (error: any) {
    console.error("[v0] Error fetching approvals:", error)
    if (error?.code === "PGRST205" || error?.message?.includes("Could not find the table")) {
      return NextResponse.json({ setup_required: true }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 })
  }
}
