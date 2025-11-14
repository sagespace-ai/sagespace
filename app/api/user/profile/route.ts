import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    
    if (!profile) {
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
        console.error('[API] Error creating profile:', createError)
        return NextResponse.json({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
      }
      
      return NextResponse.json({
        id: user.id,
        email: user.email,
        full_name: newProfile?.full_name || null,
        avatar_url: newProfile?.avatar_url || null,
      })
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: profile.full_name || null,
      avatar_url: profile.avatar_url || null,
    })
  } catch (error) {
    console.error('[API] Error in GET /api/user/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const body = await request.json()
    const { full_name, avatar_url } = body
    
    const serviceSupabase = createServiceRoleClient()
    const { error: upsertError } = await serviceSupabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
    
    if (upsertError) {
      console.error('[API] Error upserting profile:', upsertError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error in POST /api/user/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
