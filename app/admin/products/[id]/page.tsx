"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AdminNav } from '@/components/admin/admin-nav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Trash2, Upload, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: {
    id: string
    name: string
    slug: string
  }
  rating: number | null
  headline: string | null
  long_description: string | null
  created_at: string
  updated_at: string
  variants: Array<{
    id: string
    sku: string
    current_price: number
    original_price: number
    size: string
    color: string
    depth: string
    firmness: string
  }>
  images: Array<{
    id: string
    image_url: string
  }>
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [newImage, setNewImage] = useState('')
  const [newVariant, setNewVariant] = useState({
    sku: '',
    size: '',
    color: '',
    depth: '',
    firmness: '',
    originalPrice: '',
    currentPrice: ''
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category:categories(id, name, slug),
          rating,
          headline,
          long_description,
          created_at,
          updated_at,
          variants:product_variants(id, sku, current_price, original_price, size, color, depth, firmness),
          images:product_images(id, image_url)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        alert('Failed to fetch product')
        return
      }

      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

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

  const handleSave = async () => {
    if (!product) return

    setSaving(true)
    try {
      // Update main product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: product.name,
          category_id: product.category.id,
          rating: product.rating ? parseFloat(product.rating.toString()) : null,
          headline: product.headline,
          long_description: product.long_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)

      if (productError) {
        console.error('Error updating product:', productError)
        alert('Failed to update product')
        return
      }

      // Update variants
      for (const variant of product.variants) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .update({
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            depth: variant.depth,
            firmness: variant.firmness,
            original_price: variant.original_price,
            current_price: variant.current_price
          })
          .eq('id', variant.id)

        if (variantError) {
          console.error('Error updating variant:', variantError)
        }
      }

      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const addVariant = () => {
    if (!product) return

    const variant = {
      id: crypto.randomUUID(),
      sku: newVariant.sku,
      size: newVariant.size,
      color: newVariant.color,
      depth: newVariant.depth,
      firmness: newVariant.firmness,
      original_price: parseFloat(newVariant.originalPrice) || 0,
      current_price: parseFloat(newVariant.currentPrice) || 0
    }

    setProduct({
      ...product,
      variants: [...product.variants, variant]
    })

    // Reset form
    setNewVariant({
      sku: '',
      size: '',
      color: '',
      depth: '',
      firmness: '',
      originalPrice: '',
      currentPrice: ''
    })
  }

  const removeVariant = (variantId: string) => {
    if (!product) return

    setProduct({
      ...product,
      variants: product.variants.filter(v => v.id !== variantId)
    })
  }

  const addImage = () => {
    if (!product || !newImage.trim()) return

    const image = {
      id: crypto.randomUUID(),
      image_url: newImage.trim()
    }

    setProduct({
      ...product,
      images: [...product.images, image]
    })

    setNewImage('')
  }

  const removeImage = (imageId: string) => {
    if (!product) return

    setProduct({
      ...product,
      images: product.images.filter(img => img.id !== imageId)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-2">Update product information and variants</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={product.category.id}
                    onChange={(e) => {
                      const category = categories.find(c => c.id === e.target.value)
                      if (category) {
                        setProduct({ ...product, category })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={product.headline || ''}
                    onChange={(e) => setProduct({ ...product, headline: e.target.value })}
                    placeholder="Product headline"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={product.rating || ''}
                    onChange={(e) => setProduct({ ...product, rating: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.long_description || ''}
                    onChange={(e) => setProduct({ ...product, long_description: e.target.value })}
                    placeholder="Product description"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                  <Button onClick={addImage} size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt="Product"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Variants */}
          <div className="space-y-6">
            {/* Variants */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
              <div className="space-y-4">
                {/* Add New Variant Form */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="newSku">SKU</Label>
                    <Input
                      id="newSku"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      placeholder="SKU"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSize">Size</Label>
                    <Input
                      id="newSize"
                      value={newVariant.size}
                      onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                      placeholder="Size"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newColor">Color</Label>
                    <Input
                      id="newColor"
                      value={newVariant.color}
                      onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                      placeholder="Color"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newDepth">Depth</Label>
                    <Input
                      id="newDepth"
                      value={newVariant.depth}
                      onChange={(e) => setNewVariant({ ...newVariant, depth: e.target.value })}
                      placeholder="Depth"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newFirmness">Firmness</Label>
                    <Input
                      id="newFirmness"
                      value={newVariant.firmness}
                      onChange={(e) => setNewVariant({ ...newVariant, firmness: e.target.value })}
                      placeholder="Firmness"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newOriginalPrice">Original Price</Label>
                    <Input
                      id="newOriginalPrice"
                      type="number"
                      step="0.01"
                      value={newVariant.originalPrice}
                      onChange={(e) => setNewVariant({ ...newVariant, originalPrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newCurrentPrice">Current Price</Label>
                    <Input
                      id="newCurrentPrice"
                      type="number"
                      step="0.01"
                      value={newVariant.currentPrice}
                      onChange={(e) => setNewVariant({ ...newVariant, currentPrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button onClick={addVariant} className="w-full">
                      Add Variant
                    </Button>
                  </div>
                </div>

                {/* Existing Variants */}
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Variant {variant.sku || variant.id.slice(0, 8)}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Size:</span> {variant.size || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Color:</span> {variant.color || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Depth:</span> {variant.depth || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Firmness:</span> {variant.firmness || 'N/A'}
                        </div>
                                                 <div>
                           <span className="font-medium">Original Price:</span> £{variant.original_price?.toFixed(2) || '0.00'}
                         </div>
                         <div>
                           <span className="font-medium">Current Price:</span> £{variant.current_price?.toFixed(2) || '0.00'}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Product Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Statistics</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900">{new Date(product.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Variants:</span>
                  <p className="text-gray-900">{product.variants.length}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Images:</span>
                  <p className="text-gray-900">{product.images.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
