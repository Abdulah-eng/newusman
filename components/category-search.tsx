"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, Search } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

export function CategorySearch() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Update selected category based on current pathname
  useEffect(() => {
    if (pathname && pathname.startsWith('/category/')) {
      const categorySlug = pathname.split('/category/')[1]
      if (categorySlug) {
        setSelectedCategory(categorySlug)
      }
    } else if (pathname && pathname !== '/' && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/checkout') && !pathname.startsWith('/cart') && !pathname.startsWith('/login') && !pathname.startsWith('/wishlist')) {
      // Check if we're on a direct category page like /beds, /sofas, etc.
      const categorySlug = pathname.substring(1) // Remove the leading slash
      setSelectedCategory(categorySlug)
    } else {
      setSelectedCategory('all')
    }
  }, [pathname])

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    
    // Navigate immediately when category is selected
    if (categorySlug && categorySlug !== 'all') {
      router.push(`/${categorySlug}`)
    } else {
      // If "All Category" is selected, go to mattresses as default
      router.push('/mattresses')
    }
  }

  return (
    <div className="flex items-center bg-white rounded-md overflow-hidden w-full max-w-2xl mx-auto">
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="px-2 lg:px-3 py-2 text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs lg:text-sm flex-1">
          <SelectValue placeholder="All Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="w-px h-6 bg-gray-200"></div>
      <div className="bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center rounded-sm" style={{ width: '64px', height: '36px', padding: '8px 12px', marginLeft: '12px', marginRight: '4px', marginTop: '4px', marginBottom: '4px' }}>
        <Search className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
      </div>
    </div>
  )
}
