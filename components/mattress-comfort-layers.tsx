"use client"

import { Bed } from 'lucide-react'

export function MattressComfortLayers() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            Discover the Comfort Layers in Our Mattress
          </h2>
          <p className="text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed">
            An ideal choice for budget-conscious shoppers and under 120lb sleepers. Perfect for children, bunk beds, or anyone needing a basic yet medium-firm mattress. It features a 1" Comfort Foam layer sewn into the quilt and an additional 1.5" layer of Comfort Foam, supported by a 504 15 Gauge SPECTRUM Coil innerspring unit. This entry-level mattress offers firm support, catering to those who prefer a solid sleeping surface.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - 3D Mattress Cutaway Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
              <div className="relative w-full h-80 bg-white rounded-xl overflow-hidden border-2 border-gray-200">
                {/* Mattress Cover/Quilt Layer */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200">
                  <div className="absolute top-1 left-1 right-1 bottom-0 bg-gray-100 rounded-sm"></div>
                  {/* Quilt stitching pattern */}
                  <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-300"></div>
                  <div className="absolute top-4 left-2 right-2 h-0.5 bg-gray-300"></div>
                  <div className="absolute top-6 left-2 right-2 h-0.5 bg-gray-300"></div>
                </div>
                
                {/* Layer 1: Quilt with Comfort Foam */}
                <div className="absolute top-8 left-0 right-0 h-12 bg-blue-50 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    1
                  </div>
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                    1" Comfort Foam
                  </div>
                </div>
                
                {/* Layer 2: Comfort Foam */}
                <div className="absolute top-20 left-0 right-0 h-16 bg-white relative border-t border-gray-200">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    2
                  </div>
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                    1.5" Comfort Foam
                  </div>
                </div>
                
                {/* Layer 3: Support System - Coils */}
                <div className="absolute top-36 left-0 right-0 bottom-0 bg-gray-100 relative">
                  <div className="absolute left-4 top-8 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    3
                  </div>
                  <div className="absolute left-16 top-8 text-sm font-medium text-gray-700">
                    504 15 Gauge SPECTRUM Coil Unit
                  </div>
                  
                  {/* Coil pattern */}
                  <div className="absolute inset-0 flex flex-wrap justify-center items-center p-4">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="w-3 h-3 bg-gray-300 rounded-full mx-1 my-1"></div>
                    ))}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i + 8} className="w-3 h-3 bg-gray-400 rounded-full mx-1 my-1"></div>
                    ))}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i + 16} className="w-3 h-3 bg-gray-300 rounded-full mx-1 my-1"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Layer Details */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quilt:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    1" Comfort Foam Sewn in the Quilt
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comfort Layers:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    1.5" Layer of Comfort Foam
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Support System:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    504 15 Gauge SPECTRUM Coil Unit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Firmness Scale */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Bed className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Firmness Scale</h3>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Scale Bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-full"></div>
              </div>
              
              {/* Scale Markers */}
              <div className="flex justify-between mt-2">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">1-3</div>
                  <div className="text-xs text-gray-600">Plush</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">3-4</div>
                  <div className="text-xs text-gray-600">Medium-Plush</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">4-6</div>
                  <div className="text-xs text-gray-600">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 font-bold">6-8</div>
                  <div className="text-xs text-blue-600 font-semibold">Medium-Firm</div>
                  <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-1"></div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">8-9</div>
                  <div className="text-xs text-gray-600">Firm</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">9-10</div>
                  <div className="text-xs text-gray-600">Extra-firm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
