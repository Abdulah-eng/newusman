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
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const productsPerLoad = 8

  // Reset when category changes
  useEffect(() => {
    setAllProducts([])
    setDisplayedProducts([])
    setHasMore(true)
    fetchInitialProducts()
  }, [category])

  // Refetch when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setAllProducts([])
      setDisplayedProducts([])
      setHasMore(true)
      fetchInitialProducts()
    }
  }, [filters])

  const fetchInitialProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      // Build query parameters including filters
      const queryParams = new URLSearchParams({
        page: '1',
        limit: productsPerLoad.toString()
      })
      
      // Add filters to query parameters
      Object.entries(filters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          values.forEach(value => {
            queryParams.append(key, value)
          })
        }
      })
      
      const response = await fetch(`/api/products/category/${category}?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setAllProducts(data.products || [])
      setDisplayedProducts(data.products || [])
      setTotalCount(data.totalCount || 0)
      setHasMore((data.products || []).length === productsPerLoad && (data.products || []).length < (data.totalCount || 0))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      setAllProducts([])
      setDisplayedProducts([])
      setTotalCount(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextPage = Math.floor(displayedProducts.length / productsPerLoad) + 1
      
      // Build query parameters including filters
      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
        limit: productsPerLoad.toString()
      })
      
      // Add filters to query parameters
      Object.entries(filters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          values.forEach(value => {
            queryParams.append(key, value)
          })
        }
      })
      
      const response = await fetch(`/api/products/category/${category}?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch more products')
      }
      const data = await response.json()
      const newProducts = data.products || []
      
      setAllProducts(prev => [...prev, ...newProducts])
      setDisplayedProducts(prev => [...prev, ...newProducts])
      setHasMore(newProducts.length === productsPerLoad && (allProducts.length + newProducts.length) < totalCount)
    } catch (err) {
      console.error('Error fetching more products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch more products')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Products Grid */}
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-sm text-gray-600 mb-4">Loading products…</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 mb-8">
        {displayedProducts.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mb-8">
          <Button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loadingMore ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}
      
      {/* Show total count */}
      {totalCount > 0 && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Showing {displayedProducts.length} of {totalCount} products
        </div>
      )}
    </div>
  )
}
