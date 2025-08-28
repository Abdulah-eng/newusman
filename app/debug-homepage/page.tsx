"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DebugHomepage() {
  const [databaseContent, setDatabaseContent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('order_index')

      if (error) {
        console.error('Error fetching database content:', error)
        alert('Error: ' + error.message)
        return
      }

      console.log('🔍 Debug - Raw database content:', data)
      setDatabaseContent(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Homepage Content Database Debug</h1>
        
        <div className="mb-6">
          <button
            onClick={checkDatabase}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Database Content'}
          </button>
        </div>

        {databaseContent && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Raw Database Content</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(databaseContent, null, 2)}
              </pre>
            </div>

            {databaseContent.map((item: any) => (
              <div key={item.section} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Section: {item.section}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Metadata:</h4>
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Order:</strong> {item.order_index}</p>
                    <p><strong>Created:</strong> {item.created_at}</p>
                    <p><strong>Updated:</strong> {item.updated_at}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Content Structure:</h4>
                    <p><strong>Type:</strong> {typeof item.content}</p>
                    <p><strong>Keys:</strong> {item.content ? Object.keys(item.content).join(', ') : 'null'}</p>
                    {item.section === 'mattresses' && (
                      <div className="mt-2">
                        <p><strong>Product IDs:</strong> {item.content?.productIds?.length || 0}</p>
                        <p><strong>Mattress Cards:</strong> {item.content?.mattressCards?.length || 0}</p>
                        <p><strong>Description:</strong> {item.content?.description ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Content Details:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                    {JSON.stringify(item.content, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
