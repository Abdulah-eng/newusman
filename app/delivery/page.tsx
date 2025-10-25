export const metadata = { title: 'Delivery Information - Bedora Living' }

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Delivery Information</h1>
          <p className="text-gray-600 mt-2">Fast, reliable delivery across the United Kingdom.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Standard Delivery</h2>
          <p className="text-gray-700 mt-2">Free delivery. Typical delivery time: 3–7 working days.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Two-Man Room Delivery</h2>
          <p className="text-gray-700 mt-2">Available for larger items like beds and sofas. Our team will place items in your room of choice.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tracking</h2>
          <p className="text-gray-700 mt-2">You’ll receive tracking updates by email. For questions, contact <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>.</p>
        </div>
      </section>
    </main>
  )
}


