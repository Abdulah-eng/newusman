import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendMail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  await supabase.from('orders').update({ status: 'dispatched' }).eq('id', orderId)
  if (order.customer_email) {
    try {
      await sendMail({ to: order.customer_email, subject: 'Your order has been dispatched', html: `<p>Your order ${order.order_number || order.id} has been dispatched.</p>` })
    } catch {}
  }
  return NextResponse.json({ ok: true })
}



