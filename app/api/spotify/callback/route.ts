import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL(`/?spotify_error=${error || "unknown"}`, request.url))
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/callback`

    if (!clientId || !clientSecret) {
      throw new Error("Spotify credentials not configured")
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("[v0] Token exchange error:", errorData)
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    const supabase = await createServerClient()
    
    // Get current user (or use anon session)
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'anonymous'
    
    // Calculate token expiration time
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    
    // Get user's Spotify profile for metadata
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const profile = profileResponse.ok ? await profileResponse.json() : {}
    
    // Upsert integration record
    const { error: dbError } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: userId,
        integration_type: 'spotify',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt,
        integration_metadata: {
          spotify_user_id: profile.id,
          display_name: profile.display_name,
          email: profile.email,
          product: profile.product, // premium/free
        },
        connected_at: new Date().toISOString(),
        last_refreshed_at: new Date().toISOString(),
        is_active: true,
      }, {
        onConflict: 'user_id,integration_type'
      })
    
    if (dbError) {
      console.error('[v0] Database error storing Spotify tokens:', dbError)
    }
    // </CHANGE>

    // Also set cookies for immediate use
    const cookieStore = await cookies()
    cookieStore.set("spotify_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    cookieStore.set("spotify_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    // Redirect back to settings page
    return NextResponse.redirect(new URL('/settings?tab=integrations&spotify=connected', request.url))
  } catch (error: any) {
    console.error("[v0] Spotify callback error:", error)
    return NextResponse.redirect(new URL(`/settings?tab=integrations&spotify_error=${encodeURIComponent(error.message)}`, request.url))
  }
}
