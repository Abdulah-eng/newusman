const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test 1: Check if products table exists and has data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Products table error:', productsError)
    } else {
      console.log('✅ Products table accessible')
      console.log('📊 Products count:', products?.length || 0)
      if (products && products.length > 0) {
        console.log('📦 First product:', {
          id: products[0].id,
          name: products[0].name,
          category_id: products[0].category_id
        })
      }
    }
    
    // Test 2: Check if categories table exists
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    
    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError)
    } else {
      console.log('✅ Categories table accessible')
      console.log('📊 Categories count:', categories?.length || 0)
      if (categories && categories.length > 0) {
        console.log('🏷️ Categories:', categories.map(c => c.name))
      }
    }
    
    // Test 3: Check table structure
    console.log('\n🔍 Checking table structure...')
    
    // Try to get a single product with all fields
    const { data: productStructure, error: structureError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .single()
    
    if (structureError) {
      console.error('❌ Error getting product structure:', structureError)
    } else if (productStructure) {
      console.log('✅ Product table structure accessible')
      console.log('📋 Available fields:', Object.keys(productStructure))
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

// Run the test
testDatabase()
