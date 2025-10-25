import { useState, useEffect } from 'react'

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

export function useProductsByCategory(category: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const mappedCategory = getCategoryFromSelection(category)
        console.log(`useProductsByCategory - Fetching products for category: ${category} -> ${mappedCategory}`)
        
        // First try to fetch from Sleep Luxury API
        const sleepLuxuryResponse = await fetch('/api/sleep-luxury')
        if (sleepLuxuryResponse.ok) {
          const sleepLuxuryData = await sleepLuxuryResponse.json()
          if (sleepLuxuryData.success && sleepLuxuryData.products[mappedCategory]) {
            // Transform Sleep Luxury products to match Product interface
            const transformedProducts = sleepLuxuryData.products[mappedCategory].map((dbProduct: any) => ({
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
              category: mappedCategory,
              type: 'Standard',
              size: ((dbProduct.variants || [])[0]?.size) || 'King Size',
              comfortLevel: 'Medium',
              inStore: true,
              onSale: dbProduct.original_price > dbProduct.current_price,
              price: dbProduct.current_price,
              variants: (dbProduct.variants || []).map((v: any) => ({
                id: `${dbProduct.id}-${v.size}-${v.color || 'default'}`,
                sku: v.sku || `${dbProduct.id}-${v.size}-${v.color || 'default'}`,
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
        const response = await fetch(`/api/products/category/${mappedCategory}?limit=6`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        
        // Transform database products to match Product interface
        const transformedProducts = data.products?.slice(0, 6).map((dbProduct: any) => ({
          id: dbProduct.id,
          name: dbProduct.name,
          brand: dbProduct.brand || 'Premium Brand',
          brandColor: 'blue',
          badge: dbProduct.badge || 'Premium',
          badgeColor: 'blue',
          image: dbProduct.images?.[0] || dbProduct.image || '/mattress-image.svg',
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
          category: mappedCategory,
          type: 'Standard',
          size: ((dbProduct.variants || [])[0]?.size) || 'King Size',
          comfortLevel: 'Medium',
          inStore: true,
          onSale: dbProduct.original_price > dbProduct.current_price,
          price: dbProduct.current_price,
          variants: (dbProduct.variants || []).map((v: any) => ({
            id: `${dbProduct.id}-${v.size}-${v.color || 'default'}`,
            sku: v.sku || `${dbProduct.id}-${v.size}-${v.color || 'default'}`,
            color: v.color,
            size: v.size,
            originalPrice: Number(v.original_price) || Number(v.current_price) || 0,
            currentPrice: Number(v.current_price) || Number(v.original_price) || 0,
          })),
        }))
        
        setProducts(transformedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return { products, loading, error }
}
