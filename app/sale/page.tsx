import { ProductsLayout } from "@/components/products-layout"

export default function SalePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsLayout category="sale" />
    </div>
  )
}
