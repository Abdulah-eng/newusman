"use client"

import { Sofa, User, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'

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
                  
                  return {
                    id: product.id,
                    title: featureTitle,
                    icon: <Sofa className="h-5 w-5 text-orange-500" />,
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
      }
    }
    
    fetchSofaProducts()
  }, [content.sofa_types])
  
  // Use database products if available, otherwise fallback to hardcoded data
  const sofaTypes = sofaProducts.length > 0 ? sofaProducts : [
    {
      id: 1,
      title: "Premium Fabric Sofas",
      icon: <Sofa className="h-5 w-5 text-orange-500" />,
      description: "Experience luxury with our premium fabric sofas. Crafted with the finest materials for ultimate comfort and durability.",
      image: "/sofa.jpeg"
    },
    {
      id: 2,
      title: "Leather Upholstery",
      icon: <User className="h-5 w-5 text-orange-500" />,
      description: "Timeless elegance meets modern comfort. Our leather sofas offer sophisticated style with exceptional durability.",
      image: "/hello.jpeg"
    },
    {
      id: 3,
      title: "Memory Foam Cushions",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Unmatched comfort with our memory foam cushion technology. Perfect support that adapts to your body shape.",
      image: "/hi.jpeg"
    }
  ]

  const cardsPerView = 3
  const maxIndex = sofaTypes.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
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
                {sofaTypes.map((type) => (
                  <div key={type.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
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
                        {/* Database indicator */}
                        {sofaProducts.length > 0 && (
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
