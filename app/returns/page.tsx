export const metadata = { title: 'Returns & Exchanges - Bedora Living' }

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Returns & Exchanges</h1>
          <p className="text-gray-600 mt-2">Hassle-free returns within 30 days on eligible items.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Eligibility</h2>
          <p className="text-gray-700 mt-2">Items must be unused, in original packaging, and include proof of purchase. Mattresses may require a minimum trial period.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">How to Start a Return</h2>
          <p className="text-gray-700 mt-2">Email <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a> with your order number and reason for return. We’ll guide you through the next steps.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Refunds</h2>
          <p className="text-gray-700 mt-2">Refunds are processed to the original payment method within 5–10 working days after inspection.</p>
        </div>
      </section>
    </main>
  )
}


