import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('[v0] User not authenticated, cannot check Spotify status')
      return NextResponse.json({ 
        connected: false,
        requiresAuth: true,
        message: 'Please sign in to connect Spotify'
      })
    }
    
    const userId = user.id
    console.log('[v0] Checking Spotify status for user:', userId)
    
    // Check if Spotify is connected
    const { data: integration, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_type', 'spotify')
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.message.includes('user_integrations') || error.code === 'PGRST205') {
        console.log('[v0] user_integrations table not found - migration needed')
        return NextResponse.json({ 
          connected: false, 
          needsMigration: true,
          message: 'Database migration required. Run script 004-add-spotify-integration-table.sql'
        })
      }
      console.log('[v0] Spotify check error:', error)
      return NextResponse.json({ connected: false })
    }
    
    if (!integration) {
      console.log('[v0] No Spotify integration found')
      return NextResponse.json({ connected: false })
    }
    
    // Check if token is expired
    const isExpired = integration.token_expires_at 
      ? new Date(integration.token_expires_at) < new Date()
      : true
    
    console.log('[v0] Spotify connected:', {
      user: integration.integration_metadata?.display_name,
      expired: isExpired
    })
    
    return NextResponse.json({
      connected: true,
      isExpired,
      metadata: integration.integration_metadata,
      connectedAt: integration.connected_at,
    })
  } catch (error) {
    console.error('[v0] Spotify status check error:', error)
    return NextResponse.json({ connected: false, error: 'Failed to check status' })
  }
}
