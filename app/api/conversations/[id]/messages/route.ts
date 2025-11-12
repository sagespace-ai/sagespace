import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", params.id)
      .order("created_at", { ascending: true })

    if (error) throw error

    return Response.json({ messages: messages || [] })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { role, content, agentId, model } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: params.id,
        agent_id: agentId,
        role,
        content,
        model,
      })
      .select()
      .single()

    if (error) throw error

    await supabase
      .from("conversations")
      .update({
        message_count: supabase.rpc("increment_message_count", { conversation_id: params.id }),
        last_message_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    return Response.json({ message })
  } catch (error) {
    console.error("Error creating message:", error)
    return Response.json({ error: "Failed to create message" }, { status: 500 })
  }
}
