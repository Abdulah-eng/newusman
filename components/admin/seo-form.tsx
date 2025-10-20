"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus, Search, Eye, Share2, Twitter, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SEOFormProps {
  seoData: SEOData
  onChange: (data: SEOData) => void
  productName?: string
  productDescription?: string
}

interface SEOData {
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  seo_tags?: string
  meta_robots?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  structured_data?: any
}

const ROBOTS_OPTIONS = [
  { value: 'index, follow', label: 'Index, Follow (Recommended)' },
  { value: 'index, nofollow', label: 'Index, No Follow' },
  { value: 'noindex, follow', label: 'No Index, Follow' },
  { value: 'noindex, nofollow', label: 'No Index, No Follow' }
]

export function SEOForm({ seoData, onChange, productName = '', productDescription = '' }: SEOFormProps) {
  const { toast } = useToast()
  const [newKeyword, setNewKeyword] = useState('')
  const [newTag, setNewTag] = useState('')
  const [previewMode, setPreviewMode] = useState<'search' | 'social' | 'twitter'>('search')

  const keywords = seoData.seo_keywords?.split(',').map(k => k.trim()).filter(Boolean) || []
  const tags = seoData.seo_tags?.split(',').map(t => t.trim()).filter(Boolean) || []

  const handleInputChange = (field: keyof SEOData, value: string) => {
    onChange({
      ...seoData,
      [field]: value
    })
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...keywords, newKeyword.trim()]
      handleInputChange('seo_keywords', updatedKeywords.join(', '))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword)
    handleInputChange('seo_keywords', updatedKeywords.join(', '))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      handleInputChange('seo_tags', updatedTags.join(', '))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag)
    handleInputChange('seo_tags', updatedTags.join(', '))
  }

  const generateSEO = () => {
    if (!productName) {
      toast({
        title: "Error",
        description: "Product name is required to generate SEO content",
        variant: "destructive"
      })
      return
    }

    // Generate SEO title (max 60 chars)
    const seoTitle = `${productName} | Premium Mattress | Bedora Living`
    if (seoTitle.length <= 60) {
      handleInputChange('seo_title', seoTitle)
    }

    // Generate SEO description (max 160 chars)
    const seoDescription = productDescription 
      ? `${productDescription.substring(0, 120)}... Shop now with free delivery!`
      : `Premium ${productName} with free delivery. Quality guaranteed. Shop now at Bedora Living!`
    
    if (seoDescription.length <= 160) {
      handleInputChange('seo_description', seoDescription)
    }

    // Generate Open Graph data
    handleInputChange('og_title', seoTitle)
    handleInputChange('og_description', seoDescription)
    handleInputChange('twitter_title', seoTitle)
    handleInputChange('twitter_description', seoDescription)

    toast({
      title: "Success",
      description: "SEO content generated successfully"
    })
  }

  const getCharacterCount = (text: string, max: number) => {
    const count = text?.length || 0
    return {
      count,
      isOver: count > max,
      color: count > max ? 'text-red-500' : count > max * 0.9 ? 'text-yellow-500' : 'text-green-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* SEO Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
          <p className="text-sm text-gray-600">Optimize your product for search engines and social media</p>
        </div>
        <Button onClick={generateSEO} variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Generate SEO
        </Button>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={previewMode === 'search' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewMode('search')}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Preview
        </Button>
        <Button
          variant={previewMode === 'social' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewMode('social')}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Social Preview
        </Button>
        <Button
          variant={previewMode === 'twitter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewMode('twitter')}
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter Preview
        </Button>
      </div>

      {/* Search Engine Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Engine Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SEO Title */}
          <div>
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              value={seoData.seo_title || ''}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              placeholder="Enter SEO title (max 60 characters)"
              maxLength={70}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">Appears in search results</span>
              <span className={getCharacterCount(seoData.seo_title || '', 60).color}>
                {getCharacterCount(seoData.seo_title || '', 60).count}/60
              </span>
            </div>
          </div>

          {/* SEO Description */}
          <div>
            <Label htmlFor="seo_description">Meta Description</Label>
            <Textarea
              id="seo_description"
              value={seoData.seo_description || ''}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              placeholder="Enter meta description (max 160 characters)"
              maxLength={170}
              rows={3}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">Appears in search results</span>
              <span className={getCharacterCount(seoData.seo_description || '', 160).color}>
                {getCharacterCount(seoData.seo_description || '', 160).count}/160
              </span>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <Label>Keywords</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button onClick={addKeyword} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button onClick={addTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Meta Robots */}
          <div>
            <Label htmlFor="meta_robots">Meta Robots</Label>
            <Select
              value={seoData.meta_robots || 'index, follow'}
              onValueChange={(value) => handleInputChange('meta_robots', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROBOTS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canonical URL */}
          <div>
            <Label htmlFor="canonical_url">Canonical URL</Label>
            <Input
              id="canonical_url"
              value={seoData.canonical_url || ''}
              onChange={(e) => handleInputChange('canonical_url', e.target.value)}
              placeholder="https://www.bedoraliving.co.uk/products/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Social Media Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Open Graph Title */}
          <div>
            <Label htmlFor="og_title">Open Graph Title</Label>
            <Input
              id="og_title"
              value={seoData.og_title || ''}
              onChange={(e) => handleInputChange('og_title', e.target.value)}
              placeholder="Title for social media sharing"
            />
          </div>

          {/* Open Graph Description */}
          <div>
            <Label htmlFor="og_description">Open Graph Description</Label>
            <Textarea
              id="og_description"
              value={seoData.og_description || ''}
              onChange={(e) => handleInputChange('og_description', e.target.value)}
              placeholder="Description for social media sharing"
              rows={3}
            />
          </div>

          {/* Open Graph Image */}
          <div>
            <Label htmlFor="og_image">Open Graph Image URL</Label>
            <Input
              id="og_image"
              value={seoData.og_image || ''}
              onChange={(e) => handleInputChange('og_image', e.target.value)}
              placeholder="https://www.bedoraliving.co.uk/images/..."
            />
          </div>

          {/* Twitter Title */}
          <div>
            <Label htmlFor="twitter_title">Twitter Title</Label>
            <Input
              id="twitter_title"
              value={seoData.twitter_title || ''}
              onChange={(e) => handleInputChange('twitter_title', e.target.value)}
              placeholder="Title for Twitter cards"
            />
          </div>

          {/* Twitter Description */}
          <div>
            <Label htmlFor="twitter_description">Twitter Description</Label>
            <Textarea
              id="twitter_description"
              value={seoData.twitter_description || ''}
              onChange={(e) => handleInputChange('twitter_description', e.target.value)}
              placeholder="Description for Twitter cards"
              rows={3}
            />
          </div>

          {/* Twitter Image */}
          <div>
            <Label htmlFor="twitter_image">Twitter Image URL</Label>
            <Input
              id="twitter_image"
              value={seoData.twitter_image || ''}
              onChange={(e) => handleInputChange('twitter_image', e.target.value)}
              placeholder="https://www.bedoraliving.co.uk/images/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewMode === 'search' && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-blue-600 text-sm mb-1">
                {seoData.canonical_url || 'https://www.bedoraliving.co.uk/products/...'}
              </div>
              <div className="text-xl text-blue-800 mb-2">
                {seoData.seo_title || productName || 'Product Title'}
              </div>
              <div className="text-sm text-gray-600">
                {seoData.seo_description || productDescription || 'Product description...'}
              </div>
            </div>
          )}

          {previewMode === 'social' && (
            <div className="border rounded-lg p-4 bg-white max-w-md">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {seoData.og_title || seoData.seo_title || productName}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">bedoraliving.co.uk</div>
                  <div className="text-sm text-gray-700">
                    {seoData.og_description || seoData.seo_description || productDescription}
                  </div>
                </div>
              </div>
              {seoData.og_image && (
                <div className="mt-3 w-full h-48 bg-gray-200 rounded"></div>
              )}
            </div>
          )}

          {previewMode === 'twitter' && (
            <div className="border rounded-lg p-4 bg-white max-w-md">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Bedora Living</div>
                  <div className="text-xs text-gray-500">@bedoraliving</div>
                  <div className="mt-2">
                    <div className="font-semibold text-sm">
                      {seoData.twitter_title || seoData.og_title || seoData.seo_title || productName}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {seoData.twitter_description || seoData.og_description || seoData.seo_description || productDescription}
                    </div>
                  </div>
                </div>
              </div>
              {seoData.twitter_image && (
                <div className="mt-3 w-full h-48 bg-gray-200 rounded"></div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
