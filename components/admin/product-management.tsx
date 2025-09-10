"use client"

import { useState, useEffect } from 'react'
import { ProductDetailHappy } from "@/components/product-detail-happy"
import { ProductCard } from "@/components/product-card"
import { Check, Plus, X, Edit2, Save, Trash2, Upload, Eye, EyeOff, RefreshCw, Package } from "lucide-react"
import Image from "next/image"
import { VariantManagement } from './variant-management'

interface ProductManagementProps {
  category: string
}

export function ProductManagement({ category }: ProductManagementProps) {
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [alsoViewed, setAlsoViewed] = useState<any[]>([])
  const [isEditingMode, setIsEditingMode] = useState(true)
  const [variants, setVariants] = useState<any[]>([])
  const [variantsLoading, setVariantsLoading] = useState(false)

  // Helper function to update both selectedProduct and products array
  const updateProduct = (field: string, value: any) => {
    const updatedProduct = { ...selectedProduct, [field]: value }
    setSelectedProduct(updatedProduct)
    
    // Update the product in the products array
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? updatedProduct : p
    ))
  }

  // Check if product has a valid database ID (not sample data)
  const hasValidProductId = (product: any) => {
    const isValid = product && product.id && typeof product.id === 'string' && product.id.length > 10
    console.log('Product ID check:', { 
      product, 
      id: product?.id, 
      type: typeof product?.id, 
      length: product?.id?.length, 
      isValid 
    })
    return isValid
  }

  // Load variants for a product
  const loadVariants = async (productId: string) => {
    if (!hasValidProductId({ id: productId })) return
    
    try {
      setVariantsLoading(true)
      const response = await fetch(`/api/variants?productId=${productId}&category=${category}`)
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Error loading variants:', error)
    } finally {
      setVariantsLoading(false)
    }
  }

  // Refresh variants (called when variants are updated)
  const refreshVariants = () => {
    if (selectedProduct?.id) {
      loadVariants(selectedProduct.id)
    }
  }

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`)
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            setProducts(data.products)
            setSelectedProduct(data.products[0])
            setAlsoViewed(data.products.slice(1, 5))
            // Load variants for the first product
            if (data.products[0]?.id) {
              loadVariants(data.products[0].id)
            }
          } else {
            // Fallback to sample data if no products found
            const sampleProducts = [
              {
                id: 1,
                name: `Premium ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                brand: 'SleepWell',
                brandColor: 'blue',
                badge: 'On Sale',
                badgeColor: 'orange',
                image: '/placeholder.svg',
                rating: 4.8,
                reviewCount: 127,
                firmness: 'Medium',
                firmnessLevel: 6,
                features: ['Premium Quality', 'Advanced Technology', 'Expert Craftsmanship'],
                originalPrice: 599,
                currentPrice: 499,
                savings: 100,
                freeDelivery: 'Free',
                setupService: false,
                setupCost: 0,
                certifications: ['OEKO-TEX', 'Made in UK'],
                sizes: ['Single', 'Double', 'Queen', 'King', 'Super King'],
                selectedSize: 'Queen',
                monthlyPrice: 49.99,
                images: ['/placeholder.svg'],
                category: category,
                type: 'Standard',
                size: 'Queen Size',
                comfortLevel: 'Medium',
                inStore: true,
                onSale: true,
                shortDescription: `Premium ${category} for ultimate comfort and support.`,
                longDescription: `Experience the ultimate in ${category} comfort and support with our premium range.`,
                colors: ['White', 'Gray', 'Beige'],
                materials: ['Premium Fabric', 'Memory Foam'],
                dimensions: { height: '25cm', length: '200cm', width: '150cm', weightCapacity: '150kg' },
                dispatchTime: 'Tomorrow',
                reasonsToBuy: ['Premium Quality', 'Expert Craftsmanship', 'Advanced Technology'],
                descriptionParagraph1: `First paragraph of ${category} description with detailed information about the product features and benefits.`,
                descriptionParagraph2: `Second paragraph explaining the technology and materials used in this premium ${category}.`,
                descriptionParagraph3: `Third paragraph covering warranty, care instructions, and why customers choose this ${category}.`,
                descriptionImage1: '/placeholder.svg',
                descriptionImage2: '/placeholder.svg',
                descriptionImage3: '/placeholder.svg',
                firmnessScaleImage: '/placeholder.svg',
                productQuestions: [
                  { question: 'What is the warranty period?', answer: '10 years comprehensive warranty' },
                  { question: 'How long does delivery take?', answer: 'Free delivery tomorrow' }
                ],
                warrantyInfo: { period: '10 Years', coverage: 'Comprehensive warranty covering manufacturing defects', exclusions: 'Normal wear and tear' },
                careInstructions: 'Regular vacuuming and spot cleaning recommended. Professional cleaning every 6 months.',
                careImage: '/placeholder.svg',
                stockQuantity: 50,
                inStock: true,
                // Filter fields
                filterMattressType: ['Memory Foam', 'Innerspring'],
                filterFirmness: ['Medium', 'Firm'],
                filterSizes: ['Queen', 'King'],
                filterFeatures: ['Premium Quality', 'Advanced Technology'],
                filterBrand: ['SleepWell'],
                filterMaterial: ['Memory Foam', 'Premium Fabric'],
                filterMinPrice: 400,
                filterMaxPrice: 600,
                filterInStore: true,
                filterOnSale: true
              }
            ]
            
            setProducts(sampleProducts)
            setSelectedProduct(sampleProducts[0])
            setAlsoViewed(sampleProducts.slice(1))
          }
        }
      } catch (error) {
        console.error('Error loading products:', error)
        // Fallback to sample data on error
        const sampleProducts = [
          {
            id: 1,
            name: `Premium ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            brand: 'SleepWell',
            brandColor: 'blue',
            badge: 'On Sale',
            badgeColor: 'orange',
            image: '/placeholder.svg',
            rating: 4.8,
            reviewCount: 127,
            firmness: 'Medium',
            firmnessLevel: 6,
            features: ['Premium Quality', 'Advanced Technology', 'Expert Craftsmanship'],
            originalPrice: 599,
            currentPrice: 499,
            savings: 100,
            freeDelivery: 'Free',
            setupService: false,
            setupCost: 0,
            certifications: ['OEKO-TEX', 'Made in UK'],
            sizes: ['Single', 'Double', 'Queen', 'King', 'Super King'],
            selectedSize: 'Queen',
            monthlyPrice: 49.99,
            images: ['/placeholder.svg'],
            category: category,
            type: 'Standard',
            size: 'Queen Size',
            comfortLevel: 'Medium',
            inStore: true,
            onSale: true,
            shortDescription: `Premium ${category} for ultimate comfort and support.`,
            longDescription: `Experience the ultimate in ${category} comfort and support with our premium range.`,
            colors: ['White', 'Gray', 'Beige'],
            materials: ['Premium Fabric', 'Memory Foam'],
            dimensions: { height: '25cm', length: '200cm', width: '150cm', weightCapacity: '150kg' },
            dispatchTime: 'Tomorrow',
            reasonsToBuy: ['Premium Quality', 'Expert Craftsmanship', 'Advanced Technology'],
            descriptionParagraph1: `First paragraph of ${category} description with detailed information about the product features and benefits.`,
            descriptionParagraph2: `Second paragraph explaining the technology and materials used in this premium ${category}.`,
            descriptionParagraph3: `Third paragraph covering warranty, care instructions, and why customers choose this ${category}.`,
            descriptionImage1: '/placeholder.svg',
            descriptionImage2: '/placeholder.svg',
            descriptionImage3: '/placeholder.svg',
            firmnessScaleImage: '/placeholder.svg',
            productQuestions: [
              { question: 'What is the warranty period?', answer: '10 years comprehensive warranty' },
              { question: 'How long does delivery take?', answer: 'Free delivery tomorrow' }
            ],
            warrantyInfo: { period: '10 Years', coverage: 'Comprehensive warranty covering manufacturing defects', exclusions: 'Normal wear and tear' },
            careInstructions: 'Regular vacuuming and spot cleaning recommended. Professional cleaning every 6 months.',
            careImage: '/placeholder.svg',
            stockQuantity: 50,
            inStock: true,
            // Filter fields
            filterMattressType: ['Memory Foam', 'Innerspring'],
            filterFirmness: ['Medium', 'Firm'],
            filterSizes: ['Queen', 'King'],
            filterFeatures: ['Premium Quality', 'Advanced Technology'],
            filterBrand: ['SleepWell'],
            filterMaterial: ['Memory Foam', 'Premium Fabric'],
            filterMinPrice: 400,
            filterMaxPrice: 600,
            filterInStore: true,
            filterOnSale: true
          }
        ]
        
        setProducts(sampleProducts)
        setSelectedProduct(sampleProducts[0])
        setAlsoViewed(sampleProducts.slice(1))
      }
    }

    loadProducts()
  }, [category])

  // Load variants when selected product changes
  useEffect(() => {
    if (selectedProduct?.id) {
      loadVariants(selectedProduct.id)
    }
  }, [selectedProduct?.id])

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  // Inline editable text component
  const EditableText = ({ value, onSave, className = "" }: { value: string, onSave: (value: string) => void, className?: string }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setIsEditing(false)
    }

    if (isEditing && isEditingMode) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`flex-1 p-1 border border-orange-300 rounded bg-white ${className}`}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              setEditValue(value)
              setIsEditing(false)
            }}
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className={className}>{value}</span>
        {isEditingMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-opacity"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  // Inline editable number component
  const EditableNumber = ({ value, onSave, className = "" }: { value: number, onSave: (value: number) => void, className?: string }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value.toString())

    const handleSave = () => {
      const numValue = parseFloat(editValue)
      if (!isNaN(numValue)) {
        onSave(numValue)
        setIsEditing(false)
      }
    }

    if (isEditing && isEditingMode) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`flex-1 p-1 border border-orange-300 rounded bg-white ${className}`}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              setEditValue(value.toString())
              setIsEditing(false)
            }}
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className={className}>{value}</span>
        {isEditingMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-opacity"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  // Inline editable image component
  const EditableImage = ({ value, onSave, className = "" }: { value: string, onSave: (value: string) => void, className?: string }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
      onSave(editValue)
      setIsEditing(false)
    }

    if (isEditing && isEditingMode) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const url = URL.createObjectURL(file)
                setEditValue(url)
              }
            }}
            className="flex-1 p-1 border border-orange-300 rounded bg-white"
          />
          <button
            onClick={() => {
              setEditValue('')
              onSave('')
              setIsEditing(false)
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            title="Delete image"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              setEditValue(value)
              setIsEditing(false)
            }}
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )
    }

    return (
      <div className="relative inline-flex items-center gap-2 group">
        <img src={value || '/placeholder.svg'} alt="Product" className={`w-20 h-20 object-cover rounded ${className}`} />
        {isEditingMode && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-opacity"
              title="Change image"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onSave('')}
              className="opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-opacity"
              title="Delete image"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    )
  }

  // Inline editable array component
  const EditableArray = ({ items, onSave }: { items: string[], onSave: (value: string[]) => void }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(items.join(', '))

    const handleSave = () => {
      const newItems = editValue.split(',').map(item => item.trim()).filter(item => item)
      onSave(newItems)
      setIsEditing(false)
    }

    if (isEditing && isEditingMode) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 p-1 border border-orange-300 rounded bg-white"
            placeholder="Enter items separated by commas"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              setEditValue(items.join(', '))
              setIsEditing(false)
            }}
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <div className="flex flex-wrap gap-1">
          {items.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              {item}
            </span>
          ))}
        </div>
        {isEditingMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-opacity"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  // Transform product data for ProductDetailHappy component
  const productDetail = {
    ...selectedProduct,
    // Add any additional transformations needed
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Edit Mode Toggle */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{category.charAt(0).toUpperCase() + category.slice(1)} Management</h2>
              <p className="text-gray-600 mt-1">
                View and manage {category} products with inline editing • {products.length} product{products.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Add Product Button */}
              <button
                onClick={() => {
                  const newProduct = {
                    id: Date.now(), // Temporary ID
                    name: `New ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    brand: 'New Brand',
                    brandColor: 'blue',
                    badge: 'New',
                    badgeColor: 'green',
                    image: '/placeholder.svg',
                    rating: 4.0,
                    reviewCount: 0,
                    firmness: 'Medium',
                    firmnessLevel: 6,
                    features: ['New Product', 'Quality', 'Comfort'],
                    originalPrice: 299,
                    currentPrice: 249,
                    savings: 50,
                    freeDelivery: 'Free',
                    setupService: false,
                    setupCost: 0,
                    certifications: ['OEKO-TEX'],
                    sizes: ['Single', 'Double', 'King'],
                    selectedSize: 'Double',
                    monthlyPrice: 24.99,
                    images: ['/placeholder.svg'],
                    category: category,
                    type: 'Standard',
                    size: 'Double Size',
                    comfortLevel: 'Medium',
                    inStore: true,
                    onSale: true,
                    shortDescription: `New ${category} for comfort and support.`,
                    longDescription: `Experience comfort and support with our new ${category}.`,
                    colors: ['White', 'Gray'],
                    materials: ['Premium Fabric'],
                    dimensions: { height: '25cm', length: '200cm', width: '150cm', weightCapacity: '150kg' },
                    dispatchTime: 'Tomorrow',
                    reasonsToBuy: ['New Product', 'Quality', 'Comfort'],
                    descriptionParagraph1: `First paragraph of new ${category} description.`,
                    descriptionParagraph2: `Second paragraph explaining the features.`,
                    descriptionParagraph3: `Third paragraph covering benefits.`,
                    descriptionImage1: '/placeholder.svg',
                    descriptionImage2: '/placeholder.svg',
                    descriptionImage3: '/placeholder.svg',
                    firmnessScaleImage: '/placeholder.svg',
                    productQuestions: [
                      { question: 'What is the warranty period?', answer: '5 years warranty' },
                      { question: 'How long does delivery take?', answer: 'Free delivery tomorrow' }
                    ],
                    warrantyInfo: { period: '5 Years', coverage: 'Basic warranty', exclusions: 'Normal wear and tear' },
                    careInstructions: 'Regular cleaning recommended.',
                    careImage: '/placeholder.svg',
                    stockQuantity: 25,
                    inStock: true,
                    // Filter fields
                    filterMattressType: ['Memory Foam'],
                    filterFirmness: ['Medium'],
                    filterSizes: ['Double'],
                    filterFeatures: ['New Product', 'Quality'],
                    filterBrand: ['New Brand'],
                    filterMaterial: ['Premium Fabric'],
                    filterMinPrice: 200,
                    filterMaxPrice: 400,
                    filterInStore: true,
                    filterOnSale: true
                  }
                  setProducts(prev => [...prev, newProduct])
                  setSelectedProduct(newProduct)
                  setAlsoViewed(products.slice(0, 4))
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>

              {/* Delete Product Button */}
              {products.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${selectedProduct.name}"?`)) {
                      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id))
                      const remainingProducts = products.filter(p => p.id !== selectedProduct.id)
                      if (remainingProducts.length > 0) {
                        setSelectedProduct(remainingProducts[0])
                        setAlsoViewed(remainingProducts.slice(1, 5))
                      } else {
                        setSelectedProduct(null)
                        setAlsoViewed([])
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Product
                </button>
              )}
              
              <button
                onClick={() => setIsEditingMode(!isEditingMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isEditingMode 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {isEditingMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isEditingMode ? 'View Mode' : 'Edit Mode'}
              </button>
              
              <select 
                value={selectedProduct.id} 
                onChange={(e) => {
                  const product = products.find(p => p.id === Number(e.target.value))
                  if (product) {
                    setSelectedProduct(product)
                    setAlsoViewed(products.filter(p => p.id !== product.id).slice(0, 4))
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - £{product.currentPrice} ({product.brand})
                  </option>
                ))}
              </select>

              {/* Save Changes Button */}
              <button
                onClick={async () => {
                  try {
                    // Prepare data for API
                    const apiData = {
                      ...selectedProduct,
                      category: category,
                      // Ensure arrays are properly formatted
                      images: selectedProduct.images || [],
                      features: selectedProduct.features || [],
                      sizes: selectedProduct.sizes || [],
                      colors: selectedProduct.colors || [],
                      materials: selectedProduct.materials || [],
                      reasonsToBuy: selectedProduct.reasonsToBuy || [],
                      productQuestions: selectedProduct.productQuestions || [],
                      // Ensure dimensions is properly formatted
                      dimensions: selectedProduct.dimensions || {},
                      // Ensure warranty info is properly formatted
                      warrantyInfo: selectedProduct.warrantyInfo || {},
                      // Ensure filter arrays are properly formatted
                      filterMattressType: selectedProduct.filterMattressType || [],
                      filterFirmness: selectedProduct.filterFirmness || [],
                      filterSizes: selectedProduct.filterSizes || [],
                      filterFeatures: selectedProduct.filterFeatures || [],
                      filterBrand: selectedProduct.filterBrand || [],
                      filterMaterial: selectedProduct.filterMaterial || []
                    }

                    console.log('Sending data to API:', JSON.stringify(apiData, null, 2))

                    // Save to Supabase
                    const response = await fetch(`/api/products`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(apiData)
                    })

                    console.log('Response status:', response.status)
                    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

                    if (response.ok) {
                      const result = await response.json()
                      console.log('Success response:', result)
                      alert('Product saved successfully!')
                      
                      // Update the product ID if it's a new product
                      if (result.product?.id && selectedProduct.id === Date.now()) {
                        updateProduct('id', result.product.id)
                      }
                    } else {
                      const errorText = await response.text()
                      console.error('Error response:', errorText)
                      let errorMessage = 'Unknown error'
                      
                      try {
                        const errorJson = JSON.parse(errorText)
                        errorMessage = errorJson.details || errorJson.error || errorText
                      } catch {
                        errorMessage = errorText
                      }
                      
                      alert(`Error saving product: ${errorMessage}`)
                    }
                  } catch (error) {
                    console.error('Error saving product:', error)
                    alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`)
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>

              {/* Reset Changes Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all changes? This will reload the original data.')) {
                    // Reload the original data
                    window.location.reload()
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Reset Changes
              </button>

              {/* Refresh Products Button */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`)
                    if (response.ok) {
                      const data = await response.json()
                      if (data.products && data.products.length > 0) {
                        setProducts(data.products)
                        setSelectedProduct(data.products[0])
                        setAlsoViewed(data.products.slice(1, 5))
                        alert('Products refreshed from database!')
                      } else {
                        alert('No products found in database')
                      }
                    } else {
                      alert('Error refreshing products')
                    }
                  } catch (error) {
                    console.error('Error refreshing products:', error)
                    alert('Error refreshing products')
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Product Detail Page - Now with Inline Editing */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details - Inline Editable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <EditableText
                  value={selectedProduct.name}
                  onSave={(value) => updateProduct('name', value)}
                  className="text-xl font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <EditableText
                  value={selectedProduct.brand}
                  onSave={(value) => updateProduct('brand', value)}
                  className="text-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <EditableNumber
                  value={selectedProduct.rating}
                  onSave={(value) => updateProduct('rating', value)}
                  className="text-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
                <EditableNumber
                  value={selectedProduct.reviewCount}
                  onSave={(value) => updateProduct('reviewCount', value)}
                  className="text-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <EditableNumber
                  value={selectedProduct.originalPrice}
                  onSave={(value) => updateProduct('originalPrice', value)}
                  className="text-lg text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                <EditableNumber
                  value={selectedProduct.currentPrice}
                  onSave={(value) => updateProduct('currentPrice', value)}
                  className="text-lg text-gray-700"
                />
              </div>
              
              {/* Product Images Array */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(selectedProduct.images || []).map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <img src={image || '/placeholder.svg'} alt={`Image ${index+1}`} className="w-full h-28 object-cover rounded" />
                      {isEditingMode && (
                        <>
                          <button
                            onClick={() => {
                              const newImages = (selectedProduct.images || []).filter((_: string, i: number) => i !== index)
                              updateProduct('images', newImages)
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100"
                            title="Delete image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <label className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer opacity-0 group-hover:opacity-100">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const url = URL.createObjectURL(file)
                                  const newImages = [...(selectedProduct.images || [])]
                                  newImages[index] = url
                                  updateProduct('images', newImages)
                                }
                              }}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditingMode && (
                    <label className="flex items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded text-gray-500 cursor-pointer hover:border-gray-400">
                      <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const url = URL.createObjectURL(file)
                            const newImages = [...(selectedProduct.images || []), url]
                            updateProduct('images', newImages)
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inline Editable Premium Sleep Experience */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Sleep Experience - Inline Editable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <EditableText
                  value={selectedProduct.premiumSleepTitle || 'Premium Sleep Experience'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, premiumSleepTitle: value }))}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <EditableText
                  value={selectedProduct.premiumSleepDescription || 'Experience the ultimate in sleep comfort and support.'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, premiumSleepDescription: value }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <EditableArray
                  items={selectedProduct.premiumSleepFeatures || ['Advanced comfort technology', 'Premium materials', 'Expert craftsmanship']}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, premiumSleepFeatures: value }))}
                />
              </div>
            </div>
          </div>

          {/* Inline Editable Features You'll Love */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features You'll Love - Inline Editable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <EditableText
                  value={selectedProduct.featuresTitle || 'Features You\'ll Love'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, featuresTitle: value }))}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features List</label>
                <EditableArray
                  items={selectedProduct.featuresList || ['Temperature regulation', 'Motion isolation', 'Edge support']}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, featuresList: value }))}
                />
              </div>
            </div>
          </div>

          {/* Product Variants Management */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Variants
            </h3>
            
            {hasValidProductId(selectedProduct) ? (
              <VariantManagement 
                productId={selectedProduct.id} 
                category={category} 
                productName={selectedProduct.name || 'Product'} 
                onVariantsUpdated={refreshVariants}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Variants not available for this product</p>
                <p className="text-sm">
                  This product appears to be sample data or doesn't have a valid database ID. 
                  Variants can only be added to products that have been saved to the database.
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Product ID:</strong> {selectedProduct?.id || 'None'} 
                    {selectedProduct?.id && typeof selectedProduct.id === 'string' && selectedProduct.id.length <= 10 && (
                      <span className="text-orange-600 ml-2">(Sample data - not a real database product)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Inline Editable Firmness Scale */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Firmness Scale - Inline Editable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firmness Level</label>
                <EditableNumber
                  value={selectedProduct.firmnessLevel}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, firmnessLevel: value }))}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firmness Description</label>
                <EditableText
                  value={selectedProduct.firmnessDescription || 'Medium-Firm: Perfect balance of comfort and support'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, firmnessDescription: value }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firmness Scale Image</label>
                <EditableImage
                  value={selectedProduct.firmnessScaleImage}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, firmnessScaleImage: value }))}
                />
              </div>
            </div>
          </div>

          {/* Inline Editable Description */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description - Inline Editable (3 Paragraphs + 3 Images)</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                <EditableText
                  value={selectedProduct.descriptionParagraph1}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, descriptionParagraph1: value }))}
                  className="text-base"
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image 1</label>
                  <EditableImage
                    value={selectedProduct.descriptionImage1}
                    onSave={(value) => updateProduct('descriptionImage1', value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                <EditableText
                  value={selectedProduct.descriptionParagraph2}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, descriptionParagraph2: value }))}
                  className="text-base"
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image 2</label>
                  <EditableImage
                    value={selectedProduct.descriptionImage2}
                    onSave={(value) => updateProduct('descriptionImage2', value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                <EditableText
                  value={selectedProduct.descriptionParagraph3}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, descriptionParagraph3: value }))}
                  className="text-base"
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image 3</label>
                  <EditableImage
                    value={selectedProduct.descriptionImage3}
                    onSave={(value) => updateProduct('descriptionImage3', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inline Editable Dimensions */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions - Inline Editable</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <EditableText
                  value={selectedProduct.dimensions?.height || ''}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, height: value }
                  }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <EditableText
                  value={selectedProduct.dimensions?.length || ''}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, length: value }
                  }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <EditableText
                  value={selectedProduct.dimensions?.width || ''}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, width: value }
                  }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight Capacity</label>
                <EditableText
                  value={selectedProduct.dimensions?.weightCapacity || '150kg'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, weightCapacity: value }
                  }))}
                  className="text-base"
                />
              </div>
            </div>
          </div>

          {/* Inline Editable Product Questions */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Questions - Inline Editable</h3>
            <div className="space-y-4">
              {selectedProduct.productQuestions?.map((qa: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question {index + 1}</label>
                    <EditableText
                      value={qa.question}
                      onSave={(value) => {
                        const newQuestions = [...selectedProduct.productQuestions]
                        newQuestions[index].question = value
                        setSelectedProduct((prev: any) => ({ ...prev, productQuestions: newQuestions }))
                      }}
                      className="text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer {index + 1}</label>
                    <EditableText
                      value={qa.answer}
                      onSave={(value) => {
                        const newQuestions = [...selectedProduct.productQuestions]
                        newQuestions[index].answer = value
                        setSelectedProduct((prev: any) => ({ ...prev, productQuestions: newQuestions }))
                      }}
                      className="text-base"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline Editable Warranty & Care */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty & Care - Inline Editable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Period</label>
                <EditableText
                  value={selectedProduct.warrantyInfo?.period || '10 Years'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    warrantyInfo: { ...prev.warrantyInfo, period: value }
                  }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Details</label>
                <EditableText
                  value={selectedProduct.warrantyInfo?.coverage || 'Comprehensive warranty covering manufacturing defects'}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ 
                    ...prev, 
                    warrantyInfo: { ...prev.warrantyInfo, coverage: value }
                  }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                <EditableText
                  value={selectedProduct.careInstructions}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, careInstructions: value }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care Image</label>
                <EditableImage
                  value={selectedProduct.careImage}
                  onSave={(value) => updateProduct('careImage', value)}
                />
              </div>
            </div>
          </div>

          {/* Inline Editable Frequently Bought Together */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Bought Together - Inline Editable</h3>
            <div className="space-y-4">
              {selectedProduct.frequentlyBoughtTogether?.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <EditableImage
                        value={item?.image || '/placeholder.svg'}
                        onSave={(value) => {
                          const newItems = [...(selectedProduct.frequentlyBoughtTogether || [])]
                          newItems[index].image = value
                          setSelectedProduct((prev: any) => ({ ...prev, frequentlyBoughtTogether: newItems }))
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <EditableText
                        value={item?.name || ''}
                        onSave={(value) => {
                          const newItems = [...(selectedProduct.frequentlyBoughtTogether || [])]
                          newItems[index].name = value
                          setSelectedProduct((prev: any) => ({ ...prev, frequentlyBoughtTogether: newItems }))
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Text</label>
                      <EditableText
                        value={item?.promotionalText || ''}
                        onSave={(value) => {
                          const newItems = [...(selectedProduct.frequentlyBoughtTogether || [])]
                          newItems[index].promotionalText = value
                          setSelectedProduct((prev: any) => ({ ...prev, frequentlyBoughtTogether: newItems }))
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                      <EditableText
                        value={item?.discount || ''}
                        onSave={(value) => {
                          const newItems = [...(selectedProduct.frequentlyBoughtTogether || [])]
                          newItems[index].discount = value
                          setSelectedProduct((prev: any) => ({ ...prev, frequentlyBoughtTogether: newItems }))
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {isEditingMode && (
                <button
                  onClick={() => {
                    const newItems = [...(selectedProduct.frequentlyBoughtTogether || []), {
                      image: '/placeholder.svg',
                      name: 'Add a pillow',
                      promotionalText: 'Save an extra 10%',
                      discount: '10% OFF'
                    }]
                    setSelectedProduct((prev: any) => ({ ...prev, frequentlyBoughtTogether: newItems }))
                  }}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-5 h-5 mx-auto" />
                </button>
              )}
            </div>
          </div>

          {/* Product Search Filters Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Search Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <EditableNumber
                  value={selectedProduct.filterMinPrice || 0}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, filterMinPrice: value }))}
                  className="text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <EditableNumber
                  value={selectedProduct.filterMaxPrice || 2000}
                  onSave={(value) => setSelectedProduct((prev: any) => ({ ...prev, filterMaxPrice: value }))}
                  className="text-base"
                />
              </div>
            </div>

            {/* Category-specific filters */}
            {category === 'mattresses' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mattress Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Memory Foam', 'Innerspring', 'Hybrid', 'Latex', 'Adjustable'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedProduct.filterMattressType?.includes(type) || false}
                                                 onChange={(e) => {
                           const currentTypes = selectedProduct.filterMattressType || []
                           const newTypes = e.target.checked
                             ? [...currentTypes, type]
                             : currentTypes.filter((t: string) => t !== type)
                           setSelectedProduct((prev: any) => ({ ...prev, filterMattressType: newTypes }))
                         }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="text-sm text-gray-600">
                Price: £{selectedProduct.filterMinPrice || 0} - £{selectedProduct.filterMaxPrice || 2000}
                {selectedProduct.filterMattressType?.length > 0 && (
                  <span className="ml-4">Types: {selectedProduct.filterMattressType.join(', ')}</span>
                )}
                {selectedProduct.filterFirmness?.length > 0 && (
                  <span className="ml-4">Firmness: {selectedProduct.filterFirmness.join(', ')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Detail Page - Exact Same as Frontend */}
        <div className="mt-8">
          <ProductDetailHappy product={productDetail} />
        </div>
        
        {/* Single Product Card at End */}
        <section className="mt-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <p className="text-gray-600">Check out this amazing product</p>
          </div>
          <div className="flex justify-center">
            <div className="max-w-sm">
              <ProductCard 
                product={{
                  // Always preview the currently selected/edited product
                  id: selectedProduct?.id || 1,
                  name: selectedProduct?.name || 'Featured Product',
                  brand: selectedProduct?.brand || 'Brand',
                  brandColor: selectedProduct?.brandColor || 'blue',
                  badge: selectedProduct?.badge || (selectedProduct?.onSale ? 'On Sale' : ''),
                  badgeColor: selectedProduct?.badgeColor || (selectedProduct?.onSale ? 'orange' : 'gray'),
                  image: selectedProduct?.image || selectedProduct?.mainImage || '/placeholder.svg',
                  images: selectedProduct?.images || [],
                  rating: selectedProduct?.rating || 4.0,
                  reviewCount: selectedProduct?.reviewCount || 0,
                  firmness: selectedProduct?.firmness || selectedProduct?.firmnessDescription || 'Medium',
                  firmnessLevel: selectedProduct?.firmnessLevel || 6,
                  features: selectedProduct?.features || ['Premium Quality'],
                  originalPrice: selectedProduct?.originalPrice || 0,
                  currentPrice: selectedProduct?.currentPrice || 0,
                  savings: selectedProduct?.savings || Math.max(0, (selectedProduct?.originalPrice || 0) - (selectedProduct?.currentPrice || 0)),
                  freeDelivery: selectedProduct?.freeDelivery || 'Tomorrow',
                  setupService: selectedProduct?.setupService || false,
                  setupCost: selectedProduct?.setupCost || 0,
                  certifications: selectedProduct?.certifications || ['OEKO-TEX', 'Made in UK'],
                  sizes: selectedProduct?.sizes || ['Single', 'Double', 'King', 'Super King'],
                  selectedSize: selectedProduct?.selectedSize || 'Queen',
                  monthlyPrice: selectedProduct?.monthlyPrice || 0,
                  category: selectedProduct?.category || category,
                  type: selectedProduct?.type || 'Standard',
                  price: selectedProduct?.currentPrice || 0
                }} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
