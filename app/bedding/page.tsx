import { Suspense } from "react"
import { ProductsLayout } from "@/components/products-layout"

export default function BeddingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ProductsLayout category="bedding" />
      </Suspense>
    </div>
  )
}
