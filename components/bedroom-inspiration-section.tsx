"use client"

import { Bed, User, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'

export function BedroomInspirationSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { content, loading, error } = useHomePageContent()
  const [inspirationProducts, setInspirationProducts] = useState<any[]>([])
  
  // Fetch actual inspiration products when content changes
  useEffect(() => {
    const fetchInspirationProducts = async () => {
      // Check if we have product cards with features
      if (content.bedroom_inspiration?.productCards?.length > 0) {
        try {
          // Fetch product details for each product card
          const productPromises = content.bedroom_inspiration.productCards.map(async (productCard: any, index: number) => {
            const { productId, featureToShow } = productCard
            
            if (!productId) return null
            
            try {
              const response = await fetch(`/api/products/${productId}`)
              
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
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
                  
                  return {
                    id: product.id,
                    title: featureTitle,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
                    description: productDescription,
                    image: productImage
                  }
                } else {
                  return null
                }
              } else {
                return null
              }
            } catch (error) {
              return null
            }
          })
          
          const products = await Promise.all(productPromises)
          setInspirationProducts(products.filter(Boolean))
        } catch (error) {
          // Handle error silently
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
                  return {
                    id: product.id,
                    title: product.name || `Premium Product ${index + 1}`,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
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
      }
    }
    
    fetchInspirationProducts()
  }, [content.bedroom_inspiration])
  
  // Use database products if available, otherwise fallback to hardcoded data
  const inspirationTypes = inspirationProducts.length > 0 ? inspirationProducts : [
    {
      id: 1,
      title: "Premium Beds",
      icon: <Bed className="h-5 w-5 text-orange-500" />,
      description: "Transform your bedroom with our premium bed collection. Each piece is crafted with attention to detail, offering both comfort and style for your personal sanctuary.",
      image: "/bedcollect.jpeg"
    },
    {
      id: 2,
      title: "Elegant Bedding",
      icon: <User className="h-5 w-5 text-orange-500" />,
      description: "Elevate your sleep experience with our luxurious bedding collection. From soft cotton to premium silk, find the perfect combination for ultimate comfort.",
      image: "/sofa.jpeg"
    },
    {
      id: 3,
      title: "Stylish Bed Frames",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Make a statement with our designer bed frames. Available in various styles from modern minimalism to classic elegance, perfect for any bedroom aesthetic.",
      image: "/hello.jpeg"
    }
  ]

  const cardsPerView = 3
  const maxIndex = inspirationTypes.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
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
                {inspirationTypes.map((type) => (
                  <div key={type.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
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
                        {/* Database indicator */}
                        {inspirationProducts.length > 0 && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                            DB
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mb-3">
                      {type.icon}
                      <h3 className="font-semibold text-black ml-2 text-lg font-display">
                        {type.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed font-modern">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
