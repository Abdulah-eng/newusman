import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Product IDs array is required' }, { status: 400 })
    }

    // Limit to prevent abuse
    const limitedIds = productIds.slice(0, 20)

    // Fetch all products in a single query with essential data only
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        brand,
        rating,
        headline,
        long_description,
        categories(name, slug),
        product_images(image_url, file_name),
        product_variants(current_price, original_price, size, color),
        badges,
        free_gift_product_id,
        free_gift_enabled
      `)
      .in('id', limitedIds)

    if (error) {
      console.error('Error fetching bulk products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Transform products to match frontend format
    const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
    const buildUrl = (img: any) => {
      const src = img?.image_url || img?.file_name
      if (!src || typeof src !== 'string') return null
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
      if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
      return null
    }

    const transformedProducts = products?.map(product => {
      // Calculate prices from variants
      const variants = product.product_variants || []
      const minCurrentPrice = variants.length > 0 ? 
        Math.min(...variants.map((v: any) => Number(v.current_price) || Number(v.original_price) || Infinity)) : 
        0
      const minOriginalPrice = variants.length > 0 ? 
        Math.min(...variants.map((v: any) => Number(v.original_price) || Number(v.current_price) || Infinity)) : 
        0

      // Build image URLs
      const images = (product.product_images || [])
        .map(buildUrl)
        .filter(Boolean)

      return {
        id: product.id,
        name: product.name,
        brand: product.brand || 'Premium Brand',
        rating: product.rating || 4.5,
        headline: product.headline,
        description: product.long_description,
        category: product.categories?.slug || 'mattresses',
        images: images.length > 0 ? images : ['/mattress-image.svg'],
        image: images[0] || '/mattress-image.svg',
        currentPrice: minCurrentPrice,
        originalPrice: minOriginalPrice,
        current_price: minCurrentPrice,
        original_price: minOriginalPrice,
        variants: variants.map((v: any) => ({
          currentPrice: v.current_price,
          originalPrice: v.original_price,
          size: v.size,
          color: v.color
        })),
        badges: product.badges || [],
        free_gift_product_id: product.free_gift_product_id,
        free_gift_enabled: product.free_gift_enabled,
        features: ['Premium Quality', 'Comfort', 'Durability']
      }
    }) || []

    return NextResponse.json({
      products: transformedProducts
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    })

  } catch (error) {
    console.error('Error in bulk products API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
