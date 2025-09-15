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

    // Note: Order items would need to be created separately
    // This would require storing cart data in session metadata or
    // fetching it from a separate source
    
  } catch (error) {
    console.error('Error processing order from session:', error)
  }
}