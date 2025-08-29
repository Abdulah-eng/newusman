"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Package, Palette, Ruler, DollarSign, Hash } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface Variant {
  id?: string
  sku: string
  color: string
  size: string
  original_price: number
  current_price: number
  monthly_price?: number
  stock_quantity: number
  variant_image?: string
  weight?: number
  dimensions?: any
  in_stock: boolean
  on_sale: boolean
}

interface VariantManagementProps {
  productId: string
  category: string
  productName: string
  onVariantsUpdated?: () => void
}

export function VariantManagement({ productId, category, productName, onVariantsUpdated }: VariantManagementProps) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [isAddingVariant, setIsAddingVariant] = useState(false)
  const [newVariant, setNewVariant] = useState<Variant>({
    sku: '',
    color: '',
    size: '',
    original_price: 0,
    current_price: 0,
    monthly_price: 0,
    stock_quantity: 0,
    variant_image: '',
    weight: 0,
    dimensions: {},
    in_stock: true,
    on_sale: false
  })

  // Load existing variants
  useEffect(() => {
    loadVariants()
  }, [productId, category])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/variants?productId=${productId}&category=${category}`)
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Error loading variants:', error)
      toast({
        title: "Error",
        description: "Failed to load variants",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `${category.toUpperCase().slice(0, 3)}-${timestamp}-${random}`
  }

  const handleAddVariant = () => {
    setNewVariant({
      sku: generateSKU(),
      color: '',
      size: '',
      original_price: 0,
      current_price: 0,
      monthly_price: 0,
      stock_quantity: 0,
      variant_image: '',
      weight: 0,
      dimensions: {},
      in_stock: true,
      on_sale: false
    })
    setIsAddingVariant(true)
    setEditingVariant(null)
  }

  const handleSaveVariant = async (variant: Variant) => {
    try {
      setLoading(true)
      
      if (editingVariant?.id) {
        // Update existing variant
        const response = await fetch('/api/variants', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId: editingVariant.id,
            sku: variant.sku,
            originalPrice: variant.original_price,
            currentPrice: variant.current_price,
            color: variant.color,
            depth: variant.depth,
            firmness: variant.firmness,
            size: variant.size,
            variantImage: variant.variant_image
          })
        })
        
        if (response.ok) {
          toast({
            title: "Success",
            description: "Variant updated successfully"
          })
          setEditingVariant(null)
          onVariantsUpdated?.()
        } else {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update variant')
        }
      } else {
        // Create new variant
        const response = await fetch('/api/variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            category,
            sku: variant.sku,
            originalPrice: variant.original_price,
            currentPrice: variant.current_price,
            color: variant.color,
            depth: variant.depth,
            firmness: variant.firmness,
            size: variant.size,
            variantImage: variant.variant_image
          })
        })
        
        if (response.ok) {
          toast({
            title: "Success",
            description: "Variant added successfully"
          })
          setIsAddingVariant(false)
          onVariantsUpdated?.()
        } else {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create variant')
        }
      }
      
      loadVariants()
    } catch (error) {
      console.error('Error saving variant:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save variant',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/variants?id=${variantId}`, {
        method: 'DELETE'
      })
      
                      if (response.ok) {
          toast({
            title: "Success",
            description: "Variant deleted successfully"
          })
          onVariantsUpdated?.()
        } else {
          throw new Error('Failed to delete variant')
        }
    } catch (error) {
      console.error('Error deleting variant:', error)
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant)
    setIsAddingVariant(false)
  }

  const cancelEdit = () => {
    setEditingVariant(null)
    setIsAddingVariant(false)
    setNewVariant({
      sku: '',
      color: '',
      size: '',
      original_price: 0,
      current_price: 0,
      monthly_price: 0,
      stock_quantity: 0,
      variant_image: '',
      weight: 0,
      dimensions: {},
      in_stock: true,
      on_sale: false
    })
  }

  const renderVariantForm = (variant: Variant, isNew: boolean = false) => (
    <Card className="mb-4 border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isNew ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          {isNew ? 'Add New Variant' : 'Edit Variant'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                value={variant.sku}
                onChange={(e) => isNew 
                  ? setNewVariant({ ...newVariant, sku: e.target.value })
                  : setEditingVariant({ ...editingVariant!, sku: e.target.value })
                }
                placeholder="Enter SKU"
              />
              {isNew && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewVariant({ ...newVariant, sku: generateSKU() })}
                >
                  <Hash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color *</Label>
            <Input
              id="color"
              value={variant.color}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, color: e.target.value })
                : setEditingVariant({ ...editingVariant!, color: e.target.value })
              }
              placeholder="e.g., Blue, White, Black"
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size">Size *</Label>
            <Input
              id="size"
              value={variant.size}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, size: e.target.value })
                : setEditingVariant({ ...editingVariant!, size: e.target.value })
              }
              placeholder="e.g., Single, Double, King"
            />
          </div>

          {/* Original Price */}
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price *</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={variant.original_price}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, original_price: parseFloat(e.target.value) || 0 })
                : setEditingVariant({ ...editingVariant!, original_price: parseFloat(e.target.value) || 0 })
              }
              placeholder="0.00"
            />
          </div>

          {/* Current Price */}
          <div className="space-y-2">
            <Label htmlFor="currentPrice">Current Price *</Label>
            <Input
              id="currentPrice"
              type="number"
              step="0.01"
              value={variant.current_price}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, current_price: parseFloat(e.target.value) || 0 })
                : setEditingVariant({ ...editingVariant!, current_price: parseFloat(e.target.value) || 0 })
              }
              placeholder="0.00"
            />
          </div>

          {/* Monthly Price */}
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Monthly Price</Label>
            <Input
              id="monthlyPrice"
              type="number"
              step="0.01"
              value={variant.monthly_price || 0}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, monthly_price: parseFloat(e.target.value) || 0 })
                : setEditingVariant({ ...editingVariant!, monthly_price: parseFloat(e.target.value) || 0 })
              }
              placeholder="0.00"
            />
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={variant.stock_quantity}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })
                : setEditingVariant({ ...editingVariant!, stock_quantity: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
          </div>

          {/* Variant Image */}
          <div className="space-y-2">
            <Label htmlFor="variantImage">Variant Image</Label>
            <div className="space-y-3">
              {/* Image Preview */}
              {variant.variant_image && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img 
                    src={variant.variant_image} 
                    alt="Variant preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => isNew 
                      ? setNewVariant({ ...newVariant, variant_image: '' })
                      : setEditingVariant({ ...editingVariant!, variant_image: '' })
                    }
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="variantImageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    try {
                      const formData = new FormData()
                      formData.append('file', file)
                      
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                      })
                      
                      if (response.ok) {
                        const { url } = await response.json()
                        if (isNew) {
                          setNewVariant({ ...newVariant, variant_image: url })
                        } else {
                          setEditingVariant({ ...editingVariant!, variant_image: url })
                        }
                      } else {
                        const error = await response.json()
                        toast({
                          title: "Upload Failed",
                          description: error.error || 'Failed to upload image',
                          variant: "destructive"
                        })
                      }
                    } catch (error) {
                      console.error('Upload error:', error)
                      toast({
                        title: "Upload Failed",
                        description: 'Failed to upload image',
                        variant: "destructive"
                      })
                    }
                  }}
                />
                <label
                  htmlFor="variantImageUpload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Upload Image
                </label>
                
                {/* URL Input as fallback */}
                <Input
                  id="variantImage"
                  value={variant.variant_image || ''}
                  onChange={(e) => isNew 
                    ? setNewVariant({ ...newVariant, variant_image: e.target.value })
                    : setEditingVariant({ ...editingVariant!, variant_image: e.target.value })
                  }
                  placeholder="Or enter image URL directly"
                  className="flex-1"
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Upload an image for this variant (recommended for color variants). 
                Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={variant.weight || 0}
              onChange={(e) => isNew 
                ? setNewVariant({ ...newVariant, weight: parseFloat(e.target.value) || 0 })
                : setEditingVariant({ ...editingVariant!, weight: parseFloat(e.target.value) || 0 })
              }
              placeholder="0.0"
            />
          </div>

          {/* In Stock */}
          <div className="space-y-2">
            <Label htmlFor="inStock">In Stock</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={variant.in_stock}
                onChange={(e) => isNew 
                  ? setNewVariant({ ...newVariant, in_stock: e.target.checked })
                  : setEditingVariant({ ...editingVariant!, in_stock: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="inStock" className="text-sm">Available for purchase</Label>
            </div>
          </div>

          {/* On Sale */}
          <div className="space-y-2">
            <Label htmlFor="onSale">On Sale</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="onSale"
                checked={variant.on_sale}
                onChange={(e) => isNew 
                  ? setNewVariant({ ...newVariant, on_sale: e.target.checked })
                  : setEditingVariant({ ...editingVariant!, on_sale: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="onSale" className="text-sm">Currently discounted</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => handleSaveVariant(isNew ? newVariant : editingVariant!)}
            disabled={loading || !variant.sku || !variant.color || !variant.size || variant.original_price <= 0 || variant.current_price <= 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Variant'}
          </Button>
          <Button variant="outline" onClick={cancelEdit}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-gray-600">
            Manage variants for {productName} ({category})
          </p>
        </div>
        <Button onClick={handleAddVariant} disabled={isAddingVariant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAddingVariant && renderVariantForm(newVariant, true)}
      {editingVariant && renderVariantForm(editingVariant, false)}

      {/* Variants List */}
      <div className="space-y-4">
        <h4 className="font-medium">Current Variants ({variants.length})</h4>
        
        {loading && variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Loading variants...</div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No variants added yet</p>
            <p className="text-sm">Click "Add Variant" to create your first variant</p>
          </div>
        ) : (
          variants.map((variant) => (
            <Card key={variant.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* SKU */}
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <Badge variant="outline" className="font-mono text-xs">
                        {variant.sku}
                      </Badge>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{variant.color}</span>
                    </div>

                    {/* Size */}
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{variant.size}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        £{variant.current_price.toFixed(2)}
                        {variant.original_price > variant.current_price && (
                          <span className="text-gray-500 line-through ml-2">
                            £{variant.original_price.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${variant.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {variant.in_stock ? `${variant.stock_quantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex gap-1">
                      {variant.on_sale && (
                        <Badge variant="destructive" className="text-xs">SALE</Badge>
                      )}
                      {!variant.in_stock && (
                        <Badge variant="secondary" className="text-xs">OUT OF STOCK</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVariant(variant)}
                      disabled={editingVariant !== null}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVariant(variant.id!)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
