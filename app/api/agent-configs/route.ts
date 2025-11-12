import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: configs, error } = await supabase
      .from("agent_configs")
      .select("*")
      .or(`user_id.eq.${user.id},is_public.eq.true`)
      .order("created_at", { ascending: false })

    if (error) throw error

    return Response.json({ configs: configs || [] })
  } catch (error) {
    console.error("Error fetching agent configs:", error)
    return Response.json({ error: "Failed to fetch configs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: config, error } = await supabase
      .from("agent_configs")
      .insert({
        user_id: user.id,
        ...data,
        is_custom: true,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ config })
  } catch (error) {
    console.error("Error creating agent config:", error)
    return Response.json({ error: "Failed to create config" }, { status: 500 })
  }
}
