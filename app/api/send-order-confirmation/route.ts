import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, items, total } = await req.json()
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Order Details</h2>
          <p><strong>Order Number:</strong> ${orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
          <p><strong>Total Amount:</strong> £${total.toFixed(2)}</p>
          
          <h3 style="color: #374151; margin: 20px 0 10px 0;">Items Ordered:</h3>
          <ul style="list-style: none; padding: 0;">
            ${items.map((item: any) => `
              <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <strong>${item.name}</strong>
                ${item.size ? ` - ${item.size}` : ''}
                <br>Quantity: ${item.quantity || 1}
                <br>Price: £${item.currentPrice || item.price}
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
    `

    await sendMail({
      to: customerEmail,
      subject: 'Order Confirmation - Bedora Living',
      html: emailHtml,
    })

    return NextResponse.json({ success: true, message: 'Order confirmation email sent' })
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
