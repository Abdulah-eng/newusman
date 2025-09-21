"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  current_price: number
  original_price?: number
  images: string[]
  brand: string
  rating: number
  review_count: number
  badges: any[]
  categories: {
    name: string
    slug: string
  }
}

interface SleepLuxuryData {
  products: Record<string, Product[]>
  raw: any[]
}

const CATEGORIES = [
  { slug: 'mattresses', name: 'Mattresses', color: 'bg-blue-100 text-blue-800' },
  { slug: 'beds', name: 'Beds', color: 'bg-green-100 text-green-800' },
  { slug: 'sofas', name: 'Sofas', color: 'bg-purple-100 text-purple-800' },
  { slug: 'pillows', name: 'Pillows', color: 'bg-pink-100 text-pink-800' },
  { slug: 'toppers', name: 'Toppers', color: 'bg-yellow-100 text-yellow-800' },
  { slug: 'bunkbeds', name: 'Bunkbeds', color: 'bg-indigo-100 text-indigo-800' },
  { slug: 'kids', name: 'Kids', color: 'bg-orange-100 text-orange-800' }
]

export default function SleepLuxuryAdmin() {
  const [data, setData] = useState<SleepLuxuryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string[]>>({})
  const [allProducts, setAllProducts] = useState<Record<string, Product[]>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchData()
    fetchAllProducts()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sleep-luxury')
      const result = await response.json()
      
      if (result.success) {
        setData(result)
        // Initialize selected products from current data
        const initialSelected: Record<string, string[]> = {}
        CATEGORIES.forEach(cat => {
          initialSelected[cat.slug] = result.products[cat.slug]?.map(p => p.id) || []
        })
        setSelectedProducts(initialSelected)
      }
    } catch (error) {
      console.error('Error fetching sleep luxury data:', error)
      setMessage({ type: 'error', text: 'Failed to fetch data' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const categories = ['mattresses', 'beds', 'sofas', 'pillows', 'toppers', 'bunkbeds', 'kids']
      const allProductsData: Record<string, Product[]> = {}
      
      for (const category of categories) {
        const response = await fetch(`/api/products/category/${category}?limit=50`)
        const result = await response.json()
        if (result.products) {
          allProductsData[category] = result.products
        }
      }
      
      setAllProducts(allProductsData)
    } catch (error) {
      console.error('Error fetching all products:', error)
    }
  }

  const handleProductToggle = (category: string, productId: string) => {
    setSelectedProducts(prev => {
      const current = prev[category] || []
      const isSelected = current.includes(productId)
      
      if (isSelected) {
        // Remove product
        return {
          ...prev,
          [category]: current.filter(id => id !== productId)
        }
      } else {
        // Add product (max 4)
        if (current.length >= 4) {
          setMessage({ type: 'error', text: 'Maximum 4 products allowed per category' })
          return prev
        }
        return {
          ...prev,
          [category]: [...current, productId]
        }
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const promises = CATEGORIES.map(category => {
        const productIds = selectedProducts[category.slug] || []
        return fetch('/api/sleep-luxury', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: category.slug,
            productIds
          })
        })
      })

      const results = await Promise.all(promises)
      const allSuccess = results.every(r => r.ok)

      if (allSuccess) {
        setMessage({ type: 'success', text: 'Sleep Luxury section updated successfully!' })
        fetchData() // Refresh data
      } else {
        setMessage({ type: 'error', text: 'Failed to update some categories' })
      }
    } catch (error) {
      console.error('Error saving sleep luxury data:', error)
      setMessage({ type: 'error', text: 'Failed to save changes' })
    } finally {
      setSaving(false)
    }
  }

  const getSelectedCount = (category: string) => {
    return selectedProducts[category]?.length || 0
  }

  const isProductSelected = (category: string, productId: string) => {
    return selectedProducts[category]?.includes(productId) || false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sleep Luxury Section Management</h1>
        <p className="text-gray-600">
          Select 4 products from each category to display in the "Sleep Luxury, Every Night" section
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button onClick={fetchData} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map(category => (
          <Card key={category.slug} className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <Badge className={category.color}>
                  {getSelectedCount(category.slug)}/4 selected
                </Badge>
              </CardTitle>
              <CardDescription>
                Select up to 4 products to feature in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allProducts[category.slug]?.map(product => {
                  const isSelected = isProductSelected(category.slug, product.id)
                  return (
                    <div
                      key={product.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleProductToggle(category.slug, product.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                          <p className="text-sm font-semibold text-orange-600">
                            £{product.current_price}
                            {product.original_price && product.original_price > product.current_price && (
                              <span className="text-xs text-gray-500 line-through ml-1">
                                £{product.original_price}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <CheckCircle className="h-5 w-5 text-orange-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Current Selection Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map(category => (
            <div key={category.slug}>
              <h4 className="font-medium text-sm text-gray-700 mb-2">{category.name}</h4>
              <div className="space-y-1">
                {selectedProducts[category.slug]?.map(productId => {
                  const product = allProducts[category.slug]?.find(p => p.id === productId)
                  return product ? (
                    <div key={productId} className="text-xs text-gray-600 truncate">
                      • {product.name}
                    </div>
                  ) : null
                })}
                {(!selectedProducts[category.slug] || selectedProducts[category.slug].length === 0) && (
                  <div className="text-xs text-gray-400 italic">No products selected</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
