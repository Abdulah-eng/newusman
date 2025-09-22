export const metadata = { title: 'Terms of Service - Bedora Living' }

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Please read these terms carefully before using Bedora Living.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">Purchases</h2>
        <p className="text-gray-700 mt-2">By placing an order, you agree to provide accurate information and to the pricing and availability at the time of checkout.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Returns</h2>
        <p className="text-gray-700 mt-2">Items can be returned according to our Returns Policy. Please see Returns & Exchanges for details.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
        <p className="text-gray-700 mt-2">For questions about these terms, contact <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>.</p>
      </section>
    </main>
  )
}


