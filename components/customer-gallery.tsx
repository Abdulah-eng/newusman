"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const gallery = [
  {
    id: 1,
    image: "/hello.jpeg",
    title: "Sarah's Living Room",
    description: "Sarah transformed her living space with our contemporary sofa collection. The modern design perfectly complements her minimalist aesthetic."
  },
  {
    id: 2,
    image: "/hell.jpeg",
    title: "Mike's Bedroom",
    description: "Mike created his perfect sleep sanctuary with our premium mattress and bedding. He says it's the best sleep he's ever had!"
  },
  {
    id: 3,
    image: "/hi.jpeg",
    title: "Emma's Home Office",
    description: "Emma designed her productive workspace with our ergonomic furniture. She loves how it balances functionality with style."
  },
  {
    id: 4,
    image: "/sofa.jpeg",
    title: "David's Family Room",
    description: "David chose our premium sofa for his family room. The kids love the comfort, and he loves the durability and style."
  },
  {
    id: 5,
    image: "/sofacollect.jpg",
    title: "Lisa's Dining Area",
    description: "Lisa created a cohesive dining space with our furniture collection. Every piece works together to create the perfect atmosphere."
  },
  {
    id: 6,
    image: "/bedcollect.jpeg",
    title: "James's Master Suite",
    description: "James completed his master bedroom with our essential collection. From mattress to accessories, everything is perfectly coordinated."
  }
]

export function CustomerGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const cardsPerView = 3
  const maxIndex = gallery.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black text-center font-display">Customer Gallery</h2>
        <p className="mt-2 text-gray-700 text-center font-modern">Discover how our customers have transformed their spaces with our products.</p>
        <p className="mt-1 text-gray-700 text-center font-modern">Real homes, real style, real inspiration for your next project</p>

        <div className="mt-8 relative">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </button>
          )}
          
          {currentIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </button>
          )}

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {gallery.map((item) => (
                <div key={item.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative mb-6">
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold text-black text-lg font-display">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed font-modern">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


