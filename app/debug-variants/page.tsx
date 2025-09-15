"use client"

import { useEffect, useState } from 'react'

export default function DebugVariants() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testProductId = 'b26651c1-ac67-470f-b026-c150c136264c' // The Foamex 25 product ID from the image
    
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${testProductId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Debug - Product data:', data)
          setProducts([data.product])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Variants</h1>
      
      {products.map((product, index) => (
        <div key={index} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>Variants Count:</strong> {product.variants?.length || 0}</p>
          
          {product.variants && product.variants.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mt-2">Variants:</h3>
              {product.variants.map((variant: any, vIndex: number) => (
                <div key={vIndex} className="ml-4 p-2 bg-gray-100 mb-2">
                  <p><strong>SKU:</strong> {variant.sku}</p>
                  <p><strong>Size:</strong> {variant.size}</p>
                  <p><strong>Color:</strong> {variant.color}</p>
                  <p><strong>Price:</strong> £{variant.currentPrice}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">No variants found!</p>
          )}
        </div>
      ))}
    </div>
  )
}
