import { NextResponse } from 'next/server'
import { guideEngine } from '@/lib/guide/guide-engine'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    const results = await guideEngine.searchGuide(query)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('[v0] Error searching guide:', error)
    return NextResponse.json({ error: 'Failed to search guide' }, { status: 500 })
  }
}
