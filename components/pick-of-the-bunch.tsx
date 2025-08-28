'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface CategoryData {
  name: string
  products: string[]
}

const categories: CategoryData[] = [
  {
    name: 'Hyde & Sleep Mattresses',
    products: ['Hyde & Sleep Memory Foam', 'Hyde & Sleep Hybrid', 'Hyde & Sleep Innerspring', 'Hyde & Sleep Latex']
  },
  {
    name: 'Sale',
    products: ['Clearance Mattresses', 'End of Season Deals', 'Overstock Specials', 'Last Chance Offers']
  },
  {
    name: 'Bed Frames',
    products: ['Platform Beds', 'Storage Beds', 'Adjustable Bases', 'Headboards', 'Footboards']
  },
  {
    name: 'Mattresses',
    products: ['Memory Foam', 'Hybrid', 'Innerspring', 'Latex', 'Pillow Top', 'Euro Top']
  },
  {
    name: 'Sofa Beds',
    products: ['Pull-Out Sofas', 'Futons', 'Convertible Chairs', 'Sectional Sleepers']
  },
  {
    name: 'Bedding',
    products: ['Sheets', 'Comforters', 'Duvets', 'Pillows', 'Mattress Protectors']
  },
  {
    name: 'Kids',
    products: ['Twin Mattresses', 'Bunk Beds', 'Toddler Beds', 'Kids Bedding', 'Safety Rails']
  }
]

export default function PickOfTheBunch() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  return (
    <div className="px-6 md:px-28 lg:px-32 xl:px-36 2xl:px-40 py-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left side - Title and Subtitle */}
        <div className="flex-1">
          <h2 className="text-4xl lg:text-5xl font-serif text-purple-900 mb-3">
            Pick of the Bunch
          </h2>
          <p className="text-lg text-gray-700">
            Bestselling products for your best rest
          </p>
        </div>

        {/* Right side - Navigation Buttons with Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <div key={index} className="relative group">
                <button
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    index === activeCategory
                      ? 'bg-purple-900 text-white hover:bg-purple-800'
                      : 'bg-gray-200 text-purple-900 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveCategory(index)}
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category.name}
                  <ChevronDown className="inline-block w-4 h-4 ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {hoveredCategory === index && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {category.products.map((product, productIndex) => (
                        <a
                          key={productIndex}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                        >
                          {product}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 ml-4">
            <button className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center hover:border-purple-300 hover:text-purple-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-purple-900 text-purple-900 flex items-center justify-center hover:bg-purple-900 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
