import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.API_KEY_GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, passportContext } = body

    // Build system prompt with user context
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

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 300,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[API] Error in /api/companion/chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
