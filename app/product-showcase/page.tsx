"use client"

import { ProductGridNew } from "@/components/product-grid-new"
import { ProductDetailCard } from "@/components/product-detail-card"
import { useState, useEffect } from "react"

export default function ProductShowcasePage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showcaseProducts, setShowcaseProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch showcase products from database
  useEffect(() => {
    const fetchShowcaseProducts = async () => {
      setLoading(true)
      try {
        // Fetch products from multiple categories for showcase
        const [mattressesResponse, bedsResponse, sofasResponse] = await Promise.all([
          fetch('/api/products/category/mattresses'),
          fetch('/api/products/category/beds'),
          fetch('/api/products/category/sofas')
        ])

        const allProducts = []
        
        if (mattressesResponse.ok) {
          const data = await mattressesResponse.json()
          allProducts.push(...(data.products?.slice(0, 2) || []))
        }
        
        if (bedsResponse.ok) {
          const data = await bedsResponse.json()
          allProducts.push(...(data.products?.slice(0, 1) || []))
        }
        
        if (sofasResponse.ok) {
          const data = await sofasResponse.json()
          allProducts.push(...(data.products?.slice(0, 1) || []))
        }

        // Transform database products to match showcase format
        const transformedProducts = allProducts.map((dbProduct: any, index: number) => ({
          id: dbProduct.id,
          name: dbProduct.name,
          brand: dbProduct.brand || 'Premium Brand',
          brandColor: 'orange',
          badge: index === 0 ? 'Best Seller' : index === 1 ? 'New Model' : 'Premium',
          badgeColor: index === 0 ? 'orange' : 'gray',
          image: dbProduct.images?.[0] || '/mattress-image.svg',
          rating: dbProduct.rating || 4.5,
          reviewCount: dbProduct.reviewCount || 100,
          firmness: dbProduct.firmnessScale || 'MEDIUM',
          firmnessLevel: 6,
          features: dbProduct.features?.slice(0, 4) || ['Premium Quality'],
          originalPrice: dbProduct.variants?.[0]?.originalPrice || 500,
          currentPrice: dbProduct.variants?.[0]?.currentPrice || 450,
          savings: (dbProduct.variants?.[0]?.originalPrice || 500) - (dbProduct.variants?.[0]?.currentPrice || 450),
          freeDelivery: 'Tomorrow',
          setupService: true,
          setupCost: 49,
          certifications: ['OEKO-TEX', 'Made in UK'],
          sizes: dbProduct.variants?.map((v: any) => v.size).filter(Boolean) || ['Single', 'Double', 'King'],
          selectedSize: dbProduct.variants?.[0]?.size || 'King',
          monthlyPrice: Math.floor((dbProduct.variants?.[0]?.currentPrice || 450) / 12),
          images: dbProduct.images || ['/mattress-image.svg'],
          category: dbProduct.category
        }))

        setShowcaseProducts(transformedProducts)
      } catch (error) {
        console.error('Error fetching showcase products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShowcaseProducts()
  }, [])

  const selectedProductData = showcaseProducts.find(p => p.id === selectedProduct)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-2">Loading Products...</div>
          <div className="text-gray-500">Please wait while we fetch the latest products</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Product Showcase</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedProduct === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setSelectedProduct(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedProduct !== null
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detail View
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedProduct === null ? (
        <ProductGridNew 
          products={showcaseProducts} 
          title="Product Cards with Orange Color Scheme" 
        />
      ) : selectedProductData ? (
        <ProductDetailCard product={selectedProductData} />
      ) : null}
    </div>
  )
}
