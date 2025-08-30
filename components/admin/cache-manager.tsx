"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2, Database, HardDrive } from 'lucide-react'
import { cacheManager } from '@/lib/utils'

export function CacheManager() {
  const [isClearing, setIsClearing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const clearHomepageCache = async () => {
    setIsClearing(true)
    try {
      cacheManager.clear('homepage_content_cache')
      // Console log removed for performance
      
      // Force a page refresh to reload fresh data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error clearing cache:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const clearAllCaches = async () => {
    setIsClearing(true)
    try {
      cacheManager.clearAll()
      // Console log removed for performance
      
      // Force a page refresh to reload fresh data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error clearing all caches:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const refreshHomepageContent = async () => {
    setIsRefreshing(true)
    try {
      // Clear homepage cache
      cacheManager.clear('homepage_content_cache')
      
      // Fetch fresh data
      const response = await fetch('/api/homepage-content')
      if (response.ok) {
        const data = await response.json()
        // Console log removed for performance
        
        // Save to cache
        cacheManager.set('homepage_content_cache', data)
        
        // Force a page refresh to show new content
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error('Error refreshing content:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Cache Management
        </CardTitle>
        <CardDescription>
          Manage homepage content caching for better performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={refreshHomepageContent}
            disabled={isRefreshing}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Homepage Content'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Fetches fresh data from database and updates cache
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={clearHomepageCache}
            disabled={isClearing}
            className="w-full"
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear Homepage Cache'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Clears cached homepage content (will reload from database)
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={clearAllCaches}
            disabled={isClearing}
            className="w-full"
            variant="destructive"
          >
            <Database className="w-4 h-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear All Caches'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Clears all application caches (use with caution)
          </p>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Cache Benefits:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Faster homepage loading</li>
            <li>• Reduced database queries</li>
            <li>• Better user experience</li>
            <li>• Automatic background updates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
