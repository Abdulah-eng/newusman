"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Star, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useHomePageContent } from "@/hooks/use-homepage-content"

export function DealOfTheDay() {
  const { content } = useHomePageContent()
  const [dealProducts, setDealProducts] = useState<any[]>([])
  const [mainDealProduct, setMainDealProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch deal products when content changes
  useEffect(() => {
    const fetchDealProducts = async () => {
      // Check if we have product cards with individual data
      if (content.deal_of_day?.productCards?.length > 0) {
        try {
          setLoading(true)
          console.log('🔍 DealOfTheDay - Fetching products for product cards:', content.deal_of_day.productCards)
          
          // Fetch product details for each product card
          const productPromises = content.deal_of_day.productCards.map(async (productCard: any) => {
            const { productId, description, percentageOff } = productCard
            
            if (!productId) return null
            
            try {
              const response = await fetch(`/api/products/${productId}`)
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
                if (product && product.id) {
                  return {
                    ...product,
                    customDescription: description,
                    customPercentageOff: percentageOff
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching product:', productId, error)
            }
            return null
          })

          const products = await Promise.all(productPromises)
          const validProducts = products.filter(Boolean)
          console.log('🔍 DealOfTheDay - Final valid products:', validProducts.map(p => ({
            id: p.id,
            name: p.name,
            currentPrice: p.currentPrice,
            originalPrice: p.originalPrice,
            customDescription: p.customDescription,
            customPercentageOff: p.customPercentageOff
          })))
          
          // Set the first product as the main deal
          if (validProducts.length > 0) {
            setMainDealProduct(validProducts[0])
          }
          
          // Set all products for the grid
          setDealProducts(validProducts)
        } catch (error) {
          console.error('Error fetching deal products:', error)
        } finally {
          setLoading(false)
        }
      } else if (content.deal_of_day?.productIds?.length > 0) {
        // Fallback to old structure
        try {
          setLoading(true)
          console.log('🔍 DealOfTheDay - Fetching products for IDs (fallback):', content.deal_of_day.productIds)
          
          const productPromises = content.deal_of_day.productIds.map(async (productId: string) => {
            try {
              const response = await fetch(`/api/products/${productId}`)
              if (response.ok) {
                const data = await response.json()
                return data.product
              }
            } catch (error) {
              console.error('Error fetching product:', productId, error)
            }
            return null
          })

          const products = await Promise.all(productPromises)
          const validProducts = products.filter(Boolean)
          
          if (validProducts.length > 0) {
            setMainDealProduct(validProducts[0])
          }
          setDealProducts(validProducts)
        } catch (error) {
          console.error('Error fetching deal products:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchDealProducts()
  }, [content.deal_of_day])

  // Calculate discount percentage
  const calculateDiscount = (currentPrice: number, originalPrice: number) => {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  // Format price
  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`
  }

  // Loading state
  if (loading) {
    return (
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
              Deal of the Day
            </h2>
            {content.deal_of_day?.description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-modern">
                {content.deal_of_day.description}
              </p>
            )}
            {content.deal_of_day?.percentageOff && (
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 px-6 py-2 text-lg font-bold shadow-lg">
                  {content.deal_of_day.percentageOff}
                </Badge>
              </div>
            )}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-modern">
              Loading amazing deals...
            </p>
          </div>
        </div>
      </section>
    )
  }

  // If no products, show empty state
  if (!mainDealProduct || dealProducts.length === 0) {
    return (
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
              Deal of the Day
            </h2>
            {content.deal_of_day?.description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-modern">
                {content.deal_of_day.description}
              </p>
            )}
            {content.deal_of_day?.percentageOff && (
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 px-6 py-2 text-lg font-bold shadow-lg">
                  {content.deal_of_day.percentageOff}
                </Badge>
              </div>
            )}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-modern">
              No deals available at the moment. Check back soon for amazing offers!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
            Deal of the Day
          </h2>
          
          {content.deal_of_day?.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-modern">
              {content.deal_of_day.description}
            </p>
          )}
          
          {content.deal_of_day?.percentageOff && (
            <div className="mb-4">
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 px-6 py-2 text-lg font-bold shadow-lg">
                {content.deal_of_day.percentageOff}
              </Badge>
            </div>
          )}
          
          {/* Countdown Timer - Moved below description */}
          <div className="bg-white rounded-xl p-4 shadow-none mb-6 max-w-sm mx-auto">
            <div className="text-center">
              <p className="text-gray-600 mb-3 text-sm font-modern">Offer ends in:</p>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 font-display">23</div>
                  <div className="text-xs text-gray-500 font-modern">Hours</div>
                </div>
                <div className="text-xl text-gray-300">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 font-display">45</div>
                  <div className="text-xs text-gray-500 font-modern">Minutes</div>
                </div>
                <div className="text-xl text-gray-300">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 font-display">12</div>
                  <div className="text-xs text-gray-500 font-modern">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Deal Card */}
        <div className="bg-white rounded-3xl shadow-none overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Image Section */}
            <div className="relative h-80 lg:h-full bg-gradient-to-br from-orange-50 to-red-100">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <Image
                src={mainDealProduct.images?.[0] || mainDealProduct.image || "/placeholder.jpg"}
                alt={mainDealProduct.name || "Premium Product Deal"}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
              {/* Deal Badge */}
              <div className="absolute top-6 left-6 z-20">
                <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 px-4 py-2 text-lg font-bold shadow-lg">
                  {mainDealProduct.customPercentageOff || 
                   (mainDealProduct.originalPrice && mainDealProduct.currentPrice ? 
                    `${calculateDiscount(mainDealProduct.currentPrice, mainDealProduct.originalPrice)}% OFF` : 
                    'SPECIAL OFFER')}
                </Badge>
              </div>
              {/* Rating */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700 font-modern">
                  {mainDealProduct.rating || '4.9'}
                </span>
              </div>
            </div>

            {/* Right: Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
                  {mainDealProduct.name || "Premium Product"}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 font-modern">
                  {mainDealProduct.customDescription || 
                   mainDealProduct.longDescription || 
                   mainDealProduct.long_description || 
                   "Experience ultimate quality with our premium product. Features advanced technology and superior craftsmanship for exceptional performance."}
                </p>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-display">
                    {formatPrice(mainDealProduct.currentPrice || 0)}
                  </span>
                  {mainDealProduct.originalPrice && mainDealProduct.originalPrice > (mainDealProduct.currentPrice || 0) && (
                    <>
                      <span className="text-2xl text-gray-400 line-through font-modern">
                        {formatPrice(mainDealProduct.originalPrice)}
                      </span>
                      <span className="text-lg text-green-600 font-semibold font-modern">
                        Save {formatPrice((mainDealProduct.originalPrice || 0) - (mainDealProduct.currentPrice || 0))}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-modern">Free delivery & 100-night trial included</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">Free Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">100-Night Trial</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">10-Year Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">Premium Quality</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Zap className="w-5 h-5 mr-2" />
                Claim This Deal Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.slice(1, 5).map((product, index) => {
            const discount = product.originalPrice && product.currentPrice ? 
              calculateDiscount(product.currentPrice, product.originalPrice) : 
              Math.floor(Math.random() * 40) + 20 // Fallback random discount
            
            return (
              <div key={product.id || index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="relative mb-4">
                  <Image
                    src={product.images?.[0] || product.image || "/placeholder.jpg"}
                    alt={product.name || `Product ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.jpg"
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    {product.customPercentageOff || `${discount}% OFF`}
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">
                  {product.name || `Product ${index + 1}`}
                </h4>
                <p className="text-gray-600 text-sm mb-3 font-modern">
                  {product.customDescription || 
                   product.longDescription || 
                   product.long_description || 
                   "Premium quality product with exceptional features and comfort"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600 font-display">
                      {formatPrice(product.currentPrice || 0)}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.currentPrice || 0) && (
                      <span className="text-lg text-gray-400 line-through font-modern">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                    View Deal
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
