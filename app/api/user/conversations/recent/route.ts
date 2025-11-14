import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch recent conversations with message counts
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        created_at,
        messages (count)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[API] Error fetching conversations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response
    const formattedConversations = conversations?.map((conv: any) => ({
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      message_count: conv.messages?.[0]?.count || 0,
    })) || []

    return NextResponse.json({
      conversations: formattedConversations,
    })
  } catch (error: any) {
    console.error('[API] Error in recent conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
