import { NextResponse } from 'next/server'
import { guideEngine } from '@/lib/guide/guide-engine'

export async function GET() {
  try {
    const sections = await guideEngine.getGuideContent()
    return NextResponse.json({ sections })
  } catch (error) {
    console.error('[v0] Error fetching guide:', error)
    return NextResponse.json({ error: 'Failed to fetch guide' }, { status: 500 })
  }
}
