export const metadata = { title: 'Privacy Policy - Bedora Living' }

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Your privacy matters to us at Bedora Living.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
        <p className="text-gray-700 mt-2">We collect information you provide when creating an account, placing orders, subscribing to our newsletter, or contacting support. We also collect usage analytics to improve site performance.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">How We Use Your Information</h2>
        <p className="text-gray-700 mt-2">We use your information to process orders, provide customer support, personalise your experience, and improve our services. We do not sell your data.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Cookies</h2>
        <p className="text-gray-700 mt-2">Cookies help keep your basket, remember preferences, and measure usage. You can control cookies in your browser settings.</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
        <p className="text-gray-700 mt-2">Questions? Email <a className="text-orange-600 hover:underline" href="mailto:hello@bedoraliving.co.uk">hello@bedoraliving.co.uk</a>. We are based in the United Kingdom.</p>

        <p className="text-sm text-gray-500 mt-10">Last updated: {new Date().getFullYear()}</p>
      </section>
    </main>
  )
}


