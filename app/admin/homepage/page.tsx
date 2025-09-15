"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { AdminNav } from '@/components/admin/admin-nav'
import { ImageUploadTest } from '@/components/admin/image-upload-test'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, 
  X, 
  Plus, 
  Save, 
  Image as ImageIcon,
  Link as LinkIcon,
  Edit3,
  Trash2
} from 'lucide-react'

interface HomePageContent {
  id?: string
  section: string
  content: any
  order: number
}

interface HeroSection {
  smallImage1: string
  smallImage2: string
  slidingImages: string[]
}

interface ImageCard {
  id: string
  image: string
  heading: string
  text: string
  buttonText: string
  buttonLink: string
}

interface QuizSection {
  image: string
  heading: string
  paragraph: string
}

interface DealOfDay {
  productIds: string[]
  description: string
  percentageOff: string
  productCards: Array<{
    productId: string
    description: string
    percentageOff: string
  }>
}

interface ProductSection {
  productIds: string[]
  description: string
}

interface MattressCard {
  productId: string
  featureToShow: string
}

interface SofaTypeCard {
  id: string
  sofaId: string
  description: string
  featureToShow: string
}

interface IdeasGuide {
  id: string
  image: string
  heading: string
  description: string
  timeToRead: string
}

export default function HomePageAdmin() {
  const [heroSection, setHeroSection] = useState<HeroSection>({
    smallImage1: '',
    smallImage2: '',
    slidingImages: ['', '', '']
  })
  
  const [imageCards, setImageCards] = useState<ImageCard[]>([
    { id: '1', image: '', heading: '', text: '', buttonText: '', buttonLink: '' },
    { id: '2', image: '', heading: '', text: '', buttonText: '', buttonLink: '' },
    { id: '3', image: '', heading: '', text: '', buttonText: '', buttonLink: '' },
    { id: '4', image: '', heading: '', text: '', buttonText: '', buttonLink: '' }
  ])
  
  const [quizSection, setQuizSection] = useState<QuizSection>({
    image: '',
    heading: '',
    paragraph: ''
  })
  
  const [dealOfDay, setDealOfDay] = useState<DealOfDay>({
    productIds: [],
    description: '',
    percentageOff: '',
    productCards: []
  })
  
  const [mattressesSection, setMattressesSection] = useState<{
    productIds: string[]
    description: string
    mattressCards: MattressCard[]
  }>({
    productIds: [],
    description: '',
    mattressCards: []
  })
  
  const [bedroomInspiration, setBedroomInspiration] = useState<{
    productIds: string[]
    description: string
    productCards: Array<{
      productId: string
      featureToShow: string
    }>
  }>({
    productIds: [],
    description: '',
    productCards: []
  })
  
  const [sofaTypes, setSofaTypes] = useState<SofaTypeCard[]>([])
  const [ideasGuides, setIdeasGuides] = useState<IdeasGuide[]>([])
  
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allMattresses, setAllMattresses] = useState<any[]>([])
  const [allSofas, setAllSofas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load existing content
  useEffect(() => {
    loadHomePageContent()
    loadProducts()
  }, [])

  // Ensure dealOfDay state is always properly structured
  useEffect(() => {
    if (!dealOfDay.productIds) {
      setDealOfDay(prev => ({
        ...prev,
        productIds: prev.productIds || []
      }))
    }
    if (!dealOfDay.productCards) {
      setDealOfDay(prev => ({
        ...prev,
        productCards: prev.productCards || []
      }))
    }
  }, [dealOfDay.productIds, dealOfDay.productCards])

  const loadHomePageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('order_index')

      if (error) throw error

      if (data) {
        data.forEach(item => {
          switch (item.section) {
            case 'hero':
              setHeroSection(item.content)
              break
            case 'image_cards':
              setImageCards(item.content)
              break
            case 'quiz':
              setQuizSection(item.content)
              break
            case 'deal_of_day':
              // Ensure proper structure for deal_of_day
              const dealContent = item.content || {}
              setDealOfDay({
                productIds: dealContent.productIds || [],
                description: dealContent.description || '',
                percentageOff: dealContent.percentageOff || '',
                productCards: dealContent.productCards || []
              })
              break
            case 'mattresses':
              console.log('🔍 Admin - Loading mattresses section:', item.content)
              // Handle both old and new structure for backward compatibility
              if (item.content.mattressCards) {
                console.log('🔍 Admin - Using new structure with mattress cards')
                setMattressesSection(item.content)
              } else {
                console.log('🔍 Admin - Converting old structure to new structure')
                // Convert old structure to new structure
                setMattressesSection({
                  productIds: item.content.productIds || [],
                  description: item.content.description || '',
                  mattressCards: (item.content.productIds || []).map((id: string) => ({
                    productId: id,
                    featureToShow: ''
                  }))
                })
              }
              break
            case 'bedroom_inspiration':
              console.log('🔍 Admin - Loading bedroom inspiration section:', item.content)
              // Handle both old and new structure for backward compatibility
              if (item.content.productCards) {
                console.log('🔍 Admin - Using new structure with product cards')
                setBedroomInspiration(item.content)
              } else {
                console.log('🔍 Admin - Converting old structure to new structure')
                // Convert old structure to new structure
                setBedroomInspiration({
                  productIds: item.content.productIds || [],
                  description: item.content.description || '',
                  productCards: (item.content.productIds || []).map((id: string) => ({
                    productId: id,
                    featureToShow: ''
                  }))
                })
              }
              break
            case 'sofa_types':
              setSofaTypes(item.content)
              break
            case 'ideas_guides':
              setIdeasGuides(item.content || [])
              break
          }
        })
      }
    } catch (error) {
      console.error('Error loading homepage content:', error)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('Starting to load products...')
      
      // Load all products for deal of day with category info
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          category_id,
          categories(name)
        `)
        .order('name')

      if (productsError) {
        console.error('Error loading products:', productsError)
        throw productsError
      }
      
      // Transform products to include category name
      const transformedProducts = products?.map(product => ({
        id: product.id,
        name: product.name,
        category: product.categories?.name || 'Unknown',
        // Add placeholder values for missing fields
        current_price: 0,
        original_price: 0,
        image: '/placeholder.jpg'
      })) || []
      
      console.log('🔍 Admin - Loaded products:', transformedProducts)
      console.log('🔍 Admin - Total products available:', transformedProducts.length)
      if (transformedProducts.length > 0) {
        console.log('🔍 Admin - First few product IDs:', transformedProducts.slice(0, 3).map(p => p.id))
      }
      setAllProducts(transformedProducts)

      // Load mattresses (products in mattress category)
      const { data: mattresses, error: mattressesError } = await supabase
        .from('products')
        .select(`
          id, 
          name,
          categories(name)
        `)
        .eq('categories.name', 'mattresses')
        .order('name')

      if (mattressesError) {
        console.error('Error loading mattresses:', mattressesError)
        throw mattressesError
      }
      
      let transformedMattresses = mattresses?.map(mattress => ({
        id: mattress.id,
        name: mattress.name,
        category: mattress.categories?.name || 'Unknown',
        current_price: 0,
        original_price: 0,
        image: '/placeholder.jpg'
      })) || []
      
      // If no mattresses exist, use all products instead
      if (transformedMattresses.length === 0) {
        console.log('No mattresses found, using all products for mattresses')
        transformedMattresses = transformedProducts
      }
      
      console.log('Loaded mattresses:', transformedMattresses)
      setAllMattresses(transformedMattresses)

      // Load sofas (products in sofa category) - if no sofas exist, use all products
      const { data: sofas, error: sofasError } = await supabase
        .from('products')
        .select(`
          id, 
          name,
          categories(name)
        `)
        .eq('categories.name', 'sofas')
        .order('name')

      if (sofasError) {
        console.error('Error loading sofas:', sofasError)
        throw sofasError
      }
      
      let transformedSofas = sofas?.map(sofa => ({
        id: sofa.id,
        name: sofa.name,
        category: sofa.categories?.name || 'Unknown',
        current_price: 0,
        original_price: 0,
        image: '/placeholder.jpg'
      })) || []
      
      // If no sofas exist, use all products instead
      if (transformedSofas.length === 0) {
        console.log('No sofas found, using all products for sofa types')
        transformedSofas = transformedProducts
      }
      
      console.log('Loaded sofas:', transformedSofas)
      setAllSofas(transformedSofas)

      console.log('All products loaded successfully')
    } catch (error) {
      console.error('Error loading products:', error)
      alert(`Error loading products: ${error.message || 'Unknown error'}. Please check your database connection.`)
    } finally {
      setLoading(false)
    }
  }

  const saveHomePageContent = async () => {
    setSaving(true)
    try {
      // Validate product IDs before saving
      const allProductIds = allProducts.map(p => p.id)
      console.log('🔍 Admin - Available product IDs:', allProductIds)
      
      // Check bedroom inspiration product IDs
      if (bedroomInspiration.productCards) {
        const invalidIds = bedroomInspiration.productCards
          .map(card => card.productId)
          .filter(id => id && !allProductIds.includes(id))
        
        if (invalidIds.length > 0) {
          console.error('❌ Invalid product IDs in bedroom inspiration:', invalidIds)
          alert(`Invalid product IDs found: ${invalidIds.join(', ')}. Please select valid products.`)
          setSaving(false)
          return
        }
      }
      
      // Check mattress product IDs
      if (mattressesSection.mattressCards) {
        const invalidIds = mattressesSection.mattressCards
          .map(card => card.productId)
          .filter(id => id && !allProductIds.includes(id))
        
        if (invalidIds.length > 0) {
          console.error('❌ Invalid product IDs in mattresses section:', invalidIds)
          alert(`Invalid product IDs found: ${invalidIds.join(', ')}. Please select valid products.`)
          setSaving(false)
          return
        }
      }
      
      const contentSections = [
        { section: 'hero', content: heroSection, order_index: 1 },
        { section: 'image_cards', content: imageCards, order_index: 2 },
        { section: 'quiz', content: quizSection, order_index: 3 },
        { section: 'deal_of_day', content: dealOfDay, order_index: 4 },
        { section: 'mattresses', content: mattressesSection, order_index: 5 },
        { section: 'bedroom_inspiration', content: bedroomInspiration, order_index: 6 },
        { section: 'sofa_types', content: sofaTypes, order_index: 7 },
        { section: 'ideas_guides', content: ideasGuides, order_index: 8 }
      ]

      console.log('Saving content sections:', contentSections)

      for (const section of contentSections) {
        console.log(`Saving section: ${section.section}`)
        if (section.section === 'mattresses') {
          console.log('🔍 Admin - Saving mattresses section with content:', section.content)
        }
        if (section.section === 'bedroom_inspiration') {
          console.log('🔍 Admin - Saving bedroom inspiration section with content:', section.content)
        }
        const { error } = await supabase
          .from('homepage_content')
          .upsert({
            section: section.section,
            content: section.content,
            order_index: section.order_index
          }, { onConflict: 'section' })

        if (error) {
          console.error(`Error saving section ${section.section}:`, error)
          throw error
        }
        console.log(`Successfully saved section: ${section.section}`)
      }

      alert('Homepage content saved successfully!')
    } catch (error) {
      console.error('Error saving homepage content:', error)
      alert(`Error saving content: ${error.message || 'Unknown error'}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, setImageFunction: (url: string) => void) => {
    try {
      // Ask user whether to convert and desired quality
      const convert = window.confirm('Convert this image to WebP? Click Cancel to upload original format.')
      let quality: number | undefined = undefined
      if (convert) {
        const q = window.prompt('Enter WebP quality (1-100). Higher = better quality, larger size.', '90')
        const parsed = q ? parseInt(q, 10) : NaN
        if (!isNaN(parsed)) quality = Math.max(1, Math.min(100, parsed))
      }

      // Use optimized upload API for homepage images
      const formData = new FormData()
      formData.append('file', file)
      formData.append('preset', 'medium') // Use medium preset for homepage images
      formData.append('convert', String(convert))
      formData.append('format', convert ? 'webp' : 'original')
      if (typeof quality === 'number') formData.append('quality', String(quality))

      const response = await fetch('/api/upload-optimized', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        setImageFunction(result.url)
        
        // Show upload success alert
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
        
        alert(`Homepage image uploaded successfully!\n\n📁 File: ${file.name}\n📏 Size: ${fileSizeMB} MB`)
        
        console.log('[Homepage Upload] Optimized upload result:', result)
      } else {
        const error = await response.json()
        console.error('[Homepage Upload] Optimized upload error:', error)
        
        // Fallback to regular upload if optimized upload fails
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `homepage/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
        .getPublicUrl(filePath)

      setImageFunction(publicUrl)
        alert('Image uploaded successfully (fallback mode)')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    }
  }

  const addSofaType = () => {
    setSofaTypes(prev => [...prev, {
      id: Date.now().toString(),
      sofaId: '',
      description: '',
      featureToShow: ''
    }])
  }

  const removeSofaType = (id: string) => {
    setSofaTypes(prev => prev.filter(item => item.id !== id))
  }

  const updateSofaType = (id: string, field: keyof SofaTypeCard, value: string) => {
    setSofaTypes(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const addIdeasGuide = () => {
    setIdeasGuides(prev => [...prev, {
      id: Date.now().toString(),
      image: '',
      heading: '',
      description: '',
      timeToRead: ''
    }])
  }

  const removeIdeasGuide = (id: string) => {
    setIdeasGuides(prev => prev.filter(item => item.id !== id))
  }

  const updateIdeasGuide = (id: string, field: keyof IdeasGuide, value: string) => {
    setIdeasGuides(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Homepage Content Management</h1>
          <div className="flex space-x-4">
            <Link href="/admin">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                Back to Admin
              </Button>
            </Link>
                         <Button 
               onClick={saveHomePageContent} 
               disabled={saving}
               className="bg-orange-600 hover:bg-orange-700"
             >
               {saving ? 'Saving...' : 'Save All Changes'}
             </Button>
             <Button 
               onClick={loadProducts} 
               disabled={loading}
               variant="outline"
               className="bg-blue-50 hover:bg-blue-100"
             >
               {loading ? 'Loading...' : 'Reload Products'}
             </Button>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Image Upload Test */}
          <Card className="p-6">
            <ImageUploadTest />
          </Card>
          
          {/* Hero Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block mb-2">Small Image 1</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {heroSection.smallImage1 ? (
                    <div className="relative">
                      <img 
                        src={heroSection.smallImage1} 
                        alt="Small Image 1" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHeroSection(prev => ({ ...prev, smallImage1: '' }))}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setHeroSection(prev => ({ ...prev, smallImage1: url })))}
                        className="hidden"
                        id="smallImage1"
                      />
                      <label htmlFor="smallImage1" className="cursor-pointer text-blue-600 hover:text-blue-700">
                        Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="block mb-2">Small Image 2</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {heroSection.smallImage2 ? (
                    <div className="relative">
                      <img 
                        src={heroSection.smallImage2} 
                        alt="Small Image 2" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHeroSection(prev => ({ ...prev, smallImage2: '' }))}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setHeroSection(prev => ({ ...prev, smallImage2: url })))}
                        className="hidden"
                        id="smallImage2"
                      />
                      <label htmlFor="smallImage2" className="cursor-pointer text-blue-600 hover:text-blue-700">
                        Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label className="block mb-2">Sliding Images (3 images)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heroSection.slidingImages.map((image, index) => (
                  <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {image ? (
                      <div className="relative">
                        <img 
                          src={image} 
                          alt={`Sliding Image ${index + 1}`} 
                          className="w-full h-40 object-cover rounded"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHeroSection(prev => ({ 
                            ...prev, 
                            slidingImages: prev.slidingImages.map((img, i) => i === index ? '' : img)
                          }))}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setHeroSection(prev => ({ 
                            ...prev, 
                            slidingImages: prev.slidingImages.map((img, i) => i === index ? url : img)
                          })))}
                          className="hidden"
                          id={`slidingImage${index}`}
                        />
                        <label htmlFor={`slidingImage${index}`} className="cursor-pointer text-blue-600 hover:text-blue-700">
                          Upload Image
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 4 Image Cards */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">4 Image Cards Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {imageCards.map((card, index) => (
                <div key={card.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Card {index + 1}</h3>
                  
                  <div className="mb-4">
                    <Label className="block mb-2">Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {card.image ? (
                        <div className="relative">
                          <img 
                            src={card.image} 
                            alt={`Card ${index + 1}`} 
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, image: '' } : c))}
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, image: url } : c)))}
                            className="hidden"
                            id={`cardImage${index}`}
                          />
                          <label htmlFor={`cardImage${index}`} className="cursor-pointer text-blue-600 hover:text-blue-700">
                            Upload Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="block mb-1">Heading</Label>
                      <Input
                        value={card.heading}
                        onChange={(e) => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, heading: e.target.value } : c))}
                        placeholder="Enter heading"
                      />
                    </div>
                    <div>
                      <Label className="block mb-1">Text</Label>
                      <Textarea
                        value={card.text}
                        onChange={(e) => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, text: e.target.value } : c))}
                        placeholder="Enter description text"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="block mb-1">Button Text</Label>
                      <Input
                        value={card.buttonText}
                        onChange={(e) => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, buttonText: e.target.value } : c))}
                        placeholder="Enter button text"
                      />
                    </div>
                    <div>
                      <Label className="block mb-1">Button Link</Label>
                      <Input
                        value={card.buttonLink}
                        onChange={(e) => setImageCards(prev => prev.map((c, i) => i === index ? { ...c, buttonLink: e.target.value } : c))}
                        placeholder="Enter button link"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Take Quiz Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Take Quiz Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block mb-2">Quiz Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {quizSection.image ? (
                    <div className="relative">
                      <img 
                        src={quizSection.image} 
                        alt="Quiz Image" 
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuizSection(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => setQuizSection(prev => ({ ...prev, image: url })))}
                        className="hidden"
                        id="quizImage"
                      />
                      <label htmlFor="quizImage" className="cursor-pointer text-blue-600 hover:text-blue-700">
                        Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Heading</Label>
                  <Input
                    value={quizSection.heading}
                    onChange={(e) => setQuizSection(prev => ({ ...prev, heading: e.target.value }))}
                    placeholder="Enter quiz heading"
                  />
                </div>
                <div>
                  <Label className="block mb-2">Paragraph</Label>
                  <Textarea
                    value={quizSection.paragraph}
                    onChange={(e) => setQuizSection(prev => ({ ...prev, paragraph: e.target.value }))}
                    placeholder="Enter quiz description"
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </Card>

                                           {/* Deal of the Day */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Deal of the Day Section</h2>
                <Button onClick={() => setDealOfDay(prev => ({ 
                  ...prev, 
                  productIds: [...(prev.productIds || []), ''],
                  productCards: [...(prev.productCards || []), { productId: '', description: '', percentageOff: '' }]
                }))} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="space-y-4">
                {(dealOfDay.productCards || []).map((productCard, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Product {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDealOfDay(prev => ({
                          ...prev,
                          productCards: (prev.productCards || []).filter((_, i) => i !== index),
                          productIds: (prev.productIds || []).filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block mb-2">Select Product</Label>
                        <select
                          value={productCard.productId}
                          onChange={(e) => {
                            setDealOfDay(prev => ({
                              ...prev,
                              productCards: (prev.productCards || []).map((card, i) => 
                                i === index ? { ...card, productId: e.target.value } : card
                              ),
                              productIds: (prev.productIds || []).map((id, i) => 
                                i === index ? e.target.value : id
                              )
                            }))
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="">Choose a product</option>
                          {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Percentage Off</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 50% OFF"
                          value={productCard.percentageOff}
                          onChange={(e) => setDealOfDay(prev => ({
                            ...prev,
                            productCards: prev.productCards.map((card, i) => 
                              i === index ? { ...card, percentageOff: e.target.value } : card
                            )
                          }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Product Description</Label>
                      <Textarea
                        placeholder="Write a compelling description about comfort, materials and value..."
                        value={productCard.description}
                        onChange={(e) => setDealOfDay(prev => ({
                          ...prev,
                          productCards: prev.productCards.map((card, i) => 
                            i === index ? { ...card, description: e.target.value } : card
                          )
                        }))}
                        className="w-full"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                
                {(dealOfDay.productCards || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products added yet. Click "Add Product" to get started.
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                Added: {(dealOfDay.productCards || []).length}/5 products
              </p>
            </Card>

                     {/* Our Mattresses Section */}
           <Card className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Our Mattresses Section</h2>
               <Button onClick={() => setMattressesSection(prev => ({ 
                 ...prev, 
                 productIds: [...prev.productIds, ''],
                 mattressCards: [...prev.mattressCards, { productId: '', featureToShow: '' }]
               }))} size="sm">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Mattress
               </Button>
             </div>
             
             <div className="space-y-4">
               {mattressesSection.mattressCards.map((mattressCard, index) => (
                 <div key={index} className="border rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="font-medium">Mattress {index + 1}</h3>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => setMattressesSection(prev => ({
                         ...prev,
                         mattressCards: prev.mattressCards.filter((_, i) => i !== index),
                         productIds: prev.productIds.filter((_, i) => i !== index)
                       }))}
                       className="text-red-600 hover:text-red-700"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label className="block mb-2">Select Mattress</Label>
                       <select
                         value={mattressCard.productId}
                         onChange={(e) => {
                           setMattressesSection(prev => ({
                             ...prev,
                             mattressCards: prev.mattressCards.map((card, i) => 
                               i === index ? { ...card, productId: e.target.value } : card
                             ),
                             productIds: prev.productIds.map((id, i) => 
                               i === index ? e.target.value : id
                             )
                           }))
                         }}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="">Choose a mattress</option>
                         {allMattresses.map((mattress) => (
                           <option key={mattress.id} value={mattress.id}>
                             {mattress.name}
                           </option>
                         ))}
                       </select>
                     </div>
                     
                     <div>
                       <Label className="block mb-2">Feature to Show</Label>
                       <select
                         value={mattressCard.featureToShow}
                         onChange={(e) => setMattressesSection(prev => ({
                           ...prev,
                           mattressCards: prev.mattressCards.map((card, i) => 
                             i === index ? { ...card, featureToShow: e.target.value } : card
                           )
                         }))}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="">Choose a feature</option>
                         <option value="Memory Foam">Memory Foam</option>
                         <option value="Pocket Springs">Pocket Springs</option>
                         <option value="Hybrid">Hybrid</option>
                         <option value="Orthopedic">Orthopedic</option>
                         <option value="Cooling Technology">Cooling Technology</option>
                         <option value="Anti-Allergenic">Anti-Allergenic</option>
                       </select>
                     </div>
                   </div>
                   
                   <div className="mt-4">
                     <div>
                       <Label className="block mb-1">Description</Label>
                       <Textarea
                         value={mattressesSection.description}
                         onChange={(e) => setMattressesSection(prev => ({ ...prev, description: e.target.value }))}
                         placeholder="Enter mattress description"
                         rows={3}
                       />
                     </div>
                   </div>
                 </div>
               ))}
               
               {mattressesSection.productIds.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   No mattresses added yet. Click "Add Mattress" to get started.
                 </div>
               )}
             </div>
           </Card>

                     {/* Turn Your Bedroom Into Inspiration */}
           <Card className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Turn Your Bedroom Into Inspiration</h2>
               <Button onClick={() => {
                 console.log('🔍 Admin - Adding new bedroom inspiration product')
                 setBedroomInspiration(prev => {
                   const newState = {
                     ...prev, 
                     productIds: [...prev.productIds, ''],
                     productCards: [...prev.productCards, { productId: '', featureToShow: '' }]
                   }
                   console.log('🔍 Admin - New bedroom inspiration state after add:', newState)
                   return newState
                 })
               }} size="sm">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Product
               </Button>
             </div>
             
             <div className="space-y-4">
               {bedroomInspiration.productCards.map((productCard, index) => (
                 <div key={index} className="border rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="font-medium">Product {index + 1}</h3>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                         console.log('🔍 Admin - Deleting bedroom inspiration product at index:', index)
                         setBedroomInspiration(prev => {
                           const newState = {
                             ...prev,
                             productCards: prev.productCards.filter((_, i) => i !== index),
                             productIds: prev.productIds.filter((_, i) => i !== index)
                           }
                           console.log('🔍 Admin - New bedroom inspiration state after delete:', newState)
                           return newState
                         })
                       }}
                       className="text-red-600 hover:text-red-700"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label className="block mb-2">Select Product</Label>
                       <select
                         value={productCard.productId}
                         onChange={(e) => {
                           console.log('🔍 Admin - Updating bedroom inspiration product:', e.target.value, 'at index:', index)
                           setBedroomInspiration(prev => {
                             const newState = {
                               ...prev,
                               productCards: prev.productCards.map((card, i) => 
                                 i === index ? { ...card, productId: e.target.value } : card
                               ),
                               productIds: prev.productIds.map((id, i) => 
                                 i === index ? e.target.value : id
                               )
                             }
                             console.log('🔍 Admin - New bedroom inspiration state:', newState)
                             return newState
                           })
                         }}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="">Choose a product</option>
                         {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </option>
                          ))}
                       </select>
                     </div>
                     
                     <div>
                       <Label className="block mb-2">Feature to Show</Label>
                                                <select
                           value={productCard.featureToShow}
                           onChange={(e) => {
                             console.log('🔍 Admin - Updating bedroom inspiration feature:', e.target.value, 'at index:', index)
                             setBedroomInspiration(prev => {
                               const newState = {
                                 ...prev,
                                 productCards: prev.productCards.map((card, i) => 
                                   i === index ? { ...card, featureToShow: e.target.value } : card
                                 )
                               }
                               console.log('🔍 Admin - New bedroom inspiration state after feature update:', newState)
                               return newState
                             })
                           }}
                           className="w-full border border-gray-300 rounded-md px-3 py-2"
                         >
                         <option value="">Choose a feature</option>
                         <option value="Premium Quality">Premium Quality</option>
                         <option value="Elegant Design">Elegant Design</option>
                         <option value="Comfortable">Comfortable</option>
                         <option value="Durable">Durable</option>
                         <option value="Stylish">Stylish</option>
                         <option value="Modern">Modern</option>
                       </select>
                     </div>
                   </div>
                   
                   <div className="mt-4">
                     <div>
                       <Label className="block mb-1">Description</Label>
                       <Textarea
                         value={bedroomInspiration.description}
                         onChange={(e) => setBedroomInspiration(prev => ({ ...prev, description: e.target.value }))}
                         placeholder="Enter product description"
                         rows={3}
                       />
                     </div>
                   </div>
                 </div>
               ))}
               
               {bedroomInspiration.productCards.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   No products added yet. Click "Add Product" to get started.
                 </div>
               )}
             </div>
           </Card>

           {/* Our Sofa Types */}
           <Card className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Our Sofa Types</h2>
               <Button onClick={addSofaType} size="sm">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Sofa Type
               </Button>
             </div>
             
             <div className="space-y-4">
               {sofaTypes.map((sofaType, index) => (
                 <div key={sofaType.id} className="border rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="font-medium">Sofa Type {index + 1}</h3>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => removeSofaType(sofaType.id)}
                       className="text-red-600 hover:text-red-700"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label className="block mb-2">Select Sofa</Label>
                       <select
                         value={sofaType.sofaId}
                         onChange={(e) => updateSofaType(sofaType.id, 'sofaId', e.target.value)}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="">Choose a sofa</option>
                         {allSofas.map((sofa) => (
                           <option key={sofa.id} value={sofa.id}>
                             {sofa.name}
                           </option>
                         ))}
                       </select>
                     </div>
                     
                     <div>
                       <Label className="block mb-2">Feature to Show</Label>
                       <select
                         value={sofaType.featureToShow}
                         onChange={(e) => updateSofaType(sofaType.id, 'featureToShow', e.target.value)}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="">Choose a feature</option>
                         <option value="Premium Fabric">Premium Fabric</option>
                         <option value="Leather Upholstery">Leather Upholstery</option>
                         <option value="Memory Foam Cushions">Memory Foam Cushions</option>
                         <option value="Reclining Mechanism">Reclining Mechanism</option>
                         <option value="Built-in Storage">Built-in Storage</option>
                         <option value="Convertible Design">Convertible Design</option>
                       </select>
                     </div>
                   </div>
                   
                                      <div className="mt-4">
                     <div>
                       <Label className="block mb-1">Description</Label>
                       <Textarea
                         value={sofaType.description}
                         onChange={(e) => updateSofaType(sofaType.id, 'description', e.target.value)}
                         placeholder="Enter sofa type description"
                         rows={3}
                       />
                     </div>
                   </div>
                 </div>
               ))}
               
               {sofaTypes.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   No sofa types added yet. Click "Add Sofa Type" to get started.
                 </div>
               )}
             </div>
           </Card>

           {/* Ideas & Guides */}
           <Card className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Ideas & Guides</h2>
               <Button onClick={addIdeasGuide} size="sm">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Guide
               </Button>
             </div>
             
             <div className="space-y-4">
               {ideasGuides.map((guide, index) => (
                 <div key={guide.id} className="border rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="font-medium">Guide {index + 1}</h3>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => removeIdeasGuide(guide.id)}
                       className="text-red-600 hover:text-red-700"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label className="block mb-2">Guide Image</Label>
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                         {guide.image ? (
                           <div className="relative">
                             <img 
                               src={guide.image} 
                               alt={`Guide ${index + 1}`} 
                               className="w-full h-32 object-cover rounded"
                             />
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => updateIdeasGuide(guide.id, 'image', '')}
                               className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                             >
                               <X className="w-4 h-4" />
                             </Button>
                           </div>
                         ) : (
                           <div>
                             <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                             <input
                               type="file"
                               accept="image/*"
                               onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateIdeasGuide(guide.id, 'image', url))}
                               className="hidden"
                               id={`guideImage${guide.id}`}
                             />
                             <label htmlFor={`guideImage${guide.id}`} className="cursor-pointer text-blue-600 hover:text-blue-700">
                               Upload Image
                             </label>
                           </div>
                         )}
                       </div>
                     </div>
                     
                     <div className="space-y-4">
                       <div>
                         <Label className="block mb-2">Heading</Label>
                         <Input
                           value={guide.heading}
                           onChange={(e) => updateIdeasGuide(guide.id, 'heading', e.target.value)}
                           placeholder="Enter guide heading"
                         />
                       </div>
                       
                       <div>
                         <Label className="block mb-2">Time to Read</Label>
                         <Input
                           value={guide.timeToRead}
                           onChange={(e) => updateIdeasGuide(guide.id, 'timeToRead', e.target.value)}
                           placeholder="e.g., 5 min read"
                         />
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-4">
                     <Label className="block mb-2">Description</Label>
                     <Textarea
                       value={guide.description}
                       onChange={(e) => updateIdeasGuide(guide.id, 'description', e.target.value)}
                       placeholder="Enter guide description"
                       rows={4}
                     />
                   </div>
                 </div>
               ))}
               
               {ideasGuides.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   No guides added yet. Click "Add Guide" to get started.
                 </div>
               )}
             </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
