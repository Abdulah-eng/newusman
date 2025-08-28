"use client"

import Image from "next/image"
import { Star, Truck, Clock, Leaf, Zap, Shield, Check, ArrowRight, Heart, Share2, TruckIcon, ShieldCheck, Award, Users, MapPin, Phone, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Waves, Ruler, Layers, Palette, Package, DollarSign, Circle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

interface ProductDetail {
  id: number
  name: string
  brand: string
  brandColor: string
  badge: string
  badgeColor: string
  image: string
  rating: number
  reviewCount: number
  firmness: string
  firmnessLevel: number // 1-10 scale
  features: string[]
  originalPrice: number
  currentPrice: number
  savings: number
  freeDelivery: string
  setupService?: boolean
  setupCost?: number
  certifications: string[]
  sizes: string[]
  selectedSize?: string
  monthlyPrice?: number
  images?: string[] // Multiple product images
  category?: string
}

interface ProductDetailCardProps {
  product: ProductDetail
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { dispatch } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || product.sizes[0])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-300 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderFirmnessScale = (level: number) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Soft</span>
          <span className="text-sm font-medium text-gray-700">Firm</span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${level * 10}%` }}
          />
          <div 
            className="absolute top-0 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-y-0.5 transition-all duration-300"
            style={{ left: `calc(${level * 10}% - 8px)` }}
          />
        </div>
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-600">{product.firmness}</span>
        </div>
      </div>
    )
  }

  // Build features based on category (same logic as product detail page)
  const buildProductFeatures = (): Array<{ label: string; Icon: React.ComponentType<{ className?: string }> | (() => JSX.Element) }> => {
    if (product.category === 'mattresses') {
      return [
        { label: 'Pocket Springs', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
            <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
            <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
            <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
          </svg>
        )},
        { label: 'Memory Foam', Icon: () => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )},
        { label: 'Medium Firmness', Icon: SlidersHorizontal },
        { label: 'Eco Friendly', Icon: Recycle },
        { label: 'Waterproof Cover', Icon: Umbrella },
        { label: '10-Year Warranty', Icon: Shield }
      ]
    }
    
    if (product.category === 'pillows') {
      return [
        { label: 'Memory Foam', Icon: Brain },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Removable Cover', Icon: PackageOpen },
        { label: 'Multiple Sizes', Icon: Ruler },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Hotel Quality', Icon: Star }
      ]
    }
    
    if (product.category === 'kids') {
      return [
        { label: 'Safe Materials', Icon: Shield },
        { label: 'Hypoallergenic', Icon: Leaf },
        { label: 'Easy Clean', Icon: Waves },
        { label: 'Durable Build', Icon: Zap },
        { label: 'Fun Designs', Icon: Star },
        { label: 'Family Friendly', Icon: Users }
      ]
    }
    
    if (product.category === 'sale' || product.category === 'clearance') {
      return [
        { label: 'Premium Quality', Icon: ShieldCheck },
        { label: 'Modern Design', Icon: Palette },
        { label: 'Fast Delivery', Icon: Truck },
        { label: 'Secure Packaging', Icon: Package },
        { label: 'Great Value', Icon: DollarSign },
        { label: 'Warranty Support', Icon: Award }
      ]
    }
    
    // Fallback to product features if available
    if (product.features && product.features.length > 0) {
      return product.features.slice(0, 6).map(feature => ({
        label: feature,
        Icon: () => <Circle className="h-4 w-4" />
      }))
    }
    
    // Default features
    return [
      { label: 'Premium Quality', Icon: () => <Star className="h-4 w-4" /> },
      { label: 'Fast Delivery', Icon: () => <Truck className="h-4 w-4" /> },
      { label: 'Warranty', Icon: () => <Shield className="h-4 w-4" /> }
    ]
  }

  const productFeatures = buildProductFeatures()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        size: selectedSize
      }
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Product Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.images?.[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.badge && (
                  <Badge className="bg-orange-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                    {product.badge}
                  </Badge>
                )}
                {product.savings > 0 && (
                  <Badge className="bg-green-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                    Save ${product.savings.toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Wishlist and Share */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full shadow-lg ${
                    isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-50 shadow-lg"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Brand and Product Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{product.brand.substring(0, 2)}</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{product.brand}</div>
                  <div className="text-sm text-gray-500">Premium Collection</div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-xl text-gray-600">Luxury Hybrid Mattress with Advanced Support Technology</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-gray-600">
                <div className="font-semibold">{product.reviewCount} reviews</div>
                <div className="text-sm">Verified buyers</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {productFeatures.map(({ label, Icon }, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">
                      {typeof Icon === 'function' ? <Icon /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Firmness Scale */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Firmness Level</h3>
              {renderFirmnessScale(product.firmnessLevel || 7)}
            </div>

            {/* Pricing */}
            <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="text-sm text-blue-600 font-semibold">Starting from</div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-blue-900">${product.currentPrice.toFixed(2)}</span>
                <div className="flex flex-col">
                  <span className="text-2xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="text-lg text-green-600 font-semibold">Save ${product.savings.toFixed(2)}</span>
                </div>
              </div>
              {product.monthlyPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-900">or</span>
                  <span className="text-xl font-bold text-blue-900">${product.monthlyPrice}/mo</span>
                  <span className="text-sm text-gray-600">with 0% APR financing</span>
                </div>
              )}
              <div className="text-sm text-gray-600">*Prices vary by size. Free delivery available.</div>
            </div>

            {/* Delivery and Service */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">Free Delivery</div>
                    <div className="text-sm text-green-700">{product.freeDelivery}</div>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">FREE</Badge>
              </div>
              
              {product.setupService && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">Setup Service</div>
                      <div className="text-sm text-blue-700">Professional installation & old mattress removal</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-900">+${product.setupCost}</div>
                    <div className="text-sm text-blue-600">Optional</div>
                  </div>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    <div className="font-semibold">{size}</div>
                    <div className="text-sm opacity-80">
                      {size === 'Twin' && '38" x 74"'}
                      {size === 'Twin XL' && '38" x 80"'}
                      {size === 'Full' && '54" x 74"'}
                      {size === 'Queen' && '60" x 80"'}
                      {size === 'King' && '76" x 80"'}
                      {size === 'Split King' && '76" x 80"'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleAddToCart}
              >
                Add to Cart - ${product.currentPrice.toFixed(2)}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 text-lg rounded-xl hover:border-gray-400 hover:bg-gray-50"
              >
                Find in Store
                <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
            <div className="space-y-3">
              {product.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Why Choose Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">100-Day Trial</div>
                  <div className="text-sm text-green-700">Try risk-free</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Free Delivery</div>
                  <div className="text-sm text-blue-700">Oklahoma & surrounding areas</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-semibold text-purple-900">10-Year Warranty</div>
                  <div className="text-sm text-purple-700">Full coverage included</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Need Help?</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Call Us</span>
                </div>
                <div className="text-blue-700">(405) 564-0561</div>
                <div className="text-sm text-blue-600">Mon-Sat: 9AM-8PM</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Visit Store</span>
                </div>
                <div className="text-green-700">6 locations in Oklahoma</div>
                <div className="text-sm text-green-600">Test mattresses in person</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View All {product.reviewCount} Reviews
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Review */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {renderStars(5)}
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">"Amazing mattress! The comfort level is perfect and delivery was quick. Highly recommend!"</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">- Sarah M.</span>
                <span className="text-sm text-gray-500">Verified Buyer</span>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {renderStars(5)}
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">"Best sleep I've ever had. The firmness is exactly what I needed for my back."</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">- Mike R.</span>
                <span className="text-sm text-gray-500">Verified Buyer</span>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {renderStars(5)}
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">"Excellent quality and the 100-day trial gave me confidence in my purchase."</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">- Lisa K.</span>
                <span className="text-sm text-gray-500">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
