import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendMail } from '@/lib/email'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    // Disable webhook completely to prevent duplicate orders
    // Orders are now handled directly in the frontend after successful payment
    console.log('Webhook disabled - orders handled in frontend')
    return NextResponse.json({ message: 'Webhook disabled - orders handled in frontend' }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
