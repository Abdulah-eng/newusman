import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendMail } from '@/lib/email'

// Email template functions
function generateConfirmationEmailHtml(orderNumber: string, customer: any, items: any[], total: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 15px 0; }
        .item:last-child { border-bottom: none; }
        .item-name { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 8px; }
        .item-properties { margin: 8px 0; }
        .property { margin: 4px 0; color: #666; }
        .property-label { font-weight: bold; color: #555; }
        .total { font-size: 18px; font-weight: bold; color: #f97316; margin-top: 15px; padding-top: 15px; border-top: 2px solid #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .support-section { background: #e7f3ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f97316; }
        .support-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .support-contact { margin: 8px 0; }
        .support-contact a { color: #f97316; text-decoration: none; }
        .support-contact a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Order #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Dear ${customer.firstName},</p>
          <p>Great news! Your order has been confirmed and we're now processing it.</p>
          <p>We'll notify you as soon as your order is dispatched with tracking information.</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="item">
                <div class="item-name">${item.product_name}</div>
                <div class="item-properties">
                  ${item.product_size ? `<div class="property"><span class="property-label">Size:</span> ${item.product_size}</div>` : ''}
                  ${item.product_color ? `<div class="property"><span class="property-label">Color:</span> ${item.product_color}</div>` : ''}
                  ${item.product_depth ? `<div class="property"><span class="property-label">Depth:</span> ${item.product_depth}</div>` : ''}
                  ${item.product_firmness ? `<div class="property"><span class="property-label">Firmness:</span> ${item.product_firmness}</div>` : ''}
                  ${item.product_length || item.product_width || item.product_height ? `
                    <div class="property"><span class="property-label">Dimensions:</span> 
                      ${item.product_length ? `${item.product_length}` : ''}
                      ${item.product_width ? ` × ${item.product_width}` : ''}
                      ${item.product_height ? ` × ${item.product_height}` : ''}
                    </div>
                  ` : ''}
                  ${item.product_weight ? `<div class="property"><span class="property-label">Weight:</span> ${item.product_weight}</div>` : ''}
                  ${item.product_material ? `<div class="property"><span class="property-label">Material:</span> ${item.product_material}</div>` : ''}
                  ${item.product_brand ? `<div class="property"><span class="property-label">Brand:</span> ${item.product_brand}</div>` : ''}
                  <div class="property"><span class="property-label">Quantity:</span> ${item.quantity} × £${item.unit_price.toFixed(2)}</div>
                </div>
              </div>
            `).join('')}
            <div class="total">Total: £${total.toFixed(2)}</div>
          </div>
          
          <div class="support-section">
            <div class="support-title">Need Help?</div>
            <p>If you have any questions about your order or need assistance, our customer support team is here to help:</p>
            <div class="support-contact">
              <strong>Email:</strong> <a href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>
            </div>
            <div class="support-contact">
              <strong>Phone:</strong> <a href="tel:03301336323">0330 133 6323</a>
            </div>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              Our support team is available Monday to Friday, 9am to 5pm GMT.
            </p>
          </div>
          
          <p>Thank you for choosing Bedora Living!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Bedora Living Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateDispatchEmailHtml(orderNumber: string, customer: any, items: any[], total: number, trackingNumber: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your order has been dispatched</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .tracking { background: #e7f3ff; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #f97316; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; color: #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your order has been dispatched!</h1>
          <p>Order #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Dear ${customer.firstName},</p>
          <p>Great news! Your order has been dispatched and is on its way to you.</p>
          
          <div class="tracking">
            <h3>Tracking Information</h3>
            <div class="tracking-number">${trackingNumber}</div>
            <p>You can use this tracking number to track your package</p>
          </div>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="item">
                <strong>${item.product_name}</strong>
                ${item.product_size ? ` (${item.product_size})` : ''}
                ${item.product_color ? ` - ${item.product_color}` : ''}
                <br>Quantity: ${item.quantity} × £${item.unit_price.toFixed(2)}
              </div>
            `).join('')}
            <div class="total">Total: £${total.toFixed(2)}</div>
          </div>
          
          <p>Thank you for choosing Bedora Living!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Bedora Living Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateDeliveredEmailHtml(orderNumber: string, customer: any, items: any[], total: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your order has been delivered</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; color: #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your order has been delivered!</h1>
          <p>Order #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Dear ${customer.firstName},</p>
          <p>Great news! Your order has been successfully delivered.</p>
          <p>We hope you love your new items from Bedora Living!</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="item">
                <strong>${item.product_name}</strong>
                ${item.product_size ? ` (${item.product_size})` : ''}
                ${item.product_color ? ` - ${item.product_color}` : ''}
                <br>Quantity: ${item.quantity} × £${item.unit_price.toFixed(2)}
              </div>
            `).join('')}
            <div class="total">Total: £${total.toFixed(2)}</div>
          </div>
          
          <p>Thank you for choosing Bedora Living! We hope to serve you again soon.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Bedora Living Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCancelledEmailHtml(orderNumber: string, customer: any, items: any[], total: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Cancelled</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; color: #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Cancelled</h1>
          <p>Order #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Dear ${customer.firstName},</p>
          <p>We're sorry to inform you that your order has been cancelled.</p>
          <p>If you have any questions about this cancellation, please contact our customer service team.</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="item">
                <strong>${item.product_name}</strong>
                ${item.product_size ? ` (${item.product_size})` : ''}
                ${item.product_color ? ` - ${item.product_color}` : ''}
                <br>Quantity: ${item.quantity} × £${item.unit_price.toFixed(2)}
              </div>
            `).join('')}
            <div class="total">Total: £${total.toFixed(2)}</div>
          </div>
          
          <p>We apologize for any inconvenience caused.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Bedora Living Team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, newStatus, trackingNumber } = await req.json()
    
    if (!orderId || !newStatus) {
      return NextResponse.json({ 
        error: 'Order ID and new status are required' 
      }, { status: 400 })
    }

    // Get order details with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 })
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        ...(newStatus === 'dispatched' && trackingNumber && { 
          tracking_number: trackingNumber,
          dispatched_at: new Date().toISOString()
        })
      })
      .eq('id', orderId)

    if (updateError) {
      return NextResponse.json({ 
        error: 'Failed to update order status' 
      }, { status: 500 })
    }

    // Prepare customer info
    const customer = {
      firstName: order.customer_name?.split(' ')[0] || 'Customer',
      lastName: order.customer_name?.split(' ').slice(1).join(' ') || '',
      email: order.customer_email
    }

    // Calculate total
    const total = order.order_items?.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0
    ) || order.total_amount

    // Send appropriate email based on status
    try {
      let emailSubject = ''
      let emailHtml = ''

      switch (newStatus) {
        case 'processing':
          emailSubject = `Order Confirmation - ${order.order_number}`
          emailHtml = generateConfirmationEmailHtml(order.order_number, customer, order.order_items || [], total)
          break
        case 'dispatched':
          if (!trackingNumber) {
            return NextResponse.json({ 
              error: 'Tracking number is required for dispatched status' 
            }, { status: 400 })
          }
          emailSubject = `Your order has been dispatched - ${order.order_number}`
          emailHtml = generateDispatchEmailHtml(order.order_number, customer, order.order_items || [], total, trackingNumber)
          break
        case 'delivered':
          emailSubject = `Your order has been delivered - ${order.order_number}`
          emailHtml = generateDeliveredEmailHtml(order.order_number, customer, order.order_items || [], total)
          break
        case 'cancelled':
          emailSubject = `Order Cancelled - ${order.order_number}`
          emailHtml = generateCancelledEmailHtml(order.order_number, customer, order.order_items || [], total)
          break
        default:
          // No email for other status changes
          return NextResponse.json({ 
            success: true, 
            message: 'Order status updated successfully' 
          })
      }

      await sendMail({
        to: customer.email,
        subject: emailSubject,
        html: emailHtml
      })

      console.log(`Status change email sent for order ${order.order_number} to ${newStatus}`)
    } catch (emailError) {
      console.error('Error sending status change email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully' 
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
