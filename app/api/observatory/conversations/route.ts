import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const conversationId = url.searchParams.get("id")

    const supabase = createServiceRoleClient()

    if (conversationId) {
      // Fetch specific conversation details
      const { data: conversation, error: convError } = await supabase
        .from("agent_conversations")
        .select("*")
        .eq("id", conversationId)
        .single()

      if (convError) throw convError

      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from("agent_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (messagesError) throw messagesError

      // Fetch interactions
      const { data: interactions, error: interactionsError } = await supabase
        .from("agent_interactions")
        .select("*")
        .eq("conversation_id", conversationId)

      if (interactionsError) throw interactionsError

      return NextResponse.json({
        conversation,
        messages: messages || [],
        interactions: interactions || [],
      })
    } else {
      // Fetch all conversations
      const { data: conversations, error: convsError } = await supabase
        .from("agent_conversations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (convsError) throw convsError

      return NextResponse.json({
        conversations: conversations || [],
      })
    }
  } catch (error: any) {
    console.error("[v0] Observatory error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Intervene in a conversation
export async function POST(request: Request) {
  try {
    const { conversationId, action, message } = await request.json()

    const supabase = createServiceRoleClient()

    if (action === "pause") {
      await supabase.from("agent_conversations").update({ status: "paused" }).eq("id", conversationId)

      return NextResponse.json({ success: true, message: "Conversation paused" })
    }

    if (action === "resume") {
      await supabase.from("agent_conversations").update({ status: "active" }).eq("id", conversationId)

      return NextResponse.json({ success: true, message: "Conversation resumed" })
    }

    if (action === "stop") {
      await supabase.from("agent_conversations").update({ status: "completed" }).eq("id", conversationId)

      return NextResponse.json({ success: true, message: "Conversation stopped" })
    }

    if (action === "inject_message" && message) {
      // Allow human to inject a message into the conversation
      await supabase.from("agent_messages").insert({
        conversation_id: conversationId,
        from_agent_id: "00000000-0000-0000-0000-000000000000", // Special ID for human
        to_agent_id: null,
        message_type: "broadcast",
        content: `[HUMAN INTERVENTION] ${message}`,
        requires_response: true,
      })

      return NextResponse.json({ success: true, message: "Message injected" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Observatory intervention error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
