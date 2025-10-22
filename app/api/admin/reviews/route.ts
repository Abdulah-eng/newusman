import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/reviews - Get all reviews for admin
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in reviews API')
      // Allow access without checking managers table
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const rating = searchParams.get('rating')
    const verified = searchParams.get('verified')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply filters
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,title.ilike.%${search}%,review_text.ilike.%${search}%,product_name.ilike.%${search}%`)
    }

    if (rating) {
      query = query.eq('rating', parseInt(rating))
    }

    if (verified !== null && verified !== '') {
      query = query.eq('verified', verified === 'true')
    }

    const { data: reviews, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Error in admin reviews GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/reviews?id=xxx - Delete a review
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in reviews DELETE API')
      // Allow access without checking managers table
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    const { searchParams } = new URL(req.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('Error deleting review:', error)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    })

  } catch (error) {
    console.error('Error in admin reviews DELETE API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
