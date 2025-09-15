"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

interface WishlistItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  rating?: number
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    // Chrome-specific fix: Ensure we're on client side
    if (typeof window === 'undefined') return
    
    // Load wishlist from localStorage
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist')
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist))
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const removeFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const addToCartFromWishlist = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1
    })
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.setItem('wishlist', JSON.stringify([]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-black font-display">My Wishlist</h1>
          </div>
          <p className="text-lg text-gray-700 font-modern">
            Save your favorite items and add them to cart when you're ready to buy
          </p>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2 font-display">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6 font-modern">
                Start adding items you love to your wishlist
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-black font-display">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.jpg"
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-600"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-black mb-2 text-lg font-display line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm text-gray-600 font-modern">{item.rating}</span>
                            </div>
                          )}
                          <span className="text-sm text-gray-500 font-modern capitalize">{item.category}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-black font-display">
                          £{item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through font-modern">
                            £{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                          onClick={() => addToCartFromWishlist(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 text-center">
              <Link href="/">
                <Button variant="outline" size="lg" className="mr-4">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/cart">
                <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600" size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
