import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'
import { sendMail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' })
  const sig = req.headers.get('stripe-signature') as string
  const buf = await req.arrayBuffer()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const customerEmail = session.customer_details?.email || (session.customer_email as string)
    const customerName = session.customer_details?.name || ''
    const shipping = session.shipping_details ? JSON.parse(JSON.stringify(session.shipping_details)) : null
    const billing = session.customer_details ? JSON.parse(JSON.stringify(session.customer_details)) : null

    // Parse items metadata (we stored minimal info in /checkout)
    let metaItems: Array<{ id: string; size?: string; quantity?: number; sku?: string; unit_price?: number }> = []
    try {
      const raw = (session.metadata?.items as string) || '[]'
      metaItems = JSON.parse(raw)
    } catch {}

    // Fallback: try to infer SKUs from line items' metadata (if present)
    const items = metaItems.map((m, i) => ({
      sku: (lineItems.data[i] as any)?.price?.product_metadata?.sku || m.sku || '',
      quantity: m.quantity || (lineItems.data[i]?.quantity ?? 1),
      unit_price: Number(((lineItems.data[i]?.amount_total ?? 0) / (lineItems.data[i]?.quantity ?? 1)) / 100)
    }))

    const total = Number((session.amount_total ?? 0) / 100)

    // Create order row
    const orderInsert = await supabase
      .from('orders')
      .insert({
        order_number: session.id.replace('cs_', ''),
        stripe_session_id: session.id,
        customer_name: customerName,
        customer_email: customerEmail,
        shipping_address: shipping,
        billing_address: billing,
        total_amount: total,
        status: 'pending'
      })
      .select('id')
      .single()

    if (!orderInsert.data) {
      console.error('Error inserting order', orderInsert.error)
      return NextResponse.json({ received: true })
    }

    const orderId = orderInsert.data.id
    if (items.length > 0) {
      await supabase.from('order_items').insert(
        items.map(it => ({ order_id: orderId, sku: it.sku || 'UNKNOWN', quantity: it.quantity || 1, unit_price: it.unit_price || 0 }))
      )
    }

    // Send confirmation email to customer
    if (customerEmail) {
      try {
        await sendMail({
          to: customerEmail,
          subject: 'Thanks for your order',
          html: `<p>Thanks for your order!</p><p>Order no: ${session.id.replace('cs_', '')}</p>`
        })
      } catch (e) { console.error('Email to customer failed', e) }
    }
  }

  return NextResponse.json({ received: true })
}
