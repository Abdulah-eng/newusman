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
    if (!isVisible) return
    setProducts([])
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
