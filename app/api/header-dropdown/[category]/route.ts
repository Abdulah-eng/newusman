import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/header-dropdown/[category]?limit=4
// Returns the configured products for a given header category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    // Read configured items, ordered by slot_index ASC
    const { data: items, error } = await supabase
      .from('header_dropdown_items')
      .select('product_id, slot_index, custom_image, discount_percentage, discount_price')
      .eq('category_slug', category)
      .order('slot_index', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching header dropdown items:', error)
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const productIds = items.map(i => i.product_id)

    // Fetch product details for the selected items
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        categories(slug),
        product_images(image_url),
        product_variants(current_price, original_price)
      `)
      .in('id', productIds)

    if (prodError) {
      console.error('Error fetching products:', prodError)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Keep original slot order and include custom fields
    const normalized = (products || []).map((p: any) => {
      const variants = Array.isArray(p.product_variants) ? p.product_variants : []
      const minCurrent = variants.length > 0 ? Math.min(...variants.map((v: any) => parseFloat(v.current_price) || Infinity)) : null
      const item = items.find(i => i.product_id === p.id)
      return {
        id: p.id,
        name: p.name,
        current_price: Number.isFinite(minCurrent) ? minCurrent : null,
        category_slug: p.categories?.slug || null,
        product_images: p.product_images || [],
        custom_image: item?.custom_image || null,
        discount_percentage: item?.discount_percentage || null,
        discount_price: item?.discount_price || null
      }
    })

    const productById = new Map(normalized.map((p: any) => [p.id, p]))
    const ordered = items
      .map(i => productById.get(i.product_id))
      .filter(Boolean)

    return NextResponse.json({ products: ordered })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// PUT /api/header-dropdown/[category]
// Body: { items: Array<{ product_id: string, slot_index: number }> }
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = await params
    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Upsert items for the category
    const upsertRows = body.items.map((it: any) => ({
      category_slug: category,
      slot_index: Number(it.slot_index) || 0,
      product_id: it.product_id,
      custom_image: it.custom_image || null,
      discount_percentage: it.discount_percentage || null,
      discount_price: it.discount_price || null
    }))

    const { error: upsertError } = await supabase
      .from('header_dropdown_items')
      .upsert(upsertRows, { onConflict: 'category_slug,slot_index' })

    if (upsertError) {
      console.error('Error upserting dropdown items:', upsertError)
      return NextResponse.json({ error: 'Failed to save items' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


