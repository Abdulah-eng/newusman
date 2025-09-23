"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Star, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useHomePageContent } from "@/hooks/use-homepage-content"
import { useCart } from "@/lib/cart-context"
import { ClientOnly } from "@/components/client-only"

export function DealOfTheDay() {
  const { content } = useHomePageContent()
  const { dispatch } = useCart()
  const [dealProducts, setDealProducts] = useState<any[]>([])
  const [mainDealProduct, setMainDealProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999) // End of day
      const difference = endOfDay.getTime() - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Set initial time after hydration to prevent mismatch
    const timer = setTimeout(() => {
      calculateTimeLeft()
      const interval = setInterval(calculateTimeLeft, 1000)
      return () => clearInterval(interval)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Fetch deal products when content changes
  useEffect(() => {
    const fetchDealProducts = async () => {
      console.log('🔍 DealOfTheDay - Content received:', content)
      console.log('🔍 DealOfTheDay - Deal of day data:', content.deal_of_day)
      console.log('🔍 DealOfTheDay - Product cards:', content.deal_of_day?.productCards)
      console.log('🔍 DealOfTheDay - Product IDs:', content.deal_of_day?.productIds)
      
      // Check if we have product cards with individual data
      if (content.deal_of_day?.productCards?.length > 0) {
        try {
          setLoading(true)
          console.log('🔍 DealOfTheDay - Fetching products for product cards:', content.deal_of_day.productCards)
          
          // OPTIMIZATION: Use bulk API instead of individual calls
          const productIds = content.deal_of_day.productCards
            .map((card: any) => card.productId)
            .filter(Boolean)
          
          if (productIds.length === 0) {
            setLoading(false)
            return
          }

          const response = await fetch('/api/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds })
          })

          if (response.ok) {
            const data = await response.json()
            const products = data.products || []
            
            // Map products with custom data from product cards
            const validProducts = products.map((product: any) => {
              const productCard = content.deal_of_day.productCards.find((card: any) => card.productId === product.id)
              return {
                ...product,
                customDescription: productCard?.description,
                customPercentageOff: productCard?.percentageOff,
                customImage: productCard?.customImage
              }
            }).filter(Boolean)
            
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
          } else {
            console.error('Failed to fetch bulk products, trying fallback method')
            // Fallback to individual product fetching
            const productPromises = productIds.map(async (productId: string) => {
              try {
                const response = await fetch(`/api/products/${productId}`)
                if (response.ok) {
                  const data = await response.json()
                  return data.product
                }
              } catch (error) {
                console.error('Error fetching individual product:', productId, error)
              }
              return null
            })

            const products = await Promise.all(productPromises)
            const validProducts = products.filter(Boolean)
            
            // Map products with custom data from product cards
            const mappedProducts = validProducts.map((product: any) => {
              const productCard = content.deal_of_day.productCards.find((card: any) => card.productId === product.id)
              return {
                ...product,
                customDescription: productCard?.description,
                customPercentageOff: productCard?.percentageOff,
                customImage: productCard?.customImage
              }
            }).filter(Boolean)
            
            if (mappedProducts.length > 0) {
              setMainDealProduct(mappedProducts[0])
            }
            setDealProducts(mappedProducts)
          }
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

  // Add product to cart
  const addToCart = (product: any) => {
    if (!product) return

    // Find the first available variant to get its SKU
    const firstAvailableSize = product.variants?.[0]?.size
    const selectedSize = product.selectedSize || firstAvailableSize || 'Queen'
    
    const selectedVariant = product.variants?.find((variant: any) => 
      variant.size === selectedSize
    )

    const payload = {
      id: product.id,
      name: product.name || 'Premium Product',
      brand: product.brand || 'Premium Brand',
      currentPrice: product.currentPrice || product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      image: product.images?.[0] || product.image || '/placeholder.jpg',
      size: selectedSize,
      color: selectedVariant?.color || 'Default',
      variantSku: selectedVariant?.sku
    }

    // Debug: Show variant SKU in alert
    console.log('DealOfTheDay - Adding to cart:', {
      productId: product.id,
      productName: product.name,
      variants: product.variants,
      selectedSize,
      selectedVariant,
      variantSku: selectedVariant?.sku
    })
    
    alert(`Adding to cart:\nProduct: ${product.name}\nSize: ${selectedSize}\nVariant SKU: ${selectedVariant?.sku || 'NOT FOUND'}\nProduct ID: ${product.id}`)

    dispatch({
      type: 'ADD_ITEM',
      payload
    })
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
            {/* Countdown Timer for empty state too */}
            <div className="mb-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-red-500" />
                  <p className="text-gray-700 font-semibold text-sm font-modern">Next deal starts in:</p>
                </div>
                <ClientOnly fallback={
                  <div className="flex justify-center items-center gap-3">
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Hours</div>
                    </div>
                    <div className="text-2xl text-red-400 font-bold">:</div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Minutes</div>
                    </div>
                    <div className="text-2xl text-red-400 font-bold">:</div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Seconds</div>
                    </div>
                  </div>
                }>
                  <div className="flex justify-center items-center gap-3">
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Hours</div>
                    </div>
                    <div className="text-2xl text-red-400 font-bold">:</div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Minutes</div>
                    </div>
                    <div className="text-2xl text-red-400 font-bold">:</div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                      <div className="text-3xl font-bold text-red-600 font-display leading-none">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 font-modern mt-1">Seconds</div>
                    </div>
                  </div>
                </ClientOnly>
              </div>
            </div>
            
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
          <div className="mb-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-500" />
                <p className="text-gray-700 font-semibold text-sm font-modern">Offer ends in:</p>
              </div>
              <ClientOnly fallback={
                <div className="flex justify-center items-center gap-3">
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Hours</div>
                  </div>
                  <div className="text-2xl text-red-400 font-bold">:</div>
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Minutes</div>
                  </div>
                  <div className="text-2xl text-red-400 font-bold">:</div>
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">00</div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Seconds</div>
                  </div>
                </div>
              }>
                <div className="flex justify-center items-center gap-3">
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Hours</div>
                  </div>
                  <div className="text-2xl text-red-400 font-bold">:</div>
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Minutes</div>
                  </div>
                  <div className="text-2xl text-red-400 font-bold">:</div>
                  <div className="text-center bg-white rounded-xl p-3 shadow-md min-w-[60px]">
                    <div className="text-3xl font-bold text-red-600 font-display leading-none">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 font-modern mt-1">Seconds</div>
                  </div>
                </div>
              </ClientOnly>
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
                src={mainDealProduct.customImage || mainDealProduct.images?.[0] || mainDealProduct.image || "/placeholder.jpg"}
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
                  <span className="text-sm text-gray-700 font-modern">14-Night Trial</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-modern">Premium Quality</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Link href={`/products/${mainDealProduct.category || 'mattresses'}/${mainDealProduct.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Buy Now
                </Link>
                <Button 
                  onClick={() => addToCart(mainDealProduct)}
                  className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Claim This Deal Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Deals Grid - make 3 wider cards that fill width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dealProducts.slice(1, 5).map((product, index) => {
            const discount = product.originalPrice && product.currentPrice ? 
              calculateDiscount(product.currentPrice, product.originalPrice) : 
              25 // Fixed discount to prevent hydration mismatch
            
            return (
              <div key={product.id || index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                <div className="relative mb-4">
                  <Image
                    src={product.customImage || product.images?.[0] || product.image || "/placeholder.jpg"}
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
                <h4 className="text-xl font-bold text-gray-900 mb-2 font-display" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.name || `Product ${index + 1}`}
                </h4>
                <p className="text-gray-600 text-sm mb-3 font-modern min-h-[3.75rem]" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.customDescription || 
                   product.longDescription || 
                   product.long_description || 
                   "Premium quality product with exceptional features and comfort"}
                </p>
                <div className="mt-auto flex items-center justify-between">
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
                  <Link href={`/products/${product.category || 'mattresses'}/${product.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Buy Now
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
