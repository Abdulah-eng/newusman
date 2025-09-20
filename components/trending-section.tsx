"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { ArrowRight, TrendingUp, Sparkles, Clock, Star, Circle, Layers, Zap, Ruler, Truck, Leaf, Recycle, Feather, Snowflake, Sprout, Brain, PackageOpen, Mountain, Droplet, Umbrella, Scroll, ArrowLeftRight, SlidersHorizontal, Grid, Gem, Waves } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"

type TrendingItem = {
  id: string
  title: string
  subtitle?: string
  image: string
  href: string
  category?: string
  read_time?: string
  badge?: string
  rating?: number
  price?: number
  original_price?: number
  discount_label?: string
  features?: string[]
  reviewCount?: number
  freeDelivery?: string
}

export function TrendingSection() {
  const [items, setItems] = useState<TrendingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setIsLoading(true)
        
        // Fetch 4 random products from the database with caching
        const response = await fetch('/api/products?limit=4&random=true', {
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        if (response.ok) {
          const data = await response.json()
          const products = data.products || []
          
          // Transform products to match TrendingItem interface
          const transformedItems = products.map((product: any) => ({
            id: product.id,
            title: product.name || 'Premium Product',
            subtitle: product.long_description || product.headline || 'Discover amazing comfort and quality',
            image: product.images?.[0] || product.image || '/placeholder.jpg',
            href: `/products/${product.category || 'mattresses'}/${product.id}`,
            category: product.categories?.name || 'Premium',
            read_time: '5 min read',
            badge: 'Trending',
            rating: product.rating || 4.5,
            price: product.currentPrice || product.current_price || 599,
            original_price: product.originalPrice || product.original_price || 799,
            discount_label: product.originalPrice && product.currentPrice ? 
              `${Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}% OFF` : 
              '25% OFF',
            features: product.features || ['Premium Quality', 'Comfort', 'Durability', 'Innovation'],
            reviewCount: 150, // Fixed review count to prevent hydration mismatch
            freeDelivery: 'Tomorrow'
          }))
          
          setItems(transformedItems)
        } else {
          console.error('Failed to fetch trending products')
          setItems([])
        }
      } catch (error) {
        console.error('Error fetching trending products:', error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingProducts()
  }, [])

  // Fallback data if API doesn't return items
  const fallbackItems: TrendingItem[] = [
    {
      id: '1',
      title: "Memory Foam Revolution",
      subtitle: "Discover the latest in sleep technology with advanced cooling and pressure relief",
      image: "/cascade-main.jpg",
      href: "/mattresses",
      category: "Technology",
      read_time: "5 min read",
      badge: "Trending",
      rating: 4.8,
      price: 599,
      original_price: 799,
      discount_label: "25% OFF",
      features: ["Memory Foam", "Temperature Regulation", "Motion Isolation", "Pressure Relief"],
      reviewCount: 156,
      freeDelivery: "Tomorrow"
    },
    {
      id: '2',
      title: "Hybrid Comfort",
      subtitle: "The perfect blend of support and softness for ultimate sleep experience",
      image: "/cascade-features.jpg",
      href: "/mattresses",
      category: "Comfort",
      read_time: "3 min read",
      badge: "Popular",
      rating: 4.9,
      price: 699,
      original_price: 899,
      discount_label: "22% OFF",
      features: ["Hybrid Technology", "Pocket Springs", "Memory Foam", "Edge Support"],
      reviewCount: 203,
      freeDelivery: "Tomorrow"
    },
    {
      id: '3',
      title: "Smart Sleep Technology",
      subtitle: "AI-powered sleep tracking and personalized comfort recommendations",
      image: "/cascade-height.jpg",
      href: "/mattresses",
      category: "Innovation",
      read_time: "4 min read",
      badge: "New",
      rating: 4.7,
      price: 899,
      original_price: 1099,
      discount_label: "18% OFF",
      features: ["AI Technology", "Sleep Tracking", "Smart Controls", "Personalization"],
      reviewCount: 89,
      freeDelivery: "Tomorrow"
    },
    {
      id: '4',
      title: "Eco-Friendly Sleep",
      subtitle: "Sustainable materials and organic comfort for conscious consumers",
      image: "/cascade-sleepers.jpg",
      href: "/mattresses",
      category: "Sustainability",
      read_time: "6 min read",
      badge: "Eco",
      rating: 4.6,
      price: 749,
      original_price: 899,
      discount_label: "17% OFF",
      features: ["Organic Materials", "Sustainable", "Eco-Friendly", "Natural Comfort"],
      reviewCount: 134,
      freeDelivery: "Tomorrow"
    }
  ]

  const displayItems = items.length > 0 ? items : fallbackItems

  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, Math.min(5, rating))
    const fullStars = Math.floor(safeRating)
    const hasHalfStar = safeRating % 1 !== 0
    
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
      } else if (i === fullStars && hasHalfStar) {
        return <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
      } else {
        return <Star key={i} className="h-4 w-4 text-gray-300" />
      }
    })
  }

  const getFeatureIcon = (feature: string) => {
    const f = feature.toLowerCase()
    if (f.includes('latex')) return <Leaf className="h-4 w-4 text-gray-700" />
    if (f.includes('eco friendly') || f.includes('eco-friendly') || f.includes('organic')) return <Recycle className="h-4 w-4 text-gray-700" />
    if (f.includes('fiber')) return <Feather className="h-4 w-4 text-gray-700" />
    if (f.includes('foam flakes') || f.includes('flakes')) return <Snowflake className="h-4 w-4 text-gray-700" />
    if (f.includes('eco foam')) return <Sprout className="h-4 w-4 text-gray-700" />
    if (f.includes('memory latex')) return <Brain className="h-4 w-4 text-gray-700" />
    if (f.includes('removable zip') || f.includes('zip cover')) return <PackageOpen className="h-4 w-4 text-gray-700" />
    if (f.includes('removable cover')) return <Scroll className="h-4 w-4 text-gray-700" />
    if (f.includes('waterproof')) return <Umbrella className="h-4 w-4 text-gray-700" />
    if (f.includes('rolled')) return <Scroll className="h-4 w-4 text-gray-700" />
    if (f.includes('double side') || f.includes('double-sided') || f.includes('double side')) return <ArrowLeftRight className="h-4 w-4 text-gray-700" />
    if (f.includes('washable')) return <Waves className="h-4 w-4 text-gray-700" />
    if (f.includes('hard rock') || f.includes('super firm') || f.includes('brick hard') || f.includes('hard foam')) return <Mountain className="h-4 w-4 text-gray-700" />
    if (f.includes('recon')) return <Layers className="h-4 w-4 text-gray-700" />
    if (f.includes('blue foam')) return <Droplet className="h-4 w-4 text-gray-700" />
    if (f.includes('cool blue') || f.includes('temperature') || f.includes('cooling')) return <Snowflake className="h-4 w-4 text-gray-700" />
    if (f.includes('reflex')) return <ArrowLeftRight className="h-4 w-4 text-gray-700" />
    if (f.includes('high density')) return <Layers className="h-4 w-4 text-gray-700" />
    if (f.includes('3-zone') || f.includes('5-zone') || f.includes('7-zone') || f.includes('8-zone') || f.includes('zone support')) return <Grid className="h-4 w-4 text-gray-700" />
    if (f.includes('marble gel')) return <Gem className="h-4 w-4 text-gray-700" />
    if (f.includes('geltech') || f.includes('gel infused') || f.includes('gel-infused') || f.includes('gel ')) return <Droplet className="h-4 w-4 text-gray-700" />
    if (f.includes('firm') || f.includes('medium')) return <SlidersHorizontal className="h-4 w-4 text-gray-700" />
    if (f.includes('spring') || f.includes('pocket') || f.includes('coil')) return <Zap className="h-4 w-4 text-gray-700" />
    if (f.includes('memory') || f.includes('foam')) return <Layers className="h-4 w-4 text-gray-700" />
    if (f.includes('depth') || f.includes('cm') || f.includes('inch') || f.includes('height')) return <Ruler className="h-4 w-4 text-gray-700" />
    if (f.includes('ai') || f.includes('smart')) return <Zap className="h-4 w-4 text-gray-700" />
    return <Circle className="h-4 w-4 text-gray-700" />
  }

  if (isLoading) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 via-white to-orange-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-white to-orange-50 py-16 md:py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-float animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-100" />
            <span className="text-xs sm:text-sm font-semibold">TRENDING NOW</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight px-4 font-display">
            Wake Up to What's{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              Trending
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 font-modern">
            Zzz-worthy topics too hot to snooze. Discover the latest innovations in sleep technology and comfort.
          </p>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {displayItems.map((item, index) => {
            // Transform trending item to product format for ProductCard
            const product = {
              id: item.id || `trending-${index}`,
              name: item.title,
              image: item.image,
              images: [item.image],
              currentPrice: item.price,
              originalPrice: item.original_price || item.originalPrice,
              rating: item.rating || 4.5,
              reviewCount: item.reviewCount || 100,
              features: item.features || ['Premium Quality', 'Comfort', 'Durability'],
              badges: item.badges || [],
              href: item.href,
              category: 'trending'
            }
            
            return (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


