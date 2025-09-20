"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'

interface HeroSectionProps {
  onCategoryChange?: (category: string) => void
}

export default function HeroSection({ onCategoryChange }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('mattresses')
  const { content, loading, error, bannerImages } = useHomePageContent()

  // Use cached banner images for instant access
  const hasDatabaseImages = bannerImages.heroData?.slidingImagesData?.some(data => data.image) || bannerImages.carousel.length > 0
  
  const carouselImages = hasDatabaseImages
    ? (bannerImages.heroData?.slidingImagesData || []).map((imageData, index) => {
        return {
          src: imageData.image,
          alt: `Hero Image ${index + 1}`,
          title: imageData?.heading || "PREMIUM",
          subtitle: imageData?.description || "COLLECTION",
          price: imageData?.price || "$299.99",
          discount: imageData?.discount || "SALE UP TO 40% OFF",
          edition: imageData?.badge || "NEW ARRIVAL",
          buttonText: imageData?.buttonText || "Shop Now",
          link: imageData?.link || ''
        }
      }).filter(img => img.src) // Only include images that have a src
    : []

  // Immediate image preloading for instant display
  useEffect(() => {
    if (bannerImages.heroData?.slidingImagesData) {
      bannerImages.heroData.slidingImagesData.forEach(data => {
        if (data.image) {
          const img = new window.Image()
          img.src = data.image
        }
      })
    }
    if (bannerImages.smallImage1) {
      const img1 = new window.Image()
      img1.src = bannerImages.smallImage1
    }
    if (bannerImages.smallImage2) {
      const img2 = new window.Image()
      img2.src = bannerImages.smallImage2
    }
  }, [bannerImages])

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (carouselImages.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [carouselImages.length])


  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <>
      <section className="w-full py-0 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Banner - Carousel */}
          <div className="lg:col-span-2 relative h-96 lg:h-[500px] overflow-hidden rounded-lg group">
            {carouselImages.length > 0 ? (
              <div 
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  const currentImage = carouselImages[currentSlide]
                  if (currentImage?.link) {
                    window.open(currentImage.link, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                <Image
                  src={carouselImages[currentSlide]?.src || ""}
                  alt={carouselImages[currentSlide]?.alt || "Hero Image"}
                  fill
                  className="object-cover transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
              </div>
            )}
            
            
            {/* Carousel Content Overlay */}
            {carouselImages.length > 0 && (
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="text-white p-8 w-full">
                  <div className="mb-2">
                    <span className="text-sm font-medium bg-orange-500 px-3 py-1 rounded-full">
                      {carouselImages[currentSlide]?.edition || "NEW ARRIVAL"}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-bold mb-2 font-display">
                    {carouselImages[currentSlide]?.title || "PREMIUM"}
                  </h2>
                  <h3 className="text-2xl lg:text-4xl font-semibold mb-4 font-modern">
                    {carouselImages[currentSlide]?.subtitle || "COLLECTION"}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-orange-400">
                      {carouselImages[currentSlide]?.price || "$299.99"}
                    </span>
                    <span className="text-lg text-orange-300">
                      {carouselImages[currentSlide]?.discount || "SALE UP TO 40% OFF"}
                    </span>
                  </div>
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
                    onClick={() => {
                      const currentImage = carouselImages[currentSlide]
                      if (currentImage?.link) {
                        window.open(currentImage.link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    {carouselImages[currentSlide]?.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Banners */}
          <div className="flex flex-col gap-3 h-96 lg:h-[500px]">
            {/* Image 1 */}
            <div 
              className="relative w-full h-1/2 overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                if (bannerImages.heroData?.smallImage1Link) {
                  window.open(bannerImages.heroData.smallImage1Link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {bannerImages.smallImage1 ? (
                <Image
                  src={bannerImages.smallImage1}
                  alt="Bedroom Collection"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Image 2 */}
            <div 
              className="relative w-full h-1/2 overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                if (bannerImages.heroData?.smallImage2Link) {
                  window.open(bannerImages.heroData.smallImage2Link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {bannerImages.smallImage2 ? (
                <Image
                  src={bannerImages.smallImage2}
                  alt="Living Room"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Four Parallel Images Section */}
      <section className="relative w-full bg-white py-6">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Image 1 */}
            <div 
              className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                const link = content.image_cards?.[0]?.buttonLink
                if (link) {
                  window.open(link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {content.image_cards?.[0]?.image ? (
                <Image
                  src={content.image_cards?.[0]?.image}
                  alt="Sofa Collection"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="text-white p-4 w-full">
                  <h3 className="text-lg font-bold mb-2 font-display">
                    {content.image_cards?.[0]?.heading || "Sofa Collection"}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 font-modern">
                    {content.image_cards?.[0]?.text || "Premium comfort for your living space"}
                  </p>
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = content.image_cards?.[0]?.buttonLink
                      if (link) {
                        window.open(link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    {content.image_cards?.[0]?.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div 
              className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                const link = content.image_cards?.[1]?.buttonLink
                if (link) {
                  window.open(link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {content.image_cards?.[1]?.image ? (
                <Image
                  src={content.image_cards?.[1]?.image}
                  alt="Bed Collection"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="text-white p-4 w-full">
                  <h3 className="text-lg font-bold mb-2 font-display">
                    {content.image_cards?.[1]?.heading || "Bed Collection"}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 font-modern">
                    {content.image_cards?.[1]?.text || "Elegant designs for peaceful sleep"}
                  </p>
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = content.image_cards?.[1]?.buttonLink
                      if (link) {
                        window.open(link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    {content.image_cards?.[1]?.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Image 3 */}
            <div 
              className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                const link = content.image_cards?.[2]?.buttonLink
                if (link) {
                  window.open(link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {content.image_cards?.[2]?.image ? (
                <Image
                  src={content.image_cards?.[2]?.image}
                  alt="Mattress Collection"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="text-white p-4 w-full">
                  <h3 className="text-lg font-bold mb-2 font-display">
                    {content.image_cards?.[2]?.heading || "Mattress Collection"}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 font-modern">
                    {content.image_cards?.[2]?.text || "Ultimate comfort and support"}
                  </p>
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = content.image_cards?.[2]?.buttonLink
                      if (link) {
                        window.open(link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    {content.image_cards?.[2]?.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Image 4 */}
            <div 
              className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => {
                const link = content.image_cards?.[3]?.buttonLink
                if (link) {
                  window.open(link, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              {content.image_cards?.[3]?.image ? (
                <Image
                  src={content.image_cards?.[3]?.image}
                  alt="Accessories Collection"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-pulse"></div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="text-white p-4 w-full">
                  <h3 className="text-lg font-bold mb-2 font-display">
                    {content.image_cards?.[3]?.heading || "Accessories Collection"}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 font-modern">
                    {content.image_cards?.[3]?.text || "Complete your perfect setup"}
                  </p>
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = content.image_cards?.[3]?.buttonLink
                      if (link) {
                        window.open(link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    {content.image_cards?.[3]?.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pick of the Bunch Section */}
      <section className="relative w-full bg-white pt-16 pb-4">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Title and Tagline */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-black font-display">Sleep Luxury, Every Night</h2>
              <p className="text-lg text-gray-700 font-modern">Discover our most-loved collections</p>
            </div>

            {/* Right Side - Navigation Buttons and Arrows */}
            <div className="flex items-center gap-3">
              {/* Special Mattresses Button */}
              <button 
                onClick={() => handleCategoryClick('mattresses')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'mattresses' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Mattresses
              </button>

              {/* Other Category Buttons */}
              <button 
                onClick={() => handleCategoryClick('beds')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'beds' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Beds
              </button>
              <button 
                onClick={() => handleCategoryClick('sofas')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'sofas' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Sofas
              </button>
              <button 
                onClick={() => handleCategoryClick('pillows')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'pillows' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Pillows
              </button>
              <button 
                onClick={() => handleCategoryClick('toppers')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'toppers' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Toppers
              </button>
              <button 
                onClick={() => handleCategoryClick('bunkbeds')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'bunkbeds'
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Bunkbeds
              </button>
              <button 
                onClick={() => handleCategoryClick('kids')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 font-modern ${
                  selectedCategory === 'kids' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                Kids
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
