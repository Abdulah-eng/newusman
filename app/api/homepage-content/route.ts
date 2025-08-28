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

    return NextResponse.json(transformedData)
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
