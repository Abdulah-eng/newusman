import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')

    if (error) throw error

    return NextResponse.json({ categories: categories || [] })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}