"use client"

import { useState, useEffect } from 'react'
import { X, Search, Package, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from '@/lib/supabaseClient'

interface Product {
  id: string
  name: string
  main_image?: string
  current_price?: number
  category_id?: string
}

interface ProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (product: Product) => void
  title: string
  description?: string
  excludeProductId?: string
}

export function ProductSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  title, 
  description,
  excludeProductId 
}: ProductSelectionModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, main_image, current_price, category_id')
        .order('name')

      if (error) throw error

      // Filter out the current product if excludeProductId is provided
      const filteredData = excludeProductId 
        ? data.filter(p => p.id !== excludeProductId)
        : data

      setProducts(filteredData || [])
      setFilteredProducts(filteredData || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleConfirm = () => {
    if (selectedProduct) {
      onSelect(selectedProduct)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No products found matching your search.' : 'No products available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProduct?.id === product.id
                      ? 'ring-2 ring-orange-500 bg-orange-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.main_image ? (
                          <img
                            src={product.main_image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                        {product.current_price && (
                          <p className="text-sm text-gray-600">£{product.current_price.toFixed(2)}</p>
                        )}
                      </div>
                      {selectedProduct?.id === product.id && (
                        <Check className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedProduct}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Select Product
          </Button>
        </div>
      </div>
    </div>
  )
}
