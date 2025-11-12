import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const client = user ? supabase : createServiceRoleClient()
    console.log(`[v0] Fetching conversation ${id} ${user ? "with user auth" : "anonymously with service role"}`)

    const { data: conversation, error } = await client
      .from("conversations")
      .select(`
        *,
        conversation_participants (
          agents (*)
        ),
        messages (*)
      `)
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const serialized = {
      id: conversation.id,
      title: conversation.title,
      description: conversation.description,
      participants: conversation.conversation_participants.map((p: any) => ({
        ...p.agents,
        createdAt: p.agents.created_at,
        harmonyScore: p.agents.harmony_score,
        ethicsAlignment: p.agents.ethics_alignment,
      })),
      messages: conversation.messages.map((m: any) => ({
        ...m,
        timestamp: m.created_at,
        agentId: m.agent_id,
        conversationId: m.conversation_id,
      })),
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      archived: conversation.archived,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
  }
}
