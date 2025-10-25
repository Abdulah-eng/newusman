import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// GET /api/admin/news - Get all news items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (featured !== null && featured !== '') {
      query = query.eq('featured', featured === 'true')
    }

    const { data: news, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      news: news || [],
      count: news?.length || 0
    })

  } catch (error) {
    console.error('Error in news GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/news - Create new news item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      excerpt,
      category,
      readTime,
      author,
      date,
      image,
      featured,
      tags,
      content
    } = body

    // Validate required fields
    if (!title || !excerpt || !category || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: news, error } = await supabase
      .from('news')
      .insert({
        id: uuidv4(),
        title,
        excerpt,
        category,
        read_time: readTime,
        author,
        date,
        image,
        featured: featured || false,
        tags: tags || [],
        content: content || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating news item:', error)
      return NextResponse.json(
        { error: 'Failed to create news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      news,
      message: 'News item created successfully'
    })

  } catch (error) {
    console.error('Error in news POST API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/news - Update news item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      excerpt,
      category,
      readTime,
      author,
      date,
      image,
      featured,
      tags,
      content
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'News item ID is required' },
        { status: 400 }
      )
    }

    const { data: news, error } = await supabase
      .from('news')
      .update({
        title,
        excerpt,
        category,
        read_time: readTime,
        author,
        date,
        image,
        featured: featured || false,
        tags: tags || [],
        content: content || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news item:', error)
      return NextResponse.json(
        { error: 'Failed to update news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      news,
      message: 'News item updated successfully'
    })

  } catch (error) {
    console.error('Error in news PUT API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/news?id=xxx - Delete news item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'News item ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news item:', error)
      return NextResponse.json(
        { error: 'Failed to delete news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'News item deleted successfully'
    })

  } catch (error) {
    console.error('Error in news DELETE API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
