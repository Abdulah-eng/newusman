import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      )
    }

    // Fetch additional product details that are not essential for initial load
    const { data: additionalData, error } = await supabase
      .from('products')
      .select(`
        product_reasons_to_love(*),
        product_custom_reasons(*),
        product_description_paragraphs(*),
        product_faqs(*),
        product_warranty_sections(*),
        product_dimensions(*),
        product_popular_categories(*),
        product_dimension_images(*),
        product_important_notices(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching additional product details:', error)
      return NextResponse.json(
        { error: 'Failed to fetch additional details' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      details: additionalData
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        'CDN-Cache-Control': 'public, s-maxage=600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=600'
      }
    })

  } catch (error) {
    console.error('Error in product details API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
