export const metadata = { title: 'Blog & Guides - Bedora Living' }

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Blog & Guides</h1>
          <p className="text-gray-600 mt-2">Sleep tips, buying guides, and product news.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="border rounded-lg p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">How to Choose the Right Mattress Firmness</h3>
            <p className="text-gray-700 mt-2 text-sm">A quick guide to finding your ideal comfort level based on sleeping position and body type.</p>
          </article>
          <article className="border rounded-lg p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">Sofa Materials Explained</h3>
            <p className="text-gray-700 mt-2 text-sm">Learn the differences between fabric, leather, and performance materials.</p>
          </article>
        </div>
      </section>
    </main>
  )
}


