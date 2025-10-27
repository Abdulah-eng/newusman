import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { items, customer, deliveryOption } = await req.json()
    
    console.log('Checkout request received:', { 
      itemCount: items?.length, 
      customerEmail: customer?.email,
      deliveryOption 
    })

    // Log incoming items SKU details
    try {
      console.log('[Checkout POST] Incoming items SKU details:', items?.map((it: any) => ({
        id: it?.id,
        variantSku: it?.variantSku,
        sku: it?.sku,
        name: it?.name,
        size: it?.size,
        color: it?.color,
      })))
    } catch {}
    
    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'No items in cart' 
      }, { status: 400 })
    }

    if (!customer || !customer.email) {
      return NextResponse.json({ 
        error: 'Customer email is required' 
      }, { status: 400 })
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const price = Number(item.currentPrice || item.price || 0)
      
      if (isNaN(price) || price <= 0) {
        return NextResponse.json({ 
          error: `Item ${i + 1} has invalid price` 
        }, { status: 400 })
      }
      
      if (!item.name || item.name.trim() === '') {
        return NextResponse.json({ 
          error: `Item ${i + 1} is missing name` 
        }, { status: 400 })
      }
      
      if (!item.id) {
        return NextResponse.json({ 
          error: `Item ${i + 1} is missing ID` 
        }, { status: 400 })
      }
    }

    // Calculate delivery cost
    const deliveryCost = deliveryOption === 'express' ? 15 : 0
    
    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const price = Number(item.currentPrice || item.price || 0)
      
      return {
        price_data: {
          currency: 'gbp',
          product_data: { 
            name: `${item.name}${item.size ? ` (${item.size})` : ''}`,
            description: item.brand || 'Premium Quality',
            metadata: {
              sku: item.variantSku || item.sku || item.id,
              size: item.size || '',
              color: item.color || '',
              depth: item.depth || '',
              firmness: item.firmness || '',
              length: item.length || '',
              width: item.width || '',
              height: item.height || '',
              weight: item.weight || '',
              material: item.material || '',
              brand: item.brand || ''
            }
          },
          unit_amount: Math.round(price * 100), // Convert to pence
        },
        quantity: item.quantity || 1,
      }
    })

    // Add delivery as a line item if express
    if (deliveryCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Express Delivery',
            description: '1-2 business days'
          },
          unit_amount: Math.round(deliveryCost * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customer.email,
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA'],
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
        customerCountry: customer.country || 'GB',
        deliveryOption: deliveryOption || 'standard',
        itemCount: items.length.toString(),
        totalAmount: items.reduce((sum: number, item: any) => 
          sum + ((item.currentPrice || item.price || 0) * (item.quantity || 1)), 0
        ).toString(),
        // Store minimal item info (avoiding JSON truncation issues)
        firstItemName: items[0]?.name?.substring(0, 50) || 'Product'
      },
    })

    console.log('Stripe session created:', session.id)

    return NextResponse.json({ 
      id: session.id, 
      url: session.url 
    })
    
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ 
      error: error.message || 'Checkout failed' 
    }, { status: 500 })
  }
}