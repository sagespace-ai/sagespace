import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
    
    // Convert settings array to object
    const settingsObj: Record<string, any> = {}
    settings?.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })
    
    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error('[API] Error in GET /api/user/settings:', error)
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
    
    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          key,
          value,
          category: 'user',
          type: typeof value,
        })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error in POST /api/user/settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
