export const metadata = { title: 'Careers - Bedora Living' }

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Careers</h1>
          <p className="text-gray-600 mt-2">Join our growing team in the United Kingdom.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <p className="text-gray-700">We’re always looking for passionate people in customer support, operations, logistics, and engineering. Send your CV to <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>.</p>
      </section>
    </main>
  )
}


