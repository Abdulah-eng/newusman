import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendMail } from '@/lib/email'

export async function PUT(req: NextRequest) {
  try {
    const { orderId, trackingNumber } = await req.json()
    
    if (!orderId || !trackingNumber) {
      return NextResponse.json({ error: 'Order ID and tracking number are required' }, { status: 400 })
    }

    // Update order status and add tracking number
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'dispatched',
        tracking_number: trackingNumber,
        dispatched_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Get order items for email
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
    }

    // Send dispatch notification email to customer
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Order Dispatched!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your order is on its way</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-bottom: 20px;">Dispatch Details</h2>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Tracking Number:</strong> <span style="background: #fef3c7; padding: 5px 10px; border-radius: 4px; font-weight: bold;">${trackingNumber}</span></p>
            <p><strong>Dispatch Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
            
            <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">What's Next?</h3>
              <p style="margin: 5px 0;">📦 Your order has been packed and dispatched</p>
              <p style="margin: 5px 0;">🚚 It's now in transit to your address</p>
              <p style="margin: 5px 0;">📱 You can track your delivery using the tracking number above</p>
              <p style="margin: 5px 0;">🏠 Delivery will be made to your specified address</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border: 1px solid #0ea5e9;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">Delivery Instructions</h3>
              <p style="margin: 5px 0; color: #0c4a6e;">• Please ensure someone is available to receive the delivery</p>
              <p style="margin: 5px 0; color: #0c4a6e;">• If no one is available, a delivery card will be left</p>
              <p style="margin: 5px 0; color: #0c4a6e;">• You can rearrange delivery by contacting the courier</p>
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
        to: order.customer_email,
        subject: `Order Dispatched - ${order.order_number}`,
        html: emailHtml,
      })

      console.log('Dispatch notification email sent successfully')
    } catch (emailError) {
      console.error('Error sending dispatch notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order dispatched successfully',
      trackingNumber,
      order: order
    })
  } catch (error) {
    console.error('Error dispatching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



