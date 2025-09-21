import CartPageClient from "@/components/cart-page-client"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart - Your Items | Bedora Living',
  description: 'Review your selected items in your shopping cart. Free delivery on orders over £50 at Bedora Living.',
}

export default function CartPage() {
  return <CartPageClient />
}