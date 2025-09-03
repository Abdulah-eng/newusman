"use client"

import { useState, useEffect } from 'react'
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  Clock, 
  Star, 
  CreditCard, 
  Lock,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  X
} from "lucide-react"

export default function CheckoutPage() {
  const { state, dispatch, updateQuantity } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'GB'
  })
  const [deliveryOption, setDeliveryOption] = useState('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentCanceled, setPaymentCanceled] = useState(false)

  // Check for payment success/canceled from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id')

    if (success === '1' && sessionId) {
      setPaymentSuccess(true)
      // Clear the cart after successful payment
      dispatch({ type: 'CLEAR_CART' })
      
      // Order processing is now handled entirely by Stripe webhook
      // No need to process orders in frontend to prevent duplicates
    } else if (canceled === '1') {
      setPaymentCanceled(true)
    }
  }, [dispatch])



  // Show success message
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-4">Thank you for your order. You will receive a confirmation email shortly.</p>
            <p className="text-sm text-gray-500 mb-8">Your cart has been cleared and your order is being processed.</p>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show canceled message
  if (paymentCanceled) {
  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Canceled</h1>
            <p className="text-lg text-gray-600 mb-8">Your payment was canceled. Your cart items are still available.</p>
            <Button 
              onClick={() => setPaymentCanceled(false)} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Try Again
            </Button>
            </div>
              </div>
                </div>
    )
  }

  if (state.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Please add items to your cart before checkout.</p>
            <Button 
              onClick={() => window.history.back()} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Shopping
              </Button>
            </div>
          </div>
        </div>
    )
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Debug logging
    console.log('Cart state:', state)
    console.log('Customer info:', customerInfo)
    console.log('Items being sent to checkout:', state.items)
    
    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          customer: customerInfo
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Checkout failed. Please try again.'
      alert(`Checkout failed: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = state.total || 0
  const deliveryCost = deliveryOption === 'express' ? 15 : 0
  const vat = subtotal * 0.2
  const total = subtotal + deliveryCost + vat

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your purchase securely</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-orange-500 mr-2" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-4 w-4 text-orange-500 mr-2" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-orange-500 mr-2" />
              <span>100-Night Trial</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-orange-500 mr-2" />
              <span>10-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Customer Information & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="bg-white border-orange-200">
                             <CardHeader>
                 <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                   <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
                   Customer Information
                 </CardTitle>
                 <p className="text-sm text-gray-600 mt-2">
                   💡 Form is pre-filled with test data. You can modify or use as-is for testing.
                 </p>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
              </div>
            </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                    </div>
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                                         <Input
                       id="postcode"
                       value={customerInfo.postcode}
                       onChange={(e) => handleInputChange('postcode', e.target.value)}
                       className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                       placeholder="e.g., W1D 1BS"
                       required
                     />
                     <p className="text-xs text-gray-500 mt-1">
                       Use valid UK format: A1A 1AA or A1 1AA
                     </p>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={customerInfo.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-orange-600" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryOption === 'standard'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Standard Delivery (3-5 business days)</div>
                      <div className="text-sm text-gray-600">Free delivery on orders over £50</div>
                  </div>
                    <div className="text-lg font-bold text-gray-900">Free</div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryOption === 'express'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  <div className="flex-1">
                      <div className="font-medium text-gray-900">Express Delivery (1-2 business days)</div>
                      <div className="text-sm text-gray-600">Priority handling and tracking</div>
                  </div>
                    <div className="text-lg font-bold text-gray-900">£15.00</div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                  Your Items ({state.itemCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                 {state.items.map((item, index) => (
                   <div key={`${item.id}-${item.size || 'standard'}-${item.color || 'default'}-${index}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">No Image</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
                      <p className="text-lg font-bold text-orange-600">£{item.currentPrice || item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-gray-300 hover:border-orange-500"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-gray-300 hover:border-orange-500"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
              </Button>
            </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white border-orange-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                      </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>{deliveryCost === 0 ? 'Free' : `£${deliveryCost.toFixed(2)}`}</span>
                      </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (20%)</span>
                    <span>£{vat.toFixed(2)}</span>
                      </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                  onClick={handleCheckout}
                  disabled={isProcessing || !customerInfo.firstName || !customerInfo.email || !customerInfo.address}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Secure Checkout
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <p>Your payment information is secure and encrypted</p>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">We accept:</p>
                  <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
                  <span>Visa</span>
                  <span>•</span>
                  <span>Mastercard</span>
                  <span>•</span>
                    <span>American Express</span>
                  <span>•</span>
                  <span>PayPal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-900">100-Night Trial</span>
            </div>
                  <div className="flex items-center justify-center">
                    <Shield className="h-8 w-8 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-900">10-Year Warranty</span>
          </div>
                  <div className="flex items-center justify-center">
                    <Truck className="h-8 w-8 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-900">Free Delivery</span>
        </div>
      </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
