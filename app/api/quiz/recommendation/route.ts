import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()
    
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 })
    }

    // Use the database function to find the best recommendation
    const { data: recommendations, error } = await supabase
      .rpc('find_mattress_recommendation', { user_answers: answers })

    if (error) {
      console.error('Error finding recommendation:', error)
      return NextResponse.json({ error: 'Failed to find recommendation' }, { status: 500 })
    }

    if (!recommendations || recommendations.length === 0) {
      return NextResponse.json({ 
        recommendation: {
          title: 'Balanced Hybrid Medium',
          description: 'A versatile choice that works for most sleep preferences',
          products: []
        }
      })
    }

    const recommendation = recommendations[0]

    // Get associated products for this recommendation
    const { data: products, error: productsError } = await supabase
      .from('quiz_recommendation_products')
      .select(`
        product_id,
        is_primary,
        display_order,
        products (
          id,
          name,
          rating,
          headline,
          current_price: product_variants!inner(current_price)
        )
      `)
      .eq('recommendation_id', recommendation.recommendation_id)
      .order('display_order')

    if (productsError) {
      console.error('Error fetching recommendation products:', productsError)
    }

    return NextResponse.json({
      recommendation: {
        id: recommendation.recommendation_id,
        title: recommendation.recommendation_title,
        description: recommendation.recommendation_description,
        products: products || []
      }
    })

  } catch (error: any) {
    console.error('Quiz recommendation error:', error)
    return NextResponse.json({ 
      error: 'Failed to get recommendation' 
    }, { status: 500 })
  }
}
