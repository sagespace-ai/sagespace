import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok && response.status !== 204) {
      return NextResponse.json({ error: "Failed to resume" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Resume route error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
