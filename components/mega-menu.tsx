"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { ProductCard } from "@/components/product-card"

interface MegaMenuProduct {
  id: number
  name: string
  brand: string
  brandColor?: string
  badge?: string
  badgeColor?: string
  image?: string
  rating?: number
  reviewCount?: number
  firmness?: string
  firmnessLevel?: number
  features?: string[]
  originalPrice?: number
  currentPrice?: number
  savings?: number
  freeDelivery?: string
  setupService?: boolean
  setupCost?: number
  certifications?: string[]
  sizes?: string[]
  selectedSize?: string
  monthlyPrice?: number
  images?: string[]
  category: string
  price?: number // Added for cases where currentPrice is not available
}

interface MegaMenuProps {
  category: string
  isVisible: boolean
  onClose: () => void
}

export function MegaMenu({ category, isVisible, onClose }: MegaMenuProps) {
  const { dispatch } = useCart()
  const [products, setProducts] = useState<MegaMenuProduct[]>([])

  useEffect(() => {
    if (!isVisible || !category) {
      return
    }
    let cancelled = false
    const controller = new AbortController()
    const load = async () => {
      try {
        // Fetch real products for this category from our API
        const res = await fetch(`/api/products/category/${category}`, { signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const apiProducts = (data?.products || []).slice(0, 8)
        const mapped: MegaMenuProduct[] = apiProducts.map((p: any) => ({
          id: Number(p.id),
          name: p.name || p.title || 'Product',
          brand: p.brand || 'Brand',
          brandColor: p.brandColor,
          badge: p.badge,
          badgeColor: p.badgeColor,
          image: p.image || p.images?.[0],
          images: p.images || (p.image ? [p.image] : []),
          rating: Number(p.rating ?? 4.5),
          reviewCount: Number(p.reviewCount ?? 0),
          firmness: p.firmness || p.firmness_description,
          firmnessLevel: Number(p.firmnessLevel ?? p.firmness_scale ?? 0),
          features: p.features || p.reasons_to_love || [],
          originalPrice: Number(p.originalPrice ?? p.original_price ?? p.price ?? 0),
          currentPrice: Number(p.currentPrice ?? p.current_price ?? p.price ?? 0),
          savings: Number(p.savings ?? 0),
          freeDelivery: p.freeDelivery,
          sizes: p.sizes || [],
          selectedSize: p.selectedSize,
          monthlyPrice: p.monthlyPrice,
          category: p.category || category,
          price: Number(p.price ?? p.current_price ?? p.currentPrice ?? 0)
        }))
        setProducts(mapped)
      } catch (e) {
        // ignore abort errors
      }
    }
    setProducts([])
    load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [category, isVisible])

  const handleAddToCart = (product: MegaMenuProduct) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image || product.images?.[0] || '',
        currentPrice: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        size: product.selectedSize || 'Queen'
      }
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-orange-600 text-orange-600' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (!isVisible || products.length === 0) return null

  return (
    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 capitalize mb-2">{category.replace('-', ' ')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center">
                      <Button 
            asChild 
            className="bg-orange-900 hover:bg-orange-800 text-white px-8 py-3 rounded-full"
          >
          <Link href={`/${category}`}>
            Shop all {category.replace('-', ' ')}
          </Link>
        </Button>
        </div>
      </div>
    </div>
  )
}
