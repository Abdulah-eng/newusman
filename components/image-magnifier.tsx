"use client"

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface ImageMagnifierProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  magnifierSize?: number
  zoomLevel?: number
  onImageClick?: () => void
}

export function ImageMagnifier({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = "",
  magnifierSize = 200,
  zoomLevel = 1.5,
  onImageClick
}: ImageMagnifierProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomCenter, setZoomCenter] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowMagnifier(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isZoomed) {
      // Zoom in at current mouse position
      setZoomCenter({ x: mousePosition.x, y: mousePosition.y })
      setIsZoomed(true)
    } else {
      // Zoom out
      setIsZoomed(false)
    }
  }, [isZoomed, mousePosition])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onImageClick) {
      onImageClick()
    }
  }, [onImageClick])

  // Calculate the background position for the magnifier
  const magnifierBackgroundPosition = `${(mousePosition.x * zoomLevel - magnifierSize / 2)}px ${(mousePosition.y * zoomLevel - magnifierSize / 2)}px`
  
  // Calculate background size dynamically
  const backgroundSize = `${width * zoomLevel}px ${height * zoomLevel}px`

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        ref={imageRef}
        className={`relative overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${className}`}
        style={{
          transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
          transformOrigin: `${zoomCenter.x}px ${zoomCenter.y}px`,
          transition: 'transform 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          minHeight: '400px'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Image failed to load:', src)
            setImageError(true)
            e.currentTarget.src = '/placeholder.svg'
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', src)
            setImageLoaded(true)
            setImageError(false)
          }}
        />
        
        {/* Loading indicator */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}
        
        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-red-500">Failed to load image</div>
          </div>
        )}
        
        {/* Zoom indicator */}
        {isZoomed && imageLoaded && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            {zoomLevel}x Zoom
          </div>
        )}
      </div>

      {/* Magnifier (only show when hovering and not zoomed) */}
      {showMagnifier && !isZoomed && (
        <div
          className="fixed pointer-events-none z-50 border-2 border-white shadow-2xl rounded-full overflow-hidden"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${Math.min(mousePosition.x + 20, window.innerWidth - magnifierSize - 20)}px`,
            top: `${Math.max(mousePosition.y - magnifierSize - 20, 20)}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: backgroundSize,
            backgroundPosition: magnifierBackgroundPosition,
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* Click instruction */}
      {!isZoomed && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
          Click to zoom {zoomLevel}x • Double-click for full screen
        </div>
      )}
    </div>
  )
}
