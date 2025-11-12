import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating sage:", body)

    if (!body.name || !body.role) {
      return Response.json({ error: "Missing required fields: name and role are required" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id || "anonymous"

    const { data, error } = await supabase
      .from("agents")
      .insert([
        {
          user_id: userId,
          name: body.name,
          role: body.role,
          tone: body.tone || "professional",
          modality: body.modality || "analytical",
          capabilities: body.capabilities || [],
          llm_model: body.llm_model || "gpt-4",
          purpose: body.purpose || "",
          intent: body.intent || "",
          harmony_threshold: body.harmony_threshold ?? 0.7,
          ethics_alignment: body.ethics_alignment ?? 0.8,
          status: "idle",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating sage:", error)
      return Response.json({ error: error.message || "Failed to create sage" }, { status: 500 })
    }

    console.log("[v0] Sage created successfully:", data)
    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error creating sage:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}
