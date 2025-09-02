import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get('day') // yyyy-mm-dd
  let query = supabase.from('orders').select(`
    id, 
    order_number, 
    customer_email, 
    customer_name,
    total_amount, 
    status, 
    created_at,
    tracking_number,
    dispatched_at,
    shipping_address,
    billing_address,
    order_items (
      id, 
      sku, 
      product_name,
      product_size,
      product_color,
      quantity, 
      unit_price,
      total_price
    )
  `)
  if (day) {
    query = query.gte('created_at', `${day} 00:00:00+00`).lte('created_at', `${day} 23:59:59+00`)
  }
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}


