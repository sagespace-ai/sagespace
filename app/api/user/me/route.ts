import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    console.log('[v0] Fetching profile for user:', user.id)
    
    let profile = null
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()
    
    if (profileError) {
      console.error('[v0] Error fetching profile:', profileError)
    } else if (!existingProfile) {
      console.log('[v0] Profile not found, attempting to create...')
      const serviceSupabase = createServiceRoleClient()
      const { data: newProfile, error: createError } = await serviceSupabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single()
      
      if (createError) {
        console.error('[v0] Error creating profile:', createError.message, createError.code)
        return NextResponse.json({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || null,
          image: user.user_metadata?.avatar_url || null,
          profileCreationFailed: true,
        })
      } else {
        console.log('[v0] Profile created successfully')
        profile = newProfile
      }
    } else {
      console.log('[v0] Profile found')
      profile = existingProfile
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: profile?.full_name || user.user_metadata?.full_name || null,
      image: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    })
  } catch (error) {
    console.error('[v0] Error in /api/user/me:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
