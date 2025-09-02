import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    // Test 1: Check orders table structure
    console.log('Testing orders table...')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('Orders table error:', ordersError)
      return NextResponse.json({ 
        error: 'Orders table issue', 
        details: ordersError.message,
        code: ordersError.code 
      }, { status: 500 })
    }

    // Test 2: Check order_items table structure
    console.log('Testing order_items table...')
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1)
    
    if (itemsError) {
      console.error('Order items table error:', itemsError)
      return NextResponse.json({ 
        error: 'Order items table issue', 
        details: itemsError.message,
        code: itemsError.code 
      }, { status: 500 })
    }

    // Test 3: Try to fetch orders with items
    console.log('Testing orders with items...')
    const { data: fullOrdersData, error: fullOrdersError } = await supabase
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
          quantity, 
          unit_price
        )
      `)
      .limit(1)
    
    if (fullOrdersError) {
      console.error('Full orders query error:', fullOrdersError)
      return NextResponse.json({ 
        error: 'Full orders query issue', 
        details: fullOrdersError.message,
        code: fullOrdersError.code 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema test completed',
      ordersTable: {
        sampleData: ordersData,
        columns: ordersData && ordersData.length > 0 ? Object.keys(ordersData[0]) : []
      },
      orderItemsTable: {
        sampleData: itemsData,
        columns: itemsData && itemsData.length > 0 ? Object.keys(itemsData[0]) : []
      },
      fullQuery: {
        sampleData: fullOrdersData,
        success: !fullOrdersError
      }
    })

  } catch (error) {
    console.error('Schema test error:', error)
    return NextResponse.json({ 
      error: 'Schema test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
