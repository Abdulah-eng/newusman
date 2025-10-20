import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/reviews?product_id=xxx&limit=10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Reviews API GET request:', { productId, limit, offset })

    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: reviews, error } = await query
      .range(offset, offset + limit - 1)

    console.log('Reviews query result:', { reviews: reviews?.length || 0, error: error?.message })

    if (error) {
      console.error('Error fetching reviews:', error)
      
      // If table doesn't exist, return empty array instead of error
      if (error.code === 'PGRST116' || error.message?.includes('relation "reviews" does not exist')) {
        return NextResponse.json({
          reviews: [],
          count: 0
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: reviews || [],
      count: reviews?.length || 0
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    })

  } catch (error) {
    console.error('Error in reviews GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Reviews API POST request body:', body)
    
    const {
      product_id,
      product_name,
      rating,
      title,
      review_text,
      customer_name,
      email,
      verified = false
    } = body

    // Validate required fields
    if (!product_id || !rating || !title || !review_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Insert review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        product_name: product_name || 'Unknown Product',
        rating: parseInt(rating),
        title: title.trim(),
        review_text: review_text.trim(),
        customer_name: customer_name?.trim() || 'Anonymous',
        email: email?.trim() || null,
        verified: Boolean(verified),
        helpful_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST116' || error.message?.includes('relation "reviews" does not exist')) {
        return NextResponse.json(
          { error: 'Reviews table not found. Please run the database migration first.' },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Review created successfully',
      review
    }, { status: 201 })

  } catch (error) {
    console.error('Error in reviews POST API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}