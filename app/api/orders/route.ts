import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const stripeSessionId = searchParams.get('stripe_session_id')
    
    let query = supabase
      .from('orders')
      .select(`
        *,
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
    
    if (email) {
      query = query.eq('customer_email', email)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (stripeSessionId) {
      query = query.eq('stripe_session_id', stripeSessionId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      orders: data || [] 
    })
    
  } catch (error: any) {
    console.error('Error in orders API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orderData, items } = await req.json()
    
    if (!orderData || !items) {
      return NextResponse.json({ 
        error: 'Order data and items are required' 
      }, { status: 400 })
    }
    
    // Log incoming items with SKU details
    try {
      console.log('[Orders POST] Incoming items SKU details:', items.map((it: any) => ({
        id: it?.id,
        variantSku: it?.variantSku,
        name: it?.name,
        size: it?.size,
        color: it?.color,
      })))
    } catch {}
    
    // Check for duplicate orders by stripe_session_id
    if (orderData.stripe_session_id) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', orderData.stripe_session_id)
        .single()

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          orderId: existingOrder.id,
          message: 'Order already exists'
        })
      }
    }
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id, order_number')
      .single()
    
    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ 
        error: orderError.message 
      }, { status: 500 })
    }
    
    // Create order items
    if (items.length > 0) {
      const orderItems = items.map((item: any) => {
        const resolvedSku = item?.variantSku || item?.sku || item?.id
        console.log('[Orders POST] Resolved SKU for item:', { name: item?.name, variantSku: item?.variantSku, fallbackSku: item?.id, resolvedSku })
        return ({
          order_id: order.id,
          sku: resolvedSku,
          product_name: item.name,
          product_size: item.size || null,
          product_color: item.color || null,
          quantity: item.quantity || 1,
          unit_price: Number(item.currentPrice || item.price || 0),
          total_price: Number((item.currentPrice || item.price || 0) * (item.quantity || 1))
        })
      })
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        // Don't fail the entire request if items fail
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number,
      message: 'Order created successfully' 
    })
    
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}