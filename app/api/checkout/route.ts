import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendMail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = await req.json()
    
    console.log('Checkout request received:', { items, customer })
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!customer || !customer.email) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    // Validate items before processing
    items.forEach((item: any, index: number) => {
      const price = Number(item.currentPrice || item.price || 0)
      if (isNaN(price) || price <= 0) {
        throw new Error(`Item ${index + 1} (${item.name}) has invalid price: ${item.currentPrice || item.price}`)
      }
      if (!item.name) {
        throw new Error(`Item ${index + 1} is missing name`)
      }
    })

    const lineItems = items.map((item: any) => {
      // Ensure we have a valid price
      const price = Number(item.currentPrice || item.price || 0)
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`)
      }
      
      return {
        price_data: {
          currency: 'gbp',
          product_data: { 
            name: `${item.name} (${item.size || 'Standard'})`,
            description: item.brand || 'Premium Quality'
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customer.email,
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?canceled=1`,
      metadata: {
        customerEmail: customer.email,
        customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        customerPhone: customer.phone || '',
        customerAddress: customer.address || '',
        customerCity: customer.city || '',
        customerPostcode: customer.postcode || '',
        customerCountry: customer.country || '',
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.currentPrice || item.price,
          variantSku: item.variantSku || item.sku || null
        })))
      },
    })

    // Note: Order processing and emails will be handled by the frontend after successful payment
    // This ensures we only process successful payments, not abandoned checkouts

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Checkout error' }, { status: 500 })
  }
}



