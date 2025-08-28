"use client"

import { Star, Quote, ChevronLeft, ChevronRight, ArrowRight, CheckCircle, Users, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export function ReviewSection() {
  const [currentReview, setCurrentReview] = useState(0)
  
  const reviews = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Verified Buyer",
      rating: 5,
      review: "Absolutely incredible experience! The team helped me find the perfect mattress for my back pain. I've never slept better in my life. The quality is outstanding and the customer service was exceptional.",
      avatar: "/hello.jpeg",
      location: "Manchester",
      verified: true
    },
    {
      id: 2,
      name: "James Thompson",
      role: "Verified Buyer", 
      rating: 5,
      review: "After struggling with sleep for years, I finally found the right mattress here. The staff took the time to understand my needs and the result is amazing. My sleep quality has improved dramatically!",
      avatar: "/hi.jpeg",
      location: "London",
      verified: true
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Verified Buyer",
      rating: 5, 
      review: "The sofa selection here is incredible! We found the perfect sectional that fits our living room perfectly. The quality is top-notch and the delivery service was flawless. Highly recommend!",
      avatar: "/hell.jpeg",
      location: "Birmingham",
      verified: true
    }
  ]

  const stats = [
    { number: "15,000+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "4.9/5", label: "Average Rating", icon: <Star className="h-6 w-6" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "25+", label: "Years Experience", icon: <Award className="h-6 w-6" /> }
  ]

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-200/30 to-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6 font-modern">
            <Star className="h-4 w-4 fill-current" />
            Trusted by 15,000+ Customers
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern">
            Don't just take our word for it. Hear from thousands of satisfied customers who've transformed their homes with us.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-4 text-white">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-black mb-2 font-display">{stat.number}</div>
              <div className="text-sm text-gray-700 font-medium font-modern">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-black" />
          </button>

          {/* Review Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white">
            <div className="text-center">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-8 h-8 text-orange-600" />
              </div>
              
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {renderStars(reviews[currentReview].rating)}
              </div>
              
              {/* Review Text */}
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-modern italic">
                "{reviews[currentReview].review}"
              </blockquote>
              
              {/* Customer Info */}
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <Image
                    src={reviews[currentReview].avatar}
                    alt={reviews[currentReview].name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {reviews[currentReview].verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-black text-lg font-display">{reviews[currentReview].name}</h4>
                  <p className="text-gray-600 text-sm font-modern">{reviews[currentReview].role}</p>
                  <p className="text-gray-500 text-sm font-modern">{reviews[currentReview].location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview ? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Read More Reviews
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
