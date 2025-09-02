import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

export default function MattressGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mattress Buying Guide</h1>
          <p className="text-xl text-gray-700">Everything you need to know to choose the perfect mattress</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Choose the Right Mattress</h2>
            <p className="text-gray-600 mb-6">
              Choosing the right mattress is one of the most important decisions you'll make for your sleep health. 
              Our comprehensive guide will help you understand the different types, firmness levels, and features 
              to consider when making your selection.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mattress Types</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• <strong>Memory Foam:</strong> Contours to your body, excellent pressure relief</li>
              <li>• <strong>Innerspring:</strong> Traditional support with good airflow</li>
              <li>• <strong>Hybrid:</strong> Combines the best of foam and spring technology</li>
              <li>• <strong>Latex:</strong> Natural, durable, and responsive</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Firmness Levels</h3>
            <p className="text-gray-600 mb-4">
              Firmness is a personal preference that depends on your sleep position, body weight, and comfort needs.
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• <strong>Soft (3-4):</strong> Plush feel, great for side sleepers</li>
              <li>• <strong>Medium (5-6):</strong> Balanced support, works for most sleepers</li>
              <li>• <strong>Firm (7-8):</strong> Solid support, ideal for back and stomach sleepers</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sleep Position Considerations</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• <strong>Side Sleepers:</strong> Look for medium to soft mattresses with good pressure relief</li>
              <li>• <strong>Back Sleepers:</strong> Choose medium to firm mattresses for proper spinal alignment</li>
              <li>• <strong>Stomach Sleepers:</strong> Opt for firm mattresses to prevent sinking</li>
              <li>• <strong>Combination Sleepers:</strong> Medium firmness usually works best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
