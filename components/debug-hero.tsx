"use client"

import { useState, useEffect } from 'react'
import { useHomePageContent } from '@/hooks/use-homepage-content'
import { Button } from '@/components/ui/button'

export default function DebugHero() {
  const { content, loading, error } = useHomePageContent()
  const [refreshCount, setRefreshCount] = useState(0)

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1)
    // Force a page reload to test
    window.location.reload()
  }

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded m-4">
      <h2 className="text-lg font-bold mb-2">Debug Hero Component</h2>
      
      <div className="mb-4">
        <Button onClick={handleRefresh} size="sm">
          Refresh Page
        </Button>
        <span className="ml-2 text-sm text-gray-600">Refresh count: {refreshCount}</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Content Type:</strong> {typeof content}</p>
        <p><strong>Content Keys:</strong> {content ? Object.keys(content).join(', ') : 'None'}</p>
        <p><strong>Content Length:</strong> {content ? Object.keys(content).length : 0}</p>
        <p><strong>Content Empty:</strong> {content && Object.keys(content).length === 0 ? 'Yes' : 'No'}</p>
        
        <div>
          <strong>Hero Section:</strong>
          <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto">
            {JSON.stringify(content?.hero, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Full Content:</strong>
          <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto max-h-40">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
