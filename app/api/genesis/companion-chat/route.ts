import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()
    const userMessage = messages[messages.length - 1]?.content || ''

    let response = ''

    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm Origin Sage, your companion through SageSpace. I'm here to help you discover your path and unlock the wisdom of the sage universe. What would you like to explore today?"
    } else if (lowerMessage.includes('quest') || lowerMessage.includes('mission')) {
      response = "Great question about quests! You have several active quests in your Genesis Chamber. Complete them to earn XP and unlock new features. Try starting a conversation in the Playground to progress on your 'First Conversation' quest!"
    } else if (lowerMessage.includes('sage') || lowerMessage.includes('unlock')) {
      response = "Currently, you have access to Origin Sage (that's me!) as part of your Free plan. To unlock the full universe of 300+ specialized sages, you can upgrade to Pro in the Subscriptions page. Each sage brings unique expertise to help you grow!"
    } else if (lowerMessage.includes('xp') || lowerMessage.includes('level')) {
      response = "XP (Experience Points) help you level up and unlock new abilities in SageSpace. You earn XP by completing quests, having conversations, and maintaining daily streaks. Your current level determines which features and sages you can access!"
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      response = "I'd be happy to help! Here's what you can do:\n\n• Visit the Playground to chat with sages\n• Check your quests in the Genesis Chamber\n• Explore the Sage Universe map\n• Upgrade to Pro for more sages\n\nWhat would you like to try first?"
    } else {
      response = `That's an interesting question! While I'm running in a simplified mode right now, I can help you navigate SageSpace. Try visiting the Playground to chat with specialized sages, or check out your active quests to earn XP. What would you like to explore?`
    }

    // Just return the response directly

    return NextResponse.json({ response })
  } catch (error) {
    console.error('[v0] Error in companion chat:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
