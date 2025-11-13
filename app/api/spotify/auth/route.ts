import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] Spotify auth route called")
  
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/callback`

  console.log("[v0] Spotify config:", {
    hasClientId: !!clientId,
    redirectUri
  })

  if (!clientId) {
    console.log("[v0] ERROR: Spotify client ID not configured")
    return NextResponse.json({ error: "Spotify client ID not configured" }, { status: 500 })
  }

  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-email",
    "user-read-private",
  ].join(" ")

  const authUrl = new URL("https://accounts.spotify.com/authorize")
  authUrl.searchParams.append("client_id", clientId)
  authUrl.searchParams.append("response_type", "code")
  authUrl.searchParams.append("redirect_uri", redirectUri)
  authUrl.searchParams.append("scope", scopes)
  authUrl.searchParams.append("show_dialog", "false")

  const finalUrl = authUrl.toString()
  console.log("[v0] Redirecting to Spotify:", finalUrl.substring(0, 100) + "...")

  return NextResponse.redirect(finalUrl)
}
