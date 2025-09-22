"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Settings {
  enabled: boolean
  title: string
  subtitle: string
  description: string
  button_text: string
  show_delay_ms: number
}

export default function PromotionalPopupAdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/promotional-popup', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load')
        setSettings(json.settings)
      } catch (e: any) {
        toast({ title: 'Error', description: e.message || 'Failed to load settings', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const save = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/promotional-popup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setSettings(json.settings)
      toast({ title: 'Saved', description: 'Promotional popup settings updated.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to save settings', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading settings...
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Promotional Popup Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Title</span>
              <Input value={settings.title || ''} onChange={e => setSettings({ ...settings, title: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Subtitle</span>
              <Input value={settings.subtitle || ''} onChange={e => setSettings({ ...settings, subtitle: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-gray-700">Description</span>
            <Textarea value={settings.description || ''} onChange={e => setSettings({ ...settings, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Button Text</span>
              <Input value={settings.button_text || ''} onChange={e => setSettings({ ...settings, button_text: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Show Delay (ms)</span>
              <Input type="number" value={settings.show_delay_ms} onChange={e => setSettings({ ...settings, show_delay_ms: Number(e.target.value) })} />
            </label>
          </div>
          <div className="flex justify-end">
            <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


