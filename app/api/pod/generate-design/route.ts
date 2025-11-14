import { NextRequest, NextResponse } from 'next/server'
import { SageMerchantAgent } from '@/lib/agents'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productType, theme, userPreferences } = await request.json()

    console.log('[v0] [POD] Generating design via Sage Merchant Agent')

    // Use Sage Merchant Agent to generate design
    const agent = new SageMerchantAgent()
    const response = await agent.execute({
      productType,
      theme,
      userPreferences
    })

    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 500 })
    }

    // Parse design data
    let designData
    try {
      designData = JSON.parse(response.content)
    } catch {
      // If not JSON, structure the response
      designData = {
        designConcept: response.content,
        colorPalette: ['#3b82f6', '#8b5cf6', '#ec4899'],
        mainElements: ['spiral', 'stars', 'cosmic glow'],
        productDescription: response.content.substring(0, 200)
      }
    }

    // Store design in database
    const { data: design, error: designError } = await supabase
      .from('pod_designs')
      .insert({
        design_name: `${theme} - ${productType}`,
        theme,
        design_concept: designData.designConcept,
        color_palette: designData.colorPalette,
        main_elements: designData.mainElements,
        product_description: designData.productDescription,
        created_by_agent: true
      })
      .select()
      .single()

    if (designError) throw designError

    // Track interaction
    await supabase.from('user_pod_interactions').insert({
      user_id: user.id,
      product_id: design.id,
      interaction_type: 'design_request'
    })

    return NextResponse.json({ design, designData })
  } catch (error) {
    console.error('[POD API] Error generating design:', error)
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}
