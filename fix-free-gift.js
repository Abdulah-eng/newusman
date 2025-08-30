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

async function fixFreeGiftSystem() {
  try {
    console.log('🔧 Fixing Free Gift System...\n')
    
    // 1. First, let's check if we have any products to work with
    console.log('1. Checking available products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, categories(name, slug)')
      .limit(10)
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError.message)
      return
    }
    
    if (!products || products.length === 0) {
      console.log('❌ No products found. Please create some products first.')
      return
    }
    
    console.log(`✅ Found ${products.length} products to work with`)
    
    // 2. Let's set up a test free gift relationship
    console.log('\n2. Setting up a test free gift...')
    
    // Use the first product as the main product
    const mainProduct = products[0]
    // Use the second product as the gift (if available)
    const giftProduct = products[1] || products[0]
    
    console.log(`   Main Product: ${mainProduct.name} (${mainProduct.categories?.slug || 'unknown'})`)
    console.log(`   Gift Product: ${giftProduct.name} (${giftProduct.categories?.slug || 'unknown'})`)
    
    // 3. Update the main product with free gift settings
    console.log('\n3. Updating main product with free gift settings...')
    
    const updateData = {
      badges: [
        { type: 'free_gift', enabled: true },
        { type: 'sale', enabled: false },
        { type: 'new_in', enabled: false }
      ],
      free_gift_product_id: giftProduct.id,
      free_gift_enabled: true
    }
    
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', mainProduct.id)
    
    if (updateError) {
      console.error('❌ Error updating product:', updateError.message)
      return
    }
    
    console.log('✅ Successfully updated main product with free gift settings')
    
    // 4. Insert into free_gifts table
    console.log('\n4. Creating free_gifts relationship...')
    
    const { error: freeGiftError } = await supabase
      .from('free_gifts')
      .insert({
        product_id: mainProduct.id,
        gift_product_id: giftProduct.id
      })
    
    if (freeGiftError) {
      console.log('⚠️  Warning: Could not insert into free_gifts table:', freeGiftError.message)
      console.log('   This might mean the table doesn\'t exist yet.')
    } else {
      console.log('✅ Successfully created free_gifts relationship')
    }
    
    // 5. Verify the setup
    console.log('\n5. Verifying the setup...')
    
    const { data: updatedProduct, error: verifyError } = await supabase
      .from('products')
      .select('id, name, badges, free_gift_product_id, free_gift_enabled')
      .eq('id', mainProduct.id)
      .single()
    
    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError.message)
      return
    }
    
    console.log('✅ Verification successful!')
    console.log(`   Product: ${updatedProduct.name}`)
    console.log(`   Badges: ${JSON.stringify(updatedProduct.badges)}`)
    console.log(`   Free Gift ID: ${updatedProduct.free_gift_product_id}`)
    console.log(`   Free Gift Enabled: ${updatedProduct.free_gift_enabled}`)
    
    // 6. Test the API endpoint
    console.log('\n6. Testing API endpoint...')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?id=eq.${mainProduct.id}&select=*`, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && data[0]) {
          const product = data[0]
          console.log('✅ API endpoint working')
          console.log(`   API Response - Badges: ${JSON.stringify(product.badges)}`)
          console.log(`   API Response - Free Gift ID: ${product.free_gift_product_id}`)
          console.log(`   API Response - Free Gift Enabled: ${product.free_gift_enabled}`)
        }
      } else {
        console.log('⚠️  API endpoint test failed:', response.status)
      }
    } catch (apiError) {
      console.log('⚠️  Could not test API endpoint:', apiError.message)
    }
    
    console.log('\n🎉 Free gift setup complete!')
    console.log('\nNext steps:')
    console.log('1. Go to your website and find the product:', mainProduct.name)
    console.log('2. Add it to cart - you should see the free gift added automatically')
    console.log('3. Check the browser console for debug information')
    console.log('4. If it\'s still not working, run: node test-free-gift.js')
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixFreeGiftSystem()
