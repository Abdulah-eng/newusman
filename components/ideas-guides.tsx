"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, BookOpen, Lightbulb, TrendingUp, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useHomePageContent } from "@/hooks/use-homepage-content"

export function IdeasGuides() {
  const { content, loading, error } = useHomePageContent()
  const [guides, setGuides] = useState<any[]>([])

  // Transform database content to match component structure
  useEffect(() => {
    if (content.ideas_guides?.length > 0) {
      const transformedGuides = content.ideas_guides.map((guide: any, index: number) => {
        // Map database fields to component fields
        return {
          id: guide.id || index + 1,
          category: "Expert Advice", // Default category
          title: guide.heading || `Guide ${index + 1}`,
          description: guide.description || "Comprehensive guide with expert advice and tips.",
          readTime: guide.timeToRead || "5 min read",
          image: guide.image || "/placeholder.jpg",
          icon: <Lightbulb className="w-5 h-5" />, // Default icon
          featured: index === 0, // First guide is featured
          href: `/guides` // All guides go to main guides page
        }
      })
      setGuides(transformedGuides)
    } else {
      // Fallback to hardcoded data if no database content
      setGuides([
        {
          id: 1,
          category: "Expert Advice",
          title: "Find Your Perfect Mattress in 5 Minutes",
          description: "Our comprehensive guide helps you choose the ideal mattress based on your sleep style, body type, and comfort preferences.",
          readTime: "5 min read",
          image: "/hello.jpeg",
          icon: <Lightbulb className="w-5 h-5" />,
          featured: true,
          href: "/mattress-finder"
        },
        {
          id: 2,
          category: "Health & Wellness",
          title: "Best Mattresses for Back Pain Relief",
          description: "Discover how the right mattress can transform your sleep and alleviate chronic back pain for better health.",
          readTime: "6 min read",
          image: "/hell.jpeg",
          icon: <TrendingUp className="w-5 h-5" />,
          featured: false,
          href: "/mattresses"
        },
        {
          id: 3,
          category: "Buying Guide",
          title: "Complete Duvet & Bedding Guide",
          description: "Everything you need to know about choosing the perfect duvet, pillows, and bedding for ultimate comfort.",
          readTime: "8 min read",
          image: "/hi.jpeg",
          icon: <BookOpen className="w-5 h-5" />,
          featured: false,
          href: "/guides"
        },
        {
          id: 4,
          category: "Size Guide",
          title: "Bed & Mattress Size Chart",
          description: "Master the art of choosing the right bed size for your room and lifestyle with our detailed size guide.",
          readTime: "4 min read",
          image: "/sofa.jpeg",
          icon: <Star className="w-5 h-5" />,
          featured: false,
          href: "/guides"
        }
      ])
    }
  }, [content.ideas_guides])

  // Loading state
  if (loading) {
    return (
      <section className="w-full bg-white py-16 md:py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display">
              Ideas & Guides
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern">
              Loading guides...
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="w-full bg-white py-16 md:py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display">
              Ideas & Guides
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern">
              Error loading guides. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white py-16 md:py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-100/40 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-100/40 to-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display">
            Ideas & Guides
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern">
            Expert advice, comprehensive buying guides, and inspirational ideas to help you create the perfect sleep sanctuary
          </p>
        </div>

        {/* Featured Guide */}
        <div className="mb-12">
          {guides.filter(guide => guide.featured).map(guide => (
            <Link key={guide.id} href={guide.href} className="group block">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-80 lg:h-full overflow-hidden">
                    <Image 
                      src={guide.image} 
                      alt={guide.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-black font-modern">
                        {guide.icon}
                        {guide.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-6">
                      <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 font-display">
                        {guide.title}
                      </h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6 font-modern">
                        {guide.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium font-modern">{guide.readTime}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full font-semibold group-hover:from-orange-500 group-hover:to-red-600 transition-all duration-300 shadow-lg">
                        Read Guide
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Other Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.filter(guide => !guide.featured).map(guide => (
            <Link key={guide.id} href={guide.href} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={guide.image} 
                    alt={guide.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.jpg"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-semibold text-black font-modern">
                      {guide.icon}
                      {guide.category}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-black mb-3 line-clamp-2 font-display">
                      {guide.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 font-modern">
                      {guide.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium font-modern">{guide.readTime}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-black font-semibold text-sm group-hover:text-orange-600 transition-colors font-modern">
                      Read More
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/guides">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <Star className="w-5 h-5" />
              Explore All Guides
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}


