import { Suspense } from "react"
import { ProductsLayout } from "@/components/products-layout"

export default function AdjustableBasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ProductsLayout category="adjustable-bases" />
      </Suspense>
    </div>
  )
}
