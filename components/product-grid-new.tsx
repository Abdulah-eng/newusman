"use client"

import { ProductCard } from "@/components/product-card"

interface ProductGridNewProps {
  products: any[]
  title?: string
}

export function ProductGridNew({ products, title }: ProductGridNewProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
