import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test database connection and orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5)
    
    if (ordersError) {
      return NextResponse.json({ 
        error: 'Orders table error', 
        details: ordersError.message,
        hint: 'Make sure the database schema has been run'
      }, { status: 500 })
    }
    
    // Test order_items table
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(5)
    
    if (itemsError) {
      return NextResponse.json({ 
        error: 'Order items table error', 
        details: itemsError.message,
        hint: 'Make sure the database schema has been run'
      }, { status: 500 })
    }
    
    // Test creating a sample order (for testing purposes)
    const sampleOrder = {
      order_number: `TEST-${Date.now()}`,
      customer_email: 'test@example.com',
      customer_name: 'Test Customer',
      total_amount: 99.99,
      status: 'pending'
    }
    
    const { data: createdOrder, error: createError } = await supabase
      .from('orders')
      .insert(sampleOrder)
      .select('*')
      .single()
    
    let createResult = 'Failed'
    if (createdOrder && !createError) {
      createResult = 'Success'
      // Clean up test order
      await supabase.from('orders').delete().eq('id', createdOrder.id)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Orders system test completed',
      database: {
        ordersTable: 'OK',
        orderItemsTable: 'OK',
        orderCreation: createResult
      },
      counts: {
        totalOrders: orders?.length || 0,
        totalOrderItems: orderItems?.length || 0
      },
      sampleOrders: orders || [],
      sampleOrderItems: orderItems || [],
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        stripeKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
        stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'
      }
    })
  } catch (error) {
    console.error('Error in test-orders API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
