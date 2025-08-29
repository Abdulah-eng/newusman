import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test if product_dimension_images table exists and has data
    const { data: dimensionImages, error: dimError } = await supabase
      .from('product_dimension_images')
      .select('*')
      .limit(10)

    if (dimError) {
      console.error('Error fetching dimension images:', dimError)
      return NextResponse.json({ 
        error: 'Failed to fetch dimension images', 
        details: dimError.message,
        tableExists: false
      }, { status: 500 })
    }

    // Test if products table has dimension images
    const { data: productsWithImages, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        product_dimension_images(*)
      `)
      .limit(5)

    if (prodError) {
      console.error('Error fetching products with dimension images:', prodError)
      return NextResponse.json({ 
        error: 'Failed to fetch products with dimension images', 
        details: prodError.message
      }, { status: 500 })
    }

    // Test specific product ID from the URL if provided
    const url = new URL('http://localhost' + (NextRequest.url || ''))
    const testProductId = url.searchParams.get('productId')
    
    let specificProductData = null
    if (testProductId) {
      const { data: specificProduct, error: specificError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          product_dimension_images(*),
          product_dimensions(*)
        `)
        .eq('id', testProductId)
        .single()

      if (!specificError && specificProduct) {
        specificProductData = {
          id: specificProduct.id,
          name: specificProduct.name,
          dimensionImagesCount: specificProduct.product_dimension_images?.length || 0,
          dimensionImages: specificProduct.product_dimension_images || [],
          hasDimensions: !!specificProduct.product_dimensions,
          dimensions: specificProduct.product_dimensions || null
        }
      }
    }

    return NextResponse.json({
      success: true,
      tableExists: true,
      dimensionImagesCount: dimensionImages?.length || 0,
      dimensionImages: dimensionImages || [],
      productsWithImagesCount: productsWithImages?.length || 0,
      productsWithImages: productsWithImages?.map(p => ({
        id: p.id,
        name: p.name,
        dimensionImagesCount: p.product_dimension_images?.length || 0,
        dimensionImages: p.product_dimension_images || []
      })) || [],
      specificProduct: specificProductData,
      environment: {
        NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'NOT_SET'
      }
    })
  } catch (error) {
    console.error('Error in test-dimension-images API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
