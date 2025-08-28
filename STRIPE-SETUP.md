# Stripe Checkout Setup Guide

## What's Been Implemented

1. **Enhanced Checkout Endpoint** (`/api/checkout`)
   - Collects customer information
   - Creates Stripe checkout sessions
   - Sends admin notifications for new orders

2. **Stripe Webhook Endpoint** (`/api/webhooks/stripe`)
   - Handles successful payments
   - Saves orders to database
   - Sends confirmation emails to customers
   - Sends admin notifications

3. **Orders API** (`/api/orders`)
   - Fetch orders by email or status
   - Update order status

4. **Database Test Endpoint** (`/api/test-db`)
   - Verifies database connection
   - Checks if orders table exists
   - Shows table counts

5. **Environment Check Endpoint** (`/api/env-check`)
   - Verifies all required environment variables

## Setup Steps

### 1. Database Setup

The orders table is already defined in your `supabase-schema.sql`. If you haven't run it yet:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute

### 2. Environment Variables

Add these to your `.env.local`:
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase (for orders)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
ADMIN_EMAIL=admin@yourstore.com

# Site URL (for webhooks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Stripe Webhook Configuration

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: `http://localhost:3000/api/webhooks/stripe` (use Stripe CLI)
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test the Setup

#### Step 1: Check Environment Variables
Visit: `http://localhost:3000/api/env-check`
- Should show all variables are set

#### Step 2: Test Database Connection
Visit: `http://localhost:3000/api/test-db`
- Should show all tables exist and are accessible

#### Step 3: Test Checkout Flow
1. **Add items to cart**
2. **Go to checkout** - fill in customer details
3. **Complete payment** with test card: `4242 4242 4242 4242`
4. **Check console logs** - should see webhook processing
5. **Check database** - order should be saved
6. **Check emails** - confirmation should be sent

## Test Cards

**Successful Payments:**
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`

**Declined Payments:**
- Generic: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 9995`

## Order Flow

1. Customer adds items to cart
2. Customer goes to checkout and fills details
3. Stripe checkout session is created
4. Customer completes payment
5. Stripe webhook fires (`checkout.session.completed`)
6. Order is saved to database (`orders` + `order_items` tables)
7. Confirmation email sent to customer
8. Admin notification sent

## Troubleshooting

### Orders Not Saving

1. **Check Database Tables**
   - Visit `/api/test-db` to verify tables exist
   - Run the SQL schema if tables are missing

2. **Check Webhook Endpoint**
   - Ensure webhook URL is correct in Stripe
   - Check if endpoint is publicly accessible
   - Verify `STRIPE_WEBHOOK_SECRET` matches

3. **Check Console Logs**
   - Look for webhook processing logs
   - Check for database errors

### Emails Not Sending

1. **Check SMTP Settings**
   - Verify SMTP credentials in `.env.local`
   - Test with `/api/env-check`

2. **Check Customer Email**
   - Ensure customer email is captured in checkout
   - Check webhook logs for email processing

### Webhook Errors

1. **Signature Verification**
   - Verify `STRIPE_WEBHOOK_SECRET` is correct
   - Check webhook endpoint URL

2. **Endpoint Accessibility**
   - For production: ensure HTTPS
   - For local testing: use Stripe CLI

## Local Testing with Stripe CLI

If testing locally, install Stripe CLI:

```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook secret for local testing.

## Verification Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Database schema executed in Supabase
- [ ] Stripe webhook endpoint configured
- [ ] Webhook secret copied to environment
- [ ] `/api/env-check` shows all variables set
- [ ] `/api/test-db` shows tables accessible
- [ ] Checkout flow completes without errors
- [ ] Webhook logs appear in console
- [ ] Order appears in database
- [ ] Customer receives confirmation email
- [ ] Admin receives notification email

## Common Issues

1. **"Orders table not found"**
   - Run the SQL schema in Supabase

2. **"Webhook signature verification failed"**
   - Check `STRIPE_WEBHOOK_SECRET` value
   - Ensure webhook URL is correct

3. **"Customer email not found"**
   - Check checkout form captures email
   - Verify email is passed to Stripe

4. **"Database connection failed"**
   - Check Supabase credentials
   - Verify service role key has proper permissions
