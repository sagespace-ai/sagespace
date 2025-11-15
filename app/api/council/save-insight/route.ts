import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { question, insight, sages, sessionId } = await request.json()

    if (!question || !insight) {
      return NextResponse.json({ error: "Question and insight required" }, { status: 400 })
    }

    // Create timeline event for the council insight
    const { data: memory, error } = await supabase
      .from("timeline_events")
      .insert({
        user_id: user.id,
        type: "council_insight",
        title: `Council Wisdom: ${question.slice(0, 60)}${question.length > 60 ? "..." : ""}`,
        description: insight,
        metadata: {
          question,
          sages: sages.map((s: any) => ({
            id: s.id,
            name: s.name,
            avatar: s.avatar,
          })),
          sessionId,
          xpEarned: 200, // Council insights are valuable
          mood: "wisdom",
          pinned: true, // Auto-pin council insights
        },
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving council insight:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Award XP to user
    await supabase.rpc("increment_user_xp", {
      user_id_param: user.id,
      xp_amount: 200,
    })

    return NextResponse.json({ success: true, memory })
  } catch (error: any) {
    console.error("[v0] Error saving council insight:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
