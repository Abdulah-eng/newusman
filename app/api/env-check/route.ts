import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const requiredVars = {
    // Supabase
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Stripe
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    // Email
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASS': process.env.SMTP_PASS,
    'MAIL_FROM': process.env.MAIL_FROM,
    'ADMIN_EMAIL': process.env.ADMIN_EMAIL,
    
    // Site
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL
  }
  
  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)
  
  const status = missingVars.length === 0 ? 'OK' : 'MISSING_VARIABLES'
  
  return NextResponse.json({
    status,
    message: missingVars.length === 0 
      ? 'All required environment variables are set' 
      : `${missingVars.length} environment variables are missing`,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      missing: missingVars,
      present: Object.entries(requiredVars)
        .filter(([key, value]) => value)
        .map(([key]) => key)
    },
    recommendations: {
      orders: missingVars.length === 0 ? 'Ready to process orders' : 'Fix missing variables first',
      stripe: process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET ? 'Ready for payments' : 'Stripe not configured',
      email: process.env.SMTP_HOST && process.env.SMTP_USER ? 'Ready to send emails' : 'Email not configured'
    }
  })
}
