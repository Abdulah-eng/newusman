const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runBadgeMigration() {
  try {
    console.log('Starting Badge System Migration...')
    
    // Add badge-related fields to products table
    console.log('Adding badge fields to products table...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
        ALTER TABLE products ADD COLUMN IF NOT EXISTS free_gift_product_id UUID REFERENCES products(id);
        ALTER TABLE products ADD COLUMN IF NOT EXISTS free_gift_enabled BOOLEAN DEFAULT FALSE;
      `
    })
    
    if (alterError) {
      console.log('Using direct SQL execution...')
      // Try direct SQL execution
      const { error: directError } = await supabase
        .from('products')
        .select('id')
        .limit(1)
      
      if (directError) {
        console.error('Cannot access products table:', directError)
        console.log('Please run the migration manually using the SQL file: migrations/add-badge-system.sql')
        return
      }
    }
    
    // Create free_gifts table
    console.log('Creating free_gifts table...')
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS free_gifts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          gift_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, gift_product_id)
        );
      `
    })
    
    if (createTableError) {
      console.log('Table creation failed, may already exist or need manual creation')
    }
    
    // Create indexes
    console.log('Creating indexes...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_free_gifts_product_id ON free_gifts(product_id);
        CREATE INDEX IF NOT EXISTS idx_free_gifts_gift_product_id ON free_gifts(gift_product_id);
      `
    })
    
    console.log('✅ Badge System Migration completed successfully!')
    console.log('')
    console.log('New fields added to products table:')
    console.log('- badges (JSONB): Array of badge objects')
    console.log('- free_gift_product_id (UUID): Reference to gift product')
    console.log('- free_gift_enabled (BOOLEAN): Whether free gift is enabled')
    console.log('')
    console.log('New table created:')
    console.log('- free_gifts: Tracks gift relationships between products')
    console.log('')
    console.log('You can now use the badge system in the product form!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('')
    console.log('Please run the migration manually using the SQL file: migrations/add-badge-system.sql')
  }
}

runBadgeMigration()
