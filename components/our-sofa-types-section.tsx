"use client"

import { Sofa, User, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'
import { getFeatureIcon } from '@/lib/icon-mapping'

export function OurSofaTypesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { content, loading, error } = useHomePageContent()
  const [sofaProducts, setSofaProducts] = useState<any[]>([])
  
  // Fetch actual sofa products when content changes
  useEffect(() => {
    const fetchSofaProducts = async () => {
      
      // Check if we have sofa types with features
      if (content.sofa_types?.length > 0) {
        try {
          // Fetch product details for each sofa type
          const productPromises = content.sofa_types.map(async (sofaType: any, index: number) => {
            const { sofaId, featureToShow, description } = sofaType
            
            if (!sofaId) return null
            
            try {
              const response = await fetch(`/api/products/${sofaId}`)
              
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
                if (product && product.id) {
                  // Use the feature as the title instead of product name
                  const featureTitle = featureToShow || product.name || `Premium Sofa ${index + 1}`
                  
                  // Ensure we have a proper image
                  const productImage = product.images?.[0] || product.image || "/sofa.jpeg"
                  
                  // Use the description from the sofa type or fallback
                  const productDescription = description || 
                    product.long_description || 
                    product.longDescription || 
                    "Premium sofa offering exceptional comfort and style."
                  
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
          setSofaProducts(products.filter(Boolean))
        } catch (error) {
          // Handle error silently
        }
      } else {
        // No data available - reset products
        setSofaProducts([])
      }
    }
    
    fetchSofaProducts()
  }, [content.sofa_types])
  
  // Only use database products - no hardcoded fallback
  const sofaTypes = sofaProducts


  const cardsPerView = 3
  const maxIndex = sofaTypes.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  // Show section even when empty, but with a message to add content
  if (sofaTypes.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-display">
              Our Sofa Types
            </h2>
            <p className="text-lg text-gray-700 font-modern">
              Discover comfort and style with our diverse sofa collection.
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Sofa className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Sofa Types Added Yet</h3>
              <p className="text-gray-500 mb-4">
                Add sofa types in the admin panel to display them here.
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
    <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-display">
              Our Sofa Types
            </h2>
            <p className="text-lg text-gray-700 font-modern">
              Discover comfort and style with our diverse sofa collection.
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
                {sofaTypes.map((type) => {
                  // All products are from database now
                  const isDatabaseProduct = typeof type.id === 'string' && type.id.includes('-')
                  const categoryForLink = isDatabaseProduct ? 'sofas' : 'sofas' // Default category for database products
                  
                  return (
                    <div key={type.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                      {isDatabaseProduct ? (
                        <Link href={`/products/${categoryForLink}/${type.id}`} className="block group">
                          <div className="relative mb-6">
                            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                              <Image
                                src={type.image || "/sofa.jpeg"}
                                alt={type.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  console.error('🔍 OurSofaTypesSection - Image failed to load:', type.image)
                                  // Fallback to a working image if the current one fails
                                  const target = e.target as HTMLImageElement
                                  target.src = "/sofa.jpeg"
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
                                src={type.image || "/sofa.jpeg"}
                                alt={type.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  console.error('🔍 OurSofaTypesSection - Image failed to load:', type.image)
                                  // Fallback to a working image if the current one fails
                                  const target = e.target as HTMLImageElement
                                  target.src = "/sofa.jpeg"
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
          </div>
        </div>
      </section>
  )
}
