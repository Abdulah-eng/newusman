"use client"

import { useState } from 'react'

export default function TestMattressAPI() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productId, setProductId] = useState('')

  const testAPI = async () => {
    if (!productId) {
      setError('Please enter a product ID')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Console log removed for performance
      const response = await fetch(`/api/products/${productId}`)
      // Console log removed for performance
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // Console log removed for performance
      setApiResponse(data)
    } catch (err) {
      console.error('🧪 API Test error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mattress API Test Page</h1>
        
        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product ID (UUID):
              </label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Enter product UUID..."
                className="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={testAPI}
              disabled={loading || !productId}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <h3 className="font-bold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {apiResponse && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Raw API Response</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>

            {apiResponse.product && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Product Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Basic Info:</h4>
                    <p><strong>ID:</strong> {apiResponse.product.id}</p>
                    <p><strong>Name:</strong> {apiResponse.product.name}</p>
                    <p><strong>Headline:</strong> {apiResponse.product.headline}</p>
                    <p><strong>Category:</strong> {apiResponse.product.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Images:</h4>
                    <p><strong>Images Array:</strong> {apiResponse.product.images?.length || 0} images</p>
                    {apiResponse.product.images?.map((img: string, index: number) => (
                      <p key={index} className="text-sm text-gray-600">
                        Image {index + 1}: {img}
                      </p>
                    ))}
                    <p><strong>Image Field:</strong> {apiResponse.product.image || 'Not present'}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Description:</h4>
                  <p><strong>Long Description:</strong> {apiResponse.product.long_description || 'Not present'}</p>
                  <p><strong>Long Description (alt):</strong> {apiResponse.product.longDescription || 'Not present'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
