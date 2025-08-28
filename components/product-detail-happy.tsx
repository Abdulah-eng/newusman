"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Heart, MessageCircle, Shield, ChevronDown, ChevronUp, ShoppingCart, Truck, Clock, Leaf, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Layers, Waves, Moon, Crown, RefreshCw, Minimize, Wrench, Palette, DollarSign, Baby, Award, ShieldCheck, Package, Ruler, Users, Zap, Home, Trees, Square, Maximize, ArrowUp, Radio, VolumeX } from "lucide-react"
import Image from "next/image"


import { useCart } from "@/lib/cart-context"

import { BasketSidebar } from "@/components/basket-sidebar"
import { SizeSelectionModal } from "@/components/size-selection-modal"
import { ColorSelectionModal } from "@/components/color-selection-modal"

export interface ProductDetailHappyProps {
  product: {
    id: number
    name: string
    brand: string
    brandColor: string
    badge: string
    badgeColor: string
    image: string
    images?: string[]
    rating: number
    reviewCount: number
    features: string[]
    originalPrice: number
    currentPrice: number
    savings: number
    freeDelivery: string
    sizes: string[]
    selectedSize?: string
    category?: string
    type?: string
    colors?: string[]
    materials?: string[]
    dimensions?: {
      height: string
      length: string
      width: string
      mattress_size: string
      max_height: string
      weight_capacity: string
      pocket_springs: string
      comfort_layer: string
      support_layer: string
    }
    dispatchTime?: string
    reasonsToBuy?: string[]
    promotionalOffers?: any[]
    productQuestions?: any[]
    warrantyInfo?: any
    careInstructions?: string
    stockQuantity?: number
    inStock?: boolean
    shortDescription?: string
    longDescription?: string
    setupService?: boolean
    setupCost?: number
    monthlyPrice?: number
    comfortLevel?: string
    firmness?: string
    firmnessLevel?: number
    firmnessScale?: string
    supportLevel?: string | number
    pressureReliefLevel?: string | number
    airCirculationLevel?: string | number
    durabilityLevel?: string | number
    certifications?: string[]
    inStore?: boolean
    onSale?: boolean
    // DB marketing arrays
    reasonsToLove?: string[]
    customReasons?: string[]
  }
}

