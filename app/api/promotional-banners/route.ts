import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/promotional-banners
// Returns all active promotional banners
export async function GET(request: NextRequest) {
  try {
    const { data: banners, error } = await supabase
      .from('promotional_banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching promotional banners:', error)
      return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
    }

    return NextResponse.json({ banners: banners || [] })
  } catch (error) {
    console.error('Error in promotional banners API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/promotional-banners
// Updates promotional banners
export async function PUT(request: NextRequest) {
  try {
    const { banners } = await request.json()

    if (!Array.isArray(banners)) {
      return NextResponse.json({ error: 'Invalid banners data' }, { status: 400 })
    }

    // Update each banner
    for (const banner of banners) {
      const { id, ...updateData } = banner
      
      // Check if this is a temporary ID (starts with 'temp-')
      if (id.startsWith('temp-')) {
        // Create new banner
        const { error } = await supabase
          .from('promotional_banners')
          .insert({
            ...updateData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error creating banner:', error)
          return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
        }
      } else {
        // Update existing banner
        const { error } = await supabase
          .from('promotional_banners')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (error) {
          console.error('Error updating banner:', error)
          return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in promotional banners update API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
