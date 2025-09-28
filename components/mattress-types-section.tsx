"use client"

import { Bed, User, Grid, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'

export function MattressTypesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { content, loading, error } = useHomePageContent()
  const [mattressProducts, setMattressProducts] = useState<any[]>([])
  
    // Fetch actual mattress products when content changes
  useEffect(() => {
    const fetchMattressProducts = async () => {
        // Check if we have mattress cards with features
        if (content.mattresses?.mattressCards?.length > 0) {
          console.log('🔍 MattressTypesSection - Mattress cards data:', content.mattresses.mattressCards)
          try {
            // Fetch product details for each mattress card
            const productPromises = content.mattresses.mattressCards.map(async (mattressCard: any, index: number) => {
            const { productId, featureToShow } = mattressCard
            
            if (!productId) return null
            
            try {
              const response = await fetch(`/api/products/${productId}`)
              
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
                if (product && product.id) {
                  // Use the feature as the title instead of product name
                  const featureTitle = featureToShow || product.name || `Premium Mattress ${index + 1}`
                  
                  // Ensure we have a proper image
                  const productImage = product.images?.[0] || product.image || "/bedcollect.jpeg"
                  
                  // Ensure we have a proper description - use card description first, then product description
                  const productDescription = mattressCard.description || 
                    content.mattresses.description || 
                    product.long_description || 
                    product.longDescription || 
                    "Premium mattress offering exceptional comfort and support."
                  
                  console.log('🔍 MattressTypesSection - Description sources:', {
                    cardDescription: mattressCard.description,
                    globalDescription: content.mattresses.description,
                    productLongDescription: product.long_description,
                    productLongDescriptionAlt: product.longDescription,
                    finalDescription: productDescription
                  })
                  
                  return {
                    id: product.id,
                    title: featureTitle,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
                    description: productDescription,
                    image: productImage
                  }
                } else {
                  // Fallback to hardcoded data when product not found
                  return {
                    id: `fallback-${index}`,
                    title: featureToShow || `Premium Mattress ${index + 1}`,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
                    description: mattressCard.description || content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                    image: "/bedcollect.jpeg"
                  }
                }
              } else {
                // Fallback to hardcoded data when API fails
                return {
                  id: `fallback-${index}`,
                  title: featureToShow || `Premium Mattress ${index + 1}`,
                  icon: <Bed className="h-5 w-5 text-orange-500" />,
                  description: mattressCard.description || content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                  image: "/bedcollect.jpeg"
                }
              }
            } catch (error) {
              // Fallback to hardcoded data when error occurs
              return {
                id: `fallback-${index}`,
                title: featureToShow || `Premium Mattress ${index + 1}`,
                icon: <Bed className="h-5 w-5 text-orange-500" />,
                description: mattressCard.description || content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                image: "/bedcollect.jpeg"
              }
            }
          })
          
          const products = await Promise.all(productPromises)
          setMattressProducts(products.filter(Boolean))
        } catch (error) {
          // Handle error silently
        }
      } else if (content.mattresses?.productIds?.length > 0) {
        // Fallback to old structure
        try {
          const productPromises = content.mattresses.productIds.map(async (productId: string, index: number) => {
            if (!productId) return null
            
            try {
              const response = await fetch(`/api/products/${productId}`)
              if (response.ok) {
                const data = await response.json()
                const product = data.product
                
                if (product && product.id) {
                  return {
                    id: product.id,
                    title: product.name || `Premium Mattress ${index + 1}`,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
                    description: content.mattresses.description || product.long_description || "Premium mattress offering exceptional comfort and support.",
                    image: product.images?.[0] || product.image || "/bedcollect.jpeg"
                  }
                } else {
                  // Fallback to hardcoded data when product not found
                  return {
                    id: `fallback-${index}`,
                    title: `Premium Mattress ${index + 1}`,
                    icon: <Bed className="h-5 w-5 text-orange-500" />,
                    description: content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                    image: "/bedcollect.jpeg"
                  }
                }
              } else {
                // Fallback to hardcoded data when API fails
                return {
                  id: `fallback-${index}`,
                  title: `Premium Mattress ${index + 1}`,
                  icon: <Bed className="h-5 w-5 text-orange-500" />,
                  description: content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                  image: "/bedcollect.jpeg"
                }
              }
            } catch (error) {
              // Fallback to hardcoded data when error occurs
              return {
                id: `fallback-${index}`,
                title: `Premium Mattress ${index + 1}`,
                icon: <Bed className="h-5 w-5 text-orange-500" />,
                description: content.mattresses.description || "Premium mattress offering exceptional comfort and support.",
                image: "/bedcollect.jpeg"
              }
            }
          })
          
          const products = await Promise.all(productPromises)
          setMattressProducts(products.filter(Boolean))
        } catch (error) {
          // Handle error silently
        }
      }
    }
    
    fetchMattressProducts()
  }, [content.mattresses])
  

  // Use database products if available, otherwise fallback to hardcoded data
  const mattressTypes = mattressProducts.length > 0 ? mattressProducts : [
    {
      id: 1,
      title: "Hybrid Mattresses",
      icon: <Bed className="h-5 w-5 text-orange-500" />,
      description: "Hybrid mattresses blend the support of innerspring coils with the comfort of foam layers, offering a balanced sleep experience. This versatile construction suits various sleep styles and provides both pressure relief and spinal alignment.",
      image: "/bedcollect.jpeg"
    },
    {
      id: 2,
      title: "Orthopaedic Mattresses",
      icon: <User className="h-5 w-5 text-orange-500" />,
      description: "Orthopedic mattresses are engineered to provide targeted support for the spine and joints, effectively reducing pain and promoting better posture. Their firmness levels are carefully calibrated to distribute weight evenly.",
      image: "/sofa.jpeg"
    },
    {
      id: 3,
      title: "Memory Foam Mattresses",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Memory foam mattresses excel in offering contouring support, adapting to your body's unique shape for personalized comfort. Their pressure-relieving qualities that provide a luxurious sleep experience that alleviates aches and pains.",
      image: "/hello.jpeg"
    },
    {
      id: 4,
      title: "Pocket Spring Mattresses",
      icon: <Bed className="h-5 w-5 text-orange-500" />,
      description: "Pocket spring mattresses feature individually wrapped springs that move independently, providing targeted support and reducing motion transfer. Perfect for couples who want undisturbed sleep.",
      image: "/hi.jpeg"
    },
    {
      id: 5,
      title: "Latex Mattresses",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Latex mattresses offer natural resilience and breathability, with excellent temperature regulation and hypoallergenic properties. They provide consistent support and long-lasting comfort.",
      image: "/hell.jpeg"
    },
    {
      id: 6,
      title: "Gel Memory Foam",
      icon: <User className="h-5 w-5 text-orange-500" />,
      description: "Gel memory foam mattresses combine the contouring benefits of memory foam with advanced cooling technology. The gel infusion helps regulate temperature for a cooler, more comfortable sleep.",
      image: "/sofacollect.jpg"
    }
  ]

  const cardsPerView = 3
  const maxIndex = mattressTypes.length - cardsPerView

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
              Our Mattress Types
            </h2>
            <p className="text-lg text-gray-700 font-modern">
              Tailored comfort, trusted support — discover mattresses made just for you.
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
              {mattressTypes.map((type, index) => {
                // Check if this is a database product (has UUID format) or fallback
                const isDatabaseProduct = typeof type.id === 'string' && type.id.includes('-')
                const categoryForLink = isDatabaseProduct ? 'mattresses' : 'mattresses' // Default category for database products
                
                return (
                  <div key={`${type.id}-${index}`} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                    {isDatabaseProduct ? (
                      <div className="block group h-full">
                        <div className="relative mb-6">
                          <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                            <Image
                              src={type.image || "/bedcollect.jpeg"}
                              alt={type.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                console.error('🔍 MattressTypesSection - Image failed to load:', type.image)
                                // Fallback to a working image if the current one fails
                                const target = e.target as HTMLImageElement
                                target.src = "/bedcollect.jpeg"
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center mb-3 min-h-[3.5rem]">
                          {type.icon}
                          <h3 className="font-semibold text-black ml-2 text-lg font-display group-hover:text-orange-600 transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {type.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed font-modern">
                          {type.description || 'No description available'}
                        </p>
                        <div className="mt-4 text-center">
                          <Link 
                            href={`/products/${categoryForLink}/${type.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        <div className="relative mb-6">
                          <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={type.image || "/bedcollect.jpeg"}
                              alt={type.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                console.error('🔍 MattressTypesSection - Image failed to load:', type.image)
                                // Fallback to a working image if the current one fails
                                const target = e.target as HTMLImageElement
                                target.src = "/bedcollect.jpeg"
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center mb-3 min-h-[3.5rem]">
                          {type.icon}
                          <h3 className="font-semibold text-black ml-2 text-lg font-display" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {type.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed font-modern">
                          {type.description || 'No description available'}
                        </p>
                        <div className="mt-4 text-center">
                          <Link 
                            href={`/mattresses`} 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            Buy Now
                          </Link>
                        </div>
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
