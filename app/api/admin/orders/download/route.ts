import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'csv' // 'csv' or 'pdf'
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0] // Default to today

    // Get today's orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, 
        order_number, 
        customer_email, 
        customer_name,
        total_amount, 
        status, 
        created_at,
        tracking_number,
        dispatched_at,
        shipping_address,
        billing_address,
        order_items (
          id, 
          sku, 
          product_name,
          product_size,
          product_color,
          quantity, 
          unit_price,
          total_price
        )
      `)
      .gte('created_at', `${date} 00:00:00+00`)
      .lte('created_at', `${date} 23:59:59+00`)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Handle empty orders - still generate file with headers
    if (!orders || orders.length === 0) {
      if (format === 'csv') {
        return generateEmptyCSV(date)
      } else if (format === 'pdf') {
        return generateEmptyPDF(date)
      }
    }

    if (format === 'csv') {
      return generateCSV(orders, date)
    } else if (format === 'pdf') {
      return generatePDF(orders, date)
    } else {
      return NextResponse.json({ error: 'Invalid format. Use csv or pdf' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error generating download:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateCSV(orders: any[], date: string) {
  const headers = [
    'Order Number',
    'Customer Email',
    'Customer Name',
    'Total Amount',
    'Status',
    'Created At',
    'Tracking Number',
    'Dispatched At',
    'Shipping Address',
    'Billing Address',
    'Items Count',
    'Items Details'
  ]

  const csvData = orders.map(order => {
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? order.shipping_address 
      : order.shipping_address?.address 
        ? `${order.shipping_address.address}, ${order.shipping_address.city || ''}, ${order.shipping_address.postcode || ''}, ${order.shipping_address.country || ''}`
        : ''

    const billingAddress = typeof order.billing_address === 'string' 
      ? order.billing_address 
      : order.billing_address?.address 
        ? `${order.billing_address.address}, ${order.billing_address.city || ''}, ${order.billing_address.postcode || ''}, ${order.billing_address.country || ''}`
        : ''

    const itemsDetails = order.order_items?.map((item: any) => 
      `${item.product_name} (${item.sku}) - Qty: ${item.quantity} - £${item.unit_price}`
    ).join('; ') || ''

    return [
      order.order_number || order.id.slice(0, 8),
      order.customer_email || '',
      order.customer_name || '',
      order.total_amount || 0,
      order.status || '',
      new Date(order.created_at).toLocaleString(),
      order.tracking_number || '',
      order.dispatched_at ? new Date(order.dispatched_at).toLocaleString() : '',
      shippingAddress,
      billingAddress,
      order.order_items?.length || 0,
      itemsDetails
    ]
  })

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const filename = `orders_${date}.csv`
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}

function generateEmptyCSV(date: string) {
  const headers = [
    'Order Number',
    'Customer Email',
    'Customer Name',
    'Total Amount',
    'Status',
    'Created At',
    'Tracking Number',
    'Dispatched At',
    'Shipping Address',
    'Billing Address',
    'Items Count',
    'Items Details'
  ]

  const csvContent = headers.join(',') + '\n'
  const filename = `orders_${date}.csv`
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}

function generateEmptyPDF(date: string) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(`Orders Report - ${date}`, 14, 22)
  
  // Add summary
  doc.setFontSize(12)
  doc.text(`Total Orders: 0`, 14, 35)
  doc.text(`Total Amount: £0.00`, 14, 42)
  
  // Add message
  doc.setFontSize(14)
  doc.text('No orders found for this date.', 14, 60)
  
  const filename = `orders_${date}.pdf`
  const pdfBuffer = doc.output('arraybuffer')
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}

function generatePDF(orders: any[], date: string) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(`Orders Report - ${date}`, 14, 22)
  
  // Add summary
  doc.setFontSize(12)
  doc.text(`Total Orders: ${orders.length}`, 14, 35)
  
  const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  doc.text(`Total Amount: £${totalAmount.toFixed(2)}`, 14, 42)
  
  // Prepare table data
  const tableData = orders.map(order => {
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? order.shipping_address 
      : order.shipping_address?.address 
        ? `${order.shipping_address.address}, ${order.shipping_address.city || ''}`
        : ''

    return [
      order.order_number || order.id.slice(0, 8),
      order.customer_email || '',
      order.customer_name || '',
      `£${order.total_amount?.toFixed(2) || '0.00'}`,
      order.status || '',
      new Date(order.created_at).toLocaleDateString(),
      order.tracking_number || 'N/A',
      order.order_items?.length || 0
    ]
  })

  // Add table
  doc.autoTable({
    startY: 50,
    head: [['Order #', 'Email', 'Name', 'Amount', 'Status', 'Date', 'Tracking', 'Items']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 50 }
  })

  // Add items details for each order
  let yPosition = (doc as any).lastAutoTable.finalY + 20
  
  orders.forEach((order, index) => {
    if (yPosition > 280) {
      doc.addPage()
      yPosition = 20
    }
    
    doc.setFontSize(10)
    doc.text(`Order ${order.order_number || order.id.slice(0, 8)} - Items:`, 14, yPosition)
    yPosition += 8
    
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach((item: any) => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(8)
        const itemText = `${item.product_name} (${item.sku}) - Qty: ${item.quantity} - £${item.unit_price}`
        doc.text(itemText, 20, yPosition)
        yPosition += 6
      })
    } else {
      doc.setFontSize(8)
      doc.text('No items found', 20, yPosition)
      yPosition += 6
    }
    
    yPosition += 10
  })

  const filename = `orders_${date}.pdf`
  const pdfBuffer = doc.output('arraybuffer')
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}
