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

async function checkFreeGiftData() {
  try {
    console.log('🔍 Checking Free Gift Data in Database...\n')
    
    // Check products with free gift fields
    console.log('1. Checking products with free gift fields...')
    const { data: productsWithFreeGift, error: freeGiftError } = await supabase
      .from('products')
      .select('id, name, free_gift_product_id, free_gift_enabled, badges')
      .not('free_gift_product_id', 'is', null)
    
    if (freeGiftError) {
      console.error('Error fetching products with free gift:', freeGiftError)
    } else {
      console.log(`Found ${productsWithFreeGift?.length || 0} products with free_gift_product_id:`)
      productsWithFreeGift?.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p.id})`)
        console.log(`    free_gift_product_id: ${p.free_gift_product_id}`)
        console.log(`    free_gift_enabled: ${p.free_gift_enabled}`)
        console.log(`    badges: ${JSON.stringify(p.badges)}`)
      })
    }
    
    // Check products with free gift badges
    console.log('\n2. Checking products with free gift badges...')
    const { data: productsWithBadges, error: badgesError } = await supabase
      .from('products')
      .select('id, name, badges')
      .not('badges', 'eq', '[]')
    
    if (badgesError) {
      console.error('Error fetching products with badges:', badgesError)
    } else {
      console.log(`Found ${productsWithBadges?.length || 0} products with badges:`)
      productsWithBadges?.forEach(p => {
        if (p.badges && Array.isArray(p.badges)) {
          const freeGiftBadge = p.badges.find(b => b.type === 'free_gift')
          if (freeGiftBadge) {
            console.log(`  - ${p.name} (ID: ${p.id})`)
            console.log(`    free_gift badge: ${JSON.stringify(freeGiftBadge)}`)
          }
        }
      })
    }
    
    // Check if the specific product "xyz" has free gift data
    console.log('\n3. Checking specific product "xyz"...')
    const { data: xyzProduct, error: xyzError } = await supabase
      .from('products')
      .select('*')
      .eq('name', 'xyz')
      .single()
    
    if (xyzError) {
      console.error('Error fetching xyz product:', xyzError)
    } else if (xyzProduct) {
      console.log('Product "xyz" found:')
      console.log(`  ID: ${xyzProduct.id}`)
      console.log(`  free_gift_product_id: ${xyzProduct.free_gift_product_id}`)
      console.log(`  free_gift_enabled: ${xyzProduct.free_gift_enabled}`)
      console.log(`  badges: ${JSON.stringify(xyzProduct.badges)}`)
    } else {
      console.log('Product "xyz" not found')
    }
    
    console.log('\n✅ Database check completed!')
    
  } catch (error) {
    console.error('Error checking database:', error)
  }
}

checkFreeGiftData()
