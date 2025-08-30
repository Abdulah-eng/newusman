"use client"

import React, { useState, useEffect } from 'react'
import { ProductCard } from './product-card'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface ProductGridProps {
  category: string
  filters: Record<string, any>
  sortBy: string
}

export function ProductGrid({ category, filters, sortBy }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [category])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Fetch products from database for the category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/products/category/${category}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setDbProducts(data.products || [])
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setDbProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  // Filter products based on current filters
  const filteredProducts = dbProducts.filter(product => {
    // For kids and sales pages, don't filter by category since products come from different categories
    if (category !== 'kids' && category !== 'sale' && product.category !== category) return false
    
    // Apply filters from CategoryFilters (sidebar) and HorizontalFilterBar
    if (filters['Mattress Type'] && filters['Mattress Type'].length > 0 && !filters['Mattress Type'].includes(product.type)) return false
    if (filters['Pillow Type'] && filters['Pillow Type'].length > 0 && !filters['Pillow Type'].includes(product.type)) return false
    if (filters['Product Type'] && filters['Product Type'].length > 0 && !filters['Product Type'].includes(product.type)) return false
    if (filters['Base Type'] && filters['Base Type'].length > 0 && !filters['Base Type'].includes(product.type)) return false

    if (filters['Size'] && filters['Size'].length > 0) {
      const hasSize = product.variants?.some((variant: any) => 
        filters['Size'].includes(variant.size)
      )
      if (!hasSize) return false
    }
    
    if (filters['Firmness'] && filters['Firmness'].length > 0) {
      const hasFirmness = product.variants?.some((variant: any) => 
        filters['Firmness'].includes(variant.firmness)
      )
      if (!hasFirmness) return false
    }
    
    if (filters['Features'] && filters['Features'].length > 0) {
      const hasAllFeatures = filters['Features'].every((f: string) => product.features?.includes(f));
      if (!hasAllFeatures) return false;
    }
    
    if (filters['Brand'] && filters['Brand'].length > 0 && !filters['Brand'].includes(product.brand)) return false
    
    if (filters['Material'] && filters['Material'].length > 0 && !filters['Material'].includes(product.features?.find((f: string) => f.includes('Material')) || '')) return false
    if (filters['Fill Material'] && filters['Fill Material'].length > 0 && !filters['Fill Material'].includes(product.features?.find((f: string) => f.includes('Fill')) || '')) return false
    if (filters['Style'] && filters['Style'].length > 0 && !filters['Style'].includes(product.features?.find((f: string) => f.includes('Style')) || '')) return false

    if (filters.priceRange) {
      const minPrice = Math.min(...(product.variants?.map((v: any) => v.currentPrice) || [0]))
      const maxPrice = Math.max(...(product.variants?.map((v: any) => v.currentPrice) || [0]))
      if (minPrice < filters.priceRange[0] || maxPrice > filters.priceRange[1]) return false
    }
    
    if (filters['In-store'] && !product.inStore) return false
    if (filters['Sale'] && !product.onSale) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        const aMinPrice = Math.min(...(a.variants?.map((v: any) => v.currentPrice) || [0]))
        const bMinPrice = Math.min(...(b.variants?.map((v: any) => v.currentPrice) || [0]))
        return aMinPrice - bMinPrice
      case "price-high":
        const aMaxPrice = Math.max(...(a.variants?.map((v: any) => v.currentPrice) || [0]))
        const bMaxPrice = Math.max(...(b.variants?.map((v: any) => v.currentPrice) || [0]))
        return bMaxPrice - aMaxPrice
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case "popular": // Default sort
      default:
        return (b.rating || 0) - (a.rating || 0) // Sort by rating for popular
    }
  })

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="flex-1">
      {/* Products Grid */}
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-sm text-gray-600 mb-4">Loading products…</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600" : ""}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
