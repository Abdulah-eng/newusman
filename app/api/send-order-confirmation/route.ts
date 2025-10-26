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
              <li style="padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 8px;">${item.name}</div>
                <div style="margin: 8px 0;">
                  ${item.size ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Size:</span> ${item.size}</div>` : ''}
                  ${item.color ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Color:</span> ${item.color}</div>` : ''}
                  ${item.depth ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Depth:</span> ${item.depth}</div>` : ''}
                  ${item.firmness ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Firmness:</span> ${item.firmness}</div>` : ''}
                  ${item.length || item.width || item.height ? `
                    <div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Dimensions:</span> 
                      ${item.length ? `${item.length}` : ''}
                      ${item.width ? ` × ${item.width}` : ''}
                      ${item.height ? ` × ${item.height}` : ''}
                    </div>
                  ` : ''}
                  ${item.weight ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Weight:</span> ${item.weight}</div>` : ''}
                  ${item.material ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Material:</span> ${item.material}</div>` : ''}
                  ${item.brand ? `<div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Brand:</span> ${item.brand}</div>` : ''}
                  <div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Quantity:</span> ${item.quantity || 1}</div>
                  <div style="margin: 4px 0; color: #666;"><span style="font-weight: bold; color: #555;">Price:</span> £${item.currentPrice || item.price}</div>
                </div>
              </li>
            `).join('')}
          </ul>
          
          <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #f97316;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">What Happens Next?</h3>
            <p style="margin: 5px 0;">✅ Your order has been received and confirmed</p>
            <p style="margin: 5px 0;">📦 We'll process and dispatch your order within 3-5 business days</p>
            <p style="margin: 5px 0;">📧 You'll receive tracking information once dispatched</p>
            <p style="margin: 5px 0;">🛏️ Enjoy your 14-night trial and 10-year warranty</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-radius: 8px; border-left: 4px solid #f97316;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
            <p style="margin: 5px 0; color: #374151;">If you have any questions about your order or need assistance, our customer support team is here to help:</p>
            <div style="margin: 10px 0;">
              <strong style="color: #374151;">Email:</strong> <a href="mailto:hello@bedoraliving.co.uk" style="color: #f97316; text-decoration: none;">hello@bedoraliving.co.uk</a>
            </div>
            <div style="margin: 10px 0;">
              <strong style="color: #374151;">Phone:</strong> <a href="tel:03301336323" style="color: #f97316; text-decoration: none;">0330 133 6323</a>
            </div>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              Our support team is available Monday to Friday, 9am to 5pm GMT.
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
