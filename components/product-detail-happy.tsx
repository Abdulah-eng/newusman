"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo, lazy, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Heart, MessageCircle, Shield, ChevronDown, ChevronUp, ShoppingCart, Truck, Clock, Leaf, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Layers, Waves, Moon, Crown, RefreshCw, Minimize, Wrench, Palette, DollarSign, Baby, Award, ShieldCheck, Package, Ruler, Users, Zap, Home, Trees, Square, Maximize, ArrowUp, Radio, VolumeX, Bed, Settings, Circle, Thermometer, Sun } from "lucide-react"
import Image from "next/image"

import { useCart } from "@/lib/cart-context"
import { getFeatureIcon } from "@/lib/icon-mapping"

import { BasketSidebar } from "@/components/basket-sidebar"
import { SizeSelectionModal } from "@/components/size-selection-modal"
import { ColorSelectionModal } from "@/components/color-selection-modal"
import { ImageMagnifier } from "@/components/image-magnifier"



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
      depth?: string
      mattress_size: string
      max_height: string
      weight_capacity: string
      pocket_springs: string
      comfort_layer: string
      support_layer: string
      // New editable heading fields
      mattress_size_heading?: string
      maximum_height_heading?: string
      weight_capacity_heading?: string
      pocket_springs_heading?: string
      comfort_layer_heading?: string
      support_layer_heading?: string
      dimension_disclaimer?: string
      // Visibility controls
      show_basic_dimensions?: boolean
      show_mattress_specs?: boolean
      show_technical_specs?: boolean
    }

    dispatchTime?: string

    reasonsToBuy?: string[]

    promotionalOffers?: any[]

    productQuestions?: any[]

    warrantyInfo?: any

    careInstructions?: string

    warrantyDeliveryLine?: string

    trialInformation?: string

    headline?: string

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

    // Important notices
    importantNotices?: Array<{
      noticeText: string
      sortOrder: number
    }>

    // Free gift fields

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

  }

}

