"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { supabase } from '@/lib/supabaseClient'

export function PromosManagement() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState<'image'|'video'>('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/promos?key=mattress_finder')
        const json = await res.json()
        const promo = json.promos?.[0]
        if (promo) {
          setTitle(promo.title || '')
          setDescription(promo.description || '')
          setMediaType((promo.media_type as any) || 'image')
          setMediaUrl(promo.media_url || '')
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const save = async () => {
    try {
      setSaving(true)
      await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'mattress_finder', title, description, media_type: mediaType, media_url: mediaUrl, is_active: true })
      })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to upload images.')
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const json = await res.json()
      setMediaUrl(json.url)
    } catch (e: any) {
      console.error('Upload error:', e)
      alert(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    try {
      setUploading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to upload videos.')
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const json = await res.json()
      setMediaUrl(json.url)
    } catch (e: any) {
      console.error('Upload error:', e)
      alert(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Promotions</h2>

      <Card>
        <CardHeader>
          <CardTitle>Mattress Finder Promo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Find Your Perfect Mattress in Minutes" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea className="w-full border border-gray-300 rounded-md p-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} className="w-full border border-gray-300 rounded-md p-2">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
              <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." />
              <p className="text-xs text-gray-500 mt-1">Or upload a file below</p>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Media Upload</h4>
            
            {mediaType === 'image' ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} 
                    className="flex-1"
                  />
                  {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
                </div>
                {mediaUrl && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img src={mediaUrl} alt="preview" className="h-32 w-48 object-cover rounded border shadow-sm" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])} 
                    className="flex-1"
                  />
                  {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
                </div>
                {mediaUrl && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <video 
                      src={mediaUrl} 
                      className="h-32 w-48 object-cover rounded border shadow-sm" 
                      controls 
                      muted
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? 'Saving...' : 'Save Promo'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
