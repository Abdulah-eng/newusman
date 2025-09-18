import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/products/search?q=term&limit=200&category=mattresses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 1000)
    const category = (searchParams.get('category') || '').trim()

    // First get the category ID if category slug is provided
    let categoryId = null
    if (category) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryError) {
        console.error('Error fetching category:', categoryError)
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      categoryId = categoryData.id
    }

    // Build the query
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        product_images(image_url),
        product_variants(current_price, original_price)
      `)
      .limit(limit)

    // Apply search filter
    if (q) {
      query = query.ilike('name', `%${q}%`)
    }

    // Apply category filter
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
    if (error) {
      console.error('search products error', error)
      return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
    }

    // Map to a simpler shape
    const products = (data || []).map((p: any) => {
      const variants = Array.isArray(p.product_variants) ? p.product_variants : []
      const minCurrent = variants.length > 0 ? Math.min(...variants.map((v: any) => parseFloat(v.current_price) || Infinity)) : null
      return {
        id: p.id,
        name: p.name,
        current_price: Number.isFinite(minCurrent) ? minCurrent : null,
        product_images: p.product_images,
        category_id: p.category_id,
      }
    })
    
    return NextResponse.json({ products })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


