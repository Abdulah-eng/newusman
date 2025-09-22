import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    console.log('🔍 Sleep Luxury API - Starting fetch...')
    
    const { data: sleepLuxuryProducts, error } = await supabase
      .from('sleep_luxury_products')
      .select(`
        *,
        products (
          id,
          name,
          rating,
          headline,
          long_description,
          firmness_scale,
          categories (name, slug),
          product_images (image_url),
          product_variants (current_price, original_price, size, color),
          product_features (feature_name)
        )
      `)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) {
      console.error('❌ Error fetching sleep luxury products:', error)
      return NextResponse.json({ error: 'Failed to fetch sleep luxury products' }, { status: 500 })
    }

    console.log('✅ Sleep Luxury API - Fetched products:', sleepLuxuryProducts?.length || 0)

    // Group products by category and transform data
    const groupedProducts = sleepLuxuryProducts.reduce((acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = []
      }
      
      // Transform product data to match expected structure
      const product = item.products
      if (product) {
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
          .map((img: any) => img.image_url)
          .filter((url: string) => url)
        
        const transformedProduct = {
          id: product.id,
          name: product.name,
          brand: 'Premium Brand', // Default brand since column doesn't exist
          rating: product.rating || 4.5,
          review_count: 0, // Default since column doesn't exist
          badges: [], // Default since column doesn't exist
          categories: product.categories,
          current_price: Number.isFinite(minCurrentPrice) ? minCurrentPrice : 0,
          original_price: Number.isFinite(minOriginalPrice) ? minOriginalPrice : 0,
          images: images.length > 0 ? images : ['/placeholder.jpg'],
          variants: variants,
          features: (product.product_features || []).map((f: any) => f.feature_name).filter(Boolean),
          headline: product.headline || '',
          description: product.long_description || '',
          firmness_scale: product.firmness_scale || 'Medium'
        }
        
        acc[category].push(transformedProduct)
      }
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({ 
      success: true,
      products: groupedProducts,
      raw: sleepLuxuryProducts
    })

  } catch (error) {
    console.error('Error in sleep luxury API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { category, productIds } = await request.json()

    if (!category || !Array.isArray(productIds)) {
      return NextResponse.json({ error: 'Category and productIds are required' }, { status: 400 })
    }

    if (productIds.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 products allowed per category' }, { status: 400 })
    }

    // Start a transaction
    const { error: deleteError } = await supabase
      .from('sleep_luxury_products')
      .delete()
      .eq('category', category)

    if (deleteError) {
      console.error('Error deleting existing products:', deleteError)
      return NextResponse.json({ error: 'Failed to update sleep luxury products' }, { status: 500 })
    }

    // Insert new products
    const productsToInsert = productIds.map((productId, index) => ({
      category,
      product_id: productId,
      display_order: index + 1,
      is_active: true
    }))

    const { error: insertError } = await supabase
      .from('sleep_luxury_products')
      .insert(productsToInsert)

    if (insertError) {
      console.error('Error inserting new products:', insertError)
      return NextResponse.json({ error: 'Failed to update sleep luxury products' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: `Updated ${category} products successfully`
    })

  } catch (error) {
    console.error('Error updating sleep luxury products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
