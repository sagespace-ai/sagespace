import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()
    const body = await request.json()
    const { id } = params

    const { data: policy, error } = await clientToUse
      .from("policies")
      .update({
        name: body.name,
        version: body.version,
        rules: body.rules,
        effective_from: body.effective_from,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating policy:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(policy)
  } catch (error) {
    console.error("[v0] Error in policy PUT:", error)
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()
    const { id } = params

    const { error } = await clientToUse.from("policies").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting policy:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in policy DELETE:", error)
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 })
  }
}
