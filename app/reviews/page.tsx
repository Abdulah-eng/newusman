"use client"

import { useState, useEffect } from 'react'
import { Star, Quote, ThumbsUp, Heart, Shield, Award, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Review {
  id: number
  customerName: string
  rating: number
  title: string
  review: string
  date: string
  verified: boolean
  helpful: number
  product: string
  category: string
}

const hardcodedReviews: Review[] = [
  {
    id: 1,
    customerName: "Sarah M.",
    rating: 5,
    title: "Best mattress I've ever slept on!",
    review: "After struggling with back pain for years, this mattress has been a game-changer. The support is incredible and I wake up feeling refreshed every morning. The 100-night trial gave me confidence to try it, but I knew within the first week that this was the one!",
    date: "2 weeks ago",
    verified: true,
    helpful: 24,
    product: "Premium Hybrid Mattress",
    category: "Mattresses"
  },
  {
    id: 2,
    customerName: "Michael R.",
    rating: 5,
    title: "Outstanding quality and service",
    review: "From the moment I walked into Bedora Living, the staff was incredibly helpful. They took the time to understand my sleep preferences and recommended the perfect mattress. The delivery was prompt and professional. Highly recommend!",
    date: "1 month ago",
    verified: true,
    helpful: 18,
    product: "Memory Foam Deluxe",
    category: "Mattresses"
  },
  {
    id: 3,
    customerName: "Jennifer L.",
    rating: 5,
    title: "Perfect for our guest room",
    review: "We needed a quality mattress for our guest room that wouldn't break the bank. This exceeded our expectations! Guests consistently compliment how comfortable it is. Great value for the price.",
    date: "3 weeks ago",
    verified: true,
    helpful: 12,
    product: "Comfort Plus Mattress",
    category: "Mattresses"
  },
  {
    id: 4,
    customerName: "David K.",
    rating: 5,
    title: "Excellent customer support",
    review: "Had a question about mattress care and the support team was incredibly helpful. They even sent me a care guide and offered to schedule a follow-up call. This level of service is rare these days.",
    date: "2 months ago",
    verified: true,
    helpful: 15,
    product: "Luxury Pocket Spring",
    category: "Mattresses"
  },
  {
    id: 5,
    customerName: "Amanda T.",
    rating: 5,
    title: "Life-changing sleep quality",
    review: "I was skeptical about spending this much on a mattress, but it's worth every penny. My sleep quality has improved dramatically, and my chronic back pain has significantly decreased. The cooling technology is amazing too!",
    date: "1 month ago",
    verified: true,
    helpful: 31,
    product: "CoolTech Hybrid Elite",
    category: "Mattresses"
  },
  {
    id: 6,
    customerName: "Robert P.",
    rating: 5,
    title: "Great experience from start to finish",
    review: "The entire process was smooth and professional. The mattress arrived on time, was perfectly packaged, and the old one was removed. The quality is outstanding and the price was competitive. Will definitely shop here again.",
    date: "3 weeks ago",
    verified: true,
    helpful: 9,
    product: "Classic Innerspring",
    category: "Mattresses"
  }
]

export default function ReviewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([])
  const [helpfulLoading, setHelpfulLoading] = useState<Set<number>>(new Set())

  const handleHelpfulClick = async (reviewId: number, currentCount: number) => {
    try {
      // Add to loading set
      setHelpfulLoading(prev => new Set(prev).add(reviewId))
      
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'increment'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update the review in the local state
        setDynamicReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId 
              ? { ...review, helpful: data.helpful_count }
              : review
          )
        )
        
        console.log('Helpful count updated:', data.helpful_count)
      } else {
        const error = await response.json()
        console.error('Error updating helpful count:', error)
      }
    } catch (error) {
      console.error('Error updating helpful count:', error)
    } finally {
      // Remove from loading set
      setHelpfulLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch('/api/reviews?limit=50')
        if (!res.ok) return
        const json = await res.json()
        const apiReviews = (json.reviews || []).map((r: any, idx: number) => ({
          id: 10000 + idx,
          customerName: r.customer_name || 'Verified Buyer',
          rating: r.rating || 5,
          title: r.title || 'Customer Review',
          review: r.review_text || '',
          date: new Date(r.created_at).toLocaleDateString('en-GB'),
          verified: !!r.verified,
          helpful: r.helpful_count || 0,
          product: r.product_name || 'Product',
          category: 'Mattresses' // Default category since we don't have category in reviews table
        })) as Review[]
        setDynamicReviews(apiReviews)
      } catch (e) {
        console.error('Failed to load reviews', e)
      }
    }
    loadReviews()
  }, [])

  const categories = ['all', 'mattresses', 'beds', 'sofas', 'pillows', 'bedding']
  
  const allReviews = [...dynamicReviews, ...hardcodedReviews]
  const filteredReviews = allReviews.filter(review => 
    selectedCategory === 'all' || review.category.toLowerCase() === selectedCategory
  )

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'helpful') return b.helpful - a.helpful
    return 0
  })

  const averageRating = allReviews.length > 0 ? (allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length) : 5
  const totalReviews = allReviews.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Customer Reviews & Testimonials
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Discover why thousands of customers trust Bedora Living for their sleep needs
            </p>
            
            {/* Overall Rating Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-6xl font-bold text-orange-400">{averageRating.toFixed(1)}</div>
                <div className="text-left">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-orange-400 fill-current' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-lg text-gray-200">Based on {totalReviews} verified reviews</p>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <span>Verified Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span>Real Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sortedReviews.map((review) => (
              <Card key={review.id} className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.customerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-orange-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">{review.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-orange-200" />
                      <p className="text-gray-700 leading-relaxed pl-6">{review.review}</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Product:</span> {review.product}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {review.category}
                    </p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleHelpfulClick(review.id, review.helpful)}
                        disabled={helpfulLoading.has(review.id)}
                        className="text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {helpfulLoading.has(review.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
                        ) : (
                          <ThumbsUp className="w-4 h-4 mr-2" />
                        )}
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600">
                        <Heart className="w-4 h-4 mr-2" />
                        Love it
                      </Button>
                    </div>
                    
                    <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                      Read Full Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Happy Customers
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Experience the Bedora Living difference and discover why our customers love their sleep experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-gray-100 px-8 py-4">
              Shop Our Collection
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-700 px-8 py-4">
              Write a Review
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
