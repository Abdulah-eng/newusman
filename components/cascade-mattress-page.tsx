"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown, Phone, MessageCircle, Calendar, Truck, Shield, Award, Users, MapPin, Star, Heart, Share2, ZoomIn, ThumbsUp, Clock, Package, Minus, Plus } from 'lucide-react'
import { ProductCard } from './product-card'


export function CascadeMattressPage() {
  const [selectedSize, setSelectedSize] = useState('Queen')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Using existing images temporarily - replace with AI-generated images later
  const images = [
    "/cascade-main.jpg", // Main mattress on bed frame
    "/cascade-features.jpg", // Firmness scale view
    "/cascade-height.jpg", // Sleeper types view
    "/cascade-sleepers.jpg", // Certifications view
    "/cascade-firmness.jpg", // Height and dimensions view
    "/placeholder.jpg"  // Delivery and warranty view
  ]

  const sizes = [
    { name: 'Twin', price: 185.95, dimensions: '38" x 74"', originalPrice: 259.95 },
    { name: 'Full', price: 259.95, dimensions: '54" x 74"', originalPrice: 359.95 },
    { name: 'Queen', price: 259.95, dimensions: '60" x 80"', originalPrice: 399.95 },
    { name: 'King', price: 359.95, dimensions: '76" x 80"', originalPrice: 499.95 }
  ]

  const selectedSizeData = sizes.find(s => s.name === selectedSize)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-blue-200 transition-colors duration-200">About Us</a>
            <a href="#" className="hover:text-blue-200 transition-colors duration-200">Contact Us</a>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Free 1-Day Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Oklahoma</span>
            </div>
            <a href="#" className="hover:text-blue-200 transition-colors duration-200">Find Stores</a>
            <span className="font-semibold">(405) 564-0561</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="text-3xl font-bold text-blue-900">Mattress</span>
              <span className="text-3xl font-bold text-blue-600">King</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-yellow-800 font-bold">👑</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything at MattressKing"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className="relative">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </div>
            </button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200">
              Financing
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/mattresses" className="hover:text-blue-600">Mattresses</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Cascade | Medium-Firm</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Column - Product Image */}
          <div className="lg:col-span-2">
            <div className="relative">
              <img 
                src={images[selectedImage]} 
                alt={`Cascade Medium-Firm Mattress`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {/* Image Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      selectedImage === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Title and Badge */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold">
                  Bronze Collection
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">
                  Best Seller
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Cascade | Medium-Firm
              </h1>
              
              <p className="text-xl text-gray-600">
                Our Budget Pick - Perfect for Light Sleepers & Kids
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.2 (127 reviews)</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <span>1.7k+ people bought this month</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                This basic Pillow Top innerspring mattress is designed to give stomach, side and back sleepers a brand new mattress without spending much. Perfect for light sleepers, children, and anyone looking for quality sleep on a budget.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Features a 1" Comfort Foam layer sewn into the quilt and an additional 1.5" layer of Comfort Foam, supported by a 504 15 Gauge SPECTRUM Coil innerspring unit.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">🌙</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Medium-Firm</div>
                  <div className="text-sm text-gray-600">Perfect balance</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">🛏️</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">9" Height</div>
                  <div className="text-sm text-gray-600">Standard profile</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">⭐</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">All Sleepers</div>
                  <div className="text-sm text-gray-600">Back, side, stomach</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">🔒</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">10-Year Warranty</div>
                  <div className="text-sm text-gray-600">Full coverage</div>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
                <a href="#" className="text-blue-600 text-sm hover:underline font-medium">Size Guide</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`relative p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                      selectedSize === size.name 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-lg text-gray-900">{size.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{size.dimensions}</div>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-blue-600">${size.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${size.originalPrice}</span>
                    </div>
                    {selectedSize === size.name && (
                      <Check className="absolute top-2 right-2 h-5 w-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Add to Cart - ${selectedSizeData?.price}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  or <span className="font-semibold text-blue-600">${Math.round((selectedSizeData?.price || 0) / 12)}/month</span> with Affirm
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">Free 1-Day Delivery</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">100-Night Trial</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">10-Year Warranty</div>
              </div>
            </div>

            {/* Expert Assistance */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Need Help Choosing?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our sleep experts are here to help you find the perfect mattress.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium">
                  <Phone className="h-4 w-4 mr-2" />
                  Call (405) 564-0561
                </Button>
                <Button className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 py-3 font-medium">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Expert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>





      {/* Frequently Bought Together */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                id: 1,
                name: 'Cascade Medium-Firm Mattress', 
                brand: 'MattressKing',
                category: 'mattresses',
                type: 'Hybrid',
                price: 259.95, 
                originalPrice: 359.95,
                currentPrice: 259.95,
                image: '/cascade-main.jpg',
                images: ['/cascade-main.jpg'],
                rating: 4.2,
                reviewCount: 127,
                firmness: 'Medium-Firm',
                firmnessLevel: 6,
                features: ['Premium Quality', 'Motion Isolation', 'Edge Support'],
                sizes: ['Queen'],
                selectedSize: 'Queen',
                savings: 100
              },
              { 
                id: 2,
                name: 'Premium Smooth Waterproof Mattress Protector', 
                brand: 'MattressKing',
                category: 'bedding',
                type: 'Mattress Protectors',
                price: 45.95, 
                originalPrice: 55.00,
                currentPrice: 45.95,
                image: '/placeholder.jpg',
                images: ['/placeholder.jpg'],
                rating: 4.5,
                reviewCount: 300,
                firmness: 'Standard',
                firmnessLevel: 5,
                features: ['Waterproof', 'Hypoallergenic', 'Breathable'],
                sizes: ['Queen'],
                selectedSize: 'Queen',
                savings: 9.05
              },
              { 
                id: 3,
                name: 'Memory Foam Pillow', 
                brand: 'MattressKing',
                category: 'pillows',
                type: 'Memory Foam Pillow',
                price: 49.99, 
                originalPrice: 60.00,
                currentPrice: 49.99,
                image: '/placeholder.jpg',
                images: ['/placeholder.jpg'],
                rating: 4.5,
                reviewCount: 250,
                firmness: 'Medium',
                firmnessLevel: 6,
                features: ['Memory Foam', 'Cervical Support', 'Cooling'],
                sizes: ['Standard'],
                selectedSize: 'Standard',
                savings: 10.01
              }
            ].map((product, index) => (
              <div key={index} className="relative">
                <ProductCard product={product} />
                
                {/* Plus Icon between products */}
                {index < 2 && (
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-bold">+</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Total Savings and Add All Button */}
          <div className="text-center mt-8">
            <div className="mb-4">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Total Savings:</span> 
                <span className="text-green-600 font-bold text-xl ml-2">$119.06</span>
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Add All to Cart - Save $119.06
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">MattressKing</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-800">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat now
                </Button>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(405) 564-0561</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/mattresses" className="hover:text-white">Mattresses</a></li>
                <li><a href="/adjustable-bases" className="hover:text-white">Adjustable Bases</a></li>
                <li><a href="/pillows" className="hover:text-white">Pillows</a></li>
                <li><a href="/bedding" className="hover:text-white">Bedding</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/trial-policies" className="hover:text-white">Trial Policies</a></li>
                <li><a href="/warranty" className="hover:text-white">Warranty</a></li>
                <li><a href="/financing" className="hover:text-white">Financing</a></li>
                <li><a href="/delivery" className="hover:text-white">Delivery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/our-story" className="hover:text-white">Our Story</a></li>
                <li><a href="/stores" className="hover:text-white">Stores</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 MattressKing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
