const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  try {
    console.log('Starting variant image migration...')
    
    // Add variant_image column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE product_variants 
        ADD COLUMN IF NOT EXISTS variant_image TEXT;
      `
    })
    
    if (alterError) {
      console.error('Error adding variant_image column:', alterError)
      return
    }
    
    console.log('✓ Added variant_image column')
    
    // Add comment
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: `
        COMMENT ON COLUMN product_variants.variant_image IS 'Image URL for the variant (typically used for color variants)';
      `
    })
    
    if (commentError) {
      console.warn('Warning: Could not add comment:', commentError)
    } else {
      console.log('✓ Added column comment')
    }
    
    // Create index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_product_variants_variant_image 
        ON product_variants(variant_image) 
        WHERE variant_image IS NOT NULL;
      `
    })
    
    if (indexError) {
      console.warn('Warning: Could not create index:', indexError)
    } else {
      console.log('✓ Created index for variant_image')
    }
    
    console.log('Migration completed successfully!')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()
