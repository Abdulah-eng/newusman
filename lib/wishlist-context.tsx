"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WishlistItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  rating?: number
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (itemId: string) => void
  isInWishlist: (itemId: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error)
    }
  }, [wishlistItems])

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      // Check if item already exists
      const exists = prev.some(wishlistItem => wishlistItem.id === item.id)
      if (exists) {
        return prev // Don't add if already exists
      }
      return [...prev, item]
    })
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const wishlistCount = wishlistItems.length

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
