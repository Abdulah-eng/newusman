import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = await params

    // Get popular categories for the given product category
    const { data: popularCategories, error } = await supabase
      .from('product_popular_categories')
      .select(`
        popular_category_name,
        filter_key,
        filter_value,
        products!inner(
          categories!inner(slug)
        )
      `)
      .eq('products.categories.slug', category)

    if (error) {
      console.error('Error fetching popular categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch popular categories' },
        { status: 500 }
      )
    }

    // Group by popular category name and count products
    const categoryCounts = popularCategories?.reduce((acc: any, item: any) => {
      const name = item.popular_category_name
      if (!acc[name]) {
        acc[name] = {
          name,
          filterKey: item.filter_key || 'Category',
          filterValue: item.filter_value || name,
          itemsCount: 0
        }
      }
      acc[name].itemsCount++
      return acc
    }, {}) || {}

    // Convert to array and sort by count
    const result = Object.values(categoryCounts)
      .sort((a: any, b: any) => b.itemsCount - a.itemsCount)
      .slice(0, 12) // Limit to 12 categories

    return NextResponse.json({
      popularCategories: result
    })

  } catch (error) {
    console.error('Error in popular categories API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