export const ProductDetailHappy = memo(({ product }: ProductDetailHappyProps) => {
  const { dispatch } = useCart()
  console.log('ProductDetailHappy - dispatch function:', dispatch)
  console.log('ProductDetailHappy - dispatch type:', typeof dispatch)
  
  // Helper function to convert string characteristics to numeric values for sliders
  const getCharacteristicValue = (value: string | number | undefined, type: 'support' | 'pressure' | 'air' | 'durability' | 'firmness'): number => {
    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()

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

  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(product.images && product.images.length ? product.images[0] : product.image)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const [basketSidebarOpen, setBasketSidebarOpen] = useState(false)
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [colorModalOpen, setColorModalOpen] = useState(false)
  const [lastSelection, setLastSelection] = useState<string | null>(null)
  const [isSequentialFlow, setIsSequentialFlow] = useState(false)

  // Smart variant selection state
  const [isAutoSelectionMode, setIsAutoSelectionMode] = useState(false)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ description: true })

  const handleVariantSelection = (type: string, value: string) => {
    console.log('handleVariantSelection called:', type, value, 'isSequentialFlow:', isSequentialFlow)
    // Track the last selection to prevent immediate reopening
    setLastSelection(type)
    
    if (type === 'size') {
      console.log('Setting selected size to:', value)
      setSelectedSize(value)
      setSizeModalOpen(false)
      
      // Only continue sequential flow if we're in Add to Basket mode
      if (isSequentialFlow) {
        console.log('In sequential flow, checking for next required selection')
        // Use a longer timeout to ensure state is updated
      setTimeout(() => {
          const { hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
          console.log('Available options after size selection:', { hasColors, hasDepths, hasFirmness })
          
          // Check color next
          if (hasColors && !selectedColor) {
            console.log('Opening color modal')
            setColorModalOpen(true)
            return
          }
          
          // Check other variants
          if (hasDepths && !(product as any).selectedDepth) {
            console.log('Depth selection required but not implemented yet')
            return
          }
          
          if (hasFirmness && !(product as any).selectedFirmness) {
            console.log('Firmness selection required but not implemented yet')
            return
          }
          
          // All variants selected, add to cart directly
          setIsSequentialFlow(false) // Reset the flag
          
          // Add to cart logic here (copy from addToCart function)
          const currentVariantPrice = (() => {
            const hasSizes = Array.isArray(sizeData) && sizeData.length > 0
            if (!hasSizes || !(product as any).variants || (product as any).variants.length === 0) {
              return product.currentPrice || 0
            }
            
            const matchingVariant = (product as any).variants.find((variant: any) => {
              const sizeMatch = hasSizes ? variant.size === selectedSize : true
              const colorMatch = !selectedColor || variant.color === selectedColor
              return sizeMatch && colorMatch
            })
            
            return matchingVariant ? (matchingVariant.currentPrice || matchingVariant.originalPrice || 0) : (product.currentPrice || 0)
          })()
          
          const hasFreeGift = (product as any).free_gift_product_id && (
            (product as any).free_gift_enabled || 
            (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
          )
          
          const payload: any = {
                  id: String(product.id),
                  name: product.name,
                  brand: product.brand,
                  image: selectedImage || product.image,
            currentPrice: currentVariantPrice,
                  originalPrice: product.originalPrice,
            size: selectedSizeData?.name || 'Standard',
                  color: selectedColor
                }
          
          if (hasFreeGift) {
            const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
            Object.assign(payload, {
              freeGiftProductId: (product as any).free_gift_product_id,
              freeGiftProductName: giftProductName,
              freeGiftProductImage: (product as any).free_gift_product_image || ''
            })
          }
          
            dispatch({
              type: 'ADD_ITEM',
            payload
          })
          
            setBasketSidebarOpen(true)
          }, 100)
        }
      // If not in sequential flow, just close the popup (individual variant selection)
      
    } else if (type === 'color') {
      console.log('Setting selected color to:', value)
      setSelectedColor(value)
      setColorModalOpen(false)
      
      // Only continue sequential flow if we're in Add to Basket mode
      if (isSequentialFlow) {
        console.log('In sequential flow after color selection')
      setTimeout(() => {
          const { hasDepths, hasFirmness } = getAvailableVariantOptions()
          console.log('Available options after color selection:', { hasDepths, hasFirmness })
          
          // Check other variants
          if (hasDepths && !(product as any).selectedDepth) {
            console.log('Depth selection required but not implemented yet')
            return
          }
          
          if (hasFirmness && !(product as any).selectedFirmness) {
            console.log('Firmness selection required but not implemented yet')
            return
          }
          
          // All variants selected, add to cart directly
          setIsSequentialFlow(false) // Reset the flag
          
          // Add to cart logic here (copy from addToCart function)
          const currentVariantPrice = (() => {
            const hasSizes = Array.isArray(sizeData) && sizeData.length > 0
            if (!hasSizes || !(product as any).variants || (product as any).variants.length === 0) {
              return product.currentPrice || 0
            }
            
            const matchingVariant = (product as any).variants.find((variant: any) => {
              const sizeMatch = hasSizes ? variant.size === selectedSize : true
              const colorMatch = !selectedColor || variant.color === selectedColor
              return sizeMatch && colorMatch
            })
            
            return matchingVariant ? (matchingVariant.currentPrice || matchingVariant.originalPrice || 0) : (product.currentPrice || 0)
          })()
          
          const hasFreeGift = (product as any).free_gift_product_id && (
            (product as any).free_gift_enabled || 
            (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
          )
          
          const payload: any = {
                  id: String(product.id),
                  name: product.name,
                  brand: product.brand,
                  image: selectedImage || product.image,
            currentPrice: currentVariantPrice,
                  originalPrice: product.originalPrice,
            size: selectedSizeData?.name || 'Standard',
            color: selectedColor
          }
          
          if (hasFreeGift) {
            const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
            Object.assign(payload, {
              freeGiftProductId: (product as any).free_gift_product_id,
              freeGiftProductName: giftProductName,
              freeGiftProductImage: (product as any).free_gift_product_image || ''
            })
          }
          
            dispatch({
              type: 'ADD_ITEM',
            payload
          })
          
            setBasketSidebarOpen(true)
          }, 100)
        }
      // If not in sequential flow, just close the popup (individual variant selection)
    }
  }

  // Build a list of "Features you'll love" for reuse in the Product Features section
  const buildProductFeatures = () => {
    // Use centralized icon mapping for consistent icons across all components

    // PRIORITY 1: Use database-provided features (same as product cards)
    if (product.features && product.features.length > 0) {
      return product.features.slice(0, 6).map(label => ({ 
        label, 
        Icon: getFeatureIcon(label, undefined, 'sm')
      }))
    }

    // Fallback to category-specific features if no database features (EXACTLY same as product card)
    if (product.category === 'mattresses') {
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
    
    if (product.category === 'pillows') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Hotel Quality', Icon: Star }
      ]
    }
    
    if (product.category === 'kids') {
      return [
        { label: 'Safe Materials', Icon: Shield },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Durable Build', Icon: Zap },
        { label: 'Fun Designs', Icon: Star },
        { label: 'Family Friendly', Icon: Users }
      ]
    }
    
    if (product.category === 'sale' || product.category === 'clearance') {
      return [
        { label: 'Premium Quality', Icon: ShieldCheck },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Great Value', Icon: DollarSign },
        { label: 'Warranty Support', Icon: Award }
      ]
    }
    
    if (product.category === 'beds') {
      return [
        { label: 'Sturdy Frame', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (product.category === 'sofas') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Comfortable', Icon: Heart },
        { label: 'Durable Frame', Icon: Zap },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Fast Shipping', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (product.category === 'bunkbeds') {
      return [
        { label: 'Space-Saving', Icon: Minimize },
        { label: 'Multiple Sleeping Levels', Icon: Layers },
        { label: 'Solid Wood Frames', Icon: Trees },
        { label: 'Guard Rails', Icon: Shield },
        { label: 'Easy Assemble', Icon: Wrench },
        { label: 'Flat-Pack', Icon: Package }
      ]
    }
    
    if (product.category === 'toppers') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Cooling Tech', Icon: Snowflake },
        { label: 'Pressure Relief', Icon: Heart },
        { label: 'Easy Fit', Icon: Check },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Anti-Slip', Icon: Shield }
      ]
    }
    
    if (product.category === 'bed-frames') {
      return [
        { label: 'Sturdy Build', Icon: Zap },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (product.category === 'bedding') {
      return [
        { label: 'Premium Fabric', Icon: Star },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Care', Icon: Waves },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (product.category === 'box-springs') {
      return [
        { label: 'Sturdy Support', Icon: Zap },
        { label: 'Durable Construction', Icon: Shield },
        { label: 'Multiple Heights', Icon: Ruler },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    if (product.category === 'adjustable-bases') {
      return [
        { label: 'Adjustable Height', Icon: SlidersHorizontal },
        { label: 'Memory Positions', Icon: Brain },
        { label: 'Remote Control', Icon: Radio },
        { label: 'USB Ports', Icon: Zap },
        { label: 'Quiet Operation', Icon: VolumeX },
        { label: 'Warranty', Icon: Award }
      ]
    }
    
    // Default features (EXACTLY same as product card)
    return [
      { label: 'Premium Quality', Icon: () => <Star className="h-4 w-4" /> },
      { label: 'Fast Delivery', Icon: () => <Truck className="h-4 w-4" /> },
      { label: 'Warranty', Icon: () => <Shield className="h-4 w-4" /> }
    ]
  }

  const productFeatures = useMemo(() => buildProductFeatures(), [product.features, product.category])

  // Check if product has only one variant
  const hasOnlyOneVariant = (product as any).variants && (product as any).variants.length === 1
  const singleVariant = hasOnlyOneVariant ? (product as any).variants[0] : null


  const [isButtonSticky, setIsButtonSticky] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const buttonRef = useRef<HTMLDivElement>(null)

  // Dynamic size data from variants (data-driven)
  const sizeData = useMemo(() => {
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
        const entries = Array.from(sizeToLowestPrice.entries()).map(([name, price]) => {
          // Find a variant with this size to get dimensions
          const variantWithSize = sized.find(v => v.size === name)
          return {
          name,
          dimensions: `${name} dimensions`,
          availability: (product as any).inStock ? 'In Stock' : 'Dispatched within 45 Days',
          inStock: Boolean((product as any).inStock),
          wasPrice: price.wasPrice || 0,
            currentPrice: price.currentPrice || 0,
            // Add dimension fields from variant
            length: variantWithSize?.length || null,
            width: variantWithSize?.width || null,
            height: variantWithSize?.height || null
          }
        })
        if (entries.length > 0) return entries
      }
    }
    // If no sizes exist, return an empty list to indicate size is not applicable
    return []
  }, [(product as any).variants, (product as any).inStock])

  // Ensure we have valid prices
  const originalPrice = product.originalPrice || product.currentPrice || 0
  const currentPrice = product.currentPrice || product.originalPrice || 0
  const hasValidPrices = originalPrice > 0 && currentPrice > 0

  const [selectedSize, setSelectedSize] = useState<string>("")
  // Smart variant selection logic
  const getAvailableVariantOptions = useCallback(() => {
    const variants = (product as any).variants || []

    // Build distinct, meaningful values for each option
    const distinct = (values: any[]) => {
      return Array.from(
        new Set(
          values
            .filter((v) => typeof v === 'string')
            .map((v) => (v as string).trim())
            .filter((v) => v.length > 0 && v.toLowerCase() !== 'n/a' && v.toLowerCase() !== 'na' && v.toLowerCase() !== 'standard')
        )
      )
    }

    const sizeSet = distinct(variants.map((v: any) => v.size))
    const colorSet = distinct(variants.map((v: any) => v.color))
    const depthSet = distinct(variants.map((v: any) => v.depth))
    const firmnessSet = distinct(variants.map((v: any) => v.firmness))

    // Only consider an option "available to choose" if there are 2+ distinct values
    const hasSizes = sizeSet.length > 1
    const hasColors = colorSet.length > 1
    const hasDepths = depthSet.length > 1
    const hasFirmness = firmnessSet.length > 1

    // Debug: concise log to aid diagnosing unexpected detections in production
    console.log('getAvailableVariantOptions:', { 
      sizes: sizeSet, colors: colorSet, depths: depthSet, firmnesses: firmnessSet,
      hasSizes, hasColors, hasDepths, hasFirmness
    })

    return { hasSizes, hasColors, hasDepths, hasFirmness }
  }, [(product as any).variants])

  const getNextRequiredSelection = useCallback(() => {
    const { hasSizes, hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
    
    // Check each selection in order, but be more explicit about what's already selected
    if (hasSizes && !selectedSize) return 'size'
    if (hasColors && !selectedColor) return 'color'
    if (hasDepths && !(product as any).selectedDepth) return 'depth'
    if (hasFirmness && !(product as any).selectedFirmness) return 'firmness'
    
    return null
  }, [getAvailableVariantOptions, selectedSize, selectedColor, (product as any).selectedDepth, (product as any).selectedFirmness])

  const openNextRequiredModal = useCallback(() => {
    const nextSelection = getNextRequiredSelection()
    
    // Prevent opening the same modal that was just closed
    if (nextSelection === 'size' && !sizeModalOpen && lastSelection !== 'size') {
      setSizeModalOpen(true)
    } else if (nextSelection === 'color' && !colorModalOpen && lastSelection !== 'color') {
      setColorModalOpen(true)
    }
    // Add more modals as needed for depth, firmness, etc.
  }, [getNextRequiredSelection, sizeModalOpen, colorModalOpen, lastSelection])

  const startSmartSelection = useCallback(() => {
    setIsAutoSelectionMode(true)
    const nextSelection = getNextRequiredSelection()
    if (nextSelection) {
      openNextRequiredModal()
    }
    // Don't automatically add to cart - only when user clicks "Add to Basket"
  }, [getNextRequiredSelection, openNextRequiredModal])




  // useEffect to automatically add to cart when all variants are selected in sequential flow
  useEffect(() => {
    console.log('useEffect triggered - isSequentialFlow:', isSequentialFlow, 'selectedSize:', selectedSize, 'selectedColor:', selectedColor)
    if (!isSequentialFlow) return // Only run when in sequential flow mode
    
    // Add a small delay to ensure state updates are complete
    const timeoutId = setTimeout(() => {
    
    const { hasSizes, hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
    
    // Check if all required variants are selected
    const allVariantsSelected = 
      (!hasSizes || selectedSize) &&
      (!hasColors || selectedColor) &&
      (!hasDepths || (product as any).selectedDepth) &&
      (!hasFirmness || (product as any).selectedFirmness)
    
    if (allVariantsSelected) {
      console.log('All variants selected, automatically adding to cart')
      setIsSequentialFlow(false) // Reset the flag
      
      // Calculate current variant price
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
      
      // Get selected size data
      const selectedSizeData = selectedSize ? sizeData.find(size => size.name === selectedSize) : null
      
      // Prepare payload with free gift details if available
      const payload: any = {
          id: String(product.id),
          name: product.name,
          brand: product.brand,
          image: selectedImage || product.image,
          currentPrice: currentVariantPrice,
          originalPrice: product.originalPrice,
          size: selectedSizeData?.name || 'Standard',
          color: selectedColor
      }

      // Add free gift details if available
      const hasFreeGift = (product as any).free_gift_product_id && (
        (product as any).free_gift_enabled || 
        (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
      )
      
      if (hasFreeGift) {
        // Use the gift product name from the fields or default
        const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
        
        Object.assign(payload, {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || ''
        })
        console.log('Free gift will be added:', {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || '',
          source: 'product_detail_page'
        })
      } else {
        console.log('No free gift details available - reasons:', {
          hasFreeGiftProductId: !!(product as any).free_gift_product_id,
          free_gift_enabled: (product as any).free_gift_enabled,
          hasFreeGiftBadge: (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
        })
      }

      // Actually add the item to cart using cart context
      console.log('Dispatching ADD_ITEM with payload:', payload)
      dispatch({
        type: 'ADD_ITEM',
        payload
      })
      console.log('ADD_ITEM dispatched successfully')

      // Open the basket sidebar
      setBasketSidebarOpen(true)
    }
    }, 100) // Small delay to ensure state updates are complete
    
    return () => clearTimeout(timeoutId)
  }, [isSequentialFlow, selectedSize, selectedColor, getAvailableVariantOptions, dispatch, selectedImage, sizeData, product])

  // Enhanced smart selection that can start with either size or color
  const startSmartSelectionWithPriority = useCallback((priorityType?: 'size' | 'color') => {
    setIsAutoSelectionMode(true)
    setIsSequentialFlow(false) // Reset sequential flow flag for individual variant selection
    
    // Reset lastSelection when manually opening modals to allow reopening
    setLastSelection(null)
    
    if (priorityType === 'size') {
      // Start with size selection - allow reopening even if size is already selected
      const { hasSizes } = getAvailableVariantOptions()
      if (hasSizes) {
        setSizeModalOpen(true)
        return
      }
    } else if (priorityType === 'color') {
      // Start with color selection - allow reopening even if color is already selected
      const { hasColors } = getAvailableVariantOptions()
      if (hasColors) {
        setColorModalOpen(true)
        return
      }
    }
    
    // Fall back to normal smart selection
    startSmartSelection()
  }, [selectedSize, selectedColor, lastSelection, getAvailableVariantOptions, startSmartSelection])

  // Get the selected size data with fallback
  const selectedSizeData = selectedSize ? sizeData.find(size => size.name === selectedSize) : null

  // Get current variant based on selected options
  const getCurrentVariant = useCallback(() => {
    const variants = (product as any).variants || []
    if (variants.length === 0) return null
    
    // If no size or color selected, return first variant
    if (!selectedSize && !selectedColor) {
      return variants[0]
    }
    
    // Find variant that matches selected size and color
    const matchingVariant = variants.find((variant: any) => {
      const sizeMatch = !selectedSize || variant.size === selectedSize
      const colorMatch = !selectedColor || variant.color === selectedColor
      return sizeMatch && colorMatch
    })
    
    return matchingVariant || variants[0] // Fallback to first variant
  }, [selectedSize, selectedColor, product])

  const currentVariant = getCurrentVariant()

  const addToCart = useCallback(() => {
    console.log('addToCart function called')
    console.log('Product data:', product)
    console.log('Selected size:', selectedSize)
    console.log('Selected color:', selectedColor)
    
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
    
    console.log('Current variant price:', currentVariantPrice)

    // Check if this product has a free gift - simplified detection
    const hasFreeGift = (product as any).free_gift_product_id && (
      (product as any).free_gift_enabled || 
      (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
    )
    // Debug logging
    console.log('Product being added to cart from detail page:', {
      id: product.id,
      name: product.name,
      badges: (product as any).badges,
      free_gift_product_id: (product as any).free_gift_product_id,
      free_gift_enabled: (product as any).free_gift_enabled,
      free_gift_product_name: (product as any).free_gift_product_name,
      free_gift_product_image: (product as any).free_gift_product_image,
      hasFreeGift,
      badgesType: typeof (product as any).badges,
      badgesIsArray: Array.isArray((product as any).badges),
      badgesContent: (product as any).badges
    })

    // For single variant products, skip validation and go straight to cart
    if (hasOnlyOneVariant && singleVariant) {
      // Prepare payload with free gift details if available
      const payload: any = {
          id: String(product.id),
          name: product.name,
          brand: product.brand,
          image: selectedImage || product.image,
          currentPrice: singleVariant.currentPrice || singleVariant.originalPrice || product.currentPrice || 0,
          originalPrice: singleVariant.originalPrice || product.originalPrice,
          size: singleVariant.size || 'Standard',
          color: singleVariant.color || 'Standard'
        }

      // Add free gift details if available
      if (hasFreeGift) {
        // Use the gift product name from the fields or default
        const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
        
        Object.assign(payload, {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || ''
        })
        console.log('Free gift will be added:', {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || '',
          source: 'product_detail_page'
        })
      } else {
        console.log('No free gift details available - reasons:', {
          hasFreeGiftProductId: !!(product as any).free_gift_product_id,
          free_gift_enabled: (product as any).free_gift_enabled,
          hasFreeGiftBadge: (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
        })
      }

      // Add the single variant directly to cart
      console.log('Dispatching ADD_ITEM for single variant with payload:', payload)
      dispatch({
        type: 'ADD_ITEM',
        payload
      })
      console.log('ADD_ITEM for single variant dispatched successfully')
      
      // Open the basket sidebar
      setBasketSidebarOpen(true)
      return
    }

    // Check if all required variants are already selected
    const { hasSizes, hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
    
    // For depth and firmness, use default values if not selected
    const variants = (product as any).variants || []
    let selectedDepth = (product as any).selectedDepth
    let selectedFirmness = (product as any).selectedFirmness
    
    if (hasDepths && !selectedDepth) {
      selectedDepth = variants.find((v: any) => v.depth && v.depth.trim() !== '')?.depth
      if (selectedDepth) {
        console.log('Using default depth for variant check:', selectedDepth)
        ;(product as any).selectedDepth = selectedDepth
      }
    }
    
    if (hasFirmness && !selectedFirmness) {
      selectedFirmness = variants.find((v: any) => v.firmness && v.firmness.trim() !== '')?.firmness
      if (selectedFirmness) {
        console.log('Using default firmness for variant check:', selectedFirmness)
        ;(product as any).selectedFirmness = selectedFirmness
      }
    }
    
    const allVariantsSelected = 
      (!hasSizes || selectedSize) &&
      (!hasColors || selectedColor) &&
      (!hasDepths || selectedDepth) &&
      (!hasFirmness || selectedFirmness)
    
    console.log('Variant check:', {
      hasSizes,
      hasColors, 
      hasDepths,
      hasFirmness,
      selectedSize,
      selectedColor,
      selectedDepth: (product as any).selectedDepth,
      selectedFirmness: (product as any).selectedFirmness,
      allVariantsSelected
    })
    
    if (allVariantsSelected) {
      console.log('All variants already selected, adding to cart directly')
      
      // Get selected size data
      const selectedSizeData = selectedSize ? sizeData.find(size => size.name === selectedSize) : null
      
      // Find the selected variant to get its SKU
      const selectedVariant = (product as any).variants?.find((variant: any) => 
        variant.size === (selectedSizeData?.name || 'Standard')
      )
      
      // Prepare payload with free gift details if available
      const payload: any = {
          id: String(product.id),
          name: product.name,
          brand: product.brand,
          image: selectedImage || product.image,
          currentPrice: currentVariantPrice,
          originalPrice: product.originalPrice,
          size: selectedSizeData?.name || 'Standard',
          color: selectedColor,
          variantSku: selectedVariant?.sku
      }

      // Add free gift details if available
      if (hasFreeGift) {
        // Use the gift product name from the fields or default
        const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
        
        Object.assign(payload, {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || ''
        })
        console.log('Free gift will be added:', {
          freeGiftProductId: (product as any).free_gift_product_id,
          freeGiftProductName: giftProductName,
          freeGiftProductImage: (product as any).free_gift_product_image || '',
          source: 'product_detail_page'
        })
      } else {
        console.log('No free gift details available - reasons:', {
          hasFreeGiftProductId: !!(product as any).free_gift_product_id,
          free_gift_enabled: (product as any).free_gift_enabled,
          hasFreeGiftBadge: (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
        })
      }

      // Actually add the item to cart using cart context
      console.log('Dispatching ADD_ITEM with payload:', payload)
      dispatch({
        type: 'ADD_ITEM',
        payload
      })
      console.log('ADD_ITEM dispatched successfully')

      // Open the basket sidebar
      setBasketSidebarOpen(true)
    } else {
      console.log('Not all variants selected, opening sequential selection')
      // Inline the sequential variant selection logic
      setIsSequentialFlow(true) // Mark that we're in sequential flow mode
      
    const { hasSizes, hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()

    // Start with size check (if size variants exist)
    if (hasSizes && !selectedSize) {
      // Size is required but not selected, open size modal
      setSizeModalOpen(true)
      return
    }

    // After size is selected (or if no size required), check color
    if (hasColors && !selectedColor) {
      // Color is required but not selected, open color modal
      setColorModalOpen(true)
      return
    }

    // Check for other variant types if they exist
      const variants = (product as any).variants || []
    if (hasDepths && !(product as any).selectedDepth) {
        // For now, use the first available depth value as default
        const firstDepth = variants.find((v: any) => v.depth && v.depth.trim() !== '')?.depth
        if (firstDepth) {
          console.log('Using default depth:', firstDepth)
          // Set the depth in the product object for consistency
          ;(product as any).selectedDepth = firstDepth
        }
    }

    if (hasFirmness && !(product as any).selectedFirmness) {
        // For now, use the first available firmness value as default
        const firstFirmness = variants.find((v: any) => v.firmness && v.firmness.trim() !== '')?.firmness
        if (firstFirmness) {
          console.log('Using default firmness:', firstFirmness)
          // Set the firmness in the product object for consistency
          ;(product as any).selectedFirmness = firstFirmness
        }
    }

    // All required variants are selected, proceed to add to cart
      console.log('All variants selected in inline logic, adding to cart')
      
      // Calculate current variant price
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

    // Prepare payload with free gift details if available
    const payload: any = {
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        image: selectedImage || product.image,
        currentPrice: currentVariantPrice,
        originalPrice: product.originalPrice,
        size: selectedSizeData?.name || 'Standard',
        color: selectedColor
    }

    // Add free gift details if available
      const hasFreeGift = (product as any).free_gift_product_id && (
        (product as any).free_gift_enabled || 
        (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
      )
      
    if (hasFreeGift) {
      // Use the gift product name from the fields or default
      const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
      
      Object.assign(payload, {
        freeGiftProductId: (product as any).free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: (product as any).free_gift_product_image || ''
      })
      console.log('Free gift will be added:', {
        freeGiftProductId: (product as any).free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: (product as any).free_gift_product_image || '',
        source: 'product_detail_page'
      })
    } else {
      console.log('No free gift details available - reasons:', {
        hasFreeGiftProductId: !!(product as any).free_gift_product_id,
        free_gift_enabled: (product as any).free_gift_enabled,
        hasFreeGiftBadge: (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
      })
    }

    // Actually add the item to cart using cart context
      console.log('Dispatching ADD_ITEM with payload:', payload)
    dispatch({
      type: 'ADD_ITEM',
      payload
    })
      console.log('ADD_ITEM dispatched successfully')

      // Open the basket sidebar
    setBasketSidebarOpen(true)
      setIsSequentialFlow(false) // Reset the flag
    }
  }, [hasOnlyOneVariant, singleVariant, product, dispatch, selectedImage, selectedSize, selectedColor, sizeData, getAvailableVariantOptions])

  // Function to start sequential variant selection flow for Add to Basket
  const startSequentialVariantSelection = useCallback(() => {
    setIsSequentialFlow(true) // Mark that we're in sequential flow mode
    
    const { hasSizes, hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
    
    // Start with size check (if size variants exist)
    if (hasSizes && !selectedSize) {
      // Size is required but not selected, open size modal
      setSizeModalOpen(true)
      return
    }
    
    // After size is selected (or if no size required), check color
    if (hasColors && !selectedColor) {
      // Color is required but not selected, open color modal
      setColorModalOpen(true)
      return
    }
    
    // Check for other variant types if they exist
    if (hasDepths && !(product as any).selectedDepth) {
      // Depth is required but not selected, would need to implement depth modal
      console.log('Depth selection required but not implemented yet')
      return
    }
    
    if (hasFirmness && !(product as any).selectedFirmness) {
      // Firmness is required but not selected, would need to implement depth modal
      console.log('Firmness selection required but not implemented yet')
      return
    }
    
    // All required variants are selected, proceed to add to cart
    console.log('All variants selected in startSequentialVariantSelection, adding to cart')
    
    // Calculate current variant price
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

    // Prepare payload with free gift details if available
    const payload: any = {
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        image: selectedImage || product.image,
        currentPrice: currentVariantPrice,
        originalPrice: product.originalPrice,
        size: selectedSizeData?.name || 'Standard',
        color: selectedColor
    }

    // Add free gift details if available
    const hasFreeGift = (product as any).free_gift_product_id && (
      (product as any).free_gift_enabled || 
      (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
    )
    
    if (hasFreeGift) {
      // Use the gift product name from the fields or default
      const giftProductName = (product as any).free_gift_product_name || 'Free Gift'
      
      Object.assign(payload, {
        freeGiftProductId: (product as any).free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: (product as any).free_gift_product_image || ''
      })
      console.log('Free gift will be added:', {
        freeGiftProductId: (product as any).free_gift_product_id,
        freeGiftProductName: giftProductName,
        freeGiftProductImage: (product as any).free_gift_product_image || '',
        source: 'product_detail_page'
      })
    } else {
      console.log('No free gift details available - reasons:', {
        hasFreeGiftProductId: !!(product as any).free_gift_product_id,
        free_gift_enabled: (product as any).free_gift_enabled,
        hasFreeGiftBadge: (product as any).badges?.some((b: any) => b.type === 'free_gift' && b.enabled)
      })
    }

    // Actually add the item to cart using cart context
    console.log('Dispatching ADD_ITEM with payload:', payload)
    dispatch({
      type: 'ADD_ITEM',
      payload
    })
    console.log('ADD_ITEM dispatched successfully')

    // Open the basket sidebar
    setBasketSidebarOpen(true)
    setIsSequentialFlow(false) // Reset the flag
  }, [getAvailableVariantOptions, selectedSize, selectedColor, product, dispatch, selectedImage, sizeData, selectedSizeData])

  // Safe monthly price calculation - use product prices when no size is selected
  const monthlyPrice = selectedSizeData?.currentPrice ? Math.floor(selectedSizeData.currentPrice / 12) : Math.floor((product.currentPrice || currentPrice) / 12)

  const gallery = useMemo(() => 
  product.images && product.images.length > 0 ? product.images : [product.image], 
  [product.images, product.image]
)

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
                          ) : selectedSizeData && selectedSizeData.currentPrice ? (
                            `£${selectedSizeData.currentPrice.toFixed(2)}`
                          ) : product.originalPrice && product.currentPrice && product.originalPrice > product.currentPrice ? (
                            `Save £${(product.originalPrice - product.currentPrice).toFixed(2)}`
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

                  {/* Variant Dimensions */}
                  {(selectedSizeData.length || selectedSizeData.width || selectedSizeData.height) && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 font-medium mb-2">Variant Dimensions:</div>
                      
                      {/* Simple LxWxH Display */}
                      <div className="mb-3">
                        <div className="text-lg font-bold text-gray-800">
                          {selectedSizeData.length && `${selectedSizeData.length}cm`}
                          {selectedSizeData.width && selectedSizeData.length && ' × '}
                          {selectedSizeData.width && `${selectedSizeData.width}cm`}
                          {selectedSizeData.height && (selectedSizeData.length || selectedSizeData.width) && ' × '}
                          {selectedSizeData.height && `${selectedSizeData.height}cm`}
                            </div>

                            </div>


                    </div>

                  )}

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

                  {/* Right Side: Size Selection Prompt and Base Dimensions */}
                  <div className="text-left sm:text-right sm:ml-4 min-w-0">

                    {(() => {
                      const hasMultiple = !!((product as any).variants && (product as any).variants.length > 1)
                      if (!hasMultiple) return null
                      const { hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
                      const hasNonSize = hasColors || hasDepths || hasFirmness
                      if (!hasNonSize) return null
                      return (
                        <>
                          <div className="text-lg font-semibold text-gray-600 mb-2">View details</div>
                          <div className="text-sm text-gray-500">Choose colour and other options</div>
                        </>
                      )
                    })()}

                    
                    {/* Variant Dimensions - Show selected variant dimensions */}
                    {(() => {
                      // Get dimensions from current variant or fallback to product dimensions
                      const dimensions = currentVariant ? {
                        length: currentVariant.length,
                        width: currentVariant.width,
                        height: currentVariant.height
                      } : (product.dimensions ? {
                        length: product.dimensions.length,
                        width: product.dimensions.width,
                        height: product.dimensions.height
                      } : null)

                      if (!dimensions || (!dimensions.length && !dimensions.width && !dimensions.height)) {
                        return null
                      }

                      return (
                        <div className="mt-3">
                          <div className="text-sm text-gray-600 font-medium mb-1">
                            Dimensions {currentVariant ? `(${currentVariant.size || 'Selected'})` : ''}:
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {dimensions.length && `${dimensions.length.replace('L ', '').replace('cm', '')}cm`}
                            {dimensions.width && dimensions.length && ' × '}
                            {dimensions.width && `${dimensions.width.replace('cm', '')}cm`}
                            {dimensions.height && (dimensions.length || dimensions.width) && ' × '}
                            {dimensions.height && `${dimensions.height.replace('cm', '')}cm`}
                          </div>
                        </div>
                      )
                    })()}
                </div>

              </div>

            </div>

            )}

              {/* Product Features - Display features saved from Mattresses features section */}
              {productFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Product Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {productFeatures.map(({ label, Icon }, index) => (
                        <div key={index} className="flex items-center gap-2 min-w-0">
                        <div className="w-4 h-4 text-orange-500 flex-shrink-0">
                          <Icon className="h-4 w-4" />
                          </div>
                        <span className="text-sm text-gray-700 break-words">{label}</span>
                        </div>
                    ))}
                          </div>
                </div>
              )}



                  </div>



            {/* Choose Size - Clickable Option - White Button - Only show when size is a variant feature */}
            {(() => {
              const { hasSizes } = getAvailableVariantOptions()
              return (!hasOnlyOneVariant && hasSizes)
            })() && (

            <div className="border-0 rounded-lg p-4 bg-white mb-2 cursor-pointer" onClick={() => startSmartSelectionWithPriority('size')}>

              <div className="flex items-center justify-between">
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

            {/* Single Variant Info - Show for single variant products - DISABLED */}
            {false && hasOnlyOneVariant && singleVariant && (
              <div className="border-0 rounded-lg p-4 bg-blue-50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-blue-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-blue-700 font-semibold text-lg">
                    Single Variant Product
                  </span>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  {singleVariant.size && <span className="mr-4">Size: {singleVariant.size}</span>}
                  {singleVariant.color && <span>Color: {singleVariant.color}</span>}
                </div>
              </div>
            )}



                        {/* Color & Other Options Selection - Clickable Option - White Button */}
                        {/* Removed - now handled by smart selection flow */}

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

                    <span className="font-bold text-xl tracking-wide">
                      {hasOnlyOneVariant ? 'Add to Basket' : 'Choose Options & Add to Basket'}
                    </span>

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

            <div 
              className="relative w-full h-96 lg:h-[28rem] xl:h-[32rem] rounded-xl overflow-hidden bg-gray-50 cursor-pointer mb-4 flex items-center justify-center group" 
              onClick={() => {
              const currentIndex = gallery.findIndex(img => img === selectedImage);
              setModalImageIndex(currentIndex >= 0 ? currentIndex : 0);
              setImageModalOpen(true);
              }}
              onKeyDown={(e) => {
                if (gallery.length > 1) {
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const currentIndex = gallery.findIndex(img => img === selectedImage);
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
                    setSelectedImage(gallery[newIndex]);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentIndex = gallery.findIndex(img => img === selectedImage);
                    const newIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
                    setSelectedImage(gallery[newIndex]);
                  }
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${product.name} image gallery`}
            >
              <Image 
                src={selectedImage || product.image || "/placeholder.svg"} 
                alt={product.name} 
                fill 
                className="object-contain"
                priority
                onError={(e) => {
                  console.error('Image failed to load:', e)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />

              {/* Navigation Arrows - Only show when gallery has multiple images */}
              {gallery.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = gallery.findIndex(img => img === selectedImage);
                      const newIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
                      setSelectedImage(gallery[newIndex]);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20 border border-gray-200 hover:border-gray-300"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = gallery.findIndex(img => img === selectedImage);
                      const newIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(gallery[newIndex]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20 border border-gray-200 hover:border-gray-300"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Counter Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg border border-white/20">
                    {gallery.findIndex(img => img === selectedImage) + 1} / {gallery.length}
                  </div>
                </>
              )}

              {/* Free Gift Badge - Top Left */}
              {product.badges?.some(b => b.type === 'free_gift' && b.enabled) && (
                <div className="absolute top-4 left-4 z-30">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-lg">
                    🎁 Free Gift
                  </Badge>
                </div>
              )}
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

                          className="object-contain bg-white"

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

                {product.headline && (
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                    {product.headline}
                </h2>
                )}

              </div>

              

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium mb-4">

                {product.longDescription || ''}

              </p>

              

              <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm">

                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>

                </svg>

                {product.warrantyDeliveryLine && (
                  <span className="text-xs sm:text-sm">
                    {product.warrantyDeliveryLine}
                  </span>
                )}

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

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed break-words">{reason}</div>

                        {(product as any).customReasonsDescriptions?.[index] && (

                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1 break-words">{(product as any).customReasonsDescriptions[index]}</div>

                        )}

                      </div>

                    </div>

                  ))

                ) : (

                  <>

                    {/* Fallback Reasons */}

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Premium quality pocket spring construction</span>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Advanced memory foam comfort layers</span>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Superior edge-to-edge support</span>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Temperature regulating technology</span>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">10-year warranty for peace of mind</span>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">

                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>

                        </svg>

                      </div>

                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">100-night sleep trial guarantee</span>

                    </div>

                  </>

                )}

              </div>

            </div>



            {/* 3. Features You'll Love - Database Driven */}

            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">

                              <div className="flex items-center gap-3 mb-4 sm:mb-6">

                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">

                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>

                    </svg>

                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Features you'll love</h2>

                </div>

              



              

              {/* Display features from database (reasonsToLove) */}

              {(product.reasonsToLove && product.reasonsToLove.length > 0) ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                  {(product.reasonsToLove || []).map((label: string, idx: number) => {

                    // Use centralized icon mapping for consistent icons
                    const getIconComponent = (iconType?: string) => {

                      // If we have a specific icon type from admin, use it

                      if ((product as any).reasonsToLoveIcons?.[idx]) {

                        const iconTypeLower = (product as any).reasonsToLoveIcons[idx].toLowerCase()

                    

                        switch (iconTypeLower) {

                          // Basic icons
                          case 'support': return () => <Heart className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'comfort': return () => <Bed className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'firmness': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'quality': return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'durability': return () => <Zap className="h-8 w-8 sm:h-10 sm:w-10" />

                          // Material icons
                          case 'wood': return () => <Trees className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'metal': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'upholstery': return () => <Package className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'construction': return () => <Wrench className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'design': return () => <Palette className="h-8 w-8 sm:h-10 sm:w-10" />

                          // Feature-specific icons
                          case 'memory-foam': return () => <Brain className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'pocket-springs': return () => (

                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 sm:h-10 sm:w-10">

                              <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>

                              <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>

                              <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>

                              <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>

                            </svg>

                          )

                          case 'cooling': return () => <Snowflake className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'edge-support': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'orthopedic': return () => <Heart className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'anti-bacterial': return () => <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'hypoallergenic': return () => <Feather className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'eco-friendly': return () => <Leaf className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'warranty': return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'delivery': return () => <Truck className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'removable-cover': return () => <PackageOpen className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'value': return () => <DollarSign className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'luxury': return () => <Gem className="h-8 w-8 sm:h-10 sm:w-10" />

                          // Admin panel icon names (exact matches)
                          case 'springs': return () => <Package className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'brain': return () => <Brain className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'sliders': return () => <SlidersHorizontal className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'grid': return () => <Grid className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'rotate': return () => <RefreshCw className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'layers': return () => <Layers className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'droplet': return () => <Droplet className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'arrow-left-right': return () => <ArrowLeftRight className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'waves': return () => <Waves className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'moon': return () => <Moon className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'star': return () => <Star className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'clock': return () => <Clock className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'volume-2': return () => <VolumeX className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'thermometer': return () => <Thermometer className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'corner': return () => <Square className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'sun': return () => <Sun className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'umbrella': return () => <Umbrella className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'scroll': return () => <Scroll className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'crown': return () => <Crown className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'settings': return () => <Settings className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'circle': return () => <Circle className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'users': return () => <Users className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'home': return () => <Home className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'baby': return () => <Baby className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'radio': return () => <Radio className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'maximize': return () => <Maximize className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'minimize': return () => <Minimize className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'ruler': return () => <Ruler className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'package': return () => <Package className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'shield-check': return () => <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'sprout': return () => <Sprout className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'mountain': return () => <Mountain className="h-8 w-8 sm:h-10 sm:w-10" />

                          // Additional icon mappings from admin panel
                          case 'leaf': return () => <Leaf className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'gem': return () => <Gem className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'heart': return () => <Heart className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'shield': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'badge': return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'feather': return () => <Feather className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'truck': return () => <Truck className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'package-open': return () => <PackageOpen className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'sliders-horizontal': return () => <SlidersHorizontal className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'wrench': return () => <Wrench className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'palette': return () => <Palette className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'award': return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'trees': return () => <Trees className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'zap': return () => <Zap className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'lightbulb': return () => <Zap className="h-8 w-8 sm:h-10 sm:w-10" />

                          default: 

                            break

                        }

                      }

                      

                      // Fallback to smart icon detection based on text content

                      const text = (label || '').toLowerCase()

                      if (text.includes('memory') || text.includes('foam')) return () => <Brain className="h-8 w-8 sm:h-10 sm:w-10" />

                      if (text.includes('pocket') || text.includes('spring')) return () => (

                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 sm:h-10 sm:w-10">

                          <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>

                          <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>

                          <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>

                          <path d="M4 14h2M8 14h2M12 14h2M12 14h2M20 14h2"/>

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

                      // Furniture-specific icon detection

                      if (text.includes('wood') || text.includes('solid wood')) return () => <Trees className="h-8 w-8 sm:h-10 sm:w-10" />

                      if (text.includes('metal') || text.includes('frame')) return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                      if (text.includes('upholstered') || text.includes('headboard')) return () => <Package className="h-8 w-8 sm:h-10 sm:w-10" />

                      if (text.includes('construction') || text.includes('built')) return () => <Wrench className="h-8 w-8 sm:h-10 sm:w-10" />

                      if (text.includes('design') || text.includes('style')) return () => <Palette className="h-8 w-8 sm:h-10 sm:w-10" />

                      return () => <Check className="h-8 w-8 sm:h-10 sm:w-10" />

                    }

                    

                    const IconComp = getIconComponent()

                    

                    return (

                      <div key={`${label}-${idx}`} className="text-center min-w-0">

                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500 flex items-center justify-center">
                          {IconComp()}
                        </div>
                        {/* Small text below icon */}
                        {(product as any).reasonsToLoveSmalltext?.[idx] && (
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{(product as any).reasonsToLoveSmalltext[idx]}</p>
                        )}
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">{label}</h3>
                        {(product as any).reasonsToLoveDescriptions?.[idx] && (
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{(product as any).reasonsToLoveDescriptions[idx]}</p>
                        )}
                      </div>

                    )

                  })}

                </div>

              ) : (

                /* Show fallback features with descriptions when no database features exist */

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                  {productFeatures.map((feature, idx) => {

                    const getFallbackDescription = (label: string) => {
                      const text = label.toLowerCase()
                      
                      // Mattress-specific descriptions
                      if (text.includes('pocket') || text.includes('spring')) {
                        return "Individually pocketed springs work to give you support exactly where you need it."
                      }
                      if (text.includes('memory') || text.includes('foam')) {
                        return "Advanced memory foam technology that contours to your body shape for ultimate comfort."
                      }
                      if (text.includes('cool') || text.includes('breath') || text.includes('air')) {
                        return "Breathable materials and air circulation technology keep you cool throughout the night."
                      }
                      if (text.includes('gel') || text.includes('temperature')) {
                        return "Temperature-regulating gel technology adapts to your body heat for optimal sleep."
                      }
                      if (text.includes('edge')) {
                        return "Reinforced edge support provides consistent comfort from center to edge."
                      }
                      if (text.includes('firm')) {
                        return "Optimal firmness level provides the perfect balance of support and comfort."
                      }
                      if (text.includes('anti') || text.includes('bacterial') || text.includes('microbial')) {
                        return "Anti-microbial treatment protects against bacteria and allergens for a healthier sleep environment."
                      }
                      if (text.includes('eco') || text.includes('organic') || text.includes('sustain')) {
                        return "Eco-friendly materials made from sustainable and organic sources."
                      }
                      if (text.includes('waterproof') || text.includes('cover')) {
                        return "Waterproof cover protects your mattress from spills and accidents."
                      }
                      if (text.includes('warranty')) {
                        return "Comprehensive warranty coverage gives you peace of mind for years to come."
                      }
                      if (text.includes('support') || text.includes('orth')) {
                        return "Orthopedic support system designed to promote proper spinal alignment."
                      }
                      if (text.includes('hypo') || text.includes('allergen')) {
                        return "Hypoallergenic materials perfect for those with sensitive skin or allergies."
                      }
                      if (text.includes('delivery') || text.includes('shipping')) {
                        return "Fast and reliable delivery service to get your mattress to you quickly."
                      }
                      if (text.includes('washable') || text.includes('removable')) {
                        return "Easy-care removable and washable covers for simple maintenance."
                      }
                      if (text.includes('value') || text.includes('price') || text.includes('save')) {
                        return "Exceptional value with premium quality at an affordable price point."
                      }
                      if (text.includes('durable') || text.includes('long')) {
                        return "Built to last with durable materials and expert craftsmanship."
                      }
                      if (text.includes('luxury') || text.includes('premium')) {
                        return "Luxury quality materials and construction for the ultimate sleep experience."
                      }
                      if (text.includes('wood')) {
                        return "Premium solid wood construction ensures durability and timeless beauty."
                      }
                      if (text.includes('metal') || text.includes('frame')) {
                        return "Sturdy metal frame construction provides reliable support and stability."
                      }
                      if (text.includes('upholstery') || text.includes('headboard')) {
                        return "Beautiful upholstered headboard adds elegance and comfort to your bedroom."
                      }
                      if (text.includes('construction') || text.includes('built')) {
                        return "Expert craftsmanship and quality construction for lasting performance."
                      }
                      if (text.includes('design') || text.includes('style')) {
                        return "Contemporary design that complements any bedroom decor style."
                      }
                      
                      // Default description
                      return "Premium feature designed to enhance your comfort and satisfaction."
                    }

                    return (
                      <div key={`fallback-${feature.label}-${idx}`} className="text-center min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-orange-500 flex items-center justify-center">
                          {feature.Icon({})}
                  </div>
                        {/* Small text below icon for fallback features */}
                        {(product as any).reasonsToLoveSmalltext?.[idx] && (
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{(product as any).reasonsToLoveSmalltext[idx]}</p>
                        )}
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">{feature.label}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {getFallbackDescription(feature.label)}
                        </p>
                      </div>
                    )
                  })}

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
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm italic">No description content available</p>
                              </div>
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

                        


                        




                        {/* Dimensions Grid Layout */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                          {/* Technical Specifications */}

                          <div className="space-y-6">

                            <div>

                              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                {(() => {
                                  const category = product.category || 'mattresses'
                                  switch (category) {
                                    case 'beds': return 'Bed Dimensions'
                                    case 'sofas': return 'Sofa Dimensions'
                                    case 'pillows': return 'Pillow Dimensions'
                                    case 'toppers': return 'Topper Dimensions'
                                    case 'bunkbeds': return 'Bunkbed Dimensions'
                                    case 'adjustable-bases': return 'Base Dimensions'
                                    case 'bed-frames': return 'Frame Dimensions'
                                    case 'box-springs': return 'Box Spring Dimensions'
                                    case 'bedding': return 'Bedding Dimensions'
                                    case 'kids': return 'Product Dimensions'
                                    case 'sale': return 'Product Dimensions'
                                    default: return 'Overall Dimensions'
                                  }
                                })()}
                              </h4>

                              <div className="space-y-3">
                                {/* Basic Dimensions Section - Only show if enabled */}
                                {(product.dimensions?.show_basic_dimensions !== false) && (
                                  <>
                                    {product.dimensions?.height && (
                                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-700">A: Height</span>
                                        <span className="text-gray-900 font-semibold">{product.dimensions.height}</span>
                                      </div>
                                    )}

                                    {product.dimensions?.length && (
                                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-700">B: Length</span>
                                        <span className="text-gray-900 font-semibold">{product.dimensions.length}</span>
                                      </div>
                                    )}

                                    {(product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width) && (
                                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium text-gray-700">C: {product.category === 'sofas' ? 'Depth' : 'Width'}</span>
                                        <span className="text-gray-900 font-semibold">{product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                            </div>

                            

                            {/* Mattress Specifications Section - Only show if enabled */}
                            {(product.dimensions?.show_mattress_specs !== false) && (
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                  {(() => {
                                    const category = product.category || 'mattresses'
                                    switch (category) {
                                      case 'beds': return 'Bed Specifications'
                                      case 'sofas': return 'Sofa Specifications'
                                      case 'pillows': return 'Pillow Specifications'
                                      case 'toppers': return 'Topper Specifications'
                                      case 'bunkbeds': return 'Bunkbed Specifications'
                                      case 'adjustable-bases': return 'Adjustable Base Specifications'
                                      case 'bed-frames': return 'Bed Frame Specifications'
                                      case 'box-springs': return 'Box Spring Specifications'
                                      case 'bedding': return 'Bedding Specifications'
                                      case 'kids': return 'Kids Product Specifications'
                                      case 'sale': return 'Product Specifications'
                                      default: return 'Mattress Specifications'
                                    }
                                  })()}
                                </h4>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.mattress_size_heading || (() => {
                                      const category = product.category || 'mattresses'
                                      switch (category) {
                                        case 'beds': return 'Bed Size'
                                        case 'sofas': return 'Sofa Size'
                                        case 'pillows': return 'Pillow Size'
                                        case 'toppers': return 'Topper Size'
                                        case 'bunkbeds': return 'Bunkbed Size'
                                        case 'adjustable-bases': return 'Base Size'
                                        case 'bed-frames': return 'Frame Size'
                                        case 'box-springs': return 'Box Spring Size'
                                        case 'bedding': return 'Bedding Size'
                                        case 'kids': return 'Product Size'
                                        case 'sale': return 'Product Size'
                                        default: return 'Mattress Size'
                                      }
                                    })()}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.mattress_size || '135cm x L 190cm cm'}</span>

                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.maximum_height_heading}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.max_height || '25 cm'}</span>

                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.weight_capacity_heading || 'Weight Capacity'}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.weight_capacity || '200 kg'}</span>

                                  </div>
                                </div>
                              </div>
                            )}

                            

                            {/* Technical Specifications Section - Only show if enabled */}
                            {(product.dimensions?.show_technical_specs !== false) && (
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                  {(() => {
                                    const category = product.category || 'mattresses'
                                    switch (category) {
                                      case 'beds': return 'Frame Details'
                                      case 'sofas': return 'Construction Details'
                                      case 'pillows': return 'Material Details'
                                      case 'toppers': return 'Layer Details'
                                      case 'bunkbeds': return 'Construction Details'
                                      case 'adjustable-bases': return 'Base Details'
                                      case 'bed-frames': return 'Frame Details'
                                      case 'box-springs': return 'Spring Details'
                                      case 'bedding': return 'Material Details'
                                      case 'kids': return 'Product Details'
                                      case 'sale': return 'Product Details'
                                      default: return 'Construction Details'
                                    }
                                  })()}
                                </h4>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.pocket_springs_heading || 'Pocket Springs'}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.pocket_springs || '1000 count'}</span>

                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.comfort_layer_heading || 'Comfort Layer'}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.comfort_layer || '8 cm'}</span>

                                  </div>

                                  <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                    <span className="font-medium text-gray-700">{product.dimensions?.support_layer_heading || 'Support Layer'}</span>
                                    <span className="text-gray-900 font-semibold">{product.dimensions?.support_layer || '17 cm'}</span>

                                  </div>
                                </div>
                              </div>
                            )}

                            

                            {product.dimensions?.dimension_disclaimer && (
                            <div className="text-sm text-gray-500 italic">
                                {product.dimensions.dimension_disclaimer}
                            </div>
                            )}

                          </div>

                          

                          {/* Technical Diagram - Only show if basic dimensions exist */}
                          {(product.dimensions?.height || product.dimensions?.length || (product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width)) && (
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

                                    

                                                                       {/* Dimension Labels - Only show if dimension exists */}

                                     {product.dimensions?.height && (
                                       <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                         <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                           <span className="text-xs font-bold text-gray-700">A</span>
                                           <span className="text-xs text-gray-600">{product.dimensions.height}</span>
                                           <span className="text-xs text-gray-500">Height</span>
                                         </div>
                                       </div>
                                     )}

                                     {product.dimensions?.length && (
                                       <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                                         <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                           <span className="text-xs font-bold text-gray-700">B</span>
                                           <span className="text-xs text-gray-600">{product.dimensions.length}</span>
                                           <span className="text-xs text-gray-500">Length</span>
                                         </div>
                                       </div>
                                     )}

                                     {(product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width) && (
                                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                         <div className="flex items-center gap-1 bg-white rounded px-2 py-1 shadow-sm border border-gray-200">
                                           <span className="text-xs font-bold text-gray-700">C</span>
                                           <span className="text-xs text-gray-600">{product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width}</span>
                                           <span className="text-xs text-gray-500">{product.category === 'sofas' ? 'Depth' : 'Width'}</span>
                                         </div>
                                       </div>
                                     )}

                                    

                                                                       {/* Comfort Layer Indicator - Blue */}

                                     <div className="absolute top-1 left-1 right-1 h-3 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-sm border border-blue-300"></div>

                                     

                                     {/* Support Layer Indicator - Green */}

                                     <div className="absolute bottom-1 left-1 right-1 h-3 bg-gradient-to-r from-green-200 via-green-300 to-green-400 rounded-sm border border-green-300"></div>

                                  </div>

                                  

                                  {/* Dimension Lines - Only show if corresponding dimension exists */}
                                  {product.dimensions?.height && (
                                    <div className="absolute top-0 left-1/2 w-px h-8 bg-red-500"></div>
                                  )}
                                  {product.dimensions?.length && (
                                    <div className="absolute top-1/2 right-0 w-8 h-px bg-red-500"></div>
                                  )}
                                  {(product.category === 'sofas' ? (product.dimensions as any)?.depth : product.dimensions?.width) && (
                                    <div className="absolute bottom-0 left-1/2 w-px h-8 bg-red-500"></div>
                                  )}

                                </div>

                              </div>

                            </div>
                          )}

                        </div>

                        

                        {/* Available Sizes Grid */}

                        <div>

                          <h4 className="text-xl font-semibold text-gray-900 mb-4">Available Sizes</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            {sizeData.map((size) => (

                              <div 

                                key={size.name} 

                                className={`bg-white p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer relative ${

                                  selectedSize === size.name 

                                    ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200' 

                                    : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'

                                }`}

                                onClick={() => setSelectedSize(size.name)}

                              >

                                {/* Selection Indicator */}
                                {selectedSize === size.name && (
                                  <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                      <Check className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                )}

                                <div className="font-bold text-gray-900 text-lg mb-3">{size.name}</div>

                                {/* Variant Dimensions */}
                                {(size.length || size.width || size.height) && (

                                  <div className="mb-4">

                                    <div className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">Dimensions</div>

                                    <div className="flex flex-wrap gap-2">

                                      {size.length && (

                                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">

                                          <span className="text-blue-700 font-bold text-xs">L</span>

                                          <span className="text-blue-900 font-semibold text-sm">{size.length}</span>

                                        </div>

                                      )}

                                      {size.width && (

                                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2 shadow-sm">

                                          <span className="text-green-700 font-bold text-xs">W</span>

                                          <span className="text-green-900 font-semibold text-sm">{size.width}</span>

                                        </div>

                                      )}

                                      {size.height && (

                                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg px-3 py-2 shadow-sm">

                                          <span className="text-purple-700 font-bold text-xs">H</span>

                                          <span className="text-purple-900 font-semibold text-sm">{size.height}</span>

                                        </div>

                                      )}

                                    </div>

                                  </div>

                                )}

                                <div className="text-lg text-orange-600 font-bold">£{size.currentPrice.toFixed(2)}</div>

                              </div>

                            ))}

                          </div>

                        </div>

                        

                        {/* Important Notices */}
                        {product.importantNotices && product.importantNotices.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">
                              {(() => {
                                const category = product.category || 'mattresses'
                                switch (category) {
                                  case 'beds': return 'Important Bed Notes'
                                  case 'sofas': return 'Important Sofa Notes'
                                  case 'pillows': return 'Important Pillow Notes'
                                  case 'toppers': return 'Important Topper Notes'
                                  case 'bunkbeds': return 'Important Bunkbed Notes'
                                  case 'adjustable-bases': return 'Important Base Notes'
                                  case 'bed-frames': return 'Important Frame Notes'
                                  case 'box-springs': return 'Important Box Spring Notes'
                                  case 'bedding': return 'Important Bedding Notes'
                                  case 'kids': return 'Important Product Notes'
                                  case 'sale': return 'Important Product Notes'
                                  default: return 'Important Notes'
                                }
                              })()}
                            </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                              {product.importantNotices
                                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                                .map((notice, index) => (
                                  <p key={index}>• {notice.noticeText}</p>
                                ))
                              }
                          </div>
                        </div>
                        )}

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

                                <p className="text-gray-700 text-sm">
                          {product.careInstructions ? product.careInstructions : 'No care instructions available'}
                          {/* Debug: {JSON.stringify({ careInstructions: product.careInstructions, hasCare: !!product.careInstructions })} */}
                        </p>

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

                          {product.warrantyInfo && Array.isArray(product.warrantyInfo) && product.warrantyInfo.length > 0 ? (
                            <div className="space-y-3">
                              {product.warrantyInfo.map((warranty: any, index: number) => (
                                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                    <span className="font-semibold text-green-800">{warranty.heading}</span>
                              </div>
                                  <p className="text-green-700 text-sm">{warranty.content}</p>
                            </div>
                              ))}
                              </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No warranty information available</div>
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
                            <div className="text-gray-500 text-sm italic">No care instructions available</div>
                          )}

                        </div>

                        

                        {/* Trial Period */}
                        {product.trialInformation && (product as any).trialInformationHeading && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">{(product as any).trialInformationHeading}</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                {product.trialInformation}
                              </p>
                          </div>
                        </div>
                        )}

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

          <div className="rounded-xl p-4 bg-white shadow-lg relative z-0">

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

                          ) : selectedSizeData && selectedSizeData.currentPrice ? (

                            `£${selectedSizeData.currentPrice.toFixed(2)}`

                          ) : product.originalPrice && product.currentPrice && product.originalPrice > product.currentPrice ? (

                            `Save £${(product.originalPrice - product.currentPrice).toFixed(2)}`

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

                  

                  {/* Variant Dimensions */}

                  {(selectedSizeData.length || selectedSizeData.width || selectedSizeData.height) && (

                    <div className="mb-3">

                      <div className="text-sm text-gray-600 font-medium mb-2">Variant Dimensions:</div>

                      
                      {/* Simple LxWxH Display */}
                      <div className="mb-2">
                        <div className="text-lg font-bold text-gray-800">
                          {selectedSizeData.length && `${selectedSizeData.length}cm`}
                          {selectedSizeData.width && selectedSizeData.length && ' × '}
                          {selectedSizeData.width && `${selectedSizeData.width}cm`}
                          {selectedSizeData.height && (selectedSizeData.length || selectedSizeData.width) && ' × '}
                          {selectedSizeData.height && `${selectedSizeData.height}cm`}
                          </div>

                          </div>


                    </div>

                  )}

                  

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

                    <div className="text-lg font-semibold text-gray-600 mb-2">
                      {hasOnlyOneVariant ? 'Price' : 'Price'}
                    </div>

                    <div className="space-y-1">

                      {product.originalPrice > product.currentPrice && (

                        <div className="text-sm text-gray-500 line-through">Was £{product.originalPrice.toFixed(2)}</div>

                      )}

                      <div className="text-2xl font-black text-orange-600">£{product.currentPrice.toFixed(2)}</div>

                    </div>

                  </div>

                  

                  {/* Right Side: Size Selection Prompt and Base Dimensions */}
                  <div className="text-right ml-4">

                    {(() => {
                      const hasMultiple = !!((product as any).variants && (product as any).variants.length > 1)
                      if (!hasMultiple) return null
                      const { hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
                      const hasNonSize = hasColors || hasDepths || hasFirmness
                      if (!hasNonSize) return null
                      return (
                        <>
                          <div className="text-lg font-semibold text-gray-600 mb-2">View details</div>
                          <div className="text-sm text-gray-500">Choose colour and other options</div>
                        </>
                      )
                    })()}

                    
                    {/* Variant Dimensions - Show selected variant dimensions */}
                    {(() => {
                      // Get dimensions from current variant or fallback to product dimensions
                      const dimensions = currentVariant ? {
                        length: currentVariant.length,
                        width: currentVariant.width,
                        height: currentVariant.height
                      } : (product.dimensions ? {
                        length: product.dimensions.length,
                        width: product.dimensions.width,
                        height: product.dimensions.height
                      } : null)

                      if (!dimensions || (!dimensions.length && !dimensions.width && !dimensions.height)) {
                        return null
                      }

                      return (
                        <div className="mt-3">
                          <div className="text-sm text-gray-600 font-medium mb-1">
                            Dimensions {currentVariant ? `(${currentVariant.size || 'Selected'})` : ''}:
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {dimensions.length && `${dimensions.length.replace('L ', '').replace('cm', '')}cm`}
                            {dimensions.width && dimensions.length && ' × '}
                            {dimensions.width && `${dimensions.width.replace('cm', '')}cm`}
                            {dimensions.height && (dimensions.length || dimensions.width) && ' × '}
                            {dimensions.height && `${dimensions.height.replace('cm', '')}cm`}
                          </div>
                        </div>
                      )
                    })()}
                </div>

              </div>

            </div>

            )}

              

              {/* Product Features - Display features saved from Mattresses features section */}
              {productFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Product Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {productFeatures.map(({ label, Icon }, index) => (
                        <div key={index} className="flex items-center gap-2 min-w-0">
                        <div className="w-4 h-4 text-orange-500 flex-shrink-0">
                          <Icon className="h-4 w-4" />
                          </div>
                        <span className="text-sm text-gray-700 break-words">{label}</span>
                        </div>
                    ))}
                          </div>
                </div>
              )}

            </div>



            {/* Choose Size - Clickable Option - White Button - Only show for multi-variant products */}
            {!hasOnlyOneVariant && Array.isArray(sizeData) && sizeData.length > 0 && (

            <div className="border-0 rounded-lg p-4 bg-white mb-2 cursor-pointer" onClick={() => startSmartSelectionWithPriority('size')}>

              <div className="flex items-center justify-between">
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

            {/* Color & Other Options Selection - Only show when there are non-size variant features */}
            {(() => {
              const { hasColors, hasDepths, hasFirmness } = getAvailableVariantOptions()
              const hasNonSize = hasColors || hasDepths || hasFirmness
              return (!hasOnlyOneVariant && hasNonSize)
            })() && (

            <div className="border-0 rounded-lg p-4 bg-white mb-2 cursor-pointer" onClick={() => startSmartSelectionWithPriority('color')}>

              <div className="flex items-center justify-between">
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

            )}

            {/* Single Variant Info - Show for single variant products - DISABLED */}
            {false && hasOnlyOneVariant && singleVariant && (
              <div className="border-0 rounded-lg p-4 bg-blue-50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-blue-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-blue-700 font-semibold text-lg">
                    Single Variant Product
                  </span>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  {singleVariant.size && <span className="mr-4">Size: {singleVariant.size}</span>}
                  {singleVariant.color && <span>Color: {singleVariant.color}</span>}
                </div>
              </div>
            )}









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
                    <span className="font-bold text-xl tracking-wide">
                      Add to Basket
                    </span>
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

          <div className="relative max-w-7xl max-h-[90vh] w-full h-[90vh] flex items-center justify-center">

            {/* Close Button */}

            <div className="absolute top-4 right-4 z-10 flex gap-2">

            <button

              onClick={() => setImageModalOpen(false)}

                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 backdrop-blur-sm transition-all duration-200 hover:scale-110"

              aria-label="Close modal"

            >

              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />

              </svg>

            </button>

            </div>



            {/* Main Image with Magnifier */}

            <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">

              <ImageMagnifier
                src={gallery[modalImageIndex] || "/placeholder.svg"} 
                alt={product.name} 
                width={800}
                height={600}
                className="w-full h-full max-w-full max-h-full"
                magnifierSize={250}
                zoomLevel={1.8}
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

        onClose={() => {
          setSizeModalOpen(false)
          setLastSelection(null) // Reset last selection when manually closed
        }}

        onSizeSelect={(size) => {

          handleVariantSelection('size', size.name)

        }}

        sizes={sizeData}

        selectedSize={selectedSize}

      />



      {/* Color Selection Modal */}

      <ColorSelectionModal

        isOpen={colorModalOpen}

        onClose={() => {
          setColorModalOpen(false)
          setLastSelection(null) // Reset last selection when manually closed
        }}

        onColorSelect={(color, depth, firmness, mattress) => {

          handleVariantSelection('color', color.name)

          if (depth) {

            // Handle depth selection if needed

          }

          if (firmness) {

            // Handle firmness selection if needed

          }

          if (mattress) {

            // Handle mattress selection if needed

          }

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

      {/* Full Size Image Crop Modal */}

      </div>

    </>

  )

})