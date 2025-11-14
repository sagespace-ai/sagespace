/**
 * API endpoint to track user observability events
 */
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ObservabilityCollector } from '@/lib/ai/observability'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const userId = user?.id || null

    const eventData = await request.json()

    // Validate required fields
    if (!eventData.eventType || !eventData.eventCategory) {
      return NextResponse.json(
        { error: 'eventType and eventCategory are required' },
        { status: 400 }
      )
    }

    // Track the event
    await ObservabilityCollector.trackEvent(
      userId,
      eventData.eventType,
      eventData.eventCategory,
      {
        pagePath: eventData.pagePath,
        actionName: eventData.actionName,
        componentName: eventData.componentName,
        metadata: eventData.metadata || {},
      }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Observability Track API] Error:', error)
    // Don't fail loudly - observability should be invisible to users
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
