import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendMail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = await req.json()
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (!customer || !customer.email) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: { 
          name: `${item.name} (${item.size || 'Standard'})`,
          description: item.brand || 'Premium Quality'
        },
        unit_amount: Math.round(Number(item.currentPrice || item.price) * 100),
      },
      quantity: item.quantity || 1,
    }))

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
        customerName: customer.name || '',
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity
        })))
      },
    })

    // Notify admin of new order intent (optional pre-payment)
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendMail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New order started',
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h3>New Order Started</h3>
              <p><strong>Customer:</strong> ${customer.name || 'Unknown'}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Items:</strong> ${items.length} item(s)</p>
              <p><strong>Checkout Session:</strong> ${session.id}</p>
              <p><strong>Total:</strong> £${(items.reduce((sum: number, item: any) => sum + (Number(item.currentPrice || item.price) * (item.quantity || 1)), 0)).toFixed(2)}</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError)
        // Don't fail checkout if admin email fails
      }
    }

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Checkout error' }, { status: 500 })
  }
}



