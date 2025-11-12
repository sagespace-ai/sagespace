import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Fetching settings anonymously with service role
      console.log("[v0] Fetching settings anonymously with service role")
      const serviceSupabase = createServiceRoleClient()
      const { data: settings, error } = await serviceSupabase.from("settings").select("*").is("user_id", null)

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json([
          {
            id: "1",
            key: "dataRetention",
            value: 90,
            category: "privacy",
            description: "How long to retain conversation data (in days)",
            type: "number",
          },
          {
            id: "2",
            key: "autoApprove",
            value: false,
            category: "behavior",
            description: "Automatically approve agent actions",
            type: "boolean",
          },
          {
            id: "3",
            key: "notifyOnAgentAction",
            value: true,
            category: "notifications",
            description: "Receive notifications for agent actions",
            type: "boolean",
          },
        ])
      }

      return NextResponse.json(settings || [])
    }

    const { data: settings, error } = await supabase.from("settings").select("*").eq("user_id", user.id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(settings || [])
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data: setting, error } = await supabase
      .from("settings")
      .upsert({
        user_id: user.id,
        key: body.key,
        value: body.value,
        category: body.category,
        description: body.description,
        type: body.type,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}
