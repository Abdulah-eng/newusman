"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ShoppingCart, Shield, Truck, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart - Your Items | Bedora Living',
  description: 'Review your selected items in your shopping cart. Free delivery on orders over £50 at Bedora Living.',
}

export default function CartPage() {
  const { state, dispatch } = useCart()

  const removeItem = (id: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity },
      })
    }
  }

  if (state.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/mattresses">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {state.items.map((item) => (
                <div key={`${item.id}-${item.size || 'default'}-${item.color || 'default'}`} className="flex items-center p-6 border-b last:border-b-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.brand}</p>
                    <p className="text-gray-600">Size: {item.size}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1, item.size, item.color)}
                        className="px-2"
                      >
                        -
                      </Button>
                      <span className="px-4 py-2">{item.quantity || 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1, item.size, item.color)}
                        className="px-2"
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        £{((item.currentPrice || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      {item.originalPrice && item.originalPrice > item.currentPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          £{((item.originalPrice || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem({ id: item.id, size: item.size, color: item.color })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{(state.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{(state.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Your MattressKing Guarantee Banner */}
      <div className="text-white py-12" style={{ backgroundColor: '#33373E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Your <span className="text-orange-400">MattressKing</span> Guarantee
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">5-Year Manufacturer Guarantee</h3>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Speedy Delivery</h3>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">14 Day No-Hassle Returns</h3>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rated <span className="text-orange-400">Excellent</span> on Trustpilot</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="text-white py-12" style={{ backgroundColor: '#33373E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign up to receive exclusive offers direct to your inbox!</h2>
          <p className="text-lg mb-6">Get your dose of MattressKing News, offers, inspo and more.</p>
          <div className="flex max-w-md mx-auto space-x-2">
            <Input 
              placeholder="Enter email" 
              className="flex-1 text-gray-900"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
