import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value

    if (!accessToken) {
      return NextResponse.json({ connected: false, message: "No access token" }, { status: 401 })
    }

    // Try to fetch user info
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 401 && refreshToken) {
      // Token expired, try to refresh
      const newTokens = await refreshSpotifyToken(refreshToken)
      if (newTokens) {
        // Retry with new token
        const retryResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${newTokens.access_token}`,
          },
        })

        if (retryResponse.ok) {
          const userData = await retryResponse.json()
          return NextResponse.json({
            connected: true,
            displayName: userData.display_name,
            email: userData.email,
            id: userData.id,
          })
        }
      }

      return NextResponse.json({ connected: false, message: "Token refresh failed" }, { status: 401 })
    }

    if (!response.ok) {
      return NextResponse.json({ connected: false, message: "Spotify API error" }, { status: response.status })
    }

    const userData = await response.json()
    return NextResponse.json({
      connected: true,
      displayName: userData.display_name,
      email: userData.email,
      id: userData.id,
    })
  } catch (error: any) {
    console.error("[v0] Spotify /me error:", error)
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 })
  }
}

async function refreshSpotifyToken(refreshToken: string) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (response.ok) {
      const data = await response.json()

      // Update cookies
      const cookieStore = await cookies()
      cookieStore.set("spotify_access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
      })

      if (data.refresh_token) {
        cookieStore.set("spotify_refresh_token", data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
      }

      return data
    }

    return null
  } catch (error) {
    console.error("[v0] Token refresh error:", error)
    return null
  }
}
