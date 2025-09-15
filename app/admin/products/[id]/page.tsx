"use client"

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { AdminNav } from '@/components/admin/admin-nav'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getFeatureCardsForCategory } from '@/lib/feature-cards'
import { getFeaturesForCategory } from '@/lib/category-features'
import { ImageCropModal } from '@/components/image-crop-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

type VariantRow = {
  id: string
  sku: string
  color?: string
  depth?: string
  firmness?: string
  size?: string
  length?: string
  width?: string
  height?: string
  availability: boolean
  originalPrice?: number
  currentPrice?: number
  variant_image?: string
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [variants, setVariants] = useState<VariantRow[]>([])
  const [useColor, setUseColor] = useState<boolean>(false)
  const [useDepth, setUseDepth] = useState<boolean>(false)
  const [useSize, setUseSize] = useState<boolean>(false)
  const [useFirmness, setUseFirmness] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [headline, setHeadline] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [warrantyDeliveryLine, setWarrantyDeliveryLine] = useState('1-Year Warranty • Free Delivery • 100-Night Trial')
  const [careInstructions, setCareInstructions] = useState('')
  const [trialInformation, setTrialInformation] = useState('Try your mattress risk-free for 100 nights. If you are not completely satisfied, return it for a full refund. No questions asked.')
  const [trialInformationHeading, setTrialInformationHeading] = useState('Trial')
  const [descriptionParagraphs, setDescriptionParagraphs] = useState([
    { heading: 'Comfort & Support', content: 'Experience exceptional comfort with our premium materials...', image: '' },
    { heading: 'Quality Materials', content: 'Crafted with the finest materials for lasting durability...', image: '' },
    { heading: 'Sleep Benefits', content: 'Wake up feeling refreshed and well-rested...', image: '' }
  ])
  const [faqs, setFaqs] = useState([
    { question: 'What is the warranty period?', answer: 'This mattress comes with a 10-year warranty...' },
    { question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days...' }
  ])
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [warrantySections, setWarrantySections] = useState([
    { heading: 'Coverage', content: 'Comprehensive coverage for manufacturing defects...' },
    { heading: 'Terms', content: 'Warranty terms and conditions apply...' },
    { heading: 'Support', content: 'Dedicated customer support for warranty claims...' }
  ])
  const [dimensions, setDimensions] = useState({
    height: '',
    length: '',
    width: '',
    mattressSize: '',
    maxHeight: '',
    weightCapacity: '',
    pocketSprings: '',
    comfortLayer: '',
    supportLayer: '',
    dimensionDisclaimer: '',
    show_basic_dimensions: true,
    show_mattress_specs: true,
    show_technical_specs: true
  })
  const [importantNotices, setImportantNotices] = useState<Array<{
    id: string
    noticeText: string
    sortOrder: number
  }>>([])
  const [newNotice, setNewNotice] = useState('')
  const [firmnessScale, setFirmnessScale] = useState<'Soft' | 'Soft-Medium' | 'Medium' | 'Medium-Firm' | 'Firm' | 'Extra-firm'>('Medium')
  const [supportLevel, setSupportLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [pressureReliefLevel, setPressureReliefLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [airCirculationLevel, setAirCirculationLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [durabilityLevel, setDurabilityLevel] = useState<'Low' | 'Medium' | 'High'>('High')
  const [badges, setBadges] = useState<Array<{ type: 'sale' | 'new_in' | 'free_gift'; enabled: boolean }>>([
    { type: 'sale', enabled: false },
    { type: 'new_in', enabled: false },
    { type: 'free_gift', enabled: false }
  ])
  const [selectedPopularCategories, setSelectedPopularCategories] = useState<string[]>([])
  const [selectedRecommendedProducts, setSelectedRecommendedProducts] = useState<any[]>([])
  const [reasonsToBuy, setReasonsToBuy] = useState<string[]>([])
  const [newReason, setNewReason] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedReasonsToLove, setSelectedReasonsToLove] = useState<Array<{reason: string, description: string, smalltext?: string, icon?: string}>>([])
  const [newLoveReason, setNewLoveReason] = useState('')
  const [newLoveDescription, setNewLoveDescription] = useState('')
  const [newLoveSmalltext, setNewLoveSmalltext] = useState('')
  const [images, setImages] = useState<Array<{ id: string; url: string; file?: File }>>([])
  const [newImage, setNewImage] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [convertToWebP, setConvertToWebP] = useState<boolean>(true) // Default for new images
  const [webpQuality, setWebpQuality] = useState<number>(90) // Default for new images
  const [imageWebPSettings, setImageWebPSettings] = useState<Map<string, { convert: boolean; quality: number }>>(new Map())
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState<File | null>(null)
  const [croppedImages, setCroppedImages] = useState<Map<string, string>>(new Map())
  const [croppingImageIndex, setCroppingImageIndex] = useState<number | null>(null)

  // Categories
  const categories = [
    { value: 'mattresses', label: 'Mattresses' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas' },
    { value: 'pillows', label: 'Pillows' },
    { value: 'toppers', label: 'Toppers' },
    { value: 'bunkbeds', label: 'Bunk Beds' }
  ]

  // Fetch product data on component mount
  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    }
  }, [productId])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      
      const data = await response.json()
      const productData = data.product
      
      // Debug logging for fetched data
      console.log('Fetched product data:', {
        selectedFeatures: productData.selectedFeatures,
        reasonsToBuy: productData.reasonsToBuy,
        selectedReasonsToLove: productData.selectedReasonsToLove,
        selectedPopularCategories: productData.selectedPopularCategories
      })
      
      console.log('Raw product data:', productData)
      
      // Populate form with fetched data
      setName(productData.name || '')
      setCategory(productData.category || '')
      setRating(productData.rating || 0)
      setHeadline(productData.headline || '')
      setLongDescription(productData.longDescription || '')
      setWarrantyDeliveryLine(productData.warrantyDeliveryLine || '')
      setCareInstructions(productData.careInstructions || '')
      setTrialInformation(productData.trialInformation || '')
      setTrialInformationHeading((productData as any).trialInformationHeading || 'Trial')
      setFirmnessScale(productData.firmnessScale || 'Medium')
      setSupportLevel(productData.supportLevel || 'Medium')
      setPressureReliefLevel(productData.pressureReliefLevel || 'Medium')
      setAirCirculationLevel(productData.airCirculationLevel || 'Medium')
      setDurabilityLevel(productData.durabilityLevel || 'High')
      // Ensure each variant has a stable local id so updates target only that row
      setVariants((productData.variants || []).map((v: any, index: number) => ({
        id: crypto.randomUUID(),
        ...v,
      })))
      
      
      // Set attribute flags based on variants
      if (productData.variants && productData.variants.length > 0) {
        setUseColor(productData.variants.some((v: any) => v.color))
        setUseDepth(productData.variants.some((v: any) => v.depth))
        setUseSize(productData.variants.some((v: any) => v.size))
        setUseFirmness(productData.variants.some((v: any) => v.firmness))
      }
      
              // Set images
        if (productData.images && productData.images.length > 0) {
          setImages(productData.images.map((img: string, index: number) => ({
            id: `img-${index}`,
            url: img,
            file: undefined
          })))
        }
      
      // Set description paragraphs
      if (productData.descriptionParagraphs && productData.descriptionParagraphs.length > 0) {
        setDescriptionParagraphs(productData.descriptionParagraphs)
      }
      
      // Set FAQs
      if (productData.faqs && productData.faqs.length > 0) {
        setFaqs(productData.faqs)
      }
      
      // Set warranty sections
      if (productData.warrantySections && productData.warrantySections.length > 0) {
        setWarrantySections(productData.warrantySections)
      }
      
      // Set dimensions
      if (productData.dimensions) {
        setDimensions({
          height: productData.dimensions.height || '',
          length: productData.dimensions.length || '',
          width: productData.dimensions.width || '',
          mattressSize: productData.dimensions.mattress_size || '',
          maxHeight: productData.dimensions.max_height || '',
          weightCapacity: productData.dimensions.weight_capacity || '',
          pocketSprings: productData.dimensions.pocket_springs || '',
          comfortLayer: productData.dimensions.comfort_layer || '',
          supportLayer: productData.dimensions.support_layer || '',
          dimensionDisclaimer: productData.dimensions.dimension_disclaimer || '',
          show_basic_dimensions: productData.dimensions.show_basic_dimensions !== undefined ? productData.dimensions.show_basic_dimensions : true,
          show_mattress_specs: productData.dimensions.show_mattress_specs !== undefined ? productData.dimensions.show_mattress_specs : true,
          show_technical_specs: productData.dimensions.show_technical_specs !== undefined ? productData.dimensions.show_technical_specs : true
        })
      }
      
      // Set important notices
      setImportantNotices(productData.importantNotices || [])
      
      // Set badges
      if (productData.badges && productData.badges.length > 0) {
        setBadges(productData.badges)
      }
      
      // Set popular categories
      setSelectedPopularCategories(productData.selectedPopularCategories || [])
      
      // Set reasons to buy
      setReasonsToBuy(productData.reasonsToBuy || [])
      
      // Set selected features
      setSelectedFeatures(productData.selectedFeatures || [])
      
      // Set selected reasons to love
      setSelectedReasonsToLove(productData.selectedReasonsToLove || [])
      
      setProduct(productData)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  // Variant management functions
  const addVariant = () => {
    setVariants(v => ([
      ...v,
      {
        id: crypto.randomUUID(),
        sku: '',
        color: '',
        depth: '',
        firmness: '',
        size: '',
        length: '',
        width: '',
        height: '',
        availability: true,
        originalPrice: undefined,
        currentPrice: undefined,
        variant_image: '',
      },
    ]))
  }

  const updateVariant = (id: string, patch: Partial<VariantRow>) => {
    setVariants(v => v.map(row => row.id === id ? { ...row, ...patch } : row))
  }

  const removeVariant = (id: string) => {
    setVariants(v => v.filter(row => row.id !== id))
  }

  // Helper functions for managing sections
  const addDescriptionParagraph = () => {
    setDescriptionParagraphs(prev => [...prev, { heading: '', content: '', image: '' }])
  }

  const updateDescriptionParagraph = (index: number, field: 'heading' | 'content', value: string) => {
    setDescriptionParagraphs(prev => prev.map((para, i) => 
      i === index ? { ...para, [field]: value } : para
    ))
  }

  const removeDescriptionParagraph = (index: number) => {
    setDescriptionParagraphs(prev => prev.filter((_, i) => i !== index))
  }

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...newFaq }])
      setNewFaq({ question: '', answer: '' })
    }
  }

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index))
  }

  const addWarrantySection = () => {
    setWarrantySections(prev => [...prev, { heading: '', content: '' }])
  }

  const updateWarrantySection = (index: number, field: 'heading' | 'content', value: string) => {
    setWarrantySections(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ))
  }

  const removeWarrantySection = (index: number) => {
    setWarrantySections(prev => prev.filter((_, i) => i !== index))
  }

  const addImportantNotice = () => {
    if (newNotice.trim()) {
      setImportantNotices(prev => [...prev, {
      id: crypto.randomUUID(),
        noticeText: newNotice,
        sortOrder: prev.length
      }])
      setNewNotice('')
    }
  }

  const removeImportantNotice = (id: string) => {
    setImportantNotices(prev => prev.filter(notice => notice.id !== id))
  }

  // Badge management functions
  const getBadgeStatus = (type: 'sale' | 'new_in' | 'free_gift') => {
    return badges.find(badge => badge.type === type)?.enabled || false
  }

  const handleBadgeToggle = (type: 'sale' | 'new_in' | 'free_gift', enabled: boolean) => {
    setBadges(prev => prev.map(badge => 
      badge.type === type ? { ...badge, enabled } : badge
    ))
  }

  // Popular categories management
  const togglePopularCategory = (categoryName: string) => {
    setSelectedPopularCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    )
  }

  // Popular categories data based on current product category (match add form)
  const getPopularCategories = () => {
    if (category === 'beds') {
      return [
        { name: 'Luxury Beds', filterKey: 'Bed Type', filterValue: 'Luxury' },
        { name: 'Fabric Beds', filterKey: 'Bed Type', filterValue: 'Fabric' },
        { name: 'Wooden Beds', filterKey: 'Bed Type', filterValue: 'Wooden' },
        { name: 'Children Beds', filterKey: 'Bed Type', filterValue: 'Children' },
        { name: 'Bunk Beds', filterKey: 'Bed Type', filterValue: 'Bunk' },
        { name: 'Sofa Beds', filterKey: 'Bed Type', filterValue: 'Sofa' },
        { name: 'Storage Beds', filterKey: 'Bed Type', filterValue: 'Storage' },
        { name: 'Ottoman Beds', filterKey: 'Bed Type', filterValue: 'Ottoman' }
      ]
    } else if (category === 'sofas') {
      return [
        { name: 'L Shape Sofa', filterKey: 'Sofa Type', filterValue: 'L Shape' },
        { name: '3 Seater Sofa', filterKey: 'Sofa Type', filterValue: '3 Seater' },
        { name: 'Sofa Bed', filterKey: 'Sofa Type', filterValue: 'Sofa Bed' },
        { name: '2 Seater Sofa', filterKey: 'Sofa Type', filterValue: '2 Seater' },
        { name: 'Recliner Sofa', filterKey: 'Sofa Type', filterValue: 'Recliner' },
        { name: 'Corner Sofa', filterKey: 'Sofa Type', filterValue: 'Corner' },
        { name: 'Fabric Sofa', filterKey: 'Sofa Material', filterValue: 'Fabric' },
        { name: 'Leather Sofa', filterKey: 'Sofa Material', filterValue: 'Leather' },
        { name: 'New In', filterKey: 'Status', filterValue: 'New' },
        { name: 'Sale', filterKey: 'Status', filterValue: 'Sale' },
        { name: 'Clearance', filterKey: 'Status', filterValue: 'Clearance' }
      ]
    } else if (category === 'kids') {
      return [
        { name: 'Mattresses', filterKey: 'Kids Category', filterValue: 'Mattresses' },
        { name: 'Beds', filterKey: 'Kids Category', filterValue: 'Beds' },
        { name: 'Bunk Beds', filterKey: 'Kids Category', filterValue: 'Bunk Beds' },
        { name: 'New In', filterKey: 'Kids Status', filterValue: 'New' },
        { name: 'Clearance', filterKey: 'Kids Status', filterValue: 'Clearance' },
        { name: 'Sale', filterKey: 'Kids Status', filterValue: 'Sale' }
      ]
    }
    // Default mattress-centric set
    return [
      { name: 'Most Cooling', filterKey: 'Features', filterValue: 'Cooling' },
      { name: 'Soft Comfort', filterKey: 'Firmness', filterValue: 'Soft' },
      { name: 'Firm Comfort', filterKey: 'Firmness', filterValue: 'Firm' },
      { name: 'Medium Comfort', filterKey: 'Firmness', filterValue: 'Medium' },
      { name: 'Super Firm', filterKey: 'Features', filterValue: 'Heavy Duty' },
      { name: 'Most Support', filterKey: 'Features', filterValue: 'Extra Support' },
      { name: 'Luxury', filterKey: 'Mattress Type', filterValue: 'Luxury' },
      { name: 'Hybrid', filterKey: 'Mattress Type', filterValue: 'Hybrid' },
      { name: 'Pocket Sprung', filterKey: 'Mattress Type', filterValue: 'Pocket Sprung' },
      { name: 'Coil Sprung', filterKey: 'Mattress Type', filterValue: 'Coil Sprung' },
      { name: 'Kids', filterKey: 'Mattress Type', filterValue: 'Kids' },
      { name: 'Bunk Beds', filterKey: 'Mattress Type', filterValue: 'Bunk Beds' },
    ]
  }

  // Reasons to buy management
  const addReasonToBuy = () => {
    if (newReason.trim()) {
      setReasonsToBuy(prev => [...prev, newReason.trim()])
      setNewReason('')
    }
  }

  const removeReasonToBuy = (index: number) => {
    setReasonsToBuy(prev => prev.filter((_, i) => i !== index))
  }

  // Features management
  const addReasonToLove = (reason: string, description: string, smalltext: string, icon: string) => {
    setSelectedReasonsToLove(prev => [...prev, { reason, description, smalltext, icon }])
  }

  const removeReasonToLove = (index: number) => {
    setSelectedReasonsToLove(prev => prev.filter((_, i) => i !== index))
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  const getImageWebPSetting = (imageId: string) => {
    return imageWebPSettings.get(imageId) || { convert: convertToWebP, quality: webpQuality }
  }

  const setImageWebPSetting = (imageId: string, convert: boolean, quality: number) => {
    setImageWebPSettings(prev => new Map(prev.set(imageId, { convert, quality })))
  }

  const updateReasonToLoveDescription = (index: number, description: string) => {
    setSelectedReasonsToLove(prev => prev.map((item, i) => 
      i === index ? { ...item, description } : item
    ))
  }

  const updateReasonToLoveSmalltext = (index: number, smalltext: string) => {
    setSelectedReasonsToLove(prev => prev.map((item, i) => 
      i === index ? { ...item, smalltext } : item
    ))
  }

  // Helper function to get popular categories
  // Removed simple list; using dynamic getPopularCategories() defined above to match add form



  // getFeaturesForCategory is now centralized to keep parity with feature cards



  // Removed local getFeatureCardsForCategory to use centralized list from lib/feature-cards

  // Icon component mapping
  const getIconComponentAdmin = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      springs: () => <div className="w-6 h-6 bg-orange-500 rounded-full" />,
      brain: () => <div className="w-6 h-6 bg-blue-500 rounded-full" />,
      'sliders-horizontal': () => <div className="w-6 h-6 bg-green-500 rounded-full" />,
      shield: () => <div className="w-6 h-6 bg-purple-500 rounded-full" />,
      thermometer: () => <div className="w-6 h-6 bg-red-500 rounded-full" />,
      zap: () => <div className="w-6 h-6 bg-yellow-500 rounded-full" />,
      package: () => <div className="w-6 h-6 bg-indigo-500 rounded-full" />,
      crown: () => <div className="w-6 h-6 bg-pink-500 rounded-full" />,
      square: () => <div className="w-6 h-6 bg-gray-500 rounded-full" />,
      'refresh-cw': () => <div className="w-6 h-6 bg-teal-500 rounded-full" />,
      'corner-down-left': () => <div className="w-6 h-6 bg-orange-500 rounded-full" />,
      grid: () => <div className="w-6 h-6 bg-cyan-500 rounded-full" />,
      snowflake: () => <div className="w-6 h-6 bg-blue-500 rounded-full" />,
      leaf: () => <div className="w-6 h-6 bg-green-500 rounded-full" />
    }
    return iconMap[iconName] || (() => <div className="w-6 h-6 bg-gray-500 rounded-full" />)
  }

  // Image upload functions (no auto-crop on upload)
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      setUploadingImage(true)
      const fileArray = Array.from(files)
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('preset', 'medium')
          formData.append('convert', String(convertToWebP))
          formData.append('format', convertToWebP ? 'webp' : 'original')
          if (convertToWebP) formData.append('quality', String(webpQuality))

          const response = await fetch('/api/upload-optimized', {
            method: 'POST',
            body: formData
          })

          if (response.ok) {
            const result = await response.json()
            setImages(prev => [...prev, { id: crypto.randomUUID(), url: result.url, file: undefined }])
          } else {
            const error = await response.json().catch(() => ({}))
            console.error('[Edit Form] Optimized upload error:', error)

            // Fallback to regular upload
            const fallbackFormData = new FormData()
            fallbackFormData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: fallbackFormData })
            if (!res.ok) {
              const err = await res.json().catch(() => ({}))
              throw new Error(err.error || 'Upload failed')
            }
            const json = await res.json()
            setImages(prev => [...prev, { id: crypto.randomUUID(), url: json.url, file: undefined }])
          }
        } catch (e) {
          console.error('[Edit Form] Image upload error:', e)
          alert('Failed to upload image: ' + (e instanceof Error ? e.message : 'Unknown error'))
        }
      }
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!imageToCrop) return

    try {
      setUploadingImage(true)
      
      // Convert data URL to File
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], imageToCrop.name, { type: 'image/jpeg' })
      
      // Use toggle values for WebP conversion
      const convert = convertToWebP
      const quality = convertToWebP ? webpQuality : undefined
      
      // Upload the cropped file
      try {
        // Use optimized upload API for additional images
            const formData = new FormData()
            formData.append('file', file)
        formData.append('preset', 'medium') // Use medium preset for additional images
        formData.append('convert', String(convert))
        formData.append('format', convert ? 'webp' : 'original')
        if (typeof quality === 'number') formData.append('quality', String(quality))
            
            const response = await fetch('/api/upload-optimized', {
              method: 'POST',
              body: formData
            })
            
            if (response.ok) {
              const result = await response.json()
          console.log('[Edit Form] Cropped image optimized upload result:', result)
          
          // Replace cropped image at index if set, else append
          setImages(prev => {
            if (croppingImageIndex !== null && prev[croppingImageIndex]) {
              const next = [...prev]
              next[croppingImageIndex] = { ...next[croppingImageIndex], url: result.url }
              return next
            }
            return [...prev, { id: crypto.randomUUID(), url: result.url, file: undefined }]
          })
          setCroppedImages(prev => new Map(prev.set(imageToCrop.name, croppedImageUrl)))
          
          alert(`Image cropped and uploaded successfully!\n\n📁 File: ${file.name}\n📏 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
            } else {
              const error = await response.json()
          console.error('[Edit Form] Cropped image optimized upload error:', error)
          
            // Fallback to regular upload
          const fallbackFormData = new FormData()
          fallbackFormData.append('file', file)
          
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: fallbackFormData,
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || 'Upload failed')
          }

          const json = await res.json()
          console.log('[Edit Form] Cropped image fallback upload result:', json)
          
          // Replace cropped image at index if set, else append
          setImages(prev => {
            if (croppingImageIndex !== null && prev[croppingImageIndex]) {
              const next = [...prev]
              next[croppingImageIndex] = { ...next[croppingImageIndex], url: json.url }
              return next
            }
            return [...prev, { id: crypto.randomUUID(), url: json.url, file: undefined }]
          })
          setCroppedImages(prev => new Map(prev.set(imageToCrop.name, croppedImageUrl)))
          
          alert('Image cropped and uploaded successfully (fallback mode)')
        }
      } catch (error) {
        console.error('[Edit Form] Cropped image upload error:', error)
        alert('Failed to upload cropped image: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    } catch (error) {
      console.error('Error processing cropped image:', error)
      alert('Error processing cropped image: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploadingImage(false)
      setCropModalOpen(false)
      setImageToCrop(null)
      setCroppingImageIndex(null)
    }
  }


  const handleDescriptionFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]
      
      // Use toggle values for WebP conversion
      const convert = convertToWebP
      const quality = convertToWebP ? webpQuality : undefined
            
            try {
              // Use optimized upload API for description images
              const formData = new FormData()
              formData.append('file', file)
              formData.append('preset', 'medium') // Use medium preset for description images
        formData.append('convert', String(convert))
        formData.append('format', convert ? 'webp' : 'original')
        if (typeof quality === 'number') formData.append('quality', String(quality))
              
              const response = await fetch('/api/upload-optimized', {
                method: 'POST',
                body: formData
              })
              
              if (response.ok) {
                const result = await response.json()
          
          // Show upload success alert for description image
          const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
          
          alert(`Description image uploaded successfully!\n\n📁 File: ${file.name}\n📏 Size: ${fileSizeMB} MB`)
          
          // Update the description paragraph with the optimized image URL
          const newParagraphs = [...descriptionParagraphs]
          newParagraphs[index].image = result.url
          setDescriptionParagraphs(newParagraphs)
          
          console.log('[Edit Form] Description image optimized upload result:', result)
              } else {
                const error = await response.json()
          console.error('[Edit Form] Description image optimized upload error:', error)
          
                // Fallback to regular upload
          const fallbackFormData = new FormData()
          fallbackFormData.append('file', file)
          
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: fallbackFormData,
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || 'Upload failed')
          }

          const json = await res.json()
          
          // Update the description paragraph with the fallback image URL
          const newParagraphs = [...descriptionParagraphs]
          newParagraphs[index].image = json.url
          setDescriptionParagraphs(newParagraphs)
          
          alert('Description image uploaded successfully (fallback mode)')
        }
      } catch (error) {
        console.error('[Edit Form] Description image upload error:', error)
        alert('Failed to upload description image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const payload: any = {
        name,
        category,
        rating,
        headline,
        longDescription,
        warrantyDeliveryLine,
        careInstructions,
        trialInformation,
        trialInformationHeading,
        firmnessScale,
        supportLevel,
        pressureReliefLevel,
        airCirculationLevel,
        durabilityLevel,
        images: images.map(img => img.url), // Extract URLs from image objects
        mainImageIndex: mainImageIndex,
        descriptionParagraphs,
        faqs,
        warrantySections,
        dimensions,
        importantNotices,
        badges,
        // Send both for backward compatibility with API; prefer popularCategories (rich objects)
        selectedPopularCategories,
        popularCategories: getPopularCategories().filter(cat => selectedPopularCategories.includes(cat.name)),
        reasonsToBuy,
        selectedFeatures,
        selectedReasonsToLove,
        variants
      }

      // Omit empty arrays so API won't clear existing data unintentionally
      if (Array.isArray(payload.selectedFeatures) && payload.selectedFeatures.length === 0) {
        delete payload.selectedFeatures
      }
      if (Array.isArray(payload.reasonsToBuy) && payload.reasonsToBuy.length === 0) {
        delete payload.reasonsToBuy
      }
      if (Array.isArray(payload.selectedReasonsToLove) && payload.selectedReasonsToLove.length === 0) {
        delete payload.selectedReasonsToLove
      }
      if (Array.isArray(payload.selectedPopularCategories) && payload.selectedPopularCategories.length === 0) {
        delete payload.selectedPopularCategories
      }
      // Always include importantNotices, even if empty, so API can clear them if needed
      // Don't delete importantNotices from payload

      // Debug logging
      console.log('Frontend payload being sent:', {
        selectedFeatures,
        reasonsToBuy,
        selectedReasonsToLove,
        selectedPopularCategories,
        importantNotices
      })
      
      console.log('Full payload being sent:', payload)

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
          </div>
            <Link href="/admin/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>
        </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 mb-2 inline-block">
              ← Back to Products
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product: {name}</h1>
              </div>
          <Button onClick={handleSubmit} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
            </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                />
              </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
            </div>
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                    />
              </div>
                  <div>
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Enter product headline"
                    />
            </div>
          </div>
                <div className="mt-4">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Enter detailed product description"
                    rows={4}
                  />
        </div>
                
      </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Images</h2>
                <div className="space-y-4">

                  <div>
                    <Label>Add Images</Label>
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Upload Images</Label>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            onChange={(e) => handleImageUpload(e.target.files)}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {uploadingImage && (
                            <div className="mt-2 text-sm text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
                              Uploading and optimizing images...
                          </div>
                        )}
                          <p className="text-xs text-gray-500 mt-1">
                            Images will be processed according to your upload settings above
                          </p>
                        </div>

                        {/* URL Input */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Or Add Image URLs</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="https://..." 
                              value={newImage} 
                              onChange={e => setNewImage(e.target.value)} 
                            />
                              <Button
                              onClick={() => { 
                                if (newImage.trim()) { 
                                  setImages(imgs => [...imgs, { id: crypto.randomUUID(), url: newImage.trim(), file: undefined }]); 
                                  setNewImage('') 
                                } 
                              }}
                            >
                              Add URL
                              </Button>
                            </div>
                        </div>

                        {/* Display Images */}
                        {images.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Current Images ({images.length})</Label>
                            <div className="text-sm text-gray-600 mb-3">
                              Image Sequence (drag to reorder)
                            </div>
                            <ul className="space-y-2">
                              {images.map((image, idx) => (
                                <li 
                                  key={image.id} 
                                  className={`flex items-center justify-between gap-2 p-3 rounded border transition-all duration-200 cursor-move ${
                                    draggedIndex === idx 
                                      ? 'bg-blue-100 border-blue-300 shadow-lg transform scale-105' 
                                      : mainImageIndex === idx
                                      ? 'bg-green-50 border-green-300 hover:border-green-400'
                                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                                  }`}
                                  draggable
                                  onDragStart={(e) => {
                                    setDraggedIndex(idx)
                                    e.dataTransfer.setData('text/plain', idx.toString())
                                    e.dataTransfer.effectAllowed = 'move'
                                  }}
                                  onDragEnd={() => {
                                    setDraggedIndex(null)
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault()
                                    e.dataTransfer.dropEffect = 'move'
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault()
                                    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'))
                                    const newImages = [...images]
                                    const draggedItem = newImages[draggedIndex]
                                    newImages.splice(draggedIndex, 1)
                                    newImages.splice(idx, 0, draggedItem)
                                    setImages(newImages)
                                    
                                    setDraggedIndex(null)
                                  }}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                                        {idx + 1}
                          </div>
                                      <div className="text-xs text-gray-500 text-center">Drag</div>
                        </div>
                                    <div className="flex flex-col gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (idx > 0) {
                                            const newImages = [...images]
                                            const temp = newImages[idx]
                                            newImages[idx] = newImages[idx - 1]
                                            newImages[idx - 1] = temp
                                            setImages(newImages)
                                            
                                          }
                                        }}
                                        disabled={idx === 0}
                                        className="w-6 h-4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        type="button"
                   onClick={() => {
                                          if (idx < images.length - 1) {
                                            const newImages = [...images]
                                            const temp = newImages[idx]
                                            newImages[idx] = newImages[idx + 1]
                                            newImages[idx + 1] = temp
                                            setImages(newImages)
                                            
                                          }
                                        }}
                                        disabled={idx === images.length - 1}
                                        className="w-6 h-4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                                      >
                                        ↓
                                      </button>
                     </div>
                                    <img 
                                      src={image.url} 
                                      alt={`Product image ${idx + 1}`} 
                                      className="w-12 h-12 object-cover rounded border"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <div className="truncate text-sm text-gray-700">{image.url}</div>
                                        {mainImageIndex === idx && (
                                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                                            MAIN
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500">Position {idx + 1}</div>
                                      
                                      {/* Individual WebP Settings */}
                                      <div className="mt-2 flex items-center gap-2">
                                        <label className="flex items-center gap-1 text-xs">
                                          <input
                                            type="checkbox"
                                            checked={getImageWebPSetting(image.id).convert}
                                            onChange={(e) => setImageWebPSetting(image.id, e.target.checked, getImageWebPSetting(image.id).quality)}
                                            className="w-3 h-3"
                                          />
                                          <span className="text-gray-600">WebP</span>
                                        </label>
                                        {getImageWebPSetting(image.id).convert && (
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-500">Quality:</span>
                                            <input
                                              type="range"
                                              min="1"
                                              max="100"
                                              value={getImageWebPSetting(image.id).quality}
                                              onChange={(e) => setImageWebPSetting(image.id, true, Number(e.target.value))}
                                              className="w-16 h-1"
                                            />
                                            <span className="text-xs text-gray-500 w-6">{getImageWebPSetting(image.id).quality}</span>
                                          </div>
                                        )}
                                      </div>
                   </div>
                 </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={async () => {
                                        // Fetch the existing image and open crop modal
                                        try {
                                          const res = await fetch(image.url)
                                          const blob = await res.blob()
                                          const file = new File([blob], `image-${idx}.jpg`, { type: blob.type || 'image/jpeg' })
                                          setImageToCrop(file)
                                          setCroppingImageIndex(idx)
                                          setCropModalOpen(true)
                                        } catch (e) {
                                          console.error('Failed to open image for cropping', e)
                                          alert('Failed to open image for cropping')
                                        }
                                      }}
                                      className="text-xs"
                                    >
                                      Open in crop mode
                                    </Button>
                                    {mainImageIndex !== idx && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setAsMainImage(idx)}
                                        className="text-xs"
                                      >
                                        Set as Main
                                      </Button>
                                    )}
                     <Button 
                       variant="ghost" 
                       size="sm" 
                                      onClick={() => {
                                        setImages(imgs => imgs.filter((_, i) => i !== idx))
                                        // Adjust main image index if needed
                                        if (mainImageIndex >= images.length - 1) {
                                          setMainImageIndex(Math.max(0, images.length - 2))
                                        }
                                      }}
                     >
                       Remove
                     </Button>
                   </div>
                                </li>
                              ))}
                            </ul>
                            {images.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">
                                  <strong>Total Images:</strong> {images.length}
                                  <div className="mt-2 text-green-600 font-medium">
                                    <span className="inline-flex items-center gap-1">
                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                      Main Image: Position {mainImageIndex + 1}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
             </div>
           )}
         </div>
          </div>
        </div>
      </Card>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
                <div className="mb-4">
                  <Button onClick={addVariant} className="bg-blue-600 hover:bg-blue-700">
                    Add New Variant
                  </Button>
              </div>
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Variant {index + 1}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                          onClick={() => removeVariant(variant.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                          Remove
                          </Button>
                        </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
                          <Label>SKU</Label>
              <Input 
                            value={variant.sku || ''}
                            onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                            placeholder="SKU"
              />
            </div>
                        <div>
                          <Label>Size</Label>
                          <Input 
                            value={variant.size || ''}
                            onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
                            placeholder="Size"
                          />
                        </div>
                        <div>
                          <Label>Color</Label>
                          <Input 
                            value={variant.color || ''}
                            onChange={(e) => updateVariant(variant.id, { color: e.target.value })}
                            placeholder="Color"
                          />
                        </div>
                        <div>
                          <Label>Depth</Label>
                          <Input
                            value={variant.depth || ''}
                            onChange={(e) => updateVariant(variant.id, { depth: e.target.value })}
                            placeholder="Depth"
                          />
                        </div>
                        <div>
                          <Label>Firmness</Label>
                          <Input
                            value={variant.firmness || ''}
                            onChange={(e) => updateVariant(variant.id, { firmness: e.target.value })}
                            placeholder="Firmness"
                          />
                        </div>
        <div>
                          <Label>Length</Label>
                          <Input
                            value={variant.length || ''}
                            onChange={(e) => updateVariant(variant.id, { length: e.target.value })}
                            placeholder="Length"
          />
        </div>
          <div>
                          <Label>{(product.category || '').toLowerCase() === 'sofas' ? 'Depth' : 'Width'}</Label>
            <Input 
                            value={((product.category || '').toLowerCase() === 'sofas' ? variant.depth : variant.width) || ''}
                            onChange={(e) => (product.category || '').toLowerCase() === 'sofas' 
                              ? updateVariant(variant.id, { depth: e.target.value }) 
                              : updateVariant(variant.id, { width: e.target.value })}
                            placeholder={(product.category || '').toLowerCase() === 'sofas' ? 'Depth' : 'Width'}
            />
          </div>
          <div>
                          <Label>Height</Label>
            <Input 
                            value={variant.height || ''}
                            onChange={(e) => updateVariant(variant.id, { height: e.target.value })}
                            placeholder="Height"
            />
          </div>
          <div>
                          <Label>Availability</Label>
                          <select
                            value={variant.availability ? 'true' : 'false'}
                            onChange={(e) => updateVariant(variant.id, { availability: e.target.value === 'true' })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                          </select>
          </div>
          <div>
                          <Label>Original Price</Label>
              <Input 
                            type="number"
                            step="0.01"
                            value={variant.originalPrice || ''}
                            onChange={(e) => updateVariant(variant.id, { originalPrice: parseFloat(e.target.value) })}
                            placeholder="0.00"
              />
            </div>
          <div>
                          <Label>Current Price</Label>
              <Input 
                            type="number"
                            step="0.01"
                            value={variant.currentPrice || ''}
                            onChange={(e) => updateVariant(variant.id, { currentPrice: parseFloat(e.target.value) })}
                            placeholder="0.00"
              />
            </div>
          <div>
                          <Label>Variant Image</Label>
              <Input 
                            value={variant.variant_image || ''}
                            onChange={(e) => updateVariant(variant.id, { variant_image: e.target.value })}
                            placeholder="Image URL"
              />
            </div>
          </div>
            </div>
                  ))}
          </div>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Content & Media</h2>
                <div className="space-y-4">
          <div>
                    <Label htmlFor="warrantyDeliveryLine">Warranty & Delivery Line</Label>
              <Input 
                      id="warrantyDeliveryLine"
                      value={warrantyDeliveryLine}
                      onChange={(e) => setWarrantyDeliveryLine(e.target.value)}
                      placeholder="e.g., 10-Year Warranty • Free Delivery • 100-Night Trial"
              />
            </div>
          <div>
                    <Label htmlFor="careInstructions">Care Instructions</Label>
                    <Textarea
                      id="careInstructions"
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                      placeholder="Enter care instructions"
                      rows={3}
              />
            </div>
                  <div>
                    <Label htmlFor="trialInformationHeading">Trial Heading</Label>
            <Input 
                      id="trialInformationHeading"
                      value={trialInformationHeading}
                      onChange={(e) => setTrialInformationHeading(e.target.value)}
                      placeholder="Enter trial section heading"
            />
                  </div>
                  <div>
                    <Label htmlFor="trialInformation">Trial Information</Label>
            <Textarea 
                      id="trialInformation"
                      value={trialInformation}
                      onChange={(e) => setTrialInformation(e.target.value)}
                      placeholder="Enter trial information"
                      rows={3}
                    />
                  </div>
        </div>
      </Card>



              {/* Important Notices */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Important Notices</h2>
                  <Button onClick={addImportantNotice} variant="outline" size="sm">
            Add Notice
          </Button>
        </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter important notice"
                      value={newNotice}
                      onChange={(e) => setNewNotice(e.target.value)}
                    />
                    <Button onClick={addImportantNotice}>Add</Button>
                  </div>
                  {importantNotices.map((notice) => (
                    <div key={notice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{notice.noticeText}</span>
                <Button
                        onClick={() => removeImportantNotice(notice.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
      </Card>
            </TabsContent>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Product Description</h2>
                  <Button onClick={addDescriptionParagraph} variant="outline" size="sm">
                    Add Paragraph
                  </Button>
        </div>
                <p className="text-sm text-gray-600 mb-4">Add 3 description paragraphs with images for the product page.</p>
                <div className="space-y-4">
                  {descriptionParagraphs.map((para, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Paragraph {index + 1} Heading</h3>
                        <Button 
                          onClick={() => removeDescriptionParagraph(index)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                  </div>
                      <div className="space-y-3">
                    <div>
                          <Label>Heading</Label>
                          <Input
                            value={para.heading}
                            onChange={(e) => updateDescriptionParagraph(index, 'heading', e.target.value)}
                            placeholder="Enter heading"
                          />
                    </div>
          <div>
                          <Label>Content</Label>
                          <Textarea
                            value={para.content}
                            onChange={(e) => updateDescriptionParagraph(index, 'content', e.target.value)}
                            placeholder="Enter content"
                            rows={3}
                          />
          </div>
          <div>
                          <Label>Image</Label>
                          <div className="space-y-2">
                            <Input
                              placeholder="Image URL"
                              value={para.image}
                              onChange={(e) => {
                                const newParagraphs = [...descriptionParagraphs]
                                newParagraphs[index].image = e.target.value
                                setDescriptionParagraphs(newParagraphs)
                              }}
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleDescriptionFileUpload(index, e)}
                                  className="text-sm"
                                />
                                <span className="text-sm text-gray-500">Upload image</span>
            </div>
                              {para.image && (
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={para.image} 
                                    alt={`Description ${index + 1}`} 
                                    className="w-16 h-16 object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                    }}
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                      const newParagraphs = [...descriptionParagraphs]
                                      newParagraphs[index].image = ''
                                      setDescriptionParagraphs(newParagraphs)
                                    }}
                                  >
                                    Remove Image
                                  </Button>
          </div>
                              )}
          </div>
          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Features</h2>
                <div className="space-y-4">
              <div>
                    <Label>Firmness Scale</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {([
                    'Soft',
                    'Soft-Medium',
                    'Medium',
                    'Medium-Firm',
                    'Firm',
                    'Extra-firm',
                  ] as const).map((val) => (
                    <label key={val} className={`px-3 py-1 rounded border cursor-pointer text-sm ${firmnessScale===val ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                          <input type="radio" name="firmness" className="mr-1" checked={firmnessScale===val} onChange={() => setFirmnessScale(val)} />{val}
                    </label>
                  ))}
                </div>
              </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Support</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`support-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${supportLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="support" className="mr-1" checked={supportLevel===l} onChange={() => setSupportLevel(l)} />{l}
                    </label>
                  ))}
                </div>
                <Label className="mt-3 block">Pressure Relief</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`pressure-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${pressureReliefLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="pressure" className="mr-1" checked={pressureReliefLevel===l} onChange={() => setPressureReliefLevel(l)} />{l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Air Circulation</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`air-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${airCirculationLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="air" className="mr-1" checked={airCirculationLevel===l} onChange={() => setAirCirculationLevel(l)} />{l}
                    </label>
                  ))}
                </div>
                      <Label className="mt-3 block">Durability</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`durability-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${durabilityLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="durability" className="mr-1" checked={durabilityLevel===l} onChange={() => setDurabilityLevel(l)} />{l}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
              </Card>

              {/* Product Badges Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Badges</h3>
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
                      <Badge className="ml-3 bg-blue-500 text-white text-sm">New In</Badge>
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
                      <Badge className="ml-3 bg-green-500 text-white text-sm">Free Gift</Badge>
                    </div>
                    <span className="text-sm text-gray-500">Shows when product comes with free gift</span>
                  </label>
                      </div>
              </Card>

              {/* Mattress Features Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Features & Reasons</h3>
                <div className="mb-4">
                  <div className="font-semibold mb-2">{categories.find(c => c.value === category)?.label} features</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {getFeaturesForCategory(category).map((feature, index) => (
                      <label key={`${feature}-${index}`} className={`flex items-center gap-2 rounded border p-2 cursor-pointer ${selectedFeatures.includes(feature) ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                        <input 
                          type="checkbox" 
                          className="h-4 w-4" 
                          checked={selectedFeatures.includes(feature)} 
                          onChange={() => {
                            const exists = selectedFeatures.includes(feature)
                            setSelectedFeatures(exists ? selectedFeatures.filter(f => f !== feature) : [...selectedFeatures, feature])
                          }} 
                        />
                        <span className="text-sm text-gray-800">{feature}</span>
                      </label>
                    ))}
                          </div>
            </div>
      </Card>

              {/* Popular Categories Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
                <p className="text-sm text-gray-600 mb-4">Select which popular categories this product should appear in. These categories are shown on the product pages.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getPopularCategories().map((category) => (
                    <label key={category.name} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4" 
                        checked={selectedPopularCategories.includes(category.name)} 
                        onChange={() => togglePopularCategory(category.name)} 
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </label>
                  ))}
              </div>
              
                {selectedPopularCategories.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Selected:</strong> {selectedPopularCategories.join(', ')}
                </p>
              </div>
                )}
              </Card>

              {/* Features You Will Love Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Features You Will Love - Select from available {categories.find(c => c.value === category)?.label?.toLowerCase()} features:
                </h3>
                
                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {getFeatureCardsForCategory(category).map((feature) => {
                    const isSelected = selectedReasonsToLove.some(item => item.reason === feature.title)
                    const IconComponent = getIconComponentAdmin(feature.icon)
                      
                      return (
                        <div 
                        key={feature.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            isSelected 
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                            // Remove if already selected
                            const index = selectedReasonsToLove.findIndex(item => item.reason === feature.title)
                            if (index !== -1) {
                              removeReasonToLove(index)
                            }
                            } else {
                            // Add if not selected
                            addReasonToLove(feature.title, feature.description, '', feature.icon)
                          }
                        }}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 text-orange-500 flex items-center justify-center">
                            <IconComponent />
                              </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      )
                  })}
            </div>

                {/* Display selected features with custom description inputs */}
                {selectedReasonsToLove.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <Label className="text-sm font-medium">Customize descriptions for selected features (optional):</Label>
                    {selectedReasonsToLove.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.reason}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeReasonToLove(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                  </Button>
                </div>
                        <Textarea
                          placeholder="Customize the description or leave as default..."
                          value={item.description}
                          onChange={(e) => updateReasonToLoveDescription(index, e.target.value)}
                          rows={2}
                          className="w-full"
                        />
                        <div className="mt-3">
                          <Label className="text-sm font-medium mb-2 block">Small Text (displayed below icon)</Label>
                          <Input
                            placeholder="Enter small descriptive text..."
                            value={item.smalltext || ''}
                            onChange={(e) => updateReasonToLoveSmalltext(index, e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This text will appear below the icon in the feature card on the product page.
                          </p>
              </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to use the default description, or customize it for this specific product.
                        </p>
            </div>
                    ))}
        </div>
      )}

                {/* Create a custom feature card */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-semibold mb-3">Add a custom feature card</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        placeholder="e.g., Breathable Cover"
                        value={newLoveReason}
                        onChange={(e) => setNewLoveReason(e.target.value)}
                      />
              </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Input
                        placeholder="Short description that appears in the card"
                        value={newLoveDescription}
                        onChange={(e) => setNewLoveDescription(e.target.value)}
                      />
                  </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs">Small Text (optional)</Label>
                      <Input
                        placeholder="Small subtext displayed under the icon"
                        value={newLoveSmalltext}
                        onChange={(e) => setNewLoveSmalltext(e.target.value)}
                      />
                </div>
              </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={() => {
                        const title = newLoveReason.trim()
                        if (!title) return
                        addReasonToLove(title, newLoveDescription.trim(), newLoveSmalltext.trim(), 'check')
                        setNewLoveReason('')
                        setNewLoveDescription('')
                        setNewLoveSmalltext('')
                      }}
                    >
                      Add Feature Card
                    </Button>
            </div>
                </div>
              </Card>

              {/* Reasons to Buy Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reasons to Buy (add as many as needed)</h3>
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="Add a reason to buy" 
                    value={newReason} 
                    onChange={e => setNewReason(e.target.value)} 
                  />
                  <Button onClick={addReasonToBuy}>Add</Button>
                </div>
                {reasonsToBuy.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {reasonsToBuy.map((reason, i) => (
                      <li key={`${reason}-${i}`} className="flex items-center justify-between gap-2">
                        <span>{reason}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeReasonToBuy(i)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dimensions & Specifications</h2>
                <p className="text-sm text-gray-600 mb-6">Enter product dimensions and technical specifications. You can customize the headings for each field.</p>
                
                {/* Section 1: Basic Dimensions */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id="show_basic_dimensions_edit"
                      checked={dimensions.show_basic_dimensions}
                      onCheckedChange={(checked) => setDimensions({...dimensions, show_basic_dimensions: checked as boolean})}
                    />
                    <label htmlFor="show_basic_dimensions_edit" className="text-sm font-medium text-gray-700">
                      Show Basic Dimensions Section
                    </label>
                          </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Height</Label>
                      <Input
                        value={dimensions.height}
                        onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                        placeholder="25 cm"
                      />
                        </div>
                    <div>
                      <Label>Length</Label>
                      <Input
                        value={dimensions.length}
                        onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                        placeholder="L 190cm"
                      />
                      </div>
                    <div>
                      <Label>Width</Label>
                      <Input
                        value={dimensions.width}
                        onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                        placeholder="135cm"
                      />
                    </div>
                    </div>
                  </div>

                {/* Section 2: Mattress Specifications */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id="show_mattress_specs_edit"
                      checked={dimensions.show_mattress_specs}
                      onCheckedChange={(checked) => setDimensions({...dimensions, show_mattress_specs: checked as boolean})}
                    />
                    <label htmlFor="show_mattress_specs_edit" className="text-sm font-medium text-gray-700">
                      Show Mattress Specifications Section
                    </label>
                      </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Mattress Size</Label>
                      <Input
                        value={dimensions.mattressSize}
                        onChange={(e) => setDimensions({...dimensions, mattressSize: e.target.value})}
                        placeholder="135cm x L 190cm cm"
                      />
                        </div>
                    <div>
                      <Label>Max Height</Label>
                      <Input
                        value={dimensions.maxHeight}
                        onChange={(e) => setDimensions({...dimensions, maxHeight: e.target.value})}
                        placeholder="25 cm"
                      />
                      </div>
                    <div>
                      <Label>Weight Capacity</Label>
                      <Input
                        value={dimensions.weightCapacity}
                        onChange={(e) => setDimensions({...dimensions, weightCapacity: e.target.value})}
                        placeholder="200 kg"
                      />
                    </div>
                    </div>
                  </div>

                {/* Section 3: Technical Specifications */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id="show_technical_specs_edit"
                      checked={dimensions.show_technical_specs}
                      onCheckedChange={(checked) => setDimensions({...dimensions, show_technical_specs: checked as boolean})}
                    />
                    <label htmlFor="show_technical_specs_edit" className="text-sm font-medium text-gray-700">
                      Show Technical Specifications Section
                    </label>
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Pocket Springs</Label>
                      <Input
                        value={dimensions.pocketSprings}
                        onChange={(e) => setDimensions({...dimensions, pocketSprings: e.target.value})}
                        placeholder="1000 count"
                      />
                  </div>
                    <div>
                      <Label>Comfort Layer</Label>
                      <Input
                        value={dimensions.comfortLayer}
                        onChange={(e) => setDimensions({...dimensions, comfortLayer: e.target.value})}
                        placeholder="8 cm"
                      />
              </div>
                    <div>
                      <Label>Support Layer</Label>
                      <Input
                        value={dimensions.supportLayer}
                        onChange={(e) => setDimensions({...dimensions, supportLayer: e.target.value})}
                        placeholder="17 cm"
                      />
            </div>
                  </div>
                </div>
              </Card>

              {/* Dimension Disclaimer */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dimension Disclaimer</h2>
                <div>
                  <Label htmlFor="dimensionDisclaimer">Disclaimer Text</Label>
                  <Textarea
                    id="dimensionDisclaimer"
                    value={dimensions.dimensionDisclaimer}
                    onChange={(e) => setDimensions({...dimensions, dimensionDisclaimer: e.target.value})}
                    placeholder="e.g., All measurements are approximate and may vary slightly."
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">This disclaimer will appear below the dimension specifications on the product page.</p>
              </div>
              </Card>

              {/* Important Notices */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Important Notices</h2>
                <p className="text-sm text-gray-600 mb-4">Add important notices that will appear in the Dimensions section of the product page. These notices will be displayed as bullet points below the technical specifications.</p>
                
                <div className="mb-4">
                  <Button onClick={addImportantNotice} variant="outline" size="sm">
                    Add Notice
                  </Button>
            </div>
                
                {importantNotices.length > 0 && (
                  <div className="space-y-3">
                    {importantNotices.map((notice, index) => (
                      <div key={notice.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">Notice {index + 1}</span>
                            <Input 
                              value={notice.noticeText} 
                              onChange={(e) => {
                                const newNotices = [...importantNotices]
                                newNotices[index].noticeText = e.target.value
                                setImportantNotices(newNotices)
                              }}
                              placeholder="Enter important notice text..."
                              className="flex-1"
                            />
          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-600">Sort Order:</Label>
                            <Input 
                              type="number"
                              value={notice.sortOrder} 
                              onChange={(e) => {
                                const newNotices = [...importantNotices]
                                newNotices[index].sortOrder = parseInt(e.target.value) || 0
                                setImportantNotices(newNotices)
                              }}
                              className="w-20 text-xs"
                            />
        </div>
         </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImportantNotice(notice.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
        </div>
      )}

                {importantNotices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No important notices added yet.</p>
                    <p className="text-sm">Click "Add Notice" to create your first important notice.</p>
              </div>
                )}
              </Card>
            </TabsContent>
              
            {/* Warranty Tab */}
            <TabsContent value="warranty" className="space-y-6">
              {/* FAQs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                  <Button onClick={addFaq} variant="outline" size="sm">
                    Add FAQ
                  </Button>
                  </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Question</Label>
                      <Input
                        placeholder="Enter question"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      />
                </div>
                    <div>
                      <Label>Answer</Label>
                      <Input
                        placeholder="Enter answer"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      />
              </div>
            </div>
                  <Button onClick={addFaq}>Add FAQ</Button>
                  
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">FAQ {index + 1}</h3>
                        <Button 
                          onClick={() => removeFaq(index)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
              </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Question</Label>
                <Input 
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...faqs]
                              newFaqs[index].question = e.target.value
                              setFaqs(newFaqs)
                            }}
                            placeholder="Enter question"
                          />
              </div>
                        <div>
                          <Label>Answer</Label>
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...faqs]
                              newFaqs[index].answer = e.target.value
                              setFaqs(newFaqs)
                            }}
                            placeholder="Enter answer"
                            rows={3}
                          />
            </div>
                </div>
                        </div>
                  ))}
                </div>
              </Card>

              {/* Warranty Sections */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Warranty Information</h2>
                  <Button onClick={addWarrantySection} variant="outline" size="sm">
                    Add Section
                  </Button>
                </div>
                <div className="space-y-4">
                  {warrantySections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Section {index + 1}</h3>
                        <Button 
                          onClick={() => removeWarrantySection(index)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Heading</Label>
                          <Input
                            value={section.heading}
                            onChange={(e) => updateWarrantySection(index, 'heading', e.target.value)}
                            placeholder="Enter heading"
                          />
                              </div>
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) => updateWarrantySection(index, 'content', e.target.value)}
                            placeholder="Enter content"
                            rows={3}
                          />
                          </div>
                        </div>
                </div>
                  ))}
            </div>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
          </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => {
          setCropModalOpen(false)
          setImageToCrop(null)
        }}
        onCrop={handleCropComplete}
        imageFile={imageToCrop}
        aspectRatio={1}
      />
    </div>
  )
}
