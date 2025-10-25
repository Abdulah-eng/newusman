"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, Edit3, X, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface EditableText {
  value: string
  isEditing: boolean
}

interface EditableImage {
  src: string
  alt: string
  isEditing: boolean
}

interface EditableContent {
  title: EditableText
  subtitle?: EditableText
  description?: EditableText
  price?: EditableText
  originalPrice?: EditableText
  discount?: EditableText
  image: EditableImage
  href?: EditableText
  badge?: EditableText
  rating?: number
  readTime?: EditableText
  buttonText?: EditableText
}

export function HomepageManagement() {
  const [isEditing, setIsEditing] = useState(true) // Default to editing mode
  const [saving, setSaving] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('mattresses')
  const [loading, setLoading] = useState(true)

  // Load homepage content from database on component mount
  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/homepage-content')
        if (response.ok) {
          const data = await response.json()
          const content = data.content || {}
          
          // Update state with content from database
          if (content.hero_carousel) setCarouselImages(content.hero_carousel)
          if (content.right_hero_images) setRightHeroImages(content.right_hero_images)
          if (content.four_images_section) setFourImagesSection(content.four_images_section)
          if (content.mattress_types) setMattressTypes(content.mattress_types)
          if (content.gallery_items) setGalleryItems(content.gallery_items)
          if (content.sofa_types) setSofaTypes(content.sofa_types)
          if (content.trending_items) setTrendingItems(content.trending_items)
          if (content.promotional_cards) setPromotionalCards(content.promotional_cards)
          if (content.sleep_luxury_section) setSleepLuxurySection(content.sleep_luxury_section)
          if (content.featured_products) setFeaturedProducts(content.featured_products)
          if (content.category_filter_cards) setCategoryFilterCards(content.category_filter_cards)
          if (content.mattress_finder_promo) setMattressFinderPromo(content.mattress_finder_promo)
          if (content.category_grid) setCategoryGrid(content.category_grid)
          if (content.review_section) setReviewSection(content.review_section)
          if (content.guides_items) setGuidesItems(content.guides_items)
          if (content.deal_grid_cards) setDealGridCards(content.deal_grid_cards)
        }
      } catch (error) {
        console.error('Error loading homepage content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHomepageContent()
  }, [])

  // Hero Section Carousel Images
  const [carouselImages, setCarouselImages] = useState([
    {
      src: "/banner.jpg",
      alt: "Outdoor Super Sale",
      title: "OUTDOOR",
      subtitle: "SUPER SALE",
      price: "$39.99",
      discount: "SALE UP TO 30% OFF",
      edition: "2020 EDITION"
    },
    {
      src: "/sofa.jpeg",
      alt: "Sofa Collection",
      title: "SOFA",
      subtitle: "COLLECTION",
      price: "$299.99",
      discount: "SALE UP TO 40% OFF",
      edition: "NEW ARRIVAL"
    },
    {
      src: "/hi.jpeg",
      alt: "Bedroom Essentials",
      title: "BEDROOM",
      subtitle: "ESSENTIALS",
      price: "$199.99",
      discount: "SALE UP TO 35% OFF",
      edition: "BEST SELLER"
    }
  ])

  // Right Side Hero Images
  const [rightHeroImages, setRightHeroImages] = useState([
    { src: "/hello.jpeg", alt: "Bedroom Collection" },
    { src: "/hell.jpeg", alt: "Living Room" }
  ])

  // Four Parallel Images Section
  const [fourImagesSection, setFourImagesSection] = useState([
    {
      image: { src: "/sofacollect.jpg", alt: "Sofa Collection", isEditing: false },
      title: { value: "Sofa Collection", isEditing: false },
      subtitle: { value: "Premium comfort for your living space", isEditing: false },
      buttonText: { value: "Shop Now", isEditing: false }
    },
    {
      image: { src: "/bedcollect.jpeg", alt: "Bed Collection", isEditing: false },
      title: { value: "Bed Collection", isEditing: false },
      subtitle: { value: "Elegant designs for peaceful sleep", isEditing: false },
      buttonText: { value: "Shop Now", isEditing: false }
    },
    {
      image: { src: "/hello.jpeg", alt: "Mattress Collection", isEditing: false },
      title: { value: "Mattress Collection", isEditing: false },
      subtitle: { value: "Ultimate comfort and support", isEditing: false },
      buttonText: { value: "Shop Now", isEditing: false }
    },
    {
      image: { src: "/hi.jpeg", alt: "Accessories Collection", isEditing: false },
      title: { value: "Accessories Collection", isEditing: false },
      subtitle: { value: "Complete your perfect setup", isEditing: false },
      buttonText: { value: "Shop Now", isEditing: false }
    }
  ])
  
  // State for mattress types
  const [mattressTypes, setMattressTypes] = useState([
    {
      id: 1,
      title: "Hybrid Mattresses",
      icon: "🛏️",
      description: "Hybrid mattresses blend the support of innerspring coils with the comfort of foam layers, offering a balanced sleep experience. This versatile construction suits various sleep styles and provides both pressure relief and spinal alignment.",
      image: "/bedcollect.jpeg"
    },
    {
      id: 2,
      title: "Orthopaedic Mattresses",
      icon: "👤",
      description: "Orthopedic mattresses are engineered to provide targeted support for the spine and joints, effectively reducing pain and promoting better posture. Their firmness levels are carefully calibrated to distribute weight evenly.",
      image: "/sofa.jpeg"
    },
    {
      id: 3,
      title: "Memory Foam Mattresses",
      icon: "🔲",
      description: "Memory foam mattresses excel in offering contouring support, adapting to your body's unique shape for personalized comfort. Their pressure-relieving qualities that provide a luxurious sleep experience that alleviates aches and pains.",
      image: "/hello.jpeg"
    }
  ])
  
  // State for gallery items
  const [galleryItems, setGalleryItems] = useState([
    {
      id: 1,
      image: "/hello.jpeg",
      title: "Modern Bedroom Design",
      description: "Transform your bedroom with our latest collection of premium mattresses and bedding accessories. Create a sanctuary that reflects your personal style and ensures restful sleep."
    },
    {
      id: 2,
      image: "/hell.jpeg",
      title: "Luxury Sleep Experience",
      description: "Discover the perfect balance of comfort and support with our handpicked selection of high-quality mattresses. Every detail is crafted for your ultimate relaxation."
    },
    {
      id: 3,
      image: "/hi.jpeg",
      title: "Contemporary Living Space",
      description: "Elevate your home decor with our stylish furniture pieces. From elegant sofas to comfortable beds, we offer solutions that combine beauty and functionality."
    }
  ])
  
  // State for sofa types
  const [sofaTypes, setSofaTypes] = useState([
    {
      id: 1,
      title: "Sectional Sofas",
      icon: "🔲",
      description: "Versatile sectionals offer flexible seating arrangements perfect for large families and entertaining. Their modular design adapts to any room layout while providing maximum comfort and style.",
      image: "/sofa.jpeg"
    },
    {
      id: 2,
      title: "L-Shaped Sofas",
      icon: "🏠",
      description: "L-shaped sofas maximize corner spaces and create intimate seating areas. Perfect for open-plan living rooms, they offer both comfort and efficient use of floor space.",
      image: "/hi.jpeg"
    },
    {
      id: 3,
      title: "Chesterfield Sofas",
      icon: "🛋️",
      description: "Timeless Chesterfield sofas feature deep button tufting and rolled arms for classic elegance. Their sophisticated design adds luxury to any living space while ensuring lasting comfort.",
      image: "/bedcollect.jpeg"
    }
  ])
  
  // State for trending items
  const [trendingItems, setTrendingItems] = useState([
    {
      id: 1,
      image: "/hello.jpeg",
      title: "Memory Foam Technology",
      subtitle: "Latest innovations in sleep comfort",
      category: "Technology",
      read_time: "5 min read",
      badge: "NEW",
      rating: 4.8,
      price: 299,
      original_price: 399,
      discount_label: "25% OFF"
    },
    {
      id: 2,
      image: "/hell.jpeg",
      title: "Hybrid Sleep Systems",
      subtitle: "Combining the best of both worlds",
      category: "Innovation",
      read_time: "7 min read",
      badge: "NEW",
      rating: 4.9,
      price: 449,
      original_price: 599,
      discount_label: "30% OFF"
    },
    {
      id: 3,
      image: "/hi.jpeg",
      title: "Smart Bed Features",
      subtitle: "Technology meets comfort",
      category: "Smart Home",
      read_time: "6 min read",
      badge: "HOT",
      rating: 4.7,
      price: 799,
      original_price: 999,
      discount_label: "20% OFF"
    }
  ])
  
  // State for promotional cards
  const [promotionalCards, setPromotionalCards] = useState([
    {
      id: 1,
      title: "Add a pillow",
      subtitle: "Save an extra 10%",
      image: "/placeholder.svg",
      backgroundColor: "bg-orange-100",
      textColor: "text-gray-800",
      icon: "🕐"
    },
    {
      id: 2,
      title: "Add a mattress protector",
      subtitle: "Get 15% off",
      image: "/placeholder.svg",
      backgroundColor: "bg-blue-100",
      textColor: "text-gray-800",
      icon: "🛋️"
    },
    {
      id: 3,
      title: "Add bedding set",
      subtitle: "Save £25",
      image: "/placeholder.svg",
      backgroundColor: "bg-green-100",
      textColor: "800",
      icon: "🛏️"
    }
  ])

  // Sleep Luxury Section
  const [sleepLuxurySection, setSleepLuxurySection] = useState({
    title: { value: "Sleep Luxury, Every Night", isEditing: false },
    subtitle: { value: "Discover our most-loved collections", isEditing: false }
  })

  // Featured Products
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      image: { src: "/mattress-image.svg", alt: "King Arthur Mattress", isEditing: false },
      name: { value: "King Arthur Mattress", isEditing: false },
      brand: { value: "ARTHUR SLEEP", isEditing: false },
      badge: { value: "Best Seller", isEditing: false },
      rating: 4.8,
      reviewCount: 127,
      firmness: { value: "MEDIUM FIRM", isEditing: false },
      originalPrice: { value: "£499.00", isEditing: false },
      currentPrice: { value: "£424.15", isEditing: false },
      savings: { value: "£74.85", isEditing: false },
      freeDelivery: { value: "Mon, 11 Aug", isEditing: false }
    },
    {
      image: { src: "/mattress-image.svg", alt: "Dream Mirapocket 1000 Mattress", isEditing: false },
      name: { value: "Dream Mirapocket 1000 Mattress", isEditing: false },
      brand: { value: "SILENTNIGHT", isEditing: false },
      badge: { value: "New Model", isEditing: false },
      rating: 4.0,
      reviewCount: 256,
      firmness: { value: "MEDIUM", isEditing: false },
      originalPrice: { value: "£342.00", isEditing: false },
      currentPrice: { value: "£290.70", isEditing: false },
      savings: { value: "£51.30", isEditing: false },
      freeDelivery: { value: "Tomorrow", isEditing: false }
    }
  ])

  // Category Filter Cards
  const [categoryFilterCards, setCategoryFilterCards] = useState([
    {
      image: { src: "/hello.jpeg", alt: "Mattresses", isEditing: false },
      title: { value: "Mattresses", isEditing: false },
      subtitle: { value: "Find your perfect sleep", isEditing: false },
      href: { value: "/mattresses", isEditing: false }
    },
    {
      image: { src: "/bedcollect.jpeg", alt: "Beds", isEditing: false },
      title: { value: "Beds", isEditing: false },
      subtitle: { value: "Elegant bed frames", isEditing: false },
      href: { value: "/beds", isEditing: false }
    },
    {
      image: { src: "/sofa.jpeg", alt: "Sofas", isEditing: false },
      title: { value: "Sofas", isEditing: false },
      subtitle: { value: "Comfortable seating", isEditing: false },
      href: { value: "/sofas", isEditing: false }
    },
    {
      image: { src: "/hi.jpeg", alt: "Pillows", isEditing: false },
      title: { value: "Pillows", isEditing: false },
      subtitle: { value: "Sleep accessories", isEditing: false },
      href: { value: "/pillows", isEditing: false }
    }
  ])

  // Mattress Finder Promo
  const [mattressFinderPromo, setMattressFinderPromo] = useState({
    title: { value: "Find Your Perfect Mattress in Minutes", isEditing: false },
    subtitle: { value: "Our smart Mattress Finder makes shopping simple — answer a few quick questions and instantly discover the best mattress for your comfort, support, and sleep style. Whether you need an orthopaedic mattress, memory foam, or luxury hybrid, we'll match you with the ideal choice — tailored just for you.", isEditing: false },
    buttonText: { value: "Take the quiz", isEditing: false },
    image: { src: "/sofa.jpeg", alt: "Showroom assistance", isEditing: false }
  })



  // Category Grid
  const [categoryGrid, setCategoryGrid] = useState([
    {
      image: { src: "/hello.jpeg", alt: "Mattresses", isEditing: false },
      title: { value: "Mattresses", isEditing: false },
      href: { value: "/mattresses", isEditing: false }
    },
    {
      image: { src: "/bedcollect.jpeg", alt: "Beds", isEditing: false },
      title: { value: "Beds", isEditing: false },
      href: { value: "/beds", isEditing: false }
    },
    {
      image: { src: "/sofa.jpeg", alt: "Sofas", isEditing: false },
      title: { value: "Sofas", isEditing: false },
      href: { value: "/sofas", isEditing: false }
    },
    {
      image: { src: "/hi.jpeg", alt: "Pillows", isEditing: false },
      title: { value: "Pillows", isEditing: false },
      href: { value: "/pillows", isEditing: false }
    }
  ])

  // Review Section
  const [reviewSection, setReviewSection] = useState({
    title: { value: "What Our Customers Say", isEditing: false },
    subtitle: { value: "Real reviews from satisfied customers", isEditing: false }
  })

  const handleTextEdit = (content: any, field: string, value: string) => {
    if (content[field] && typeof content[field] === 'object' && 'value' in content[field]) {
      content[field].value = value
      content[field].isEditing = false
    }
  }

  const handleImageEdit = (content: any, value: string) => {
    if (content.image && typeof content.image === 'object') {
      content.image.src = value
      content.image.isEditing = false
    }
  }

  const toggleTextEdit = (content: any, field: string) => {
    if (content[field] && typeof content[field] === 'object' && 'value' in content[field]) {
      content[field].isEditing = !content[field].isEditing
    }
  }
  
  // Functions to add new cards
  const addNewMattressType = () => {
    const newId = Math.max(...mattressTypes.map(t => t.id), 0) + 1
    const newMattressType = {
      id: newId,
      title: "New Mattress Type",
      icon: "🆕",
      description: "Add your mattress description here...",
      image: "/placeholder.svg"
    }
    setMattressTypes(prev => [...prev, newMattressType])
  }
  
  const addNewGalleryItem = () => {
    const newId = Math.max(...galleryItems.map(t => t.id), 0) + 1
    const newGalleryItem = {
      id: newId,
      image: "/placeholder.svg",
      title: "New Gallery Item",
      description: "Add your gallery description here..."
    }
    setGalleryItems(prev => [...prev, newGalleryItem])
  }
  
  const addNewSofaType = () => {
    const newId = Math.max(...sofaTypes.map(t => t.id), 0) + 1
    const newSofaType = {
      id: newId,
      title: "New Sofa Type",
      icon: "🆕",
      description: "Add your sofa description here...",
      image: "/placeholder.svg"
    }
    setSofaTypes(prev => [...prev, newSofaType])
  }
  
  const addNewTrendingCard = () => {
    const newId = Math.max(...trendingItems.map(t => t.id), 0) + 1
    const newTrendingItem = {
      id: newId,
      image: "/placeholder.svg",
      title: "New Trending Item",
      subtitle: "Add your trending subtitle here...",
      category: "New Category",
      read_time: "5 min read",
      badge: "NEW",
      rating: 4.5,
      price: 199,
      original_price: 299,
      discount_label: "20% OFF"
    }
    setTrendingItems(prev => [...prev, newTrendingItem])
  }
  
  const addNewDealCard = () => {
    const newId = Math.max(...promotionalCards.map(t => t.id), 0) + 1
    const newPromotionalCard = {
      id: newId,
      title: "New Promotional Item",
      subtitle: "Add your promotional text here...",
      image: "/placeholder.svg",
      backgroundColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: "🆕"
    }
    setPromotionalCards(prev => [...prev, newPromotionalCard])
  }
  
  // Guides (Ideas & Guides) cards state and add
  const [guidesItems, setGuidesItems] = useState([
    {
      id: 1,
      title: "Best Mattresses for Back Pain Relief",
      description: "Discover how the right mattress can transform your sleep and alleviate chronic back pain for better health.",
      readTime: "6 min read",
      image: "/hell.jpeg",
      category: "Health & Wellness"
    },
    {
      id: 2,
      title: "Complete Duvet & Bedding Guide",
      description: "Everything you need to know about choosing the perfect duvet, pillows, and bedding for ultimate comfort.",
      readTime: "8 min read",
      image: "/hi.jpeg",
      category: "Buying Guide"
    },
    {
      id: 3,
      title: "Bed & Mattress Size Chart",
      description: "Master the art of choosing the right bed size for your room and lifestyle with our detailed size guide.",
      readTime: "4 min read",
      image: "/sofa.jpeg",
      category: "Size Guide"
    }
  ])

  const addNewGuide = () => {
    const newId = Math.max(...guidesItems.map(g => g.id), 0) + 1
    setGuidesItems(prev => [
      ...prev,
      {
        id: newId,
        title: "New Guide",
        description: "Add your guide description here...",
        readTime: "5 min read",
        image: "/placeholder.svg",
        category: "Guides"
      }
    ])
  }

  // Deal of the Day additional grid cards
  const [dealGridCards, setDealGridCards] = useState([
    { id: 1, image: "/bedcollect.jpeg", title: "Memory Foam Mattress", description: "Ultra-comfortable memory foam with cooling technology", price: 199, original: 329, badge: "40% OFF" },
    { id: 2, image: "/hello.jpeg", title: "Hybrid Mattress", description: "Perfect blend of springs and foam for optimal support", price: 249, original: 379, badge: "35% OFF" },
    { id: 3, image: "/hi.jpeg", title: "Pocket Spring Mattress", description: "Individual pocket springs for personalized comfort", price: 179, original: 239, badge: "25% OFF" }
  ])

  const addNewDealGridCard = () => {
    const newId = Math.max(...dealGridCards.map(d => d.id), 0) + 1
    setDealGridCards(prev => [
      ...prev,
      { id: newId, image: "/placeholder.svg", title: "New Deal", description: "Add deal description...", price: 199, original: 299, badge: "NEW" }
    ])
  }
  
  // Sliding functionality
  const nextSlide = (totalItems: number) => {
    setCurrentSlide(prev => (prev + 1) % totalItems)
  }
  
  const prevSlide = (totalItems: number) => {
    setCurrentSlide(prev => (prev - 1 + totalItems) % totalItems)
  }

  // Use a safe index for the hero carousel to avoid out-of-bounds access
  const heroSlideIndex = carouselImages.length > 0
    ? ((currentSlide % carouselImages.length) + carouselImages.length) % carouselImages.length
    : 0

  const toggleImageEdit = (content: any) => {
    if (content.image && typeof content.image === 'object') {
      content.image.isEditing = !content.image.isEditing
    }
  }

  const renderEditableText = (content: any, field: string, className: string = "") => {
    const textField = content[field]
    if (!textField || typeof textField !== 'object' || !('value' in textField)) return null

    if (textField.isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={textField.value}
            onChange={(e) => textField.value = e.target.value}
            className={className}
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => handleTextEdit(content, field, textField.value)}
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => textField.isEditing = false}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className={className}>{textField.value}</span>
        {isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleTextEdit(content, field)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  const renderEditableImage = (content: any, className: string = "") => {
    if (!content.image || typeof content.image !== 'object') return null

    if (content.image.isEditing) {
  return (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (file) {
                const objectUrl = URL.createObjectURL(file)
                content.image.src = objectUrl
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleImageEdit(content, content.image.src)}
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                content.image.src = '/placeholder.svg'
                content.image.alt = 'placeholder'
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => content.image.isEditing = false}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative group">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width={300}
          height={200}
          className={className}
        />
        {isEditing && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleImageEdit(content)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { content.image.src = '/placeholder.svg'; content.image.alt = 'placeholder' }}
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80"
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Prepare all homepage content sections
      const sections = [
        {
          sectionKey: 'hero_carousel',
          content: carouselImages
        },
        {
          sectionKey: 'right_hero_images',
          content: rightHeroImages
        },
        {
          sectionKey: 'four_images_section',
          content: fourImagesSection
        },
        {
          sectionKey: 'mattress_types',
          content: mattressTypes
        },
        {
          sectionKey: 'gallery_items',
          content: galleryItems
        },
        {
          sectionKey: 'sofa_types',
          content: sofaTypes
        },
        {
          sectionKey: 'trending_items',
          content: trendingItems
        },
        {
          sectionKey: 'promotional_cards',
          content: promotionalCards
        },
        {
          sectionKey: 'sleep_luxury_section',
          content: sleepLuxurySection
        },
        {
          sectionKey: 'featured_products',
          content: featuredProducts
        },
        {
          sectionKey: 'category_filter_cards',
          content: categoryFilterCards
        },
        {
          sectionKey: 'mattress_finder_promo',
          content: mattressFinderPromo
        },
        {
          sectionKey: 'category_grid',
          content: categoryGrid
        },
        {
          sectionKey: 'review_section',
          content: reviewSection
        },
        {
          sectionKey: 'guides_items',
          content: guidesItems
        },
        {
          sectionKey: 'deal_grid_cards',
          content: dealGridCards
        }
      ]

      // Save each section to the database
      const savePromises = sections.map(async ({ sectionKey, content }) => {
        const response = await fetch('/api/homepage-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sectionKey, content })
        })

        if (!response.ok) {
          throw new Error(`Failed to save ${sectionKey}: ${response.statusText}`)
        }

        return response.json()
      })

      await Promise.all(savePromises)
      
      setSaving(false)
      alert('Changes saved successfully to database!')
    } catch (error) {
      console.error('Error saving homepage content:', error)
      setSaving(false)
      alert(`Error saving changes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-3xl font-bold text-gray-900">Homepage Management</h2>
            <p className="text-gray-600 mt-1">Edit and manage all homepage content inline</p>
            {loading && <p className="text-blue-600 text-sm mt-1">Loading content from database...</p>}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'View Mode' : 'Edit Mode'}
            </Button>
            <Button
              onClick={() => {
                const loadHomepageContent = async () => {
                  try {
                    setLoading(true)
                    const response = await fetch('/api/homepage-content')
                    if (response.ok) {
                      const data = await response.json()
                      const content = data.content || {}
                      
                      // Update state with content from database
                      if (content.hero_carousel) setCarouselImages(content.hero_carousel)
                      if (content.right_hero_images) setRightHeroImages(content.right_hero_images)
                      if (content.four_images_section) setFourImagesSection(content.four_images_section)
                      if (content.mattress_types) setMattressTypes(content.mattress_types)
                      if (content.gallery_items) setGalleryItems(content.gallery_items)
                      if (content.sofa_types) setSofaTypes(content.sofa_types)
                      if (content.trending_items) setTrendingItems(content.trending_items)
                      if (content.promotional_cards) setPromotionalCards(content.promotional_cards)
                      if (content.sleep_luxury_section) setSleepLuxurySection(content.sleep_luxury_section)
                      if (content.featured_products) setFeaturedProducts(content.featured_products)
                      if (content.category_filter_cards) setCategoryFilterCards(content.category_filter_cards)
                      if (content.mattress_finder_promo) setMattressFinderPromo(content.mattress_finder_promo)
                      if (content.category_grid) setCategoryGrid(content.category_grid)
                      if (content.review_section) setReviewSection(content.review_section)
                      if (content.guides_items) setGuidesItems(content.guides_items)
                      if (content.deal_grid_cards) setDealGridCards(content.deal_grid_cards)
                    }
                  } catch (error) {
                    console.error('Error loading homepage content:', error)
                  } finally {
                    setLoading(false)
                  }
                }
                loadHomepageContent()
              }}
              disabled={loading}
              variant="outline"
              className="mr-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
            </div>
          </div>

      {/* Main Hero Section */}
      <section className="w-full py-0 px-4 md:px-8 lg:px-12 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Banner - Carousel */}
          <div className="lg:col-span-2 relative h-96 lg:h-[500px] overflow-hidden rounded-lg group">
            <Image
              src={carouselImages[heroSlideIndex]?.src || '/placeholder.svg'}
              alt={carouselImages[heroSlideIndex]?.alt || 'Hero image'}
              fill
              className="object-cover transition-transform duration-500"
            />
            {isEditing && (
              <>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleImageEdit({ image: carouselImages[heroSlideIndex] })}
                    className="bg-white/80"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const updated = [...carouselImages]
                      if (updated[heroSlideIndex]) {
                        updated[heroSlideIndex] = { ...updated[heroSlideIndex], src: '/placeholder.svg', alt: 'placeholder' }
                        setCarouselImages(updated)
                      }
                    }}
                    className="bg-white/80"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Banners */}
          <div className="flex flex-col gap-3 h-96 lg:h-[500px]">
            {rightHeroImages.map((image, idx) => (
              <div key={idx} className="relative w-full h-1/2 overflow-hidden rounded-lg group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500"
                />
                {isEditing && (
                  <>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleImageEdit({ image })}
                        className="bg-white/80"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updated = [...rightHeroImages]
                          updated[idx] = { ...updated[idx], src: '/placeholder.svg', alt: 'placeholder' }
                          setRightHeroImages(updated)
                        }}
                        className="bg-white/80"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Parallel Images Section */}
      <section className="relative w-full bg-white py-6 mb-6">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fourImagesSection.map((item, idx) => (
              <div key={idx} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                {renderEditableImage(item, 'w-full h-full object-cover')}
                <div className="absolute inset-0 bg-black/20 flex items-end">
                  <div className="text-white p-4 w-full">
                    {renderEditableText(item, 'title', 'text-lg font-bold mb-2 font-display')}
                    {renderEditableText(item, 'subtitle', 'text-sm text-gray-200 mb-3 font-modern')}
                    {renderEditableText(item, 'buttonText', 'bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Removed: Sleep Luxury, Every Night section with category tabs */}

      {/* Removed: Featured Products grid */}

      {/* Removed: Shop by Comfort & Support section */}

      {/* Mattress Finder Promo */}
      <section className="relative bg-white py-10 md:py-14 mb-6">
        <div className="px-4 md:px-6 lg:px-10 xl:px-12">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Soft background accent */}
            <div className="hidden lg:block absolute -left-6 top-6 bottom-6 w-1/2 rounded-3xl bg-orange-50/40" aria-hidden="true"></div>

            {/* Left: Image */}
            <div className="relative order-1 lg:order-none">
              <div className="relative h-[320px] sm:h-[400px] md:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg ring-1 ring-orange-100 bg-gray-100">
                {renderEditableImage(mattressFinderPromo, 'w-full h-full object-cover')}
              </div>
            </div>

            {/* Right: Content */}
            <div className="relative z-10">
              {renderEditableText(mattressFinderPromo, 'title', 'text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-4 font-display')}
              {renderEditableText(mattressFinderPromo, 'subtitle', 'text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-modern')}
              {renderEditableText(mattressFinderPromo, 'buttonText', 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-semibold rounded-2xl shadow-lg text-center')}
            </div>
          </div>
        </div>
      </section>

      {/* Mattress Types Section */}
      <section className="py-12 bg-white mb-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {isEditing ? (
              <input
                type="text"
                defaultValue="Our Mattress Types"
                className="text-3xl font-bold text-black mb-4 font-display text-center w-full max-w-md mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Title"
              />
            ) : (
              <h2 className="text-3xl font-bold text-black mb-4 font-display">
                Our Mattress Types
              </h2>
            )}
            {isEditing ? (
              <textarea
                defaultValue="Tailored comfort, trusted support — discover mattresses made just for you."
                className="text-lg text-gray-700 font-modern text-center w-full max-w-2xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Description"
                rows={2}
              />
            ) : (
              <p className="text-lg text-gray-700 font-modern">
                Tailored comfort, trusted support — discover mattresses made just for you.
              </p>
            )}
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => prevSlide(mattressTypes.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            
            <button 
              onClick={() => nextSlide(mattressTypes.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              →
            </button>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {mattressTypes.map((type, idx) => (
                  <div key={idx} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                    <div className="relative mb-6 group">
                      <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0]
                                if (file) {
                                  const objectUrl = URL.createObjectURL(file)
                                  const newTypes = [...mattressTypes]
                                  newTypes[idx].image = objectUrl
                                  setMattressTypes(newTypes)
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                            <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500">Image Preview</span>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={type.image}
                            alt={type.title}
                            width={300}
                            height={320}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {isEditing && (
                        <button 
                          onClick={() => setMattressTypes(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center mb-3">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={type.icon}
                          onChange={(e) => {
                            const newTypes = [...mattressTypes]
                            newTypes[idx].icon = e.target.value
                            setMattressTypes(newTypes)
                          }}
                          className="text-2xl mr-2 text-center w-12 border border-gray-300 rounded p-1"
                          placeholder="Icon"
                        />
                      ) : (
                        <span className="text-2xl mr-2">{type.icon}</span>
                      )}
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={type.title}
                          onChange={(e) => {
                            const newTypes = [...mattressTypes]
                            newTypes[idx].title = e.target.value
                            setMattressTypes(newTypes)
                          }}
                          className="font-semibold text-black ml-2 text-lg font-display border border-gray-300 rounded p-1"
                          placeholder="Title"
                        />
                      ) : (
                        <h3 className="font-semibold text-black ml-2 text-lg font-display">
                          {type.title}
                        </h3>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <textarea
                        defaultValue={type.description}
                        onChange={(e) => {
                          const newTypes = [...mattressTypes]
                          newTypes[idx].description = e.target.value
                          setMattressTypes(newTypes)
                        }}
                        className="text-gray-700 text-sm leading-relaxed font-modern w-full border border-gray-300 rounded p-2"
                        placeholder="Description"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed font-modern">
                        {type.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isEditing && (
              <div className="text-center mt-8">
                <Button onClick={addNewMattressType} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Mattress Type
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Gallery */}
      <section className="w-full bg-white py-6 md:py-8 mb-6">
        <div className="mx-auto max-w-7xl px-4">
          {isEditing ? (
            <input
              type="text"
              defaultValue="Turn Your Bedroom Into Inspiration"
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-black text-center font-display w-full max-w-2xl mx-auto border border-gray-300 rounded p-2 mb-4"
              placeholder="Section Title"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black text-center font-display">Turn Your Bedroom Into Inspiration</h2>
          )}
          {isEditing ? (
            <textarea
              defaultValue="Share your perfect bed, sofa or mattress look with us on Instagram."
              className="mt-2 text-gray-700 text-center font-modern w-full max-w-2xl mx-auto border border-gray-300 rounded p-2 mb-2"
              placeholder="Main Description"
              rows={2}
            />
          ) : (
            <p className="mt-2 text-gray-700 text-center font-modern">Share your perfect bed, sofa or mattress look with us on Instagram.</p>
          )}
          {isEditing ? (
            <textarea
              defaultValue="Your style could be our next feature — and inspire others to rest better"
              className="mt-1 text-gray-700 text-center font-modern w-full max-w-2xl mx-auto border border-gray-300 rounded p-2 mb-4"
              placeholder="Sub Description"
              rows={2}
            />
          ) : (
            <p className="mt-1 text-gray-700 text-center font-modern">Your style could be our next feature — and inspire others to rest better</p>
          )}

          <div className="mt-8 relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => prevSlide(galleryItems.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            
            <button 
              onClick={() => nextSlide(galleryItems.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              →
            </button>

            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {galleryItems.map((item, idx) => (
                  <div key={idx} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                    <div className="relative mb-6 group">
                      <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0]
                                if (file) {
                                  const objectUrl = URL.createObjectURL(file)
                                  const newItems = [...galleryItems]
                                  newItems[idx].image = objectUrl
                                  setGalleryItems(newItems)
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                            <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500">Image Preview</span>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={300}
                            height={320}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {isEditing && (
                        <button 
                          onClick={() => setGalleryItems(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={item.title}
                          onChange={(e) => {
                            const newItems = [...galleryItems]
                            newItems[idx].title = e.target.value
                            setGalleryItems(newItems)
                          }}
                          className="font-semibold text-black text-lg font-display w-full border border-gray-300 rounded p-2"
                          placeholder="Title"
                        />
                      ) : (
                        <h3 className="font-semibold text-black text-lg font-display">
                          {item.title}
                        </h3>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <textarea
                        defaultValue={item.description}
                        onChange={(e) => {
                          const newItems = [...galleryItems]
                          newItems[idx].description = e.target.value
                          setGalleryItems(newItems)
                        }}
                        className="text-gray-700 text-sm leading-relaxed font-modern w-full border border-gray-300 rounded p-2"
                        placeholder="Description"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed font-modern">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isEditing && (
              <div className="text-center mt-8">
                <Button onClick={addNewGalleryItem} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Gallery Item
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ideas & Guides */}
      <section className="w-full bg-white py-16 md:py-20 relative overflow-hidden mb-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            {isEditing ? (
              <input
                type="text"
                defaultValue="Ideas & Guides"
                className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display text-center w-full max-w-2xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Title"
              />
            ) : (
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6 font-display">
                Ideas & Guides
              </h2>
            )}
            {isEditing ? (
              <textarea
                defaultValue="Expert advice, comprehensive buying guides, and inspirational ideas to help you create the perfect sleep sanctuary"
                className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern text-center w-full max-w-3xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Description"
                rows={2}
              />
            ) : (
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-modern">
                Expert advice, comprehensive buying guides, and inspirational ideas to help you create the perfect sleep sanctuary
              </p>
            )}
          </div>

          {/* Featured Guide */}
          <div className="mb-12">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-80 lg:h-full overflow-hidden">
                  <Image 
                    src="/hello.jpeg" 
                    alt="Find Your Perfect Mattress in 5 Minutes" 
                    width={600}
                    height={400}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-black font-modern">
                      💡 Expert Advice
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 font-display">
                      Find Your Perfect Mattress in 5 Minutes
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6 font-modern">
                      Our comprehensive guide helps you choose the ideal mattress based on your sleep style, body type, and comfort preferences.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm font-medium font-modern">5 min read</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                      Read Guide →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guidesItems.map((guide, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0]
                          if (file) {
                            const url = URL.createObjectURL(file)
                            const next = [...guidesItems]
                            next[idx].image = url
                            setGuidesItems(next)
                          }
                        }}
                        className="absolute top-3 left-3 z-10 bg-white/80 rounded"
                      />
                      <Image src={guide.image} alt={guide.title} width={400} height={200} className="w-full h-full object-cover" />
                    </>
                  ) : (
                    <Image src={guide.image} alt={guide.title} width={400} height={200} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={guide.category}
                        onChange={(e) => { const next = [...guidesItems]; next[idx].category = e.target.value; setGuidesItems(next) }}
                        className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-semibold text-black font-modern"
                      />
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-semibold text-black font-modern">
                        {guide.category}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={guide.title}
                        onChange={(e) => { const next = [...guidesItems]; next[idx].title = e.target.value; setGuidesItems(next) }}
                        className="w-full border border-gray-300 rounded p-2 mb-3 text-black font-display font-bold"
                      />
                    ) : (
                      <h4 className="text-xl font-bold text-black mb-3 line-clamp-2 font-display">{guide.title}</h4>
                    )}
                    {isEditing ? (
                      <textarea
                        defaultValue={guide.description}
                        onChange={(e) => { const next = [...guidesItems]; next[idx].description = e.target.value; setGuidesItems(next) }}
                        className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 font-modern mb-4"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 font-modern">{guide.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={guide.readTime}
                          onChange={(e) => { const next = [...guidesItems]; next[idx].readTime = e.target.value; setGuidesItems(next) }}
                          className="text-xs font-medium font-modern border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <span className="text-xs font-medium font-modern">{guide.readTime}</span>
                      )}
                  </div>
                    <div className="inline-flex items-center gap-1 text-black font-semibold text-sm font-modern">
                      Read More →
                  </div>
                </div>
                </div>
                {isEditing && (
                  <div className="p-3">
                    <Button size="sm" variant="destructive" onClick={() => setGuidesItems(prev => prev.filter((_, i) => i !== idx))}>Delete</Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  defaultValue="⭐ Explore All Guides →"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-white"
                  placeholder="CTA Text"
                />
                <div>
                  <Button onClick={addNewGuide} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Guide
                  </Button>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                ⭐ Explore All Guides →
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sofa Types Section */}
      <section className="py-12 bg-white mb-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {isEditing ? (
              <input
                type="text"
                defaultValue="Our Sofa Types"
                className="text-3xl font-bold text-black mb-4 font-display text-center w-full max-w-md mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Title"
              />
            ) : (
              <h2 className="text-3xl font-bold text-black mb-4 font-display">
                Our Sofa Types
              </h2>
            )}
            {isEditing ? (
              <textarea
                defaultValue="Elegant designs, exceptional comfort — discover sofas crafted for your lifestyle."
                className="text-lg text-gray-700 font-modern text-center w-full max-w-2xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Description"
                rows={2}
              />
            ) : (
              <p className="text-lg text-gray-700 font-modern">
                Elegant designs, exceptional comfort — discover sofas crafted for your lifestyle.
              </p>
            )}
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => prevSlide(sofaTypes.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            
            <button 
              onClick={() => nextSlide(sofaTypes.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              →
            </button>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sofaTypes.map((type, idx) => (
                  <div key={idx} className="text-center flex-shrink-0 w-full md:w-1/3 px-4">
                    <div className="relative mb-6 group">
                      <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0]
                                if (file) {
                                  const objectUrl = URL.createObjectURL(file)
                                  const newTypes = [...sofaTypes]
                                  newTypes[idx].image = objectUrl
                                  setSofaTypes(newTypes)
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                            <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500">Image Preview</span>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={type.image}
                            alt={type.title}
                            width={300}
                            height={320}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {isEditing && (
                        <button 
                          onClick={() => setSofaTypes(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center mb-3">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={type.icon}
                          onChange={(e) => {
                            const newTypes = [...sofaTypes]
                            newTypes[idx].icon = e.target.value
                            setSofaTypes(newTypes)
                          }}
                          className="text-2xl mr-2 text-center w-12 border border-gray-300 rounded p-1"
                          placeholder="Icon"
                        />
                      ) : (
                        <span className="text-2xl mr-2">{type.icon}</span>
                      )}
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={type.title}
                          onChange={(e) => {
                            const newTypes = [...sofaTypes]
                            newTypes[idx].title = e.target.value
                            setSofaTypes(newTypes)
                          }}
                          className="font-semibold text-black ml-2 text-lg font-display border border-gray-300 rounded p-1"
                          placeholder="Title"
                        />
                      ) : (
                        <h3 className="font-semibold text-black ml-2 text-lg font-display">
                          {type.title}
                        </h3>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <textarea
                        defaultValue={type.description}
                        onChange={(e) => {
                          const newTypes = [...sofaTypes]
                          newTypes[idx].description = e.target.value
                          setSofaTypes(newTypes)
                        }}
                        className="text-gray-700 text-sm leading-relaxed font-modern w-full border border-gray-300 rounded p-2"
                        placeholder="Description"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed font-modern">
                        {type.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isEditing && (
              <div className="text-center mt-8">
                <Button onClick={addNewSofaType} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Sofa Type
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 via-white to-orange-50 py-16 md:py-20 relative overflow-hidden mb-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <input
                type="text"
                defaultValue="📈 TRENDING NOW"
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center border border-white"
                placeholder="Badge Text"
              />
            ) : (
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                📈 TRENDING NOW
              </div>
            )}
            
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  defaultValue="Wake Up to What's Trending"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight px-4 font-display text-center w-full max-w-4xl mx-auto border border-gray-300 rounded p-2"
                  placeholder="Main Title"
                />
                <textarea
                  defaultValue="Zzz-worthy topics too hot to snooze. Discover the latest innovations in sleep technology and comfort."
                  className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 font-modern text-center w-full max-w-3xl mx-auto border border-gray-300 rounded p-2"
                  placeholder="Subtitle"
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight px-4 font-display">
                  Wake Up to What's{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                    Trending
                  </span>
                </h2>
                
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 font-modern">
                  Zzz-worthy topics too hot to snooze. Discover the latest innovations in sleep technology and comfort.
                </p>
              </>
            )}
          </div>

          {/* Trending Grid */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {trendingItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white h-full">
                {/* Image - Made square and wider */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={300}
                    height={300}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg font-semibold">
                        {item.badge}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Rating */}
                  {item.rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-orange-500">★</span>
                      <span className="text-xs font-semibold text-black">{item.rating}</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex-1">
                    {/* Category */}
                    {item.category && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-orange-500">✨</span>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide font-modern">
                          {item.category}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2 line-clamp-2 font-display">
                      {item.title}
                    </h3>
                    
                    {/* Subtitle */}
                    {item.subtitle && (
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 font-modern">
                        {item.subtitle}
                      </p>
                    )}
                    
                    {/* Price Section */}
                    {item.price && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold text-black font-display">
                          £{item.price}
                        </span>
                        {item.original_price && item.original_price > item.price && (
                          <>
                            <span className="text-lg text-gray-500 line-through font-modern">
                              £{item.original_price}
                            </span>
                            {item.discount_label && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                                {item.discount_label}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-xs font-medium font-modern">{item.read_time}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                      Claim Deal Now →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
                      {isEditing && (
              <div className="text-center mt-8">
                <Button onClick={addNewTrendingCard} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Trending Card
                </Button>
              </div>
            )}
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="w-full bg-white py-12 md:py-16 mb-6">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-12">
            {isEditing ? (
              <input
                type="text"
                defaultValue="Deal of the Day"
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display text-center w-full max-w-2xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Title"
              />
            ) : (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
                Deal of the Day
              </h2>
            )}
            {isEditing ? (
              <textarea
                defaultValue="Unbeatable prices on premium mattresses. Don't miss out on these exclusive offers!"
                className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-modern text-center w-full max-w-2xl mx-auto border border-gray-300 rounded p-2"
                placeholder="Section Description"
                rows={2}
              />
            ) : (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-modern">
                Unbeatable prices on premium mattresses. Don't miss out on these exclusive offers!
              </p>
            )}
            
            {/* Countdown Timer */}
            <div className="bg-white rounded-xl p-4 shadow-none mb-6 max-w-sm mx-auto">
              <div className="text-center">
                <p className="text-gray-600 mb-3 text-sm font-modern">Offer ends in:</p>
                <div className="flex justify-center items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 font-display">23</div>
                    <div className="text-xs text-gray-500 font-modern">Hours</div>
                  </div>
                  <div className="text-xl text-gray-300">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 font-display">45</div>
                    <div className="text-xs text-gray-500 font-modern">Minutes</div>
                  </div>
                  <div className="text-xl text-gray-300">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 font-display">12</div>
                    <div className="text-xs text-gray-500 font-modern">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Deal Card */}
          <div className="bg-white rounded-3xl shadow-none overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image Section */}
              <div className="relative h-80 lg:h-full bg-gradient-to-br from-orange-50 to-red-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <Image
                  src="/sofa.jpeg"
                  alt="Premium Mattress Deal"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                {/* Deal Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 px-4 py-2 text-lg font-bold shadow-lg">
                    60% OFF
                  </Badge>
                </div>
                {/* Rating */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 font-modern">4.9</span>
                </div>
              </div>

              {/* Right: Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
                    Cascade Premium Hybrid Mattress
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6 font-modern">
                    Experience ultimate comfort with our best-selling hybrid mattress. Features advanced cooling technology, 
                    premium memory foam layers, and superior edge support for undisturbed sleep.
                  </p>
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-display">£299</span>
                    <span className="text-2xl text-gray-400 line-through font-modern">£749</span>
                    <span className="text-lg text-green-600 font-semibold font-modern">Save £450</span>
                  </div>
                  <p className="text-sm text-gray-500 font-modern">Free delivery & 14-night trial included</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-modern">14-Night Trial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-modern">1-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-modern">Premium Quality</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  ⚡ Claim This Deal Now →
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Deal 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <Image
                  src="/bedcollect.jpeg"
                  alt="Memory Foam Mattress"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">40% OFF</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">Memory Foam Mattress</h4>
              <p className="text-gray-600 text-sm mb-3 font-modern">Ultra-comfortable memory foam with cooling technology</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600 font-display">£199</span>
                  <span className="text-lg text-gray-400 line-through font-modern">£329</span>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  View Deal
                </Button>
              </div>
            </div>

            {/* Deal 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <Image
                  src="/hello.jpeg"
                  alt="Hybrid Mattress"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-orange-500 text-white">35% OFF</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">Hybrid Mattress</h4>
              <p className="text-gray-600 text-sm mb-3 font-modern">Perfect blend of springs and foam for optimal support</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600 font-display">£249</span>
                  <span className="text-lg text-gray-400 line-through font-modern">£379</span>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  View Deal
                </Button>
              </div>
            </div>

            {/* Deal 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <Image
                  src="/hi.jpeg"
                  alt="Pocket Spring Mattress"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-green-500 text-white">25% OFF</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">Pocket Spring Mattress</h4>
              <p className="text-gray-600 text-sm mb-3 font-modern">Individual pocket springs for personalized comfort</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600 font-display">£179</span>
                  <span className="text-lg text-gray-400 line-through font-modern">£239</span>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  View Deal
          </Button>
              </div>
            </div>

            {/* Deal 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <Image
                  src="/mattress-image.svg"
                  alt="Latex Mattress"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white">30% OFF</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">Natural Latex Mattress</h4>
              <p className="text-gray-600 text-sm mb-3 font-modern">Eco-friendly latex with natural comfort and support</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600 font-display">£299</span>
                  <span className="text-lg text-gray-400 line-through font-modern">£429</span>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  View Deal
                </Button>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="text-center mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Deal Card
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Category Grid */}
      <section className="w-full px-4 md:px-8 lg:px-12 mb-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Category Grid</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryGrid.map((category, idx) => (
              <div key={idx} className="text-center space-y-2">
                {renderEditableImage(category, 'w-full h-32 object-cover rounded-lg')}
                {renderEditableText(category, 'title', 'font-semibold')}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="w-full px-4 md:px-8 lg:px-12 mb-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            {renderEditableText(reviewSection, 'title', 'text-2xl font-bold text-gray-900')}
            {renderEditableText(reviewSection, 'subtitle', 'text-gray-600')}
          </div>
        </div>
      </section>

      {/* Promotional Cards Management */}
      <section className="w-full bg-white py-8 px-4 md:px-8 lg:px-12 mb-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Promotional Cards Management</h2>
          <p className="text-gray-600 mb-8">Manage promotional cards like "Add a pillow" that appear throughout the site</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalCards.map((card, idx) => (
              <div key={idx} className={`${card.backgroundColor} rounded-lg p-6 border border-gray-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{card.icon}</span>
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={card.title}
                        onChange={(e) => {
                          const newCards = [...promotionalCards]
                          newCards[idx].title = e.target.value
                          setPromotionalCards(newCards)
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-lg font-bold bg-white"
                        placeholder="Card title"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={card.subtitle}
                      onChange={(e) => {
                        const newCards = [...promotionalCards]
                        newCards[idx].subtitle = e.target.value
                        setPromotionalCards(newCards)
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-base bg-white"
                      placeholder="Promotional text"
                    />
                  ) : (
                    <p className="text-base text-gray-700">{card.subtitle}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Image</label>
                  {isEditing ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0]
                        if (file) {
                          const objectUrl = URL.createObjectURL(file)
                          const newCards = [...promotionalCards]
                          newCards[idx].image = objectUrl
                          setPromotionalCards(newCards)
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500">Image</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    {isEditing ? (
                      <select 
                        value={card.backgroundColor}
                        onChange={(e) => {
                          const newCards = [...promotionalCards]
                          newCards[idx].backgroundColor = e.target.value
                          setPromotionalCards(newCards)
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="bg-orange-100">Orange</option>
                        <option value="bg-blue-100">Blue</option>
                        <option value="bg-green-100">Green</option>
                        <option value="bg-purple-100">Purple</option>
                        <option value="bg-pink-100">Pink</option>
                      </select>
                    ) : (
                      <div className="w-full h-8 rounded border-2 border-gray-300"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={card.icon}
                        onChange={(e) => {
                          const newCards = [...promotionalCards]
                          newCards[idx].icon = e.target.value
                          setPromotionalCards(newCards)
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-center"
                        placeholder="Emoji or icon"
                      />
                    ) : (
                      <span className="text-2xl">{card.icon}</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => setPromotionalCards(prev => prev.filter((_, i) => i !== idx))}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-8 text-center">
              <Button onClick={addNewDealCard} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Promotional Card
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
