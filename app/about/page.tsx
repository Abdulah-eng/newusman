export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MattressKing</h1>
          <p className="text-xl text-gray-700">Your trusted partner for quality sleep solutions</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            MattressKing has been serving Oklahoma and surrounding areas with premium mattresses, 
            adjustable bases, and sleep accessories for over 20 years. We're committed to helping 
            you find the perfect sleep solution that fits your comfort preferences and budget.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Our team of sleep experts is here to guide you through the selection process, 
            ensuring you make an informed decision that will improve your sleep quality for years to come.
          </p>
        </div>
      </div>
    </div>
  )
}
