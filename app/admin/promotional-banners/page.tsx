"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { uploadToSupabase } from '@/lib/image-upload'

interface PromotionalBanner {
  id: string
  banner_type: string
  title: string
  subtitle: string
  description: string
  image_url: string
  link_url: string
  badge_text: string
  badge_color: string
  discount_percentage: number
  discount_text: string
  is_active: boolean
  sort_order: number
}

const BANNER_TYPES = [
  { value: 'flash_sale', label: 'Flash Sale' },
  { value: 'clearance', label: 'Clearance' },
  { value: 'end_of_season', label: 'End of Season' },
  { value: 'special_offer', label: 'Special Offer' },
  { value: 'new_arrival', label: 'New Arrival' }
]

const BADGE_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'gray', label: 'Gray' }
]

export default function PromotionalBannersAdminPage() {
  const [banners, setBanners] = useState<PromotionalBanner[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/promotional-banners')
      if (res.ok) {
        const data = await res.json()
        let fetchedBanners = data.banners || []
        
        // Ensure we always have exactly 3 banners
        while (fetchedBanners.length < 3) {
          const newBanner: PromotionalBanner = {
            id: `temp-${Date.now()}-${Math.random()}`,
            banner_type: 'special_offer',
            title: `Banner ${fetchedBanners.length + 1}`,
            subtitle: 'Subtitle',
            description: 'Description',
            image_url: '',
            link_url: '/sale',
            badge_text: 'NEW',
            badge_color: 'red',
            discount_percentage: 20,
            discount_text: '20% Off',
            is_active: true,
            sort_order: fetchedBanners.length + 1
          }
          fetchedBanners.push(newBanner)
        }
        
        // Limit to exactly 3 banners
        setBanners(fetchedBanners.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      // Initialize with 3 default banners if fetch fails
      const defaultBanners: PromotionalBanner[] = [
        {
          id: `temp-${Date.now()}-1`,
          banner_type: 'flash_sale',
          title: 'FLASH SALE',
          subtitle: 'Up to 70% Off',
          description: 'Limited Time Only',
          image_url: '/clearance.png',
          link_url: '/sale',
          badge_text: 'HOT DEAL',
          badge_color: 'red',
          discount_percentage: 70,
          discount_text: 'Up to 70% Off',
          is_active: true,
          sort_order: 1
        },
        {
          id: `temp-${Date.now()}-2`,
          banner_type: 'clearance',
          title: 'CLEARANCE',
          subtitle: 'Up to 60% Off',
          description: 'While Stocks Last',
          image_url: '/secondbanner.jpg',
          link_url: '/sale',
          badge_text: 'SAVE BIG',
          badge_color: 'orange',
          discount_percentage: 60,
          discount_text: 'Up to 60% Off',
          is_active: true,
          sort_order: 2
        },
        {
          id: `temp-${Date.now()}-3`,
          banner_type: 'end_of_season',
          title: 'END OF SEASON',
          subtitle: 'Up to 50% Off',
          description: 'Final Reductions',
          image_url: '/banner.jpg',
          link_url: '/sale',
          badge_text: 'LAST CHANCE',
          badge_color: 'gray',
          discount_percentage: 50,
          discount_text: 'Up to 50% Off',
          is_active: true,
          sort_order: 3
        }
      ]
      setBanners(defaultBanners)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/promotional-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners })
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Failed to save banners')
      }
    } catch (error) {
      console.error('Error saving banners:', error)
      alert('Error saving banners')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, bannerId: string) => {
    try {
      const imageUrl = await uploadToSupabase(file)
      setBanners(prev => prev.map(banner => 
        banner.id === bannerId ? { ...banner, image_url: imageUrl } : banner
      ))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    }
  }

  // Removed addBanner and removeBanner functions - only 3 banners allowed

  const updateBanner = (bannerId: string, field: keyof PromotionalBanner, value: any) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId ? { ...banner, [field]: value } : banner
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading promotional banners...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotional Banners</h1>
              <p className="text-gray-600 mt-1">Manage sales and clearance banner images and content</p>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="relative">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner Type */}
                <div>
                  <Label>Banner Type</Label>
                  <Select
                    value={banner.banner_type}
                    onValueChange={(value) => updateBanner(banner.id, 'banner_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BANNER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Banner Image</Label>
                  {banner.image_url ? (
                    <div className="relative">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], banner.id)}
                        className="hidden"
                        id={`banner-image-${banner.id}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`banner-image-${banner.id}`)?.click()}
                        className="absolute top-2 right-2"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], banner.id)}
                        className="hidden"
                        id={`banner-image-${banner.id}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`banner-image-${banner.id}`)?.click()}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <Label>Title</Label>
                  <Input
                    value={banner.title}
                    onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                    placeholder="Banner title"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={banner.subtitle}
                    onChange={(e) => updateBanner(banner.id, 'subtitle', e.target.value)}
                    placeholder="Banner subtitle"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={banner.description}
                    onChange={(e) => updateBanner(banner.id, 'description', e.target.value)}
                    placeholder="Banner description"
                    rows={2}
                  />
                </div>

                {/* Link URL */}
                <div>
                  <Label>Link URL</Label>
                  <Input
                    value={banner.link_url}
                    onChange={(e) => updateBanner(banner.id, 'link_url', e.target.value)}
                    placeholder="/sale"
                  />
                </div>

                {/* Badge Text */}
                <div>
                  <Label>Badge Text</Label>
                  <Input
                    value={banner.badge_text}
                    onChange={(e) => updateBanner(banner.id, 'badge_text', e.target.value)}
                    placeholder="HOT DEAL"
                  />
                </div>

                {/* Badge Color */}
                <div>
                  <Label>Badge Color</Label>
                  <Select
                    value={banner.badge_color}
                    onValueChange={(value) => updateBanner(banner.id, 'badge_color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BADGE_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount Percentage */}
                <div>
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    value={banner.discount_percentage}
                    onChange={(e) => updateBanner(banner.id, 'discount_percentage', parseInt(e.target.value) || 0)}
                    placeholder="70"
                  />
                </div>

                {/* Discount Text */}
                <div>
                  <Label>Discount Text</Label>
                  <Input
                    value={banner.discount_text}
                    onChange={(e) => updateBanner(banner.id, 'discount_text', e.target.value)}
                    placeholder="Up to 70% Off"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={banner.sort_order}
                    onChange={(e) => updateBanner(banner.id, 'sort_order', parseInt(e.target.value) || 0)}
                    placeholder="1"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`active-${banner.id}`}
                    checked={banner.is_active}
                    onChange={(e) => updateBanner(banner.id, 'is_active', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`active-${banner.id}`}>Active</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Loading promotional banners...</p>
          </div>
        )}
      </div>
    </div>
  )
}
