"use client"

import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'

export default function AddProductPage() {
  const router = useRouter()

  return (
    <ProductForm
      onClose={() => router.push('/admin/products')}
      onSubmit={() => router.push('/admin/products')}
    />
  )
}
