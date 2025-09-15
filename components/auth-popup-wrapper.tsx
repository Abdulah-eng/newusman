"use client"

import { useState, useEffect } from 'react'
import { AuthPopup } from './auth-popup'

export function AuthPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)

  useEffect(() => {
    // Chrome-specific fix: Ensure we're on client side
    if (typeof window === 'undefined') return
    
    // Check if popup has been shown before in this session
    const popupShown = sessionStorage.getItem('auth-popup-shown')
    
    if (!popupShown) {
      // Show popup after 6 seconds
      const timer = setTimeout(() => {
        setShowPopup(true)
        setHasShownPopup(true)
        sessionStorage.setItem('auth-popup-shown', 'true')
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <AuthPopup 
      isOpen={showPopup} 
      onClose={handleClose} 
    />
  )
}
