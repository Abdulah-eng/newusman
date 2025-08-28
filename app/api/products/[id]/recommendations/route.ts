import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // In Next.js App Router, params may be a promise in dynamic routes.
    const resolvedParams =
      typeof (context.params as any)?.then === 'function'
        ? await (context.params as Promise<{ id: string }>)
        : (context.params as { id: string })
    const productId = resolvedParams.id

    // Fetch recommended products for this specific product
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('product_recommendations')
      .select(`
        recommended_product_id,
        category_name,
        sort_order,
        recommended_product:products!product_recommendations_recommended_product_id_fkey(
          id,
          name,
          rating,
          categories(name, slug),
          product_images(image_url),
          product_variants(current_price, original_price, size)
        )
      `)
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    if (recommendationsError) {
      console.error('Error fetching recommendations:', recommendationsError)
      return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedRecommendations = recommendations
      ?.filter(rec => rec.recommended_product) // Only include if recommended product exists
      .map((rec, index) => ({
        id: rec.recommended_product.id,
        name: rec.recommended_product.name,
        image: rec.recommended_product.product_images?.[0]?.image_url || '/placeholder.jpg',
        rating: rec.recommended_product.rating || 4.5,
        reviewCount: 500, // Default value
        size: rec.recommended_product.product_variants?.[0]?.size || 'Standard Size',
        originalPrice: rec.recommended_product.product_variants?.[0]?.original_price || 100,
        currentPrice: rec.recommended_product.product_variants?.[0]?.current_price || 90,
        badge: index === 0 ? 'TOP PICKS 2024' : index === 1 ? 'BEST SELLER' : 'BEST VALUE',
        category: rec.recommended_product.categories?.name || 'Unknown'
      })) || []

    return NextResponse.json({ recommendations: transformedRecommendations })
  } catch (error) {
    console.error('Error in recommendations API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
