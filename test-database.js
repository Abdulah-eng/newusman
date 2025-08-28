// Test script to check database connectivity
// Run this in your browser console or as a Node.js script

const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

// Test database connection
async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test 1: Check if products table exists and has data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (productsError) {
      console.error('❌ Products table error:', productsError)
    } else {
      console.log('✅ Products table accessible')
    }
    
    // Test 2: Check if homepage_content table exists
    const { data: content, error: contentError } = await supabase
      .from('homepage_content')
      .select('count')
      .limit(1)
    
    if (contentError) {
      console.error('❌ Homepage content table error:', contentError)
    } else {
      console.log('✅ Homepage content table accessible')
    }
    
    // Test 3: Try to load actual products
    const { data: actualProducts, error: loadError } = await supabase
      .from('products')
      .select('id, name, category')
      .limit(5)
    
    if (loadError) {
      console.error('❌ Error loading products:', loadError)
    } else {
      console.log('✅ Loaded products:', actualProducts)
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

// Run the test
testDatabase()
