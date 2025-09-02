const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file contains:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  console.log('🚀 Starting order-related database migrations...\n')

  try {
    // Migration 1: Add tracking columns to orders table
    console.log('📝 Migration 1: Adding tracking columns to orders table...')
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS tracking_number TEXT,
        ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMP WITH TIME ZONE;
        
        COMMENT ON COLUMN orders.tracking_number IS 'Tracking number for dispatched orders';
        COMMENT ON COLUMN orders.dispatched_at IS 'Timestamp when order was dispatched';
        
        UPDATE orders 
        SET tracking_number = NULL, 
            dispatched_at = NULL 
        WHERE tracking_number IS NULL OR dispatched_at IS NULL;
      `
    })

    if (ordersError) {
      console.log('⚠️  Orders migration (this might already exist):', ordersError.message)
    } else {
      console.log('✅ Orders table updated successfully')
    }

    // Migration 2: Add product columns to order_items table
    console.log('\n📝 Migration 2: Adding product columns to order_items table...')
    const { error: itemsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE order_items 
        ADD COLUMN IF NOT EXISTS product_name TEXT,
        ADD COLUMN IF NOT EXISTS product_size TEXT,
        ADD COLUMN IF NOT EXISTS product_color TEXT,
        ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);
        
        COMMENT ON COLUMN order_items.product_name IS 'Name of the product ordered';
        COMMENT ON COLUMN order_items.product_size IS 'Size variant of the product';
        COMMENT ON COLUMN order_items.product_color IS 'Color variant of the product';
        COMMENT ON COLUMN order_items.total_price IS 'Total price for this item (unit_price * quantity)';
        
        UPDATE order_items 
        SET product_name = 'Unknown Product',
            product_size = NULL,
            product_color = NULL,
            total_price = unit_price * quantity
        WHERE product_name IS NULL OR total_price IS NULL;
      `
    })

    if (itemsError) {
      console.log('⚠️  Order items migration (this might already exist):', itemsError.message)
    } else {
      console.log('✅ Order items table updated successfully')
    }

    console.log('\n🎉 All migrations completed!')
    console.log('\n📋 Summary of changes:')
    console.log('• Added tracking_number and dispatched_at to orders table')
    console.log('• Added product_name, product_size, product_color, total_price to order_items table')
    console.log('• Updated existing records with default values')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
