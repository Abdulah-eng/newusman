import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format. Product ID must be a valid UUID.' },
        { status: 400 }
      )
    }

    // Get product with all related data
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(*),
        product_variants(*),
        product_features(*),
        product_reasons_to_love(*),
        product_custom_reasons(*),
        product_description_paragraphs(*),
        product_faqs(*),
        product_warranty_sections(*),
        product_dimensions(*),
        product_popular_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    try {
      console.log('[API /products/:id] id:', id,
        'raw variants count:', Array.isArray((product as any).product_variants) ? (product as any).product_variants.length : 0,
        'raw images count:', Array.isArray((product as any).product_images) ? (product as any).product_images.length : 0)
    } catch {}

    // Helper to build valid URLs from either image_url or file_name
    const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
    const buildUrl = (img: any) => {
      const src = img?.image_url || img?.file_name
      if (!src) return null
      if (typeof src !== 'string') return null
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
      if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
      return null
    }

    // Always fetch variants directly from related table for consistency
    let variantList: any[] = []
    {
      const { data: directVariants, error: directError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
      if (directError) {
        console.warn('[API /products/:id] direct variant fetch error:', directError)
        variantList = Array.isArray((product as any).product_variants) ? (product as any).product_variants : []
      } else {
        variantList = directVariants || []
      }
    }

    // Compute variant-derived aggregates
    const minCurrentPrice = variantList.length
      ? Math.min(...variantList.map((v: any) => Number(v.current_price) || Number(v.original_price) || Infinity))
      : 0
    const minOriginalPrice = variantList.length
      ? Math.min(...variantList.map((v: any) => Number(v.original_price) || Number(v.current_price) || Infinity))
      : 0
    const uniqueSizes: string[] = Array.from(
      new Set(
        variantList
          .map((v: any) => v.size)
          .filter((s: any) => typeof s === 'string' && s.trim().length > 0)
      )
    )

    // Transform the data to match the expected frontend format
    const transformedProduct = {
      id: product.id,
      name: product.name,
      category: product.categories.slug,
      rating: product.rating,
      headline: product.headline,
      longDescription: product.long_description,
      long_description: product.long_description, // Keep original field name too
      firmnessScale: product.firmness_scale,
      firmness_scale: product.firmness_scale, // Keep original field name too
      supportLevel: product.support_level,
      pressureReliefLevel: product.pressure_relief_level,
      airCirculationLevel: product.air_circulation_level,
      durabilityLevel: product.durability_level,
      showInKidsCategory: product.show_in_kids_category,
      showInSalesCategory: product.show_in_sales_category,
      selectedMattresses: product.selected_mattresses,
      images: (product.product_images || [])
        .map((img: any) => buildUrl(img))
        .filter((u: string | null) => !!u),
      variants: (variantList || []).map((variant: any) => ({
        sku: variant.sku,
        sdiNumber: variant.sdi_number,
        originalPrice: variant.original_price,
        currentPrice: variant.current_price,
        color: variant.color,
        depth: variant.depth,
        firmness: variant.firmness,
        size: variant.size
      })) || [],
      features: product.product_features?.map((feature: any) => feature.feature_name) || [],
      reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
      product_reasons_to_love: product.product_reasons_to_love || [],
      customReasons: product.product_custom_reasons?.map((reason: any) => reason.reason_text) || [],
      descriptionParagraphs: product.product_description_paragraphs?.map((para: any) => ({
        heading: para.heading,
        content: para.content,
        image: para.image_url || para.file_name
      })) || [],
      faqs: product.product_faqs?.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      })) || [],
      warrantySections: product.product_warranty_sections?.map((warranty: any) => ({
        heading: warranty.heading,
        content: warranty.content
      })) || [],
      dimensions: product.product_dimensions ? {
        height: product.product_dimensions.height,
        length: product.product_dimensions.length,
        width: product.product_dimensions.width,
        mattress_size: product.product_dimensions.mattress_size,
        max_height: product.product_dimensions.maximum_height,
        weight_capacity: product.product_dimensions.weight_capacity,
        pocket_springs: product.product_dimensions.pocket_springs,
        comfort_layer: product.product_dimensions.comfort_layer,
        support_layer: product.product_dimensions.support_layer
      } : null,
      popularCategories: product.product_popular_categories?.map((cat: any) => cat.popular_category_name) || [],
      // Add basic product info
      brand: 'Premium Brand', // Default brand
      currentPrice: Number.isFinite(minCurrentPrice) ? minCurrentPrice : (product.product_variants?.[0]?.current_price || 0),
      originalPrice: Number.isFinite(minOriginalPrice) ? minOriginalPrice : (product.product_variants?.[0]?.original_price || 0),
      sizes: uniqueSizes.length ? uniqueSizes : ['Standard'],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }

    try {
      console.log('[API /products/:id] transformed variants count:', Array.isArray((transformedProduct as any).variants) ? (transformedProduct as any).variants.length : 0)
      console.log('[API /products/:id] product_reasons_to_love:', (transformedProduct as any).product_reasons_to_love)
      console.log('[API /products/:id] reasonsToLove:', (transformedProduct as any).reasonsToLove)
    } catch {}

    return NextResponse.json({
      product: transformedProduct
    })

  } catch (error) {
    console.error('Error in product API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
