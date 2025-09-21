"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AuthPopup } from './auth-popup'
import PromotionalPopup from './promotional-popup'

export function PopupCoordinator() {
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [showPromotionalPopup, setShowPromotionalPopup] = useState(false)
  const [authPopupShown, setAuthPopupShown] = useState(false)
  const [promotionalPopupShown, setPromotionalPopupShown] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // DISABLED: Popups are currently disabled per user request
    // Only show popups on the home page
    if (pathname !== '/') {
      // Reset popup states when not on home page
      setShowAuthPopup(false)
      setShowPromotionalPopup(false)
      return
    }

    // Check if popups have been shown before in this session
    const authShown = sessionStorage.getItem('auth-popup-shown')
    const promotionalShown = sessionStorage.getItem('promotional-popup-shown')
    
    if (authShown) {
      setAuthPopupShown(true)
    }
    
    if (promotionalShown) {
      setPromotionalPopupShown(true)
    }

    // DISABLED: Popups are currently disabled per user request
    // If neither popup has been shown, show auth popup first
    // if (!authShown && !promotionalShown) {
    //   const timer = setTimeout(() => {
    //     setShowAuthPopup(true)
    //   }, 6000) // 6 seconds delay for auth popup

    //   return () => clearTimeout(timer)
    // }
  }, [pathname])

  const handleAuthPopupClose = () => {
    setShowAuthPopup(false)
    setAuthPopupShown(true)
    sessionStorage.setItem('auth-popup-shown', 'true')
    
    // If promotional popup hasn't been shown yet, show it after auth popup closes
    if (!promotionalPopupShown) {
      setTimeout(() => {
        setShowPromotionalPopup(true)
      }, 1000) // 1 second delay after auth popup closes
    }
  }

  const handlePromotionalPopupClose = () => {
    setShowPromotionalPopup(false)
    setPromotionalPopupShown(true)
    sessionStorage.setItem('promotional-popup-shown', 'true')
  }

  return (
    <>
      <AuthPopup 
        isOpen={showAuthPopup} 
        onClose={handleAuthPopupClose} 
      />
      <PromotionalPopup 
        isOpen={showPromotionalPopup}
        onClose={handlePromotionalPopupClose}
        showDelay={0} // No delay since we control when to show it
      />
    </>
  )
}
