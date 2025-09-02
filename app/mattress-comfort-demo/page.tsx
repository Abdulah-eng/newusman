import { MattressComfortLayers } from '@/components/mattress-comfort-layers'

export default function MattressComfortDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Mattress Comfort Layers Demo
          </h1>
          <p className="text-lg text-gray-600 text-center mt-4">
            Discover the innovative comfort technology in our premium mattresses
          </p>
        </div>
      </div>
      
      <MattressComfortLayers />
      
      <div className="py-16 bg-gradient-to-r from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Experience the Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our mattresses are engineered with precision to provide the perfect balance of comfort and support. 
            Each layer is carefully designed to enhance your sleep experience.
          </p>
        </div>
      </div>
    </div>
  )
}
