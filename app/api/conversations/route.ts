import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let conversations, error

    if (!user) {
      console.log("[v0] Fetching conversations anonymously with service role")
      const serviceSupabase = createServiceRoleClient()
      const result = await serviceSupabase
        .from("conversations")
        .select(`
          *,
          conversation_participants (
            agents (*)
          ),
          messages (*)
        `)
        .is("user_id", null)
        .order("created_at", { ascending: false })

      conversations = result.data
      error = result.error
    } else {
      const result = await supabase
        .from("conversations")
        .select(`
          *,
          conversation_participants (
            agents (*)
          ),
          messages (*)
        `)
        .order("created_at", { ascending: false })

      conversations = result.data
      error = result.error
    }

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const serializedConversations = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      description: conv.description,
      participants: conv.conversation_participants.map((p: any) => ({
        ...p.agents,
        createdAt: p.agents.created_at,
        harmonyScore: p.agents.harmony_score,
        ethicsAlignment: p.agents.ethics_alignment,
      })),
      messages: conv.messages.map((m: any) => ({
        ...m,
        timestamp: m.created_at,
        agentId: m.agent_id,
        conversationId: m.conversation_id,
      })),
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
      archived: conv.archived,
    }))

    return NextResponse.json(serializedConversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user?.id || null,
        title: body.title,
        description: body.description || null,
        archived: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add participants if provided
    if (body.participantIds && body.participantIds.length > 0) {
      const participants = body.participantIds.map((agentId: string) => ({
        conversation_id: conversation.id,
        agent_id: agentId,
      }))

      await supabase.from("conversation_participants").insert(participants)
    }

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
