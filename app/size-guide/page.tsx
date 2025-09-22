export const metadata = { title: 'Size Guide - Bedora Living' }

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Size Guide</h1>
          <p className="text-gray-600 mt-2">Find the perfect fit for your bedroom.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <div>
            <h3 className="font-semibold">UK Mattress Sizes</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>Small Single: 75 x 190 cm</li>
              <li>Single: 90 x 190 cm</li>
              <li>Small Double: 120 x 190 cm</li>
              <li>Double: 135 x 190 cm</li>
              <li>King: 150 x 200 cm</li>
              <li>Super King: 180 x 200 cm</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Tips</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>Measure your room and doorways.</li>
              <li>Consider sleepers’ heights and habits.</li>
              <li>Allow space for bedside furniture.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}


