import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const random = searchParams.get('random')
    
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        rating,
        headline,
        long_description,
        category_id,
        categories(name, slug),
        product_images(*),
        product_variants(*),
        product_features(*)
      `)
    
    if (random === 'true') {
      // Get random products
      query = query.order('id', { ascending: false }).limit(parseInt(limit || '4'))
    } else {
      // Get all products with limit
      query = query.limit(parseInt(limit || '10'))
    }
    
    const { data: products, error } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
    
    // Transform the data to include calculated prices and features
    const transformedProducts = products?.map(product => {
      // Calculate min prices from variants
      const variants = product.product_variants || []
      const minCurrentPrice = variants.length > 0 ? 
        Math.min(...variants.map((v: any) => Number(v.current_price) || Number(v.original_price) || Infinity)) : 
        0
      const minOriginalPrice = variants.length > 0 ? 
        Math.min(...variants.map((v: any) => Number(v.original_price) || Number(v.current_price) || Infinity)) : 
        0
      
      // Build image URLs
      const fileBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
      const buildUrl = (img: any) => {
        const src = img?.image_url || img?.file_name
        if (!src) return null
        if (typeof src !== 'string') return null
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src
        if (fileBase) return `${fileBase.replace(/\/$/, '')}/${encodeURIComponent(src)}`
        return null
      }
      
      return {
        id: product.id,
        name: product.name,
        rating: product.rating,
        headline: product.headline,
        long_description: product.long_description,
        category: product.categories?.slug,
        categories: product.categories,
        images: (product.product_images || [])
          .map((img: any) => buildUrl(img))
          .filter((u: string | null) => !!u),
        features: product.product_features?.map((feature: any) => feature.feature_name) || [],
        currentPrice: Number.isFinite(minCurrentPrice) ? minCurrentPrice : 0,
        originalPrice: Number.isFinite(minOriginalPrice) ? minOriginalPrice : 0,
        variants: variants
      }
    }) || []
    
    return NextResponse.json({ products: transformedProducts })
    
  } catch (error) {
    console.error('Error in products GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Debug: Log the incoming data
    console.log('Incoming product data:', {
      category: body.category,
      name: body.name,
      firmnessScale: body.firmnessScale,
      supportLevel: body.supportLevel,
      pressureReliefLevel: body.pressureReliefLevel,
      airCirculationLevel: body.airCirculationLevel,
      durabilityLevel: body.durabilityLevel
    })
    
    // Log the validation results
    console.log('Validation results:', {
      firmnessScale: body.firmnessScale,
      validatedFirmness: body.firmnessScale && ['Soft', 'Soft-Medium', 'Medium', 'Medium-Firm', 'Firm', 'Extra-firm'].includes(body.firmnessScale) ? body.firmnessScale : 'INVALID',
      supportLevel: body.supportLevel,
      pressureReliefLevel: body.pressureReliefLevel,
      airCirculationLevel: body.airCirculationLevel,
      durabilityLevel: body.durabilityLevel
    })
    
    // Extract data from the request body
    const {
      category,
      name,
      rating,
      headline,
      longDescription,
      firmnessScale,
      supportLevel,
      pressureReliefLevel,
      airCirculationLevel,
      durabilityLevel,
      isKidsCategory,
      isSalesCategory,
      selectedBunkbedMattresses,
      uploadedFiles,
      images: imageUrls,
      variants,
      selectedFeatures,
      selectedReasonsToLove,
      customReasonsToBuy,
      descriptionParagraphs,
      faqs,
      warrantySections,
      dimensions,
      selectedAttributes,
      popularCategories
    } = body

    // Get category ID from the database
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate comfort level fields to match database constraints
    const validateComfortLevel = (level: string | undefined) => {
      if (!level || level === '') return null;
      // Convert lowercase to proper case and validate
      const normalizedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
      const validLevels = ['Low', 'Medium', 'High'];
      return validLevels.includes(normalizedLevel) ? normalizedLevel : null;
    };

    // Validate firmness scale to match database constraints
    const validateFirmnessScale = (scale: string | undefined) => {
      if (!scale || scale === '') return null;
      // The admin form now sends exact values, just validate they exist
      const validScales = ['Soft', 'Soft-Medium', 'Medium', 'Medium-Firm', 'Firm', 'Extra-firm'];
      return validScales.includes(scale) ? scale : null;
    };

    // Start a transaction by inserting the main product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        category_id: categoryData.id,
        name,
        rating: rating ? parseFloat(rating) : null,
        headline,
        long_description: longDescription || null,
        firmness_scale: validateFirmnessScale(firmnessScale),
        support_level: validateComfortLevel(supportLevel),
        pressure_relief_level: validateComfortLevel(pressureReliefLevel),
        air_circulation_level: validateComfortLevel(airCirculationLevel),
        durability_level: validateComfortLevel(durabilityLevel),
        show_in_kids_category: isKidsCategory || false,
        show_in_sales_category: isSalesCategory || false,
        selected_mattresses: selectedBunkbedMattresses || null
      })
      .select()
      .single()

    if (productError) {
      console.error('Product insertion error:', productError)
      console.error('Product data being inserted:', {
        category_id: categoryData.id,
        name,
        rating: rating ? parseFloat(rating) : null,
        headline,
        long_description: longDescription || null,
        firmness_scale: validateFirmnessScale(firmnessScale),
        support_level: validateComfortLevel(supportLevel),
        pressure_relief_level: validateComfortLevel(pressureReliefLevel),
        air_circulation_level: validateComfortLevel(airCirculationLevel),
        durability_level: validateComfortLevel(durabilityLevel),
        show_in_kids_category: isKidsCategory || false,
        show_in_sales_category: isSalesCategory || false,
        selected_mattresses: selectedBunkbedMattresses || null
      })
      return NextResponse.json(
        { error: `Failed to create product: ${productError.message}` },
        { status: 500 }
      )
    }

    const productId = productData.id

    // Insert product images
    // 1) URL images from admin (imageUrls)
    if (imageUrls && imageUrls.length > 0) {
      const imageUrlRows = imageUrls.map((url: string, index: number) => ({
        product_id: productId,
        image_url: url,
        file_name: null,
        file_size: null,
        file_type: null,
        is_main_image: index === 0, // First URL becomes main if present
        sort_order: index
      }))

      const { error: imageUrlInsertError } = await supabase
        .from('product_images')
        .insert(imageUrlRows)

      if (imageUrlInsertError) {
        console.error('Image URL insertion error:', imageUrlInsertError)
      }
    }

    // 2) No more file metadata insert; images are now uploaded client-side and passed as URLs only

    // Insert product variants
    if (variants && variants.length > 0) {
      try {
        // Debug: log incoming variants payload
        console.log('[Save Product] incoming variants (raw):', Array.isArray(variants) ? variants : [])

        const attr = (selectedAttributes || {}) as {
          useColor?: boolean
          useDepth?: boolean
          useFirmness?: boolean
          useSize?: boolean
        }

        const variantData = (variants as any[]).map((variant: any, index: number) => {
          const row = {
            product_id: productId,
            sku: variant?.sku ?? null,
            original_price: Number.isFinite(parseFloat(variant?.originalPrice)) ? parseFloat(variant.originalPrice) : 0,
            current_price: Number.isFinite(parseFloat(variant?.currentPrice)) ? parseFloat(variant.currentPrice) : 0,
            color: attr.useColor ? (variant?.color ?? null) : null,
            depth: attr.useDepth ? (variant?.depth ?? null) : null,
            firmness: attr.useFirmness ? (variant?.firmness ?? null) : null,
            size: attr.useSize ? (variant?.size ?? null) : null,
            length: variant?.length ?? null,
            width: variant?.width ?? null,
            height: variant?.height ?? null,
            availability: variant?.availability ?? true,
            variant_image: variant?.variant_image ?? null
          }
          // Per-row debug
          console.log(`[Save Product] variant[${index}] mapped row:`, row)
          return row
        })

        // Final debug: mapped payload
        console.log('[Save Product] variants mapped for insert:', variantData)

        const { data: insertedVariants, error: variantError } = await supabase
          .from('product_variants')
          .insert(variantData)
          .select('*')

        if (variantError) {
          console.error('Variant insertion error:', variantError)
          console.error('Variant insertion payload:', variantData)
        } else {
          console.log('[Save Product] variants inserted OK. Count:', insertedVariants?.length || 0)
          try {
            console.log('[Save Product] inserted variants (first 5):', (insertedVariants || []).slice(0, 5))
          } catch {}
        }
      } catch (e) {
        console.error('[Save Product] variants processing error:', e)
        console.error('[Save Product] variants raw payload (on error):', variants)
      }
    } else {
      console.log('[Save Product] no variants provided or empty array; skipping variant insert')
    }

    // Insert product features
    if (selectedFeatures && selectedFeatures.length > 0) {
      const featureData = selectedFeatures.map((feature: string) => ({
        product_id: productId,
        feature_name: feature
      }))

      const { error: featureError } = await supabase
        .from('product_features')
        .insert(featureData)

      if (featureError) {
        console.error('Feature insertion error:', featureError)
      }
    }

    // Insert product reasons to love
    if (selectedReasonsToLove && selectedReasonsToLove.length > 0) {
      const describeLove = (label: string): string | null => {
        const t = (label || '').toLowerCase()
        // Map common default card titles to their original copy
        if (t.includes('eco')) return 'Sustainably made with planet‑friendly materials and processes.'
        if (t.includes('hassle') && t.includes('return')) return 'Change of mind? No problem – returns are quick and easy.'
        if ((t.includes('comfort') && t.includes('stomach')) || t.includes('stomach sleepers')) return 'Balanced feel tailored for stomach sleepers.'
        if ((t.includes('no') && (t.includes('rolling') || t.includes('together'))) || t.includes('no rolling together')) return 'Minimizes motion transfer to keep partners undisturbed.'
        if (t.includes('edge') || t.includes('edge‑to‑edge') || t.includes('edge to edge')) return 'Reinforced edges expand usable surface and prevent roll‑off.'
        if (t.includes('back sleepers')) return 'Optimized firmness and alignment for back sleepers.'
        if (t.includes('hotel') && t.includes('quality')) return 'Experience 5‑star comfort at home with a premium, plush feel.'
        if (t.includes('cool') || t.includes('breath') || t.includes('temperature')) return 'Breathable design helps regulate temperature for a cooler night’s sleep.'
        if (t.includes('durable') || t.includes('long')) return 'Built to last with high‑grade materials and craftsmanship.'
        if (t.includes('couples')) return 'Designed for two with motion isolation and edge-to-edge support.'
        if (t.includes('great') && t.includes('back')) return 'Optimized firmness and alignment for back sleepers.'
        if (t.includes('great') && t.includes('couples')) return 'Designed for two with motion isolation and edge-to-edge support.'
        
        // Mattress-specific features
        if (t.includes('pocket springs') || t.includes('pocket spring')) return 'Individually pocketed springs work to give you support exactly where you need it.'
        if (t.includes('memory foam')) return 'Moulds to your body, giving orthopaedic support and superb comfort.'
        if (t.includes('medium firm') || t.includes('medium')) return 'Good all-rounder for front, side or back sleepers.'
        if (t.includes('quilted tape edge')) return 'Reinforced edges provide maximum support and durability for extended mattress life.'
        if (t.includes('rotate feature') || t.includes('rotate')) return 'Easy rotation design ensures even wear and maintains optimal comfort over time.'
        if (t.includes('recon foam')) return 'High-quality reconstituted foam provides excellent support and pressure relief.'
        if (t.includes('blue foam')) return 'Advanced cooling foam technology regulates temperature for optimal sleep comfort.'
        if (t.includes('coil spring')) return 'Traditional coil spring system provides reliable support and excellent durability.'
        if (t.includes('latex foam')) return 'Natural latex provides hypoallergenic comfort with excellent bounce and support.'
        if (t.includes('reflex foam')) return 'High-density reflex foam offers superior support and pressure point relief.'
        if (t.includes('cool blue foam')) return 'Advanced cooling technology keeps you comfortable throughout the night.'
        if (t.includes('high density memory')) return 'Superior memory foam density ensures long-lasting comfort and support.'
        if (t.includes('3-zone support') || t.includes('3 zone support')) return 'Three distinct support zones provide optimal comfort for head, torso, and legs.'
        if (t.includes('5-zone support') || t.includes('5 zone support')) return 'Five precision-engineered zones deliver customized support for every body part.'
        if (t.includes('7-zone support') || t.includes('7 zone support')) return 'Seven specialized zones provide ultimate comfort and pressure relief.'
        if (t.includes('8-zone support') || t.includes('8 zone support')) return 'Eight precision zones deliver ultimate comfort and pressure relief.'
        if (t.includes('10-zone support') || t.includes('10 zone support')) return 'Ten specialized zones provide maximum comfort and support.'
        if (t.includes('geltech foam')) return 'Revolutionary gel-infused foam technology for superior comfort and cooling.'
        if (t.includes('marble gel')) return 'Premium marble gel provides exceptional cooling and pressure relief.'
        if (t.includes('foam encapsulated')) return 'Foam-encapsulated springs provide superior edge support and durability.'
        if (t.includes('soft firm')) return 'Perfect balance of softness and support for ultimate comfort.'
        if (t.includes('firm')) return 'Firm support for those who prefer a more solid sleeping surface.'
        if (t.includes('waterproof cover')) return 'Waterproof protection keeps your mattress clean and hygienic.'
        if (t.includes('removable cover')) return 'Easy-to-remove cover for simple cleaning and maintenance.'
        if (t.includes('washable cover')) return 'Machine washable cover for easy cleaning and freshness.'
        if (t.includes('double side')) return 'Reversible design offers two different comfort levels in one mattress.'
        if (t.includes('rolled up') || t.includes('roll up')) return 'Compact rolled design for easy transport and storage.'
        if (t.includes('revo vasco foam')) return 'Advanced foam technology for superior comfort and support.'
        
        // Pillow-specific features
        if (t.includes('bounce back')) return 'Returns to shape quickly for consistent comfort.'
        if (t.includes('box support')) return 'Structured support for better neck alignment.'
        if (t.includes('classic moulded')) return 'Moulded construction for consistent shape.'
        if (t.includes('deep sleep')) return 'Designed to help you sleep deeper and longer.'
        if (t.includes('memory flake')) return 'Flake fill adapts to personalize support.'
        if (t.includes('pure luxury')) return 'Indulgent finish and superior materials.'
        if (t.includes('soft touch')) return 'Ultra-soft outer for cozy comfort.'
        if (t.includes('super support')) return 'Firm support to keep posture aligned.'
        if (t.includes('value pillow')) return 'Quality comfort without the premium price.'
        if (t.includes('shredded foam')) return 'Shredded fill for airflow and adjustability.'
        if (t.includes('recon shredded foam') || t.includes('recon shredded')) return 'Supportive blend of recycled foam pieces.'
        if (t.includes('bamboo pillow')) return 'Bamboo cover for breathable softness.'
        if (t.includes('polyester filling')) return 'Soft, durable polyester fiber fill.'
        if (t.includes('next day delivery')) return 'Get it delivered as soon as tomorrow.'
        if (t.includes('box packed')) return 'Neatly packed for safe arrival.'
        if (t.includes('luxury cover')) return 'Elevated look and feel with luxury cover.'
        if (t.includes('hotel vibe')) return 'Experience 5-star comfort at home.'
        
        // Box spring features
        if (t.includes('premium construction')) return 'Built with high-quality materials for lasting durability.'
        if (t.includes('sturdy frame')) return 'Robust construction provides reliable support.'
        if (t.includes('easy assembly')) return 'Simple setup process for quick installation.'
        if (t.includes('multiple sizes')) return 'Available in various dimensions to fit your needs.'
        if (t.includes('modern design')) return 'Contemporary styling that complements any bedroom.'
        if (t.includes('color options')) return 'Multiple color choices to match your decor.'
        if (t.includes('quick setup')) return 'Fast and easy assembly for immediate use.'
        if (t.includes('space efficient')) return 'Compact design maximizes bedroom space.'
        if (t.includes('warranty coverage')) return 'Protected by comprehensive warranty terms.'
        if (t.includes('fast delivery')) return 'Quick shipping to get your order fast.'
        if (t.includes('secure packaging')) return 'Carefully packaged to ensure safe delivery.'
        if (t.includes('professional finish')) return 'High-quality finish for a polished look.'
        if (t.includes('easy maintenance')) return 'Simple care requirements for long-lasting use.'
        if (t.includes('long lasting')) return 'Built to provide years of reliable service.'
        if (t.includes('stable support')) return 'Steady foundation for optimal mattress performance.'
        if (t.includes('anti-slip feet')) return 'Non-slip feet prevent unwanted movement.'
        if (t.includes('adjustable height')) return 'Customizable height for perfect positioning.'
        if (t.includes('premium materials')) return 'High-grade materials ensure quality construction.'
        if (t.includes('comfortable')) return 'Designed for maximum comfort and support.'
        
        return null
      }

      const rowsWithDesc = selectedReasonsToLove.map((item: any) => ({
        product_id: productId,
        reason_text: item.reason || item,
        description: item.description || describeLove(item.reason || item)
      }))

      // Debug: log what we are about to save for reasons_to_love
      try {
        console.log('[Save Product] reasons_to_love (with descriptions):', rowsWithDesc)
      } catch {}

      let reasonError: any = null
      try {
        const { error } = await supabase
          .from('product_reasons_to_love')
          .insert(rowsWithDesc as any)
        reasonError = error
        if (error) throw error
      } catch (e) {
        console.warn('product_reasons_to_love.description missing? Falling back to legacy insert', e)
        const legacy = selectedReasonsToLove.map((item: any) => ({
          product_id: productId,
          reason_text: item.reason || item
        }))
        const { error } = await supabase
        .from('product_reasons_to_love')
          .insert(legacy)
        reasonError = error
      }

      if (reasonError) {
        console.error('Reason insertion error:', reasonError)
      }
    }

    // Insert custom reasons to buy
    if (customReasonsToBuy && customReasonsToBuy.length > 0) {
      const describeReason = (label: string): string | null => {
        const t = (label || '').toLowerCase()
        if (t.includes('edge') && t.includes('support')) return 'Reinforced edges provide maximum support and durability.'
        if (t.includes('eco')) return 'Made with materials and processes that reduce environmental impact.'
        if (t.includes('hassle') && t.includes('return')) return 'Stress‑free returns if it’s not quite right.'
        if (t.includes('adjustable') && t.includes('base')) return 'Works perfectly with adjustable bases for personalized comfort.'
        if (t.includes('warranty')) return 'Backed by our comprehensive warranty for peace of mind.'
        if (t.includes('delivery')) return 'Fast, reliable delivery straight to your door.'
        return null
      }

      const customReasonDataWithDesc = customReasonsToBuy.map((reason: string) => ({
        product_id: productId,
        reason_text: reason,
        description: describeReason(reason)
      }))

      // Debug: log what we are about to save for custom reasons
      try {
        console.log('[Save Product] custom_reasons (with descriptions):', customReasonDataWithDesc)
      } catch {}

      // Try inserting with description column; if the column does not exist, fall back to legacy insert
      let customReasonError: any = null
      try {
        const { error } = await supabase
          .from('product_custom_reasons')
          .insert(customReasonDataWithDesc as any)
        customReasonError = error
        if (error) throw error
      } catch (e) {
        console.warn('product_custom_reasons.description missing? Falling back to legacy insert', e)
        const legacyRows = customReasonsToBuy.map((reason: string) => ({
          product_id: productId,
          reason_text: reason
        }))
        const { error } = await supabase
        .from('product_custom_reasons')
          .insert(legacyRows)
        customReasonError = error
      }

      if (customReasonError) {
        console.error('Custom reason insertion error:', customReasonError)
      }
    }

    // Insert description paragraphs
    if (descriptionParagraphs && descriptionParagraphs.length > 0) {
      const paragraphData = descriptionParagraphs.map((paragraph: any, index: number) => ({
        product_id: productId,
        heading: paragraph.heading,
        content: paragraph.content,
        image_url: paragraph.image || null,
        file_name: paragraph.uploadedFile ? paragraph.uploadedFile.name : null,
        file_size: paragraph.uploadedFile ? paragraph.uploadedFile.size : null,
        file_type: paragraph.uploadedFile ? paragraph.uploadedFile.type : null,
        sort_order: index
      }))

      const { error: paragraphError } = await supabase
        .from('product_description_paragraphs')
        .insert(paragraphData)

      if (paragraphError) {
        console.error('Paragraph insertion error:', paragraphError)
      }
    }

    // Insert FAQs
    if (faqs && faqs.length > 0) {
      const faqData = faqs.map((faq: any, index: number) => ({
        product_id: productId,
        question: faq.question,
        answer: faq.answer,
        sort_order: index
      }))

      const { error: faqError } = await supabase
        .from('product_faqs')
        .insert(faqData)

      if (faqError) {
        console.error('FAQ insertion error:', faqError)
      }
    }

    // Insert warranty sections
    if (warrantySections && warrantySections.length > 0) {
      const warrantyData = warrantySections.map((warranty: any, index: number) => ({
        product_id: productId,
        heading: warranty.heading,
        content: warranty.content,
        sort_order: index
      }))

      const { error: warrantyError } = await supabase
        .from('product_warranty_sections')
        .insert(warrantyData)

      if (warrantyError) {
        console.error('Warranty insertion error:', warrantyError)
      }
    }

    // Insert dimensions
    if (dimensions) {
      const { error: dimensionError } = await supabase
        .from('product_dimensions')
        .insert({
          product_id: productId,
          height: dimensions.height || null,
          length: dimensions.length || null,
          width: dimensions.width || null,
          mattress_size: dimensions.mattressSize || null,
          maximum_height: dimensions.maximumHeight || null,
          weight_capacity: dimensions.weightCapacity || null,
          pocket_springs: dimensions.pocketSprings || null,
          comfort_layer: dimensions.comfortLayer || null,
          support_layer: dimensions.supportLayer || null,
          // Editable headings
          mattress_size_heading: dimensions.mattressSizeHeading || 'Mattress Size',
          maximum_height_heading: dimensions.maximumHeightHeading || 'Maximum Height',
          weight_capacity_heading: dimensions.weightCapacityHeading || 'Weight Capacity',
          pocket_springs_heading: dimensions.pocketSpringsHeading || 'Pocket Springs',
          comfort_layer_heading: dimensions.comfortLayerHeading || 'Comfort Layer',
          support_layer_heading: dimensions.supportLayerHeading || 'Support Layer'
        })

      if (dimensionError) {
        console.error('Dimension insertion error:', dimensionError)
      }
    }

    // Insert dimension images
    if (body.dimensionImages && body.dimensionImages.length > 0) {
      const dimensionImageData = body.dimensionImages.map((img: any, index: number) => ({
        product_id: productId,
        image_url: img.imageUrl || '',
        file_name: img.fileName || '',
        file_size: img.fileSize || 0,
        file_type: img.fileType || '',
        sort_order: index
      }))

      const { error: dimensionImageError } = await supabase
        .from('product_dimension_images')
        .insert(dimensionImageData)

      if (dimensionImageError) {
        console.error('Dimension image insertion error:', dimensionImageError)
      }
    }

    // Insert popular categories
    if (popularCategories && popularCategories.length > 0) {
      const popularCategoryData = popularCategories.map((cat: any, index: number) => ({
        product_id: productId,
        popular_category_name: cat.name,
        filter_key: cat.filterKey || null,
        filter_value: cat.filterValue || null,
        sort_order: index
      }))

      const { error: popularCategoryError } = await supabase
        .from('product_popular_categories')
        .insert(popularCategoryData)

      if (popularCategoryError) {
        console.error('Popular category insertion error:', popularCategoryError)
      }
    }

    // Insert recommended products
    if (body.recommendedProducts && body.recommendedProducts.length > 0) {
      const recommendedProductData = body.recommendedProducts.map((rec: any, index: number) => ({
        product_id: productId,
        recommended_product_id: rec.recommendedProductId,
        category_name: rec.categoryName,
        sort_order: rec.sortOrder || index
      }))

      const { error: recommendedProductError } = await supabase
        .from('product_recommendations')
        .insert(recommendedProductData)

      if (recommendedProductError) {
        console.error('Recommended product insertion error:', recommendedProductError)
      } else {
        console.log('Successfully inserted recommended products:', recommendedProductData)
      }
    }

    return NextResponse.json({
      success: true,
      productId,
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



