import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 20)
    const productId = searchParams.get('productId')

    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ reviews: data || [] })
  } catch (error: any) {
    console.error('GET /api/reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, customerName, rating, title, review, orderNumber } = await req.json()

    if (!customerName || !rating || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId || null,
        customer_name: customerName,
        rating: Number(rating),
        title: title || null,
        review_text: review,
        order_number: orderNumber || null,
        verified: !!orderNumber
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, review: data })
  } catch (error: any) {
    console.error('POST /api/reviews error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}


