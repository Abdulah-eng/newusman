import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('homepage_content')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Database connection test failed:', testError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: testError.message 
      }, { status: 500 })
    }

    // Get actual data
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Error fetching homepage content:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch homepage content', 
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      tableExists: true,
      recordCount: data?.length || 0,
      sections: data?.map(item => item.section) || [],
      sampleData: data?.slice(0, 2) || [], // First 2 records for debugging
      heroSection: data?.find(item => item.section === 'hero')?.content || null
    })
  } catch (error) {
    console.error('Error in test-db API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
