import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch conversation count
    const { count: totalConversations } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Fetch user progress for XP and streak
    const { data: progress } = await supabase
      .from("user_progress")
      .select("xp, longest_streak")
      .eq("user_id", user.id)
      .single()

    // Fetch unique sages interacted with
    const { data: sageCount } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_id", user.id)
      .not("id", "is", null)

    // Count unique agents from messages
    const { data: uniqueAgents } = await supabase.rpc("count_unique_agents", {
      user_id_param: user.id,
    })

    const stats = {
      totalConversations: totalConversations || 0,
      totalXP: progress?.xp || 0,
      longestStreak: progress?.longest_streak || 0,
      totalSagesInteracted: uniqueAgents || 0,
      favoriteTime: "Morning", // TODO: Calculate from actual data
      mostActiveDay: "Tuesday", // TODO: Calculate from actual data
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("[v0] Error fetching memory stats:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
