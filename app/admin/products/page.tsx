"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Edit, Trash2, Eye, Plus, Search, Filter, SortAsc, SortDesc, Copy } from 'lucide-react'
import Link from 'next/link'
import { AdminNav } from '@/components/admin/admin-nav'

interface Product {
  id: string
  name: string
  category_id: string
  rating: number | null
  headline: string | null
  currentPrice: number | null
  originalPrice: number | null
  created_at: string
  updated_at: string
  variants: Array<{
    id: string
    current_price: number
    original_price: number
    size: string
    color: string
    depth: string
    firmness: string
    length: string
    width: string
    height: string
    availability: boolean
  }>
  images: Array<{
    image_url: string
  }>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory, sortBy, sortOrder])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        return
      }

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      console.log('Fetching products with category:', selectedCategory, 'sortBy:', sortBy, 'sortOrder:', sortOrder)
      
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          category_id,
          rating,
          headline,
          created_at,
          updated_at,
          variants:product_variants(id, current_price, original_price, size, color, depth, firmness, length, width, height, availability),
          images:product_images(image_url)
        `)
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching products:', error)
        alert('Failed to fetch products: ' + error.message)
        return
      }

      console.log('Successfully fetched products:', data?.length || 0)
      console.log('Sample product data:', data?.[0])
      console.log('Categories:', categories)
      console.log('Selected category:', selectedCategory)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to fetch products: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const duplicateProduct = async (productId: string) => {
    try {
      // Fetch full product details
      const detailRes = await fetch(`/api/products/${productId}`)
      if (!detailRes.ok) {
        const err = await detailRes.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to fetch product details')
      }
      const detailJson = await detailRes.json()
      const product = detailJson.product

      // Build payload compatible with POST /api/products
      const payload: any = {
        category: product.category,
        name: `${product.name} (Copy)`,
        rating: product.rating,
        headline: product.headline,
        longDescription: product.longDescription,
        warrantyDeliveryLine: product.warrantyDeliveryLine,
        careInstructions: product.careInstructions,
        trialInformation: product.trialInformation,
        trialInformationHeading: (product as any).trialInformationHeading || null,
        firmnessScale: product.firmnessScale,
        supportLevel: product.supportLevel,
        pressureReliefLevel: product.pressureReliefLevel,
        airCirculationLevel: product.airCirculationLevel,
        durabilityLevel: product.durabilityLevel,
        isKidsCategory: product.showInKidsCategory,
        isSalesCategory: product.showInSalesCategory,
        selectedBunkbedMattresses: product.selectedMattresses,
        images: product.images || [],
        mainImageIndex: 0,
        // Variants
        variants: (product.variants || []).map((v: any, idx: number) => ({
          sku: v.sku ? `${v.sku}-COPY-${Date.now()}-${idx}` : '',
          originalPrice: v.originalPrice,
          currentPrice: v.currentPrice,
          color: v.color,
          depth: v.depth,
          firmness: v.firmness,
          size: v.size,
          length: v.length,
          width: v.width,
          height: v.height,
          availability: v.availability,
          variant_image: v.variant_image || null
        })),
        // selectedAttributes tell the API which variant fields to persist
        selectedAttributes: (() => {
          const variants = product.variants || []
          const hasColor = variants.some((v: any) => typeof v.color === 'string' && v.color.trim() !== '')
          const hasDepth = variants.some((v: any) => typeof v.depth === 'string' && v.depth.trim() !== '')
          const hasFirmness = variants.some((v: any) => typeof v.firmness === 'string' && v.firmness.trim() !== '')
          const hasSize = variants.some((v: any) => typeof v.size === 'string' && v.size.trim() !== '')
          return { useColor: hasColor, useDepth: hasDepth, useFirmness: hasFirmness, useSize: hasSize }
        })(),
        selectedFeatures: product.selectedFeatures || product.features || [],
        selectedReasonsToLove: (() => {
          const source = (product.selectedReasonsToLove && product.selectedReasonsToLove.length > 0)
            ? product.selectedReasonsToLove
            : (product.product_reasons_to_love || []).map((r: any) => ({
                reason: r.reason_text,
                description: r.description,
                smalltext: r.smalltext,
                icon: r.icon
              }))
          return (source || []).map((r: any) => ({
            reason: r.reason,
            description: r.description,
            smalltext: r.smalltext,
            icon: r.icon
          }))
        })(),
        // Normalize description paragraphs
        descriptionParagraphs: (product.descriptionParagraphs || (product.product_description_paragraphs || []).map((p: any) => ({ heading: p.heading, content: p.content, image: (p.image || p.image_url || null) })) ).map((p: any) => ({ heading: p.heading, content: p.content, image: p.image })),
        // Normalize FAQs
        faqs: (product.faqs || (product.product_faqs || []).map((f: any) => ({ question: f.question, answer: f.answer })) ).map((f: any) => ({ question: f.question, answer: f.answer })),
        warrantySections: (product.warrantySections || (product.product_warranty_sections || []).map((w: any) => ({ heading: w.heading, content: w.content })) ).map((w: any) => ({ heading: w.heading, content: w.content })),
        dimensions: product.dimensions ? {
          height: product.dimensions.height,
          length: product.dimensions.length,
          width: product.dimensions.width,
          mattressSize: product.dimensions.mattress_size,
          maximumHeight: product.dimensions.max_height,
          weightCapacity: product.dimensions.weight_capacity,
          pocketSprings: product.dimensions.pocket_springs,
          comfortLayer: product.dimensions.comfort_layer,
          supportLayer: product.dimensions.support_layer,
          mattressSizeHeading: product.dimensions.mattress_size_heading,
          maximumHeightHeading: product.dimensions.maximum_height_heading,
          weightCapacityHeading: product.dimensions.weight_capacity_heading,
          pocketSpringsHeading: product.dimensions.pocket_springs_heading,
          comfortLayerHeading: product.dimensions.comfort_layer_heading,
          supportLayerHeading: product.dimensions.support_layer_heading,
          dimensionDisclaimer: product.dimensions.dimension_disclaimer,
          show_basic_dimensions: product.dimensions.show_basic_dimensions,
          show_mattress_specs: product.dimensions.show_mattress_specs,
          show_technical_specs: product.dimensions.show_technical_specs
        } : null,
        importantNotices: (product.importantNotices || (product.product_important_notices || []).map((n: any) => ({ noticeText: n.notice_text, sortOrder: n.sort_order })) ).map((n: any) => ({ noticeText: n.noticeText, sortOrder: n.sortOrder })),
        dimensionImages: (product.dimensionImages || (product.product_dimension_images || []).map((img: any) => ({
          imageUrl: img.imageUrl || img.image_url,
          fileName: img.fileName || img.file_name,
          fileSize: img.fileSize || img.file_size,
          fileType: img.fileType || img.file_type,
          sortOrder: img.sortOrder || img.sort_order
        }))) || [],
        badges: product.badges || [],
        selectedPopularCategories: product.selectedPopularCategories || (product.product_popular_categories || []).map((c: any) => c.popular_category_name)
      }

      const createRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to duplicate product')
      }
      const result = await createRes.json()
      alert('Product duplicated successfully')
      // Refresh list
      fetchProducts()
    } catch (e: any) {
      console.error('Duplicate product error:', e)
      alert(e?.message || 'Failed to duplicate product')
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
        return
      }

      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId))
      setDeleteConfirm(null)
      alert('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }


  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || null
  }

  const filteredProducts = products.filter(product => {
    const categoryInfo = getCategoryInfo(product.category_id)
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoryInfo?.name && categoryInfo.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage all products in your database</p>
          </div>
          <Link href="/admin">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                Search Products
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, headline, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sortBy" className="text-sm font-medium text-gray-700 mb-2 block">
                Sort By
              </Label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="created_at">Date Created</option>
                <option value="updated_at">Last Updated</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-2 block">
                Sort Order
              </Label>
              <div className="flex">
                <Button
                  variant={sortOrder === 'asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('asc')}
                  className="rounded-r-none"
                >
                  <SortAsc className="w-4 h-4 mr-1" />
                  Asc
                </Button>
                <Button
                  variant={sortOrder === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('desc')}
                  className="rounded-l-none"
                >
                  <SortDesc className="w-4 h-4 mr-1" />
                  Desc
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* Product Info */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images?.[0]?.image_url || '/placeholder.jpg'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            {product.headline && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {product.headline}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              {product.variants?.length || 0} variants
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(() => {
                          const categoryInfo = getCategoryInfo(product.category_id)
                          return categoryInfo ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {categoryInfo.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              No Category
                            </span>
                          )
                        })()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => {
                              const categoryInfo = getCategoryInfo(product.category_id)
                              if (categoryInfo?.slug) {
                                window.open(`/products/${categoryInfo.slug}/${product.id}`, '_blank')
                              } else {
                                alert('Cannot view product: No category assigned')
                              }
                            }}
                            disabled={!getCategoryInfo(product.category_id)?.slug}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => duplicateProduct(product.id)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => setDeleteConfirm(product.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first product'}
                  </p>
                  {!searchTerm && selectedCategory === 'all' && (
                    <Link href="/admin">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Product
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Products:</span> {products.length}
              </div>
              <div>
                <span className="font-medium">Categories:</span> {categories.length}
              </div>
              <div>
                <span className="font-medium">Selected Category:</span> {selectedCategory}
              </div>
              <div>
                <span className="font-medium">Loading:</span> {loading ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Search Term:</span> {searchTerm || 'None'}
              </div>
              <div>
                <span className="font-medium">Filtered Products:</span> {filteredProducts.length}
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.variants && p.variants.length > 0).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recently Added</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => {
                    const created = new Date(p.created_at)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return created > weekAgo
                  }).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
