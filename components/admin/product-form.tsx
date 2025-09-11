"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Save,
  ArrowLeft,
  Package,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Settings,
  Shield,
  HelpCircle,
  Tag,
  Ruler,
  Truck,
  Gift,
  Star,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Clock,
  Check
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabaseClient'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { VariantManagement } from './variant-management'
import { ProductSelectionModal } from './product-selection-modal'

interface ProductFormProps {
  product?: any
  onClose: () => void
  onSubmit: () => void
}

interface ProductFormData {
  name: string
  slug: string
  brand_id: string
  category_id: string
  original_price: number
  current_price: number
  monthly_price: number
  main_image: string
  images: string[]
  short_description: string
  long_description: string
  sizes: string[]
  colors: string[]
  features: string[]
  materials: string[]
  in_stock: boolean
  stock_quantity: number
  featured: boolean
  on_sale: boolean
  dispatch_time: string
  setup_service: boolean
  setup_cost: number
  free_delivery: boolean
  has_variants: boolean
  rating: number
  review_count: number
  firmness: string
  firmness_level: number
  comfort_level: string
  dimensions: {
    height: string
    length: string
    width: string
    mattress_size: string
    max_height: string
    weight_capacity: string
    pocket_springs: string
    comfort_layer: string
    support_layer: string
    show_basic_dimensions: boolean
    show_mattress_specs: boolean
    show_technical_specs: boolean
  }
  reasons_to_buy: string[]
  promotional_offers: any[]
  product_questions: any[]
  warranty_info: any
  care_instructions: string
  warranty_delivery_line: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  description_sections?: {
    title: string;
    content: string;
    image: string;
    content2?: string;
  }[];
  feature_descriptions?: string[];
  feature_categories?: string[];
  feature_icons?: string[];
  product_specs?: {
    name: string;
    value: number;
    min: number;
    max: number;
    labels: string[];
  }[];
  product_spec_icons?: string[];
  badges?: {
    type: 'sale' | 'new_in' | 'free_gift';
    enabled: boolean;
  }[];
  free_gift_product_id?: string;
  free_gift_enabled?: boolean;
}