export function ProductDetailHappy({ product }: ProductDetailHappyProps) {
  // Helper function to convert string characteristics to numeric values for sliders
  const getCharacteristicValue = (value: string | number | undefined, type: 'support' | 'pressure' | 'air' | 'durability' | 'firmness'): number => {
    console.log(`[getCharacteristicValue] Input: value="${value}", type="${type}"`)
    
    if (typeof value === 'number') {
      console.log(`[getCharacteristicValue] Returning numeric value: ${value}`)
      return value
    }
    
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()
      console.log(`[getCharacteristicValue] Processing string value: "${lowerValue}"`)
      
      switch (type) {
        case 'support':
        case 'durability':
          if (lowerValue === 'low') return 3
          if (lowerValue === 'medium') return 6
          if (lowerValue === 'high') return 9
          break
        case 'pressure':
          if (lowerValue === 'low' || lowerValue === 'basic') return 3
          if (lowerValue === 'medium') return 6
          if (lowerValue === 'high' || lowerValue === 'advanced') return 9
          break
        case 'air':
          if (lowerValue === 'low' || lowerValue === 'good') return 3
          if (lowerValue === 'medium' || lowerValue === 'better') return 6
          if (lowerValue === 'high' || lowerValue === 'best') return 9
          break
        case 'firmness':
          if (lowerValue === 'soft') return 2
          if (lowerValue === 'soft-medium' || lowerValue === 'softMedium') return 4
          if (lowerValue === 'medium') return 6
          if (lowerValue === 'medium-firm' || lowerValue === 'mediumFirm') return 7
          if (lowerValue === 'firm') return 8
          if (lowerValue === 'extra-firm' || lowerValue === 'extraFirm') return 9
          break
      }
    }
    
    // Default values
    const defaultValue = (() => {
      switch (type) {
        case 'support': return 6
        case 'pressure': return 6
        case 'air': return 6
        case 'durability': return 9
        case 'firmness': return 6
        default: return 6
      }
    })()
    
    console.log(`[getCharacteristicValue] Using default value: ${defaultValue}`)
    return defaultValue
  }

  // Safety check for product data
  if (!product || !product.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  // Debug: Log product characteristics
  console.log('[Product Detail] Product characteristics:', {
    firmnessScale: product.firmnessScale,
    supportLevel: product.supportLevel,
    pressureReliefLevel: product.pressureReliefLevel,
    airCirculationLevel: product.airCirculationLevel,
    durabilityLevel: product.durabilityLevel
  })

  const router = useRouter()
  const { dispatch, validateItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(product.images && product.images.length ? product.images[0] : product.image)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const [basketSidebarOpen, setBasketSidebarOpen] = useState(false)
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [colorModalOpen, setColorModalOpen] = useState(false)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ description: true })
  // Build a list of "Features you'll love" for reuse in the Product Features section
  const buildYouWillLoveFeatures = () => {
    // Map DB feature labels to meaningful icons
    const getFeatureIcon = (label: string) => {
      const text = (label || '').toLowerCase()
      if (text.includes('adjustable-base') || (text.includes('adjustable') && text.includes('base'))) return () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path d="M3 14h18"/>
          <path d="M5 10h8l2 2"/>
          <rect x="3" y="14" width="18" height="4" rx="1"/>
        </svg>
      )
      if (text.includes('memory') || text.includes('foam')) return () => <Brain className="h-4 w-4" />
      if (text.includes('pocket') || text.includes('spring')) return () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
          <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
          <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
          <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
        </svg>
      )
      if (text.includes('cool') || text.includes('breath') || text.includes('air')) return () => <Waves className="h-4 w-4" />
      if (text.includes('gel') || text.includes('temperature')) return () => <Snowflake className="h-4 w-4" />
      if (text.includes('edge')) return () => <Shield className="h-4 w-4" />
      if (text.includes('support') || text.includes('orth')) return () => <Heart className="h-4 w-4" />
      if (text.includes('anti') || text.includes('bacterial') || text.includes('microbial')) return () => <ShieldCheck className="h-4 w-4" />
      if (text.includes('hypo') || text.includes('allergen')) return () => <Feather className="h-4 w-4" />
      if (text.includes('eco') || text.includes('organic') || text.includes('sustain') || text.includes('bamboo')) return () => <Leaf className="h-4 w-4" />
      if (text.includes('warranty')) return () => <Award className="h-4 w-4" />
      if (text.includes('delivery') || text.includes('shipping')) return () => <Truck className="h-4 w-4" />
      if (text.includes('washable') || text.includes('removable') || text.includes('cover')) return () => <PackageOpen className="h-4 w-4" />
      if (text.includes('value') || text.includes('price') || text.includes('save')) return () => <DollarSign className="h-4 w-4" />
      if (text.includes('durable') || text.includes('long')) return () => <Zap className="h-4 w-4" />
      if (text.includes('luxury') || text.includes('premium')) return () => <Gem className="h-4 w-4" />
      // Fallback icon
      return () => <Check className="h-4 w-4" />
    }

    // PRIORITY 1: Use database-provided reasons to love (with descriptions)
    if (product.reasonsToLove && product.reasonsToLove.length > 0) {
      return product.reasonsToLove.map((reason) => ({ 
        label: reason, 
        Icon: getFeatureIcon(reason),
        isFromDatabase: true
      }))
    }

    // PRIORITY 2: Use database-provided features
    if (product.features && product.features.length) {
      return product.features.map((f) => ({ 
        label: f, 
        Icon: getFeatureIcon(f),
        isFromDatabase: true
      }))
    }

    // PRIORITY 3: Fall back to category-specific hardcoded features
    if (product.category === 'mattresses') {
      return [
        { label: 'Pocket Springs', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
            <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
            <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
            <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
          </svg>
        )},
        { label: 'Memory Foam', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )},
        { label: 'Medium Firmness', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="12" cy="8" r="3"/>
            <path d="M12 11v6"/>
            <path d="M8 15h8"/>
            <path d="M6 21h12"/>
          </svg>
        )},
        { label: 'Quilted Tape Edge', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M3 6h18M3 12h18M3 18h18"/>
            <path d="M6 3v18M12 3v18M18 3v18"/>
            <path d="M2 2l20 20M22 2L2 22"/>
          </svg>
        )},
        { label: 'Rotate Feature', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2a10 10 0 0 1 10 10"/>
            <path d="M12 2a10 10 0 0 0-10 10"/>
            <path d="M12 2v20"/>
            <path d="M2 12h20"/>
          </svg>
        )},
        { label: 'Recon Foam', Icon: Layers },
        { label: 'Blue Foam', Icon: Droplet },
        { label: 'Coil Spring', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
            <path d="M12 6v12M6 12h12"/>
            <path d="M8 8l8 8M16 8L8 16"/>
          </svg>
        )},
        { label: 'Latex Foam', Icon: Leaf },
        { label: 'Reflex Foam', Icon: ArrowLeftRight },
        { label: 'Cool Blue Foam', Icon: Snowflake },
        { label: 'High Density Memory', Icon: Layers },
        { label: '3-Zone Support', Icon: Grid },
        { label: '5-Zone Support', Icon: Grid },
        { label: '7-Zone Support', Icon: Grid },
        { label: 'GelTech Foam', Icon: Droplet },
        { label: 'Marble Gel', Icon: Gem },
        { label: 'Foam Encapsulated', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
            <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
            <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
            <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
          </svg>
        )},
        { label: 'Soft Firm', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="12" cy="8" r="3"/>
            <path d="M12 11v6"/>
            <path d="M8 15h8"/>
            <path d="M6 21h12"/>
          </svg>
        )},
        { label: 'Medium Firm', Icon: SlidersHorizontal },
        { label: 'Firm', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="12" cy="8" r="3"/>
            <path d="M12 11v6"/>
            <path d="M8 15h8"/>
            <path d="M6 21h12"/>
          </svg>
        )},
        { label: 'Eco Friendly', Icon: Recycle },
        { label: 'Waterproof Cover', Icon: Umbrella },
        { label: 'Removable Cover', Icon: Scroll },
        { label: 'Washable Cover', Icon: Waves },
        { label: 'Double Side', Icon: ArrowLeftRight },
        { label: 'Rolled Up', Icon: Scroll },
        { label: '8-Zone Support', Icon: Grid },
        { label: '10-Zone Support', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M3 6h18M3 12h18M3 18h18"/>
            <path d="M2.5 3v18M5 3v18M7.5 3v18M10 3v18M12.5 3v18M15 3v18M17.5 3v18M20 3v18M22.5 3v18M25 3v18"/>
            <circle cx="2.5" cy="6" r="0.4" fill="currentColor"/>
            <circle cx="5" cy="12" r="0.4" fill="currentColor"/>
            <circle cx="7.5" cy="18" r="0.4" fill="currentColor"/>
            <circle cx="10" cy="12" r="0.4" fill="currentColor"/>
            <circle cx="12.5" cy="6" r="0.4" fill="currentColor"/>
            <circle cx="15" cy="18" r="0.4" fill="currentColor"/>
            <circle cx="17.5" cy="12" r="0.4" fill="currentColor"/>
            <circle cx="20" cy="6" r="0.4" fill="currentColor"/>
            <circle cx="22.5" cy="18" r="0.4" fill="currentColor"/>
            <circle cx="25" cy="12" r="0.4" fill="currentColor"/>
          </svg>
        )},
        { label: 'Revo Vasco Foam', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            <path d="M8 14l2 2 6-6"/>
          </svg>
        )},
        { label: 'Comfort Foam', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )},
        { label: 'Gel Infused', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
            <path d="M12 4v16"/>
            <path d="M8 8h8"/>
            <path d="M8 12h8"/>
            <path d="M8 16h8"/>
            <circle cx="12" cy="6" r="1" fill="currentColor"/>
            <circle cx="12" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="14" r="1" fill="currentColor"/>
            <circle cx="12" cy="18" r="1" fill="currentColor"/>
          </svg>
        )},
        { label: 'Polyester Fillings', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M3 3h18v18H3z"/>
            <path d="M6 6h12v12H6z"/>
            <path d="M9 9h6v6H9z"/>
            <path d="M12 6v12"/>
            <path d="M6 12h12"/>
          </svg>
        )},
        { label: 'Fiber Fillings', Icon: Feather },
        { label: 'Foam Fillings', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M3 3h18v18H3z"/>
            <path d="M6 6h12v12H6z"/>
            <path d="M9 9h6v6H9z"/>
            <path d="M12 6v12"/>
            <path d="M6 12h12"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        )},
        { label: 'Memory Flakes', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
            <path d="M12 4v16"/>
            <path d="M8 8h8"/>
            <path d="M8 12h8"/>
            <path d="M8 16h8"/>
            <circle cx="8" cy="8" r="1" fill="currentColor"/>
            <circle cx="16" cy="8" r="1" fill="currentColor"/>
            <circle cx="8" cy="16" r="1" fill="currentColor"/>
            <circle cx="16" cy="16" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
          </svg>
        )},
        { label: 'Foam Flakes', Icon: Snowflake },
        { label: 'Eco Foam', Icon: Sprout },
        { label: 'Memory Latex', Icon: Brain },
        { label: 'Removable Zip Cover', Icon: PackageOpen },
        { label: 'Hard Rock', Icon: Mountain },
      ]
    }
    
    if (product.category === 'kids') {
      return [
        { label: 'Safe Materials', Icon: Shield },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Durable Build', Icon: Zap },
        { label: 'Comfortable', Icon: Heart },
        { label: 'Supportive', Icon: Layers },
        { label: 'Breathable', Icon: Feather },
        { label: 'Lightweight', Icon: Minimize },
        { label: 'Fun Designs', Icon: Star },
        { label: 'Washable', Icon: Waves },
        { label: 'Quick Delivery', Icon: Truck },
        { label: 'Secure Packing', Icon: Package },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Color Options', Icon: Palette },
        { label: 'Affordable', Icon: DollarSign },
        { label: 'Quality Assured', Icon: Award },
        { label: 'Family Friendly', Icon: Users },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Easy Setup', Icon: Wrench },
        { label: 'Space Saving', Icon: Minimize },
      ]
    }
    
    if (product.category === 'sale' || product.category === 'clearance') {
      return [
        { label: 'Premium quality & durable', Icon: ShieldCheck },
        { label: 'Modern, stylish designs', Icon: Palette },
        { label: 'Ergonomic comfort & support', Icon: Heart },
        { label: 'Luxury hotel-like feel', Icon: Crown },
        { label: 'Space-saving solutions', Icon: Minimize },
        { label: 'Easy setup & assembly', Icon: Wrench },
        { label: 'Washable, removable covers', Icon: Waves },
        { label: 'Next day delivery option', Icon: Truck },
        { label: 'Secure box packing', Icon: Package },
        { label: 'Multiple sizes available', Icon: Ruler },
        { label: 'Variety of colors & finishes', Icon: Palette },
        { label: 'Affordable, value for money', Icon: DollarSign },
        { label: 'Soft yet durable fabric', Icon: Feather },
        { label: 'Eco-friendly materials', Icon: Leaf },
        { label: 'Suitable for kids & adults', Icon: Users },
        { label: 'Strong & sturdy build', Icon: Zap },
        { label: 'Luxury cover choices', Icon: Star },
        { label: '5-star comfort at home', Icon: Home },
        { label: 'Reliable warranty support', Icon: Award },
      ]
    }
    if (product.category === 'pillows') {
      return [
        { label: 'Bounce Back', Icon: ArrowLeftRight },
        { label: 'Box Support', Icon: PackageOpen },
        { label: 'Classic Moulded', Icon: Layers },
        { label: 'Deep Sleep', Icon: Moon },
        { label: 'Memory Flake', Icon: Snowflake },
        { label: 'Memory Foam', Icon: Layers },
        { label: 'Memory Laytech', Icon: Brain },
        { label: 'Pure Luxury', Icon: Gem },
        { label: 'Soft Touch', Icon: Feather },
        { label: 'Super Support', Icon: Shield },
        { label: 'Value Pillow', Icon: DollarSign },
        { label: 'Shredded Foam', Icon: Layers },
        { label: 'Recon Shredded Foam', Icon: Layers },
        { label: 'Bamboo Pillow', Icon: Leaf },
        { label: 'Polyester Filling', Icon: Feather },
        { label: 'Next Day Delivery', Icon: Truck },
        { label: 'Box Packed', Icon: PackageOpen },
        { label: 'Luxury Cover', Icon: Gem },
        { label: 'Hotel Vibe', Icon: Crown },
      ]
    }
    
    if (product.category === 'beds') {
      return [
        { label: 'Sturdy Frame', Icon: Zap },
        { label: 'Premium Wood', Icon: Trees },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Headboard Design', Icon: Square },
        { label: 'Footboard Style', Icon: Square },
        { label: 'Storage Options', Icon: Package },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Classic Style', Icon: Crown },
        { label: 'Durable Build', Icon: Shield },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Space Efficient', Icon: Minimize },
        { label: 'Color Choices', Icon: Palette },
        { label: 'Warranty', Icon: Award },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packing', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Stable Support', Icon: Layers },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
      ]
    }
    
    if (product.category === 'sofas') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Comfortable Seating', Icon: Heart },
        { label: 'Durable Frame', Icon: Zap },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Multiple Colors', Icon: Palette },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Spacious', Icon: Maximize },
        { label: 'Reclining Options', Icon: ArrowLeftRight },
        { label: 'Storage Compartments', Icon: Package },
        { label: 'Convertible Design', Icon: RefreshCw },
        { label: 'Premium Foam', Icon: Layers },
        { label: 'Stain Resistant', Icon: Shield },
        { label: 'Quick Assembly', Icon: Clock },
        { label: 'Warranty Coverage', Icon: Award },
        { label: 'Fast Shipping', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Family Friendly', Icon: Users },
      ]
    }
    
    if (product.category === 'bunkbeds') {
      return [
        { label: 'Space Saving', Icon: Minimize },
        { label: 'Sturdy Construction', Icon: Zap },
        { label: 'Safety Rails', Icon: Shield },
        { label: 'Ladder Access', Icon: ArrowUp },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Premium Materials', Icon: Star },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Color Options', Icon: Palette },
        { label: 'Storage Drawers', Icon: Package },
        { label: 'Trundle Option', Icon: Package },
        { label: 'Safety Certified', Icon: Award },
        { label: 'Durable Build', Icon: Shield },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Kids Safe', Icon: Baby },
      ]
    }
    
    if (product.category === 'toppers') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Cooling Technology', Icon: Snowflake },
        { label: 'Pressure Relief', Icon: Heart },
        { label: 'Easy Fit', Icon: Check },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Washable', Icon: Waves },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Breathable', Icon: Feather },
        { label: 'Anti-Slip', Icon: Shield },
        { label: 'Portable', Icon: Package },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Durable', Icon: Zap },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Comfortable', Icon: Heart },
        { label: 'Supportive', Icon: Layers },
      ]
    }
    
    if (product.category === 'bed-frames') {
      return [
        { label: 'Sturdy Construction', Icon: Zap },
        { label: 'Premium Materials', Icon: Star },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Classic Style', Icon: Crown },
        { label: 'Color Options', Icon: Palette },
        { label: 'Storage Options', Icon: Package },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Space Efficient', Icon: Minimize },
        { label: 'Durable Build', Icon: Shield },
        { label: 'Warranty Coverage', Icon: Award },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Stable Support', Icon: Layers },
        { label: 'Adjustable Height', Icon: SlidersHorizontal },
        { label: 'Anti-Slip Feet', Icon: Shield },
      ]
    }
    
    if (product.category === 'bedding') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Soft Touch', Icon: Feather },
        { label: 'Breathable', Icon: Feather },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Care', Icon: Waves },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Color Options', Icon: Palette },
        { label: 'Pattern Choices', Icon: Palette },
        { label: 'Quick Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Comfortable', Icon: Heart },
        { label: 'Durable', Icon: Zap },
        { label: 'Washable', Icon: Waves },
        { label: 'Anti-Wrinkle', Icon: Shield },
        { label: 'Temperature Regulating', Icon: Snowflake },
        { label: 'Moisture Wicking', Icon: Droplet },
        { label: 'Family Friendly', Icon: Users },
      ]
    }
    
    if (product.category === 'adjustable-bases') {
      return [
        { label: 'Motorized Control', Icon: Zap },
        { label: 'Multiple Positions', Icon: SlidersHorizontal },
        { label: 'Remote Control', Icon: Radio },
        { label: 'USB Ports', Icon: Zap },
        { label: 'Quiet Operation', Icon: VolumeX },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Color Options', Icon: Palette },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Space Efficient', Icon: Minimize },
        { label: 'Durable Build', Icon: Shield },
        { label: 'Warranty Coverage', Icon: Award },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Stable Support', Icon: Layers },
        { label: 'Anti-Slip', Icon: Shield },
      ]
    }
    
    if (product.category === 'box-springs') {
      return [
        { label: 'Premium Construction', Icon: Star },
        { label: 'Sturdy Frame', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Color Options', Icon: Palette },
        { label: 'Quick Setup', Icon: Clock },
        { label: 'Space Efficient', Icon: Minimize },
        { label: 'Durable Build', Icon: Shield },
        { label: 'Warranty Coverage', Icon: Award },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Professional Finish', Icon: Star },
        { label: 'Easy Maintenance', Icon: Wrench },
        { label: 'Long Lasting', Icon: Clock },
        { label: 'Stable Support', Icon: Layers },
        { label: 'Anti-Slip Feet', Icon: Shield },
        { label: 'Adjustable Height', Icon: SlidersHorizontal },
        { label: 'Premium Materials', Icon: Gem },
        { label: 'Comfortable', Icon: Heart },
      ]
    }
    
    // Default: use product.features fallback
    if (product.features && product.features.length) {
      return product.features.map((f) => ({ label: f, Icon: Check }))
    }
    return []
  }

  const youWillLoveFeatures = buildYouWillLoveFeatures()

  // Client-side log to quickly confirm presence of reasons arrays
  useEffect(() => {
    try {
      // These may be large; log sizes and sample values
      console.log('[YouWillLove] reasonsToLove count:', (product as any).reasonsToLove?.length || 0, 'sample:', (product as any).reasonsToLove?.[0])
      console.log('[YouWillLove] customReasons count:', (product as any).customReasons?.length || 0, 'sample:', (product as any).customReasons?.[0])
    } catch {}
  }, [product])



  const addToCart = () => {
    // Get current variant price based on selected options
    const currentVariantPrice = (() => {
      const hasSizes = Array.isArray(sizeData) && sizeData.length > 0
      if (!hasSizes || !(product as any).variants || (product as any).variants.length === 0) {
        return product.currentPrice || 0
      }
      
      // Find variant that matches selected size and color
      const matchingVariant = (product as any).variants.find((variant: any) => {
        const sizeMatch = hasSizes ? variant.size === selectedSize : true
        const colorMatch = !selectedColor || variant.color === selectedColor
        return sizeMatch && colorMatch
      })
      
      return matchingVariant ? (matchingVariant.currentPrice || matchingVariant.originalPrice || 0) : (product.currentPrice || 0)
    })()

    // Validate size and color selection
    const hasSizes = Array.isArray(sizeData) && sizeData.length > 0
    const hasColors = Array.isArray((product as any).variants) && (product as any).variants.some((v: any) => Boolean(v.color))
    const validation = validateItem(
      {
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        image: selectedImage || product.image,
        currentPrice: currentVariantPrice,
        originalPrice: product.originalPrice,
        size: selectedSizeData?.name,
        color: selectedColor
      },
      selectedSizeData?.name,
      selectedColor,
      { requireSize: hasSizes, requireColor: hasColors }
    )

    if (!validation.isValid) {
      // Show appropriate modal based on what's missing
      if (validation.missingFields.includes('size')) {
        setSizeModalOpen(true)
        return
      }
      if (validation.missingFields.includes('color')) {
        setColorModalOpen(true)
        return
      }
    }

    // Add to cart logic here
    console.log(`Adding ${quantity} ${product.name} to cart`)
    
    // Actually add the item to cart using cart context
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        image: selectedImage || product.image,
        currentPrice: currentVariantPrice,
        originalPrice: product.originalPrice,
        size: selectedSizeData?.name || 'Standard',
        color: selectedColor
      }
    })
    
    // Open the basket sidebar instead of the old modal
    setBasketSidebarOpen(true)
  }

  const [isButtonSticky, setIsButtonSticky] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentSofaImage, setCurrentSofaImage] = useState(0)
  const buttonRef = useRef<HTMLDivElement>(null)
  
  // Sofa images array for the carousel
  const sofaImages = product.images && product.images.length > 0 ? product.images : [product.image]

  // Dynamic size data from variants (data-driven)
  const sizeData = (() => {
    if (Array.isArray((product as any).variants) && (product as any).variants.length > 0) {
      // Only consider entries that actually have a size defined
      const sized = ((product as any).variants as Array<any>).filter(v => Boolean(v.size))
      if (sized.length > 0) {
        // Group by size and take the lowest price per size
        const sizeToLowestPrice = new Map<string, { wasPrice: number; currentPrice: number }>()
        sized.forEach(v => {
          const sizeKey = (v.size as string).toString()
          const current = Number(v.currentPrice ?? v.current_price ?? 0)
          const original = Number(v.originalPrice ?? v.original_price ?? current)
          const prev = sizeToLowestPrice.get(sizeKey)
          if (!prev) {
            sizeToLowestPrice.set(sizeKey, { wasPrice: original, currentPrice: current })
          } else {
            sizeToLowestPrice.set(sizeKey, {
              wasPrice: Math.min(prev.wasPrice, original),
              currentPrice: Math.min(prev.currentPrice, current)
            })
          }
        })
        const entries = Array.from(sizeToLowestPrice.entries()).map(([name, price]) => ({
          name,
          dimensions: `${name} dimensions`,
          availability: (product as any).inStock ? 'In Stock' : 'Dispatched within 45 Days',
          inStock: Boolean((product as any).inStock),
          wasPrice: price.wasPrice || 0,
          currentPrice: price.currentPrice || 0
        }))
        if (entries.length > 0) return entries
      }
    }
    // If no sizes exist, return an empty list to indicate size is not applicable
    return []
  })()
  
  // Ensure we have valid prices
  const originalPrice = product.originalPrice || product.currentPrice || 0
  const currentPrice = product.currentPrice || product.originalPrice || 0
  const hasValidPrices = originalPrice > 0 && currentPrice > 0
  

  
  const [selectedSize, setSelectedSize] = useState(() => {
    // Preselect the size with the lowest price when sizes exist
    if (Array.isArray(sizeData) && sizeData.length > 0) {
      const lowest = [...sizeData].sort((a, b) => a.currentPrice - b.currentPrice)[0]
      return lowest?.name || ''
    }
    return ''
  })
  
  // Get the selected size data with fallback
  const selectedSizeData = selectedSize ? sizeData.find(size => size.name === selectedSize) : null

  // Safe monthly price calculation - use product prices when no size is selected
  const monthlyPrice = selectedSizeData?.currentPrice ? Math.floor(selectedSizeData.currentPrice / 12) : Math.floor((product.currentPrice || currentPrice) / 12)

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image]



  // Carousel navigation functions
  const goToNextImage = () => {
    const currentIndex = gallery.findIndex(img => img === selectedImage);
    const newIndex = (currentIndex + 1) % gallery.length;
    setSelectedImage(gallery[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const goToPreviousImage = () => {
    const currentIndex = gallery.findIndex(img => img === selectedImage);
    const newIndex = currentIndex <= 0 ? gallery.length - 1 : currentIndex - 1;
    setSelectedImage(gallery[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  // Update current index when selected image changes
  useEffect(() => {
    const index = gallery.findIndex(img => img === selectedImage);
    setCurrentImageIndex(index >= 0 ? index : 0);
  }, [selectedImage, gallery]);



  // Scroll effect for sticky button - enabled for both mobile and desktop
  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        // Button becomes sticky when it's about to go out of view (with a small buffer)
        const isPastButton = rect.bottom < window.innerHeight - 20
        setIsButtonSticky(isPastButton)
      }
    }

    const handleResize = () => {
      // Reset sticky state when resizing
      setIsButtonSticky(false);
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])



  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <>
      <style jsx>{`
        .safe-area-bottom {
          padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
        }
        @media (max-width: 640px) {
          .safe-area-bottom {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
        }
        .mobile-sticky-button {
          max-width: 100vw;
          width: 100vw;
          left: 0;
          right: 0;
        }
      `}</style>
      <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 lg:p-4 pb-20 sm:pb-24 lg:pb-4">
      

      

      
      {/* Mobile: Product Details First */}
      <div className="lg:hidden mb-8 bg-white border-b border-gray-200">
        {/* Product Details Section for Mobile */}
        <div className="space-y-4">
          {/* Merged Product Info & Size Card */}
          <div className="rounded-xl p-4 sm:p-6 bg-white shadow-lg border border-gray-100">
            {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 break-words">{product.name}</h1>
              
              {/* White Box with Reviews, Stars, and Savings - Always Visible */}
              <div className="bg-white border-0 rounded-lg p-3 mb-4 max-w-full overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                                              <span className="text-sm sm:text-lg text-gray-800 break-words">
                          {selectedSizeData && selectedSizeData.wasPrice && selectedSizeData.currentPrice && selectedSizeData.wasPrice > selectedSizeData.currentPrice ? (
                            `Save £${(selectedSizeData.wasPrice - selectedSizeData.currentPrice).toFixed(2)}`
                          ) : selectedSizeData ? (
                            `£${selectedSizeData.currentPrice.toFixed(2)}`
                          ) : (
                            `£${product.currentPrice.toFixed(2)}`
                          )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < (product.rating || 4) ? "text-orange-500 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-800">{product.reviewCount || 0}</span>
                    </div>
                  </div>
                </div>
              
            {/* Size and Pricing Section */}
            {/* Product Info Card - Shows pricing when size is selected, otherwise shows base product pricing */}
            {selectedSizeData ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                {/* Left Side: Size Name and Pricing */}
                <div className="flex-1 min-w-0">
                  {/* Size Name */}
                  <div className="font-black text-lg sm:text-xl lg:text-2xl text-black mb-3 break-words">{selectedSizeData.name}</div>
                  
                  {/* Pricing - Now under the size name */}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 line-through">Was £{selectedSizeData.wasPrice > 0 ? selectedSizeData.wasPrice.toFixed(2) : '0.00'}</div>
                    <div className="text-2xl font-black text-orange-600">£{selectedSizeData.currentPrice > 0 ? selectedSizeData.currentPrice.toFixed(2) : '0.00'}</div>
                  </div>
                </div>
                
                {/* Right Side: Dimensions and Availability */}
                <div className="text-left sm:text-right sm:ml-4 min-w-0">
                  {/* Dimensions */}
                  <div className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 mb-3 break-words">{selectedSizeData.dimensions}</div>
                  
                  {/* Availability Status */}
                  <div className="flex items-center gap-2">
                    {selectedSizeData.inStock ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-sm font-medium break-words">{selectedSizeData.availability}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-sm font-medium break-words">{selectedSizeData.availability}</span>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  {/* Left Side: Base Product Pricing */}
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-gray-600 mb-2">Starting Price</div>
                    <div className="space-y-1">
                      {(() => {
                        const vars = ((product as any).variants || []) as Array<any>
                        const lowestPrice = vars.length > 0 
                          ? Math.min(...vars.map((v: any) => Number(v.currentPrice || v.originalPrice || 0)))
                          : product.currentPrice || 0
                        const originalPrice = product.originalPrice || 0
                        
                        return (
                          <>
                            {originalPrice > lowestPrice && (
                              <div className="text-sm text-gray-500 line-through">Was £{originalPrice.toFixed(2)}</div>
                            )}
                            <div className="text-2xl font-black text-orange-600">£{lowestPrice.toFixed(2)}</div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  
                  {/* Right Side: Size Selection Prompt */}
                  <div className="text-left sm:text-right sm:ml-4 min-w-0">
                    <div className="text-lg font-semibold text-gray-600 mb-2">Select a size to see pricing</div>
                    <div className="text-sm text-gray-500">Choose from available sizes below</div>
                </div>
              </div>
            </div>
            )}
              
              {/* Product Features - Commented out to prevent showing hardcoded features */}
              {/* <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Product Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {youWillLoveFeatures.map(({ label, Icon }, index) => (
                      <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 text-orange-500 flex-shrink-0">
                        {typeof Icon === 'function' ? <Icon /> : null}
                        </div>
                      <span className="text-sm text-gray-700 break-words">{label}</span>
                      </div>
                  ))}
                        </div>
              </div> */}
            </div>

            {/* Choose Size - Clickable Option - White Button */}
            {Array.isArray(sizeData) && sizeData.length > 0 && (
            <div className="border-0 rounded-lg p-4 bg-white mb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setSizeModalOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold text-lg">Choose Size</span>
                </div>
                <div className="w-6 h-6 text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
            )}

                        {/* Color & Other Options Selection - Clickable Option - White Button */}
            {/* Only show if variants have color, depth, or firmness options */}
            {(() => {
              const hasColorOptions = (product as any).variants?.some((v: any) => v.color) || false
              const hasDepthOptions = (product as any).variants?.some((v: any) => v.depth) || false
              const hasFirmnessOptions = (product as any).variants?.some((v: any) => v.firmness) || false
              const hasOtherOptions = hasColorOptions || hasDepthOptions || hasFirmnessOptions
              
              if (!hasOtherOptions) return null
              
              return (
                <div className="border-0 rounded-lg p-4 bg-white mb-2">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setColorModalOpen(true)}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 text-gray-600">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 004 4h4a2 2 0 002-2V5z"/>
                        </svg>
                      </div>
                      <span className="text-gray-700 font-semibold text-lg">
                        Choose Colour & Other Options
                      </span>
                    </div>
                    <div className="w-6 h-6 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })()}
            {/* Modern Unified Quantity and Add to Basket Button */}
            <div className="space-y-4" ref={buttonRef}>
            {/* Enhanced Single Button with Modern Design */}
            <div className="relative group">
              {/* Main Button Background with Orange Theme and Enhanced Styling */}
                  <button 
                onClick={addToCart} 
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white text-lg py-7 rounded-2xl transition-all duration-300 flex items-center justify-start relative overflow-hidden pl-6 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] border border-orange-400/20"
              >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Add to Basket Text with Enhanced Typography */}
                <div className="relative z-10 flex items-center gap-3">
                  {/* Improved Shopping Cart Icon - Matching the Choose Size button style */}
                  <div className="w-6 h-6 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-bold text-xl tracking-wide">Add to Basket</span>
                  </div>
                </div>
                  </button>
              
              {/* Enhanced Quantity Controls Overlay - Smaller Size and Closer to Corner */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {/* Minus Button with Smaller Size */}
                  <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    quantity > 1 && setQuantity(quantity - 1);
                  }}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group/btn"
                  disabled={quantity <= 1}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-3 h-3 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                    </svg>
                  </button>
                
                {/* Enhanced Quantity Display - Smaller Size */}
                <div className="relative">
                  <div className="w-12 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white tracking-wide">{quantity}</span>
                </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-sm scale-110"></div>
              </div>
              
                {/* Plus Button with Smaller Size */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity + 1);
                  }}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group/btn"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-3 h-3 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
            </div>

              {/* Subtle Bottom Glow Effect - Orange Theme */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-y-1/2 w-4/5 h-2 bg-orange-600/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Klarna Payment Option */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-5 bg-pink-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">Klarna</span>
              </div>
              <div className="text-sm text-gray-700">
                3 payments of <span className="font-semibold">£{((selectedSizeData?.currentPrice || currentPrice) / 3).toFixed(2)}</span> at 0% interest with <span className="font-semibold">Klarna</span>
              </div>
            </div>
            <div className="text-sm text-primary underline cursor-pointer">Learn more</div>
          </div>
        </div>
      </div>



      {/* Desktop: Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 relative">
        {/* Left: gallery - takes 3/5 of the width */}
        <div className="lg:col-span-3 min-w-0">
          <div className="z-10">
            {/* Main Large Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 cursor-pointer mb-4" onClick={() => {
              const currentIndex = gallery.findIndex(img => img === selectedImage);
              setModalImageIndex(currentIndex >= 0 ? currentIndex : 0);
              setImageModalOpen(true);
            }}>
              <Image 
                src={selectedImage || product.image || "/placeholder.svg"} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
                onError={(e) => {
                  console.error('Image failed to load:', e)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
            
            {/* Image Carousel with Navigation Arrows */}
            {gallery.length > 1 && (
              <div className="mb-4">
                {/* Carousel Container */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Left Navigation Arrow */}
                  <button
                    onClick={goToPreviousImage}
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 z-10 group"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Image Thumbnails */}
                  <div className="flex gap-2 sm:gap-3 flex-1 overflow-hidden">
                    {gallery.map((image, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(image)}
                        className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer group flex-shrink-0 ${
                          selectedImage === image 
                            ? "border-orange-500 ring-2 ring-orange-200 scale-105" 
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <Image 
                          src={image} 
                          alt={`${product.name} ${idx + 1}`} 
                          fill 
                          className="object-cover"
                        />
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 ${
                          selectedImage === image ? 'bg-orange-500/20' : ''
                        }`}></div>
                        

                      </div>
                    ))}
                  </div>
                  
                  {/* Right Navigation Arrow */}
                  <button
                    onClick={goToNextImage}
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 z-10 group"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Premium Sleep Experience Section - Beneath the image gallery */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg mt-8">
            {/* 1. Premium Sleep Experience Header */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  Premium Sleep Experience
                </h2>
              </div>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium mb-4">
                {product.longDescription || `Experience the perfect blend of luxury comfort and advanced technology. Our premium mattress combines 1000 individual pocket springs with memory foam layers for exceptional support and ultimate relaxation.`}
              </p>
              
              <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-xs sm:text-sm">10-Year Warranty • Free Delivery • 100-Night Trial</span>
              </div>
            </div>

            {/* 2. Reasons to Buy */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-6">Reasons to Buy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                {/* Use customReasons explicitly */}
                {(product.customReasons && product.customReasons.length > 0) ? (
                  product.customReasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed">{reason}</div>
                        {(product as any).customReasonsDescriptions?.[index] && (
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">{(product as any).customReasonsDescriptions[index]}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* Fallback Reasons */}
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Premium quality pocket spring construction</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Advanced memory foam comfort layers</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Superior edge-to-edge support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Temperature regulating technology</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">10-year warranty for peace of mind</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">100-night sleep trial guarantee</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 3. Features You'll Love */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Features you'll love</h2>
                </div>
              
              {/* Use reasonsToLove only for “Features you'll love” */}
              {(product.reasonsToLove && product.reasonsToLove.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {(product.reasonsToLove || []).map((label: string, idx: number) => {
                    const IconComp = (() => {
                      const text = (label || '').toLowerCase()
                      if (text.includes('memory') || text.includes('foam')) return () => <Brain className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('pocket') || text.includes('spring')) return () => (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 sm:h-10 sm:w-10">
                          <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                          <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
                          <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
                          <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
                        </svg>
                      )
                      if (text.includes('cool') || text.includes('breath') || text.includes('air')) return () => <Waves className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('gel') || text.includes('temperature')) return () => <Snowflake className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('edge')) return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('support') || text.includes('orth')) return () => <Heart className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('anti') || text.includes('bacterial') || text.includes('microbial')) return () => <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('hypo') || text.includes('allergen')) return () => <Feather className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('eco') || text.includes('organic') || text.includes('sustain') || text.includes('bamboo')) return () => <Leaf className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('warranty')) return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('delivery') || text.includes('shipping')) return () => <Truck className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('washable') || text.includes('removable') || text.includes('cover')) return () => <PackageOpen className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('value') || text.includes('price') || text.includes('save')) return () => <DollarSign className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('durable') || text.includes('long')) return () => <Zap className="h-8 w-8 sm:h-10 sm:w-10" />
                      if (text.includes('luxury') || text.includes('premium')) return () => <Gem className="h-8 w-8 sm:h-10 sm:w-10" />
                      return () => <Check className="h-8 w-8 sm:h-10 sm:w-10" />
                    })()
                    return (
                      <div key={`${label}-${idx}`} className="text-center min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500 flex items-center justify-center">
                          {typeof IconComp === 'function' ? <IconComp /> : null}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">{label}</h3>
                        {/* Debug: Log what we're trying to display */}
                        {console.log(`[ProductDetailHappy] Feature ${idx}:`, {
                          label,
                          description: (product as any).reasonsToLoveDescriptions?.[idx],
                          allDescriptions: (product as any).reasonsToLoveDescriptions
                        })}
                        {(product as any).reasonsToLoveDescriptions?.[idx] && (
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{(product as any).reasonsToLoveDescriptions[idx]}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Priority 2: Show minimal fallback only when no database features exist */
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Features will be displayed here when available</p>
                </div>
              )}

              {(!((product.reasonsToLove && product.reasonsToLove.length > 0) || (product.customReasons && product.customReasons.length > 0))
                && (product.category === 'mattresses' || product.category === 'pillows' || product.category === 'kids')) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Support System */}
                <div className="text-center min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                      <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
                      <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
                      <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Pocket Springs</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Individually pocketed springs work to give you support exactly where you need it.
                  </p>
                </div>

                {/* Pillows specific features */}
                {product.category === 'pillows' && (
                <>
                  <div className="text-center min-w-0">
                    <ArrowLeftRight className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Bounce Back</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Returns to shape quickly for consistent comfort.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <PackageOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Edge Support</div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Box Support</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Structured support for better neck alignment.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Layers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Timeless Design</div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Classic Moulded</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Moulded construction for consistent shape.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Moon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Night Comfort</div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Deep Sleep</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Designed to help you sleep deeper and longer.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Snowflake className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Flake</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Flake fill adapts to personalize support.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Layers className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Foam</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Contours to your head and neck for support.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Brain className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Laytech</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Blend of memory and latex-like responsiveness.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Gem className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Pure Luxury</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Indulgent finish and superior materials.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Feather className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Soft Touch</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Ultra-soft outer for cozy comfort.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Shield className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Super Support</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Firm support to keep posture aligned.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Badge className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-white bg-orange-500 flex items-center justify-center">£</Badge>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Value Pillow</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Quality comfort without the premium price.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Layers className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Shredded Foam</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Shredded fill for airflow and adjustability.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Layers className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Recon Shredded Foam</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Supportive blend of recycled foam pieces.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Leaf className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Bamboo Pillow</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Bamboo cover for breathable softness.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Feather className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Polyester Filling</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Soft, durable polyester fiber fill.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Truck className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Next Day Delivery</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Get it delivered as soon as tomorrow.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <PackageOpen className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Box Packed</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Neatly packed for safe arrival.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Gem className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Finish</div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Luxury Cover</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Elevated look and feel with luxury cover.</p>
                  </div>

                  <div className="text-center min-w-0">
                    <Crown className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Vibe</div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Hotel Vibe</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Experience 5-star comfort at home.</p>
                  </div>
                </>
                )}

                
                {/* Comfort Fillings */}
                <div className="text-center min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Moulds to your body, giving orthopaedic support and superb comfort.
                  </p>
                </div>
                
                {/* Firmness */}
                <div className="text-center min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="3"/>
                      <path d="M12 11v6"/>
                      <path d="M8 15h8"/>
                      <path d="M6 21h12"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Medium</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Good all-rounder for front, side or back sleepers.
                  </p>
                </div>

                {/* Quilted Tape Edge */}
                <div className="text-center min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M3 12h18M3 18h18"/>
                      <path d="M6 3v18M12 3v18M18 3v18"/>
                      <path d="M2 2l20 20M22 2L2 22"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Quilted Tape Edge</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Reinforced edges provide maximum support and durability for extended mattress life.
                  </p>
                </div>

                {/* Rotate Feature */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                      <path d="M12 2a10 10 0 0 0-10 10"/>
                      <path d="M12 2v20"/>
                      <path d="M2 12h20"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Maintenance</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Rotate Feature</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Easy rotation design ensures even wear and maintains optimal comfort over time.
                  </p>
                </div>

                {/* Recon Foam */}
                <div className="text-center min-w-0">
                  <Layers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Recon Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    High-quality reconstituted foam provides excellent support and pressure relief.
                  </p>
                </div>

                {/* Blue Foam */}
                <div className="text-center min-w-0">
                  <Droplet className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Cooling Technology</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Blue Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Advanced cooling foam technology regulates temperature for optimal sleep comfort.
                  </p>
                </div>

                {/* Coil Spring */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                      <path d="M12 6v12M6 12h12"/>
                      <path d="M8 8l8 8M16 8L8 16"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Core Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Coil Spring</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Traditional coil spring system provides reliable support and excellent durability.
                  </p>
                </div>

                {/* Latex Foam */}
                <div className="text-center min-w-0">
                  <Leaf className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Natural Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Latex Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Natural latex provides hypoallergenic comfort with excellent bounce and support.
                  </p>
                </div>

                {/* Reflex Foam */}
                <div className="text-center min-w-0">
                  <ArrowLeftRight className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Responsive Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Reflex Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    High-density reflex foam offers superior support and pressure point relief.
                  </p>
                </div>

                {/* Cool Blue Foam */}
                <div className="text-center min-w-0">
                  <Snowflake className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Temperature Control</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Cool Blue Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Advanced cooling technology keeps you comfortable throughout the night.
                  </p>
                </div>

                {/* High Density Memory */}
                <div className="text-center min-w-0">
                  <Layers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">High Density Memory</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Superior memory foam density ensures long-lasting comfort and support.
                  </p>
                </div>

                {/* 3-Zone Support */}
                <div className="text-center min-w-0">
                  <Grid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Targeted Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">3-Zone Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Three distinct support zones provide optimal comfort for head, torso, and legs.
                  </p>
                </div>

                {/* 5-Zone Support */}
                <div className="text-center min-w-0">
                  <Grid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Advanced Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">5-Zone Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Five precision-engineered zones deliver customized support for every body part.
                  </p>
                </div>
                {/* 7-Zone Support */}
                <div className="text-center min-w-0">
                  <Grid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">7-Zone Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Seven specialized zones provide ultimate comfort and pressure relief.
                  </p>
                </div>

                {/* GelTech Foam */}
                <div className="text-center min-w-0">
                  <Droplet className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Advanced Technology</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">GelTech Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Revolutionary gel-infused foam technology for superior comfort and cooling.
                  </p>
                </div>

                {/* Marble Gel */}
                <div className="text-center min-w-0">
                  <Gem className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Luxury Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Marble Gel</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Premium marble gel provides exceptional cooling and pressure relief.
                  </p>
                </div>

                {/* Foam Encapsulated */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                      <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
                      <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
                      <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Enhanced Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Foam Encapsulated</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Foam-encapsulated springs provide superior edge support and durability.
                  </p>
                </div>

                {/* Soft Firm */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="3"/>
                      <path d="M12 11v6"/>
                      <path d="M8 15h8"/>
                      <path d="M6 21h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Firmness Level</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Soft Firm</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Perfect balance of softness and support for ultimate comfort.
                  </p>
                </div>

                {/* Medium Firm */}
                <div className="text-center min-w-0">
                  <SlidersHorizontal className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Firmness Level</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Medium Firm</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Ideal firmness for most sleepers with excellent support.
                  </p>
                </div>

                {/* Firm */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="3"/>
                      <path d="M12 11v6"/>
                      <path d="M8 15h8"/>
                      <path d="M6 21h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Firmness Level</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Firm</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Firm support for those who prefer a more solid sleeping surface.
                  </p>
                </div>

                {/* Eco Friendly */}
                <div className="text-center min-w-0">
                  <Recycle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Sustainability</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Eco Friendly</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Environmentally conscious materials for a better planet and sleep.
                  </p>
                </div>

                {/* Waterproof Cover */}
                <div className="text-center min-w-0">
                  <Umbrella className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Protection</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Waterproof Cover</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Waterproof protection keeps your mattress clean and hygienic.
                  </p>
                </div>

                {/* Removable Cover */}
                <div className="text-center min-w-0">
                  <Scroll className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Easy Care</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Removable Cover</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Easy-to-remove cover for simple cleaning and maintenance.
                  </p>
                </div>

                {/* Washable Cover */}
                <div className="text-center min-w-0">
                  <Waves className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Hygiene</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Washable Cover</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Machine washable cover for easy cleaning and freshness.
                  </p>
                </div>

                {/* Double Side */}
                <div className="text-center min-w-0">
                  <ArrowLeftRight className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Versatility</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Double Side</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Reversible design offers two different comfort levels in one mattress.
                  </p>
                </div>

                {/* Rolled Up */}
                <div className="text-center min-w-0">
                  <Scroll className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Convenience</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Rolled Up</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Compact rolled design for easy transport and storage.
                  </p>
                </div>

                {/* 8-Zone Support */}
                <div className="text-center min-w-0">
                  <Grid className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Ultimate Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">8-Zone Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Eight precision zones deliver ultimate comfort and pressure relief.
                  </p>
                </div>

                {/* 10-Zone Support */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M3 12h18M3 18h18"/>
                      <path d="M2.5 3v18M5 3v18M7.5 3v18M10 3v18M12.5 3v18M15 3v18M17.5 3v18M20 3v18M22.5 3v18M25 3v18"/>
                      <circle cx="2.5" cy="6" r="0.4" fill="currentColor"/>
                      <circle cx="5" cy="12" r="0.4" fill="currentColor"/>
                      <circle cx="7.5" cy="18" r="0.4" fill="currentColor"/>
                      <circle cx="10" cy="12" r="0.4" fill="currentColor"/>
                      <circle cx="12.5" cy="6" r="0.4" fill="currentColor"/>
                      <circle cx="15" cy="18" r="0.4" fill="currentColor"/>
                      <circle cx="17.5" cy="12" r="0.4" fill="currentColor"/>
                      <circle cx="20" cy="6" r="0.4" fill="currentColor"/>
                      <circle cx="22.5" cy="18" r="0.4" fill="currentColor"/>
                      <circle cx="25" cy="12" r="0.4" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Maximum Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">10-Zone Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Ten specialized zones provide maximum comfort and support.
                  </p>
                </div>

                {/* Revo Vasco Foam */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      <path d="M8 14l2 2 6-6"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Technology</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Revo Vasco Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Advanced foam technology for superior comfort and durability.
                  </p>
                </div>

                {/* Comfort Foam */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Enhanced Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Comfort Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Specially designed foam for maximum comfort and relaxation.
                  </p>
                </div>

                {/* Gel Infused */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                      <path d="M12 4v16"/>
                      <path d="M8 8h8"/>
                      <path d="M8 12h8"/>
                      <path d="M8 16h8"/>
                      <circle cx="12" cy="6" r="1" fill="currentColor"/>
                      <circle cx="12" cy="10" r="1" fill="currentColor"/>
                      <circle cx="12" cy="14" r="1" fill="currentColor"/>
                      <circle cx="12" cy="18" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Cooling Technology</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Gel Infused</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Gel-infused foam provides superior cooling and comfort.
                  </p>
                </div>

                {/* Polyester Fillings */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3h18v18H3z"/>
                      <path d="M6 6h12v12H6z"/>
                      <path d="M9 9h6v6H9z"/>
                      <path d="M12 6v12"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium Fillings</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Polyester Fillings</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    High-quality polyester fillings for softness and durability.
                  </p>
                </div>

                {/* Fiber Fillings */}
                <div className="text-center min-w-0">
                  <Feather className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Natural Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fiber Fillings</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Natural fiber fillings for breathable and comfortable sleep.
                  </p>
                </div>

                {/* Foam Fillings */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3h18v18H3z"/>
                      <path d="M6 6h12v12H6z"/>
                      <path d="M9 9h6v6H9z"/>
                      <path d="M12 6v12"/>
                      <path d="M6 12h12"/>
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Supportive Fillings</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Foam Fillings</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    High-density foam fillings for excellent support and comfort.
                  </p>
                </div>

                {/* Memory Flakes */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                      <path d="M12 4v16"/>
                      <path d="M8 8h8"/>
                      <path d="M8 12h8"/>
                      <path d="M8 16h8"/>
                      <circle cx="8" cy="8" r="1" fill="currentColor"/>
                      <circle cx="16" cy="8" r="1" fill="currentColor"/>
                      <circle cx="8" cy="16" r="1" fill="currentColor"/>
                      <circle cx="16" cy="16" r="1" fill="currentColor"/>
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Adaptive Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Flakes</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Memory foam flakes provide adaptive comfort and pressure relief.
                  </p>
                </div>

                {/* Foam Flakes */}
                <div className="text-center min-w-0">
                  <Snowflake className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Flexible Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Foam Flakes</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Foam flakes offer flexible support and excellent breathability.
                  </p>
                </div>

                {/* Super Firm */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="3"/>
                      <path d="M12 11v6"/>
                      <path d="M8 15h8"/>
                      <path d="M6 21h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Firmness Level</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Super Firm</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Maximum firmness for those who prefer ultra-solid support.
                  </p>
                </div>

                {/* Eco Foam */}
                <div className="text-center min-w-0">
                  <Sprout className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Sustainable Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Eco Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Environmentally friendly foam for conscious sleep choices.
                  </p>
                </div>

                {/* Memory Latex */}
                <div className="text-center min-w-0">
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Hybrid Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Latex</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Combination of memory foam and latex for ultimate comfort.
                  </p>
                </div>

                {/* Removable Zip Cover */}
                <div className="text-center min-w-0">
                  <PackageOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Easy Maintenance</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Removable Zip Cover</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Zip-off cover for easy cleaning and maintenance.
                  </p>
                </div>
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <rect x="6" y="6" width="12" height="12" rx="1" ry="1"/>
                      <rect x="9" y="9" width="6" height="6" rx="1" ry="1"/>
                      <path d="M12 6v12"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Firm Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Hard Foam</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    High-density hard foam for maximum support and durability.
                  </p>
                </div>

                {/* Brick Hard */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <rect x="6" y="6" width="12" height="12" rx="1" ry="1"/>
                      <rect x="9" y="9" width="6" height="6" rx="1" ry="1"/>
                      <path d="M12 6v12"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Ultra Firm</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Brick Hard</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Ultra-firm support like sleeping on a solid surface.
                  </p>
                </div>

                {/* Hard Rock */}
                <div className="text-center min-w-0">
                  <Mountain className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500" />
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Maximum Firmness</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Hard Rock</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Maximum firmness for those who prefer rock-solid support.
                  </p>
                </div>

                {/* Customize Firmness */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M12 8v8"/>
                      <path d="M8 12h8"/>
                      <path d="M12 6v2"/>
                      <path d="M12 16v2"/>
                      <path d="M6 12h2"/>
                      <path d="M16 12h2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Personalized Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Customize Firmness</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Adjustable firmness levels for your perfect sleep experience.
                  </p>
                </div>
              </div>
              )}

              {product.category === 'beds' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Wooden Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="10" width="18" height="6" rx="1" ry="1"/>
                      <path d="M4 16v3M20 16v3"/>
                      <path d="M3 10c2-2 4-3 6-3s4 1 6 3"/>
                      <path d="M7 12h6"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Frame Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Wooden Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Sturdy wooden frame with timeless style.</p>
                </div>

                {/* Children Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="8" r="2"/>
                      <path d="M6 14c0-2 6-2 6 0v4H6z"/>
                      <path d="M14 12h4M16 10v4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Kids Friendly</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Children Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Safe, comfy and perfect for little ones.</p>
                </div>

                {/* Easy to Assembly */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 14h8M4 18h8"/>
                      <path d="M14 6l4-2 2 4-8 8-4 1 1-4 8-8z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Setup</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Easy to Assemble</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Quick assembly with simple tools.</p>
                </div>

                {/* Solid Slats */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9h18M3 12h18M3 15h18"/>
                      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Support Base</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Solid Slats</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Durable slats for strong mattress support.</p>
                </div>

                {/* Fabric Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="4" width="16" height="16" rx="2"/>
                      <path d="M4 10h16M10 4v16"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Upholstery</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fabric Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Soft-touch fabric with premium finish.</p>
                </div>

                {/* Ottoman Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="10" width="18" height="6" rx="1"/>
                      <path d="M12 10v-4"/>
                      <path d="M10 6h4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Lift Storage</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Ottoman Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Easy-lift storage under the mattress.</p>
                </div>

                {/* Storage Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="12" width="18" height="6" rx="1"/>
                      <rect x="6" y="13" width="5" height="2" rx="0.5"/>
                      <rect x="13" y="13" width="5" height="2" rx="0.5"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Built-in Storage</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Storage Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Integrated drawers to declutter your room.</p>
                </div>

                {/* Flat Pack Delivery */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="8" width="16" height="10" rx="1"/>
                      <path d="M4 8l8-4 8 4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Packaging</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Flat Pack Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Delivered compact for easy handling.</p>
                </div>

                {/* Next Day Delivery */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Fast Shipping</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Next Day Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Get your bed as soon as tomorrow.</p>
                </div>

                {/* Metal Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="10" width="18" height="6" rx="1"/>
                      <path d="M4 10v-2h4v2M16 10v-2h4v2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Frame Material</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Metal Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Strong steel frame with modern look.</p>
                </div>

                {/* Bunk Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="7" width="16" height="4" rx="1"/>
                      <rect x="4" y="13" width="16" height="4" rx="1"/>
                      <path d="M4 7v10M20 7v10"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Space Saving</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Bunk Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Two beds stacked to maximize space.</p>
                </div>

                {/* Divan Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="12" width="18" height="5" rx="1"/>
                      <rect x="6" y="10" width="12" height="2" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Base Type</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Divan Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Solid base support with clean lines.</p>
                </div>

                {/* Luxury Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12l2-4 4 2 4-2 2 4"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Luxury Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Premium finishes and elegant design.</p>
                </div>

                {/* TV Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="5" width="12" height="8" rx="1"/>
                      <path d="M8 13h8M10 17l2-2 2 2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Entertainment</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">TV Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Built-in TV compartment at the footend.</p>
                </div>

                {/* Bed + Mattress Bundle */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="12" width="18" height="5" rx="1"/>
                      <rect x="5" y="9" width="14" height="3" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Bundle</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Bed + Mattress Bundle</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Great value when purchased together.</p>
                </div>

                {/* Sofa Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="11" width="16" height="5" rx="2"/>
                      <path d="M6 11V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Convertible</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Sofa Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Transforms from sofa to bed in seconds.</p>
                </div>

                {/* Single Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="12" width="14" height="5" rx="1"/>
                      <rect x="7" y="10" width="10" height="2" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Size</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Single Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Perfect for one person or small rooms.</p>
                </div>

                {/* Trundle Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="12" width="16" height="4" rx="1"/>
                      <rect x="6" y="16" width="12" height="3" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Extra Bed</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Trundle Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Pull-out bed for guests or sleepovers.</p>
                </div>

                {/* Bed with Drawers */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="12" width="18" height="5" rx="1"/>
                      <rect x="5" y="13" width="6" height="2" rx="0.5"/>
                      <rect x="13" y="13" width="6" height="2" rx="0.5"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Storage</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Bed with Drawers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Convenient drawers built into the base.</p>
                </div>

                {/* Toddler Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="13" width="12" height="4" rx="1"/>
                      <path d="M6 13v-1a2 2 0 0 1 2-2h5"/>
                      <circle cx="9" cy="9" r="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">For Toddlers</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Toddler Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Low height and safe for toddlers.</p>
                </div>
              </div>
              )}

              {product.category === 'sofas' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Sofa Bed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="11" width="16" height="5" rx="2"/>
                      <path d="M6 11V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Convertible</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Sofa Bed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Converts from sofa to bed for guests.</p>
                </div>

                {/* Pocket Spring */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                      <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Pocket Spring</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Seat support with pocketed springs.</p>
                </div>

                {/* Easy Assembly */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 14h8M4 18h8"/>
                      <path d="M14 6l4-2 2 4-8 8-4 1 1-4 8-8z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Setup</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Easy Assembly</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Simple, tool-friendly setup.</p>
                </div>

                {/* Flat Pack Delivery */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="8" width="16" height="10" rx="1"/>
                      <path d="M4 8l8-4 8 4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Packaging</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Flat Pack Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Compact delivery for easy access.</p>
                </div>

                {/* Leather Sofa */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="10" width="16" height="6" rx="3"/>
                      <path d="M4 10v-1a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Upholstery</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Leather Sofa</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Premium leather for a luxurious feel.</p>
                </div>

                {/* Fabric Sofa */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="10" width="16" height="6" rx="3"/>
                      <path d="M6 10V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1"/>
                      <path d="M6 12l12 2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Upholstery</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fabric Sofa</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Soft-touch fabric in various colors.</p>
                </div>

                {/* Storage Sofa */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="12" width="16" height="4" rx="1"/>
                      <rect x="7" y="13" width="10" height="2" rx="0.5"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Storage</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Storage Sofa</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Hidden storage under the seats.</p>
                </div>

                {/* Self Assembly */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 14h8M4 18h8"/>
                      <path d="M14 6l4-2 2 4-8 8-4 1 1-4 8-8z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">DIY</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Self Assembly</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Assemble yourself with clear guidance.</p>
                </div>

                {/* Solid Wood Structure */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="6" width="16" height="10" rx="2"/>
                      <path d="M6 16v2M18 16v2"/>
                      <path d="M6 10h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Frame</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Solid Wood Structure</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Robust hardwood framing.</p>
                </div>

                {/* Wooden Feet */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="15" width="4" height="4" rx="1"/>
                      <rect x="14" y="15" width="4" height="4" rx="1"/>
                      <path d="M4 15h16"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Legs</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Wooden Feet</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Classic wooden sofa legs.</p>
                </div>

                {/* Chrome Finish Feet */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="15" width="4" height="4" rx="1"/>
                      <rect x="14" y="15" width="4" height="4" rx="1"/>
                      <path d="M4 15h16"/>
                      <path d="M6 19h4M14 19h4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Legs</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Chrome Finish Feet</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Modern chrome-look legs.</p>
                </div>
              </div>
              )}
              {product.category === 'bunkbeds' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Solid Wooden Frames */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="7" width="16" height="10" rx="2"/>
                      <path d="M6 17v2M18 17v2"/>
                      <path d="M6 11h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Frame</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Solid Wooden Frames</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Strong hardwood structure.</p>
                </div>

                {/* Natural Finish */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M8 12l4-6 4 6"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Finish</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Natural Finish</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Warm, natural wood look.</p>
                </div>

                {/* Eco-friendly Polish */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 18c4-6 8-6 12 0"/>
                      <path d="M8 10l2-2 2 2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Eco</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Eco-friendly Polish</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Low-VOC, child-safe coating.</p>
                </div>

                {/* Cozy Classic Designs */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12h12M6 16h12"/>
                      <rect x="4" y="8" width="16" height="4" rx="2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Design</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Cozy Classic Designs</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Comfortable timeless styling.</p>
                </div>

                {/* Durable Slats */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9h18M3 12h18M3 15h18"/>
                      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Base</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Durable Slats</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Reliable mattress support.</p>
                </div>

                {/* Metal Build */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="7" width="16" height="4" rx="1"/>
                      <rect x="4" y="13" width="16" height="4" rx="1"/>
                      <path d="M4 7v10M20 7v10"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Structure</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Metal Build</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Strong steel construction.</p>
                </div>

                {/* Rust-resistant Coating */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Protection</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Rust-resistant Coating</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Protected against corrosion.</p>
                </div>

                {/* Modern Sleek Look */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12h16"/>
                      <path d="M6 10h12"/>
                      <path d="M8 8h8"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Style</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Modern Sleek Look</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Minimal and contemporary.</p>
                </div>

                {/* Lightweight yet sturdy */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 16h12"/>
                      <path d="M10 8l2-3 2 3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Weight</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Lightweight yet Sturdy</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Easy to handle, built to last.</p>
                </div>

                {/* Easy to Move */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="16" r="1"/>
                      <circle cx="16" cy="16" r="1"/>
                      <path d="M4 12h16"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Mobility</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Easy to Move</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Rollers and balanced design.</p>
                </div>

                {/* Futon Style */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="12" width="16" height="4" rx="2"/>
                      <path d="M6 12V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Convertible</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Futon Style</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Sofa-to-bed conversion.</p>
                </div>

                {/* Ideal for Small Spaces */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="7" y="7" width="10" height="10" rx="2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Space Saving</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Ideal for Small Spaces</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Compact footprint, big utility.</p>
                </div>

                {/* Multi-functional Design */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 8h12M6 12h12M6 16h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Versatility</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Multi-functional Design</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Works day and night.</p>
                </div>

                {/* Perfect for Guests */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="10" r="2"/>
                      <circle cx="15" cy="10" r="2"/>
                      <rect x="6" y="12" width="12" height="6" rx="2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Guests</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Perfect for Guests</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Comfortable extra sleeping area.</p>
                </div>

                {/* Triple Bunks */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="6" width="14" height="3" rx="1"/>
                      <rect x="5" y="11" width="14" height="3" rx="1"/>
                      <rect x="5" y="16" width="14" height="3" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Capacity</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Triple Bunks</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Sleeps 3 comfortably.</p>
                </div>

                {/* Space-saving for Families */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6h12M6 10h12M6 14h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Family</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Space-saving for Families</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Maximizes shared rooms.</p>
                </div>

                {/* Safe Ladders & Guardrails */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 6v12M16 6v12"/>
                      <path d="M6 8h12M6 12h12M6 16h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Safety</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Safe Ladders & Guardrails</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Secure climbing and sleeping.</p>
                </div>

                {/* Stylish Vertical Design */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 4v16M14 4v16"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Style</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Stylish Vertical Design</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Compact vertical stacking.</p>
                </div>

                {/* Strong Ladders */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5v14M15 5v14"/>
                      <path d="M7 9h10M7 13h10"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Durability</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Strong Ladders</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Built to handle daily use.</p>
                </div>

                {/* Next-day Delivery */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Fast Shipping</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Next-day Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Arrives as soon as tomorrow.</p>
                </div>

                {/* Box Packed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="8" width="16" height="10" rx="1"/>
                      <path d="M4 8l8-4 8 4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Packaging</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Box Packed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Flat-packed and protected.</p>
                </div>

                {/* Fits Standard Mattresses */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="10" width="14" height="6" rx="2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Compatibility</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fits Standard Mattresses</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Standard UK sizes supported.</p>
                </div>

                {/* Luxury Finishes */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12l2-4 4 2 4-2 2 4"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Luxury Finishes</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Refined materials and details.</p>
                </div>

                {/* Variety of Colors */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="12" r="3"/>
                      <circle cx="16" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Colours</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Variety of Colors</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Choose finishes to match your room.</p>
                </div>
              </div>
              )}
              {product.category === 'toppers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Premium Comfort */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12l2-4 4 2 4-2 2 4"/>
                      <path d="M6 12h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Comfort</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Premium Comfort</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Plush comfort for better sleep.</p>
                </div>

                {/* Extra Support */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="8" width="12" height="8" rx="2"/>
                      <path d="M8 10h8"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Support</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Extra Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Added firmness where needed.</p>
                </div>

                {/* Memory Foam & Latex */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <ellipse cx="9" cy="12" rx="5" ry="3"/>
                      <ellipse cx="15" cy="12" rx="5" ry="3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Hybrid</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Memory Foam & Latex</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Best of both materials.</p>
                </div>

                {/* Orthopaedic Care */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12h12"/>
                      <path d="M8 10h8"/>
                      <path d="M10 8h4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Care</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Orthopaedic Care</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Helps align spine and joints.</p>
                </div>

                {/* Breathable & Cooling */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Cooling</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Breathable & Cooling</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Improves airflow and comfort.</p>
                </div>

                {/* Washable Covers */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="6" width="16" height="12" rx="2"/>
                      <path d="M6 10c2-2 10-2 12 0"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Care</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Washable Covers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Easy to remove and clean.</p>
                </div>

                {/* Fits All Mattresses */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="10" width="12" height="6" rx="2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Compatibility</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Fits All Mattresses</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Universal fit across sizes.</p>
                </div>

                {/* Extends Life */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 12h12"/>
                      <path d="M6 14h12"/>
                      <path d="M6 16h12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Protection</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Extends Life</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Protects mattress surface.</p>
                </div>

                {/* Lightweight & Durable */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 16h12"/>
                      <path d="M10 8l2-3 2 3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Build</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Lightweight & Durable</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Easy to handle, long-lasting.</p>
                </div>

                {/* Hotel-style Luxury */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Premium</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Hotel-style Luxury</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Five-star comfort feel.</p>
                </div>

                {/* Anti-allergy */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Health</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Anti-allergy</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Helps reduce allergens.</p>
                </div>

                {/* Multiple Thickness Options */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="8" width="12" height="2" rx="1"/>
                      <rect x="6" y="12" width="12" height="2" rx="1"/>
                      <rect x="6" y="16" width="12" height="2" rx="1"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Options</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Multiple Thickness Options</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Choose thickness to suit you.</p>
                </div>

                {/* Eco-friendly */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 18c4-6 8-6 12 0"/>
                      <path d="M8 10l2-2 2 2"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Sustainability</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Eco-friendly</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Earth-conscious materials.</p>
                </div>

                {/* Box Packed */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="8" width="16" height="10" rx="1"/>
                      <path d="M4 8l8-4 8 4"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Packaging</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Box Packed</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Compact, safe delivery.</p>
                </div>

                {/* Next Day Delivery */}
                <div className="text-center min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Shipping</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Next Day Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Delivered as soon as tomorrow.</p>
                </div>
              </div>
              )}
            </div>

            {/* 4. Firmness Scale - Only show for mattresses */}
            {product.category === 'mattresses' && (
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <div className="text-center">
                  {/* Circular Object with Wavy Lines Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {/* Circular object (weight/pressure) */}
                      <circle cx="12" cy="6" r="2" fill="currentColor"/>
                      {/* Three wavy lines decreasing in length */}
                      <path d="M4 18c0 0 2-1 8-1s8 1 8 1" strokeWidth="1.5"/>
                      <path d="M5 20c0 0 2-1 7-1s7 1 7 1" strokeWidth="1.5"/>
                      <path d="M6 22c0 0 2-1 6-1s6 1 6 1" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">Firmness Scale</h3>
                  
                  {/* Scale Bar */}
                  <div className="relative min-w-0 overflow-hidden">
                    {/* Numerical Ranges */}
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2 px-1">
                      <span className="break-words">1-2</span>
                      <span className="break-words">3-4</span>
                      <span className="text-gray-700 font-medium break-words">5-6</span>
                      <span className="break-words">7-8</span>
                      <span className="break-words">8-9</span>
                      <span className="break-words">9-10</span>
                    </div>
                    
                    {/* Scale Bar Segments */}
                    <div className="flex h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full flex-1 rounded-l-full ${getCharacteristicValue(product.firmnessScale, 'firmness') <= 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 3 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 4 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 5 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 6 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'} shadow-lg transform hover:scale-y-110 transition-all duration-300 rounded-md`}></div>
                      <div className={`h-full flex-1 ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 7 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 8 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 8 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 9 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'}`}></div>
                      <div className={`h-full flex-1 rounded-r-full ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 9 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 10 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'}`}></div>
                    </div>
                    
                    {/* Descriptive Labels */}
                    <div className="flex justify-between text-xs sm:text-sm text-gray-700 mt-2 px-1">
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') <= 2 ? 'text-orange-600 font-semibold' : ''}`}>Soft</span>
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 3 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 4 ? 'text-orange-600 font-semibold' : ''}`}>Soft-Medium</span>
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 5 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 6 ? 'text-orange-600 font-semibold' : ''}`}>Medium</span>
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 7 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 8 ? 'text-orange-600 font-semibold' : ''}`}>Medium-Firm</span>
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 8 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 9 ? 'text-orange-600 font-semibold' : ''}`}>Firm</span>
                      <span className={`break-words ${getCharacteristicValue(product.firmnessScale, 'firmness') >= 9 && getCharacteristicValue(product.firmnessScale, 'firmness') <= 10 ? 'text-orange-600 font-semibold' : ''}`}>Extra-firm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Product Specifications Grid - Only show for mattresses */}
            {product.category === 'mattresses' && (
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  
                  {/* Support */}
                  <div className="text-center border border-gray-200 rounded-lg p-3 bg-white transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 mx-auto mb-2 text-gray-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M4 5h2M18 5h2M8 3h8M6 9h12M6 11h12M6 13h12"/>
                        <path d="M4 17l2 2M20 17l-2 2"/>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-800">Support</h3>
                      <div className="w-3 h-3 text-gray-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-32 mx-auto shadow-inner">
                        <div className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg transform hover:scale-y-125 hover:shadow-xl transition-all duration-300" style={{ width: `${getCharacteristicValue(product.supportLevel, 'support') * 10}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 max-w-32 mx-auto">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  {/* Pressure Relief */}
                  <div className="text-center border border-gray-200 rounded-lg p-3 bg-white transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 mx-auto mb-2 text-gray-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                        <path d="M12 11v6"/>
                        <path d="M8 15h8"/>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-800">Pressure Relief</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-32 mx-auto shadow-inner">
                        <div className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg transform hover:scale-y-125 hover:shadow-xl transition-all duration-300" style={{ width: `${getCharacteristicValue(product.pressureReliefLevel, 'pressure') * 10}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 max-w-32 mx-auto">
                        <span>Basic</span>
                        <span>Medium</span>
                        <span>Advanced</span>
                      </div>
                    </div>
                  </div>

                  {/* Air Circulation */}
                  <div className="text-center border border-gray-200 rounded-lg p-3 bg-white transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 mx-auto mb-2 text-gray-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h6l3-9 3 9h6"/>
                        <path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/>
                        <path d="M7 8l2-4 2 4"/>
                        <path d="M15 8l2-4 2 4"/>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-800">Air Circulation</h3>
                      <div className="w-3 h-3 text-gray-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-32 mx-auto shadow-inner">
                        <div className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg transform hover:scale-y-125 hover:shadow-xl transition-all duration-300" style={{ width: `${getCharacteristicValue(product.airCirculationLevel, 'air') * 10}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 max-w-32 mx-auto">
                        <span>Good</span>
                        <span>Better</span>
                        <span>Best</span>
                      </div>
                    </div>
                  </div>

                  {/* Durability */}
                  <div className="text-center border border-gray-200 rounded-lg p-3 bg-white transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 mx-auto mb-2 text-gray-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-800">Durability</h3>
                      <div className="w-3 h-3 text-gray-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-32 mx-auto shadow-inner">
                        <div className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg transform hover:scale-y-125 hover:shadow-xl transition-all duration-300" style={{ width: `${getCharacteristicValue(product.durabilityLevel, 'durability') * 10}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 max-w-32 mx-auto">
                        <span>Good</span>
                        <span>Better</span>
                        <span>Best</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 6. Collapsible Sections (Accordion) */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                {/* Description Card */}
                <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-200 transition-all duration-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer group"
                    onClick={() => toggleSection('description')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">Description</h3>
                        <p className="text-sm font-semibold text-black">Product details and specifications</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <svg 
                        className={`w-4 h-4 text-black group-hover:text-gray-800 transition-all duration-200 ${expandedSections.description ? 'rotate-45' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Expandable Description Content */}
                  {expandedSections.description && (
                    <div className="px-6 pb-6 border-t border-orange-200">
                      <div className="pt-6 space-y-12">
                        {/* Introduction */}
                        <div className="text-center">
                          <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
                            {((product as any).longDescription) || `Discover ${product.name} — designed for comfort, support, and everyday durability.`}
                          </p>
                        </div>
                        
                        {/* Dynamic Description Paragraphs from Database */}
                        {(product as any).descriptionParagraphs && (product as any).descriptionParagraphs.length > 0 ? (
                          (product as any).descriptionParagraphs.map((paragraph: any, index: number) => (
                            <div key={index}>
                              {/* Divider */}
                              {index > 0 && <div className="border-t border-gray-200 my-8"></div>}
                              
                              {/* Dynamic Section */}
                              <div className="text-center space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">{paragraph.heading || `Section ${index + 1}`}</h3>
                                {paragraph.image && (
                                  <div className="relative h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden bg-gray-100 mx-auto max-w-3xl lg:max-w-4xl">
                                    <img 
                                      src={paragraph.image} 
                                      alt={paragraph.heading || `Section ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3EImage%3C/text%3E%3C/svg%3E";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="max-w-3xl mx-auto space-y-4">
                                  <p className="text-gray-700 leading-relaxed">
                                    {paragraph.content || 'Content not available'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            {/* Fallback Content */}
                            <div className="border-t border-gray-200 my-8"></div>
                            
                            <div className="text-center space-y-6">
                              <h3 className="text-2xl font-bold text-gray-900">Premium Sleep Technology</h3>
                              <div className="relative h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden bg-gray-100 mx-auto max-w-3xl lg:max-w-4xl">
                                <img 
                                  src="/hello.jpeg" 
                                  alt="Premium mattress with pocket springs showing internal structure"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3EMattress Springs%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <div className="max-w-3xl mx-auto space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                  Our advanced mattress technology combines the best of both worlds. The innovative pocket spring system provides targeted support while the premium memory foam layers offer exceptional comfort and pressure relief.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                  Each spring works independently to contour to your body shape, ensuring optimal spinal alignment and reducing pressure points for a truly restful night's sleep.
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        

                        

                      </div>
                    </div>
                  )}
                </div>

                {/* Dimensions Card */}
                <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-200 transition-all duration-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer group"
                    onClick={() => toggleSection('dimensions')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">Dimensions</h3>
                        <p className="text-sm font-semibold text-black">Size and measurement details</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <svg 
                        className={`w-4 h-4 text-black group-hover:text-gray-800 transition-all duration-200 ${expandedSections.dimensions ? 'rotate-45' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Expandable Dimensions Content */}
                  {expandedSections.dimensions && (
                    <div className="px-6 pb-6 border-t border-orange-200">
                      <div className="pt-6 space-y-8">
                        {/* Product Name Header */}
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-600">Product Dimensions</p>
                        </div>
                        
                        {/* Swipeable Sofa Images Carousel */}
                        <div className="relative mb-8">
                          <div className="flex justify-center">
                            <div className="relative h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl rounded-xl overflow-hidden bg-gray-100">
                              {/* Current Image */}
                              <img 
                                src={sofaImages[currentSofaImage]} 
                                alt={`Sofa showing mattress dimensions and scale - View ${currentSofaImage + 1}`}
                                className="w-full h-full object-cover transition-opacity duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f4f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3ESofa Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              
                              {/* Navigation Arrows */}
                              <button 
                                onClick={() => setCurrentSofaImage(prev => prev === 0 ? sofaImages.length - 1 : prev - 1)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              
                              <button 
                                onClick={() => setCurrentSofaImage(prev => prev === sofaImages.length - 1 ? 0 : prev + 1)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Image Thumbnails */}
                          <div className="flex justify-center mt-4 space-x-3">
                            {sofaImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSofaImage(index)}
                                className={`relative w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer group flex-shrink-0 ${
                                  index === currentSofaImage 
                                    ? "border-blue-500 ring-2 ring-blue-200 scale-105" 
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                              >
                                <img 
                                  src={image} 
                                  alt={`Sofa view ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3ESofa Thumbnail%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                                
                                {/* Hover Overlay */}
                                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 ${
                                  index === currentSofaImage ? 'bg-blue-500/20' : ''
                                }`}></div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Dimensions Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                          {/* Technical Specifications */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 mb-4">Overall Dimensions</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">A: Height</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.height || '25 cm'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">B: Length</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.length || 'L 190cm'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">C: Width</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.width || '135cm'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 mb-4">Mattress Specifications</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Mattress Size</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.mattress_size || '135cm x L 190cm cm'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Maximum Height</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.max_height || '25 cm'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Weight Capacity</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.weight_capacity || '200 kg'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 mb-4">Construction Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Pocket Springs</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.pocket_springs || '1000 count'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Comfort Layer</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.comfort_layer || '8 cm'}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="font-medium text-gray-700">Support Layer</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.support_layer || '17 cm'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-500 italic">
                              All measurements are approximate and may vary slightly.
                            </div>
                          </div>
                          
                          {/* Technical Diagram */}
                          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              {/* Mattress Diagram */}
                              <div className="relative w-full h-full flex items-center justify-center">
                                                                 {/* Main Mattress */}
                                 <div className="relative w-48 h-32 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                                   {/* Quilted Pattern - Top Layer */}
                                   <div className="absolute inset-2 grid grid-cols-12 grid-rows-6 gap-1">
                                     {Array.from({ length: 72 }).map((_, i) => (
                                       <div key={i} className="w-1 h-1 bg-gray-300 rounded-full opacity-40 hover:opacity-80 transition-opacity duration-200"></div>
                                     ))}
                                   </div>
                                   
                                   {/* Memory Foam Layer - Light Blue */}
                                   <div className="absolute top-4 left-1 right-1 h-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-sm border border-blue-200"></div>
                                   
                                   {/* Pocket Springs Pattern - Subtle dots */}
                                   <div className="absolute inset-4 grid grid-cols-10 grid-rows-5 gap-1">
                                     {Array.from({ length: 50 }).map((_, i) => (
                                       <div key={i} className="w-1 h-1 bg-gray-400 rounded-full opacity-60 hover:opacity-80 transition-opacity duration-200"></div>
                                     ))}
                                   </div>
                                   
                                   {/* Elegant Inner Border */}
                                   <div className="absolute inset-1 border border-gray-200 rounded-lg opacity-60"></div>
                                   
                                   {/* Hover Effect Overlay */}
                                   <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                  
                                                                     {/* Dimension Labels */}
                                   <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                     <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                       <span className="text-xs font-bold text-gray-700">A</span>
                                       <span className="text-xs text-gray-600">25cm</span>
                                       <span className="text-xs text-gray-500">Height</span>
                                     </div>
                                   </div>
                                   <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                                     <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                       <span className="text-xs font-bold text-gray-700">B</span>
                                       <span className="text-xs text-gray-600">{product.dimensions?.length || 'L 190cm'}</span>
                                       <span className="text-xs text-gray-500">Length</span>
                                     </div>
                                   </div>
                                   <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                     <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                       <span className="text-xs font-bold text-gray-700">C</span>
                                       <span className="text-xs text-gray-600">{product.dimensions?.width || '135cm'}</span>
                                       <span className="text-xs text-gray-500">Width</span>
                                     </div>
                                   </div>
                                  
                                                                     {/* Comfort Layer Indicator - Blue */}
                                   <div className="absolute top-1 left-1 right-1 h-3 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-sm border border-blue-300"></div>
                                   
                                   {/* Support Layer Indicator - Green */}
                                   <div className="absolute bottom-1 left-1 right-1 h-3 bg-gradient-to-r from-green-200 via-green-300 to-green-400 rounded-sm border border-green-300"></div>
                                </div>
                                
                                {/* Dimension Lines */}
                                <div className="absolute top-0 left-1/2 w-px h-8 bg-red-500"></div>
                                <div className="absolute top-1/2 right-0 w-8 h-px bg-red-500"></div>
                                <div className="absolute bottom-0 left-1/2 w-px h-8 bg-red-500"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Available Sizes Grid */}
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-4">Available Sizes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sizeData.map((size) => (
                              <div 
                                key={size.name} 
                                className={`bg-white p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                                  selectedSize === size.name 
                                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedSize(size.name)}
                              >
                                <div className="font-semibold text-gray-900 mb-2">{size.name}</div>
                                <div className="text-sm text-gray-600 mb-2">{size.dimensions}</div>
                                <div className="text-sm text-orange-600 font-semibold">£{size.currentPrice.toFixed(2)}</div>
                                
                                {/* Selection Indicator */}
                                {selectedSize === size.name && (
                                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Additional Notes */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Important Notes</h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>• Mattress dimensions are standard sizes as listed above</p>
                            <p>• Maximum mattress height should not exceed 25 cm for optimal fit</p>
                            <p>• Weight capacity is distributed across the entire mattress surface</p>
                            <p>• Pocket spring count may vary slightly due to manufacturing tolerances</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Questions Card */}
                <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-200 transition-all duration-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer group"
                    onClick={() => toggleSection('questions')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">Product Questions</h3>
                        <p className="text-sm font-semibold text-black">Frequently asked questions</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <svg 
                        className={`w-4 h-4 text-black group-hover:text-gray-800 transition-all duration-200 ${expandedSections.questions ? 'rotate-45' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Expandable Questions Content */}
                  {expandedSections.questions && (
                    <div className="px-6 pb-6 border-t border-orange-200">
                      <div className="pt-6 space-y-6">
                        {/* FAQ Section */}
                        <div className="space-y-4">
                          {product.productQuestions && product.productQuestions.length > 0 ? (
                            product.productQuestions.map((question, index) => (
                              <div key={index} className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{question.question || `Question ${index + 1}`}</h4>
                                <p className="text-gray-700 text-sm">{question.answer || 'Answer not available'}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">How firm is this mattress?</h4>
                                <p className="text-gray-700 text-sm">This product has a {product.firmness?.toLowerCase() || 'medium-firm'} feel, providing excellent support while maintaining comfort for most sleepers.</p>
                              </div>
                              
                              <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">What's the difference between pocket springs and regular springs?</h4>
                                <p className="text-gray-700 text-sm">Pocket springs are individually wrapped, allowing them to move independently and provide targeted support. Regular springs are connected and move together, offering less precise support.</p>
                              </div>
                              
                              <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h4>
                                <p className="text-gray-700 text-sm">{product.dispatchTime || 'Standard delivery takes 3-5 business days. Express delivery is available for next-day delivery in most areas.'}</p>
                              </div>
                              
                              <div className="border-b border-gray-200 pb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Can I return the mattress if I don't like it?</h4>
                                <p className="text-gray-700 text-sm">Yes! We offer a 100-night trial period. If you're not completely satisfied, you can return the mattress for a full refund.</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">How do I care for my mattress?</h4>
                                <p className="text-gray-700 text-sm">{product.careInstructions || 'Rotate your mattress every 3-6 months, use a mattress protector, and clean spills immediately. The bamboo cover is removable and machine washable.'}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Warranty & Care Card */}
                <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-200 transition-all duration-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer group"
                    onClick={() => toggleSection('warranty')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">Warranty & Care</h3>
                        <p className="text-sm font-semibold text-black">Warranty details and care instructions</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <svg 
                        className={`w-4 h-4 text-black group-hover:text-gray-800 transition-all duration-200 ${expandedSections.warranty ? 'rotate-45' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Expandable Warranty Content */}
                  {expandedSections.warranty && (
                    <div className="px-6 pb-6 border-t border-orange-200">
                      <div className="pt-6 space-y-6">
                        {/* Warranty Details */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Warranty Coverage</h4>
                          {product.warrantyInfo && Object.keys(product.warrantyInfo).length > 0 ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <span className="font-semibold text-green-800">{product.warrantyInfo.duration || '10-Year Full Warranty'}</span>
                              </div>
                              <p className="text-green-700 text-sm">{product.warrantyInfo.description || 'Comprehensive coverage against manufacturing defects, sagging, and structural issues.'}</p>
                            </div>
                          ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <span className="font-semibold text-green-800">10-Year Full Warranty</span>
                              </div>
                              <p className="text-green-700 text-sm">Comprehensive coverage against manufacturing defects, sagging, and structural issues.</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Care Instructions */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Care Instructions</h4>
                          {product.careInstructions ? (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <span className="text-gray-700 text-sm">{product.careInstructions}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <span className="font-medium text-gray-900">Regular Rotation:</span>
                                  <span className="text-gray-700 text-sm"> Rotate your mattress every 3-6 months to ensure even wear.</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <span className="font-medium text-gray-900">Use a Mattress Protector:</span>
                                  <span className="text-gray-700 text-sm"> Protect against spills, stains, and allergens.</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Trial Period */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">100-Night Trial</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                              Try your mattress risk-free for 100 nights. If you're not completely satisfied, 
                              return it for a full refund. No questions asked.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: details - takes 2/5 of the width */}
        <div className="hidden lg:block lg:col-span-2 space-y-2 lg:sticky lg:top-0 lg:self-start z-30 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 transition-all duration-300" style={{ position: 'sticky', top: 0, willChange: 'transform', transform: 'translateZ(0)' }}>
          {/* Merged Product Info & Size Card */}
          <div className="rounded-xl p-4 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative z-0">
            {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              
              {/* White Box with Reviews, Stars, and Savings - Always Visible */}
              <div className="bg-white border-0 rounded-lg p-3 mb-3 max-w-md shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-800">
                          {selectedSizeData && selectedSizeData.wasPrice && selectedSizeData.currentPrice && selectedSizeData.wasPrice > selectedSizeData.currentPrice ? (
                            `Save £${(selectedSizeData.wasPrice - selectedSizeData.currentPrice).toFixed(2)}`
                          ) : selectedSizeData ? (
                            `£${selectedSizeData.currentPrice.toFixed(2)}`
                          ) : (
                            `£${product.currentPrice.toFixed(2)}`
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < (product.rating || 4) ? "text-orange-500 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-base font-semibold text-gray-800">{product.reviewCount || 0}</span>
                    </div>
                  </div>
                </div>
              
            {/* Size and Pricing Section - Desktop */}
            {selectedSizeData ? (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-start justify-between mb-2">
                {/* Left Side: Size Name and Pricing */}
                <div className="flex-1">
                  {/* Size Name */}
                  <div className="font-semibold text-lg text-gray-900 mb-1">{selectedSizeData.name}</div>
                  
                  {/* Pricing - Now under the size name */}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 line-through">Was £{selectedSizeData.wasPrice > 0 ? selectedSizeData.wasPrice.toFixed(2) : '0.00'}</div>
                    <div className="text-2xl font-black text-orange-600">£{selectedSizeData.currentPrice > 0 ? selectedSizeData.currentPrice.toFixed(2) : '0.00'}</div>
                  </div>
                </div>
                
                {/* Right Side: Dimensions and Availability */}
                <div className="text-right ml-4">
                  {/* Dimensions */}
                  <div className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 mb-2">{selectedSizeData.dimensions}</div>
                  
                  {/* Availability Status */}
                  <div className="flex items-center justify-end gap-2">
                    {selectedSizeData.inStock ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-sm font-medium">{selectedSizeData.availability}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-sm font-medium">{selectedSizeData.availability}</span>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-start justify-between mb-2">
                  {/* Left Side: Base Product Pricing */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-600 mb-2">Base Product Price</div>
                    <div className="space-y-1">
                      {product.originalPrice > product.currentPrice && (
                        <div className="text-sm text-gray-500 line-through">Was £{product.originalPrice.toFixed(2)}</div>
                      )}
                      <div className="text-2xl font-black text-orange-600">£{product.currentPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {/* Right Side: Size Selection Prompt */}
                  <div className="text-right ml-4">
                    <div className="text-lg font-semibold text-gray-600 mb-2">Select a size to see pricing</div>
                    <div className="text-sm text-gray-500">Choose from available sizes below</div>
                </div>
              </div>
            </div>
            )}
              
              {/* Product Features - Commented out to prevent showing hardcoded features */}
              {/* <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Product Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {youWillLoveFeatures.map(({ label, Icon }, index) => (
                      <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 text-orange-500 flex-shrink-0">
                        {typeof Icon === 'function' ? <Icon /> : null}
                        </div>
                      <span className="text-sm text-gray-700 break-words">{label}</span>
                      </div>
                  ))}
                        </div>
              </div> */}
            </div>

            {/* Choose Size - Clickable Option - White Button */}
            {Array.isArray(sizeData) && sizeData.length > 0 && (
            <div className="border-0 rounded-lg p-4 bg-white mb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setSizeModalOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold text-lg">Choose Size</span>
                </div>
                <div className="w-6 h-6 text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
            )}

            {/* Color & Other Options Selection - Clickable Option - White Button */}
            <div className="border-0 rounded-lg p-4 bg-white mb-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setColorModalOpen(true)}>
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-semibold text-lg">
                    Choose Colour & Other Options
                  </span>
                </div>
                <div className="w-6 h-6 text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
                </div>
              </div>



            {/* Modern Unified Quantity and Add to Basket Button */}
            <div className="space-y-4" ref={buttonRef}>
            {/* Enhanced Single Button with Modern Design */}
            <div className="relative group">
              {/* Main Button Background with Orange Theme and Enhanced Styling */}
                  <button 
                onClick={addToCart} 
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white text-lg py-7 rounded-2xl transition-all duration-300 flex items-center justify-start relative overflow-hidden pl-6 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] border border-orange-400/20"
              >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Add to Basket Text with Enhanced Typography */}
                <div className="relative z-10 flex items-center gap-3">
                  {/* Improved Shopping Cart Icon - Matching the Choose Size button style */}
                  <div className="w-6 h-6 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-bold text-xl tracking-wide">Add to Basket</span>
                  </div>
                </div>
                  </button>
              
              {/* Enhanced Quantity Controls Overlay - Smaller Size and Closer to Corner */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {/* Minus Button with Smaller Size */}
                  <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    quantity > 1 && setQuantity(quantity - 1);
                  }}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group/btn"
                  disabled={quantity <= 1}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-3 h-3 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                    </svg>
                  </button>
                
                {/* Enhanced Quantity Display - Smaller Size */}
                <div className="relative">
                  <div className="w-12 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white tracking-wide">{quantity}</span>
                </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-sm scale-110"></div>
              </div>
              
                {/* Plus Button with Smaller Size */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity + 1);
                  }}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group/btn"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-3 h-3 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
            </div>

              {/* Subtle Bottom Glow Effect - Orange Theme */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-y-1/2 w-4/5 h-2 bg-orange-600/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Klarna Payment Option */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-5 bg-pink-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">Klarna</span>
              </div>
              <div className="text-sm text-gray-700">
                3 payments of <span className="font-semibold">£{((selectedSizeData?.currentPrice || currentPrice) / 3).toFixed(2)}</span> at 0% interest with <span className="font-semibold">Klarna</span>
              </div>
            </div>
            <div className="text-sm text-primary underline cursor-pointer">Learn more</div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 backdrop-blur-sm transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={gallery[modalImageIndex] || "/placeholder.svg"} 
                alt={product.name} 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(modalImageIndex === 0 ? gallery.length - 1 : modalImageIndex - 1);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(modalImageIndex === gallery.length - 1 ? 0 : modalImageIndex + 1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 shadow-lg">
                <span className="text-sm font-medium">
                  {modalImageIndex + 1} of {gallery.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Mobile Sticky Add to Basket Button - Sticks to bottom when scrolled past original button */}
      <div className={`lg:hidden transition-all duration-300 mobile-sticky-button ${
        isButtonSticky 
          ? 'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 pb-6 shadow-lg safe-area-bottom overflow-hidden' 
          : 'hidden'
      }`}>
        <div className="relative group w-full max-w-full overflow-hidden">
          {/* Main Button Background with Orange Theme */}
          <button 
            onClick={addToCart} 
            className="w-full max-w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-lg border border-orange-400/20"
          >
            {/* Add to Basket Text */}
            <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1 max-w-full">
              <div className="w-5 h-5 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
                </svg>
              </div>
              <span className="font-bold text-lg truncate max-w-full">Add to Basket</span>
            </div>
          </button>
          
          {/* Quantity Controls Overlay */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 max-w-[100px]">
            {/* Minus Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                quantity > 1 && setQuantity(quantity - 1);
              }}
              className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                  </svg>
            </button>
            
            {/* Quantity Display */}
            <div className="w-10 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center min-w-0">
              <span className="text-sm font-bold text-white truncate">{quantity}</span>
            </div>
            
            {/* Plus Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300"
            >
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                   </svg>
            </button>
          </div>
        </div>
      </div>






        




        

      {/* Basket Sidebar */}
      <BasketSidebar
        isOpen={basketSidebarOpen}
        onClose={() => setBasketSidebarOpen(false)}
        product={{
          id: String(product.id),
          name: product.name,
          brand: product.brand,
          image: selectedImage || product.image,
          currentPrice: product.currentPrice,
          originalPrice: product.originalPrice,
          size: selectedSizeData?.name,
          color: selectedColor
        }}
      />

      {/* Size Selection Modal */}
      <SizeSelectionModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        onSizeSelect={(size) => {
          setSelectedSize(size.name)
          setSizeModalOpen(false)
        }}
        sizes={sizeData}
        selectedSize={selectedSize}
      />

      {/* Color Selection Modal */}
      <ColorSelectionModal
        isOpen={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        onColorSelect={(color, depth, firmness, mattress) => {
          setSelectedColor(color.name)
          if (depth) {
            console.log('Selected depth:', depth)
          }
          if (firmness) {
            console.log('Selected firmness:', firmness)
          }
          if (mattress) {
            console.log('Selected mattress:', mattress)
          }
          setColorModalOpen(false)
        }}
        colors={(() => {
          const vars = ((product as any).variants || []) as Array<any>
          const uniqueColors = [...new Set(vars.filter(v => v && v.color).map(v => String(v.color)))]
          return uniqueColors.length > 0 ? uniqueColors.map((c) => ({ name: c })) : []
        })()}
        selectedColor={selectedColor}
        selectedDepth=""
        selectedFirmness=""
        productPrice={(() => {
          const hasSizes = Array.isArray(sizeData) && sizeData.length > 0
          if (!hasSizes || !(product as any).variants || (product as any).variants.length === 0) {
            return product.currentPrice || 0
          }
          
          const sizeVariant = (product as any).variants.find((v: any) => v.size === selectedSize)
          return sizeVariant ? (sizeVariant.currentPrice || sizeVariant.originalPrice || 0) : (product.currentPrice || 0)
        })()}
        productName={product.name}
        selectedSize={selectedSize}
        showOnlyColors={product.category === 'bunkbeds'}
        // Pass variant data for dynamic options
        variants={(product as any).variants || []}
      />

      </div>
    </>
  )
}

export default ProductDetailHappy