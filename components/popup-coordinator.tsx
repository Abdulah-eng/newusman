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
  const [popupSettings, setPopupSettings] = useState<{ enabled: boolean; title?: string; subtitle?: string; description?: string; button_text?: string; show_delay_ms?: number } | null>(null)

  useEffect(() => {
    // Only show popups on the home page
    if (pathname !== '/') {
      // Reset popup states when not on home page
      setShowAuthPopup(false)
      setShowPromotionalPopup(false)
      return
    }

    // Load settings
    const load = async () => {
      try {
        const res = await fetch('/api/promotional-popup', { cache: 'no-store' })
        const json = await res.json()
        if (res.ok) setPopupSettings(json.settings)
      } catch (e) {
        console.error('PopupCoordinator: failed to load popup settings', e)
      }
    }
    load()

    // Check if popups have been shown before in this session
    const authShown = sessionStorage.getItem('auth-popup-shown')
    const promotionalShown = sessionStorage.getItem('promotional-popup-shown')
    
    if (authShown) {
      setAuthPopupShown(true)
    }
    
    if (promotionalShown) {
      setPromotionalPopupShown(true)
    }

    // If enabled and neither popup has been shown, show auth popup first (optional) or directly promotional
    if (!authShown && !promotionalShown) {
      // Directly show promotional popup if enabled
      const delay = popupSettings?.show_delay_ms ?? 3000
      const timer = setTimeout(() => {
        if (popupSettings?.enabled !== false) setShowPromotionalPopup(true)
      }, delay)
      return () => clearTimeout(timer)
    }
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
        showDelay={popupSettings?.show_delay_ms ?? 0}
        title={popupSettings?.title}
        subtitle={popupSettings?.subtitle}
        description={popupSettings?.description}
        buttonText={popupSettings?.button_text}
      />
    </>
  )
}
