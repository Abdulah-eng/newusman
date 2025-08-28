import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug endpoint called')
    
    // Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Supabase connection test failed:', testError)
      return NextResponse.json({ 
        error: 'Supabase connection failed', 
        details: testError 
      }, { status: 500 })
    }

    // Count products
    const { count: productsCount, error: productsCountError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsCountError) {
      console.error('Products count error:', productsCountError)
      return NextResponse.json({ 
        error: 'Products count failed', 
        details: productsCountError 
      }, { status: 500 })
    }

    // Count categories
    const { count: categoriesCount, error: categoriesCountError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    if (categoriesCountError) {
      console.error('Categories count error:', categoriesCountError)
      return NextResponse.json({ 
        error: 'Categories count failed', 
        details: categoriesCountError 
      }, { status: 500 })
    }

    // Get sample products
    const { data: sampleProducts, error: sampleProductsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        categories(name, slug)
      `)
      .limit(3)

    if (sampleProductsError) {
      console.error('Sample products error:', sampleProductsError)
      return NextResponse.json({ 
        error: 'Sample products failed', 
        details: sampleProductsError 
      }, { status: 500 })
    }

    // Get all categories
    const { data: allCategories, error: allCategoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')

    if (allCategoriesError) {
      console.error('All categories error:', allCategoriesError)
      return NextResponse.json({ 
        error: 'All categories failed', 
        details: allCategoriesError 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      databaseState: {
        productsCount: productsCount || 0,
        categoriesCount: categoriesCount || 0,
        allCategories: allCategories || [],
        sampleProducts: sampleProducts || []
      }
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
