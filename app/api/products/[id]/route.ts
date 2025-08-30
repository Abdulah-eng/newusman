import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  try {
    const { id } = await params

    // OPTIMIZATION: Add aggressive caching headers for better performance
    const cacheControl = 'public, s-maxage=1800, stale-while-revalidate=3600' // Cache for 30 minutes, stale for 1 hour

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format. Product ID must be a valid UUID.' },
        { status: 400 }
      )
    }

    // OPTIMIZATION: Get product with all related data in a single optimized query
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        product_images(image_url),
        product_variants(id, sku, current_price, original_price, size, color, depth, firmness, length, width, height, availability, variant_image),
        product_features(feature_name),
        product_reasons_to_love(reason_text, description, icon),
        product_custom_reasons(reason_text, description),
        product_description_paragraphs(heading, content, image),
        product_faqs(question, answer),
        product_warranty_sections(section_title, section_content),
        product_dimensions(height, length, width, mattress_size, max_height, weight_capacity, pocket_springs, comfort_layer, support_layer),
        product_important_notices(notice_text, sort_order)
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

    // Debug logging for free gift and badges
    // console.log('[API /products/:id] Free gift debug:', {
    //   id: enrichedProduct.id,
    //   name: enrichedProduct.name,
    //   free_gift_product_id: enrichedProduct.free_gift_product_id,
    //   free_gift_enabled: enrichedProduct.free_gift_enabled,
    //   badges: enrichedProduct.badges,
    //   hasFreeGiftBadge: enrichedProduct.badges && Array.isArray(enrichedProduct.badges) && enrichedProduct.badges.some((b: any) => b.type === 'free_gift' && b.enabled)
    // })

    // Debug logging for dimension images
    // console.log('[API /products/:id] Raw product data:', {
    //   id: enrichedProduct.id,
    //   name: enrichedProduct.name,
    //   hasProductDimensions: !!enrichedProduct.product_dimensions,
    //   hasProductDimensionImages: !!enrichedProduct.product_dimension_images,
    //   productDimensionsCount: enrichedProduct.product_dimensions ? 1 : 0,
    //   productDimensionImagesCount: Array.isArray(enrichedProduct.product_dimension_images) ? enrichedProduct.product_dimension_images.length : 0
    // })

    // if (enrichedProduct.product_dimension_images) {
    //   console.log('[API /products/:id] Raw product_dimension_images:', enrichedProduct.product_dimension_images)
    //   console.log('[API /products/:id] product_dimension_images type:', typeof enrichedProduct.product_dimension_images)
    //   console.log('[API /products/:id] product_dimension_images isArray:', Array.isArray(enrichedProduct.product_dimension_images))
    // }

    // if (enrichedProduct.product_dimensions) {
    //   console.log('[API /products/:id] Raw product_dimensions:', enrichedProduct.product_dimensions)
    // }

    // try {
    //   console.log('[API /products/:id] id:', id,
    //     'raw variants count:', Array.isArray((enrichedProduct as any).product_variants) ? (enrichedProduct as any).product_variants.length : 0,
    //     'raw images count:', Array.isArray((enrichedProduct as any).product_images) ? (enrichedProduct as any).product_images.length : 0)
    // } catch {}

    // Helper to build valid URLs from either image_url or file_name
    const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
    const buildUrl = (img: any) => {
      const src = img?.image_url || img?.file_name
      // buildUrl input processed
      
      if (!src) {
        // buildUrl: no src found
        return null
      }
      if (typeof src !== 'string') {
        // buildUrl: src is not a string
        return null
      }
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        // buildUrl: returning absolute URL
        return src
      }
      if (fileBase) {
        const fullUrl = `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
        // buildUrl: returning constructed URL
        return fullUrl
      }
      // buildUrl: no fileBase, returning null
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

    // Fetch gift product details if this product has a free gift
    let giftProductDetails = null
    const hasFreeGift = product.free_gift_product_id && (
      product.free_gift_enabled || 
      (product.badges && Array.isArray(product.badges) && product.badges.some((b: any) => b.type === 'free_gift' && b.enabled))
    )
    
    // Free gift logic processed
    
    if (hasFreeGift) {
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
          originalPrice: variant.original_price,
          currentPrice: variant.current_price,
        color: variant.color,
        depth: variant.depth,
        firmness: variant.firmness,
        size: variant.size,
        // Add dimension fields
        length: variant.length,
        width: variant.width,
        height: variant.height,
        availability: variant.availability,
        // Add variant image
        variant_image: variant.variant_image
      })) || [],
      features: product.product_features?.map((feature: any) => feature.feature_name) || [],
      reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
      reasonsToLoveSmalltext: product.product_reasons_to_love?.map((reason: any) => reason.smalltext) || [],
      reasonsToLoveIcons: product.product_reasons_to_love?.map((reason: any) => reason.icon) || [],
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
        support_layer: product.product_dimensions.support_layer,
        // New editable heading fields
        mattress_size_heading: product.product_dimensions.mattress_size_heading,
        maximum_height_heading: product.product_dimensions.maximum_height_heading,
        weight_capacity_heading: product.product_dimensions.weight_capacity_heading,
        pocket_springs_heading: product.product_dimensions.pocket_springs_heading,
        comfort_layer_heading: product.product_dimensions.comfort_layer_heading,
        support_layer_heading: product.product_dimensions.support_layer_heading
      } : null,
      // Important notices for the dimensions section
      importantNotices: product.product_important_notices?.map((notice: any) => ({
        noticeText: notice.notice_text,
        sortOrder: notice.sort_order
      })) || [],
      // Dimension images for the dimensions section
      dimensionImages: product.product_dimension_images?.map((img: any) => ({
        id: img.id,
        imageUrl: buildUrl(img),
        fileName: img.file_name,
        fileSize: img.file_size,
        fileType: img.file_type,
        sortOrder: img.sort_order
      })).filter((img: any) => img.imageUrl) || [],
      popularCategories: product.product_popular_categories?.map((cat: any) => cat.popular_category_name) || [],
      // Add basic product info
      brand: 'Premium Brand', // Default brand
      currentPrice: Number.isFinite(minCurrentPrice) ? minCurrentPrice : (product.product_variants?.[0]?.current_price || 0),
      originalPrice: Number.isFinite(minOriginalPrice) ? minOriginalPrice : (product.product_variants?.[0]?.original_price || 0),
      sizes: uniqueSizes.length ? uniqueSizes : ['Standard'],
      warrantyDeliveryLine: product.warranty_delivery_line || null,
      badges: product.badges || [],
      free_gift_product_id: product.free_gift_product_id || null,
      free_gift_enabled: product.free_gift_enabled || false,
      free_gift_product_name: giftProductDetails?.name || null,
      free_gift_product_image: giftProductDetails?.image || null,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }

    // Performance logging (only in development)
    // Response time calculated

    return NextResponse.json({
      product: transformedProduct
    }, {
      headers: {
        'Cache-Control': cacheControl
      }
    })

  } catch (error) {
    console.error('Error in product API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
