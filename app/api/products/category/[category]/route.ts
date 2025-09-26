import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const offset = (page - 1) * limit
    
    // Get filter parameters
    const firmness = searchParams.getAll('firmness')
    const features = searchParams.getAll('features')
    const size = searchParams.getAll('size')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')

    // OPTIMIZATION: Add caching headers for better performance

    // Handle special cases for kids and sales categories
    if (category === 'kids') {
      console.log('🔍 Kids Category: Fetching products with show_in_kids_category = true')
      // For kids page, fetch products where show_in_kids_category is true
      const { data: products, error: productsError, count: totalCount } = await supabase
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
          product_popular_categories(*),
          product_dimension_images(*)
        `, { count: 'exact' })
        .eq('show_in_kids_category', true)
        .range(offset, offset + limit - 1)

      if (productsError) {
        console.error('Error fetching kids products:', productsError)
        return NextResponse.json(
          { error: 'Failed to fetch products' },
          { status: 500 }
        )
      }

      // Transform the data to match the expected frontend format
      const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
      const buildUrl = (img: any) => {
        const src = img?.image_url || img?.file_name
        if (!src) return null
        if (typeof src !== 'string') return null
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
        if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
        return null
      }

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
          category: 'kids', // Force category to be 'kids' for display
          rating: product.rating,
          headline: product.headline,
          longDescription: product.long_description,
          firmnessScale: product.firmness_scale,
          supportLevel: product.support_level,
          pressureReliefLevel: product.pressure_relief_level,
          airCirculationLevel: product.air_circulation_level,
          durabilityLevel: product.durability_level,
          showInKidsCategory: product.show_in_kids_category,
          showInSalesCategory: product.show_in_sales_category,
          selectedMattresses: product.selected_mattresses,
          // Enhanced image handling with fallbacks
          image: (() => {
            const urls = (product.product_images || [])
              .map((img: any) => buildUrl(img))
              .filter((u: string | null) => !!u) as string[]
            const main = (product.product_images || [])
              .map((img: any) => ({ img, url: buildUrl(img) }))
              .find((x: any) => x.img.is_main_image && x.url)
            return main?.url || urls[0] || '/mattress-image.svg'
          })(),
          images: (() => {
            const urls = (product.product_images || [])
              .map((img: any) => buildUrl(img))
              .filter((u: string | null) => !!u) as string[]
            return urls.length > 0 ? urls : ['/mattress-image.svg']
          })(),
          variants: product.product_variants?.map((variant: any) => ({
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
            availability: variant.availability
          })) || [],
          features: product.product_features?.map((feature: any) => feature.feature_name) || [],
          reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
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
            length: product.product_dimensions.height,
            width: product.product_dimensions.width,
            mattressSize: product.product_dimensions.mattress_size,
            maxHeight: product.product_dimensions.maximum_height,
            weightCapacity: product.product_dimensions.weight_capacity,
            pocketSprings: product.product_dimensions.pocket_springs,
            comfortLayer: product.product_dimensions.comfort_layer,
            supportLayer: product.product_dimensions.support_layer
          } : null,
          popularCategories: product.product_popular_categories?.map((cat: any) => cat.popular_category_name) || [],
          badges: product.badges || [],
          free_gift_product_id: product.free_gift_product_id || null,
          free_gift_enabled: product.free_gift_enabled || false,
          free_gift_product_name: giftProductDetails?.name || null,
          free_gift_product_image: giftProductDetails?.image || null,
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }
      }) || [])

      console.log(`🔍 Kids Category: Found ${transformedProducts.length} products (page ${page} of ${Math.ceil((totalCount || 0) / limit)})`)
      
      return NextResponse.json({
        products: transformedProducts,
        count: transformedProducts.length,
        totalCount: totalCount || 0,
        page,
        limit,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
        }
      })
    }

    if (category === 'sale') {
      console.log('🔍 Sale Category: Fetching products with show_in_sales_category = true')
      // For sale page, fetch products where show_in_sales_category is true
      const { data: products, error: productsError, count: totalCount } = await supabase
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
          product_popular_categories(*),
          product_dimension_images(*)
        `, { count: 'exact' })
        .eq('show_in_sales_category', true)
        .range(offset, offset + limit - 1)

      if (productsError) {
        console.error('Error fetching sale products:', productsError)
        return NextResponse.json(
          { error: 'Failed to fetch products' },
          { status: 500 }
        )
      }

      // Transform the data to match the expected frontend format
      const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
      const buildUrl = (img: any) => {
        const src = img?.image_url || img?.file_name
        if (!src) return null
        if (typeof src !== 'string') return null
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
        if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
        return null
      }

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
          category: 'sale', // Force category to be 'sale' for display
          rating: product.rating,
          headline: product.headline,
          longDescription: product.long_description,
          firmnessScale: product.firmness_scale,
          supportLevel: product.support_level,
          pressureReliefLevel: product.pressure_relief_level,
          airCirculationLevel: product.air_circulation_level,
          durabilityLevel: product.durability_level,
          showInKidsCategory: product.show_in_kids_category,
          showInSalesCategory: product.show_in_sales_category,
          selectedMattresses: product.selected_mattresses,
          // Enhanced image handling with fallbacks
          image: (() => {
            const urls = (product.product_images || [])
              .map((img: any) => buildUrl(img))
              .filter((u: string | null) => !!u) as string[]
            const main = (product.product_images || [])
              .map((img: any) => ({ img, url: buildUrl(img) }))
              .find((x: any) => x.img.is_main_image && x.url)
            return main?.url || urls[0] || '/mattress-image.svg'
          })(),
          images: (() => {
            const urls = (product.product_images || [])
              .map((img: any) => buildUrl(img))
              .filter((u: string | null) => !!u) as string[]
            return urls.length > 0 ? urls : ['/mattress-image.svg']
          })(),
          variants: product.product_variants?.map((variant: any) => ({
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
            availability: variant.availability
          })) || [],
          features: product.product_features?.map((feature: any) => feature.feature_name) || [],
          reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
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
            mattressSize: product.product_dimensions.mattress_size,
            maxHeight: product.product_dimensions.maximum_height,
            weightCapacity: product.product_dimensions.weight_capacity,
            pocketSprings: product.product_dimensions.pocket_springs,
            comfortLayer: product.product_dimensions.comfort_layer,
            supportLayer: product.product_dimensions.support_layer
          } : null,
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
          badges: product.badges || [],
          free_gift_product_id: product.free_gift_product_id || null,
          free_gift_enabled: product.free_gift_enabled || false,
          free_gift_product_name: giftProductDetails?.name || null,
          free_gift_product_image: giftProductDetails?.image || null,
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }
      }) || [])

      console.log(`🔍 Sale Category: Found ${transformedProducts.length} products (page ${page} of ${Math.ceil((totalCount || 0) / limit)})`)
      
      return NextResponse.json({
        products: transformedProducts,
        count: transformedProducts.length,
        totalCount: totalCount || 0,
        page,
        limit,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
        }
      })
    }

    // For other categories, use the original logic
    // First get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Build the base query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(name, slug),
        product_images(*),
        product_variants(*),
        product_features(*),
        product_reasons_to_love(*),
        product_custom_reasons(*),
        product_description_paragraphs(*),
        product_faqs(*),
        product_warranty_sections(*),
        product_dimensions(*),
        product_popular_categories(*),
        product_dimension_images(*)
      `, { count: 'exact' })
      .eq('category_id', categoryData.id)
      .eq('categories.slug', category)

    // Apply firmness filter
    if (firmness.length > 0) {
      query = query.in('firmness_scale', firmness)
    }

    // Apply features filter
    if (features.length > 0) {
      // For features, we need to check the product_features table
      query = query.or(features.map(feature => `product_features.feature_name.ilike.%${feature}%`).join(','))
    }

    // Apply size filter
    if (size.length > 0) {
      // For size, we need to check the product_variants table
      query = query.or(size.map(s => `product_variants.size.ilike.%${s}%`).join(','))
    }

    // Execute the query with pagination
    const { data: products, error: productsError, count: totalCount } = await query
      .range(offset, offset + limit - 1)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected frontend format
    const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
    const buildUrl = (img: any) => {
      const src = img?.image_url || img?.file_name
      if (!src) return null
      if (typeof src !== 'string') return null
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
      if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
      return null
    }

    // Filter by price range if specified
    let filteredProducts = products || []
    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const variants = product.product_variants || []
        if (variants.length === 0) return false
        
        const prices = variants.map((v: any) => parseFloat(v.current_price) || 0)
        const minVariantPrice = Math.min(...prices)
        const maxVariantPrice = Math.max(...prices)
        
        if (minPrice && minVariantPrice < parseFloat(minPrice)) return false
        if (maxPrice && maxVariantPrice > parseFloat(maxPrice)) return false
        
        return true
      })
    }

    const transformedProducts = await Promise.all(filteredProducts?.map(async (product) => {
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
        category: product.categories.slug,
        rating: product.rating,
        headline: product.headline,
        longDescription: product.long_description,
        firmnessScale: product.firmness_scale,
        supportLevel: product.support_level,
        pressureReliefLevel: product.pressure_relief_level,
        airCirculationLevel: product.air_circulation_level,
        durabilityLevel: product.durability_level,
        showInKidsCategory: product.show_in_kids_category,
        showInSalesCategory: product.show_in_sales_category,
        selectedMattresses: product.selected_mattresses,
        // Enhanced image handling with fallbacks
        image: (() => {
          const urls = (product.product_images || [])
            .map((img: any) => buildUrl(img))
            .filter((u: string | null) => !!u) as string[]
          const main = (product.product_images || [])
            .map((img: any) => ({ img, url: buildUrl(img) }))
            .find((x: any) => x.img.is_main_image && x.url)
          return main?.url || urls[0] || '/mattress-image.svg'
        })(),
        images: (() => {
          const urls = (product.product_images || [])
            .map((img: any) => buildUrl(img))
            .filter((u: string | null) => !!u) as string[]
          return urls.length > 0 ? urls : ['/mattress-image.svg']
        })(),
        variants: product.product_variants?.map((variant: any) => ({
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
          availability: variant.availability
        })) || [],
        features: product.product_features?.map((feature: any) => feature.feature_name) || [],
        reasonsToLove: product.product_reasons_to_love?.map((reason: any) => reason.reason_text) || [],
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
          mattressSize: product.product_dimensions.mattress_size,
          maxHeight: product.product_dimensions.maximum_height,
          weightCapacity: product.product_dimensions.weight_capacity,
          pocketSprings: product.product_dimensions.pocket_springs,
          comfortLayer: product.product_dimensions.comfort_layer,
          supportLayer: product.product_dimensions.support_layer
        } : null,
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
        badges: product.badges || [],
        free_gift_product_id: product.free_gift_product_id || null,
        free_gift_enabled: product.free_gift_enabled || false,
        free_gift_product_name: giftProductDetails?.name || null,
        free_gift_product_image: giftProductDetails?.image || null,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    }) || [])

    console.log(`🔍 Regular Category (${category}): Found ${transformedProducts.length} products (page ${page} of ${Math.ceil((totalCount || 0) / limit)})`)
    
    return NextResponse.json({
      products: transformedProducts,
      count: transformedProducts.length,
      totalCount: totalCount || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount || 0) / limit)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    })

  } catch (error) {
    console.error('Error in category products API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
