export const metadata = { title: 'Press & Media - Bedora Living' }

export default function PressPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Press & Media</h1>
          <p className="text-gray-600 mt-2">Media enquiries and brand assets.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <p className="text-gray-700">For media enquiries, contact <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>.</p>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900">Brand Assets</h2>
          <p className="text-gray-700 mt-2">Download our logo and guidelines soon. In the meantime, please reach out and we’ll provide assets.</p>
        </div>
      </section>
    </main>
  )
}


