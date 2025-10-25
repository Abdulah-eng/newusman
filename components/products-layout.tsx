"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { PopularCategories } from "@/components/popular-categories"
import { HorizontalFilterBar } from "@/components/horizontal-filter-bar"
import { Button } from "@/components/ui/button"
import { Filter, X } from 'lucide-react'

interface ProductsLayoutProps {
  category: string
}

export function ProductsLayout({ category }: ProductsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [sortBy, setSortBy] = useState("popular")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const searchParams = useSearchParams()

  // Read URL parameters and set filters
  useEffect(() => {
    const newFilters: Record<string, any> = {}
    
    // Handle firmness filter
    const firmness = searchParams.get('firmness')
    if (firmness) {
      newFilters.firmness = [firmness]
    }
    
    // Handle features filter
    const features = searchParams.get('features')
    if (features) {
      newFilters.features = [features]
    }
    
    setFilters(newFilters)
  }, [searchParams])

  // Disable API fetching for product count
  useEffect(() => {
    setProductCount(0)
  }, [category])

  const categoryTitles: Record<string, string> = {
    mattresses: "Mattresses",
    beds: "Beds",
    sofas: "Sofas",
    pillows: "Pillows",
    toppers: "Toppers",
    "bunkbeds": "Bunk Beds",
    kids: "Kids",
    sale: "Sale",
    guides: "Guides",
  }

  const handlePopularCategorySelect = (filterKey: string, filterValue: string) => {
    // Update filters based on category selection
    setFilters(prev => ({
      ...prev,
      [filterKey.toLowerCase()]: [filterValue]
    }))
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900">{categoryTitles[category] || "Products"}</h1>
          {category === 'beds' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Discover our premium beds collection featuring modern designs, durable quality, and unmatched comfort. From luxury beds to space-saving styles, find the perfect fit for every home.
            </p>
          )}
          {category === 'mattresses' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Shop the best mattresses online – from hybrid and memory foam to luxury and orthopedic designs, each crafted for unmatched comfort and support. Our premium mattresses are built to ensure restful sleep, long-lasting durability, and top-quality performance at unbeatable value. Discover the perfect balance of style, innovation, and relaxation – designed to transform your bedroom into a true haven for better living.
            </p>
          )}
          {category === 'sofas' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Explore our premium collection of sofas – from modern and stylish designs to luxury comfort pieces that redefine your living space. Crafted with durability, elegance, and ultimate relaxation in mind, our sofas bring both beauty and function to every home. Choose from a wide variety of styles, fabrics, and sizes to find the perfect sofa that suits your lifestyle and transforms your living room into a space of true comfort.
            </p>
          )}
          {category === 'kids' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Discover our specially designed kids' collection featuring safe, durable and stylish beds, bunk beds, mattresses & pillows for growing children. From playful designs to cozy comfort, our kids' range combines quality, safety, and creativity to make bedtime fun and relaxing. Give your little ones the perfect blend of comfort and support with furniture crafted just for them.
            </p>
          )}
          {category === 'pillows' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Experience ultimate comfort with our premium range of pillows, designed to give you restful and refreshing sleep every night. From soft and cozy to orthopedic support pillows, our collection offers the perfect balance of comfort, quality, and durability – ensuring sweet dreams and healthy posture.
            </p>
          )}
          {category === 'bunkbeds' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Discover our stylish and durable bunk beds, perfect for kids' rooms and space-saving solutions. Designed with safety, comfort, and creativity in mind, our bunk beds combine modern style with practical functionality – making them ideal for growing families and compact spaces. Choose from a wide variety of designs to bring both fun and comfort into your home.
            </p>
          )}
          {category === 'toppers' && (
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
              Enhance your sleep with our premium mattress toppers, designed to add extra comfort, support, and luxury to any bed. From memory foam and orthopaedic toppers to soft, plush styles, our collection transforms ordinary mattresses into a restful haven – ensuring better sleep, improved durability, and unbeatable value.
            </p>
          )}
        </div>
        
        <Button
          variant="outline"
          className="lg:hidden border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 absolute right-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Popular Categories - Hide for pillows */}
      {category !== 'pillows' && (
        <PopularCategories 
          onCategorySelect={handlePopularCategorySelect} 
          category={category} 
          selectedFilters={filters}
        />
      )}

      {/* Horizontal Filter Bar */}
      <HorizontalFilterBar 
        category={category}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenAllFilters={() => setSidebarOpen(true)}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="flex gap-8">
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-white overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center text-gray-500">
                  <p>Filters are now available in the horizontal bar above</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProductGrid category={category} filters={filters} sortBy={sortBy} />
      </div>
    </div>
  )
}
