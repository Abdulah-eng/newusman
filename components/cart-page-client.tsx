"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ShoppingCart, Shield, Truck, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Helper function to convert color names to actual color values
const getColorValue = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Gray': '#808080',
    'Grey': '#808080',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Pink': '#FFC0CB',
    'Brown': '#A52A2A',
    'Beige': '#F5F5DC',
    'Cream': '#FFFDD0',
    'Navy': '#000080',
    'Maroon': '#800000',
    'Teal': '#008080',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0',
    'Charcoal': '#36454F',
    'Ivory': '#FFFFF0',
    'Tan': '#D2B48C',
    'Burgundy': '#800020',
    'Forest Green': '#228B22',
    'Royal Blue': '#4169E1',
    'Crimson': '#DC143C',
    'Lime': '#00FF00',
    'Cyan': '#00FFFF',
    'Magenta': '#FF00FF',
    'Olive': '#808000',
    'Coral': '#FF7F50',
    'Turquoise': '#40E0D0',
    'Indigo': '#4B0082',
    'Violet': '#8A2BE2',
    'Salmon': '#FA8072',
    'Khaki': '#F0E68C',
    'Lavender': '#E6E6FA',
    'Mint': '#98FB98',
    'Peach': '#FFE5B4',
    'Rose': '#FFE4E1',
    'Sky Blue': '#87CEEB',
    'Slate': '#708090',
    'Steel Blue': '#4682B4',
    'Tomato': '#FF6347',
    'Wheat': '#F5DEB3',
    'Aqua': '#00FFFF',
    'Azure': '#F0FFFF',
    'Bisque': '#FFE4C4',
    'Chocolate': '#D2691E',
    'Dark Blue': '#00008B',
    'Dark Green': '#006400',
    'Dark Red': '#8B0000',
    'Light Blue': '#ADD8E6',
    'Light Green': '#90EE90',
    'Light Pink': '#FFB6C1',
    'Light Yellow': '#FFFFE0',
    'Medium Blue': '#0000CD',
    'Medium Green': '#32CD32',
    'Medium Red': '#CD5C5C',
    'Navy Blue': '#000080',
    'Orange Red': '#FF4500',
    'Pale Blue': '#87CEEB',
    'Pale Green': '#98FB98',
    'Pale Red': '#FFB6C1',
    'Pale Yellow': '#FFFFE0',
    'Powder Blue': '#B0E0E6',
    'Sea Green': '#2E8B57',
    'Spring Green': '#00FF7F',
    'Yellow Green': '#9ACD32'
  }
  
  return colorMap[colorName] || '#808080' // Default to gray if color not found
}

export default function CartPageClient() {
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
      // Find the item to get its variant properties
      const item = state.items.find(item => item.id === id)
      if (item) {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { 
            id, 
            quantity, 
            size: item.size, 
            color: item.color,
            depth: item.depth,
            firmness: item.firmness,
            variantSku: item.variantSku
          },
        })
      }
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/mattresses">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover w-24 h-24 sm:w-30 sm:h-30"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 break-words">
                          {item.name}
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 space-y-1">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span>{item.category}</span>
                            {item.size && <span>• {item.size}</span>}
                          </div>
                          
                          {/* Display all variant properties */}
                          {(item as any).color && (item as any).color !== 'Default' && (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span>Color:</span>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                                  style={{ 
                                    backgroundColor: getColorValue((item as any).color),
                                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                                  }}
                                />
                                <span className="text-xs">{(item as any).color}</span>
                              </div>
                            </div>
                          )}
                          
                          {(item as any).depth && (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span>Depth:</span>
                              <span className="text-xs">{(item as any).depth}</span>
                            </div>
                          )}
                          
                          {(item as any).firmness && (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span>Firmness:</span>
                              <span className="text-xs">{(item as any).firmness}</span>
                            </div>
                          )}
                          
                          {(item as any).variantSku && (
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span>SKU:</span>
                              <span className="text-xs font-mono">{(item as any).variantSku}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                          <span className="text-base sm:text-lg font-semibold text-gray-900">
                            £{Number((item as any).currentPrice ?? 0).toFixed(2)}
                          </span>
                          {Number((item as any).originalPrice ?? 0) > Number((item as any).currentPrice ?? 0) && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                              £{Number((item as any).originalPrice ?? 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls - Mobile Optimized */}
                      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 sm:w-8 sm:h-8 p-0 touch-manipulation"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 sm:w-16 text-center touch-manipulation"
                            min="1"
                          />
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 sm:w-8 sm:h-8 p-0 touch-manipulation"
                          >
                            +
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-base sm:text-lg font-semibold text-gray-900">
                            £{(Number((item as any).currentPrice ?? 0) * Number(item.quantity || 1)).toFixed(2)}
                          </span>
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">£{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">£{state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                    <span>Free delivery</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>1-3 business days delivery</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-green-600" />
                    <span>14-night trial period</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
