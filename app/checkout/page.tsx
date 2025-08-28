"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, MessageCircle, Shield, Truck, Clock, Star, Heart, CreditCard, Lock } from "lucide-react"

export default function CheckoutPage() {
  const { state } = useCart()

  if (state.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Please add items to your cart before checkout.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Promotional Banner */}
      <div className="bg-yellow-400 text-gray-900 py-2 text-center text-sm font-medium">
        🎉 TODAY ONLY - Summer Holiday Daily Deals | ENDS IN 19 HOURS 46 MINS 46 SECS
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input 
                placeholder="Search for your bedroom upgrade...." 
                className="max-w-md"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-blue-800 font-serif">MattressKing™</h1>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-4">
              <div className="text-sm text-blue-800">
                <div>Track Order</div>
                <div>My Account</div>
                <div>Sign In / Register</div>
              </div>
              <Button variant="outline" className="border-blue-800 text-blue-800">
                Build Your Own Bed
              </Button>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white relative">
                <MessageCircle className="h-5 w-5 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">BASKET</span>
                  <span className="font-medium">£{(state.total || 0).toFixed(2)}</span>
                </div>
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3 overflow-x-auto">
            <a href="/beds" className="hover:text-gray-200 font-medium py-2">Beds</a>
            <a href="/mattresses" className="hover:text-gray-200 font-medium py-2">Mattresses</a>
            <a href="/kids" className="hover:text-gray-200 font-medium py-2">Kids</a>
            <a href="/bedroom-furniture" className="hover:text-gray-200 font-medium py-2">Bedroom Furniture</a>
            <a href="/headboards" className="hover:text-gray-200 font-medium py-2">Headboards</a>
            <a href="/bedding" className="hover:text-gray-200 font-medium py-2">Bedding</a>
            <a href="/build-your-own-bed" className="hover:text-gray-200 font-medium py-2">Build Your Own Bed</a>
            <a href="/new-in" className="hover:text-gray-200 font-medium py-2">New In</a>
            <a href="/sale" className="bg-red-600 px-3 py-1 rounded font-medium">Sales & Offers</a>
            <a href="/help-advice" className="hover:text-gray-200 font-medium py-2">Help & Advice</a>
          </nav>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-pink-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Trustpilot ★★★★ Rated Excellent</span>
            </div>
            <div>Buy today, delivered tomorrow</div>
            <div>Klarna. Buy now & pay later available</div>
            <div>5 Year manufacturer's guarantee</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Item */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Rome Oak Wooden Bed</h3>
                    <p className="text-gray-600">King Size (5' x 6'6")</p>
                    <p className="text-lg font-bold text-blue-800">£{(state.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">-</Button>
                    <span className="w-12 text-center">1</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">+</Button>
                  </div>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700">Delete</Button>
                </div>
              </CardContent>
            </Card>

            {/* Promotional Offer */}
            <div className="bg-red-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">LAST CHANCE</h3>
                  <p className="text-lg">SAVE 10% on a mattress when you buy a bed</p>
                </div>
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                  Choose Mattress
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Upsell Product */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Add a Universal White Bedside table</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>RRP FROM £219.99</span>
                      <span className="text-green-600 font-semibold">Now: £159.99</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" className="text-blue-800 hover:text-blue-700">View info</Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Bed Recycling */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-green-600 text-2xl">♻️</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Add Bed Recycling</h4>
                    <p className="text-sm text-gray-600">Environmentally friendly disposal</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" className="text-blue-800 hover:text-blue-700">View info</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="ghost" className="text-blue-800 hover:text-blue-700">
                View More Offers
              </Button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Delivery Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">Quick delivery options available at checkout.</p>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg">
                    <button className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50">
                      <span className="font-medium">Apply Discount Code</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg">
                    <button className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50">
                      <span className="font-medium">Charity Donation</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg">
                    <button className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50">
                      <span className="font-medium">Item Summary</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="p-3 border-t border-gray-200 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>£{(state.total || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT</span>
                        <span>£{((state.total || 0) * 0.2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total inc VAT</span>
                        <span>£{((state.total || 0) * 1.2).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold">
                  Proceed to Checkout
                </Button>

                {/* Payment Methods */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>Klarna</span>
                  <span>•</span>
                  <span>Powered by Stripe</span>
                  <span>•</span>
                  <span>Visa</span>
                  <span>•</span>
                  <span>Mastercard</span>
                  <span>•</span>
                  <span>Maestro</span>
                  <span>•</span>
                  <span>PayPal</span>
                </div>
              </CardContent>
            </Card>

            {/* Live Chat Button */}
            <div className="fixed bottom-6 right-6">
              <Button className="w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg">
                <MessageCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Your Happy Guarantee Banner */}
      <div className="bg-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Your MattressKing Guarantee</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">5-Year Manufacturer Guarantee</h3>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Speedy Delivery</h3>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">14 Day No-Hassle Returns</h3>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rated Excellent on Trustpilot</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-800 text-white py-12">
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
