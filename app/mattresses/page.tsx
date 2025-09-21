import { Suspense } from "react"
import { ProductsLayout } from "@/components/products-layout"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mattresses - Premium Quality Beds | Bedora Living',
  description: 'Shop premium mattresses at Bedora Living. Memory foam, pocket sprung, and hybrid mattresses with free delivery and 14-night trial.',
}

export default function MattressesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ProductsLayout category="mattresses" />
      </Suspense>
    </div>
  )
}
