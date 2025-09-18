import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/guide-dropdown?limit=4
// Returns the configured guide items for header dropdown
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    // Read configured guide items, ordered by slot_index ASC
    const { data: items, error } = await supabase
      .from('guide_dropdown_items')
      .select('*')
      .eq('is_active', true)
      .order('slot_index', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching guide dropdown items:', error)
      return NextResponse.json({ error: 'Failed to fetch guide items' }, { status: 500 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ guides: [] })
    }

    return NextResponse.json({ guides: items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// PUT /api/guide-dropdown
// Body: { items: Array<{ title: string, description: string, image_url: string, link_url: string, badge_text: string, badge_color: string, rating: number, tags: string[], slot_index: number }> }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Upsert guide items
    const upsertRows = body.items.map((item: any) => ({
      id: item.id || undefined, // Let database generate if not provided
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      link_url: item.link_url,
      badge_text: item.badge_text,
      badge_color: item.badge_color || 'blue',
      rating: item.rating,
      tags: item.tags || [],
      slot_index: Number(item.slot_index) || 0,
      is_active: item.is_active !== false // Default to true
    }))

    const { error: upsertError } = await supabase
      .from('guide_dropdown_items')
      .upsert(upsertRows, { onConflict: 'id' })

    if (upsertError) {
      console.error('Error upserting guide items:', upsertError)
      return NextResponse.json({ error: 'Failed to save guide items' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
