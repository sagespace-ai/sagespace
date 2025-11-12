import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()

    const { data: policies, error } = await clientToUse
      .from("policies")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching policies:", error.message)
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        return NextResponse.json({ policies: [], setup_required: true })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ policies: policies || [] })
  } catch (error: any) {
    console.error("[v0] Error in policies GET:", error)
    return NextResponse.json({ policies: [], setup_required: true })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()
    const body = await request.json()

    const { data: policy, error } = await clientToUse
      .from("policies")
      .insert({
        name: body.name,
        version: body.version,
        rules: body.rules,
        effective_from: body.effective_from || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating policy:", error.message)
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        return NextResponse.json(
          { error: "Policies table not set up. Please run scripts/005-add-policies-table.sql" },
          { status: 404 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(policy)
  } catch (error: any) {
    console.error("[v0] Error in policies POST:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}
