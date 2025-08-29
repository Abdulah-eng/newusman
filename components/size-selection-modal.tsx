"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'

interface SizeOption {
  name: string
  dimensions: string
  availability: string
  inStock: boolean
  wasPrice: number
  currentPrice: number
  // Variant-specific dimensions
  length?: string
  width?: string
  height?: string
}

interface SizeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSizeSelect: (size: SizeOption) => void
  sizes: SizeOption[]
  selectedSize?: string
}

export function SizeSelectionModal({ 
  isOpen, 
  onClose, 
  onSizeSelect, 
  sizes, 
  selectedSize 
}: SizeSelectionModalProps) {
  const [localSelectedSize, setLocalSelectedSize] = useState<string>(selectedSize || '')

  if (!isOpen) return null

  const handleSizeSelect = (size: SizeOption) => {
    setLocalSelectedSize(size.name)
    onSizeSelect(size)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#33373E] to-[#4A5568] text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Choose Your Size</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-white/80 text-sm">
              Select the perfect size for your needs
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-3">
              {sizes.map((size) => (
                <div
                  key={size.name}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    localSelectedSize === size.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setLocalSelectedSize(size.name)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{size.name}</h3>
                      <p className="text-sm text-gray-600">{size.dimensions}</p>
                      
                                             {/* Variant Dimensions */}
                       {(size.length || size.width || size.height) && (
                         <div className="mt-2">
                           <span className="text-sm text-gray-600">
                             {size.height && `${size.height}`}
                             {size.width && size.height && ' × '}
                             {size.width && `${size.width}`}
                             {size.length && (size.width || size.height) && ' × '}
                             {size.length && `${size.length}`}
                           </span>
                         </div>
                       )}
                    </div>
                    
                    {/* Selection Indicator */}
                    {localSelectedSize === size.name && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${size.inStock ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className={`text-sm font-medium ${size.inStock ? 'text-green-600' : 'text-orange-600'}`}>
                      {size.availability}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-3">
                    {size.wasPrice > size.currentPrice ? (
                      <>
                        <span className="text-lg font-bold text-orange-600">£{size.currentPrice.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">£{size.wasPrice.toFixed(2)}</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                          Save £{(size.wasPrice - size.currentPrice).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">£{size.currentPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const selectedSizeOption = sizes.find(s => s.name === localSelectedSize)
                  if (selectedSizeOption) {
                    handleSizeSelect(selectedSizeOption)
                  }
                }}
                disabled={!localSelectedSize}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
