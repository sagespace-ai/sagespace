import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const agentRole = searchParams.get("agentRole")
    const includeArchived = searchParams.get("includeArchived") === "true"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (agentRole) {
      query = query.eq("agent_role", agentRole)
    }

    if (!includeArchived) {
      query = query.eq("archived", false)
    }

    const { data: conversations, error } = await query

    if (error) throw error

    return Response.json({ conversations: conversations || [] })
  } catch (error) {
    console.error("Error fetching multiverse conversations:", error)
    return Response.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, agentRole, agentAvatar, description } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
        agent_role: agentRole,
        agent_avatar: agentAvatar,
        description,
        message_count: 0,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ conversation })
  } catch (error) {
    console.error("Error creating multiverse conversation:", error)
    return Response.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
