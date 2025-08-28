import { useState, useEffect } from 'react'

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

export function useHomePageContent() {
  const [content, setContent] = useState<HomePageContent>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/homepage-content')
        
        if (!response.ok) {
          throw new Error('Failed to fetch homepage content')
        }
        
        const data = await response.json()
        console.log('🔍 useHomePageContent - Raw API response:', data)
        console.log('🔍 useHomePageContent - Mattresses section:', data.mattresses)
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

  return { content, loading, error }
}
