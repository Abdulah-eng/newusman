import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { data: recommendations, error } = await supabase
      .from('quiz_recommendations')
      .select(`
        *,
        quiz_recommendation_products (
          product_id,
          is_primary,
          display_order,
          products (
            id,
            name
          )
        )
      `)
      .order('priority', { ascending: true })

    if (error) throw error

    return NextResponse.json({ recommendations: recommendations || [] })
  } catch (error: any) {
    console.error('Error fetching quiz recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { rule_name, description, answer_conditions, recommendation_title, recommendation_description, priority, is_active } = await req.json()

    if (!rule_name || !recommendation_title) {
      return NextResponse.json({ error: 'Rule name and recommendation title are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quiz_recommendations')
      .insert({
        rule_name,
        description,
        answer_conditions,
        recommendation_title,
        recommendation_description,
        priority: priority || 1,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, recommendation: data })
  } catch (error: any) {
    console.error('Error creating quiz recommendation:', error)
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, rule_name, description, answer_conditions, recommendation_title, recommendation_description, priority, is_active } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quiz_recommendations')
      .update({
        rule_name,
        description,
        answer_conditions,
        recommendation_title,
        recommendation_description,
        priority: priority || 1,
        is_active: is_active !== false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, recommendation: data })
  } catch (error: any) {
    console.error('Error updating quiz recommendation:', error)
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('quiz_recommendations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting quiz recommendation:', error)
    return NextResponse.json({ error: 'Failed to delete recommendation' }, { status: 500 })
  }
}
