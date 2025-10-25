"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, Edit, Trash2, Eye, Calendar, User, Clock, Tag, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  author: string
  date: string
  image: string
  featured: boolean
  tags: string[]
  content?: string
  created_at?: string
  updated_at?: string
}

export function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const categories = [
    "Product Launch",
    "Business News", 
    "Partnership",
    "Awards",
    "Customer Service",
    "Retail"
  ]

  // Load news items from database
  useEffect(() => {
    const loadNewsItems = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/news')
        if (response.ok) {
          const data = await response.json()
          setNewsItems(data.news || [])
        } else {
          console.error('Failed to load news items')
        }
      } catch (error) {
        console.error('Error loading news items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNewsItems()
  }, [])

  const handleSave = async (item: NewsItem) => {
    try {
      setSaving(true)
      const isUpdate = !!item.id && item.id !== 'new'
      
      const response = await fetch('/api/admin/news', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })

      if (response.ok) {
        const data = await response.json()
        if (isUpdate) {
          setNewsItems(prev => prev.map(n => n.id === item.id ? data.news : n))
        } else {
          setNewsItems(prev => [data.news, ...prev])
        }
        
        setEditingItem(null)
        setIsAddingNew(false)
        toast({
          title: "Success",
          description: `News item ${isUpdate ? 'updated' : 'created'} successfully`,
        })
      } else {
        throw new Error('Failed to save news item')
      }
    } catch (error) {
      console.error('Error saving news item:', error)
      toast({
        title: "Error",
        description: "Failed to save news item",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNewsItems(prev => prev.filter(n => n.id !== id))
        toast({
          title: "Success",
          description: "News item deleted successfully",
        })
      } else {
        throw new Error('Failed to delete news item')
      }
    } catch (error) {
      console.error('Error deleting news item:', error)
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive"
      })
    }
  }

  const startEditing = (item: NewsItem) => {
    setEditingItem(item)
    setIsAddingNew(false)
  }

  const startAdding = () => {
    setEditingItem({
      id: 'new',
      title: '',
      excerpt: '',
      category: 'Product Launch',
      readTime: '5 min read',
      author: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      featured: false,
      tags: []
    })
    setIsAddingNew(true)
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setIsAddingNew(false)
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'news-images')
      
      // Upload to your file storage service (adjust endpoint as needed)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        if (editingItem) {
          setEditingItem({...editingItem, image: data.url})
        }
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        })
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        })
        return
      }
      
      handleImageUpload(file)
    }
  }

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage press releases and company news</p>
        </div>
        <Button onClick={startAdding} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add News Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search news items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={item.featured ? "default" : "secondary"}>
                    {item.category}
                  </Badge>
                  {item.featured && (
                    <Badge className="bg-orange-500">Featured</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {item.excerpt}
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{item.readTime}</span>
                </div>
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? 'Add News Item' : 'Edit News Item'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    placeholder="News item title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editingItem.category} 
                    onValueChange={(value) => setEditingItem({...editingItem, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editingItem.excerpt}
                  onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})}
                  placeholder="Brief description of the news item"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={editingItem.author}
                    onChange={(e) => setEditingItem({...editingItem, author: e.target.value})}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={editingItem.readTime}
                    onChange={(e) => setEditingItem({...editingItem, readTime: e.target.value})}
                    placeholder="5 min read"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={editingItem.image || ''}
                    onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                    placeholder="https://example.com/image.jpg or upload file"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                {editingItem.image && (
                  <div className="mt-2">
                    <img 
                      src={editingItem.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({...editingItem, featured: e.target.checked})}
                    className="rounded"
                  />
                  Featured
                </Label>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          const newTags = editingItem.tags.filter((_, i) => i !== index)
                          setEditingItem({...editingItem, tags: newTags})
                        }}
                      />
                    </Badge>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newTag = prompt('Enter tag:')
                      if (newTag) {
                        setEditingItem({...editingItem, tags: [...editingItem.tags, newTag]})
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSave(editingItem)}
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
