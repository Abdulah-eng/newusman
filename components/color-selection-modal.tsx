"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'

interface ColorOption {
  name: string
  hex?: string
  image?: string
}

interface DepthOption {
  name: string
  description?: string
}

interface FirmnessOption {
  name: string
  description?: string
}

interface MattressOption {
  name: string
  description?: string
  price?: number
}

interface ColorSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onColorSelect: (color: ColorOption, depth?: DepthOption, firmness?: FirmnessOption, mattress?: MattressOption) => void
  colors: ColorOption[]
  selectedColor?: string
  selectedDepth?: string
  selectedFirmness?: string
  productPrice?: number
  productName?: string
  selectedSize?: string
  showOnlyColors?: boolean
  variants?: Array<{
    color?: string
    depth?: string
    firmness?: string
    size?: string
    currentPrice?: number
  }>
}

export function ColorSelectionModal({ 
  isOpen, 
  onClose, 
  onColorSelect, 
  colors, 
  selectedColor,
  selectedDepth,
  selectedFirmness,
  productPrice,
  productName,
  selectedSize,
  showOnlyColors,
  variants
}: ColorSelectionModalProps) {
  const [localSelectedColor, setLocalSelectedColor] = useState<string>('')
  const [localSelectedDepth, setLocalSelectedDepth] = useState<string>('')
  const [localSelectedFirmness, setLocalSelectedFirmness] = useState<string>('')

  // Reset local state whenever modal opens to avoid stale selections
  // and to prevent the modal from reappearing after Continue
  if (isOpen && localSelectedColor === '' && selectedColor) {
    // do not auto-seed; keep empty to require explicit user action
  }
  const [showMattresses, setShowMattresses] = useState(false)
  const [selectedMattress, setSelectedMattress] = useState<string>('')

  // Extract unique options from variants
  const colorOptions = (() => {
    if (!variants || variants.length === 0) return []
    const uniqueColors = [...new Set(variants.filter(v => v.color).map(v => v.color!))]
    return uniqueColors.map(color => ({ name: color, hex: '#f3f4f6', image: undefined }))
  })()

  const depthOptions = (() => {
    if (!variants || variants.length === 0) return []
    const uniqueDepths = [...new Set(variants.filter(v => v.depth).map(v => v.depth!))]
    return uniqueDepths.map(depth => ({
      name: depth,
      description: `Depth: ${depth}`
    }))
  })()

  const firmnessOptions = (() => {
    if (!variants || variants.length === 0) return []
    const uniqueFirmness = [...new Set(variants.filter(v => v.firmness).map(v => v.firmness!))]
    return uniqueFirmness.map(firmness => ({
      name: firmness,
      description: `Firmness: ${firmness}`
    }))
  })()

  // Determine which sections to show
  const hasColorOptions = colorOptions.length > 0
  const hasDepthOptions = depthOptions.length > 0
  const hasFirmnessOptions = firmnessOptions.length > 0
  const hasOtherOptions = hasDepthOptions || hasFirmnessOptions

  // Calculate current price based on selected options
  const currentVariantPrice = (() => {
    if (!variants || variants.length === 0) return productPrice || 0
    
    // Find variant that matches all selected options
    const matchingVariant = variants.find(variant => {
      const sizeMatch = !selectedSize || variant.size === selectedSize
      const colorMatch = !localSelectedColor || variant.color === localSelectedColor
      const depthMatch = !localSelectedDepth || variant.depth === localSelectedDepth
      const firmnessMatch = !localSelectedFirmness || variant.firmness === localSelectedFirmness
      
      return sizeMatch && colorMatch && depthMatch && firmnessMatch
    })
    
    return matchingVariant?.currentPrice || productPrice || 0
  })()

  // Get individual option prices for display
  const getOptionPrice = (optionType: 'color' | 'depth' | 'firmness', optionValue: string) => {
    if (!variants || variants.length === 0) return null
    
    // Find variant that matches current selections plus this option
    const matchingVariant = variants.find(variant => {
      const sizeMatch = !selectedSize || variant.size === selectedSize
      const colorMatch = optionType === 'color' ? variant.color === optionValue : (!localSelectedColor || variant.color === localSelectedColor)
      const depthMatch = optionType === 'depth' ? variant.depth === optionValue : (!localSelectedDepth || variant.depth === localSelectedDepth)
      const firmnessMatch = optionType === 'firmness' ? variant.firmness === optionValue : (!localSelectedFirmness || variant.firmness === localSelectedFirmness)
      
      return sizeMatch && colorMatch && depthMatch && firmnessMatch
    })
    
    return matchingVariant?.currentPrice || null
  }

  // Sample mattress options for bunkbeds (keep this for bunkbed functionality)
  const mattressOptions = [
    { name: 'Standard Mattress', description: 'Included with your bunkbed', price: 0 },
    { name: 'Memory Foam Mattress', description: 'Premium comfort upgrade', price: 89.99 },
    { name: 'Pocket Spring Mattress', description: 'Luxury support upgrade', price: 149.99 }
  ]

  const mattressPrice = showOnlyColors && selectedMattress 
    ? mattressOptions.find(m => m.name === selectedMattress)?.price || 0 
    : 0
  const totalPrice = currentVariantPrice + mattressPrice

  // Check if all required options are selected based on what's available
  const allRequiredSelected = (() => {
    const required: string[] = []
    if (hasColorOptions) required.push(localSelectedColor)
    if (hasDepthOptions) required.push(localSelectedDepth)
    if (hasFirmnessOptions) required.push(localSelectedFirmness)
    return required.every(option => !!option)
  })()
  
  const bunkbedReady = showOnlyColors ? Boolean(localSelectedColor) : allRequiredSelected

  if (!isOpen) return null

  const handleColorSelect = (color: ColorOption) => {
    setLocalSelectedColor(color.name)
  }

  const handleDepthSelect = (depth: DepthOption) => {
    setLocalSelectedDepth(depth.name)
  }

  const handleFirmnessSelect = (firmness: FirmnessOption) => {
    setLocalSelectedFirmness(firmness.name)
  }

  const handleMattressSelect = (mattress: string) => {
    setSelectedMattress(mattress)
  }

  const handleContinue = () => {
    // If this flow is color-only (e.g., bunkbeds), require a color selection
    if (showOnlyColors) {
      const selectedColorOption = colorOptions.find(c => c.name === localSelectedColor)
      if (!selectedColorOption) return
      const mattressOption = mattressOptions.find(m => m.name === selectedMattress)
      onColorSelect(selectedColorOption, undefined, undefined, mattressOption)
      onClose()
      return
    }

    // For non color-only flows, allow proceeding even when there are no color options
    const hasColors = hasColorOptions
    const selectedColorOption = hasColors
      ? colorOptions.find(c => c.name === localSelectedColor)
      // When no color options exist, pass a placeholder color so the handler signature remains satisfied
      : { name: 'Default' } as ColorOption

    if (hasColors && !selectedColorOption) return

    const depthOption = depthOptions.find(d => d.name === localSelectedDepth)
    const firmnessOption = firmnessOptions.find(f => f.name === localSelectedFirmness)
    
    // Call onColorSelect which will trigger the automatic add to cart flow
    onColorSelect(selectedColorOption!, depthOption, firmnessOption)
    onClose()
  }

  return (
    <div>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white p-6 rounded-t-2xl relative overflow-hidden flex-shrink-0">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Choose Colour & Other Options
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {!showOnlyColors && hasOtherOptions && (
                <p className="text-white/90 text-base">
                  {(() => {
                    const options = []
                    if (hasColorOptions) options.push('color')
                    if (hasDepthOptions) options.push('depth')
                    if (hasFirmnessOptions) options.push('firmness')
                    return `Select ${options.join(', ')} option${options.length > 1 ? 's' : ''} to continue`
                  })()}
                </p>
              )}
            </div>
          </div>

          {/* Fixed Price Display - Just Below Header */}
          {productPrice && (
            <div className="px-6 py-4 bg-white border-b border-gray-200 relative">
              <div className="flex items-center justify-between">
                {/* Selected Options Display - Left Side */}
                <div className="flex flex-col gap-2">
                  {selectedSize && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Size:</span>
                      <span className="font-semibold text-gray-900">{selectedSize}</span>
                    </div>
                  )}
                  {localSelectedColor && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Color:</span>
                      <span className="font-semibold text-gray-900">{localSelectedColor}</span>
                    </div>
                  )}
                  {!showOnlyColors && localSelectedDepth && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Depth:</span>
                      <span className="font-semibold text-gray-900">{localSelectedDepth}</span>
                    </div>
                  )}
                  {!showOnlyColors && localSelectedFirmness && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Firmness:</span>
                      <span className="font-semibold text-gray-900">{localSelectedFirmness}</span>
                    </div>
                  )}
                  {showOnlyColors && selectedMattress && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Mattress:</span>
                      <span className="font-semibold text-gray-900">{selectedMattress}</span>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown - Right Side */}
                <div className="text-right">
                  {showOnlyColors && selectedMattress ? (
                    <div className="text-sm text-gray-600">
                      <div>Frame: £{productPrice.toFixed(2)}</div>
                      <div>Mattress: +£{mattressPrice.toFixed(2)}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        if (currentVariantPrice !== productPrice) {
                          const priceDiff = currentVariantPrice - productPrice
                          const sign = priceDiff > 0 ? '+' : ''
                          return (
                            <div>
                              <div>Base: £{productPrice.toFixed(2)}</div>
                              <div className="text-orange-600">{sign}£{priceDiff.toFixed(2)}</div>
                            </div>
                          )
                        }
                        return 'Base Price'
                      })()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Total Price - Fixed at Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-sm text-orange-600 font-medium">Total Price</div>
                <div className="text-2xl font-bold text-orange-700">£{totalPrice.toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Section Headers */}
            <div className="px-6 pt-6">
              {showOnlyColors ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Colours</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mattresses</h3>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-4 ${(() => {
                  const optionCount = [hasColorOptions, hasDepthOptions, hasFirmnessOptions].filter(Boolean).length
                  return optionCount === 3 ? 'grid-cols-3' : optionCount === 2 ? 'grid-cols-2' : 'grid-cols-1'
                })()}`}>
                  {hasColorOptions && (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Colours</h3>
                    </div>
                  )}
                  {hasDepthOptions && (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Depth Options</h3>
                    </div>
                  )}
                  {hasFirmnessOptions && (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Firmness</h3>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content - Three Column Layout */}
            <div className="p-6">
              {showOnlyColors ? (
                /* Two Column Layout for Bunkbeds */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colours Section */}
                  <div className="space-y-4">
                    {colorOptions.map((color) => (
                      <div
                        key={color.name}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          localSelectedColor === color.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Color Swatch */}
                          <div className="flex-shrink-0">
                            {color.image ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                                <img 
                                  src={color.image} 
                                  alt={color.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-16 h-16 rounded-lg border-2 shadow-lg relative overflow-hidden"
                                style={{ 
                                  backgroundColor: color.hex || '#f3f4f6',
                                  backgroundImage: color.hex ? 'none' : 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                                  backgroundSize: '20px 20px',
                                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Color Details */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{color.name}</h3>
                            <p className="text-sm text-gray-600">Premium quality finish</p>
                            
                            {/* Price Display */}
                            {(() => {
                              const optionPrice = getOptionPrice('color', color.name)
                              if (optionPrice !== null && optionPrice !== productPrice) {
                                return (
                                  <div className="mt-2">
                                    <div className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200 inline-block">
                                      <span className="text-orange-800 font-bold text-sm">£{optionPrice.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            })()}
                          </div>
                          
                          {/* Selection Indicator */}
                          {localSelectedColor === color.name && (
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mattresses Section */}
                  <div className="space-y-4">
                    {mattressOptions.map((mattress) => (
                      <div
                        key={mattress.name}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedMattress === mattress.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleMattressSelect(mattress.name)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Mattress Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-lg">
                              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                              </svg>
                            </div>
                          </div>
                          
                          {/* Mattress Details */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{mattress.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{mattress.description}</p>
                            
                            {/* Price */}
                            {mattress.price > 0 ? (
                              <div className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200 inline-block">
                                <span className="text-orange-800 font-bold text-sm">+£{mattress.price.toFixed(2)}</span>
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-green-100 rounded-full border border-green-200 inline-block">
                                <span className="text-green-800 font-bold text-sm">✓ Included</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Selection Indicator */}
                          {selectedMattress === mattress.name && (
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Dynamic Layout for Other Products */
                <div className={`grid items-start gap-6 ${(() => {
                  const optionCount = [hasColorOptions, hasDepthOptions, hasFirmnessOptions].filter(Boolean).length
                  return optionCount === 3 ? 'grid-cols-1 md:grid-cols-3' : optionCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                })()}`}>
                  {/* Colours Section */}
                  {hasColorOptions && (
                  <div className="space-y-4">
                    {colorOptions.map((color) => (
                      <div
                        key={color.name}
                        className={`border-3 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                          localSelectedColor === color.name
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Enhanced Color Swatch */}
                          <div className="flex-shrink-0">
                            {color.image ? (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                                <img 
                                  src={color.image} 
                                  alt={color.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-16 h-16 rounded-xl border-2 shadow-lg relative overflow-hidden"
                                style={{ 
                                  backgroundColor: color.hex || '#f3f4f6',
                                  backgroundImage: color.hex ? 'none' : 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                                  backgroundSize: '20px 20px',
                                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}
                              >
                                {/* Subtle shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced Color Details */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{color.name}</h3>
                            <p className="text-sm text-gray-600">Premium quality finish</p>
                          </div>
                          
                          {/* Enhanced Selection Indicator */}
                          {localSelectedColor === color.name && (
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}

                  {/* Depth Options Section - Only show if variants have depth options */}
                  {hasDepthOptions && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Depth Options</h3>
                      {depthOptions.map((depth) => {
                        const optionPrice = getOptionPrice('depth', depth.name)
                        const isSelected = localSelectedDepth === depth.name
                        
                        return (
                          <div
                            key={depth.name}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleDepthSelect(depth)}
                          >
                            <div className="flex items-center gap-4">
                              {/* Depth Icon */}
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Depth Details */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{depth.name}</h3>
                                <p className="text-sm text-gray-600">{depth.description}</p>
                                
                                {/* Price Display */}
                                {optionPrice !== null && optionPrice !== productPrice && (
                                  <div className="mt-2">
                                    <div className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200 inline-block">
                                      <span className="text-orange-800 font-bold text-sm">£{optionPrice.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Firmness Options Section - Only show if variants have firmness options */}
                  {hasFirmnessOptions && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Firmness Options</h3>
                      {firmnessOptions.map((firmness) => {
                        const optionPrice = getOptionPrice('firmness', firmness.name)
                        const isSelected = localSelectedFirmness === firmness.name
                        
                        return (
                          <div
                            key={firmness.name}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleFirmnessSelect(firmness)}
                          >
                            <div className="flex items-center gap-4">
                              {/* Firmness Icon */}
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15h16M4 12h16M4 9h16"/>
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Firmness Details */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{firmness.name}</h3>
                                <p className="text-sm text-gray-600">{firmness.description}</p>
                                
                                {/* Price Display */}
                                {optionPrice !== null && optionPrice !== productPrice && (
                                  <div className="mt-2">
                                    <div className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200 inline-block">
                                      <span className="text-orange-800 font-bold text-sm">£{optionPrice.toFixed(2)}</span>
                                    </div>
                                    </div>
                                  )}
                                </div>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selection Status Message */}
            <div className="mt-6 text-center px-6 pb-6">
              {showOnlyColors ? null : (
                /* Status for All Options */
                <div>
                  {(() => {
                    const requiredOptions: string[] = []
                    if (hasColorOptions) requiredOptions.push('color')
                    if (hasDepthOptions) requiredOptions.push('depth')
                    if (hasFirmnessOptions) requiredOptions.push('firmness')
                    
                    const selectedOptions: string[] = []
                    if (localSelectedColor) selectedOptions.push('color')
                    if (localSelectedDepth) selectedOptions.push('depth')
                    if (localSelectedFirmness) selectedOptions.push('firmness')
                    
                    if (selectedOptions.length === 0) {
                      return <p className="text-sm text-gray-500">Please select {requiredOptions.join(', ')} option{requiredOptions.length > 1 ? 's' : ''} to continue</p>
                    }
                    
                    if (selectedOptions.length < requiredOptions.length) {
                      const remaining = requiredOptions.filter(opt => !selectedOptions.includes(opt))
                      return <p className="text-sm text-orange-600">Please select remaining {remaining.join(', ')} option{remaining.length > 1 ? 's' : ''} to continue</p>
                    }
                    
                    return <p className="text-sm text-green-600">✓ All options selected! You can now continue</p>
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Section - Always Visible */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            {/* Action Buttons */}
            <div className="flex gap-4 p-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 py-4 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                Back
              </Button>
                              <Button
                onClick={handleContinue}
                disabled={showOnlyColors ? !localSelectedColor : !allRequiredSelected}
                className="flex-1 py-4 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
