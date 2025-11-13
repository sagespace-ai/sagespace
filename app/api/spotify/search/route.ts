import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'track,artist,album'

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Not authenticated with Spotify',
        needsAuth: true 
      }, { status: 401 })
    }

    console.log('[v0] Searching Spotify for:', query)

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] Spotify search error:', error)
      return NextResponse.json({ 
        error: 'Failed to search Spotify',
        details: error 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('[v0] Spotify search results:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Spotify search exception:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
