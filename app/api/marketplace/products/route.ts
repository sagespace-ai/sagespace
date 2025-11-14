import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const creatorId = searchParams.get('creatorId')

    const supabase = createServerClient()
    
    let query = supabase
      .from('marketplace_products')
      .select(`
        *,
        creator:marketplace_creators(*)
      `)
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    const { data, error} = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ products: data || [] })
  } catch (error) {
    console.error('[Marketplace API] Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace products' },
      { status: 500 }
    )
  }
}
