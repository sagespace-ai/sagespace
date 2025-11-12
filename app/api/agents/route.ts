import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("[v0] Error fetching agents:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("agents")
      .insert([
        {
          name: body.name,
          role: body.role,
          avatar: body.avatar || "🤖",
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error creating agent:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
