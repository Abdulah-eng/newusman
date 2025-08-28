"use client"

import { Sofa, Users, Grid, ChevronLeft, ChevronRight, Home, Zap } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function SofaTypesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const sofaTypes = [
    {
      id: 1,
      title: "Sectional Sofas",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Versatile sectionals offer flexible seating arrangements perfect for large families and entertaining. Their modular design adapts to any room layout while providing maximum comfort and style.",
      image: "/sofa.jpeg"
    },
    {
      id: 2,
      title: "L-Shaped Sofas",
      icon: <Home className="h-5 w-5 text-orange-500" />,
      description: "L-shaped sofas maximize corner spaces and create intimate seating areas. Perfect for open-plan living rooms, they offer both comfort and efficient use of floor space.",
      image: "/sofacollect.jpg"
    },
    {
      id: 3,
      title: "Chesterfield Sofas",
      icon: <Sofa className="h-5 w-5 text-orange-500" />,
      description: "Timeless Chesterfield sofas feature deep button tufting and rolled arms for classic elegance. Their sophisticated design adds luxury to any living space while ensuring lasting comfort.",
      image: "/bedcollect.jpeg"
    },
    {
      id: 4,
      title: "Recliner Sofas",
      icon: <Users className="h-5 w-5 text-orange-500" />,
      description: "Recliner sofas combine the comfort of a traditional sofa with the relaxation of reclining seats. Perfect for movie nights and ultimate comfort, they're ideal for family living rooms.",
      image: "/hello.jpeg"
    },
    {
      id: 5,
      title: "Sleeper Sofas",
      icon: <Grid className="h-5 w-5 text-orange-500" />,
      description: "Sleeper sofas provide dual functionality as both seating and sleeping solutions. Their innovative design makes them perfect for guest rooms, home offices, and small apartments.",
      image: "/hi.jpeg"
    },
    {
      id: 6,
      title: "Modern Loveseats",
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      description: "Contemporary loveseats offer compact seating solutions with sleek, modern designs. Perfect for smaller spaces or as accent pieces, they combine style with intimate comfort.",
      image: "/hell.jpeg"
    }
  ]

  const cardsPerView = 3
  const maxIndex = sofaTypes.length - cardsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 font-display">
            Our Sofa Types
          </h2>
          <p className="text-lg text-gray-700 font-modern">
            Elegant designs, exceptional comfort — discover sofas crafted for your lifestyle.
          </p>
        </div>
        
        <div className="relative">
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
              {sofaTypes.map((type) => (
                <div key={type.id} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative mb-6">
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={type.image}
                        alt={type.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-3">
                    {type.icon}
                    <h3 className="font-semibold text-black ml-2 text-lg font-display">
                      {type.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed font-modern">
                    {type.description}
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
