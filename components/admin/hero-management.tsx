"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'

type HeroKey = 'hero_main' | 'hero_side' | 'hero_quick_grid'

const HERO_KEYS: { key: HeroKey; label: string; hint?: string }[] = [
  { key: 'hero_main', label: 'Main Hero Carousel', hint: 'Carousel slides (images, titles, links)' },
  { key: 'hero_side', label: 'Right Side Banners', hint: 'Two vertical banners shown on desktop' },
  { key: 'hero_quick_grid', label: 'Quick Grid (4 tiles)', hint: 'Four images with title/subtitle/button' },
]

export function HeroManagement() {
  const [activeKey, setActiveKey] = useState<HeroKey>('hero_main')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const load = async (key: HeroKey) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/homepage?key=${encodeURIComponent(key)}`)
      const json = await res.json()
      const section = json.sections?.[0]
      setTitle(section?.title || '')
      setSubtitle(section?.subtitle || '')
      setItems(section?.items || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(activeKey)
  }, [activeKey])

  const addItem = () => {
    const next = [...items]
    next.push({ title: '', subtitle: '', badge: '', image: '', href: '', category: '', position: items.length })
    setItems(next)
  }
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx))

  const handleImageUpload = async (file: File, idx: number) => {
    try {
      setUploadingIndex(idx)
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
      const next = [...items]
      next[idx].image = json.url
      setItems(next)
    } catch (e: any) {
      console.error('Image upload error:', e)
      alert(e?.message || 'Upload failed')
    } finally {
      setUploadingIndex(null)
    }
  }

  const save = async () => {
    setLoading(true)
    try {
      await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: { key: activeKey, title, subtitle, is_active: true }, items })
      })
    } finally {
      setLoading(false)
    }
  }

  // For hero_side we usually want exactly 2 items; for hero_quick_grid, 4 items. We still allow flexible counts.

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Hero Management</h2>

      <div className="flex flex-wrap gap-2">
        {HERO_KEYS.map(s => (
          <Button key={s.key} variant={activeKey === s.key ? 'default' : 'outline'} onClick={() => setActiveKey(s.key)}>
            {s.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {HERO_KEYS.find(s => s.key === activeKey)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Items</h4>
              <p className="text-xs text-gray-500">{HERO_KEYS.find(s => s.key === activeKey)?.hint}</p>
            </div>
            <Button onClick={addItem}>Add Item</Button>
          </div>

          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input value={it.title || ''} onChange={(e) => { const n=[...items]; n[idx].title=e.target.value; setItems(n) }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <Input value={it.subtitle || ''} onChange={(e) => { const n=[...items]; n[idx].subtitle=e.target.value; setItems(n) }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Badge / Button Text</label>
                    <Input value={it.badge || ''} onChange={(e) => { const n=[...items]; n[idx].badge=e.target.value; setItems(n) }} placeholder="Shop Now" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Link (href)</label>
                    <Input value={it.href || ''} onChange={(e) => { const n=[...items]; n[idx].href=e.target.value; setItems(n) }} placeholder="/mattresses" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <Input type="number" value={it.position ?? idx} onChange={(e) => { const n=[...items]; n[idx].position=Number(e.target.value); setItems(n) }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <div className="space-y-2">
                      <Input value={it.image || ''} onChange={(e) => { const n=[...items]; n[idx].image=e.target.value; setItems(n) }} placeholder="Paste image URL or upload below" />
                      <input type="file" accept="image/*" onChange={(e) => { const f=e.target.files?.[0]; if (f) handleImageUpload(f, idx) }} />
                      {uploadingIndex === idx && <p className="text-xs text-gray-500">Uploading...</p>}
                      {it.image && (<img src={it.image} alt="preview" className="h-16 w-24 object-cover rounded border" />)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="text-red-600" onClick={() => removeItem(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={save} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Saving...' : 'Save Hero Section'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


