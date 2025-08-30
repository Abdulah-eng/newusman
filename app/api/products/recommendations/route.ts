import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('Recommendations API called with category:', category, 'limit:', limit)

    // Use a more direct approach for better filtering
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        rating,
        headline,
        variants:product_variants(id, current_price, original_price, size, color, depth, firmness),
        images:product_images(image_url),
        badges,
        free_gift_product_id,
        free_gift_enabled
      `)

    // Filter by category ID for more reliable filtering
    if (category && category !== 'all') {
      // First get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryError) {
        console.error('Error fetching category:', categoryError)
        return NextResponse.json({ error: 'Category not found', details: categoryError }, { status: 404 })
      }

      if (categoryData?.id) {
        query = query.eq('category_id', categoryData.id)
        console.log('Filtering by category ID:', categoryData.id, 'for slug:', category)
      }
    } else {
      console.log('No category filter applied - showing all products')
    }

    query = query.limit(limit)

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products for recommendations:', error)
      return NextResponse.json({ error: 'Failed to fetch products', details: error }, { status: 500 })
    }

    console.log('Found products:', products?.length || 0)

    // Transform the data to match the expected format
    const transformedProducts = await Promise.all(products?.map(async (product) => {
      // Fetch gift product details if this product has a free gift
      let giftProductDetails = null
      if (product.free_gift_product_id && product.free_gift_enabled) {
        try {
          const { data: giftProduct } = await supabase
            .from('products')
            .select(`
              id,
              name,
              product_images(image_url)
            `)
            .eq('id', product.free_gift_product_id)
            .single()
          
          if (giftProduct) {
            giftProductDetails = {
              id: giftProduct.id,
              name: giftProduct.name,
              image: giftProduct.product_images?.[0]?.image_url || ''
            }
          }
        } catch (error) {
          console.error('Error fetching gift product details:', error)
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        category: category || 'All',
        image: product.images?.[0]?.image_url || '/placeholder.jpg',
        currentPrice: product.variants?.[0]?.current_price || 0,
        originalPrice: product.variants?.[0]?.original_price || 0,
        size: product.variants?.[0]?.size || 'Standard',
        badges: product.badges || [],
        free_gift_product_id: product.free_gift_product_id || null,
        free_gift_enabled: product.free_gift_enabled || false,
        free_gift_product_name: giftProductDetails?.name || null,
        free_gift_product_image: giftProductDetails?.image || null
      }
    }) || [])

    console.log('Transformed products:', transformedProducts.length)

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error('Error in recommendations API:', error)
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
}
