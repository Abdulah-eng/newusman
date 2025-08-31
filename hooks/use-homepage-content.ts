import { useState, useEffect, useMemo } from 'react'
import { imageCache, cacheManager } from '@/lib/utils'

interface HomePageContent {
  hero?: {
    smallImage1: string
    smallImage2: string
    slidingImages: string[]
  }
  image_cards?: Array<{
    id: string
    image: string
    heading: string
    text: string
    buttonText: string
    buttonLink: string
  }>
  quiz?: {
    image: string
    heading: string
    paragraph: string
  }
  deal_of_day?: {
    productIds: string[]
    description: string
    percentageOff: string
    productCards?: Array<{
      productId: string
      description: string
      percentageOff: string
    }>
  }
  mattresses?: {
    productIds: string[]
    description: string
    mattressCards?: Array<{
      productId: string
      featureToShow: string
    }>
  }
  bedroom_inspiration?: {
    productIds: string[]
    description: string
    productCards?: Array<{
      productId: string
      featureToShow: string
    }>
  }
  sofa_types?: Array<{
    id: string
    sofaId: string
    description: string
    featureToShow: string
  }>
  ideas_guides?: Array<{
    id: string
    image: string
    heading: string
    description: string
    timeToRead: string
  }>
}

// Cache configuration
const CACHE_KEY = 'homepage_content_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export function useHomePageContent() {
  const [content, setContent] = useState<HomePageContent>(() => {
    // Immediately check cache on component mount - no waiting
    if (typeof window !== 'undefined') {
      const cachedData = cacheManager.getImmediate<HomePageContent>(CACHE_KEY)
      if (cachedData) {
        console.log('🚀 Immediate cache hit - showing images instantly')
        return cachedData
      }
    }
    return {}
  })
  
  const [loading, setLoading] = useState(() => {
    // Only show loading if we don't have cached data
    if (typeof window !== 'undefined') {
      return !cacheManager.hasValidCache(CACHE_KEY)
    }
    return true
  })
  
  const [error, setError] = useState<string | null>(null)

  // Load cached data from localStorage
  const loadCachedData = (): HomePageContent | null => {
    return cacheManager.get<HomePageContent>(CACHE_KEY)
  }

  // Save data to localStorage cache
  const saveToCache = (data: HomePageContent) => {
    cacheManager.set(CACHE_KEY, data, CACHE_DURATION)
  }

  // Preload banner images for faster display
  const preloadImages = (imageUrls: string[]) => {
    imageCache.preloadMultiple(imageUrls)
  }

  useEffect(() => {
    // If we already have content from cache, don't fetch again
    if (Object.keys(content).length > 0 && !loading) {
      return
    }

    const fetchContent = async () => {
      try {
        setLoading(true)
        
        // First, try to load from cache
        const cachedData = loadCachedData()
        if (cachedData) {
          setContent(cachedData)
          setLoading(false)
          
          // Preload banner images from cache
          if (cachedData.hero?.slidingImages) {
            preloadImages(cachedData.hero.slidingImages)
          }
          if (cachedData.hero?.smallImage1) {
            preloadImages([cachedData.hero.smallImage1])
          }
          if (cachedData.hero?.smallImage2) {
            preloadImages([cachedData.hero.smallImage2])
          }
          
          // Fetch fresh data in background for next time
          fetchFreshData()
          return
        }
        
        // If no cache, fetch fresh data
        await fetchFreshData()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching homepage content:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchFreshData = async () => {
      try {
        const response = await fetch('/api/homepage-content')
        
        if (!response.ok) {
          throw new Error('Failed to fetch homepage content')
        }
        
        const data = await response.json()
        console.log('🔍 useHomePageContent - Raw API response:', data)
        console.log('🔍 useHomePageContent - Mattresses section:', data.mattresses)
        
        setContent(data)
        saveToCache(data)
        
        // Preload banner images
        if (data.hero?.slidingImages) {
          preloadImages(data.hero.slidingImages)
        }
        if (data.hero?.smallImage1) {
          preloadImages([data.hero.smallImage1])
        }
        if (data.hero?.smallImage2) {
          preloadImages([data.hero.smallImage2])
        }
      } catch (err) {
        console.error('Error fetching fresh data:', err)
      }
    }

    fetchContent()
  }, [])

  // Memoized banner images for instant access
  const bannerImages = useMemo(() => {
    const images = {
      carousel: content.hero?.slidingImages?.filter(img => img) || [],
      smallImage1: content.hero?.smallImage1 || '',
      smallImage2: content.hero?.smallImage2 || ''
    }
    
    // Preload images when they change
    if (images.carousel.length > 0) {
      preloadImages(images.carousel)
    }
    if (images.smallImage1) {
      preloadImages([images.smallImage1])
    }
    if (images.smallImage2) {
      preloadImages([images.smallImage2])
    }
    
    return images
  }, [content.hero])

  return { 
    content, 
    loading, 
    error, 
    bannerImages,
    // Force refresh function for admin use
    refreshCache: () => {
      cacheManager.clear(CACHE_KEY)
      window.location.reload()
    }
  }
}
