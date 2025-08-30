"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function LoadingIndicator() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Start loading when pathname changes
    setIsLoading(true)
    
    // Create loading animation in the browser tab
    const startLoading = () => {
      // Create a canvas element for the loading animation
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      canvas.style.display = 'none'
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Store original favicon
      const originalFavicon = document.querySelector('link[rel="icon"]')?.getAttribute('href')
      
      // Animation variables
      let angle = 0
      let progress = 0
      let animationId: number
      
      const animate = () => {
        // Clear canvas
        ctx.clearRect(0, 0, 32, 32)
        
        // Draw background circle
        ctx.fillStyle = '#f3f4f6'
        ctx.beginPath()
        ctx.arc(16, 16, 14, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw progress circle
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        
        // Draw spinning progress
        ctx.beginPath()
        ctx.arc(16, 16, 12, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress))
        ctx.stroke()
        
        // Draw spinning indicator
        ctx.strokeStyle = '#1d4ed8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(16, 16, 10, angle, angle + Math.PI * 1.5)
        ctx.stroke()
        
        // Update animation values
        angle += 0.3
        progress += 0.02
        
        // Cap progress at 0.9 to show it's still loading
        if (progress > 0.9) progress = 0.9
        
        // Create data URL and update favicon
        const dataURL = canvas.toDataURL()
        updateFavicon(dataURL)
        
        // Continue animation
        animationId = requestAnimationFrame(animate)
      }
      
      // Start animation
      animate()
      
      // Store cleanup function
      return () => {
        cancelAnimationFrame(animationId)
        // Restore original favicon
        if (originalFavicon) {
          updateFavicon(originalFavicon)
        }
      }
    }
    
    const updateFavicon = (href: string) => {
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = href
    }
    
    // Start loading animation
    const cleanup = startLoading()
    
    // Simulate page load completion
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (cleanup) cleanup()
    }, 1500)
    
    return () => {
      clearTimeout(timer)
      if (cleanup) cleanup()
    }
  }, [pathname])

  // Also show loading state in the document title
  useEffect(() => {
    if (isLoading) {
      document.title = '⏳ Loading... | Bedora Living'
    } else {
      document.title = 'Bedora Living'
    }
  }, [isLoading])

  return null // This component doesn't render anything visible
}
