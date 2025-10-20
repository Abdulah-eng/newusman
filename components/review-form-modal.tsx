"use client"

import { useState } from 'react'
import { Star, X, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  onReviewSubmitted?: () => void
}

export function ReviewFormModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  onReviewSubmitted 
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    
    if (!title.trim() || !reviewText.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
          rating,
          title: title.trim(),
          review_text: reviewText.trim(),
          customer_name: customerName.trim() || 'Anonymous',
          email: email.trim() || null,
          verified: false
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form
        setRating(0)
        setTitle('')
        setReviewText('')
        setCustomerName('')
        setEmail('')
        
        // Call callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted()
        }
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          onClose()
        }, 2000)
      } else {
        const error = await response.json()
        alert(`Failed to submit review: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSubmitted(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {isSubmitted ? 'Review Submitted!' : `Write a Review for ${productName}`}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thank you for your review!
              </h3>
              <p className="text-gray-600">
                Your review has been submitted and will be published after moderation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div>
                <Label className="text-base font-medium text-gray-900">
                  Rating <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-orange-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <Label htmlFor="title" className="text-base font-medium text-gray-900">
                  Review Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience in a few words"
                  className="mt-2"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review" className="text-base font-medium text-gray-900">
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience with this product..."
                  className="mt-2 min-h-[120px]"
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewText.length}/1000 characters
                </p>
              </div>

              {/* Customer Name */}
              <div>
                <Label htmlFor="customerName" className="text-base font-medium text-gray-900">
                  Your Name
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="How would you like to be displayed? (optional)"
                  className="mt-2"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to appear as "Anonymous"
                </p>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com (optional)"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to verify your purchase (optional)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || !title.trim() || !reviewText.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
