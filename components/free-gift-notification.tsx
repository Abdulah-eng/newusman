"use client"

import { useState, useEffect } from 'react'
import { X, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FreeGiftNotificationProps {
  isOpen: boolean
  onClose: () => void
  giftProduct: {
    name: string
    image: string
  }
  mainProduct: {
    name: string
    image: string
  }
}

export function FreeGiftNotification({ isOpen, onClose, giftProduct, mainProduct }: FreeGiftNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the notification appears after cart operations
      const showTimer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      
      // Auto-hide after 8 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Close after fade out animation
      }, 8000)
      
      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Notification Card */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header with Sparkles */}
        <div className="relative p-6 pb-4 text-center">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 You Got a Free Gift!
            </h2>
            <p className="text-gray-600 text-sm">
              Congratulations! Your purchase includes a special free gift
            </p>
          </div>
        </div>

        {/* Main Product */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {mainProduct.image ? (
                  <img
                    src={mainProduct.image}
                    alt={mainProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Your Product:</p>
                <p className="font-medium text-gray-900 text-sm line-clamp-2">{mainProduct.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Gift Product */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border-2 border-blue-300 shadow-sm">
                {giftProduct.image ? (
                  <img
                    src={giftProduct.image}
                    alt={giftProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    🎁
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                    <Gift className="w-3 h-3 mr-1" />
                    FREE GIFT
                  </Badge>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="font-semibold text-blue-900 text-sm line-clamp-2">{giftProduct.name}</p>
                <p className="text-blue-600 text-xs font-medium">Added to your cart automatically!</p>
              </div>
            </div>
          </div>
        </div>



        {/* Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-100" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  )
}
