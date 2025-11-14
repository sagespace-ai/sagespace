import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    const supabase = createServerClient()
    
    let query = supabase
      .from('affiliate_products')
      .select(`
        *,
        partner:affiliate_partners(*)
      `)
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ products: data || [] })
  } catch (error) {
    console.error('[Affiliates API] Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate products' },
      { status: 500 }
    )
  }
}
