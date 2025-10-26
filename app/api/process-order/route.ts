import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendMail } from '@/lib/email'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

// Email template functions
function generateThanksEmailHtml(orderNumber: string, customer: any, items: any[], total: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your order</title>
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
          <h1>Thank you for your order!</h1>
          <p>Order #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Dear ${customer.firstName},</p>
          <p>Thank you for placing your order with Bedora Living! We've received your order and are processing it.</p>
          <p><strong>You will receive a confirmation email shortly once we begin processing your order.</strong></p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="item">
                <div class="item-name">${item.name}</div>
                <div class="item-properties">
                  ${item.size ? `<div class="property"><span class="property-label">Size:</span> ${item.size}</div>` : ''}
                  ${item.color ? `<div class="property"><span class="property-label">Color:</span> ${item.color}</div>` : ''}
                  ${item.depth ? `<div class="property"><span class="property-label">Depth:</span> ${item.depth}</div>` : ''}
                  ${item.firmness ? `<div class="property"><span class="property-label">Firmness:</span> ${item.firmness}</div>` : ''}
                  ${item.length || item.width || item.height ? `
                    <div class="property"><span class="property-label">Dimensions:</span> 
                      ${item.length ? `${item.length}` : ''}
                      ${item.width ? ` × ${item.width}` : ''}
                      ${item.height ? ` × ${item.height}` : ''}
                    </div>
                  ` : ''}
                  ${item.weight ? `<div class="property"><span class="property-label">Weight:</span> ${item.weight}</div>` : ''}
                  ${item.material ? `<div class="property"><span class="property-label">Material:</span> ${item.material}</div>` : ''}
                  ${item.brand ? `<div class="property"><span class="property-label">Brand:</span> ${item.brand}</div>` : ''}
                  <div class="property"><span class="property-label">Quantity:</span> ${item.quantity} × £${(item.currentPrice || item.price || 0).toFixed(2)}</div>
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
                <div class="item-name">${item.name}</div>
                <div class="item-properties">
                  ${item.size ? `<div class="property"><span class="property-label">Size:</span> ${item.size}</div>` : ''}
                  ${item.color ? `<div class="property"><span class="property-label">Color:</span> ${item.color}</div>` : ''}
                  ${item.depth ? `<div class="property"><span class="property-label">Depth:</span> ${item.depth}</div>` : ''}
                  ${item.firmness ? `<div class="property"><span class="property-label">Firmness:</span> ${item.firmness}</div>` : ''}
                  ${item.length || item.width || item.height ? `
                    <div class="property"><span class="property-label">Dimensions:</span> 
                      ${item.length ? `${item.length}` : ''}
                      ${item.width ? ` × ${item.width}` : ''}
                      ${item.height ? ` × ${item.height}` : ''}
                    </div>
                  ` : ''}
                  ${item.weight ? `<div class="property"><span class="property-label">Weight:</span> ${item.weight}</div>` : ''}
                  ${item.material ? `<div class="property"><span class="property-label">Material:</span> ${item.material}</div>` : ''}
                  ${item.brand ? `<div class="property"><span class="property-label">Brand:</span> ${item.brand}</div>` : ''}
                  <div class="property"><span class="property-label">Quantity:</span> ${item.quantity} × £${(item.currentPrice || item.price || 0).toFixed(2)}</div>
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
                <div class="item-name">${item.name}</div>
                <div class="item-properties">
                  ${item.size ? `<div class="property"><span class="property-label">Size:</span> ${item.size}</div>` : ''}
                  ${item.color ? `<div class="property"><span class="property-label">Color:</span> ${item.color}</div>` : ''}
                  ${item.depth ? `<div class="property"><span class="property-label">Depth:</span> ${item.depth}</div>` : ''}
                  ${item.firmness ? `<div class="property"><span class="property-label">Firmness:</span> ${item.firmness}</div>` : ''}
                  ${item.length || item.width || item.height ? `
                    <div class="property"><span class="property-label">Dimensions:</span> 
                      ${item.length ? `${item.length}` : ''}
                      ${item.width ? ` × ${item.width}` : ''}
                      ${item.height ? ` × ${item.height}` : ''}
                    </div>
                  ` : ''}
                  ${item.weight ? `<div class="property"><span class="property-label">Weight:</span> ${item.weight}</div>` : ''}
                  ${item.material ? `<div class="property"><span class="property-label">Material:</span> ${item.material}</div>` : ''}
                  ${item.brand ? `<div class="property"><span class="property-label">Brand:</span> ${item.brand}</div>` : ''}
                  <div class="property"><span class="property-label">Quantity:</span> ${item.quantity} × £${(item.currentPrice || item.price || 0).toFixed(2)}</div>
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
                <strong>${item.name}</strong>
                ${item.size ? ` (${item.size})` : ''}
                ${item.color ? ` - ${item.color}` : ''}
                <br>Quantity: ${item.quantity} × £${(item.currentPrice || item.price || 0).toFixed(2)}
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
                <strong>${item.name}</strong>
                ${item.size ? ` (${item.size})` : ''}
                ${item.color ? ` - ${item.color}` : ''}
                <br>Quantity: ${item.quantity} × £${(item.currentPrice || item.price || 0).toFixed(2)}
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
    const { sessionId, customerInfo, items, deliveryOption } = await req.json()
    
    console.log('Processing order:', { sessionId, customerEmail: customerInfo?.email })
    
    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Use provided data first, fallback to Stripe session if needed
    let finalCustomerInfo = customerInfo
    let finalItems = items
    let finalDeliveryOption = deliveryOption

    // If we don't have customer info or items, try to get from Stripe session
    if ((!finalCustomerInfo || !finalCustomerInfo.email) || (!finalItems || finalItems.length === 0)) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        
        if (!session) {
          return NextResponse.json({ 
            error: 'Stripe session not found' 
          }, { status: 404 })
        }

        // Only use Stripe data if we don't have it already
        if (!finalCustomerInfo || !finalCustomerInfo.email) {
          finalCustomerInfo = {
            firstName: session.metadata?.customerName?.split(' ')[0] || 'Unknown',
            lastName: session.metadata?.customerName?.split(' ').slice(1).join(' ') || 'Customer',
            email: session.customer_email || session.metadata?.customerEmail || '',
            phone: session.metadata?.customerPhone || '',
            address: session.metadata?.customerAddress || '',
            city: session.metadata?.customerCity || '',
            postcode: session.metadata?.customerPostcode || '',
            country: session.metadata?.customerCountry || 'GB'
          }
        }

        if (!finalDeliveryOption) {
          finalDeliveryOption = session.metadata?.deliveryOption || 'standard'
        }

        // Only use Stripe items if we don't have them already
        if (!finalItems || finalItems.length === 0) {
          // Create fallback items from available metadata
          const itemCount = parseInt(session.metadata?.itemCount || '1')
          const firstItemName = session.metadata?.firstItemName || 'Product'
          
          finalItems = [{
            id: 'unknown',
            name: firstItemName,
            currentPrice: 0,
            quantity: itemCount,
            size: '',
            color: '',
            variantSku: ''
          }]
          console.log('Using fallback items from Stripe metadata:', finalItems)
        }

        console.log('Retrieved customer info from Stripe session:', finalCustomerInfo)
      } catch (stripeError) {
        console.error('Error retrieving Stripe session:', stripeError)
        return NextResponse.json({ 
          error: 'Failed to retrieve customer information from Stripe' 
        }, { status: 500 })
      }
    }

    if (!finalCustomerInfo.email) {
      return NextResponse.json({ 
        error: 'Customer email is required' 
      }, { status: 400 })
    }

    if (!finalItems || finalItems.length === 0) {
      return NextResponse.json({ 
        error: 'Items are required' 
      }, { status: 400 })
    }

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single()

    if (existingOrder) {
      console.log('Order already exists:', existingOrder.id)
      return NextResponse.json({ 
        success: true, 
        orderId: existingOrder.id,
        message: 'Order already exists' 
      })
    }

    // Calculate totals
    const subtotal = finalItems.reduce((sum: number, item: any) => 
      sum + ((item.currentPrice || item.price || 0) * (item.quantity || 1)), 0
    )
    const deliveryCost = finalDeliveryOption === 'express' ? 15 : 0
    const total = subtotal + deliveryCost

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: `ORD-${Date.now()}`,
        stripe_session_id: sessionId,
        customer_name: `${finalCustomerInfo.firstName} ${finalCustomerInfo.lastName}`.trim(),
        customer_email: finalCustomerInfo.email,
        shipping_address: {
          address: finalCustomerInfo.address,
          city: finalCustomerInfo.city,
          postcode: finalCustomerInfo.postcode,
          country: finalCustomerInfo.country || 'GB'
        },
        billing_address: {
          address: finalCustomerInfo.address,
          city: finalCustomerInfo.city,
          postcode: finalCustomerInfo.postcode,
          country: finalCustomerInfo.country || 'GB'
        },
        total_amount: total,
        status: 'completed'
      })
      .select('id, order_number')
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ 
        error: 'Failed to create order' 
      }, { status: 500 })
    }

    // Create order items
    const orderItems = finalItems.map((item: any) => {
      const orderItem = {
        order_id: order.id,
        sku: item.variantSku || item.id, // Use variant SKU if available, otherwise fall back to product ID
        product_name: item.name,
        product_size: item.size || null,
        product_color: item.color || null,
        product_depth: item.depth || null,
        product_firmness: item.firmness || null,
        product_length: item.length || null,
        product_width: item.width || null,
        product_height: item.height || null,
        product_weight: item.weight || null,
        product_material: item.material || null,
        product_brand: item.brand || null,
        quantity: item.quantity || 1,
        unit_price: Number(item.currentPrice || item.price || 0),
        total_price: Number((item.currentPrice || item.price || 0) * (item.quantity || 1))
      }
      
      // Debug: Log what's being stored in order items
      console.log('ProcessOrder - Creating order item:', {
        productId: item.id,
        productName: item.name,
        size: item.size,
        color: item.color,
        depth: item.depth,
        firmness: item.firmness,
        dimensions: { length: item.length, width: item.width, height: item.height },
        variantSku: item.variantSku,
        finalSku: orderItem.sku,
        item: item
      })
      
      return orderItem
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Don't fail the entire request if items fail
    }

    // Send thanks email to customer
    try {
      await sendMail({
        to: finalCustomerInfo.email,
        subject: `Thank you for your order - ${order.order_number}`,
        html: generateThanksEmailHtml(order.order_number, finalCustomerInfo, finalItems, total)
      })
      console.log('Customer thanks email sent successfully')
    } catch (emailError) {
      console.error('Error sending customer thanks email:', emailError)
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@bedoraliving.com'
      await sendMail({
        to: adminEmail,
        subject: `New Order - ${order.order_number}`,
        html: `
          <h2>New Order Received</h2>
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Customer:</strong> ${finalCustomerInfo.firstName} ${finalCustomerInfo.lastName}</p>
          <p><strong>Email:</strong> ${finalCustomerInfo.email}</p>
          <p><strong>Total:</strong> £${total.toFixed(2)}</p>
          <p><strong>Items:</strong> ${finalItems.length} items</p>
        `
      })
      console.log('Admin notification email sent successfully')
    } catch (emailError) {
      console.error('Error sending admin email:', emailError)
      // Don't fail the request if email fails
    }

    console.log('Order processed successfully:', order.id)

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number,
      message: 'Order processed successfully' 
    })
    
  } catch (error: any) {
    console.error('Order processing error:', error)
    return NextResponse.json({ 
      error: error.message || 'Order processing failed' 
    }, { status: 500 })
  }
}


