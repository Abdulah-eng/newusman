import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('Checkout session completed:', session.id)
        
        // Process the order
        await processOrderFromSession(session)
        break
        
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 })
  }
}

async function processOrderFromSession(session: Stripe.Checkout.Session) {
  try {
    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single()

    if (existingOrder) {
      console.log('Order already exists for session:', session.id)
      return
    }

    // Get customer details from session metadata
    const customerEmail = session.customer_email || session.metadata?.customerEmail
    const customerName = session.metadata?.customerName || 'Unknown Customer'
    const customerPhone = session.metadata?.customerPhone || ''
    const customerAddress = session.metadata?.customerAddress || ''
    const customerCity = session.metadata?.customerCity || ''
    const customerPostcode = session.metadata?.customerPostcode || ''
    const customerCountry = session.metadata?.customerCountry || 'GB'
    const deliveryOption = session.metadata?.deliveryOption || 'standard'

    if (!customerEmail) {
      console.error('No customer email found in session:', session.id)
      return
    }

    // Calculate totals
    const totalAmount = session.amount_total ? session.amount_total / 100 : 0

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: `ORD-${Date.now()}`,
        stripe_session_id: session.id,
        customer_name: customerName,
        customer_email: customerEmail,
        shipping_address: {
          address: customerAddress,
          city: customerCity,
          postcode: customerPostcode,
          country: customerCountry
        },
        billing_address: {
          address: customerAddress,
          city: customerCity,
          postcode: customerPostcode,
          country: customerCountry
        },
        total_amount: totalAmount,
        status: 'completed'
      })
      .select('id, order_number')
      .single()

    if (orderError) {
      console.error('Error creating order from webhook:', orderError)
      return
    }

    console.log('Order created from webhook:', order.id)

    // Retrieve line items from Stripe session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    })
    
    console.log('Retrieved line items from Stripe:', lineItems.data.length)
    console.log('Line items details:', JSON.stringify(lineItems.data, null, 2))
    
    // Create order items from Stripe line items
    if (lineItems.data.length > 0) {
      const orderItems = lineItems.data.map((item, index) => {
        // Extract product name from description
        const productName = item.description || item.price?.product?.name || `Product ${index + 1}`
        const unitPrice = item.price?.unit_amount ? item.price.unit_amount / 100 : 0
        const quantity = item.quantity || 1
        
        // Try to extract variant info from product metadata
        const product = item.price?.product as any
        const sku = product?.metadata?.sku || item.price?.id || `SKU-${index + 1}`
        
        console.log(`Processing line item ${index + 1}:`, {
          productName,
          sku,
          unitPrice,
          quantity,
          productMetadata: product?.metadata
        })
        
        return {
          order_id: order.id,
          sku: sku,
          product_name: productName,
          product_size: product?.metadata?.size || null,
          product_color: product?.metadata?.color || null,
          product_depth: product?.metadata?.depth || null,
          product_firmness: product?.metadata?.firmness || null,
          product_length: product?.metadata?.length || null,
          product_width: product?.metadata?.width || null,
          product_height: product?.metadata?.height || null,
          product_weight: product?.metadata?.weight || null,
          product_material: product?.metadata?.material || null,
          product_brand: product?.metadata?.brand || null,
          quantity: quantity,
          unit_price: unitPrice,
          total_price: unitPrice * quantity
        }
      })
      
      console.log('Creating order items:', orderItems.length)
      console.log('Order items details:', JSON.stringify(orderItems, null, 2))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) {
        console.error('Error creating order items from webhook:', itemsError)
        console.error('Order items that failed:', JSON.stringify(orderItems, null, 2))
      } else {
        console.log('Successfully created', orderItems.length, 'order items')
      }
    } else {
      console.log('No line items found in Stripe session')
    }
    
  } catch (error) {
    console.error('Error processing order from session:', error)
  }
}