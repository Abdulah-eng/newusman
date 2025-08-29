import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/variants?productId=...  -> list variants for a product
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const productId = searchParams.get('productId')

		if (!productId) {
			return NextResponse.json({ error: 'productId is required' }, { status: 400 })
		}

		const { data, error } = await supabase
			.from('product_variants')
			.select('*')
			.eq('product_id', productId)
			.order('created_at', { ascending: true })

		if (error) {
			console.error('[Variants GET] Error:', error)
			return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 })
		}

		return NextResponse.json({ variants: data || [] })
	} catch (error) {
		console.error('[Variants GET] Unexpected error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// POST /api/variants -> create a variant
// Body: { productId: string, sku?: string, originalPrice: number, currentPrice: number, color?: string, depth?: string, firmness?: string, size?: string }
export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const {
			productId,
			sku,
			originalPrice,
			currentPrice,
			color,
			depth,
			firmness,
			size,
			variantImage
		} = body || {}

		if (!productId) {
			return NextResponse.json({ error: 'productId is required' }, { status: 400 })
		}

		const { data, error } = await supabase
			.from('product_variants')
			.insert({
				product_id: productId,
				sku: sku || null,
				original_price: originalPrice != null ? Number(originalPrice) : 0,
				current_price: currentPrice != null ? Number(currentPrice) : 0,
				color: color || null,
				depth: depth || null,
				firmness: firmness || null,
				size: size || null,
				variant_image: variantImage || null
			})
			.select()
			.single()

		if (error) {
			console.error('[Variants POST] Error:', error)
			return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 })
		}

		return NextResponse.json({ variant: data })
	} catch (error) {
		console.error('[Variants POST] Unexpected error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PUT /api/variants -> update a variant
// Body: { variantId: string, sku?, originalPrice?, currentPrice?, color?, depth?, firmness?, size?, variantImage? }
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json()
		const {
			variantId,
			sku,
			originalPrice,
			currentPrice,
			color,
			depth,
			firmness,
			size,
			variantImage
		} = body || {}

		if (!variantId) {
			return NextResponse.json({ error: 'variantId is required' }, { status: 400 })
		}

		const update: Record<string, any> = {}
		if (sku !== undefined) update.sku = sku
		if (originalPrice !== undefined) update.original_price = Number(originalPrice)
		if (currentPrice !== undefined) update.current_price = Number(currentPrice)
		if (color !== undefined) update.color = color
		if (depth !== undefined) update.depth = depth
		if (firmness !== undefined) update.firmness = firmness
		if (size !== undefined) update.size = size
		if (variantImage !== undefined) update.variant_image = variantImage

		const { data, error } = await supabase
			.from('product_variants')
			.update(update)
			.eq('id', variantId)
			.select()
			.single()

		if (error) {
			console.error('[Variants PUT] Error:', error)
			return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 })
		}

		return NextResponse.json({ variant: data })
	} catch (error) {
		console.error('[Variants PUT] Unexpected error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// DELETE /api/variants?variantId=...
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const variantId = searchParams.get('variantId')
		if (!variantId) {
			return NextResponse.json({ error: 'variantId is required' }, { status: 400 })
		}

		const { error } = await supabase
			.from('product_variants')
			.delete()
			.eq('id', variantId)

		if (error) {
			console.error('[Variants DELETE] Error:', error)
			return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[Variants DELETE] Unexpected error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
