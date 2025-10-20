import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    // Add caching for better performance

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format. Product ID must be a valid UUID.' },
        { status: 400 }
      )
    }

    // OPTIMIZATION: Get essential data plus some additional details in one query
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
        product_important_notices(*),
        product_dimension_images(*)
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


    // Helper to build valid URLs from either image_url or file_name
    const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
    const buildUrl = (img: any) => {
      const src = img?.image_url || img?.file_name
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

      if (!src || typeof src !== 'string') return null
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
      if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
      if (supabaseUrl) return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${encodeURIComponent(src)}`
      return null
    }

    // OPTIMIZATION: Use variants from the main query instead of separate fetch
    let variantList: any[] = Array.isArray((product as any).product_variants) ? (product as any).product_variants : []

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
        .sort((a: any, b: any) => {
          // Sort by is_main_image first (true first), then by sort_order
          if (a.is_main_image && !b.is_main_image) return -1
          if (!a.is_main_image && b.is_main_image) return 1
          return (a.sort_order || 0) - (b.sort_order || 0)
        })
        .map((img: any) => buildUrl(img))
        .filter((u: string | null) => !!u),
      image: (() => {
        // Get the main image (first in the sorted array) or fallback to first image
        const sortedImages = (product.product_images || [])
          .sort((a: any, b: any) => {
            if (a.is_main_image && !b.is_main_image) return -1
            if (!a.is_main_image && b.is_main_image) return 1
            return (a.sort_order || 0) - (b.sort_order || 0)
          })
        const mainImage = sortedImages[0]
        return mainImage ? buildUrl(mainImage) : null
      })(),
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
        selectedFeatures: product.product_features?.map((feature: any) => feature.feature_name) || [],
        reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
        reasonsToLoveSmalltext: product.product_reasons_to_love?.map((reason: any) => reason.smalltext) || [],
        reasonsToLoveIcons: product.product_reasons_to_love?.map((reason: any) => reason.icon) || [],
        product_reasons_to_love: product.product_reasons_to_love || [],
        selectedReasonsToLove: product.product_reasons_to_love?.map((reason: any) => ({
          reason: reason.reason_text || '',
          description: reason.description || '',
          smalltext: reason.smalltext || '',
          icon: reason.icon || ''
        })) || [],
        customReasons: product.product_custom_reasons?.map((reason: any) => reason.reason_text) || [],
        reasonsToBuy: product.product_custom_reasons?.map((reason: any) => reason.reason_text) || [],
      descriptionParagraphs: product.product_description_paragraphs?.map((para: any) => ({
        heading: para.heading,
        content: para.content,
        image: buildUrl(para)
      })) || [],
      faqs: product.product_faqs?.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      })) || [],
      warrantySections: product.product_warranty_sections?.map((warranty: any) => ({
        heading: warranty.heading,
        content: warranty.content
      })) || [],
      careInstructions: product.care_instructions || null,
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
        support_layer_heading: product.product_dimensions.support_layer_heading,
        // Dimension disclaimer
        dimension_disclaimer: product.product_dimensions.dimension_disclaimer,
        // Visibility controls
        show_basic_dimensions: product.product_dimensions.show_basic_dimensions !== undefined ? product.product_dimensions.show_basic_dimensions : true,
        show_mattress_specs: product.product_dimensions.show_mattress_specs !== undefined ? product.product_dimensions.show_mattress_specs : true,
        show_technical_specs: product.product_dimensions.show_technical_specs !== undefined ? product.product_dimensions.show_technical_specs : true
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
        selectedPopularCategories: product.product_popular_categories?.map((cat: any) => cat.popular_category_name) || [],
      // Add basic product info
      brand: 'Premium Brand', // Default brand
      currentPrice: Number.isFinite(minCurrentPrice) ? minCurrentPrice : (product.product_variants?.[0]?.current_price || 0),
      originalPrice: Number.isFinite(minOriginalPrice) ? minOriginalPrice : (product.product_variants?.[0]?.original_price || 0),
      sizes: uniqueSizes.length ? uniqueSizes : ['Standard'],
      warrantyDeliveryLine: product.warranty_delivery_line || null,
      trialInformation: product.trial_information || null,
      trialInformationHeading: product.trial_information_heading || null,
      badges: product.badges || [],
      free_gift_product_id: product.free_gift_product_id || null,
      free_gift_enabled: product.free_gift_enabled || false,
      free_gift_product_name: giftProductDetails?.name || null,
      free_gift_product_image: giftProductDetails?.image || null,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      // SEO fields
      seoData: {
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        seo_keywords: product.seo_keywords || '',
        seo_tags: product.seo_tags || '',
        meta_robots: product.meta_robots || 'index, follow',
        canonical_url: product.canonical_url || '',
        og_title: product.og_title || '',
        og_description: product.og_description || '',
        og_image: product.og_image || '',
        twitter_title: product.twitter_title || '',
        twitter_description: product.twitter_description || '',
        twitter_image: product.twitter_image || '',
        structured_data: product.structured_data || null
      }
    }

    // Debug logging to check what data we're returning
    console.log('API Product Debug:', {
      descriptionParagraphs: transformedProduct.descriptionParagraphs,
      faqs: transformedProduct.faqs,
      warrantySections: transformedProduct.warrantySections,
      dimensions: transformedProduct.dimensions,
      dimensionImages: transformedProduct.dimensionImages
    })

    return NextResponse.json({
      product: transformedProduct
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Debug logging for specific fields
    console.log('Debug - Fields received:', {
      selectedFeatures: body.selectedFeatures,
      reasonsToBuy: body.reasonsToBuy,
      selectedReasonsToLove: body.selectedReasonsToLove,
      selectedPopularCategories: body.selectedPopularCategories
    })

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format. Product ID must be a valid UUID.' },
        { status: 400 }
      )
    }

    // Get category ID from the database
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', body.category)
      .single()

    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Update the main product - only update fields that definitely exist
    const updateData: any = {
      category_id: categoryData.id,
      name: body.name,
      rating: body.rating ? parseFloat(body.rating) : null,
      headline: body.headline,
      long_description: body.longDescription || null,
      updated_at: new Date().toISOString()
    }

    // Only add fields if they exist in the database schema
    // These fields are added by migrations, so we'll add them conditionally
    if (body.warrantyDeliveryLine !== undefined) {
      updateData.warranty_delivery_line = body.warrantyDeliveryLine
    }
    if (body.careInstructions !== undefined) {
      updateData.care_instructions = body.careInstructions
    }
    if (body.trialInformation !== undefined) {
      updateData.trial_information = body.trialInformation
    }
    if (body.trialInformationHeading !== undefined) {
      updateData.trial_information_heading = body.trialInformationHeading
    }
    if (body.firmnessScale !== undefined) {
      updateData.firmness_scale = body.firmnessScale
    }
    if (body.supportLevel !== undefined) {
      updateData.support_level = body.supportLevel
    }
    if (body.pressureReliefLevel !== undefined) {
      updateData.pressure_relief_level = body.pressureReliefLevel
    }
    if (body.airCirculationLevel !== undefined) {
      updateData.air_circulation_level = body.airCirculationLevel
    }
    if (body.durabilityLevel !== undefined) {
      updateData.durability_level = body.durabilityLevel
    }
    if (body.badges !== undefined) {
      updateData.badges = body.badges
    }

    // Add SEO fields
    if (body.seoData) {
      const seoFields = [
        'seo_title', 'seo_description', 'seo_keywords', 'seo_tags',
        'meta_robots', 'canonical_url', 'og_title', 'og_description',
        'og_image', 'twitter_title', 'twitter_description', 'twitter_image',
        'structured_data'
      ]
      
      seoFields.forEach(field => {
        if (body.seoData[field] !== undefined) {
          updateData[field] = body.seoData[field]
        }
      })
    }

    console.log('Updating product with data:', updateData)

    const { data: productData, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (productError) {
      console.error('Product update error:', productError)
      console.error('Product update error details:', {
        message: productError.message,
        details: productError.details,
        hint: productError.hint,
        code: productError.code
      })
      return NextResponse.json(
        { error: `Failed to update product: ${productError.message}` },
        { status: 500 }
      )
    }

    // Update product images if provided
    if (body.images) {
      // Always delete existing images first
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id)

      if (deleteImagesError) {
        console.error('Error deleting existing images:', deleteImagesError)
      }

      // Insert new images if any provided
      if (body.images.length > 0) {
        const imageData = body.images.map((imageUrl: string, index: number) => ({
          product_id: id,
          image_url: imageUrl,
          sort_order: index,
          is_main_image: index === 0, // First image becomes main image
          file_name: imageUrl.split('/').pop() || `image_${index}.jpg`,
          file_size: null,
          file_type: 'image/jpeg'
        }))

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageData)

        if (imageError) {
          console.error('Image update error:', imageError)
        }
      }
    }

    // Handle main image separately if provided
    if (body.main_image) {
      // If main_image is provided, ensure it's the first image and marked as main
      if (body.images && body.images.length > 0) {
        // Update the first image to be the main image
        const { error: updateMainImageError } = await supabase
          .from('product_images')
          .update({ is_main_image: true })
          .eq('product_id', id)
          .eq('sort_order', 0)

        if (updateMainImageError) {
          console.error('Error updating main image flag:', updateMainImageError)
        }
      } else {
        // If no images array but main_image is provided, insert it as the main image
        const { error: insertMainImageError } = await supabase
          .from('product_images')
          .insert({
            product_id: id,
            image_url: body.main_image,
            sort_order: 0,
            is_main_image: true,
            file_name: body.main_image.split('/').pop() || 'main_image.jpg',
            file_size: null,
            file_type: 'image/jpeg'
          })

        if (insertMainImageError) {
          console.error('Error inserting main image:', insertMainImageError)
        }
      }
    }

    // Handle main image index and image sequence if provided
    if (body.mainImageIndex !== undefined && body.images && body.images.length > 0) {
      // First, clear all main image flags
      const { error: clearMainImageError } = await supabase
        .from('product_images')
        .update({ is_main_image: false })
        .eq('product_id', id)

      if (clearMainImageError) {
        console.error('Error clearing main image flags:', clearMainImageError)
      }

      // Update sort_order for all images based on their new sequence
      for (let i = 0; i < body.images.length; i++) {
        const { error: updateSortOrderError } = await supabase
          .from('product_images')
          .update({ 
            sort_order: i,
            is_main_image: i === body.mainImageIndex
          })
          .eq('product_id', id)
          .eq('image_url', body.images[i])

        if (updateSortOrderError) {
          console.error(`Error updating sort order for image ${i}:`, updateSortOrderError)
        }
      }
    }

    // Update product variants if provided
    if (body.variants && body.variants.length > 0) {
      // First, delete existing variants
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id)

      if (deleteError) {
        console.error('Error deleting existing variants:', deleteError)
      }

      // Insert new variants
      const variantData = body.variants.map((variant: any) => ({
        product_id: id,
        sku: variant.sku || null,
        original_price: Number.isFinite(parseFloat(variant.originalPrice)) ? parseFloat(variant.originalPrice) : 0,
        current_price: Number.isFinite(parseFloat(variant.currentPrice)) ? parseFloat(variant.currentPrice) : 0,
        color: variant.color || null,
        depth: variant.depth || null,
        firmness: variant.firmness || null,
        size: variant.size || null,
        length: variant.length || null,
        width: variant.width || null,
        height: variant.height || null,
        availability: variant.availability !== false,
        variant_image: variant.variant_image || null
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantData)

      if (variantError) {
        console.error('Variant update error:', variantError)
      }
    }

    // Update product dimensions if provided
    if (body.dimensions) {
      // Always delete existing dimensions first
      const { error: deleteDimensionsError } = await supabase
        .from('product_dimensions')
        .delete()
        .eq('product_id', id)

      if (deleteDimensionsError) {
        console.error('Error deleting existing dimensions:', deleteDimensionsError)
      }

      // Insert new dimensions (always insert a row so visibility toggles persist even when values are empty)
      const dimensionData = {
        product_id: id,
        height: body.dimensions.height || null,
        length: body.dimensions.length || null,
        width: body.dimensions.width || null,
        mattress_size: body.dimensions.mattressSize || null,
        maximum_height: body.dimensions.maxHeight || null,
        weight_capacity: body.dimensions.weightCapacity || null,
        pocket_springs: body.dimensions.pocketSprings || null,
        comfort_layer: body.dimensions.comfortLayer || null,
        support_layer: body.dimensions.supportLayer || null,
        // Editable headings (keep undefined as null)
        mattress_size_heading: body.dimensions.mattressSizeHeading || null,
        maximum_height_heading: body.dimensions.maximumHeightHeading || null,
        weight_capacity_heading: body.dimensions.weightCapacityHeading || null,
        pocket_springs_heading: body.dimensions.pocketSpringsHeading || null,
        comfort_layer_heading: body.dimensions.comfortLayerHeading || null,
        support_layer_heading: body.dimensions.supportLayerHeading || null,
        // Dimension disclaimer
        dimension_disclaimer: body.dimensions.dimensionDisclaimer || null,
        // Visibility controls (booleans must be preserved even when false)
        show_basic_dimensions: body.dimensions.show_basic_dimensions !== undefined ? body.dimensions.show_basic_dimensions : true,
        show_mattress_specs: body.dimensions.show_mattress_specs !== undefined ? body.dimensions.show_mattress_specs : true,
        show_technical_specs: body.dimensions.show_technical_specs !== undefined ? body.dimensions.show_technical_specs : true
      }

      const { error: dimensionError } = await supabase
        .from('product_dimensions')
        .insert(dimensionData)

      if (dimensionError) {
        console.error('Dimension update error:', dimensionError)
      }
    }

    // Update important notices if provided
    if (body.importantNotices) {
      console.log('[API PUT] Important notices received:', {
        hasImportantNotices: !!body.importantNotices,
        importantNotices: body.importantNotices,
        length: body.importantNotices?.length,
        type: typeof body.importantNotices
      })
      
      // Always delete existing important notices first
      const { error: deleteNoticesError } = await supabase
        .from('product_important_notices')
        .delete()
        .eq('product_id', id)

      if (deleteNoticesError) {
        console.error('Error deleting existing important notices:', deleteNoticesError)
      }

      // Insert new important notices if any provided
      if (body.importantNotices.length > 0) {
        const noticeData = body.importantNotices.map((notice: any) => ({
          product_id: id,
          notice_text: notice.noticeText || '',
          sort_order: notice.sortOrder || 0
        }))

        console.log('[API PUT] Inserting important notices:', noticeData)

        const { error: noticeError } = await supabase
          .from('product_important_notices')
          .insert(noticeData)

        if (noticeError) {
          console.error('Important notices update error:', noticeError)
        } else {
          console.log('[API PUT] Important notices inserted successfully')
        }
      } else {
        console.log('[API PUT] No important notices to insert (empty array)')
      }
    } else {
      console.log('[API PUT] No importantNotices field in request body')
    }

    // Update description paragraphs if provided
    if (body.descriptionParagraphs) {
      // Always delete existing description paragraphs first
      const { error: deleteParagraphsError } = await supabase
        .from('product_description_paragraphs')
        .delete()
        .eq('product_id', id)

      if (deleteParagraphsError) {
        console.error('Error deleting existing description paragraphs:', deleteParagraphsError)
      }

      // Insert new description paragraphs if any provided
      if (body.descriptionParagraphs.length > 0) {
        const paragraphData = body.descriptionParagraphs.map((para: any, index: number) => ({
          product_id: id,
          heading: para.heading || '',
          content: para.content || '',
          image_url: para.image || null,
          sort_order: index
        }))

        const { error: paragraphError } = await supabase
          .from('product_description_paragraphs')
          .insert(paragraphData)

        if (paragraphError) {
          console.error('Description paragraphs update error:', paragraphError)
        }
      }
    }

    // Update FAQs if provided
    if (body.faqs) {
      // Always delete existing FAQs first
      const { error: deleteFaqsError } = await supabase
        .from('product_faqs')
        .delete()
        .eq('product_id', id)

      if (deleteFaqsError) {
        console.error('Error deleting existing FAQs:', deleteFaqsError)
      }

      // Insert new FAQs if any provided
      if (body.faqs.length > 0) {
        const faqData = body.faqs.map((faq: any, index: number) => ({
          product_id: id,
          question: faq.question || '',
          answer: faq.answer || '',
          sort_order: index
        }))

        const { error: faqError } = await supabase
          .from('product_faqs')
          .insert(faqData)

        if (faqError) {
          console.error('FAQs update error:', faqError)
        }
      }
    }

    // Update warranty sections if provided
    if (body.warrantySections) {
      // Always delete existing warranty sections first
      const { error: deleteWarrantyError } = await supabase
        .from('product_warranty_sections')
        .delete()
        .eq('product_id', id)

      if (deleteWarrantyError) {
        console.error('Error deleting existing warranty sections:', deleteWarrantyError)
      }

      // Insert new warranty sections if any provided
      if (body.warrantySections.length > 0) {
        const warrantyData = body.warrantySections.map((warranty: any, index: number) => ({
          product_id: id,
          heading: warranty.heading || '',
          content: warranty.content || '',
          sort_order: index
        }))

        const { error: warrantyError } = await supabase
          .from('product_warranty_sections')
          .insert(warrantyData)

        if (warrantyError) {
          console.error('Warranty sections update error:', warrantyError)
        }
      }
    }

    // Update popular categories if provided
    if (body.selectedPopularCategories) {
      // Always delete existing popular categories first
      const { error: deleteCategoriesError } = await supabase
        .from('product_popular_categories')
        .delete()
        .eq('product_id', id)

      if (deleteCategoriesError) {
        console.error('Error deleting existing popular categories:', deleteCategoriesError)
      }

      // Insert new popular categories if any provided
      if (body.selectedPopularCategories.length > 0) {
        const withOrder = body.selectedPopularCategories.map((categoryName: string, index: number) => ({
          product_id: id,
          popular_category_name: categoryName,
          sort_order: index as any
        }))

        try {
          const { error } = await supabase
            .from('product_popular_categories')
            .insert(withOrder as any)
          if (error) throw error
        } catch (e) {
          const noOrder = body.selectedPopularCategories.map((categoryName: string) => ({
            product_id: id,
            popular_category_name: categoryName
          }))
          const { error: categoryError } = await supabase
            .from('product_popular_categories')
            .insert(noOrder)
          if (categoryError) {
            console.error('Popular categories update error:', categoryError)
          }
        }
      }
    }

    // Normalize aliases from create form
    if (Array.isArray(body.customReasonsToBuy) && (!Array.isArray(body.reasonsToBuy) || body.reasonsToBuy.length === 0)) {
      body.reasonsToBuy = body.customReasonsToBuy
    }

    // Update reasons to buy if provided
    if (body.reasonsToBuy) {
      // Always delete existing reasons to buy first
      const { error: deleteReasonsError } = await supabase
        .from('product_custom_reasons')
        .delete()
        .eq('product_id', id)

      if (deleteReasonsError) {
        console.error('Error deleting existing reasons to buy:', deleteReasonsError)
      }

      // Insert new reasons to buy if any provided
      if (body.reasonsToBuy.length > 0) {
        // Try with optional columns
        const reasonDataWithExtras = body.reasonsToBuy.map((reason: string, index: number) => ({
          product_id: id,
          reason_text: reason,
          description: null as any,
          sort_order: index as any
        }))

        try {
          const { error } = await supabase
            .from('product_custom_reasons')
            .insert(reasonDataWithExtras as any)
          if (error) throw error
        } catch (e) {
          // Fallback to minimal columns
          const legacyReasonData = body.reasonsToBuy.map((reason: string) => ({
            product_id: id,
            reason_text: reason
          }))
          const { error: legacyError } = await supabase
            .from('product_custom_reasons')
            .insert(legacyReasonData)
          if (legacyError) {
            console.error('Reasons to buy legacy insert error:', legacyError)
          }
        }
      }
    }

    // Update selected features if provided
    if (body.selectedFeatures) {
      // Always delete existing features first
      const { error: deleteFeaturesError } = await supabase
        .from('product_features')
        .delete()
        .eq('product_id', id)

      if (deleteFeaturesError) {
        console.error('Error deleting existing features:', deleteFeaturesError)
      }

      // Insert new features if any provided
      if (body.selectedFeatures.length > 0) {
        const featureDataWithOrder = body.selectedFeatures.map((featureName: string, index: number) => ({
          product_id: id,
          feature_name: featureName,
          sort_order: index as any
        }))

        try {
          const { error: featureError } = await supabase
            .from('product_features')
            .insert(featureDataWithOrder as any)
          if (featureError) throw featureError
        } catch (e) {
          const featureData = body.selectedFeatures.map((featureName: string) => ({
            product_id: id,
            feature_name: featureName
          }))
          const { error: featureError } = await supabase
            .from('product_features')
            .insert(featureData)
          if (featureError) {
            console.error('Features update error:', featureError)
          }
        }
      }
    }

    // Update selected reasons to love if provided
    if (body.selectedReasonsToLove) {
      // Always delete existing reasons to love first
      const { error: deleteReasonsToLoveError } = await supabase
        .from('product_reasons_to_love')
        .delete()
        .eq('product_id', id)

            if (deleteReasonsToLoveError) {
        console.error('Error deleting existing reasons to love:', deleteReasonsToLoveError)
      }

      // Insert new reasons to love if any provided
      if (body.selectedReasonsToLove.length > 0) {
        const withOrder = body.selectedReasonsToLove.map((reason: any, index: number) => ({
          product_id: id,
          reason_text: reason.reason || '',
          description: reason.description || null,
          smalltext: reason.smalltext || null,
          icon: reason.icon || null,
          sort_order: index as any
        }))

        // First try inserting with sort_order
        const { error: insertWithOrderError } = await supabase
          .from('product_reasons_to_love')
          .insert(withOrder as any)

        if (insertWithOrderError) {
          console.warn('Insert with sort_order failed, retrying without sort_order:', insertWithOrderError)
          // Retry without sort_order but KEEP description/smalltext/icon
          const withoutOrder = body.selectedReasonsToLove.map((reason: any) => ({
            product_id: id,
            reason_text: reason.reason || '',
            description: reason.description || null,
            smalltext: reason.smalltext || null,
            icon: reason.icon || null
          }))
          const { error: insertWithoutOrderError } = await supabase
            .from('product_reasons_to_love')
            .insert(withoutOrder as any)
          if (insertWithoutOrderError) {
            console.error('Reasons to love insert (without sort_order) error:', insertWithoutOrderError)
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: productData
    })

  } catch (error) {
    console.error('Error in product update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
