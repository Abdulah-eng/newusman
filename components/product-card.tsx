"use client"

import React from "react"
import Image from "next/image"
import { Star, Circle, Zap, Layers, Ruler, Truck, Leaf, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Waves, Shield, Users, ShieldCheck, Palette, Package, DollarSign, Award, Wrench, Minimize, Baby, Check, Radio, VolumeX, Heart, Trees } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { getFeatureIcon } from "@/lib/icon-mapping"
import { useState } from "react"

interface Product {
  id: string
  name: string
  brand?: string
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
  type?: string
  price?: number
  variants?: Array<{
    id: string
    sku: string
    color: string
    depth?: string
    firmness?: string
    size: string
    originalPrice: number
    currentPrice: number
  }>
  has_variants?: boolean
  firmnessScale?: string
  supportLevel?: string
  pressureReliefLevel?: string
  airCirculationLevel?: string
  durabilityLevel?: string
  headline?: string
  longDescription?: string
  reasonsToLove?: string[]
  customReasons?: string[]
  descriptionParagraphs?: Array<{
    heading: string
    content: string
    image: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
  warrantySections?: Array<{
    heading: string
    content: string
  }>
  dimensions?: {
    height: string
    length: string
    width: string
    mattressSize: string
    maxHeight: string
    weightCapacity: string
    pocketSprings: string
    comfortLayer: string
    supportLayer: string
  }
  popularCategories?: string[]
  createdAt?: string
  updatedAt?: string
  badges?: Array<{
    type: string;
    enabled: boolean;
    product_id?: string;
    product_name?: string;
    product_image?: string;
  }>;
  free_gift_product_id?: string;
  free_gift_product_name?: string;
  free_gift_product_image?: string;
  free_gift_enabled?: boolean;
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const categoryForLink = product.category || 'mattresses'

  const safeProduct = {
    ...product,
    name: product.name || 'Unknown Product',
    brand: product.brand || 'Premium Brand',
    rating: product.rating || 4.0,
    reviewCount: product.reviewCount || 0,
    firmness: product.firmnessScale || product.firmness || 'Medium',
    firmnessLevel: product.firmnessLevel || 6,
    features: product.features || ['Premium Quality'],
    originalPrice: product.originalPrice || product.price || 0,
    currentPrice: product.currentPrice || product.price || 0,
    savings: product.savings || 0,
    sizes: product.sizes || ['Queen'],
    images: product.images || [product.image || ''],
    category: product.category || 'mattresses',
    type: product.type || 'Standard',
  }

  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, rating))
    const fullStars = Math.floor(safeRating)
    const hasHalfStar = safeRating % 1 !== 0
    
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
      } else if (i === fullStars && hasHalfStar) {
        return <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
      } else {
        return <Star key={i} className="h-4 w-4 text-gray-300" />
      }
    })
  }

  // Build features based on category (same logic as product detail page)
  const buildProductFeatures = (): Array<{ label: string; Icon: React.ComponentType<{ className?: string }> | (() => JSX.Element) }> => {
    // Prefer database-provided features with meaningful icons
    if (safeProduct.features && safeProduct.features.length > 0) {
      // Use centralized icon mapping
      return safeProduct.features.slice(0, 6).map(label => ({ label, Icon: getFeatureIcon(label, undefined, 'sm') }))
    }

    if (safeProduct.category === 'mattresses') {
      return [
        { label: 'Pocket Springs', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
            <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
            <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
            <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
          </svg>
        )},
        { label: 'Memory Foam', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )},
        { label: 'Medium Firmness', Icon: SlidersHorizontal },
        { label: 'Eco Friendly', Icon: Recycle },
        { label: 'Waterproof Cover', Icon: Umbrella },
        { label: '10-Year Warranty', Icon: Shield }
      ]
    }
    
    if (safeProduct.category === 'pillows') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Hotel Quality', Icon: Star }
      ]
    }
    
    if (safeProduct.category === 'kids') {
      return [
        { label: 'Safe Materials', Icon: Shield },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Durable Build', Icon: Zap },
        { label: 'Fun Designs', Icon: Star },
        { label: 'Family Friendly', Icon: Users }
      ]
    }
    
    if (safeProduct.category === 'sale' || safeProduct.category === 'clearance') {
      return [
        { label: 'Premium Quality', Icon: ShieldCheck },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Great Value', Icon: DollarSign },
        { label: 'Warranty Support', Icon: Award }
      ]
    }
    
    if (safeProduct.category === 'beds') {
      return [
        { label: 'Sturdy Frame', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (safeProduct.category === 'sofas') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Comfortable', Icon: Heart },
        { label: 'Durable Frame', Icon: Zap },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Fast Shipping', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (safeProduct.category === 'bunkbeds') {
      return [
        { label: 'Space-Saving', Icon: Minimize },
        { label: 'Multiple Sleeping Levels', Icon: Layers },
        { label: 'Solid Wood Frames', Icon: Trees },
        { label: 'Guard Rails', Icon: Shield },
        { label: 'Easy Assemble', Icon: Wrench },
        { label: 'Flat-Pack', Icon: Package }
      ]
    }
    
    if (safeProduct.category === 'toppers') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Cooling Tech', Icon: Snowflake },
        { label: 'Pressure Relief', Icon: Heart },
        { label: 'Easy Fit', Icon: Check },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Anti-Slip', Icon: Shield }
      ]
    }
    
    if (safeProduct.category === 'bed-frames') {
      return [
        { label: 'Sturdy Build', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (safeProduct.category === 'bedding') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Soft Touch', Icon: Feather },
        { label: 'Breathable', Icon: Feather },
        { label: 'Easy Care', Icon: Waves },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck }
      ]
    }
    
    if (safeProduct.category === 'adjustable-bases') {
      return [
        { label: 'Motorized Control', Icon: Zap },
        { label: 'Multiple Positions', Icon: SlidersHorizontal },
        { label: 'Remote Control', Icon: Radio },
        { label: 'USB Ports', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (safeProduct.category === 'box-springs') {
      return [
        { label: 'Premium Build', Icon: Star },
        { label: 'Sturdy Frame', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    // Fallback to product features if available
    if (safeProduct.features && safeProduct.features.length > 0) {
      return safeProduct.features.slice(0, 6).map(feature => ({
        label: feature,
        Icon: () => <Circle className="h-4 w-4" />
      }))
    }
    
    // Use reasons to love if features not available
    if (safeProduct.reasonsToLove && safeProduct.reasonsToLove.length > 0) {
      const getFeatureIcon = (label: string) => {
        const text = (label || '').toLowerCase()
        if (text.includes('memory') || text.includes('foam')) return () => <Brain className="h-4 w-4" />
        if (text.includes('pocket') || text.includes('spring')) return () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
            <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
            <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
            <path d="M4 14h2M8 14h2M12 14h2M16 10h2M20 10h2"/>
          </svg>
        )
        if (text.includes('cool') || text.includes('breath') || text.includes('air')) return () => <Waves className="h-4 w-4" />
        if (text.includes('gel') || text.includes('temperature')) return () => <Snowflake className="h-4 w-4" />
        if (text.includes('edge')) return () => <Shield className="h-4 w-4" />
        if (text.includes('firm')) return () => <SlidersHorizontal className="h-4 w-4" />
        if (text.includes('anti') || text.includes('bacterial') || text.includes('microbial')) return () => <ShieldCheck className="h-4 w-4" />
        if (text.includes('eco') || text.includes('organic') || text.includes('sustain')) return () => <Leaf className="h-4 w-4" />
        if (text.includes('waterproof') || text.includes('cover')) return () => <Umbrella className="h-4 w-4" />
        if (text.includes('warranty')) return () => <Shield className="h-4 w-4" />
        // Additional mappings aligned with "Features you'll love"
        if (text.includes('adjustable') && (text.includes('height') || text.includes('base'))) return () => <SlidersHorizontal className="h-4 w-4" />
        if (text.includes('easy') && text.includes('assembly')) return () => <Wrench className="h-4 w-4" />
        if (text.includes('upholster') || text.includes('headboard')) return () => <Package className="h-4 w-4" />
        if (text.includes('wood')) return () => <Trees className="h-4 w-4" />
        if (text.includes('metal') || text.includes('frame')) return () => <Shield className="h-4 w-4" />
        if (text.includes('construction') || text.includes('built')) return () => <Wrench className="h-4 w-4" />
        if (text.includes('design') || text.includes('style')) return () => <Palette className="h-4 w-4" />
        if (text.includes('support') || text.includes('orth')) return () => <Heart className="h-4 w-4" />
        if (text.includes('hypo') || text.includes('allergen')) return () => <Feather className="h-4 w-4" />
        if (text.includes('washable') || text.includes('removable')) return () => <PackageOpen className="h-4 w-4" />
        if (text.includes('value') || text.includes('price') || text.includes('save')) return () => <DollarSign className="h-4 w-4" />
        if (text.includes('durable') || text.includes('long')) return () => <Zap className="h-4 w-4" />
        if (text.includes('luxury') || text.includes('premium')) return () => <Gem className="h-4 w-4" />
        if (text.includes('delivery') || text.includes('shipping')) return () => <Truck className="h-4 w-4" />
        return () => <Star className="h-4 w-4" />
      }
      
      return safeProduct.reasonsToLove.slice(0, 6).map(reason => ({
        label: reason,
        Icon: getFeatureIcon(reason)
      }))
    }
    
    // Default features
    return [
      { label: 'Premium Quality', Icon: () => <Star className="h-4 w-4" /> },
      { label: 'Fast Delivery', Icon: () => <Truck className="h-4 w-4" /> },
      { label: 'Warranty', Icon: () => <Shield className="h-4 w-4" /> }
    ]
  }

  const productFeatures = buildProductFeatures()

  const handleAddToCart = () => {
    // Get the cheapest variant price
    const cheapestPrice = safeProduct.variants && safeProduct.variants.length > 0 
      ? Math.min(...safeProduct.variants.map(v => v.currentPrice))
      : safeProduct.currentPrice || safeProduct.price || 0
    
    // Check if this product has a free gift - simplified detection
    const hasFreeGift = safeProduct.free_gift_product_id && (
      safeProduct.free_gift_enabled || 
      safeProduct.badges?.some(b => b.type === 'free_gift' && b.enabled)
    )
    
    // Find the selected variant to get its SKU
    // Use the first available variant size if no selectedSize is set
    const firstAvailableSize = safeProduct.variants?.[0]?.size
    const selectedSize = safeProduct.selectedSize || firstAvailableSize || 'Queen'
    
    const selectedVariant = safeProduct.variants?.find(variant => 
      variant.size === selectedSize
    )
    
    // Debug logging
    console.log('Product being added to cart:', {
      id: safeProduct.id,
      name: safeProduct.name,
      badges: safeProduct.badges,
      free_gift_product_id: safeProduct.free_gift_product_id,
      free_gift_enabled: safeProduct.free_gift_enabled,
      free_gift_product_name: safeProduct.free_gift_product_name,
      free_gift_product_image: safeProduct.free_gift_product_image,
      hasFreeGift,
      variants: safeProduct.variants,
      selectedSize,
      selectedVariant
    })
    
    const payload = {
      id: safeProduct.id,
      name: safeProduct.name,
      brand: safeProduct.brand || 'Premium Brand',
      image: safeProduct.images?.[0] || safeProduct.image || '',
      currentPrice: cheapestPrice,
      originalPrice: safeProduct.originalPrice || safeProduct.price || cheapestPrice,
      size: selectedSize,
      variantSku: selectedVariant?.sku
    }
    
    // Add free gift details if available
    if (hasFreeGift) {
      // Use the gift product name from the fields or default
      const giftProductName = safeProduct.free_gift_product_name || 'Free Gift'
      
      Object.assign(payload, {
        freeGiftProductId: safeProduct.free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: safeProduct.free_gift_product_image || ''
      })
      console.log('Free gift will be added:', {
        freeGiftProductId: safeProduct.free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: safeProduct.free_gift_product_image || '',
        source: 'product_card'
      })
    } else {
      console.log('No free gift details available - reasons:', {
        hasFreeGiftProductId: !!safeProduct.free_gift_product_id,
        free_gift_enabled: safeProduct.free_gift_enabled,
        hasFreeGiftBadge: safeProduct.badges?.some(b => b.type === 'free_gift' && b.enabled)
      })
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload
    })
  }

  return (
    <Link href={`/products/${categoryForLink}/${safeProduct.id}`} className="block" target="_blank" rel="noopener noreferrer">
      <Card className="group product-card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden cursor-pointer">
        <CardContent className="p-6 pr-0">
          {/* Product Image - Moved Up and Made Larger */}
          <div className="relative mb-2 -mx-6 -mt-6">
            <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
              <Image
                src={safeProduct.images?.[selectedImage] || safeProduct.image || '/mattress-image.svg'}
                alt={safeProduct.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Free Gift Badge - Top Left */}
            {safeProduct.badges?.some(b => b.type === 'free_gift' && b.enabled) && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-blue-900 text-white border-0 px-3 py-1 text-sm font-medium">
                  Free Gift
                </Badge>
              </div>
            )}

            {/* Wishlist Button - Top Right */}
            <div className="absolute top-3 right-3 z-30">
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const wishlistItem = {
                    id: safeProduct.id,
                    name: safeProduct.name,
                    image: safeProduct.images?.[0] || safeProduct.image || '/mattress-image.svg',
                    price: safeProduct.currentPrice || safeProduct.price || 0,
                    originalPrice: safeProduct.originalPrice,
                    category: safeProduct.category,
                    rating: safeProduct.rating
                  }
                  
                  if (isInWishlist(safeProduct.id)) {
                    removeFromWishlist(safeProduct.id)
                  } else {
                    addToWishlist(wishlistItem)
                  }
                }}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(safeProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Sale and New In Badges - Top Right (moved down) */}
            <div className="absolute top-12 right-3 z-20 flex flex-col gap-2 items-end">
              {/* Product Badge from data */}
              {safeProduct.badge && (
                <Badge className="bg-gray-600 hover:bg-gray-700 text-white border-0 px-3 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg min-w-[60px] text-center">
                  {safeProduct.badge}
                </Badge>
              )}
              
              {/* Sale Badge - from database badges */}
              {safeProduct.badges?.some(b => b.type === 'sale' && b.enabled) && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-3 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg min-w-[60px] text-center">
                  Sale
                </Badge>
              )}
              
              {/* New In Badge - from database badges */}
              {safeProduct.badges?.some(b => b.type === 'new_in' && b.enabled) && (
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white border-0 px-3 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg min-w-[60px] text-center">
                  New In
                </Badge>
              )}
            </div>
          </div>

          {/* Header - Product Title with Fixed Height (2 lines) */}
          <div className="mb-1 h-14 flex flex-col justify-start pt-1">
            <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 overflow-hidden text-ellipsis">{safeProduct.name}</h3>
          </div>



          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">{renderStars(safeProduct.rating)}</div>
            <span className="font-bold text-gray-900">{safeProduct.rating}</span>
            <span className="text-sm text-gray-600">Based on 1k+ reviews</span>
          </div>

          {/* Features with Icons - Fixed Height (3 lines) */}
          <div className="mb-1 h-24 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {productFeatures.map(({ label, Icon }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-gray-700">
                    {typeof Icon === 'function' ? (Icon as () => JSX.Element)() : React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: "h-4 w-4" })}
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section - Fixed Position */}
          <div className="mb-1 flex-shrink-0">
            {safeProduct.variants && safeProduct.variants.length > 0 ? (
              <div>
                <div className="text-sm text-gray-600 mb-1">from</div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    £{Math.min(...safeProduct.variants.map(v => v.currentPrice)).toFixed(2)}
                  </span>
                  {safeProduct.variants.some(v => v.originalPrice > v.currentPrice) && (
                    <span className="text-lg text-gray-500 line-through">
                      £{Math.max(...safeProduct.variants.map(v => v.originalPrice)).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {safeProduct.variants.length} variants available
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-600 mb-1">from</div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">£{safeProduct.currentPrice.toFixed(2)}</span>
                  {safeProduct.originalPrice && safeProduct.originalPrice > safeProduct.currentPrice && (
                    <span className="text-lg text-gray-500 line-through">£{safeProduct.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {safeProduct.savings && safeProduct.savings > 0 && (
                  <span className="text-orange-500 font-semibold">save £{safeProduct.savings.toFixed(2)}</span>
                )}
              </div>
            )}
          </div>

          {/* Delivery Information */}
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Free delivery {safeProduct.freeDelivery}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
