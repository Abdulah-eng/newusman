import { useState, useEffect, useMemo } from 'react'

interface HomePageContent {
  hero?: {
    smallImage1: string
    smallImage1Link: string
    smallImage2: string
    smallImage2Link: string
    slidingImages: string[]
    slidingImagesData: Array<{
      image: string
      link: string
      badge: string
      heading: string
      description: string
      price: string
      discount: string
      buttonText: string
    }>
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
      customImage?: string
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

export function useHomePageContent() {
  const [content, setContent] = useState<HomePageContent>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Always fetch fresh data from database
        const response = await fetch('/api/homepage-content')
        
        if (!response.ok) {
          throw new Error('Failed to fetch homepage content')
        }
        
        const data = await response.json()
        setContent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching homepage content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Memoized banner images for instant access
  const bannerImages = useMemo(() => {
    return {
      carousel: content.hero?.slidingImagesData?.map(data => data.image).filter(img => img) || content.hero?.slidingImages?.filter(img => img) || [],
      smallImage1: content.hero?.smallImage1 || '',
      smallImage2: content.hero?.smallImage2 || '',
      // Include the full data for text overlays and links
      heroData: content.hero
    }
  }, [content.hero])

  return { 
    content, 
    loading, 
    error, 
    bannerImages
  }
}
