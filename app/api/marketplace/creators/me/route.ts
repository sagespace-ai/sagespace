import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('marketplace_creators')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json({ creator: data || null })
  } catch (error) {
    console.error('[Marketplace API] Error fetching creator:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { displayName, bio, avatarUrl } = await request.json()

    const { data, error } = await supabase
      .from('marketplace_creators')
      .insert({
        user_id: user.id,
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
        commission_rate: 15.0
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ creator: data })
  } catch (error) {
    console.error('[Marketplace API] Error creating creator:', error)
    return NextResponse.json(
      { error: 'Failed to create creator profile' },
      { status: 500 }
    )
  }
}
