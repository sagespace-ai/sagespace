import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'anonymous'
    
    // Mark integration as inactive
    await supabase
      .from('user_integrations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('integration_type', 'spotify')
    
    // Clear cookies
    const cookieStore = await cookies()
    cookieStore.delete('spotify_access_token')
    cookieStore.delete('spotify_refresh_token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Spotify disconnect error:', error)
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}
