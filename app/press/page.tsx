import { Suspense } from "react"
import { Search, Clock, User, ArrowRight, Star, BookOpen, Lightbulb, Shield, Truck, RotateCcw, CreditCard, Phone, Mail, MessageCircle, Download, FileText, Newspaper, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press & Media | Bedora Living',
  description: 'Press releases, media kit, company information, and resources for journalists covering Bedora Living.',
}

const quickTips = [
  {
    icon: <Shield className="h-6 w-6 text-orange-500" />,
    title: "14-Night Trial",
    description: "Try your mattress risk-free for 14 nights with our comfort guarantee."
  },
  {
    icon: <Truck className="h-6 w-6 text-orange-500" />,
    title: "Free Delivery",
    description: "Complimentary delivery to your door with professional setup service."
  },
  {
    icon: <RotateCcw className="h-6 w-6 text-orange-500" />,
    title: "Easy Returns",
    description: "Hassle-free returns if you're not completely satisfied with your purchase."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-orange-500" />,
    title: "Flexible Payment",
    description: "Multiple payment options including interest-free financing available."
  }
]

const categories = [
  "All News",
  "Product Launch",
  "Business News",
  "Partnership",
  "Awards",
  "Customer Service",
  "Retail"
]

// Server component to fetch news data
async function getNewsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/news`, {
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.news || []
    }
  } catch (error) {
    console.error('Error fetching news data:', error)
  }
  
  // Fallback data if API fails
  return [
    {
      id: 1,
      title: "Bedora Living Launches Revolutionary Sleep Technology",
      excerpt: "New hybrid mattress collection combines advanced cooling technology with premium comfort materials for the ultimate sleep experience.",
      category: "Product Launch",
      read_time: "5 min read",
      author: "Press Team",
      date: "2024-01-20",
      image: "/press-tech-launch.jpg",
      featured: true,
      tags: ["technology", "launch", "innovation"]
    },
    {
      id: 2,
      title: "Bedora Living Expands UK Operations with New Distribution Center",
      excerpt: "Strategic expansion to better serve customers across the United Kingdom with faster delivery and improved service.",
      category: "Business News",
      read_time: "4 min read",
      author: "Business Team",
      date: "2024-01-15",
      image: "/press-expansion.jpg",
      featured: true,
      tags: ["expansion", "business", "uk"]
    }
  ]
}

export default async function PressPage() {
  const pressReleases = await getNewsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press & Media Center
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Press releases, company news, and media resources for journalists covering Bedora Living.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search press releases and news..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <Card key={index} className="text-center p-6 border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {tip.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Press Releases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Press Releases</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest news and announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressReleases.filter(release => release.featured).map((release) => (
              <Card key={release.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden">
                  {release.image ? (
                    <div className="aspect-video relative">
                      <img 
                        src={release.image} 
                        alt={release.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {release.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <Newspaper className="h-16 w-16 text-orange-400" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {release.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 text-sm font-semibold">{release.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="h-4 w-4" />
                      {release.read_time}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {release.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {release.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{release.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">{release.date}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {release.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={`/press/${release.id}`} className="w-full">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white group-hover:shadow-lg transition-all">
                      Read Full Release
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Press Releases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        index === 0 
                          ? 'bg-orange-100 text-orange-700 font-semibold' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pressReleases.map((release) => (
                  <Card key={release.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      {release.image ? (
                        <div className="aspect-video relative">
                          <img 
                            src={release.image} 
                            alt={release.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Newspaper className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-orange-500 text-sm font-semibold">{release.category}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="h-4 w-4" />
                          {release.read_time}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {release.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {release.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{release.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{release.date}</span>
                      </div>
                      
                      <Link href={`/press/${release.id}`} className="w-full">
                        <Button className="w-full bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700 transition-all">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Press Information?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Our press team is here to help with media inquiries and information requests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3">
              <Phone className="h-5 w-5 mr-2" />
              Call 03301336323
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3">
              <Mail className="h-5 w-5 mr-2" />
              hello@bedoraliving.co.uk
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}