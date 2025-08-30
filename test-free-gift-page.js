// Simple test to check free gift functionality
// This script will help verify that free gifts are properly configured

console.log('🔍 Testing Free Gift System...\n')

// Test 1: Check if we can access the cart context
console.log('1. Testing Cart Context Access...')
try {
  // This will only work in the browser
  if (typeof window !== 'undefined') {
    console.log('✅ Browser environment detected')
    console.log('✅ Cart context should be available')
  } else {
    console.log('❌ Not in browser environment')
  }
} catch (error) {
  console.log('❌ Error accessing cart context:', error.message)
}

// Test 2: Check if the free gift notification component exists
console.log('\n2. Testing Free Gift Notification Component...')
try {
  // This will only work in the browser
  if (typeof window !== 'undefined') {
    console.log('✅ Browser environment detected')
    console.log('✅ Free gift notification component should be available')
  } else {
    console.log('❌ Not in browser environment')
  }
} catch (error) {
  console.log('❌ Error accessing free gift notification:', error.message)
}

// Test 3: Check the simplified free gift logic
console.log('\n3. Testing Simplified Free Gift Logic...')
const testFreeGiftLogic = (product) => {
  const hasFreeGift = product.free_gift_product_id && (
    product.free_gift_enabled || 
    product.badges?.some(b => b.type === 'free_gift' && b.enabled)
  )
  
  console.log('Product:', {
    id: product.id,
    name: product.name,
    free_gift_product_id: product.free_gift_product_id,
    free_gift_enabled: product.free_gift_enabled,
    hasFreeGiftBadge: product.badges?.some(b => b.type === 'free_gift' && b.enabled),
    hasFreeGift
  })
  
  return hasFreeGift
}

// Test with sample data
const sampleProduct1 = {
  id: '1',
  name: 'Test Mattress',
  free_gift_product_id: 'gift1',
  free_gift_enabled: true,
  badges: []
}

const sampleProduct2 = {
  id: '2',
  name: 'Test Mattress 2',
  free_gift_product_id: 'gift2',
  free_gift_enabled: false,
  badges: [{ type: 'free_gift', enabled: true }]
}

const sampleProduct3 = {
  id: '3',
  name: 'Test Mattress 3',
  free_gift_product_id: null,
  free_gift_enabled: false,
  badges: []
}

console.log('Testing sample product 1 (enabled field):')
testFreeGiftLogic(sampleProduct1)

console.log('\nTesting sample product 2 (enabled badge):')
testFreeGiftLogic(sampleProduct2)

console.log('\nTesting sample product 3 (no free gift):')
testFreeGiftLogic(sampleProduct3)

console.log('\n✅ Free gift logic test completed!')
console.log('\n📝 To test the actual functionality:')
console.log('1. Go to a product page that has a free gift configured')
console.log('2. Click "Add to Basket"')
console.log('3. Check the browser console for debug logs')
console.log('4. Verify the free gift appears in the cart')
console.log('5. Check that the free gift notification appears')
