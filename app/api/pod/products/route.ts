import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productType = searchParams.get('type')

    const supabase = createServerClient()
    
    let query = supabase
      .from('pod_products')
      .select(`
        *,
        design:pod_designs(*)
      `)
      .eq('is_active', true)

    if (productType) {
      query = query.eq('product_type', productType)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ products: data || [] })
  } catch (error) {
    console.error('[POD API] Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch POD products' },
      { status: 500 }
    )
  }
}
