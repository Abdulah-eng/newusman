import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/reviews/[id]/helpful
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'increment' or 'decrement'

    console.log('Helpful API request:', { id, action })

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    if (!action || !['increment', 'decrement'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "increment" or "decrement"' },
        { status: 400 }
      )
    }

    // Get current helpful count
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching review:', fetchError)
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Calculate new count
    const currentCount = review.helpful_count || 0
    const newCount = action === 'increment' 
      ? currentCount + 1 
      : Math.max(0, currentCount - 1)

    // Update the helpful count
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({ helpful_count: newCount })
      .eq('id', id)
      .select('helpful_count')
      .single()

    if (updateError) {
      console.error('Error updating helpful count:', updateError)
      return NextResponse.json(
        { error: 'Failed to update helpful count' },
        { status: 500 }
      )
    }

    console.log('Helpful count updated:', { id, newCount })

    return NextResponse.json({
      success: true,
      helpful_count: updatedReview.helpful_count
    })

  } catch (error) {
    console.error('Error in helpful API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
