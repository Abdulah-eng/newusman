import { Suspense } from "react"
import { Search, Clock, User, ArrowRight, Star, BookOpen, Lightbulb, Shield, Truck, RotateCcw, CreditCard, Phone, Mail, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sleep Guides & Tips | Bedora Living',
  description: 'Expert sleep guides, mattress buying tips, and bedroom inspiration. Learn how to choose the perfect mattress, improve your sleep quality, and create your dream bedroom.',
}

const sleepGuides = [
  {
    id: 1,
    title: "How to Choose the Perfect Mattress",
    excerpt: "Complete guide to finding your ideal mattress based on sleep position, firmness preferences, and body type.",
    category: "Mattress Buying",
    readTime: "8 min read",
    author: "Sleep Expert Team",
    date: "2024-01-15",
    image: "/mattress-guide.jpg",
    featured: true,
    tags: ["mattress", "buying guide", "sleep position"]
  },
  {
    id: 2,
    title: "Understanding Mattress Firmness Levels",
    excerpt: "Learn about different firmness levels and how they affect your sleep quality and comfort.",
    category: "Mattress Education",
    readTime: "6 min read",
    author: "Dr. Sarah Johnson",
    date: "2024-01-12",
    image: "/firmness-guide.jpg",
    featured: false,
    tags: ["firmness", "comfort", "support"]
  },
  {
    id: 3,
    title: "Memory Foam vs Hybrid vs Innerspring",
    excerpt: "Compare different mattress types to make an informed decision for your sleep needs.",
    category: "Mattress Types",
    readTime: "10 min read",
    author: "Mattress Specialist",
    date: "2024-01-10",
    image: "/mattress-types.jpg",
    featured: true,
    tags: ["memory foam", "hybrid", "innerspring"]
  },
  {
    id: 4,
    title: "Creating the Perfect Bedroom Environment",
    excerpt: "Transform your bedroom into a sleep sanctuary with these expert tips for optimal rest.",
    category: "Sleep Environment",
    readTime: "7 min read",
    author: "Interior Designer",
    date: "2024-01-08",
    image: "/bedroom-design.jpg",
    featured: false,
    tags: ["bedroom", "environment", "sleep quality"]
  },
  {
    id: 5,
    title: "Mattress Care and Maintenance",
    excerpt: "Keep your mattress in perfect condition with these essential care tips and maintenance routines.",
    category: "Care & Maintenance",
    readTime: "5 min read",
    author: "Care Specialist",
    date: "2024-01-05",
    image: "/mattress-care.jpg",
    featured: false,
    tags: ["care", "maintenance", "longevity"]
  },
  {
    id: 6,
    title: "Sleep Positions and Their Impact",
    excerpt: "Discover how your sleep position affects your health and which mattress type works best for you.",
    category: "Sleep Health",
    readTime: "9 min read",
    author: "Sleep Therapist",
    date: "2024-01-03",
    image: "/sleep-positions.jpg",
    featured: true,
    tags: ["sleep position", "health", "comfort"]
  }
]

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
  "All Guides",
  "Mattress Buying",
  "Sleep Health",
  "Bedroom Design",
  "Care & Maintenance"
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sleep Guides & Expert Tips
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Everything you need to know about mattresses, sleep health, and creating your perfect bedroom sanctuary.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search guides, tips, and articles..."
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

      {/* Featured Guides */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Sleep Guides</h2>
            <p className="text-lg text-gray-600">Our most popular and comprehensive guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sleepGuides.filter(guide => guide.featured).map((guide) => (
              <Card key={guide.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-orange-400" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 text-sm font-semibold">{guide.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="h-4 w-4" />
                      {guide.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {guide.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {guide.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{guide.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">{guide.date}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white group-hover:shadow-lg transition-all">
                    Read Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Guides Section */}
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
                {sleepGuides.map((guide) => (
                  <Card key={guide.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-orange-500 text-sm font-semibold">{guide.category}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="h-4 w-4" />
                          {guide.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {guide.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {guide.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{guide.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{guide.date}</span>
                      </div>
                      
                      <Button className="w-full bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
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
          <h2 className="text-3xl font-bold mb-4">Need Personalized Help?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Our sleep experts are here to help you find the perfect mattress
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
              Email Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}