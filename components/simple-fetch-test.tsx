"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function SimpleFetchTest() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testFetch = async () => {
    setLoading(true)
    setError(null)
    try {
      // Starting fetch
      const response = await fetch('/api/homepage-content')
              // Response received
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
              // Data received
      setData(result)
    } catch (err) {
      console.error('🧪 SimpleFetchTest: Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testFetch()
  }, [])

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded m-4">
      <h2 className="text-lg font-bold mb-2">Simple Fetch Test</h2>
      
      <div className="mb-4">
        <Button onClick={testFetch} disabled={loading} size="sm">
          {loading ? 'Testing...' : 'Test Fetch'}
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Data Received:</strong> {data ? 'Yes' : 'No'}</p>
        <p><strong>Data Keys:</strong> {data ? Object.keys(data).join(', ') : 'None'}</p>
        
        {data && (
          <div>
            <strong>Data:</strong>
            <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
