import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Error fetching homepage content:', error)
      return NextResponse.json({ error: 'Failed to fetch homepage content' }, { status: 500 })
    }

    // Transform the data into a more usable format
    const transformedData = data?.reduce((acc, item) => {
      acc[item.section] = item.content
      return acc
    }, {} as Record<string, any>)

    console.log('🔍 Homepage Content API - Raw data:', data)
    console.log('🔍 Homepage Content API - Transformed data:', transformedData)
    console.log('🔍 Homepage Content API - Sofa types:', transformedData.sofa_types)
    console.log('🔍 Homepage Content API - Bedroom inspiration:', transformedData.bedroom_inspiration)
    
    // Check if bedroom inspiration has valid product IDs
    if (transformedData.bedroom_inspiration?.productCards) {
      console.log('🔍 Homepage Content API - Bedroom inspiration product cards:', transformedData.bedroom_inspiration.productCards)
      console.log('🔍 Homepage Content API - Product IDs in bedroom inspiration:', transformedData.bedroom_inspiration.productCards.map(card => card.productId))
    }

    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error in homepage content API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
