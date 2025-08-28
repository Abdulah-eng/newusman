"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Package } from "lucide-react"

interface FrequentlyBoughtItem {
  id: string
  name: string
  description: string
  currentPrice: number
  originalPrice: number
  isSelected: boolean
  image: string
}

interface FrequentlyBoughtTogetherProps {
  items?: FrequentlyBoughtItem[]
  onAddToCart?: (items: FrequentlyBoughtItem[]) => void
}

export function FrequentlyBoughtTogether({ 
  items = [
    {
      id: 'protector',
      name: 'Premium Mattress Protector',
      description: 'Waterproof & breathable protection',
      currentPrice: 29.99,
      originalPrice: 99.99,
      isSelected: true,
      image: '/placeholder.svg'
    }
  ],
  onAddToCart
}: FrequentlyBoughtTogetherProps) {
  const [selectedItems, setSelectedItems] = useState<FrequentlyBoughtItem[]>(
    items.filter(item => item.isSelected)
  )

  const handleItemToggle = (item: FrequentlyBoughtItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id)
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  const totalSavings = selectedItems.reduce((total, item) => {
    return total + (item.originalPrice - item.currentPrice)
  }, 0)

  const totalPrice = selectedItems.reduce((total, item) => {
    return total + item.currentPrice
  }, 0)

  const handleAddToCart = () => {
    onAddToCart?.(selectedItems)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900">Frequently Bought Together</h3>
      
      {/* Product Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = selectedItems.some(selected => selected.id === item.id)
          return (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {/* Product Icon */}
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-orange-600 font-semibold">£{item.currentPrice.toFixed(2)}</span>
                  <span className="text-gray-400 line-through text-sm">£{item.originalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Selection Checkbox */}
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'bg-orange-600 border-orange-600' 
                    : 'bg-white border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-500">Added</span>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Bundle Savings */}
      {selectedItems.length > 1 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-600">Bundle Savings</span>
            </div>
            <span className="text-lg font-bold text-orange-600">Save £{totalSavings.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Buy together and save 25% off the total
          </p>
        </div>
      )}
      
      {/* Add to Cart Button */}
      <Button 
        onClick={handleAddToCart}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
        </svg>
        Add {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''} to Cart - £{totalPrice.toFixed(2)}
      </Button>
    </div>
  )
}
