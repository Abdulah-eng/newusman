"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Grid, List } from 'lucide-react'

interface Product {
  id: number
  name: string
  brand: string
  image?: string
  images?: string[]
  rating?: number
  reviewCount?: number
  firmness?: string
  features?: string[]
  properties?: string[]
  originalPrice?: number
  currentPrice?: number
  category: string
  type?: string
  comfortLevel?: string
  pocketSprings?: string
  comfortLayer?: string
  supportLayer?: string
  height?: string
  weightCapacity?: string
  size?: string
  style?: string
  material?: string
  inStock?: boolean
  onSale?: boolean
  featured?: boolean
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryName, setCategoryName] = useState('')
  
  useEffect(() => {
    if (slug) {
      setProducts([])
      setCategoryName(slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      setLoading(false)
    }
  }, [slug])

  const filteredProducts = products.filter(product => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (!product.name.toLowerCase().includes(searchLower) &&
          !product.brand.toLowerCase().includes(searchLower)) {
        return false
      }
    }
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'price-low':
        return (a.currentPrice || 0) - (b.currentPrice || 0)
      case 'price-high':
        return (b.currentPrice || 0) - (a.currentPrice || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {categoryName || 'Category Products'}
          </h1>
          <p className="text-gray-600">
            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Popular Categories */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { name: "Most Cooling", icon: "❄️", itemsCount: 10 },
                { name: "Soft Comfort", icon: "🌊", itemsCount: 8 },
                { name: "Firm Comfort", icon: "⚫", itemsCount: 7 },
                { name: "Medium Comfort", icon: "⚖️", itemsCount: 16 },
                { name: "Heavy people", icon: "⚖️", itemsCount: 12 },
                { name: "Most Support", icon: "⬆️", itemsCount: 14 },
              ].map((category) => (
                <div 
                  key={category.name} 
                  className="flex-shrink-0 w-40 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50 transition-colors bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="text-3xl mb-2 text-blue-600">{category.icon}</div>
                  <p className="font-medium text-black mb-1">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.itemsCount} Items</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* All Filters Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              All Filters
            </Button>

            {/* Size Filter */}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v14" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 5v14" />
              </svg>
              Size
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            {/* Price Filter */}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
              </svg>
              Price
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            {/* Feels Filter */}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v6m0 6v6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h6m6 0h6" />
              </svg>
              Feels
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            {/* In-store Toggle */}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              In-store
            </Button>

            {/* Sale Toggle */}
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Sale
            </Button>

            {/* Sort by Dropdown */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-300 text-blue-600 hover:border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price, low to high</SelectItem>
                  <SelectItem value="price-high">Price, high to low</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Search and Sort Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {sortedProducts.map((product) => (
                <div key={product.id} className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm p-4' : ''}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm ? `No products match "${searchTerm}"` : 'No products available in this category'}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
