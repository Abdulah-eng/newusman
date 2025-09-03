import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendMail } from '@/lib/email'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    // Webhook now handles all order processing in both development and production
    // Frontend order processing has been removed to prevent duplicates
    
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Webhook event received:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('Processing completed checkout session:', session.id)
      
      // Extract customer and order information from metadata
      const customerEmail = session.customer_email || session.metadata?.customerEmail
      const customerName = session.metadata?.customerName || 'Unknown'
      const customerPhone = session.metadata?.customerPhone || ''
      const customerAddress = session.metadata?.customerAddress || ''
      const customerCity = session.metadata?.customerCity || ''
      const customerPostcode = session.metadata?.customerPostcode || ''
      const customerCountry = session.metadata?.customerCountry || ''
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : []
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0
      
      if (!customerEmail) {
        console.error('No customer email found in session')
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }

      // Prevent duplicate order creation for same session
      const { data: existingOrder, error: existingError } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .limit(1)
        .maybeSingle()

      if (!existingError && existingOrder) {
        return NextResponse.json({ received: true })
      }

      // Create order in database with full customer information
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer_email: customerEmail,
        customer_name: customerName,
        total_amount: totalAmount,
        status: 'pending',
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent as string,
        shipping_address: `${customerAddress}, ${customerCity}, ${customerPostcode}`,
        billing_address: `${customerAddress}, ${customerCity}, ${customerPostcode}`
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }

      // Create order items with full product information
      if (items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          sku: item.variantSku || item.id, // Use variant SKU if available, fallback to product ID
          product_name: item.name || 'Product',
          product_size: item.size || null,
          product_color: item.color || null, // Use color from item
          quantity: item.quantity || 1,
          unit_price: Number(item.price || 0),
          total_price: Number((item.price || 0) * (item.quantity || 1))
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) {
          console.error('Error creating order items:', itemsError)
        }
      }

      // Send confirmation email to customer
      try {
        await sendMail({
          to: customerEmail,
          subject: 'Order Confirmation - Bedora Living',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
              </div>
              
              <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #374151; margin-bottom: 20px;">Order Details</h2>
                <p><strong>Order Number:</strong> ${orderData.order_number}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
                <p><strong>Total Amount:</strong> £${totalAmount.toFixed(2)}</p>
                
                <h3 style="color: #374151; margin: 20px 0 10px 0;">Items Ordered:</h3>
                <ul style="list-style: none; padding: 0;">
                  ${items.map((item: any) => `
                    <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong>${item.name}</strong>
                      ${item.size ? ` - ${item.size}` : ''}
                      <br>Quantity: ${item.quantity || 1}
                    </li>
                  `).join('')}
                </ul>
                
                <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #f97316;">
                  <h3 style="color: #374151; margin: 0 0 15px 0;">What Happens Next?</h3>
                  <p style="margin: 5px 0;">✅ Your order has been received and confirmed</p>
                  <p style="margin: 5px 0;">📦 We'll process and dispatch your order within 3-5 business days</p>
                  <p style="margin: 5px 0;">📧 You'll receive tracking information once dispatched</p>
                  <p style="margin: 5px 0;">🛏️ Enjoy your 100-night trial and 10-year warranty</p>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                  <p style="color: #6b7280; font-size: 14px;">
                    If you have any questions, please contact us at support@bedoraliving.com
                  </p>
                </div>
              </div>
            </div>
          `,
        })
        console.log('Customer confirmation email sent successfully')
      } catch (emailError) {
        console.error('Error sending customer confirmation email:', emailError)
      }

      // Send notification email to admin
      if (process.env.ADMIN_EMAIL) {
        try {
          await sendMail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Order Received - ${orderData.order_number}`,
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #374151;">New Order Received</h2>
                <p><strong>Order Number:</strong> ${orderData.order_number}</p>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Total Amount:</strong> £${totalAmount.toFixed(2)}</p>
                <p><strong>Stripe Session:</strong> ${session.id}</p>
                <p><strong>Payment Intent:</strong> ${session.payment_intent}</p>
                
                <h3>Items:</h3>
                <ul>
                  ${items.map((item: any) => `
                    <li>${item.name}${item.size ? ` (${item.size})` : ''} - Qty: ${item.quantity || 1}</li>
                  `).join('')}
                </ul>
                
                <p><strong>Order ID:</strong> ${order.id}</p>
              </div>
            `,
          })
          console.log('Admin notification email sent successfully')
        } catch (adminEmailError) {
          console.error('Error sending admin notification email:', adminEmailError)
        }
      }

      console.log('Order processed successfully:', order.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
