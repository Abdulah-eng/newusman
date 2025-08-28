"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHomePageContent } from '@/hooks/use-homepage-content'

interface MattressProduct {
  id: string
  name: string
  image: string
  current_price: number
  original_price: number
}

export function OurMattressesSection() {
  const { content, loading: contentLoading } = useHomePageContent()
  const [mattressProducts, setMattressProducts] = useState<MattressProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMattressProducts = async () => {
      if (!content.mattresses?.productIds || content.mattresses.productIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch mattress products by IDs
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, 
            name,
            categories(name)
          `)
          .in('id', content.mattresses.productIds)

        if (error) {
          console.error('Error fetching mattress products:', error)
          return
        }

        // Transform products to match the expected structure
        const transformedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          image: '/placeholder.jpg', // Placeholder since your schema doesn't have image
          current_price: 0, // Placeholder since your schema doesn't have price
          original_price: 0
        })) || []

        setMattressProducts(transformedProducts)
      } catch (error) {
        console.error('Error fetching mattress products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMattressProducts()
  }, [content.mattresses])

  if (contentLoading || loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mattresses</h2>
            <p className="text-gray-600 mb-8">Loading mattresses...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!content.mattresses?.productIds || content.mattresses.productIds.length === 0) {
    return null // Don't show section if no mattresses configured
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mattresses</h2>
          {content.mattresses.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{content.mattresses.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mattressProducts.map((mattress) => (
            <Card key={mattress.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={mattress.image}
                  alt={mattress.name}
                  className="w-full h-48 object-cover"
                />
                {/* Feature badge - you can customize this based on your needs */}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Premium Quality
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{mattress.name}</h3>
                
                {/* Feature display */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Memory Foam Technology</span>
                </div>
                
                {/* Description - you can add this to your database schema if needed */}
                <p className="text-gray-600 mb-4">
                  Experience ultimate comfort with our premium mattress designed for restful sleep.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-500">
                      £{mattress.current_price.toFixed(2)}
                    </span>
                    {mattress.original_price > mattress.current_price && (
                      <span className="text-gray-400 line-through">
                        £{mattress.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
