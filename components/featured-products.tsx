"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { useCategory } from "@/lib/category-context"

interface FeaturedProductsProps {
  selectedCategory?: string
}

interface Product {
  id: string
  name: string
  brand: string
  brandColor: string
  badge: string
  badgeColor: string
  image: string
  rating: number
  reviewCount: number
  firmness: string
  firmnessLevel: number
  features: string[]
  originalPrice: number
  currentPrice: number
  savings: number
  freeDelivery: string
  setupService: boolean
  setupCost?: number
  certifications: string[]
  sizes: string[]
  selectedSize: string
  monthlyPrice: number
  images: string[]
  category: string
  type: string
  size: string
  comfortLevel: string
  inStore: boolean
  onSale: boolean
  price: number
}

export function FeaturedProducts({ selectedCategory: propSelectedCategory }: FeaturedProductsProps) {
  const { selectedCategory: contextSelectedCategory } = useCategory()
  const selectedCategory = propSelectedCategory || contextSelectedCategory || 'mattresses'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [fallbackProducts, setFallbackProducts] = useState<Product[]>([])

  const getCategoryFromSelection = (selection: string): string => {
    // Handle direct category names
    if (selection === 'mattresses') return 'mattresses'
    if (selection === 'beds') return 'beds'
    if (selection === 'sofas') return 'sofas'
    if (selection === 'pillows') return 'pillows'
    if (selection === 'toppers') return 'toppers'
    if (selection === 'bunkbeds') return 'bunkbeds'
    if (selection === 'kids') return 'kids'
    
    // Handle legacy selections that might include additional text
    if (selection.includes('mattresses')) return 'mattresses'
    if (selection.includes('beds')) return 'beds'
    if (selection.includes('sofas')) return 'sofas'
    if (selection.includes('pillows')) return 'pillows'
    if (selection.includes('toppers')) return 'toppers'
    if (selection.includes('bunkbeds')) return 'bunkbeds'
    if (selection.includes('kids')) return 'kids'
    if (selection.includes('guides')) return 'guides'
    return 'mattresses'
  }

  // Fetch featured products from Sleep Luxury API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const category = getCategoryFromSelection(selectedCategory)
        console.log('FeaturedProducts - Selected category:', selectedCategory, 'Mapped to:', category)
        
        // First try to fetch from Sleep Luxury API
        const sleepLuxuryResponse = await fetch('/api/sleep-luxury')
        if (sleepLuxuryResponse.ok) {
          const sleepLuxuryData = await sleepLuxuryResponse.json()
          if (sleepLuxuryData.success && sleepLuxuryData.products[category]) {
            // Transform Sleep Luxury products to match Product interface
            const transformedProducts = sleepLuxuryData.products[category].map((dbProduct: any) => ({
              id: dbProduct.id,
              name: dbProduct.name,
              brand: dbProduct.brand || 'Premium Brand',
              brandColor: 'blue',
              badge: 'Featured',
              badgeColor: 'orange',
              image: dbProduct.images?.[0] || '/mattress-image.svg',
              rating: dbProduct.rating || 4.5,
              reviewCount: dbProduct.review_count || 100,
              firmness: dbProduct.firmness_scale || dbProduct.firmnessScale || 'MEDIUM',
              firmnessLevel: 6,
              features: (dbProduct.features || []).slice(0, 6),
              originalPrice: dbProduct.original_price || dbProduct.current_price,
              currentPrice: dbProduct.current_price,
              savings: dbProduct.original_price ? dbProduct.original_price - dbProduct.current_price : 0,
              freeDelivery: 'Tomorrow',
              setupService: true,
              setupCost: 49,
              certifications: ['OEKO-TEX', 'Made in UK'],
              sizes: (dbProduct.variants || []).map((v: any) => v.size).filter(Boolean),
              selectedSize: ((dbProduct.variants || [])[0]?.size) || 'King',
              monthlyPrice: Math.floor(dbProduct.current_price / 12),
              images: dbProduct.images || ['/mattress-image.svg'],
              category: category,
              type: 'Standard',
              size: ((dbProduct.variants || [])[0]?.size) || 'King Size',
              comfortLevel: 'Medium',
              inStore: true,
              onSale: dbProduct.original_price > dbProduct.current_price,
              price: dbProduct.current_price,
              variants: (dbProduct.variants || []).map((v: any) => ({
                id: `${dbProduct.id}-${v.size}-${v.color || 'default'}`,
                sku: '',
                color: v.color,
                size: v.size,
                originalPrice: Number(v.original_price) || Number(v.current_price) || 0,
                currentPrice: Number(v.current_price) || Number(v.original_price) || 0,
              })),
            }))
            
            setProducts(transformedProducts)
            return
          }
        }
        
        // Fallback to original API if Sleep Luxury doesn't have products for this category
        const response = await fetch(`/api/products/category/${category}?limit=4`)
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        const data = await response.json()
        
        // Transform database products to match Product interface
        const transformedProducts = data.products?.slice(0, 4).map((dbProduct: any) => ({
          id: dbProduct.id, // Keep the original UUID string
          name: dbProduct.name,
          brand: dbProduct.brand || 'Premium Brand',
          brandColor: 'blue',
          badge: dbProduct.badge || 'Premium',
          badgeColor: 'blue',
          image: dbProduct.images?.[0] || '/mattress-image.svg',
          rating: dbProduct.rating || 4.5,
          reviewCount: dbProduct.reviewCount || 100,
          firmness: dbProduct.firmnessScale || 'MEDIUM',
          firmnessLevel: 6,
          features: dbProduct.features?.slice(0, 6) || ['Premium Quality'],
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
          category: dbProduct.category,
          type: dbProduct.type || 'Standard',
          size: dbProduct.variants?.[0]?.size || 'King Size',
          comfortLevel: dbProduct.firmnessScale || 'Medium',
          inStore: true,
          onSale: dbProduct.variants?.some((v: any) => v.originalPrice > v.currentPrice) || false,
          price: dbProduct.variants?.[0]?.currentPrice || 450
        })) || []
        
        setProducts(transformedProducts)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setError('Failed to load featured products')
        // Set fallback products
        setFallbackProducts([
          {
            id: "fallback-1",
            name: "Premium Memory Foam Mattress",
            brand: "SLEEP COMFORT",
            brandColor: "blue",
            badge: "Premium",
            badgeColor: "blue",
            image: "/mattress-image.svg",
            rating: 4.7,
            reviewCount: 203,
            firmness: "MEDIUM SOFT",
            firmnessLevel: 5,
            features: ["Memory Foam", "Temperature Regulation", "Motion Isolation"],
            originalPrice: 599.00,
            currentPrice: 509.15,
            savings: 89.85,
            freeDelivery: "Tomorrow",
            setupService: true,
            setupCost: 49,
            certifications: ["OEKO-TEX", "CertiPUR-US", "Made in UK", "100-Night Trial", "10-Year Warranty"],
            sizes: ["Single", "Double", "King", "Super King"],
            selectedSize: "King",
            monthlyPrice: 42,
            images: ["/mattress-image.svg"],
            category: "mattresses",
            type: "Memory Foam",
            size: "King Size",
            comfortLevel: "Medium Soft",
            inStore: true,
            onSale: true,
            price: 509.15
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [selectedCategory])

  const displayProducts = products.length > 0 ? products : fallbackProducts

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
            Loading...
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sleep Luxury, Every Night
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our premium collection of {selectedCategory.toLowerCase()} designed for ultimate comfort and luxury. 
            {loading ? ' Loading...' : ` Showing ${displayProducts.length} products from our ${getCategoryFromSelection(selectedCategory)} collection.`}
          </p>
        </div>

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 text-sm">
              {error} - Showing fallback products
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {displayProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
              <a
                href={`/products/${product.category || 'mattresses'}/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
