import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json(
        {
          isPlaying: false,
        },
        { status: 200 },
      )
    }

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 204 || !response.ok) {
      return NextResponse.json({ isPlaying: false })
    }

    const data = await response.json()

    if (!data.item) {
      return NextResponse.json({ isPlaying: false })
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      uri: data.item.uri,
      title: data.item.name,
      artist: data.item.artists?.map((a: any) => a.name).join(", ") || "Unknown",
      album: data.item.album?.name,
      imageUrl: data.item.album?.images?.[0]?.url,
      position: data.progress_ms,
      duration: data.item.duration_ms,
      type: data.item.type,
    })
  } catch (error: any) {
    console.error("[v0] Current route error:", error)
    return NextResponse.json({ isPlaying: false, error: error.message }, { status: 500 })
  }
}
