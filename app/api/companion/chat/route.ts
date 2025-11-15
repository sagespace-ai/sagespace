import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { runChat } from '@/lib/ai/chatClient'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, passportContext } = body

    const systemPrompt = `You are the Origin Sage, the default companion guide for SageSpace Passport. You help users:
- Configure their profile and preferences
- Discover features and navigate the platform
- Suggest quests and next steps
- Provide personalized recommendations

Current User Context:
- Level: ${passportContext?.level || 1}
- XP: ${passportContext?.xp || 0}
- Streak: ${passportContext?.streakDays || 0} days
- Focus Areas: ${passportContext?.focusAreas?.join(', ') || 'Not set'}
- Onboarding: ${passportContext?.onboardingCompleted ? 'Complete' : 'In progress'}

Always be encouraging, mystical, and reference their progress. Keep responses concise (2-3 sentences max unless explaining complex features).`

    const result = await runChat({
      messages: [
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      systemPrompt,
      temperature: 0.7,
      maxTokens: 300,
    })

    return NextResponse.json({ response: result.content })
  } catch (error: any) {
    console.error('[Companion Chat] Error:', error)
    return NextResponse.json(
      {
        error: 'Companion chat failed',
        message: error.message,
        helpMessage: 'Please check AI_GATEWAY_API_KEY in Settings → Vars'
      },
      { status: 500 }
    )
  }
}
