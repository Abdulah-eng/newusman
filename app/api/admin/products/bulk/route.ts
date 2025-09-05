import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

type CsvRow = {
  [key: string]: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rows: CsvRow[] = Array.isArray(body.rows) ? body.rows : []
    if (!rows.length) return NextResponse.json({ error: 'No rows provided' }, { status: 400 })

    let inserted = 0

    for (const row of rows) {
      const name = row.name?.trim()
      if (!name) continue
      const categorySlug = (row.category || 'mattresses').trim().toLowerCase()
      const rating = Number(row.rating || 4.5) || 4.5
      const headline = row.headline || ''
      const longDescription = row.longDescription || ''

      // Get category_id from categories table
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      
      if (categoryError || !categoryData) {
        console.error(`Category not found for slug: ${categorySlug}`, categoryError)
        continue
      }

      const baseInsert = {
        name,
        category_id: categoryData.id,
        rating,
        headline,
        long_description: longDescription,
      } as any
      const extendedInsert = {
        ...baseInsert,
        care_instructions: row.careInstructions || undefined,
        trial_information: row.trialInformation || undefined,
        warranty_delivery_line: row.warrantyDeliveryLine || undefined,
        firmness_scale: row.firmnessScale || undefined,
        support_level: row.supportLevel || undefined,
        pressure_relief_level: row.pressureReliefLevel || undefined,
        air_circulation_level: row.airCirculationLevel || undefined,
        durability_level: row.durabilityLevel || undefined,
      }

      let productInsert: any = null
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(extendedInsert)
          .select('id')
          .single()
        if (error) throw error
        productInsert = data
      } catch (e) {
        // Fallback for legacy schema
        const { data, error } = await supabase
          .from('products')
          .insert(baseInsert)
          .select('id')
          .single()
        if (error) {
          console.error('Product insert error (base fallback failed)', error)
          continue
        }
        productInsert = data
      }

      const productId = productInsert.id

      // Images
      const images = (row.images || '').split('|').map(s => s.trim()).filter(Boolean)
      if (images.length) {
        const mainImageIndex = parseInt(row.mainImageIndex) || 0
        const imageRows = images.map((url, index) => ({ 
          product_id: productId, 
          image_url: url, 
          is_main_image: index === mainImageIndex,
          sort_order: index
        }))
        const { error } = await supabase.from('product_images').insert(imageRows as any)
        if (error) console.error('product_images insert', error)
      }

      // Reasons to buy
      const reasonsToBuy = (row.reasonsToBuy || row.customReasonsToBuy || '').split('|').map(s => s.trim()).filter(Boolean)
      if (reasonsToBuy.length) {
        const reasonRows = reasonsToBuy.map((reason, index) => ({ product_id: productId, reason_text: reason, sort_order: index }))
        try {
          const { error } = await supabase.from('product_custom_reasons').insert(reasonRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = reasonsToBuy.map((reason) => ({ product_id: productId, reason_text: reason }))
          const { error } = await supabase.from('product_custom_reasons').insert(legacyRows as any)
          if (error) console.error('product_custom_reasons legacy insert', error)
        }
      }

      // Product features (checkbox list)
      const features = (row.features || '').split('|').map(s => s.trim()).filter(Boolean)
      if (features.length) {
        const featureRows = features.map((feature) => ({ product_id: productId, feature_name: feature }))
        const { error } = await supabase.from('product_features').insert(featureRows as any)
        if (error) console.error('product_features insert', error)
      }

      // Reasons to love (cards) format: Title:Desc:Smalltext:iconName | Title:Desc
      const loveRaw = (row.reasonsToLove || '').split('|').map(s => s.trim()).filter(Boolean)
      if (loveRaw.length) {
        const loveRows = loveRaw.map((entry, index) => {
          const parts = entry.split(':').map(p => p.trim())
          const [reason, description = '', smalltext = '', icon = 'check'] = parts
          return { product_id: productId, reason_text: reason, description, smalltext, icon, sort_order: index }
        })
        try {
          const { error } = await supabase.from('product_reasons_to_love').insert(loveRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = loveRows.map(({ sort_order, ...rest }) => rest)
          const { error } = await supabase.from('product_reasons_to_love').insert(legacyRows as any)
          if (error) console.error('product_reasons_to_love legacy insert', error)
        }
      }

      // Variants: variants column where each entry is key=value;key=value pairs separated by ';', entries separated by '|'
      // Example entry: size=Double;current=299;original=399;sku=SKU123;color=#000000;availability=true;length=190cm;width=135cm;height=25cm;depth=25cm;firmness=Medium;variantImage=https://img
      const variantsRaw = (row.variants || '').split('|').map(s => s.trim()).filter(Boolean)
      if (variantsRaw.length) {
        for (const entry of variantsRaw) {
          const parts = entry.split(';').map(p => p.trim()).filter(Boolean)
          const kv: Record<string, string> = {}
          for (const p of parts) {
            const eqIndex = p.indexOf('=')
            if (eqIndex === -1) continue
            const key = p.slice(0, eqIndex).trim().toLowerCase()
            const value = p.slice(eqIndex + 1).trim()
            kv[key] = value
          }
                     const original = kv.original ?? kv.original_price ?? row.price
           const current = kv.current ?? kv.current_price ?? row.salePrice ?? row.price
           const availability = typeof kv.availability === 'string' ? kv.availability.toLowerCase() === 'true' : undefined

           const variantInsert: any = {
             product_id: productId,
             sku: kv.sku || null,
             sdi_number: kv.sdi || kv.sdi_number || null,
             original_price: original ? Number(original) : (current ? Number(current) : 0),
             current_price: current ? Number(current) : (original ? Number(original) : 0),
            color: kv.color || null,
            depth: kv.depth || null,
            firmness: kv.firmness || null,
            size: kv.size || null,
            length: kv.length || null,
            width: kv.width || null,
            height: kv.height || null,
            availability: availability === undefined ? true : availability,
          }

          try {
            const { error } = await supabase.from('product_variants').insert(variantInsert as any)
            if (error) throw error
          } catch (e) {
            console.error('product_variants insert', e)
          }

          // Optional: variant image support if column exists
          if (kv.variantimage) {
            try {
              const { data: lastVariant } = await supabase
                .from('product_variants')
                .select('id')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()
              if (lastVariant?.id) {
                const { error } = await supabase.from('product_variants').update({ variant_image: kv.variantimage }).eq('id', lastVariant.id)
                if (error) console.warn('variant_image update failed (column may not exist)', error)
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }

      // Description paragraphs: descriptions column, entries as heading~content~image
      const descriptionsRaw = (row.descriptions || '').split('|').map(s => s.trim()).filter(Boolean)
      if (descriptionsRaw.length) {
        const descRows = descriptionsRaw.map((entry: string, index: number) => {
          const [heading = '', content = '', image = ''] = entry.split('~').map(s => s.trim())
          return { product_id: productId, heading, content, image_url: image, sort_order: index }
        })
        try {
          const { error } = await supabase.from('product_description_paragraphs').insert(descRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = descriptionsRaw.map((entry: string) => {
            const [heading = '', content = '', image = ''] = entry.split('~').map(s => s.trim())
            return { product_id: productId, heading, content, image_url: image }
          })
          const { error } = await supabase.from('product_description_paragraphs').insert(legacyRows as any)
          if (error) console.error('product_description_paragraphs legacy insert', error)
        }
      }

      // FAQs: faqs column, entries as question~answer
      const faqsRaw = (row.faqs || '').split('|').map(s => s.trim()).filter(Boolean)
      if (faqsRaw.length) {
        const faqRows = faqsRaw.map((entry: string, index: number) => {
          const [question = '', answer = ''] = entry.split('~').map(s => s.trim())
          return { product_id: productId, question, answer, sort_order: index }
        })
        try {
          const { error } = await supabase.from('product_faqs').insert(faqRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = faqsRaw.map((entry: string) => {
            const [question = '', answer = ''] = entry.split('~').map(s => s.trim())
            return { product_id: productId, question, answer }
          })
          const { error } = await supabase.from('product_faqs').insert(legacyRows as any)
          if (error) console.error('product_faqs legacy insert', error)
        }
      }

      // Warranty sections: warrantySections column, entries as title~content
      const warrantyRaw = (row.warrantySections || '').split('|').map(s => s.trim()).filter(Boolean)
      if (warrantyRaw.length) {
        const warrantyRows = warrantyRaw.map((entry: string, index: number) => {
          const [title = '', content = ''] = entry.split('~').map(s => s.trim())
          return { product_id: productId, title, content, sort_order: index }
        })
        try {
          const { error } = await supabase.from('product_warranty_sections').insert(warrantyRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = warrantyRaw.map((entry: string) => {
            const [title = '', content = ''] = entry.split('~').map(s => s.trim())
            return { product_id: productId, title, content }
          })
          const { error } = await supabase.from('product_warranty_sections').insert(legacyRows as any)
          if (error) console.error('product_warranty_sections legacy insert', error)
        }
      }

      // Important notices: notices column, entries as title~content
      const noticesRaw = (row.notices || '').split('|').map(s => s.trim()).filter(Boolean)
      if (noticesRaw.length) {
        const noticeRows = noticesRaw.map((entry: string, index: number) => {
          const [title = '', content = ''] = entry.split('~').map(s => s.trim())
          return { product_id: productId, title, content, sort_order: index }
        })
        try {
          const { error } = await supabase.from('product_important_notices').insert(noticeRows as any)
          if (error) throw error
        } catch (e) {
          const legacyRows = noticesRaw.map((entry: string) => {
            const [title = '', content = ''] = entry.split('~').map(s => s.trim())
            return { product_id: productId, title, content }
          })
          const { error } = await supabase.from('product_important_notices').insert(legacyRows as any)
          if (error) console.error('product_important_notices legacy insert', error)
        }
      }

      // Badges: badges column pipe-separated sale|new_in|free_gift
      const badgesRaw = (row.badges || '').split('|').map(s => s.trim()).filter(Boolean)
      if (badgesRaw.length) {
        const badges = [
          { type: 'sale', enabled: badgesRaw.includes('sale') },
          { type: 'new_in', enabled: badgesRaw.includes('new_in') },
          { type: 'free_gift', enabled: badgesRaw.includes('free_gift') },
        ]
        const { error } = await supabase.from('products').update({ badges }).eq('id', productId)
        if (error) console.error('products badges update', error)
      }

      // Dimensions: either separate columns or combined
      const hasAnyDimension = ['height','length','width','mattressSize','maxHeight','weightCapacity','pocketSprings','comfortLayer','supportLayer','dimensionDisclaimer','showBasicDimensions','showMattressSpecs','showTechnicalSpecs']
        .some(k => row[k])
      if (hasAnyDimension) {
        const dimRow: any = {
          product_id: productId,
          height: row.height || null,
          length: row.length || null,
          width: row.width || null,
          mattress_size: row.mattressSize || null,
          max_height: row.maxHeight || null,
          weight_capacity: row.weightCapacity || null,
          pocket_springs: row.pocketSprings || null,
          comfort_layer: row.comfortLayer || null,
          support_layer: row.supportLayer || null,
          dimension_disclaimer: row.dimensionDisclaimer || null,
          show_basic_dimensions: row.showBasicDimensions ? row.showBasicDimensions.toLowerCase() === 'true' : null,
          show_mattress_specs: row.showMattressSpecs ? row.showMattressSpecs.toLowerCase() === 'true' : null,
          show_technical_specs: row.showTechnicalSpecs ? row.showTechnicalSpecs.toLowerCase() === 'true' : null,
        }
        // drop nulls to avoid column errors on older schemas
        Object.keys(dimRow).forEach((k) => { if (dimRow[k] === null) delete dimRow[k] })
        const { error } = await supabase.from('product_dimensions').insert(dimRow as any)
        if (error) console.error('product_dimensions insert', error)
      }

      // Popular categories (by name, map later in UI/API if needed)
      const popular = (row.popularCategories || '').split('|').map(s => s.trim()).filter(Boolean)
      if (popular.length) {
        const rowsToInsert = popular.map((name: string, index: number) => ({
          product_id: productId,
          popular_category_name: name,
          sort_order: index
        }))
        try {
          const { error } = await supabase.from('product_popular_categories').insert(rowsToInsert as any)
          if (error) throw error
        } catch (e) {
          const legacy = popular.map((name: string) => ({ product_id: productId, popular_category_name: name }))
          const { error } = await supabase.from('product_popular_categories').insert(legacy as any)
          if (error) console.error('product_popular_categories legacy insert', error)
        }
      }

      inserted += 1
    }

    return NextResponse.json({ inserted })
  } catch (err: any) {
    console.error('Bulk upload error', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}


