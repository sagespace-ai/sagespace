import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { uri } = await request.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [uri],
      }),
    })

    if (response.status === 404) {
      return NextResponse.json({ error: "No active device found. Please open Spotify on any device." }, { status: 404 })
    }

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Spotify play error:", error)
      return NextResponse.json({ error: "Failed to play track" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Play route error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
