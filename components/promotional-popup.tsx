"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromotionalPopupProps {
  title?: string
  subtitle?: string
  description?: string
  buttonText?: string
  onClose?: () => void
  showDelay?: number
  isOpen?: boolean
}

export default function PromotionalPopup({
  title = "FIRST TIMER?",
  subtitle = "20% OFF",
  description = "& FREE SHIPPING ON YOUR FIRST ORDER.",
  buttonText = "GET THE OFFER",
  onClose,
  showDelay = 3000,
  isOpen = false
}: PromotionalPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // If isOpen is true, show immediately or after delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, showDelay)

      return () => clearTimeout(timer)
    } else {
      // If isOpen is false, hide immediately
      setIsVisible(false)
    }
  }, [isOpen, showDelay])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300) // Match animation duration
  }

  const handleGetOffer = () => {
    // You can add your offer logic here
    console.log('Get offer clicked')
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div 
        className={`
          bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 ease-out
          ${isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
        `}
        style={{
          animation: isVisible && !isClosing ? 'slideInFromRight 0.5s ease-out' : undefined
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white hover:text-orange-200 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="pr-6">
          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 leading-tight">
            {title}
          </h3>

          {/* Subtitle */}
          <div className="text-3xl font-black mb-2 text-orange-100">
            {subtitle}
          </div>

          {/* Description */}
          <p className="text-sm text-orange-100 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Email Input and Button */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
            <Button
              onClick={handleGetOffer}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              {buttonText}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-orange-200 mt-3 leading-relaxed">
            *For new customers only. Offer valid for the next 48 hours. Cannot be combined with any other offers or promotions.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%) translateY(0);
            opacity: 0;
          }
          100% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
