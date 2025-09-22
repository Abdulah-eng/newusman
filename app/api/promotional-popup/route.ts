import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY) as string
  if (!url || !serviceKey) {
    return null as any
  }
  return createClient(url, serviceKey)
}

export async function GET() {
  try {
    // prefer service client, but fall back to anon for read
    const service = getServerSupabase()
    const client = service || createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
    const { data, error } = await client
      .from('promotional_popup_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // ignore no rows
      console.error('GET /api/promotional-popup error:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Fallback defaults if table empty
    const defaults = {
      enabled: true,
      title: 'FIRST TIMER?',
      subtitle: '20% OFF',
      description: '& FREE SHIPPING ON YOUR FIRST ORDER.',
      button_text: 'GET THE OFFER',
      show_delay_ms: 3000,
    }

    return NextResponse.json({ success: true, settings: data || defaults })
  } catch (e) {
    console.error('GET /api/promotional-popup exception:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to your env and restart the server.' }, { status: 500 })
    }
    const body = await request.json()
    const payload = {
      enabled: body.enabled ?? true,
      title: body.title ?? null,
      subtitle: body.subtitle ?? null,
      description: body.description ?? null,
      button_text: body.button_text ?? null,
      show_delay_ms: typeof body.show_delay_ms === 'number' ? body.show_delay_ms : 3000,
      updated_at: new Date().toISOString(),
    }

    // Ensure single-row semantics: fetch existing, update by id, else insert
    const existing = await supabase
      .from('promotional_popup_settings')
      .select('id')
      .limit(1)
      .single()

    let data: any = null
    let error: any = null

    if (existing.data && existing.data.id) {
      const upd = await supabase
        .from('promotional_popup_settings')
        .update(payload)
        .eq('id', existing.data.id)
        .select('*')
        .single()
      data = upd.data
      error = upd.error
    } else {
      const ins = await supabase
        .from('promotional_popup_settings')
        .insert(payload)
        .select('*')
        .single()
      data = ins.data
      error = ins.error
    }

    if (error) {
      console.error('PUT /api/promotional-popup error:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true, settings: data })
  } catch (e) {
    console.error('PUT /api/promotional-popup exception:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


