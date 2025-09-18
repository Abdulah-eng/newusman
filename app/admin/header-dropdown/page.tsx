"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Search, Save, ArrowLeft, Check, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { uploadToSupabase } from '@/lib/image-upload'

interface SimpleProduct {
  id: string
  name: string
  current_price?: number
  product_images?: { image_url?: string }[]
  category_slug?: string
}

interface DropdownItem {
  slot_index: number
  product_id: string | null
  custom_image?: string
  discount_percentage?: number
  discount_price?: number
}

const CATEGORY_SLOTS: Record<string, number> = {
  mattresses: 3,
  beds: 3,
  sofas: 3,
  pillows: 4,
  toppers: 4,
  bunkbeds: 4,
  kids: 4,
  guides: 4,
}

const CATEGORY_LABELS: Record<string, string> = {
  mattresses: 'Mattresses',
  beds: 'Beds',
  sofas: 'Sofas',
  pillows: 'Pillows',
  toppers: 'Toppers',
  bunkbeds: 'Bunkbeds',
  kids: 'Kids',
  guides: 'Guides',
}

export default function HeaderDropdownAdminPage() {
  const [category, setCategory] = useState<string>('mattresses')
  const [allProducts, setAllProducts] = useState<SimpleProduct[]>([])
  const [search, setSearch] = useState('')
  const [slots, setSlots] = useState<DropdownItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const maxSlots = CATEGORY_SLOTS[category] || 4

  useEffect(() => {
    // initialize slots when category changes
    setSlots(Array.from({ length: maxSlots }, (_, i) => ({ 
      slot_index: i, 
      product_id: null,
      custom_image: '',
      discount_percentage: undefined,
      discount_price: undefined
    })))
  }, [category, maxSlots])

  useEffect(() => {
    // fetch configured items for category
    const fetchConfigured = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/header-dropdown/${category}?limit=${maxSlots}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.products)) {
            const byIndex = data.products.reduce((acc: any, p: any, idx: number) => {
              acc[idx] = {
                product_id: p.id,
                custom_image: p.custom_image || '',
                discount_percentage: p.discount_percentage || undefined,
                discount_price: p.discount_price || undefined
              }
              return acc
            }, {})
            setSlots(prev => prev.map(s => ({ 
              ...s, 
              product_id: byIndex[s.slot_index]?.product_id || s.product_id,
              custom_image: byIndex[s.slot_index]?.custom_image || s.custom_image,
              discount_percentage: byIndex[s.slot_index]?.discount_percentage || s.discount_percentage,
              discount_price: byIndex[s.slot_index]?.discount_price || s.discount_price
            })))
          }
        }
      } catch (error) {
        console.error('Error fetching configured items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConfigured()
  }, [category, maxSlots])

  useEffect(() => {
    // fetch products for the selected category only (server-side filtered)
    const fetchProducts = async () => {
      setLoading(true)
      try {
        if (category === 'guides') {
          // Handle guides differently - fetch from homepage content API like the guides page does
          const res = await fetch('/api/homepage-content')
          if (res.ok) {
            const data = await res.json()
            // Transform ideas_guides data to match SimpleProduct interface
            const ideasGuides = data.ideas_guides || []
            const transformedGuides = ideasGuides.map((guide: any) => ({
              id: guide.id || `guide-${Math.random()}`,
              name: guide.heading || guide.title || 'Untitled Guide',
              current_price: null,
              product_images: guide.image ? [{ image_url: guide.image }] : [],
              category_slug: 'guides'
            }))
            setAllProducts(transformedGuides)
          } else {
            setAllProducts([])
          }
        } else {
          const res = await fetch(`/api/products/category/${category}?limit=1000`)
          if (res.ok) {
            const data = await res.json()
            setAllProducts(data.products || [])
          } else {
            setAllProducts([])
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allProducts
    return allProducts.filter(p => p.name?.toLowerCase().includes(q))
  }, [allProducts, search])

  const setSlotProduct = (slotIndex: number, productId: string) => {
    setSlots(prev => prev.map(s => (s.slot_index === slotIndex ? { ...s, product_id: productId } : s)))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (category === 'guides') {
        // Handle guides differently - save to homepage content
        const selectedGuides = slots
          .filter(s => s.product_id)
          .map(s => {
            const guide = allProducts.find(p => p.id === s.product_id)
            return {
              id: guide?.id || `guide-${Math.random()}`,
              heading: guide?.name || 'Untitled Guide',
              image: guide?.product_images?.[0]?.image_url || '/placeholder.jpg',
              description: 'Guide description',
              timeToRead: '5 min read'
            }
          })
        
        // Update the ideas_guides section in homepage_content
        const res = await fetch('/api/homepage-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'ideas_guides',
            content: selectedGuides
          })
        })
        
        if (res.ok) {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        } else {
          alert('Failed to save guide configuration')
        }
      } else {
        // Handle other categories normally
        const items = slots
          .filter(s => s.product_id)
          .map(s => ({ 
            slot_index: s.slot_index, 
            product_id: s.product_id,
            custom_image: s.custom_image || null,
            discount_percentage: s.discount_percentage || null,
            discount_price: s.discount_price || null
          }))
        
        const res = await fetch(`/api/header-dropdown/${category}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        })
        
        if (res.ok) {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        } else {
          alert('Failed to save configuration')
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving configuration')
    } finally {
      setSaving(false)
    }
  }

  const getSelectedProduct = (slotIndex: number) => {
    const slot = slots.find(s => s.slot_index === slotIndex)
    return slot?.product_id ? allProducts.find(p => p.id === slot.product_id) : null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Header Dropdown Products</h1>
              <p className="text-gray-600 mt-1">Configure which products appear in header dropdowns</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left: Category Selection and Slots */}
          <div className="xl:col-span-1 space-y-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="category-select">Select Category</Label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Selected Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Products</CardTitle>
                <p className="text-sm text-gray-600">
                  {slots.filter(s => s.product_id).length} of {maxSlots} products selected for {CATEGORY_LABELS[category]} dropdown
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {slots.map((slot) => {
                  const selectedProduct = getSelectedProduct(slot.slot_index)
                  return (
                    <div key={slot.slot_index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Slot {slot.slot_index + 1}</h4>
                        {selectedProduct && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSlotProduct(slot.slot_index, '')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      {selectedProduct ? (
                        <div className="space-y-4">
                          {/* Product Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img 
                                src={slot.custom_image || selectedProduct.product_images?.[0]?.image_url || '/placeholder.jpg'} 
                                alt={selectedProduct.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {selectedProduct.name}
                              </div>
                              <div className="text-xs text-gray-600">£{selectedProduct.current_price}</div>
                            </div>
                          </div>

                          {/* Custom Image Upload */}
                          <div>
                            <Label className="block mb-2 text-sm font-medium">Custom Image (Optional)</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                              {slot.custom_image ? (
                                <div className="relative">
                                  <img 
                                    src={slot.custom_image} 
                                    alt="Custom preview" 
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSlots(prev => prev.map(s => 
                                      s.slot_index === slot.slot_index ? { ...s, custom_image: '' } : s
                                    ))}
                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 mb-2">Upload custom image</p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        try {
                                          const imageUrl = await uploadToSupabase(file)
                                          setSlots(prev => prev.map(s => 
                                            s.slot_index === slot.slot_index ? { ...s, custom_image: imageUrl } : s
                                          ))
                                        } catch (error) {
                                          console.error('Error uploading image:', error)
                                          alert('Error uploading image. Please try again.')
                                        }
                                      }
                                    }}
                                    className="hidden"
                                    id={`slot-image-${slot.slot_index}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById(`slot-image-${slot.slot_index}`)?.click()}
                                  >
                                    <Upload className="w-3 h-3 mr-1" />
                                    Choose Image
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Discount Configuration */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="block mb-1 text-sm font-medium">Discount %</Label>
                              <Input
                                type="number"
                                placeholder="e.g., 30"
                                value={slot.discount_percentage || ''}
                                onChange={(e) => setSlots(prev => prev.map(s => 
                                  s.slot_index === slot.slot_index ? { 
                                    ...s, 
                                    discount_percentage: e.target.value ? parseInt(e.target.value) : undefined 
                                  } : s
                                ))}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label className="block mb-1 text-sm font-medium">Discount Price</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 299.99"
                                value={slot.discount_price || ''}
                                onChange={(e) => setSlots(prev => prev.map(s => 
                                  s.slot_index === slot.slot_index ? { 
                                    ...s, 
                                    discount_price: e.target.value ? parseFloat(e.target.value) : undefined 
                                  } : s
                                ))}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No product selected</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSave} 
              disabled={saving || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>

          {/* Right: All Products Grid */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Products - {CATEGORY_LABELS[category]}</CardTitle>
                <p className="text-sm text-gray-600">
                  Click any product to add it to the dropdown. Selected products are highlighted.
                </p>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products by name..."
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading products...</span>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">
                      {search ? 'Try a different search term' : `No products available for ${CATEGORY_LABELS[category]}`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(product => {
                      const img = product.product_images?.[0]?.image_url
                      const isSelected = slots.some(s => s.product_id === product.id)
                      const selectedSlot = slots.find(s => s.product_id === product.id)
                      
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            if (isSelected) {
                              // Remove from selection
                              setSlotProduct(selectedSlot!.slot_index, '')
                            } else {
                              // Add to first empty slot or replace first slot
                              const emptySlot = slots.find(s => !s.product_id)
                              const slotIndex = emptySlot ? emptySlot.slot_index : 0
                              setSlotProduct(slotIndex, product.id)
                            }
                          }}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                          }`}
                        >
                          <div className="p-4">
                            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                              {img ? (
                                <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-12 h-12 text-gray-400" />
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                              {product.name}
                            </h3>
                            {product.current_price && (
                              <p className="text-orange-600 font-semibold text-sm">
                                £{product.current_price}
                              </p>
                            )}
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4" />
                                </div>
                              </div>
                            )}
                            {isSelected && selectedSlot && (
                              <div className="absolute top-2 left-2">
                                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                  Slot {selectedSlot.slot_index + 1}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


