import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Get the latest order with its items
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_email,
        total_amount,
        status,
        created_at,
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
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      orders: orders || [],
      message: 'Latest order data retrieved'
    })
  } catch (error: any) {
    console.error('Error in debug orders API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}
