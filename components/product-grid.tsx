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
  const productsPerPage = 8 // Changed from 12 to 8 as requested
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

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
        const response = await fetch(`/api/products/category/${category}?page=${currentPage}&limit=${productsPerPage}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setDbProducts(data.products || [])
        setTotalCount(data.totalCount || 0)
        setTotalPages(data.totalPages || 0)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setDbProducts([])
        setTotalCount(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, currentPage, productsPerPage])

  // Since we're using server-side pagination, we don't need client-side filtering or pagination
  // The products are already filtered and paginated by the API
  const paginatedProducts = dbProducts

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
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              disabled={loading}
              className={page === currentPage ? "bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600" : ""}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
      
      {/* Show total count */}
      {totalCount > 0 && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalCount)} of {totalCount} products
        </div>
      )}
    </div>
  )
}
