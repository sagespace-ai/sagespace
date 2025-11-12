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

    const { data: metrics, error } = await clientToUse
      .from("settings")
      .select("*")
      .eq("category", "ethics")
      .order("key", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching ethics metrics:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(metrics || [])
  } catch (error) {
    console.error("[v0] Error in ethics GET:", error)
    return NextResponse.json({ error: "Failed to fetch ethics metrics" }, { status: 500 })
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

    const ethicsKey = body.key.startsWith("ethics_") ? body.key : `ethics_${body.key}`

    const { data: metric, error } = await clientToUse
      .from("settings")
      .insert({
        user_id: null,
        category: "ethics",
        key: ethicsKey,
        value: body.value,
        description: body.description,
        type: body.type || "object",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating ethics metric:", error)
      return NextResponse.json({ error: error.message || "Failed to create ethics metric" }, { status: 500 })
    }

    return NextResponse.json(metric)
  } catch (error: any) {
    console.error("[v0] Error in ethics POST:", error)
    return NextResponse.json({ error: error.message || "Failed to create ethics metric" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()
    const body = await request.json()

    const { data: metric, error } = await clientToUse
      .from("settings")
      .update({
        value: body.value,
        description: body.description,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating ethics metric:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(metric)
  } catch (error) {
    console.error("[v0] Error in ethics PUT:", error)
    return NextResponse.json({ error: "Failed to update ethics metric" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const clientToUse = user ? supabase : createServiceRoleClient()

    const { error } = await clientToUse.from("settings").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting ethics metric:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Ethics delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
