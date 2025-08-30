const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'SET' : 'MISSING')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('Running icon migration...')
    
    // Add the icon column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE product_reasons_to_love
        ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
      `
    })
    
    if (alterError) {
      console.error('Error adding icon column:', alterError)
      return
    }
    
    // Add comment
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: `
        COMMENT ON COLUMN product_reasons_to_love.icon IS 'Icon type selected in admin panel for the feature (e.g., springs, brain, sliders, etc.)';
      `
    })
    
    if (commentError) {
      console.warn('Warning: Could not add comment:', commentError)
    }
    
    // Create index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_product_reasons_icon ON product_reasons_to_love(icon);
      `
    })
    
    if (indexError) {
      console.warn('Warning: Could not create index:', indexError)
    }
    
    // Verify the column was added
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'product_reasons_to_love')
      .eq('column_name', 'icon')
    
    if (verifyError) {
      console.error('Error verifying column:', verifyError)
      return
    }
    
    if (columns && columns.length > 0) {
      console.log('✅ Icon column successfully added!')
      console.log('Column details:', columns[0])
    } else {
      console.error('❌ Icon column was not found after migration')
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()

