const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabaseState() {
  try {
    console.log('Checking database state...\n')

    // Check if product_dimensions table exists
    const { data: dimensionsData, error: dimensionsError } = await supabase
      .from('product_dimensions')
      .select('*')
      .limit(1)

    if (dimensionsError) {
      console.log('❌ product_dimensions table does not exist or is not accessible')
      console.log('Error:', dimensionsError.message)
    } else {
      console.log('✅ product_dimensions table exists')
      if (dimensionsData && dimensionsData.length > 0) {
        console.log('   - Has data:', dimensionsData.length, 'rows')
      } else {
        console.log('   - Empty table')
      }
    }

    // Check if product_dimension_images table exists
    const { data: imagesData, error: imagesError } = await supabase
      .from('product_dimension_images')
      .select('*')
      .limit(1)

    if (imagesError) {
      console.log('❌ product_dimension_images table does not exist or is not accessible')
      console.log('Error:', imagesError.message)
    } else {
      console.log('✅ product_dimension_images table exists')
      if (imagesData && imagesData.length > 0) {
        console.log('   - Has data:', imagesData.length, 'rows')
      } else {
        console.log('   - Empty table')
      }
    }

    // Check if products table exists
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (productsError) {
      console.log('❌ products table does not exist or is not accessible')
      console.log('Error:', productsError.message)
    } else {
      console.log('✅ products table exists')
      if (productsData && productsData.length > 0) {
        console.log('   - Has data:', productsData.length, 'rows')
      } else {
        console.log('   - Empty table')
      }
    }

    // Check table structure for product_dimensions
    console.log('\nChecking product_dimensions table structure...')
    try {
      const { data: structureData, error: structureError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'product_dimensions'
            ORDER BY ordinal_position;
          `
        })

      if (structureError) {
        console.log('❌ Could not check table structure:', structureError.message)
      } else {
        console.log('✅ Table structure:')
        structureData.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`)
        })
      }
    } catch (error) {
      console.log('❌ Could not check table structure:', error.message)
    }

  } catch (error) {
    console.error('Database check failed:', error)
  }
}

checkDatabaseState()
