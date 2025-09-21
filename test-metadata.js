const testMetadataAPI = async () => {
  try {
    console.log('Testing metadata API call...')
    
    // Test with a real product ID from the logs
    const productId = 'bc78393a-aa01-4215-986d-0cc75522ad28'
    
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      console.error('API call failed:', response.status, response.statusText)
      return
    }
    
    const data = await response.json()
    console.log('API Response structure:')
    console.log('- Has product property:', !!data.product)
    console.log('- Product name:', data.product?.name)
    console.log('- Product description:', data.product?.description)
    console.log('- Full response keys:', Object.keys(data))
    
    if (data.product) {
      console.log('- Product keys:', Object.keys(data.product))
    }
    
  } catch (error) {
    console.error('Error testing metadata API:', error)
  }
}

testMetadataAPI()
