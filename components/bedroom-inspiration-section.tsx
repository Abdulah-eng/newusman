"use client"

import { Bed, User, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'
import { getFeatureIcon } from '@/lib/icon-mapping'

export function BedroomInspirationSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { content, loading, error } = useHomePageContent()
  const [inspirationProducts, setInspirationProducts] = useState<any[]>([])
  
  // Fetch actual inspiration products when content changes
  useEffect(() => {
    const fetchInspirationProducts = async () => {
      console.log('🔍 BedroomInspirationSection - Content:', content)
      console.log('🔍 BedroomInspirationSection - Bedroom inspiration:', content.bedroom_inspiration)
      console.log('🔍 BedroomInspirationSection - Product cards:', content.bedroom_inspiration?.productCards)
      
      // Check if we have product cards with features (new structure)
      if (content.bedroom_inspiration?.productCards?.length > 0) {
        console.log('🔍 BedroomInspirationSection - Processing product cards:', content.bedroom_inspiration.productCards)
        try {
          // Fetch product details for each product card
          const productPromises = content.bedroom_inspiration.productCards.map(async (productCard: any, index: number) => {
            const { productId, featureToShow } = productCard
            console.log(`🔍 BedroomInspirationSection - Processing product ${index + 1}:`, { productId, featureToShow })
            
            if (!productId) {
              console.log(`🔍 BedroomInspirationSection - No productId for card ${index + 1}`)
              return null
            }
            
            try {
              console.log(`🔍 BedroomInspirationSection - Fetching product ${productId}`)
              const response = await fetch(`/api/products/${productId}`)
              console.log(`🔍 BedroomInspirationSection - Response status for ${productId}:`, response.status)
              
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                console.log(`🔍 BedroomInspirationSection - Product data for ${productId}:`, product)
                
                if (product && product.id) {
                  // Use the feature as the title instead of product name
                  const featureTitle = featureToShow || product.name || `Premium Product ${index + 1}`
                  
                  // Ensure we have a proper image
                  const productImage = product.images?.[0] || product.image || "/bedcollect.jpeg"
                  
                  // Ensure we have a proper description
                  const productDescription = content.bedroom_inspiration.description || 
                    product.long_description || 
                    product.longDescription || 
                    "Premium product offering exceptional quality and style."
                  
                  // Get the appropriate icon based on the feature
                  const IconComponent = getFeatureIcon(featureTitle, undefined, 'sm')
                  
                  return {
                    id: product.id,
                    title: featureTitle,
                    icon: <IconComponent className="h-5 w-5" />,
                    description: productDescription,
                    image: productImage
                  }
                } else {
                  console.log(`🔍 BedroomInspirationSection - Invalid product data for ${productId}`)
                  return null
                }
              } else {
                console.log(`🔍 BedroomInspirationSection - Failed to fetch product ${productId}, status:`, response.status)
                return null
              }
            } catch (error) {
              console.log(`🔍 BedroomInspirationSection - Error fetching product ${productId}:`, error)
              return null
            }
          })
          
          const products = await Promise.all(productPromises)
          const validProducts = products.filter(Boolean)
          console.log('🔍 BedroomInspirationSection - Valid products after fetching:', validProducts)
          setInspirationProducts(validProducts)
        } catch (error) {
          console.log('🔍 BedroomInspirationSection - Error in product fetching:', error)
        }
      } else if (content.bedroom_inspiration?.productIds?.length > 0) {
        // Fallback to old structure
        try {
          const productPromises = content.bedroom_inspiration.productIds.map(async (productId: string, index: number) => {
            if (!productId) return null
            
            try {
              const response = await fetch(`/api/products/${productId}`)
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
                if (product && product.id) {
                  // Get the appropriate icon based on the product name
                  const IconComponent = getFeatureIcon(product.name || `Premium Product ${index + 1}`, undefined, 'sm')
                  
                  return {
                    id: product.id,
                    title: product.name || `Premium Product ${index + 1}`,
                    icon: <IconComponent className="h-5 w-5" />,
                    description: content.bedroom_inspiration.description || product.long_description || "Premium product offering exceptional quality and style.",
                    image: product.images?.[0] || product.image || "/bedcollect.jpeg"
                  }
                }
              }
            } catch (error) {
              // Handle error silently
            }
            return null
          })
          
          const products = await Promise.all(productPromises)
          setInspirationProducts(products.filter(Boolean))
        } catch (error) {
          // Handle error silently
        }
      } else {
        // No data available - reset products
        setInspirationProducts([])
      }
    }
    
    fetchInspirationProducts()
  }, [content.bedroom_inspiration])
  
  // Only use database products - no hardcoded fallback
  const inspirationTypes = inspirationProducts

  console.log('🔍 BedroomInspirationSection - Final inspiration products:', inspirationProducts)
  console.log('🔍 BedroomInspirationSection - Final inspiration types:', inspirationTypes)
  console.log('🔍 BedroomInspirationSection - Inspiration types length:', inspirationTypes.length)

  const cardsPerView = 3
  const maxIndex = inspirationTypes.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  // Show section even when empty, but with a message to add content
  if (inspirationTypes.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-display">
              Turn Your Bedroom Into Inspiration
            </h2>
            <p className="text-lg text-gray-700 font-modern">
              Share your perfect bed, sofa or mattress look with us on Instagram.
            </p>
            <p className="text-base text-gray-600 font-modern mt-2">
              Your style could be our next feature — and inspire others to rest better
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm">
              <div className="text-gray-400 mb-4">
                <Bed className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Added Yet</h3>
              <p className="text-gray-500 mb-4">
                Add bedroom inspiration products in the admin panel to display them here.
              </p>
              <a 
                href="/admin/homepage" 
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go to Admin Panel
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-display">
              Turn Your Bedroom Into Inspiration
            </h2>
            <p className="text-lg text-gray-700 font-modern">
              Share your perfect bed, sofa or mattress look with us on Instagram.
            </p>
            <p className="text-base text-gray-600 font-modern mt-2">
              Your style could be our next feature — and inspire others to rest better
            </p>
          </div>
        
          <div className="relative">
            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6 text-black" />
              </button>
            )}
            
            {currentIndex < maxIndex && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-6 w-6 text-black" />
              </button>
            )}
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {inspirationTypes.map((type) => {
                  // Check if this is a database product (has UUID format) or fallback
                  const isDatabaseProduct = typeof type.id === 'string' && type.id.includes('-')
                  const categoryForLink = isDatabaseProduct ? 'mattresses' : 'beds' // Default category for database products
                  
                  return (
                    <div key={type.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                      {isDatabaseProduct ? (
                        <Link href={`/products/${categoryForLink}/${type.id}`} className="block group" target="_blank" rel="noopener noreferrer">
                          <div className="relative mb-6">
                            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                              <Image
                                src={type.image || "/bedcollect.jpeg"}
                                alt={type.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  console.error('🔍 BedroomInspirationSection - Image failed to load:', type.image)
                                  // Fallback to a working image if the current one fails
                                  const target = e.target as HTMLImageElement
                                  target.src = "/bedcollect.jpeg"
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center mb-3">
                            <div className="text-orange-500">
                              {type.icon}
                            </div>
                            <h3 className="font-semibold text-black ml-2 text-lg font-display group-hover:text-orange-500 transition-colors duration-300">
                              {type.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed font-modern">
                            {type.description}
                          </p>
                        </Link>
                      ) : (
                        <div>
                          <div className="relative mb-6">
                            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={type.image || "/bedcollect.jpeg"}
                                alt={type.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  console.error('🔍 BedroomInspirationSection - Image failed to load:', type.image)
                                  // Fallback to a working image if the current one fails
                                  const target = e.target as HTMLImageElement
                                  target.src = "/bedcollect.jpeg"
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center mb-3">
                            <div className="text-orange-500">
                              {type.icon}
                            </div>
                            <h3 className="font-semibold text-black ml-2 text-lg font-display">
                              {type.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed font-modern">
                            {type.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* View More Button */}
            <div className="text-center mt-8">
              <Link 
                href="/beds" 
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                View More Beds
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
  )
}
