"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, ArrowRight, Heart, X } from 'lucide-react'
import Image from 'next/image'

interface Guide {
  id: string
  heading: string
  image: string
  description: string
  timeToRead: string
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true)
        console.log('🔍 Guides Page: Fetching ideas & guides from homepage content')
        
        const response = await fetch('/api/homepage-content')
        if (!response.ok) {
          throw new Error('Failed to fetch homepage content')
        }
        
        const data = await response.json()
        console.log('🔍 Guides Page: Homepage content data:', data)
        
        // The API returns an object with section names as keys, not an array
        console.log('🔍 Guides Page: API response structure:', data)
        
        if (data && data.ideas_guides) {
          console.log('🔍 Guides Page: Found ideas_guides section:', data.ideas_guides)
          
          // Ensure ideas_guides is an array
          if (Array.isArray(data.ideas_guides)) {
            setGuides(data.ideas_guides)
          } else {
            console.warn('🔍 Guides Page: ideas_guides is not an array:', typeof data.ideas_guides)
            setGuides([])
          }
        } else {
          console.log('🔍 Guides Page: No ideas_guides section found, using empty array')
          console.log('🔍 Guides Page: Available sections:', Object.keys(data || {}))
          setGuides([])
        }
      } catch (error) {
        console.error('Error fetching guides:', error)
        setGuides([])
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeGuideModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset' // Restore scrolling
    }
  }, [isModalOpen])

  const openGuideModal = (guide: Guide) => {
    setSelectedGuide(guide)
    setIsModalOpen(true)
  }

  const closeGuideModal = () => {
    setIsModalOpen(false)
    setSelectedGuide(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-black mb-4 font-display">Sleep & Furniture Guides</h1>
          <p className="text-lg text-gray-700 font-modern">
            Expert advice and comprehensive guides to help you make informed decisions about your sleep setup, 
            furniture selection, and home design. From beginners to experts, we have the knowledge you need.
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-4 py-8">
        {guides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No guides available at the moment.
            </div>
            <p className="text-gray-400">
              Check back soon for expert advice and comprehensive guides!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={guide.image}
                      alt={guide.heading}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-black mb-2 text-lg font-display line-clamp-2">
                        {guide.heading}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed font-modern line-clamp-3">
                        {guide.description}
                      </p>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-modern">{guide.timeToRead}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                        onClick={() => openGuideModal(guide)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Guide
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Guide Modal */}
      {isModalOpen && selectedGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeGuideModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">{selectedGuide.timeToRead}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGuideModal}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Guide Image */}
              <div className="mb-6">
                <Image
                  src={selectedGuide.image}
                  alt={selectedGuide.heading}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Guide Title */}
              <h2 className="text-3xl font-bold text-black mb-4 font-display">
                {selectedGuide.heading}
              </h2>

              {/* Guide Description */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed font-modern mb-6">
                  {selectedGuide.description}
                </p>
                
                {/* Extended content - you can expand this based on your needs */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-black mb-3 font-display">
                    What You'll Learn
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-modern">
                    This comprehensive guide will walk you through everything you need to know about {selectedGuide.heading.toLowerCase()}. 
                    From basic concepts to advanced techniques, you'll gain the knowledge and confidence to make informed decisions.
                  </p>
                </div>

                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-black mb-3 font-display">
                    Key Takeaways
                  </h3>
                  <ul className="text-gray-700 leading-relaxed font-modern space-y-2">
                    <li>• Expert insights and professional recommendations</li>
                    <li>• Step-by-step guidance for optimal results</li>
                    <li>• Common mistakes to avoid</li>
                    <li>• Tips for long-term success</li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t flex justify-end">
                <Button
                  variant="outline"
                  onClick={closeGuideModal}
                  className="mr-3"
                >
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Save Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
