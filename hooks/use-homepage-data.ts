import { useState, useEffect } from 'react'

interface HomepageData {
  content: any
  featuredProducts: any[]
  trendingProducts: any[]
  dealProducts: any[]
  loading: boolean
  error: string | null
}

export function useHomepageData(selectedCategory: string = 'Silentnight mattresses') {
  const [data, setData] = useState<HomepageData>({
    content: {},
    featuredProducts: [],
    trendingProducts: [],
    dealProducts: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch all data in parallel
        const [contentResponse, featuredResponse, trendingResponse] = await Promise.allSettled([
          fetch('/api/homepage-content'),
          fetch(`/api/products/category/mattresses?limit=4`),
          fetch('/api/products?limit=4&random=true')
        ])

        const newData: Partial<HomepageData> = {
          loading: false
        }

        // Process content data
        if (contentResponse.status === 'fulfilled' && contentResponse.value.ok) {
          const contentData = await contentResponse.value.json()
          newData.content = contentData

          // If we have deal products, fetch them
          if (contentData.deal_of_day?.productCards?.length > 0) {
            try {
              const productIds = contentData.deal_of_day.productCards
                .map((card: any) => card.productId)
                .filter(Boolean)

              if (productIds.length > 0) {
                const dealResponse = await fetch('/api/products/bulk', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productIds })
                })

                if (dealResponse.ok) {
                  const dealData = await dealResponse.json()
                  newData.dealProducts = dealData.products || []
                }
              }
            } catch (error) {
              console.error('Error fetching deal products:', error)
            }
          }
        }

        // Process featured products
        if (featuredResponse.status === 'fulfilled' && featuredResponse.value.ok) {
          const featuredData = await featuredResponse.value.json()
          newData.featuredProducts = featuredData.products || []
        }

        // Process trending products
        if (trendingResponse.status === 'fulfilled' && trendingResponse.value.ok) {
          const trendingData = await trendingResponse.value.json()
          newData.trendingProducts = trendingData.products || []
        }

        setData(prev => ({ ...prev, ...newData }))

      } catch (error) {
        console.error('Error fetching homepage data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load data'
        }))
      }
    }

    fetchAllData()
  }, [selectedCategory])

  return data
}
