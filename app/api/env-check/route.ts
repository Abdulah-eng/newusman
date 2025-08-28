import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const envVars = {
    // Stripe
    hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
    hasStripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    // Supabase
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Email
    hasSmtpHost: !!process.env.SMTP_HOST,
    hasSmtpPort: !!process.env.SMTP_PORT,
    hasSmtpUser: !!process.env.SMTP_USER,
    hasSmtpPass: !!process.env.SMTP_PASS,
    hasMailFrom: !!process.env.MAIL_FROM,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    
    // Site
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  }
  
  const missingVars = Object.entries(envVars)
    .filter(([key, hasValue]) => !hasValue)
    .map(([key]) => key)
  
  return NextResponse.json({
    message: 'Environment variables check',
    allSet: missingVars.length === 0,
    missing: missingVars,
    summary: envVars
  })
}
