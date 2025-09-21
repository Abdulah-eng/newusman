"use client"

import { Suspense } from "react"
import { ProductsLayout } from "@/components/products-layout"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beds - Premium Bed Frames & Headboards | Bedora Living',
  description: 'Shop premium beds and bed frames at Bedora Living. Wooden, metal, and upholstered beds with free delivery across the UK.',
}

export default function BedsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ProductsLayout category="beds" />
      </Suspense>
    </div>
  )
}
