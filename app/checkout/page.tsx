"use client"

import { useState, useEffect } from 'react'
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
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
  X,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useRouter } from 'next/navigation'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
}

interface AddressSuggestion {
  address: string
  city: string
  postcode: string
  country: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  
  // State management
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'canceled' | 'error'>('idle')
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('')
  const [lastPurchasedProductName, setLastPurchasedProductName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Address auto-search state
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  
  // Mobile validation popup state
  const [showValidationPopup, setShowValidationPopup] = useState(false)
  const [validationPopupMessage, setValidationPopupMessage] = useState('')

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.address-suggestions-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check for payment result from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id')

    if (success === '1' && sessionId) {
      setPaymentStatus('success')
      // Clear cart on successful payment
      dispatch({ type: 'CLEAR_CART' })
      // Process the order
      processOrder(sessionId)
      // Clean URL
      window.history.replaceState({}, '', '/checkout')
    } else if (canceled === '1') {
      setPaymentStatus('canceled')
      // Clean URL
      window.history.replaceState({}, '', '/checkout')
    }
  }, [dispatch])

  // Process order after successful payment
  const processOrder = async (sessionId: string) => {
    try {
      const response = await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customerInfo,
          items: state.items,
          deliveryOption
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Order processed successfully:', result)
        if (result?.orderNumber) {
          setLastOrderNumber(result.orderNumber)
        }
        // Capture a display name of purchased product for review context
        const firstItem = (state.items && state.items.length > 0) ? state.items[0] : null
        setLastPurchasedProductName(firstItem?.name || '')
      } else {
        const errorData = await response.json()
        console.error('Failed to process order:', errorData.error)
      }
    } catch (error) {
      console.error('Error processing order:', error)
    }
  }


  // Handle input changes
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Address auto-search functionality
  const searchAddress = async (postcode: string) => {
    if (!postcode || postcode.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearchingAddress(true)
    try {
      // Using UK Postcode API (free tier)
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`)
      if (response.ok) {
        const data = await response.json()
        if (data.result && data.result.length > 0) {
          // Get full address details for each suggestion
          const suggestions = await Promise.all(
            data.result.slice(0, 5).map(async (pc: string) => {
              try {
                const detailResponse = await fetch(`https://api.postcodes.io/postcodes/${pc}`)
                if (detailResponse.ok) {
                  const detailData = await detailResponse.json()
                  return {
                    address: `${detailData.result.primary_street || ''} ${detailData.result.secondary_street || ''}`.trim(),
                    city: detailData.result.post_town || '',
                    postcode: pc,
                    country: 'GB'
                  }
                }
              } catch (e) {
                console.error('Error fetching address details:', e)
              }
              return null
            })
          )
          
          const validSuggestions = suggestions.filter(s => s !== null) as AddressSuggestion[]
          setAddressSuggestions(validSuggestions)
          setShowSuggestions(validSuggestions.length > 0)
        } else {
          setAddressSuggestions([])
          setShowSuggestions(false)
        }
      }
    } catch (error) {
      console.error('Address search error:', error)
      setAddressSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsSearchingAddress(false)
    }
  }

  const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
    setCustomerInfo(prev => ({
      ...prev,
      address: suggestion.address,
      city: suggestion.city,
      postcode: suggestion.postcode,
      country: suggestion.country
    }))
    setShowSuggestions(false)
    setAddressSuggestions([])
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    if (!customerInfo.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!customerInfo.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!customerInfo.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required'
    }
    
    if (!customerInfo.address.trim()) {
      errors.address = 'Address is required'
    }
    
    if (!customerInfo.city.trim()) {
      errors.city = 'City is required'
    }
    
    if (!customerInfo.postcode.trim()) {
      errors.postcode = 'Postcode is required'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle quantity changes
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      // Find the item to get its variant properties
      const item = state.items.find(item => item.id === itemId)
      if (item) {
        dispatch({ 
          type: 'UPDATE_QUANTITY', 
          payload: { 
            id: itemId, 
            quantity: newQuantity,
            size: item.size, 
            color: item.color,
            depth: item.depth,
            firmness: item.firmness,
            variantSku: item.variantSku
          } 
        })
      }
    }
  }

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  // Handle checkout
  const handleCheckout = async () => {
    // Validate form
    if (!validateForm()) {
      // Check if we're on mobile screen
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        // Show mobile popup
        const missingFields = Object.keys(validationErrors)
        if (missingFields.length > 0) {
          const fieldNames = missingFields.map(field => {
            switch(field) {
              case 'firstName': return 'First Name'
              case 'lastName': return 'Last Name'
              case 'email': return 'Email Address'
              case 'phone': return 'Phone Number'
              case 'address': return 'Address'
              case 'city': return 'City'
              case 'postcode': return 'Postcode'
              default: return field
            }
          })
          setValidationPopupMessage(`Please fill in: ${fieldNames.join(', ')}`)
          setShowValidationPopup(true)
        } else {
          setValidationPopupMessage('Please fill in all required fields correctly.')
          setShowValidationPopup(true)
        }
      } else {
        setErrorMessage('Please fill in all required fields correctly.')
      }
      return
    }

    // Validate cart
    if (!state.items || state.items.length === 0) {
      setErrorMessage('Your cart is empty')
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          customer: customerInfo,
          deliveryOption
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
      setErrorMessage(error instanceof Error ? error.message : 'Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate totals
  const subtotal = state.total || 0
  const deliveryCost = deliveryOption === 'express' ? 15 : 0
  const total = subtotal + deliveryCost

  // Success screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-4">Thank you for your order. You will receive a confirmation email shortly.</p>
            <p className="text-sm text-gray-500 mb-8">Your order is being processed and will be dispatched within 3-5 business days.</p>
            <Button 
              onClick={() => router.push('/')} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>

        </div>
      </div>
    )
  }

  // Canceled screen
  if (paymentStatus === 'canceled') {
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
              onClick={() => setPaymentStatus('idle')} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart screen
  if (state.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Please add items to your cart before checkout.</p>
            <Button 
              onClick={() => router.push('/')} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-orange-500 mr-2" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-4 w-4 text-orange-500 mr-2" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-orange-500 mr-2" />
              <span>1-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Section - Customer Information & Cart */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-red-800">{errorMessage}</span>
              </div>
            )}

            {/* Customer Information */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.firstName ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.lastName ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                    )}
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
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.phone ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                      validationErrors.address ? 'border-red-500' : ''
                    }`}
                    rows={3}
                    required
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.city ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div className="relative">
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={customerInfo.postcode}
                      onChange={(e) => {
                        handleInputChange('postcode', e.target.value)
                        // Trigger address search when postcode changes (debounced)
                        clearTimeout(window.postcodeSearchTimeout)
                        window.postcodeSearchTimeout = setTimeout(() => {
                          searchAddress(e.target.value)
                        }, 500)
                      }}
                      className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        validationErrors.postcode ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., W1D 1BS"
                      required
                    />
                    {isSearchingAddress && (
                      <div className="absolute right-3 top-8">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    {validationErrors.postcode && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.postcode}</p>
                    )}
                    
                    {/* Address Suggestions Dropdown */}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="address-suggestions-container absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => selectAddressSuggestion(suggestion)}
                          >
                            <div className="font-medium text-gray-900">{suggestion.address}</div>
                            <div className="text-sm text-gray-600">{suggestion.city}, {suggestion.postcode}</div>
                          </button>
                        ))}
                      </div>
                    )}
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
                      <div className="text-sm text-gray-600">Free delivery</div>
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
                  <div key={`${item.id}-${item.size || 'standard'}-${item.color || 'default'}-${index}`} 
                       className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.jpg"
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 break-words">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
                      {item.variantSku && <p className="text-xs text-gray-500 font-mono">SKU: {item.variantSku}</p>}
                      <p className="text-base sm:text-lg font-bold text-orange-600">£{item.currentPrice || item.originalPrice}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 sm:w-8 sm:h-8 p-0 border-gray-300 hover:border-orange-500 touch-manipulation"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 sm:w-8 sm:h-8 p-0 border-gray-300 hover:border-orange-500 touch-manipulation"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
                  <p className="text-sm text-gray-600 mb-3">We accept:</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">Visa</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Mastercard</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">American Express</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Discover</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">PayPal</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Klarna</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Apple Pay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Google Pay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Afterpay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Clearpay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Zip</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Shield className="h-8 w-8 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-900">1-Year Warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Mobile Validation Popup */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Missing Information</h3>
            </div>
            <p className="text-gray-700 mb-6">{validationPopupMessage}</p>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowValidationPopup(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}