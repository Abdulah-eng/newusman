"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Ruler, Package, Hash } from 'lucide-react'

interface Variant {
  id: string
  sku: string
  color: string
  size: string
  original_price: number
  current_price: number
  stock_quantity: number
  in_stock: boolean
  on_sale: boolean
  variant_image?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  onVariantSelect: (variant: Variant) => void
  selectedVariant?: Variant
}

export function VariantSelector({ variants, onVariantSelect, selectedVariant }: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [availableColors, setAvailableColors] = useState<string[]>([])

  useEffect(() => {
    if (variants && variants.length > 0) {
      const colors = [...new Set(variants.map(v => v.color))]
      const sizes = [...new Set(variants.map(v => v.size))]
      
      setAvailableColors(colors)
      setAvailableSizes(sizes)
      
      // Set default selections
      if (!selectedColor && colors.length > 0) {
        setSelectedColor(colors[0])
      }
      if (!selectedSize && sizes.length > 0) {
        setSelectedSize(sizes[0])
      }
    }
  }, [variants, selectedColor, selectedSize])

  useEffect(() => {
    // Auto-select variant when color or size changes
    if (selectedColor && selectedSize) {
      const variant = variants.find(v => v.color === selectedColor && v.size === selectedSize)
      if (variant) {
        onVariantSelect(variant)
      }
    }
  }, [selectedColor, selectedSize, variants, onVariantSelect])

  const getCurrentVariant = () => {
    if (!selectedColor || !selectedSize) return null
    return variants.find(v => v.color === selectedColor && v.size === selectedSize)
  }

  const currentVariant = getCurrentVariant()

  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Palette className="h-5 w-5 text-gray-600" />
          Color: <span className="text-gray-600">{selectedColor}</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <Button
              key={color}
              variant={selectedColor === color ? "default" : "outline"}
              onClick={() => setSelectedColor(color)}
              className={`min-w-[80px] ${
                selectedColor === color 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Ruler className="h-5 w-5 text-gray-600" />
          Size: <span className="text-gray-600">{selectedSize}</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {availableSizes.map((size) => {
            const variant = variants.find(v => v.color === selectedColor && v.size === size)
            const isAvailable = variant && variant.in_stock && variant.stock_quantity > 0
            
            return (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                disabled={!isAvailable}
                className={`min-w-[80px] ${
                  selectedSize === size 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'hover:bg-gray-50'
                } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {size}
                {!isAvailable && <span className="text-xs ml-1">(OOS)</span>}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Selected Variant Details */}
      {currentVariant && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Selected Variant</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="font-medium">SKU:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {currentVariant.sku}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Stock:</span>
              <span className={currentVariant.in_stock ? 'text-green-600' : 'text-red-600'}>
                {currentVariant.in_stock ? `${currentVariant.stock_quantity} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Price Display */}
          <div className="border-t pt-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                £{currentVariant.current_price.toFixed(2)}
              </span>
              {currentVariant.original_price > currentVariant.current_price && (
                <span className="text-lg text-gray-500 line-through">
                  £{currentVariant.original_price.toFixed(2)}
                </span>
              )}
              {currentVariant.on_sale && (
                <Badge variant="destructive" className="text-xs">
                  SALE
                </Badge>
              )}
            </div>
            
            {currentVariant.original_price > currentVariant.current_price && (
              <span className="text-orange-600 font-semibold text-sm">
                Save £{(currentVariant.original_price - currentVariant.current_price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Variant Image */}
      {currentVariant?.variant_image && (
        <div className="text-center">
          <img 
            src={currentVariant.variant_image} 
            alt={`${currentVariant.color} ${currentVariant.size}`}
            className="max-w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  )
}
