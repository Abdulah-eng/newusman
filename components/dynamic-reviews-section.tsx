"use client"

import { useState, useEffect } from 'react'
import { Star, CheckCircle, ThumbsUp, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReviewFormModal } from './review-form-modal'
import { hardcodedReviews, HardcodedReview } from '@/lib/hardcoded-reviews'

interface Review {
  id: string
  product_id: string
  product_name: string
  rating: number
  title: string
  review_text: string
  customer_name: string
  email?: string
  verified: boolean
  helpful_count: number
  created_at: string
}

interface DynamicReviewsSectionProps {
  productId: string
  productName: string
  productRating?: number
  productReviewCount?: number
}

export function DynamicReviewsSection({ 
  productId, 
  productName, 
  productRating = 4.0, 
  productReviewCount = 0 
}: DynamicReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [allReviews, setAllReviews] = useState<(Review | HardcodedReview)[]>([])
  const [loading, setLoading] = useState(true)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [averageRating, setAverageRating] = useState(productRating)
  const [totalReviews, setTotalReviews] = useState(productReviewCount)
  const [helpfulLoading, setHelpfulLoading] = useState<Set<string>>(new Set())

  const fetchReviews = async () => {
    try {
      setLoading(true)
      console.log('Fetching reviews for productId:', productId)
      
      if (!productId) {
        console.warn('No productId provided, skipping review fetch')
        setReviews([])
        return
      }
      
      const response = await fetch(`/api/reviews?product_id=${productId}&limit=6`)
      console.log('Reviews API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Reviews data received:', data)
        const databaseReviews = data.reviews || []
        setReviews(databaseReviews)
        
        // Combine database reviews with hardcoded reviews
        const combinedReviews = [...databaseReviews, ...hardcodedReviews]
        setAllReviews(combinedReviews)
        
        // Calculate average rating from all reviews
        if (combinedReviews.length > 0) {
          const avg = combinedReviews.reduce((sum: number, review: Review | HardcodedReview) => sum + review.rating, 0) / combinedReviews.length
          setAverageRating(avg)
          setTotalReviews(combinedReviews.length)
        }
      } else {
        const errorText = await response.text()
        console.error('Reviews API error:', response.status, errorText)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Even if database fails, show hardcoded reviews
      setAllReviews(hardcodedReviews)
      setTotalReviews(hardcodedReviews.length)
      const avg = hardcodedReviews.reduce((sum, review) => sum + review.rating, 0) / hardcodedReviews.length
      setAverageRating(avg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleHelpfulClick = async (reviewId: string, currentCount: number) => {
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
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId 
              ? { ...review, helpful_count: data.helpful_count }
              : review
          )
        )
        
        console.log('Helpful count updated:', data.helpful_count)
      } else {
        const error = await response.json()
        console.error('Error updating helpful count:', error)
        // You could add a toast notification here
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

  const handleReviewSubmitted = () => {
    fetchReviews() // Refresh reviews after submission
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.ceil(diffDays / 365)} year${Math.ceil(diffDays / 365) > 1 ? 's' : ''} ago`
  }

  const getInitials = (name: string) => {
    // Handle null/undefined names
    if (!name || typeof name !== 'string') {
      return 'U' // Default initial
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-orange-400 to-pink-400',
      'from-blue-400 to-purple-400',
      'from-green-400 to-teal-400',
      'from-pink-400 to-red-400',
      'from-yellow-400 to-orange-400',
      'from-indigo-400 to-blue-400',
      'from-purple-400 to-pink-400',
      'from-teal-400 to-green-400'
    ]
    // Handle null/undefined names
    if (!name || typeof name !== 'string') {
      return colors[0] // Default color
    }
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <div className="mt-10 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mt-10 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(averageRating) ? "text-orange-500 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-sm sm:text-base text-gray-600">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Real customers share their experience with the {productName}</p>
        </div>

        {/* Review Grid */}
        {allReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allReviews.map((review) => (
              <Card key={review.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br ${getAvatarColor('customer_name' in review ? review.customer_name : review.customerName)} flex items-center justify-center`}>
                      <span className="text-white font-semibold text-base sm:text-lg">
                        {getInitials('customer_name' in review ? review.customer_name : review.customerName)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{'customer_name' in review ? review.customer_name : review.customerName}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < review.rating ? "text-orange-500 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{review.title}</h5>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-3">
                    {'review_text' in review ? review.review_text : review.review}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span>
                      {'created_at' in review ? formatDate(review.created_at) : review.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleHelpfulClick(review.id, 'helpful_count' in review ? review.helpful_count : review.helpful)}
                        disabled={helpfulLoading.has(review.id)}
                        className="text-gray-500 hover:text-orange-600 h-6 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {helpfulLoading.has(review.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600 mr-1" />
                        ) : (
                          <ThumbsUp className="w-3 h-3 mr-1" />
                        )}
                        {'helpful_count' in review ? review.helpful_count : review.helpful}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your experience with this product!</p>
            <Button 
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Write the First Review
            </Button>
          </div>
        )}

        {/* Review Stats */}
        {reviews.length > 0 && (
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{averageRating.toFixed(1)}/5</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{totalReviews}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                {reviews.length > 0 ? Math.max(...reviews.map(r => r.rating)) : 5}★
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Most Common</div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Button 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </Button>
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={productId}
        productName={productName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  )
}
