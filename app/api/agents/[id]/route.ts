import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let agent, error

    if (!user) {
      const serviceSupabase = createServiceRoleClient()
      const result = await serviceSupabase.from("agents").select("*").eq("id", params.id).single()
      agent = result.data
      error = result.error
    } else {
      const result = await supabase.from("agents").select("*").eq("id", params.id).single()
      agent = result.data
      error = result.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error("[v0] Error fetching agent:", error)
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()

    let data, error

    if (!user) {
      const serviceSupabase = createServiceRoleClient()
      const result = await serviceSupabase
        .from("agents")
        .update({
          name: body.name,
          description: body.description,
          role: body.role,
          purpose: body.purpose,
          status: body.status,
          harmony_score: body.harmonyScore,
          ethics_alignment: body.ethicsAlignment,
        })
        .eq("id", params.id)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      const result = await supabase
        .from("agents")
        .update({
          name: body.name,
          description: body.description,
          role: body.role,
          purpose: body.purpose,
          status: body.status,
          harmony_score: body.harmonyScore,
          ethics_alignment: body.ethicsAlignment,
        })
        .eq("id", params.id)
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let error

    if (!user) {
      const serviceSupabase = createServiceRoleClient()
      const result = await serviceSupabase.from("agents").delete().eq("id", params.id)
      error = result.error
    } else {
      const result = await supabase.from("agents").delete().eq("id", params.id)
      error = result.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
