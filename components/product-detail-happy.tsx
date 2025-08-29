"use client"



import { useState, useEffect, useRef, useMemo, useCallback } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Check, Star, Heart, MessageCircle, Shield, ChevronDown, ChevronUp, ShoppingCart, Truck, Clock, Leaf, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Layers, Waves, Moon, Crown, RefreshCw, Minimize, Wrench, Palette, DollarSign, Baby, Award, ShieldCheck, Package, Ruler, Users, Zap, Home, Trees, Square, Maximize, ArrowUp, Radio, VolumeX, Bed, Settings, Circle } from "lucide-react"

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

      // New editable heading fields
      mattress_size_heading?: string
      maximum_height_heading?: string
      weight_capacity_heading?: string
      pocket_springs_heading?: string
      comfort_layer_heading?: string
      support_layer_heading?: string
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

    // Dimension images

    dimensionImages?: Array<{

      id: string

      imageUrl: string

      fileName: string

      fileSize: number

      fileType: string

      sortOrder: number

    }>

  }

}



export function ProductDetailHappy({ product }: ProductDetailHappyProps) {




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

  const { dispatch, validateItem } = useCart()

  const [selectedImage, setSelectedImage] = useState(product.images && product.images.length ? product.images[0] : product.image)

  const [modalImageIndex, setModalImageIndex] = useState(0)

  const [selectedColor, setSelectedColor] = useState("")

  const [quantity, setQuantity] = useState(1)

  const [imageModalOpen, setImageModalOpen] = useState(false)



  const [basketSidebarOpen, setBasketSidebarOpen] = useState(false)

  const [sizeModalOpen, setSizeModalOpen] = useState(false)

  const [colorModalOpen, setColorModalOpen] = useState(false)
  const [lastSelection, setLastSelection] = useState<string | null>(null)

  // Smart variant selection state
  const [isAutoSelectionMode, setIsAutoSelectionMode] = useState(false)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ description: true })



  const handleVariantSelection = (type: string, value: string) => {
    // Track the last selection to prevent immediate reopening
    setLastSelection(type)
    
    if (type === 'size') {
      setSelectedSize(value)
      setSizeModalOpen(false)
      
      // Check if all required selections are complete
      setTimeout(() => {
        const { hasSizes, hasColors } = getAvailableVariantOptions()
        
        // If we have both size and color options, check if both are selected
        if (hasSizes && hasColors) {
          if (value && selectedColor) {
            // Both size and color are selected, add to cart directly
            setTimeout(() => {
              // Directly add to cart without validation to avoid reopening modals
              dispatch({
                type: 'ADD_ITEM',
                payload: {
                  id: String(product.id),
                  name: product.name,
                  brand: product.brand,
                  image: selectedImage || product.image,
                  currentPrice: product.currentPrice,
                  originalPrice: product.originalPrice,
                  size: value,
                  color: selectedColor
                }
              })
              setBasketSidebarOpen(true)
              setIsAutoSelectionMode(false)
            }, 100)
          } else if (!selectedColor) {
            // Color is missing, open color modal
            setColorModalOpen(true)
          }
        } else if (hasColors && !selectedColor) {
          // Only color is required and not selected
          setColorModalOpen(true)
        } else {
          // No more selections needed, add to cart directly
          setTimeout(() => {
            // Directly add to cart without validation to avoid reopening modals
            dispatch({
              type: 'ADD_ITEM',
              payload: {
                id: String(product.id),
                name: product.name,
                brand: product.brand,
                image: selectedImage || product.image,
                currentPrice: product.currentPrice,
                originalPrice: product.originalPrice,
                size: value,
                color: selectedColor
              }
            })
            setBasketSidebarOpen(true)
            setIsAutoSelectionMode(false)
          }, 100)
        }
      }, 150) // Increased delay to ensure size modal is fully closed and lastSelection is set
      
    } else if (type === 'color') {
      setSelectedColor(value)
      setColorModalOpen(false)
      
      // Check if all required selections are complete
      setTimeout(() => {
        const { hasSizes, hasColors } = getAvailableVariantOptions()
        
        // If we have both size and color options, check if both are selected
        if (hasSizes && hasColors) {
          if (selectedSize && value) {
            // Both size and color are selected, add to cart directly
            setTimeout(() => {
              // Directly add to cart without validation to avoid reopening modals
              dispatch({
                type: 'ADD_ITEM',
                payload: {
                  id: String(product.id),
                  name: product.name,
                  brand: product.brand,
                  image: selectedImage || product.image,
                  currentPrice: product.currentPrice,
                  originalPrice: product.originalPrice,
                  size: selectedSize || 'Standard',
                  color: value
                }
              })
              setBasketSidebarOpen(true)
              setIsAutoSelectionMode(false)
            }, 100)
          } else if (!selectedSize) {
            // Size is missing, open size modal
            setSizeModalOpen(true)
          }
        } else if (hasSizes && !selectedSize) {
          // Only size is required and not selected
          setSizeModalOpen(true)
        } else {
          // No more selections needed, add to cart directly
          setTimeout(() => {
            // Directly add to cart without validation to avoid reopening modals
            dispatch({
              type: 'ADD_ITEM',
              payload: {
                id: String(product.id),
                name: product.name,
                brand: product.brand,
                image: selectedImage || product.image,
                currentPrice: product.currentPrice,
                originalPrice: product.originalPrice,
                size: selectedSize || 'Standard',
                color: value
              }
            })
            setBasketSidebarOpen(true)
            setIsAutoSelectionMode(false)
          }, 100)
        }
      }, 200) // Increased delay to ensure color modal is fully closed and selectedColor state is updated
    }
  }





  // Build a list of "Features you'll love" for reuse in the Product Features section

  const buildProductFeatures = () => {
    // Map DB feature labels to meaningful icons (EXACTLY same as product card)
    const getFeatureIcon = (label: string) => {
      const text = (label || '').toLowerCase()
      
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
      if (text.includes('firm')) return () => <SlidersHorizontal className="h-4 w-4" />
      if (text.includes('anti') || text.includes('bacterial') || text.includes('microbial')) return () => <ShieldCheck className="h-4 w-4" />
      if (text.includes('eco') || text.includes('organic') || text.includes('sustain')) return () => <Leaf className="h-4 w-4" />
      if (text.includes('waterproof') || text.includes('cover')) return () => <Umbrella className="h-4 w-4" />
      if (text.includes('warranty')) return () => <Shield className="h-4 w-4" />
      if (text.includes('adjustable-base') || (text.includes('adjustable') && text.includes('base'))) return () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path d="M3 14h18"/>
          <path d="M5 10h8l2 2"/>
          <rect x="3" y="14" width="18" height="4" rx="1"/>
        </svg>
      )
      if (text.includes('support') || text.includes('orth')) return () => <Heart className="h-4 w-4" />
      if (text.includes('hypo') || text.includes('allergen')) return () => <Feather className="h-4 w-4" />
      if (text.includes('delivery') || text.includes('shipping')) return () => <Truck className="h-4 w-4" />
      if (text.includes('washable') || text.includes('removable')) return () => <PackageOpen className="h-4 w-4" />
      if (text.includes('value') || text.includes('price') || text.includes('save')) return () => <DollarSign className="h-4 w-4" />
      if (text.includes('durable') || text.includes('long')) return () => <Zap className="h-4 w-4" />
      if (text.includes('luxury') || text.includes('premium')) return () => <Gem className="h-4 w-4" />
      // Extra mappings aligned with the "Features you'll love" section
      if (text.includes('easy') && text.includes('assembly')) return () => <Wrench className="h-4 w-4" />
      if (text.includes('upholster') || text.includes('headboard')) return () => <Package className="h-4 w-4" />
      if (text.includes('wood')) return () => <Trees className="h-4 w-4" />
      if (text.includes('metal') || text.includes('frame')) return () => <Shield className="h-4 w-4" />
      if (text.includes('construction') || text.includes('built')) return () => <Wrench className="h-4 w-4" />
      if (text.includes('design') || text.includes('style')) return () => <Palette className="h-4 w-4" />
      // Fallback icon
      return () => <Star className="h-4 w-4" />
    }



    // PRIORITY 1: Use database-provided features (same as product cards)

    if (product.features && product.features.length > 0) {

      return product.features.slice(0, 6).map(label => ({ 

        label, 

        Icon: getFeatureIcon(label) 

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
        { label: 'Space Saving', Icon: Minimize },
        { label: 'Safety Rails', Icon: Shield },
        { label: 'Easy Assembly', Icon: Wrench },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Kids Safe', Icon: Baby }
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



      // Start smart selection flow instead of showing individual modals
      // Try to determine which selection to start with based on what's missing
      // Also check if we just closed a modal to prevent reopening
      if (hasSizes && !selectedSize && lastSelection !== 'size') {
        startSmartSelectionWithPriority('size')
      } else if (hasColors && !selectedColor && lastSelection !== 'color') {
        startSmartSelectionWithPriority('color')
      } else {
        startSmartSelection()
      }

      return

    }





    // Add to cart logic here

    

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
    const hasSizes = variants.some((v: any) => v.size)
    const hasColors = variants.some((v: any) => v.color)
    const hasDepths = variants.some((v: any) => v.depth)
    const hasFirmness = variants.some((v: any) => v.firmness)
    
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
    } else {
      // No selections needed, add to cart directly
      addToCart()
    }
  }, [getNextRequiredSelection, openNextRequiredModal])

  // Enhanced smart selection that can start with either size or color
  const startSmartSelectionWithPriority = useCallback((priorityType?: 'size' | 'color') => {
    setIsAutoSelectionMode(true)
    
    if (priorityType === 'size' && !selectedSize && lastSelection !== 'size') {
      // Start with size selection
      const { hasSizes } = getAvailableVariantOptions()
      if (hasSizes) {
        setSizeModalOpen(true)
        return
      }
    } else if (priorityType === 'color' && !selectedColor && lastSelection !== 'color') {
      // Start with color selection
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

                    <div className="text-lg font-semibold text-gray-600 mb-2">Select a size to see pricing</div>

                    <div className="text-sm text-gray-500">Choose from available sizes below</div>

                    
                    {/* Base Product Dimensions - Simple LxWxH */}
                    {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 font-medium mb-1">Base Dimensions:</div>
                        <div className="text-lg font-bold text-gray-800">
                          {product.dimensions.length && `${product.dimensions.length.replace('L ', '').replace('cm', '')}cm`}
                          {product.dimensions.width && product.dimensions.length && ' × '}
                          {product.dimensions.width && `${product.dimensions.width.replace('cm', '')}cm`}
                          {product.dimensions.height && (product.dimensions.length || product.dimensions.width) && ' × '}
                          {product.dimensions.height && `${product.dimensions.height.replace('cm', '')}cm`}
                        </div>
                      </div>
                    )}
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
                          {typeof Icon === 'function' ? Icon({}) : <Check className="h-4 w-4" />}
                          </div>
                        <span className="text-sm text-gray-700 break-words">{label}</span>
                        </div>
                    ))}
                          </div>
                </div>
              )}

            </div>



            {/* Choose Size - Clickable Option - White Button */}

            {Array.isArray(sizeData) && sizeData.length > 0 && (

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

                    // Function to get icon based on selected icon type or fallback to smart detection

                    const getIconComponent = (iconType?: string) => {

                      // If we have a specific icon type from admin, use it

                      if ((product as any).reasonsToLoveIcons?.[idx]) {

                        const iconTypeLower = (product as any).reasonsToLoveIcons[idx].toLowerCase()

                    

                        switch (iconTypeLower) {

                          case 'support': return () => <Heart className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'comfort': return () => <Bed className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'firmness': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'quality': return () => <Award className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'durability': return () => <Zap className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'wood': return () => <Trees className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'metal': return () => <Shield className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'upholstery': return () => <Package className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'construction': return () => <Wrench className="h-8 w-8 sm:h-10 sm:w-10" />

                          case 'design': return () => <Palette className="h-8 w-8 sm:h-10 sm:w-10" />

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
                          {typeof IconComp === 'function' ? <IconComp /> : null}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">{label}</h3>
                        {(product as any).reasonsToLoveDescriptions?.[idx] && (
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{(product as any).reasonsToLoveDescriptions[idx]}</p>
                        )}
                      </div>

                    )

                  })}

                </div>

              ) : (

                /* Show placeholder when no database features exist */

                <div className="text-center py-8">

                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">

                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>

                    </svg>

                  </div>

                  <p className="text-gray-500 text-sm">Features will be displayed here when available from database</p>

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

                        

                        {/* Dimension Images Section - Full width, large images */}
                        {(() => {
                          
                          return product.dimensionImages && product.dimensionImages.length > 0 ? (
                          <div className="mb-8">

                              <h4 className="text-xl font-semibold text-gray-900 mb-6">Product Dimension Images</h4>
                            <div className="space-y-6">

                              {product.dimensionImages

                                .sort((a, b) => a.sortOrder - b.sortOrder)

                                .map((img, index) => (

                                  <div key={img.id || index} className="relative group">

                                    <div className="w-full h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-lg">

                                      <img

                                        src={img.imageUrl}

                                        alt={`Product dimension ${index + 1}`}

                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"

                                        onError={(e) => {

                                          const target = e.target as HTMLImageElement;

                                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23f3f4f6'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3EDimension Image%3C/text%3E%3C/svg%3E";

                                        }}

                                      />

                                    </div>

                                  </div>

                                ))}

                            </div>

                          </div>

                        ) : (

                          <div className="mb-8">

                              <h4 className="text-xl font-semibold text-gray-900 mb-4">Product Dimension Images</h4>
                            <div className="text-center py-8 text-gray-500">

                              <p>No dimension images available</p>

                              <p className="text-sm">Dimension images will appear here when added from the admin panel</p>

                            </div>

                          </div>

                          )
                        })()}
                        




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

                                  <span className="font-medium text-gray-700">{product.dimensions?.mattress_size_heading || 'Mattress Size'}</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.mattress_size || '135cm x L 190cm cm'}</span>

                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                  <span className="font-medium text-gray-700">{product.dimensions?.maximum_height_heading || 'Maximum Height'}</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.max_height || '25 cm'}</span>

                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-200">

                                  <span className="font-medium text-gray-700">{product.dimensions?.weight_capacity_heading || 'Weight Capacity'}</span>
                                  <span className="text-gray-900 font-semibold">{product.dimensions?.weight_capacity || '200 kg'}</span>

                                </div>

                              </div>

                            </div>

                            

                            <div>

                              <h4 className="text-xl font-semibold text-gray-900 mb-4">Construction Details</h4>

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

                                

                                {/* Variant Dimensions */}

                                {(size.length || size.width || size.height) && (

                                  <div className="mb-3">

                                    <div className="text-xs text-gray-500 font-medium mb-2">Dimensions:</div>

                                    <div className="flex items-center gap-1">

                                      {size.length && (

                                        <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded px-2 py-1">

                                          <span className="text-blue-700 font-semibold text-xs">L</span>

                                          <span className="text-blue-900 font-bold text-xs">{size.length}</span>

                                        </div>

                                      )}

                                      {size.width && (

                                        <div className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded px-2 py-1">

                                          <span className="text-green-700 font-semibold text-xs">W</span>

                                          <span className="text-green-900 font-bold text-xs">{size.width}</span>

                                        </div>

                                      )}

                                      {size.height && (

                                        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded px-2 py-1">

                                          <span className="text-purple-700 font-semibold text-xs">H</span>

                                          <span className="text-purple-900 font-bold text-xs">{size.height}</span>

                                        </div>

                                      )}

                                    </div>

                                  </div>

                                )}

                                

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

                    <div className="text-lg font-semibold text-gray-600 mb-2">Base Product Price</div>

                    <div className="space-y-1">

                      {product.originalPrice > product.currentPrice && (

                        <div className="text-sm text-gray-500 line-through">Was £{product.originalPrice.toFixed(2)}</div>

                      )}

                      <div className="text-2xl font-black text-orange-600">£{product.currentPrice.toFixed(2)}</div>

                    </div>

                  </div>

                  

                  {/* Right Side: Size Selection Prompt and Base Dimensions */}
                  <div className="text-right ml-4">

                    <div className="text-lg font-semibold text-gray-600 mb-2">Select a size to see pricing</div>

                    <div className="text-sm text-gray-500">Choose from available sizes below</div>

                    
                    {/* Base Product Dimensions - Simple LxWxH */}
                    {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 font-medium mb-1">Base Dimensions:</div>
                        <div className="text-lg font-bold text-gray-800">
                          {product.dimensions.length && `${product.dimensions.length.replace('L ', '').replace('cm', '')}cm`}
                          {product.dimensions.width && product.dimensions.length && ' × '}
                          {product.dimensions.width && `${product.dimensions.width.replace('cm', '')}cm`}
                          {product.dimensions.height && (product.dimensions.length || product.dimensions.width) && ' × '}
                          {product.dimensions.height && `${product.dimensions.height.replace('cm', '')}cm`}
                        </div>
                      </div>
                    )}
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
                          {typeof Icon === 'function' ? Icon({}) : <Check className="h-4 w-4" />}
                          </div>
                        <span className="text-sm text-gray-700 break-words">{label}</span>
                        </div>
                    ))}
                          </div>
                </div>
              )}

            </div>



            {/* Choose Size - Clickable Option - White Button */}

            {Array.isArray(sizeData) && sizeData.length > 0 && (

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



            {/* Color & Other Options Selection - Clickable Option - White Button */}

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



      </div>

    </>

  )

}



export default ProductDetailHappy