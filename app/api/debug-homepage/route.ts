import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Fetch raw data from database
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Error fetching homepage content:', error)
      return NextResponse.json({ error: 'Failed to fetch homepage content' }, { status: 500 })
    }

    // Return both raw and transformed data for debugging
    const transformedData = data?.reduce((acc, item) => {
      acc[item.section] = item.content
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      raw: data,
      transformed: transformedData,
      heroSection: transformedData?.hero,
      imageCards: transformedData?.image_cards,
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error in debug homepage API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
