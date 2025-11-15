import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get("mood")
    const sageId = searchParams.get("sageId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch memories from timeline_events table
    let query = supabase
      .from("timeline_events")
      .select(
        `
        *,
        conversation:conversations(
          title,
          messages(
            content,
            role,
            agent_id
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (mood) {
      query = query.contains("metadata", { mood })
    }

    if (sageId) {
      query = query.eq("metadata->>sageId", sageId)
    }

    const { data: memories, error } = await query

    if (error) {
      console.error("[v0] Error fetching memories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ memories, page, hasMore: memories.length === limit })
  } catch (error: any) {
    console.error("[v0] Error in memory API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, conversationId, metadata } = body

    if (!title || !conversationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create timeline event for the memory
    const { data: memory, error } = await supabase
      .from("timeline_events")
      .insert({
        user_id: user.id,
        conversation_id: conversationId,
        type: "memory",
        title,
        description,
        metadata: {
          ...metadata,
          pinned: false,
          xpEarned: metadata?.xpEarned || 0,
          mood: metadata?.mood || "meaningful",
        },
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving memory:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ memory, success: true })
  } catch (error: any) {
    console.error("[v0] Error in memory POST:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
