"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Snowflake, Waves, ArrowUp, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export function CategoryFilterCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const categories = [
    {
      id: 1,
      title: "Most Cooling",
      items: "10 Items",
      icon: <Snowflake className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?features=cooling"
    },
    {
      id: 2,
      title: "Soft Comfort",
      items: "8 Items",
      icon: <Waves className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?firmness=soft"
    },
    {
      id: 3,
      title: "Firm Comfort",
      items: "7 Items",
      icon: <Waves className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?firmness=firm"
    },
    {
      id: 4,
      title: "Medium Comfort",
      items: "16 Items",
      icon: <Waves className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?firmness=medium"
    },
    {
      id: 5,
      title: "Heavy People",
      items: "12 Items",
      icon: <Dumbbell className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?features=heavy-duty"
    },
    {
      id: 6,
      title: "Most Support",
      items: "14 Items",
      icon: <ArrowUp className="h-8 w-8 text-orange-500" />,
      href: "/mattresses?features=extra-support"
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-4 text-left font-display">
          Shop by Comfort & Support
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-left max-w-3xl font-modern">
          Because the right comfort means better sleep, brighter mornings, and healthier days.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="block">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-orange-300 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-black mb-2 text-sm font-display">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-xs font-modern">
                    {category.items}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
