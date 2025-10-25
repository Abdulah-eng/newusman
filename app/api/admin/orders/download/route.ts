import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get current user from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Special bypass for mabdulaharshad@gmail.com
    if (user.email === 'mabdulaharshad@gmail.com') {
      console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com in download API')
      // Allow access without checking managers table
    } else {
      // Check if user is admin in managers table
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('role')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (managerError || !manager || manager.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      format: req.url.includes('format=') ? new URL(req.url).searchParams.get('format') : 'unknown',
      date: req.url.includes('date=') ? new URL(req.url).searchParams.get('date') : 'unknown'
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
  try {
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
  try {
    (doc as any).autoTable({
      startY: 50,
      head: [['Order #', 'Email', 'Name', 'Amount', 'Status', 'Date', 'Tracking', 'Items']],
      body: tableData,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Order #
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 30 }, // Name
        3: { cellWidth: 20 }, // Amount
        4: { cellWidth: 25 }, // Status
        5: { cellWidth: 25 }, // Date
        6: { cellWidth: 20 }, // Tracking
        7: { cellWidth: 15 }  // Items
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 8
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50, left: 14, right: 14 }
    })
  } catch (autoTableError) {
    console.warn('AutoTable not available, using manual table generation:', autoTableError)
    // Fallback to manual table generation
    let yPos = 50
    doc.setFontSize(8)
    
    // Add headers with proper column widths (matching autoTable layout)
    doc.setFillColor(41, 128, 185)
    doc.rect(14, yPos, 180, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('Order #', 16, yPos + 5)
    doc.text('Email', 44, yPos + 5)
    doc.text('Name', 87, yPos + 5)
    doc.text('Amount', 120, yPos + 5)
    doc.text('Status', 143, yPos + 5)
    doc.text('Date', 171, yPos + 5)
    yPos += 10
    
    // Add data rows with proper column positioning
    doc.setTextColor(0, 0, 0)
    tableData.forEach((row, index) => {
      if (yPos > 280) {
        doc.addPage()
        yPos = 20
      }
      
      const fillColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255]
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2])
      doc.rect(14, yPos, 180, 8, 'F')
      
      // Truncate long text to fit columns with proper spacing
      const orderNum = row[0].length > 10 ? row[0].substring(0, 10) + '...' : row[0]
      const email = row[1].length > 18 ? row[1].substring(0, 18) + '...' : row[1]
      const name = row[2].length > 12 ? row[2].substring(0, 12) + '...' : row[2]
      
      doc.text(orderNum, 16, yPos + 5)
      doc.text(email, 44, yPos + 5)
      doc.text(name, 87, yPos + 5)
      doc.text(row[3], 120, yPos + 5)
      doc.text(row[4], 143, yPos + 5)
      doc.text(row[5], 171, yPos + 5)
      yPos += 8
    })
  }

  // Add items details for each order
  let yPosition = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : 100
  
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
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
