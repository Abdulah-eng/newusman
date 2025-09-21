import { Suspense } from "react"
import { ProductsLayout } from "@/components/products-layout"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sofas - Premium Living Room Furniture | Bedora Living',
  description: 'Shop premium sofas and living room furniture at Bedora Living. 2-seater, 3-seater, and corner sofas with free delivery.',
}

export default function SofasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ProductsLayout category="sofas" />
      </Suspense>
    </div>
  )
}
