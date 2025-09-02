import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, items, total } = await req.json()
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bedoraliving.com'
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #374151;">New Order Received</h2>
        <p><strong>Order Number:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Total Amount:</strong> £${total.toFixed(2)}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
        
        <h3>Items:</h3>
        <ul>
          ${items.map((item: any) => `
            <li>${item.name}${item.size ? ` (${item.size})` : ''} - Qty: ${item.quantity || 1} - £${item.currentPrice || item.price}</li>
          `).join('')}
        </ul>
        
        <p><strong>Order ID:</strong> ${orderId}</p>
        
        <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 5px;">
          <p style="margin: 0;"><strong>Action Required:</strong></p>
          <p style="margin: 5px 0;">1. Review order details</p>
          <p style="margin: 5px 0;">2. Process and prepare items</p>
          <p style="margin: 5px 0;">3. Update order status when dispatched</p>
        </div>
      </div>
    `

    await sendMail({
      to: adminEmail,
      subject: `New Order Received - ${orderId}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true, message: 'Admin notification email sent' })
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
