"use client"

import { useHomePageContent } from '@/hooks/use-homepage-content'

export default function TestHomePage() {
  const { content, loading, error } = useHomePageContent()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Homepage Content...</h1>
          <p className="text-gray-600">Fetching data from database...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Content</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check your database connection and ensure the homepage_content table exists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Homepage Content Test</h1>
        
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.hero, null, 2)}
            </pre>
          </div>

          {/* Image Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Image Cards</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.image_cards, null, 2)}
            </pre>
          </div>

          {/* Quiz Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quiz Section</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.quiz, null, 2)}
            </pre>
          </div>

          {/* Deal of Day */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Deal of Day</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.deal_of_day, null, 2)}
            </pre>
          </div>

          {/* Mattresses Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Mattresses Section</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.mattresses, null, 2)}
            </pre>
          </div>

          {/* Bedroom Inspiration */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bedroom Inspiration</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.bedroom_inspiration, null, 2)}
            </pre>
          </div>

          {/* Sofa Types */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sofa Types</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(content.sofa_types, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
