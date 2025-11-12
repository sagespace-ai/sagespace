import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let agents, error

    if (!user) {
      console.log("[v0] Fetching agents anonymously with service role")
      const serviceSupabase = createServiceRoleClient()
      const result = await serviceSupabase
        .from("agents")
        .select("*")
        .is("user_id", null) // Only fetch demo agents
        .order("created_at", { ascending: false })

      agents = result.data
      error = result.error
    } else {
      console.log("[v0] Fetching agents for authenticated user:", user.id)
      const result = await supabase.from("agents").select("*").order("created_at", { ascending: false })

      agents = result.data
      error = result.error
    }

    if (error) {
      console.error("[v0] Supabase GET error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const serializedAgents = agents.map((agent) => ({
      ...agent,
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
      harmonyScore: agent.harmony_score,
      ethicsAlignment: agent.ethics_alignment,
    }))

    return NextResponse.json(serializedAgents)
  } catch (error) {
    console.error("[v0] Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()

    let data, error

    if (!user) {
      // Anonymous user - use service role to bypass RLS for demo
      console.log("[v0] Creating agent anonymously with service role")
      const serviceSupabase = createServiceRoleClient()

      const result = await serviceSupabase
        .from("agents")
        .insert({
          user_id: null,
          name: body.name,
          description: body.description,
          role: body.role,
          purpose: body.purpose || null,
          status: body.status || "idle",
          harmony_score: body.harmonyScore || 50,
          ethics_alignment: body.ethicsAlignment || 50,
        })
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      console.log("[v0] Creating agent for authenticated user:", user.id)
      const result = await supabase
        .from("agents")
        .insert({
          user_id: user.id,
          name: body.name,
          description: body.description,
          role: body.role,
          purpose: body.purpose || null,
          status: body.status || "idle",
          harmony_score: body.harmonyScore || 50,
          ethics_alignment: body.ethicsAlignment || 50,
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error("[v0] Supabase POST error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Agent created successfully:", data.id)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
