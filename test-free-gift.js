require('dotenv').config()

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please check your .env file for:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testFreeGiftSystem() {
  try {
    console.log('🔍 Testing Free Gift System...\n')
    
    // 1. Check if the required fields exist in products table
    console.log('1. Checking database schema...')
    const { data: schemaData, error: schemaError } = await supabase
      .from('products')
      .select('id, name, badges, free_gift_product_id, free_gift_enabled')
      .limit(1)
    
    if (schemaError) {
      console.error('❌ Error accessing products table:', schemaError.message)
      console.log('This might mean the migration hasn\'t been run yet.')
      return
    }
    
    console.log('✅ Products table accessible')
    console.log('✅ Schema fields found:', Object.keys(schemaData[0] || {}))
    
    // 2. Check for products with free gifts
    console.log('\n2. Checking for products with free gifts...')
    const { data: freeGiftProducts, error: freeGiftError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        badges,
        free_gift_product_id,
        free_gift_enabled,
        categories(name, slug)
      `)
      .or('free_gift_enabled.eq.true,free_gift_product_id.not.is.null')
    
    if (freeGiftError) {
      console.error('❌ Error fetching free gift products:', freeGiftError.message)
      return
    }
    
    if (freeGiftProducts && freeGiftProducts.length > 0) {
      console.log(`✅ Found ${freeGiftProducts.length} products with free gift setup:`)
      freeGiftProducts.forEach(product => {
        console.log(`   - ${product.name} (${product.categories?.slug || 'unknown'})`)
        console.log(`     Badges: ${JSON.stringify(product.badges)}`)
        console.log(`     Free Gift ID: ${product.free_gift_product_id}`)
        console.log(`     Free Gift Enabled: ${product.free_gift_enabled}`)
        console.log('')
      })
    } else {
      console.log('⚠️  No products found with free gift setup')
    }
    
    // 3. Check for products with free_gift badges
    console.log('3. Checking for products with free_gift badges...')
    const { data: badgeProducts, error: badgeError } = await supabase
      .from('products')
      .select('id, name, badges, categories(name, slug)')
      .not('badges', 'eq', '[]')
    
    if (badgeError) {
      console.error('❌ Error fetching products with badges:', badgeError.message)
      return
    }
    
    const productsWithFreeGiftBadge = badgeProducts?.filter(product => {
      if (!product.badges || !Array.isArray(product.badges)) return false
      return product.badges.some(badge => badge.type === 'free_gift' && badge.enabled)
    }) || []
    
    if (productsWithFreeGiftBadge.length > 0) {
      console.log(`✅ Found ${productsWithFreeGiftBadge.length} products with free_gift badges:`)
      productsWithFreeGiftBadge.forEach(product => {
        console.log(`   - ${product.name} (${product.categories?.slug || 'unknown'})`)
        console.log(`     Badges: ${JSON.stringify(product.badges)}`)
        console.log('')
      })
    } else {
      console.log('⚠️  No products found with free_gift badges')
    }
    
    // 4. Check free_gifts table
    console.log('4. Checking free_gifts table...')
    const { data: freeGifts, error: freeGiftsError } = await supabase
      .from('free_gifts')
      .select('*')
    
    if (freeGiftsError) {
      console.error('❌ Error accessing free_gifts table:', freeGiftsError.message)
      console.log('This table might not exist yet. Run the migration first.')
    } else if (freeGifts && freeGifts.length > 0) {
      console.log(`✅ Found ${freeGifts.length} free gift relationships:`)
      freeGifts.forEach(gift => {
        console.log(`   - Product ${gift.product_id} -> Gift ${gift.gift_product_id}`)
      })
    } else {
      console.log('⚠️  No free gift relationships found in free_gifts table')
    }
    
    // 5. Recommendations
    console.log('\n5. Recommendations:')
    if (freeGiftProducts.length === 0 && productsWithFreeGiftBadge.length === 0) {
      console.log('❌ No free gifts configured. To fix this:')
      console.log('   1. Run the migration: node run-badge-migration.js')
      console.log('   2. Go to Admin Dashboard and edit a product')
      console.log('   3. Enable "Free Gift Badge" and select a gift product')
      console.log('   4. Save the product')
    } else if (freeGiftProducts.length > 0 && productsWithFreeGiftBadge.length === 0) {
      console.log('⚠️  Products have free gift fields but no badges. To fix this:')
      console.log('   1. Go to Admin Dashboard and edit products with free gifts')
      console.log('   2. Enable the "Free Gift Badge" checkbox')
      console.log('   3. Save the products')
    } else if (freeGiftProducts.length === 0 && productsWithFreeGiftBadge.length > 0) {
      console.log('⚠️  Products have badges but no free gift fields. To fix this:')
      console.log('   1. Go to Admin Dashboard and edit products with free_gift badges')
      console.log('   2. Select a gift product and save')
    } else {
      console.log('✅ Free gift system appears to be properly configured!')
      console.log('   If gifts are still not working, check the browser console for errors.')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testFreeGiftSystem()