export function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  // Debug: Log the product object to see its structure
  console.log('ProductForm - product object:', product)
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 
    description: true, 
    specifications: true, 
    reviews: true,
    questions: true,
    warranty: true,
    dimensions: true
  })
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    slug: product?.slug || '',
    brand_id: product?.brand_id || '',
    category_id: product?.category_id || '',
    original_price: product?.original_price || 0,
    current_price: product?.current_price || 0,
    monthly_price: product?.monthly_price || 0,
    main_image: product?.main_image || '',
    images: product?.images || [],
    short_description: product?.short_description || '',
    long_description: product?.long_description || '',
    sizes: product?.sizes || ['Single', 'Double', 'King', 'Super King'],
    colors: product?.colors || ['White', 'Gray', 'Black'],
    features: product?.features || ['Premium Quality', 'Memory Foam'],
    materials: product?.materials || ['Cotton', 'Polyester'],
    in_stock: product?.in_stock ?? true,
    stock_quantity: product?.stock_quantity || 100,
    featured: product?.featured ?? false,
    on_sale: product?.on_sale ?? false,
    dispatch_time: product?.dispatch_time || 'Tomorrow',
    setup_service: product?.setup_service ?? false,
    setup_cost: product?.setup_cost || 0,
    free_delivery: product?.free_delivery ?? true,
    has_variants: product?.has_variants ?? false,
    rating: product?.rating || 4.5,
    review_count: product?.review_count || 50,
    firmness: product?.firmness || 'Medium',
    firmness_level: product?.firmness_level || 6,
    comfort_level: product?.comfort_level || 'Medium',
    dimensions: product?.dimensions || {
      height: '25 cm',
      length: 'L 190cm',
      width: '135cm',
      mattress_size: '135cm x L 190cm cm',
      max_height: '25 cm',
      weight_capacity: '200 kg',
      pocket_springs: '1000 count',
      comfort_layer: '8 cm',
      support_layer: '17 cm',
      show_basic_dimensions: true,
      show_mattress_specs: true,
      show_technical_specs: true
    },
    reasons_to_buy: product?.reasons_to_buy || ['100-Night Trial', 'Free Delivery', '1-Year Warranty'],
    promotional_offers: product?.promotional_offers || [],
    product_questions: product?.product_questions || [],
    warranty_info: product?.warranty_info || {},
    care_instructions: product?.care_instructions || '',
    warranty_delivery_line: product?.warranty_delivery_line || '1-Year Warranty • Free Delivery • 100-Night Trial',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
    meta_keywords: product?.meta_keywords || [],
    description_sections: product?.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }],
    feature_descriptions: product?.feature_descriptions || [],
    feature_categories: product?.feature_categories || [],
    feature_icons: product?.feature_icons || ['support', 'comfort', 'firmness'],
    product_specs: product?.product_specs || [
      { name: 'Support', value: 80, min: 0, max: 100, labels: ['Low', 'Medium', 'High'] },
      { name: 'Pressure Relief', value: 65, min: 0, max: 100, labels: ['Basic', 'Medium', 'Advanced'] },
      { name: 'Air Circulation', value: 80, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] },
      { name: 'Durability', value: 95, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] }
    ],
    product_spec_icons: product?.product_spec_icons || ['support', 'pressure', 'air', 'durability', 'quality'],
    badges: product?.badges || [],
    free_gift_product_id: product?.free_gift_product_id,
    free_gift_enabled: product?.free_gift_enabled
  })

  const [newFeature, setNewFeature] = useState('')
  const [newReason, setNewReason] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newMaterial, setNewMaterial] = useState('')
  const [selectedGiftProduct, setSelectedGiftProduct] = useState<any>(null)
  const [showProductSelectionModal, setShowProductSelectionModal] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchBrands()
    if (formData.images.length > 0) {
      setSelectedImage(0)
    }
    if (formData.colors.length > 0) {
      setSelectedColor(formData.colors[0])
    }
    if (formData.sizes.length > 0) {
      setSelectedSize(formData.sizes[0])
    }
  }, [])

  // Auto-setup sofa-specific features when category is sofas
  useEffect(() => {
    const currentCategoryName = (categories.find((c: any) => c.id === formData.category_id)?.name || '').toLowerCase()
    if (currentCategoryName !== 'sofas') return

    const sofaFeatures = [
      'Durable Frame Construction',
      'Comfortable Backrest & Armrest',
      'Supportive Seating Base',
      'Space-Saving Design',
      'Stylish Modern Look',
      'Versatile Use',
      'Ergonomic Design',
      'Compact Dual Function',
      'Hidden Storage',
      'Easy Assembled',
      'Delivery Flat Pack'
    ]

    const sofaIcons = [
      'wrench',            // Durable Frame Construction
      'bed',               // Comfortable Backrest & Armrest
      'support',           // Supportive Seating Base
      'minimize',          // Space-Saving Design
      'palette',           // Stylish Modern Look
      'arrow-left-right',  // Versatile Use
      'sliders',           // Ergonomic Design
      'grid',              // Compact Dual Function
      'package',           // Hidden Storage
      'easy-assembly',     // Easy Assembled
      'truck'              // Delivery Flat Pack
    ]

    const sofaCategories = [
      'Construction',
      'Comfort',
      'Support',
      'Space',
      'Design',
      'Versatility',
      'Ergonomics',
      'Function',
      'Storage',
      'Assembly',
      'Delivery'
    ]

    // Merge uniquely without duplicating existing features
    const existing = new Set((formData.features || []).map((f) => f.toLowerCase()))
    const mergedFeatures = [...(formData.features || [])]
    const mergedIcons = [...(formData.feature_icons || [])]
    const mergedCats = [...(formData.feature_categories || [])]

    sofaFeatures.forEach((feat, idx) => {
      if (!existing.has(feat.toLowerCase())) {
        mergedFeatures.push(feat)
        mergedIcons.push(sofaIcons[idx])
        mergedCats.push(sofaCategories[idx])
      }
    })

    if (mergedFeatures.length !== (formData.features || []).length) {
      handleInputChange('features', mergedFeatures)
      handleInputChange('feature_icons', mergedIcons)
      handleInputChange('feature_categories', mergedCats)
    }
  }, [formData.category_id, categories])

  // Ensure badges are properly initialized
  useEffect(() => {
    if (!formData.badges || formData.badges.length === 0) {
      const defaultBadges: Array<{ type: 'sale' | 'new_in' | 'free_gift'; enabled: boolean }> = [
        { type: 'sale', enabled: false },
        { type: 'new_in', enabled: false },
        { type: 'free_gift', enabled: false }
      ]
      handleInputChange('badges', defaultBadges)
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('sort_order')
      
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleInputChange = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayField = (field: keyof ProductFormData, value: string, action: 'add' | 'remove') => {
    const currentArray = formData[field] as string[]
    if (action === 'add' && value.trim()) {
      handleInputChange(field, [...currentArray, value.trim()])
    } else if (action === 'remove') {
      handleInputChange(field, currentArray.filter(item => item !== value))
    }
  }

  const handleImageUpload = async (files: FileList | null, field: 'main_image' | 'images') => {
    if (!files || files.length === 0) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to upload images.')
        return
      }

      if (field === 'main_image') {
        const file = files[0]
        
        try {
          // Use optimized upload API for main image
          const formData = new FormData()
          formData.append('file', file)
          formData.append('preset', 'large') // Use large preset for main product image
          
          const response = await fetch('/api/upload-optimized', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            handleInputChange('main_image', result.url)
            
            // Show size comparison alert for main image
            const originalSizeMB = (file.size / 1024 / 1024).toFixed(2)
            const optimizedSizeMB = (result.optimizedSize / 1024).toFixed(2)
            const savingsPercent = result.compressionRatio
            
            alert(`Main product image optimized successfully!\n\n📁 File: ${file.name}\n📏 Original: ${originalSizeMB} MB\n🔄 New (WebP): ${optimizedSizeMB} MB\n💾 Savings: ${savingsPercent}%\n\nImage converted to WebP format for better performance.`)
            
            console.log('[Product Form] Main image optimized upload result:', result)
          } else {
            const error = await response.json()
            console.error('[Product Form] Main image optimized upload error:', error)
            
            // Fallback to regular upload if optimized upload fails
            const fallbackFormData = new FormData()
            fallbackFormData.append('file', file)
            
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
              body: fallbackFormData,
            })

            if (!res.ok) {
              const err = await res.json().catch(() => ({}))
              throw new Error(err.error || 'Upload failed')
            }

            const json = await res.json()
            handleInputChange('main_image', json.url)
            alert('Main image uploaded successfully (fallback mode)')
          }
        } catch (error) {
          console.error('[Product Form] Main image upload error:', error)
          // Final fallback to regular upload
          const fallbackFormData = new FormData()
          fallbackFormData.append('file', file)
          
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
            body: fallbackFormData,
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || 'Upload failed')
          }

          const json = await res.json()
          handleInputChange('main_image', json.url)
        }
      } else if (field === 'images') {
        // Collect upload results for summary alert
        const uploadResults: Array<{
          fileName: string
          originalSize: number
          optimizedSize: number
          savingsPercent: string
          success: boolean
          error?: string
        }> = []
        
        const uploadPromises = Array.from(files).map(async (file) => {
          try {
            // Use optimized upload API for additional images
            const formData = new FormData()
            formData.append('file', file)
            formData.append('preset', 'medium') // Use medium preset for additional images
            
            const response = await fetch('/api/upload-optimized', {
              method: 'POST',
              body: formData
            })
            
            if (response.ok) {
              const result = await response.json()
              
              // Collect result for summary
              uploadResults.push({
                fileName: file.name,
                originalSize: file.size,
                optimizedSize: result.optimizedSize * 1024, // Convert KB to bytes for comparison
                savingsPercent: result.compressionRatio,
                success: true
              })
              
              console.log('[Product Form] Additional image optimized upload result:', result)
              return result.url
            } else {
              const error = await response.json()
              console.error('[Product Form] Additional image optimized upload error:', error)
              
              // Fallback to regular upload
              const fallbackFormData = new FormData()
              fallbackFormData.append('file', file)
              
              const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${session.access_token}` },
                body: fallbackFormData,
              })

              if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Upload failed')
              }

              const json = await res.json()
              
              uploadResults.push({
                fileName: file.name,
                originalSize: file.size,
                optimizedSize: file.size,
                savingsPercent: '0',
                success: false,
                error: 'Fallback upload (no optimization)'
              })
              
              return json.url
            }
          } catch (error) {
            console.error('[Product Form] Additional image upload error:', error)
            
            // Final fallback to regular upload
            const fallbackFormData = new FormData()
            fallbackFormData.append('file', file)
            
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
              body: fallbackFormData,
            })

            if (!res.ok) {
              const err = await res.json().catch(() => ({}))
              throw new Error(err.error || 'Upload failed')
            }

            const json = await res.json()
            
            uploadResults.push({
              fileName: file.name,
              originalSize: file.size,
              optimizedSize: file.size,
              savingsPercent: '0',
              success: false,
              error: 'Upload failed'
            })
            
            return json.url
          }
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        handleInputChange('images', [...formData.images, ...uploadedUrls])
        
        // Show summary alert for additional images
        if (uploadResults.length > 0) {
          const successfulUploads = uploadResults.filter(r => r.success)
          const failedUploads = uploadResults.filter(r => !r.success)
          
          let alertMessage = `📸 Additional Images Upload Summary\n\n`
          
          if (successfulUploads.length > 0) {
            const totalOriginalSize = successfulUploads.reduce((sum, r) => sum + r.originalSize, 0)
            const totalOptimizedSize = successfulUploads.reduce((sum, r) => sum + r.optimizedSize, 0)
            const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)
            
            alertMessage += `✅ Successfully Optimized: ${successfulUploads.length} images\n`
            alertMessage += `📏 Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB\n`
            alertMessage += `🔄 Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB\n`
            alertMessage += `💾 Total Savings: ${totalSavings}%\n\n`
            
            // Add individual file details
            successfulUploads.forEach(result => {
              const originalMB = (result.originalSize / 1024 / 1024).toFixed(2)
              const optimizedMB = (result.optimizedSize / 1024 / 1024).toFixed(2)
              alertMessage += `📁 ${result.fileName}: ${originalMB} MB → ${optimizedMB} MB (${result.savingsPercent}% saved)\n`
            })
          }
          
          if (failedUploads.length > 0) {
            alertMessage += `\n❌ Failed/Unoptimized: ${failedUploads.length} images\n`
            failedUploads.forEach(result => {
              const sizeMB = (result.originalSize / 1024 / 1024).toFixed(2)
              alertMessage += `📁 ${result.fileName}: ${sizeMB} MB (${result.error})\n`
            })
          }
          
          alertMessage += `\n🎯 Images converted to WebP format for better performance!`
          
          alert(alertMessage)
        }
      }
    } catch (error: any) {
      console.error('Image upload error:', error)
      alert(error?.message || 'Upload failed')
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      if (!formData.name.trim()) throw new Error('Product name is required')
      if (!formData.brand_id) throw new Error('Brand is required')
      if (!formData.category_id) throw new Error('Category is required')
      if (formData.current_price <= 0) throw new Error('Current price must be greater than 0')
      if (!formData.main_image.trim()) throw new Error('Main image is required')

             const productData = {
         name: formData.name.trim(),
         slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
         brand_id: formData.brand_id,
         category_id: formData.category_id,
         original_price: formData.original_price || 0,
         current_price: formData.current_price || 0,
         monthly_price: formData.monthly_price || 0,
         main_image: formData.main_image.trim(),
         images: formData.images || [],
         short_description: formData.short_description || '',
         long_description: formData.long_description || '',
         sizes: formData.sizes || [],
         colors: formData.colors || [],
         features: formData.features || [],
         materials: formData.materials || [],
         in_stock: Boolean(formData.in_stock),
         stock_quantity: formData.stock_quantity || 0,
         featured: Boolean(formData.featured),
         on_sale: Boolean(formData.on_sale),
         dispatch_time: formData.dispatch_time || '',
         setup_service: Boolean(formData.setup_service),
         setup_cost: formData.setup_cost || 0,
         free_delivery: Boolean(formData.free_delivery),
         has_variants: Boolean(formData.has_variants),
         rating: formData.rating || 4.5,
         review_count: formData.review_count || 0,
         firmness: formData.firmness || '',
         firmness_level: formData.firmness_level || 0,
         comfort_level: formData.comfort_level || '',
         dimensions: formData.dimensions || {},
         reasons_to_buy: formData.reasons_to_buy || [],
         promotional_offers: formData.promotional_offers || [],
         product_questions: formData.product_questions || [],
         warranty_info: formData.warranty_info || {},
         care_instructions: formData.care_instructions || '',
         warranty_delivery_line: formData.warranty_delivery_line || '',
         meta_title: formData.meta_title || '',
         meta_description: formData.meta_description || '',
         meta_keywords: formData.meta_keywords || [],
         description_sections: formData.description_sections || [],
         feature_descriptions: formData.feature_descriptions || [],
         feature_categories: formData.feature_categories || [],
         feature_icons: formData.feature_icons || ['support', 'comfort', 'firmness'],
         product_specs: formData.product_specs || [
           { name: 'Support', value: 80, min: 0, max: 100, labels: ['Low', 'Medium', 'High'] },
           { name: 'Pressure Relief', value: 65, min: 0, max: 100, labels: ['Basic', 'Medium', 'Advanced'] },
           { name: 'Air Circulation', value: 80, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] },
           { name: 'Durability', value: 95, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] }
         ],
         product_spec_icons: formData.product_spec_icons || ['support', 'pressure', 'air', 'durability', 'quality'],
         badges: formData.badges || [],
         free_gift_product_id: formData.free_gift_product_id,
         free_gift_enabled: formData.free_gift_enabled
       }

      if (product?.id) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
          .select()

        if (error) throw new Error(`Failed to update product: ${error?.message || 'Unknown error'}`)
        alert('Product updated successfully!')
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()

        if (error) throw new Error(`Failed to create product: ${error?.message || 'Unknown error'}`)
        alert('Product created successfully!')
      }

      onSubmit()
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert(`Error: ${error?.message || 'An unknown error occurred'}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const handleBadgeToggle = (badgeType: 'sale' | 'new_in' | 'free_gift', enabled: boolean) => {
    const currentBadges = formData.badges || []
    const existingBadgeIndex = currentBadges.findIndex(b => b.type === badgeType)
    
    if (existingBadgeIndex >= 0) {
      const updatedBadges = [...currentBadges]
      updatedBadges[existingBadgeIndex] = { ...updatedBadges[existingBadgeIndex], enabled }
      handleInputChange('badges', updatedBadges)
    } else {
      handleInputChange('badges', [...currentBadges, { type: badgeType, enabled }])
    }

    // If disabling free gift, clear the gift product
    if (badgeType === 'free_gift' && !enabled) {
      handleInputChange('free_gift_product_id', '')
      handleInputChange('free_gift_enabled', false)
      setSelectedGiftProduct(null)
    }
  }

  const handleGiftProductSelect = (product: any) => {
    setSelectedGiftProduct(product)
    handleInputChange('free_gift_product_id', product.id)
    handleInputChange('free_gift_enabled', true)
  }

  const getBadgeStatus = (badgeType: 'sale' | 'new_in' | 'free_gift') => {
    const badge = formData.badges?.find(b => b.type === badgeType)
    return badge?.enabled || false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      {/* Product Page Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                {formData.main_image ? (
                  <img 
                    src={formData.main_image} 
                    alt="Main" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}
                
                {/* Edit Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <label className="cursor-pointer bg-white rounded-full p-3 shadow-lg hover:bg-gray-50">
                      <Upload className="h-6 w-6 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files, 'main_image')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative bg-white rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Image ${index + 1}`} 
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(index)}
                  />
                  <button
                    onClick={() => handleInputChange('images', formData.images.filter((_, i) => i !== index))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {/* Add Image Button */}
              <label className="cursor-pointer bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors duration-200 flex items-center justify-center h-24">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files, 'images')}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            
            {/* Product Header */}
            <div className="bg-white rounded-lg p-6">
              {/* Brand & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <select
                    value={formData.brand_id}
                    onChange={(e) => handleInputChange('brand_id', e.target.value)}
                    className="text-lg font-semibold text-blue-600 border-none bg-transparent focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                  
                  {formData.on_sale && (
                    <Badge className="bg-red-500 text-white">
                      <input
                        type="text"
                        value={formData.on_sale ? '20% Off' : ''}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            handleInputChange('on_sale', false)
                          }
                        }}
                        className="bg-transparent border-none text-white text-sm font-medium w-20"
                        placeholder="Badge text"
                      />
                    </Badge>
                  )}
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.on_sale}
                    onChange={(e) => handleInputChange('on_sale', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">On Sale</span>
                </label>
              </div>



              {/* Product Name */}
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                className="text-2xl font-bold text-gray-900 border-none bg-transparent p-0 mb-4 focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
              />

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(formData.rating)}
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    className="w-16 border-none bg-transparent p-0 ml-2 text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                  />
                </div>
                <span className="text-gray-600">•</span>
                <Input
                  type="number"
                  value={formData.review_count}
                  onChange={(e) => handleInputChange('review_count', parseInt(e.target.value))}
                  className="w-20 border-none bg-transparent p-0 text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                  placeholder="Reviews"
                />
                <span className="text-gray-600">reviews</span>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    £<Input
                      type="number"
                      step="0.01"
                      value={formData.current_price}
                      onChange={(e) => handleInputChange('current_price', parseFloat(e.target.value))}
                      className="w-32 border-none bg-transparent p-0 text-3xl font-bold text-gray-900 focus:ring-2 focus:ring-orange-300 rounded px-1"
                      placeholder="0.00"
                    />
                  </span>
                  {formData.on_sale && (
                    <span className="text-xl text-gray-500 line-through">
                      £<Input
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value))}
                        className="w-24 border-none bg-transparent p-0 text-xl text-gray-500 line-through focus:ring-2 focus:ring-orange-300 rounded px-1"
                        placeholder="0.00"
                      />
                    </span>
                  )}
                </div>
                
                {formData.monthly_price > 0 && (
                  <div className="text-gray-600">
                    or £<Input
                      type="number"
                      step="0.01"
                      value={formData.monthly_price}
                      onChange={(e) => handleInputChange('monthly_price', parseFloat(e.target.value))}
                      className="w-20 border-none bg-transparent p-0 text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                      placeholder="0.00"
                    />
                    /month
                  </div>
                )}
              </div>

                             {/* Short Description */}
               <Textarea
                 value={formData.short_description}
                 onChange={(e) => handleInputChange('short_description', e.target.value)}
                 placeholder="Enter short description"
                 className="text-gray-600 border-none bg-transparent p-0 mb-6 resize-none focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                 rows={2}
               />

               {/* Warranty & Delivery Line */}
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Warranty & Delivery Information
                 </label>
                 <Input
                   value={formData.warranty_delivery_line}
                   onChange={(e) => handleInputChange('warranty_delivery_line', e.target.value)}
                   placeholder="e.g., 10-Year Warranty • Free Delivery • 100-Night Trial"
                   className="text-gray-600 border border-gray-300 focus:ring-2 focus:ring-orange-300 rounded px-3 py-2"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Enter the warranty, delivery, and trial information separated by bullet points (•)
                 </p>
               </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Color</h4>
                <div className="flex items-center space-x-3">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-transparent hover:border-orange-400 cursor-pointer"></div>
                      <Input
                        value={color}
                        onChange={(e) => {
                          const newColors = [...formData.colors]
                          newColors[index] = e.target.value
                          handleInputChange('colors', newColors)
                        }}
                        className="w-20 border-none bg-transparent p-0 text-sm text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                        placeholder="Color name"
                      />
                      <button
                        onClick={() => handleArrayField('colors', color, 'remove')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add color"
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <Button
                      onClick={() => {
                        handleArrayField('colors', newColor, 'add')
                        setNewColor('')
                      }}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <div className="flex items-center space-x-3">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Button
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        className={selectedSize === size ? "bg-orange-600 hover:bg-orange-700" : ""}
                        onClick={() => setSelectedSize(size)}
                      >
                        <Input
                          value={size}
                          onChange={(e) => {
                            const newSizes = [...formData.sizes]
                            newSizes[index] = e.target.value
                            handleInputChange('sizes', newSizes)
                          }}
                          className="w-20 border-none bg-transparent p-0 text-sm focus:ring-2 focus:ring-orange-300 rounded px-1"
                          placeholder="Size name"
                        />
                      </Button>
                      <button
                        onClick={() => handleArrayField('sizes', size, 'remove')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add size"
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <Button
                      onClick={() => {
                        handleArrayField('sizes', newSize, 'add')
                        setNewSize('')
                      }}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-none focus:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2"
                  >
                    +
                  </Button>
                </div>
                
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 h-12">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Basket
                </Button>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-orange-500" />
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features]
                          newFeatures[index] = e.target.value
                          handleInputChange('features', newFeatures)
                        }}
                        className="flex-1 border-none bg-transparent p-0 text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                        placeholder="Feature description"
                      />
                      <button
                        onClick={() => handleArrayField('features', feature, 'remove')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add feature"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <Button
                      onClick={() => {
                        handleArrayField('features', newFeature, 'add')
                        setNewFeature('')
                      }}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reasons to Buy */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Reasons to Buy</h4>
                <div className="space-y-2">
                  {formData.reasons_to_buy.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-orange-500" />
                      <Input
                        value={reason}
                        onChange={(e) => {
                          const newReasons = [...formData.reasons_to_buy]
                          newReasons[index] = e.target.value
                          handleInputChange('reasons_to_buy', newReasons)
                        }}
                        className="flex-1 border-none bg-transparent p-0 text-gray-600 focus:ring-2 focus:ring-orange-300 rounded px-1"
                        placeholder="Reason to buy"
                      />
                      <button
                        onClick={() => handleArrayField('reasons_to_buy', reason, 'remove')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Add reason"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <Button
                      onClick={() => {
                        handleArrayField('reasons_to_buy', newReason, 'add')
                        setNewReason('')
                      }}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            {/* Product Badges Section */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Badges</h3>
              <div className="space-y-3">
                {/* Sale Badge */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={getBadgeStatus('sale')}
                      onChange={(e) => handleBadgeToggle('sale', e.target.checked)}
                      className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-base font-medium text-gray-700">Sale Badge</span>
                    <Badge className="ml-3 bg-orange-500 text-white text-sm">Sale</Badge>
                  </div>
                  <span className="text-sm text-gray-500">Shows when product is on sale</span>
                </label>

                {/* New In Badge */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={getBadgeStatus('new_in')}
                      onChange={(e) => handleBadgeToggle('new_in', e.target.checked)}
                      className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-base font-medium text-gray-700">New In Badge</span>
                    <Badge className="ml-3 bg-orange-600 text-white text-sm">New In</Badge>
                  </div>
                  <span className="text-sm text-gray-500">Shows for new products</span>
                </label>

                {/* Free Gift Badge */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={getBadgeStatus('free_gift')}
                      onChange={(e) => handleBadgeToggle('free_gift', e.target.checked)}
                      className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-base font-medium text-gray-700">Free Gift Badge</span>
                    <Badge className="ml-3 bg-blue-900 text-white text-sm">Free Gift</Badge>
                  </div>
                  <span className="text-sm text-gray-500">Shows when product comes with free gift</span>
                </label>

                {/* Free Gift Product Selection */}
                {getBadgeStatus('free_gift') && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Free Gift Product</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setShowProductSelectionModal(true)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Select Product
                      </Button>
                    </div>
                    
                    {selectedGiftProduct ? (
                      <div className="flex items-center space-x-3 p-2 bg-green-50 rounded border">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          {selectedGiftProduct.main_image ? (
                            <img
                              src={selectedGiftProduct.main_image}
                              alt={selectedGiftProduct.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedGiftProduct.name}</p>
                          {selectedGiftProduct.current_price && (
                            <p className="text-xs text-gray-600">£{selectedGiftProduct.current_price.toFixed(2)}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedGiftProduct(null)
                            handleInputChange('free_gift_product_id', '')
                            handleInputChange('free_gift_enabled', false)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No gift product selected</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('description')}
                >
                  {expandedSections.description ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {expandedSections.description && (
                <div className="space-y-8">
                  {/* Introduction */}
                  <div className="text-center">
                    <Textarea
                      value={formData.short_description}
                      onChange={(e) => handleInputChange('short_description', e.target.value)}
                      placeholder="Enter introduction text for the product"
                      className="min-h-[100px] border border-gray-300 focus:ring-2 focus:ring-orange-300 text-center text-lg"
                      rows={4}
                    />
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-8"></div>
                  
                  {/* Premium Sleep Technology Section */}
                  <div className="text-center space-y-6">
                    <Input
                      value={formData.description_sections?.[0]?.title || 'Premium Sleep Technology'}
                      onChange={(e) => {
                        const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                        sections[0] = { ...sections[0], title: e.target.value }
                        handleInputChange('description_sections', sections)
                      }}
                      placeholder="Section 1 Title"
                      className="text-2xl font-bold text-gray-900 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                    />
                    <div className="relative h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden bg-gray-100 mx-auto max-w-3xl lg:max-w-4xl">
                      {formData.description_sections?.[0]?.image ? (
                        <img 
                          src={formData.description_sections[0].image} 
                          alt="Section 1 image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-16 w-16" />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center cursor-pointer">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50">
                            <Upload className="h-6 w-6 text-gray-600" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0]
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  
                                  // Handle image upload here
                                  // For now, we'll use a placeholder
                                  sections[0] = { ...sections[0], image: URL.createObjectURL(file) }
                                  handleInputChange('description_sections', sections)
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                      <Textarea
                        value={formData.description_sections?.[0]?.content || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[0] = { ...sections[0], content: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 1 (first paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                      <Textarea
                        value={formData.description_sections?.[0]?.content2 || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[0] = { ...sections[0], content2: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 1 (second paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-8"></div>
                  
                  {/* Superior Comfort Features Section */}
                  <div className="text-center space-y-6">
                    <Input
                      value={formData.description_sections?.[1]?.title || 'Superior Comfort Features'}
                      onChange={(e) => {
                        const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                        sections[1] = { ...sections[1], title: e.target.value }
                        handleInputChange('description_sections', sections)
                      }}
                      placeholder="Section 2 Title"
                      className="text-2xl font-bold text-gray-900 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                    />
                    <div className="relative h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden bg-gray-100 mx-auto max-w-3xl lg:max-w-4xl">
                      {formData.description_sections?.[1]?.image ? (
                        <img 
                          src={formData.description_sections[1].image} 
                          alt="Section 2 image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-16 w-16" />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center cursor-pointer">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50">
                            <Upload className="h-6 w-6 text-gray-600" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0]
                                  sections[1] = { ...sections[1], image: URL.createObjectURL(file) }
                                  handleInputChange('description_sections', sections)
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                      <Textarea
                        value={formData.description_sections?.[1]?.content || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[1] = { ...sections[1], content: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 2 (first paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                      <Textarea
                        value={formData.description_sections?.[1]?.content2 || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[1] = { ...sections[1], content2: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 2 (second paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-8"></div>
                  
                  {/* Quality Assurance Section */}
                  <div className="text-center space-y-6">
                    <Input
                      value={formData.description_sections?.[2]?.title || 'Quality Assurance'}
                      onChange={(e) => {
                        const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                        sections[2] = { ...sections[2], title: e.target.value }
                        handleInputChange('description_sections', sections)
                      }}
                      placeholder="Section 3 Title"
                      className="text-2xl font-bold text-gray-900 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                    />
                    <div className="relative h-80 lg:h-96 xl:h-[28rem] rounded-xl overflow-hidden bg-gray-100 mx-auto max-w-4xl">
                      {formData.description_sections?.[2]?.image ? (
                        <img 
                          src={formData.description_sections[2].image} 
                          alt="Section 3 image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-16 w-16" />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center cursor-pointer">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50">
                            <Upload className="h-6 w-6 text-gray-600" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0]
                                  sections[2] = { ...sections[2], image: URL.createObjectURL(file) }
                                  handleInputChange('description_sections', sections)
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                      <Textarea
                        value={formData.description_sections?.[2]?.content || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[2] = { ...sections[2], content: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 3 (first paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                      <Textarea
                        value={formData.description_sections?.[2]?.content2 || ''}
                        onChange={(e) => {
                          const sections = formData.description_sections || [{ title: '', content: '', image: '' }, { title: '', content: '', image: '' }, { title: '', content: '', image: '' }]
                          sections[2] = { ...sections[2], content2: e.target.value }
                          handleInputChange('description_sections', sections)
                        }}
                        placeholder="Enter content for section 3 (second paragraph)"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Features you'll love</h3>
                <Button
                  onClick={() => {
                    const newFeatures = [...(formData.features || []), '']
                    const newDescriptions = [...(formData.feature_descriptions || []), '']
                    const newCategories = [...(formData.feature_categories || []), '']
                    handleInputChange('features', newFeatures)
                    handleInputChange('feature_descriptions', newDescriptions)
                    handleInputChange('feature_categories', newCategories)
                  }}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {(formData.features || []).map((feature, index) => (
                  <div key={index} className="text-center min-w-0 relative group">
                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        const newFeatures = formData.features?.filter((_, i) => i !== index) || []
                        const newDescriptions = formData.feature_descriptions?.filter((_, i) => i !== index) || []
                        const newCategories = formData.feature_categories?.filter((_, i) => i !== index) || []
                        handleInputChange('features', newFeatures)
                        handleInputChange('feature_descriptions', newDescriptions)
                        handleInputChange('feature_categories', newCategories)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Icon Selection */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-orange-500">
                      <select
                        value={formData.feature_icons?.[index] || 'support'}
                        onChange={(e) => {
                          const newIcons = [...(formData.feature_icons || [])]
                          newIcons[index] = e.target.value
                          handleInputChange('feature_icons', newIcons)
                        }}
                        className="w-full h-full border border-orange-300 rounded-lg bg-orange-50 text-orange-600 text-xs focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="support">Support</option>
                        <option value="comfort">Comfort</option>
                        <option value="firmness">Firmness</option>
                        <option value="quality">Quality</option>
                        <option value="durability">Durability</option>
                        <option value="wood">Wood</option>
                        <option value="metal">Metal</option>
                        <option value="upholstery">Upholstery</option>
                        <option value="construction">Construction</option>
                        <option value="design">Design</option>
                      </select>
                    </div>

                    {/* Category Input */}
                    <Input
                      value={formData.feature_categories?.[index] || ''}
                      onChange={(e) => {
                        const newCategories = [...(formData.feature_categories || [])]
                        newCategories[index] = e.target.value
                        handleInputChange('feature_categories', newCategories)
                      }}
                      placeholder="Category (e.g., Support System)"
                      className="text-xs sm:text-sm text-gray-600 border-none bg-transparent text-center mb-1 focus:ring-2 focus:ring-orange-300 rounded px-1"
                    />

                    {/* Feature Name Input */}
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(formData.features || [])]
                        newFeatures[index] = e.target.value
                        handleInputChange('features', newFeatures)
                      }}
                      placeholder="Feature name"
                      className="text-base sm:text-lg font-bold text-gray-900 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                    />

                    {/* Feature Description Input */}
                    <Textarea
                      value={formData.feature_descriptions?.[index] || ''}
                      onChange={(e) => {
                        const newDescriptions = [...(formData.feature_descriptions || [])]
                        newDescriptions[index] = e.target.value
                        handleInputChange('feature_descriptions', newDescriptions)
                      }}
                      placeholder="Feature description"
                      className="text-xs sm:text-sm text-gray-600 leading-relaxed border-none bg-transparent text-center resize-none focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Firmness Scale */}
            <div className="bg-white rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">Firmness Scale</h3>
                
                <div className="relative min-w-0 overflow-hidden">
                  {/* Numerical Ranges */}
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2 px-1">
                    <span className="break-words">1-2</span>
                    <span className="break-words">3-4</span>
                    <span className="text-gray-700 font-medium break-words">5-6</span>
                    <span className="break-words">7-8</span>
                    <span className="break-words">8-9</span>
                    <span className="break-words">9-10</span>
                  </div>
                  
                  {/* Scale Bar */}
                  <div className="flex h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gray-200 flex-1 rounded-l-full"></div>
                    <div className="h-full bg-gray-200 flex-1"></div>
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 flex-1 shadow-lg transform hover:scale-y-110 transition-all duration-300 rounded-md"></div>
                    <div className="h-full bg-gray-200 flex-1"></div>
                    <div className="h-full bg-gray-200 flex-1"></div>
                    <div className="h-full bg-gray-200 flex-1 rounded-r-full"></div>
                  </div>
                  
                  {/* Descriptive Labels */}
                  <div className="flex justify-between text-xs sm:text-sm text-gray-700 mt-2 px-1">
                    <span className="break-words">Plush</span>
                    <span className="break-words">Medium-Plush</span>
                    <span className="text-orange-600 font-semibold break-words">Medium</span>
                    <span className="break-words">Medium-Firm</span>
                    <span className="break-words">Firm</span>
                    <span className="break-words">Extra-firm</span>
                  </div>
                </div>
                
                {/* Editable Firmness Level */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Firmness Level (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.firmness_level || 6}
                    onChange={(e) => handleInputChange('firmness_level', parseInt(e.target.value))}
                    className="w-20 mx-auto text-center border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    placeholder="6"
                  />
                </div>
              </div>
            </div>

            {/* Product Specifications Grid */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Product Specifications Grid</h3>
                <Button
                  onClick={() => {
                    const newSpecs = [...(formData.product_specs || []), { name: '', value: 80, min: 0, max: 100, labels: ['Low', 'Medium', 'High'] }]
                    handleInputChange('product_specs', newSpecs)
                  }}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spec
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {(formData.product_specs || [
                  { name: 'Support', value: 80, min: 0, max: 100, labels: ['Low', 'Medium', 'High'] },
                  { name: 'Pressure Relief', value: 65, min: 0, max: 100, labels: ['Basic', 'Medium', 'Advanced'] },
                  { name: 'Air Circulation', value: 80, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] },
                  { name: 'Durability', value: 95, min: 0, max: 100, labels: ['Good', 'Better', 'Best'] }
                ]).map((spec, index) => (
                  <div key={index} className="text-center border border-gray-200 rounded-lg p-3 bg-white transition-all duration-300 relative group">
                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        const newSpecs = formData.product_specs?.filter((_, i) => i !== index) || []
                        handleInputChange('product_specs', newSpecs)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Icon Selection */}
                    <div className="w-10 h-10 mx-auto mb-2 text-gray-700">
                      <select
                        value={formData.product_spec_icons?.[index] || 'support'}
                        onChange={(e) => {
                          const newIcons = [...(formData.product_spec_icons || [])]
                          newIcons[index] = e.target.value
                          handleInputChange('product_spec_icons', newIcons)
                        }}
                        className="w-full h-full border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-xs focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="support">Support</option>
                        <option value="pressure">Pressure</option>
                        <option value="air">Air</option>
                        <option value="durability">Durability</option>
                        <option value="quality">Quality</option>
                      </select>
                    </div>

                    {/* Spec Name Input */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Input
                        value={spec.name}
                        onChange={(e) => {
                          const newSpecs = [...(formData.product_specs || [])]
                          newSpecs[index] = { ...newSpecs[index], name: e.target.value }
                          handleInputChange('product_specs', newSpecs)
                        }}
                        placeholder="Spec name"
                        className="text-sm font-bold text-gray-800 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-1 w-20"
                      />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden max-w-32 mx-auto shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg transform hover:scale-y-125 hover:shadow-xl transition-all duration-300" 
                          style={{ width: `${spec.value}%` }}
                        ></div>
                      </div>
                      
                      {/* Value Input */}
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...(formData.product_specs || [])]
                          newSpecs[index] = { ...newSpecs[index], value: parseInt(e.target.value) || 0 }
                          handleInputChange('product_specs', newSpecs)
                        }}
                        className="w-16 mx-auto text-center border border-gray-300 focus:ring-2 focus:ring-orange-300 text-xs"
                      />
                      
                      {/* Labels Input */}
                      <div className="flex justify-between text-xs text-gray-700 max-w-32 mx-auto">
                        <Input
                          value={spec.labels[0]}
                          onChange={(e) => {
                            const newSpecs = [...(formData.product_specs || [])]
                            const newLabels = [...spec.labels]
                            newLabels[0] = e.target.value
                            newSpecs[index] = { ...newSpecs[index], labels: newLabels }
                            handleInputChange('product_specs', newSpecs)
                          }}
                          placeholder="Low"
                          className="w-12 text-center border-none bg-transparent text-xs focus:ring-2 focus:ring-orange-300 rounded px-1"
                        />
                        <Input
                          value={spec.labels[1]}
                          onChange={(e) => {
                            const newSpecs = [...(formData.product_specs || [])]
                            const newLabels = [...spec.labels]
                            newLabels[1] = e.target.value
                            newSpecs[index] = { ...newSpecs[index], labels: newLabels }
                            handleInputChange('product_specs', newSpecs)
                          }}
                          placeholder="Medium"
                          className="w-12 text-center border-none bg-transparent text-xs focus:ring-2 focus:ring-orange-300 rounded px-1"
                        />
                        <Input
                          value={spec.labels[2]}
                          onChange={(e) => {
                            const newSpecs = [...(formData.product_specs || [])]
                            const newLabels = [...spec.labels]
                            newLabels[2] = e.target.value
                            newSpecs[index] = { ...newSpecs[index], labels: newLabels }
                            handleInputChange('product_specs', newSpecs)
                          }}
                          placeholder="High"
                          className="w-12 text-center border-none bg-transparent text-xs focus:ring-2 focus:ring-orange-300 rounded px-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensions Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dimensions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('dimensions')}
                >
                  {expandedSections.dimensions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {expandedSections.dimensions && (
                <div className="space-y-8">
                  {/* Product Name Header */}
                  <div className="text-center">
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Product Name"
                      className="text-2xl font-bold text-gray-900 border-none bg-transparent text-center focus:ring-2 focus:ring-orange-300 rounded px-2 py-1"
                    />
                    <p className="text-gray-600">Product Dimensions</p>
                  </div>
                  
                  {/* Section 1: Basic Dimensions */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="show_basic_dimensions_old"
                        checked={formData.dimensions.show_basic_dimensions}
                        onCheckedChange={(checked) => handleInputChange('dimensions', { ...formData.dimensions, show_basic_dimensions: checked as boolean })}
                      />
                      <label htmlFor="show_basic_dimensions_old" className="text-sm font-medium text-gray-700">
                        Show Basic Dimensions Section
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Height */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-600">A</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Height</h4>
                        <Input
                          value={formData.dimensions.height}
                          onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, height: e.target.value })}
                          placeholder="e.g., 25 cm"
                          className="text-center border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        />
                      </div>

                      {/* Length */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-600">B</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Length</h4>
                        <Input
                          value={formData.dimensions.length}
                          onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, length: e.target.value })}
                          placeholder="e.g., L 190cm"
                          className="text-center border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        />
                      </div>

                      {/* Width/Depth (Sofas use Depth) */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-600">C</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{(categories.find((c: any) => c.id === formData.category_id)?.name || '').toLowerCase() === 'sofas' ? 'Depth' : 'Width'}</h4>
                        <Input
                          value={formData.dimensions.width}
                          onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, width: e.target.value })}
                          placeholder={(categories.find((c: any) => c.id === formData.category_id)?.name || '').toLowerCase() === 'sofas' ? 'e.g., 85cm' : 'e.g., 135cm'}
                          className="text-center border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                  </div>

                    {/* Section 2: Mattress Specifications */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id="show_mattress_specs"
                          checked={formData.dimensions.show_mattress_specs}
                          onCheckedChange={(checked) => handleInputChange('dimensions', { ...formData.dimensions, show_mattress_specs: checked as boolean })}
                        />
                        <label htmlFor="show_mattress_specs" className="text-sm font-medium text-gray-700">
                          Show Mattress Specifications Section
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mattress Size</label>
                          <Input
                            value={formData.dimensions.mattress_size}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, mattress_size: e.target.value })}
                            placeholder="e.g., 135cm x L 190cm cm"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Height</label>
                          <Input
                            value={formData.dimensions.max_height}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, max_height: e.target.value })}
                            placeholder="e.g., 25 cm"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Weight Capacity</label>
                          <Input
                            value={formData.dimensions.weight_capacity}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, weight_capacity: e.target.value })}
                            placeholder="e.g., 200 kg"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Technical Specifications */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id="show_technical_specs"
                          checked={formData.dimensions.show_technical_specs}
                          onCheckedChange={(checked) => handleInputChange('dimensions', { ...formData.dimensions, show_technical_specs: checked as boolean })}
                        />
                        <label htmlFor="show_technical_specs" className="text-sm font-medium text-gray-700">
                          Show Technical Specifications Section
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pocket Springs</label>
                          <Input
                            value={formData.dimensions.pocket_springs}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, pocket_springs: e.target.value })}
                            placeholder="e.g., 1000 count"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comfort Layer</label>
                          <Input
                            value={formData.dimensions.comfort_layer}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, comfort_layer: e.target.value })}
                            placeholder="e.g., 8 cm"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Support Layer</label>
                          <Input
                            value={formData.dimensions.support_layer}
                            onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, support_layer: e.target.value })}
                            placeholder="e.g., 17 cm"
                            className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Product Questions */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Questions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('questions')}
                >
                  {expandedSections.questions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {expandedSections.questions && (
                <div className="space-y-4">
                  {formData.product_questions?.map((qa, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Q&A {index + 1}</h4>
                        <button
                          onClick={() => {
                            const newQAs = formData.product_questions?.filter((_, i) => i !== index) || []
                            handleInputChange('product_questions', newQAs)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="Question"
                          value={qa.question || ''}
                          onChange={(e) => {
                            const newQAs = [...(formData.product_questions || [])]
                            newQAs[index] = { ...newQAs[index], question: e.target.value }
                            handleInputChange('product_questions', newQAs)
                          }}
                          className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        />
                        
                        <Textarea
                          placeholder="Answer"
                          value={qa.answer || ''}
                          onChange={(e) => {
                            const newQAs = [...(formData.product_questions || [])]
                            newQAs[index] = { ...newQAs[index], answer: e.target.value }
                            handleInputChange('product_questions', newQAs)
                          }}
                          rows={2}
                          className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => {
                      const newQAs = [...(formData.product_questions || []), { question: '', answer: '' }]
                      handleInputChange('product_questions', newQAs)
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              )}
            </div>

            {/* Warranty & Care */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Warranty & Care</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('warranty')}
                >
                  {expandedSections.warranty ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {expandedSections.warranty && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Type</label>
                    <Input
                      value={formData.warranty_info?.type || ''}
                      onChange={(e) => {
                        const warranty = { ...formData.warranty_info, type: e.target.value }
                        handleInputChange('warranty_info', warranty)
                      }}
                      placeholder="e.g., Manufacturer, Extended"
                      className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Duration</label>
                    <Input
                      value={formData.warranty_info?.duration || ''}
                      onChange={(e) => {
                        const warranty = { ...formData.warranty_info, duration: e.target.value }
                        handleInputChange('warranty_info', warranty)
                      }}
                      placeholder="e.g., 1 year, 5 years, Lifetime"
                      className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Details</label>
                    <Textarea
                      value={formData.warranty_info?.coverageDetails || ''}
                      onChange={(e) => {
                        const warranty = { ...formData.warranty_info, coverageDetails: e.target.value }
                        handleInputChange('warranty_info', warranty)
                      }}
                      placeholder="What the warranty covers"
                      rows={3}
                      className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                    <Textarea
                      value={formData.warranty_info?.termsConditions || ''}
                      onChange={(e) => {
                        const warranty = { ...formData.warranty_info, termsConditions: e.target.value }
                        handleInputChange('warranty_info', warranty)
                      }}
                      placeholder="Warranty terms and conditions"
                      rows={3}
                      className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                    <Textarea
                      value={formData.care_instructions || ''}
                      onChange={(e) => handleInputChange('care_instructions', e.target.value)}
                      placeholder="How to care for the product"
                      rows={3}
                      className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('specifications')}
                >
                  {expandedSections.specifications ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {expandedSections.specifications && (
                <div className="space-y-6">
                  {/* Basic Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Firmness</label>
                      <Input
                        value={formData.firmness}
                        onChange={(e) => handleInputChange('firmness', e.target.value)}
                        placeholder="e.g., Medium"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Firmness Level (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.firmness_level}
                        onChange={(e) => handleInputChange('firmness_level', parseInt(e.target.value))}
                        placeholder="e.g., 6"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comfort Level</label>
                      <Input
                        value={formData.comfort_level}
                        onChange={(e) => handleInputChange('comfort_level', e.target.value)}
                        placeholder="e.g., Medium"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                      <Input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                        placeholder="e.g., 100"
                        className="border border-gray-300 focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>


                </div>
              )}
            </div>

            {/* Materials */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials</h3>
              <div className="space-y-2">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={material}
                      onChange={(e) => {
                        const newMaterials = [...formData.materials]
                        newMaterials[index] = e.target.value
                        handleInputChange('materials', newMaterials)
                      }}
                      className="flex-1 border border-gray-300 focus:ring-2 focus:ring-orange-300"
                      placeholder="Material name"
                    />
                    <button
                      onClick={() => handleArrayField('materials', material, 'remove')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Add material"
                    className="flex-1 border border-gray-300 focus:ring-2 focus:ring-orange-300"
                  />
                  <Button
                    onClick={() => {
                      handleArrayField('materials', newMaterial, 'add')
                      setNewMaterial('')
                    }}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Variant Management */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
              {(product?.id || product?.uuid || product?.product_id) ? (
                <VariantManagement 
                  productId={product.id || product.uuid || product.product_id} 
                  category={product.category || product.category_id || formData.category_id || 'mattresses'} 
                  productName={product.name || 'Product'} 
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    {formData.has_variants ? 'Product marked for variants' : 'Variants will be available after saving the product'}
                  </p>
                  <p className="text-sm">
                    {formData.has_variants 
                      ? 'Save this product first to add color and size variants with different prices'
                      : 'Check "This product will have variants" above if you plan to add variants'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category & Brand */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                    <select
                      value={formData.brand_id}
                      onChange={(e) => handleInputChange('brand_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Featured Product</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.free_delivery}
                      onChange={(e) => handleInputChange('free_delivery', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Free Delivery</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.setup_service}
                      onChange={(e) => handleInputChange('setup_service', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Setup Service</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.has_variants || false}
                      onChange={(e) => handleInputChange('has_variants', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">This product will have variants (different colors/sizes)</span>
                  </label>
                </div>
              </div>

              {/* Setup Cost */}
              {formData.setup_service && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setup Cost</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.setup_cost}
                    onChange={(e) => handleInputChange('setup_cost', parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-48 border border-gray-300 focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              )}

              {/* Dispatch Time */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Time</label>
                <Input
                  value={formData.dispatch_time}
                  onChange={(e) => handleInputChange('dispatch_time', e.target.value)}
                  placeholder="e.g., Tomorrow, 2-3 business days"
                  className="w-64 border border-gray-300 focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        isOpen={showProductSelectionModal}
        onClose={() => setShowProductSelectionModal(false)}
        onSelect={handleGiftProductSelect}
        title="Select Free Gift Product"
        description="Choose which product will be given as a free gift when this product is added to cart"
        excludeProductId={product?.id}
      />
    </div>
  )
}
