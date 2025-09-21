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
    console.log('🔍 Homepage Content API - Deal of day:', transformedData.deal_of_day)
    console.log('🔍 Homepage Content API - Deal of day product cards:', transformedData.deal_of_day?.productCards)
    console.log('🔍 Homepage Content API - Deal of day product IDs:', transformedData.deal_of_day?.productIds)
    console.log('🔍 Homepage Content API - Sofa types:', transformedData.sofa_types)
    console.log('🔍 Homepage Content API - Bedroom inspiration:', transformedData.bedroom_inspiration)
    
    // Check if bedroom inspiration has valid product IDs
    if (transformedData.bedroom_inspiration?.productCards) {
      console.log('🔍 Homepage Content API - Bedroom inspiration product cards:', transformedData.bedroom_inspiration.productCards)
      console.log('🔍 Homepage Content API - Product IDs in bedroom inspiration:', transformedData.bedroom_inspiration.productCards.map(card => card.productId))
    }

    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { section, content } = body

    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content are required' }, { status: 400 })
    }

    // Check if the section already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('homepage_content')
      .select('id')
      .eq('section', section)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing section:', fetchError)
      return NextResponse.json({ error: 'Failed to check existing section' }, { status: 500 })
    }

    if (existingData) {
      // Update existing section
      const { error: updateError } = await supabase
        .from('homepage_content')
        .update({ 
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq('section', section)

      if (updateError) {
        console.error('Error updating homepage content:', updateError)
        return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 })
      }
    } else {
      // Insert new section
      const { error: insertError } = await supabase
        .from('homepage_content')
        .insert({
          section: section,
          content: content,
          order_index: 999, // Default order for new sections
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error inserting homepage content:', insertError)
        return NextResponse.json({ error: 'Failed to insert homepage content' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in homepage content PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
