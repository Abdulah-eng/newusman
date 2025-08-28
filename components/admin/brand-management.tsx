"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/hooks/use-toast"

export function BrandManagement() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo_url: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name')
      
      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      toast({
        title: "Error",
        description: "Failed to fetch brands",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBrand) {
        // Update existing brand
        const { error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingBrand.id)
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "Brand updated successfully"
        })
      } else {
        // Create new brand
        const { error } = await supabase
          .from('brands')
          .insert([formData])
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "Brand created successfully"
        })
      }
      
      setShowForm(false)
      setEditingBrand(null)
      resetForm()
      fetchBrands()
    } catch (error) {
      console.error('Error saving brand:', error)
      toast({
        title: "Error",
        description: "Failed to save brand",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (brand: any) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      logo_url: brand.logo_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (brandId: number) => {
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Brand deleted successfully"
      })
      
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      logo_url: ''
    })
  }

  const handleAddNew = () => {
    setEditingBrand(null)
    resetForm()
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBrand(null)
    resetForm()
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading brands...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://brand-website.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brand description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <Input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingBrand ? 'Update' : 'Create'} Brand
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Brands List */}
      <Card>
        <CardHeader>
          <CardTitle>Brands ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <div key={brand.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-3">
                  {brand.logo_url && (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name}
                      className="w-12 h-12 object-contain rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{brand.name}</h3>
                    {brand.website && (
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 break-all"
                      >
                        {brand.website}
                      </a>
                    )}
                  </div>
                </div>
                {brand.description && (
                  <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                )}
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(brand)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{brand.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(brand.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
          {brands.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No brands found. Create your first brand to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
