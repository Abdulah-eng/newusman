import { ProductDetailCard } from "@/components/product-detail-card"

export default function ProductDemoPage() {
  const demoProduct = {
    id: 1,
    name: "Bedora Living Premium",
    brand: "Bedora Living",
    brandColor: "orange",
    badge: "Best Seller",
    badgeColor: "orange",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 127,
    firmness: "MEDIUM FIRM",
    firmnessLevel: 7,
    features: ["Bamboo cover", "Motion isolation", "Edge support", "CertiPUR foam"],
    originalPrice: 499.00,
    currentPrice: 424.15,
    savings: 74.85,
    freeDelivery: "Mon, 11 Aug",
    setupService: true,
    setupCost: 49,
    certifications: ["OEKO-TEX", "CertiPUR-US", "Made in UK", "14-Night Trial", "10-Year Warranty"],
    sizes: ["Single", "Double", "King", "Super King"],
    selectedSize: "King",
    monthlyPrice: 35,
    images: ["https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop"]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetailCard product={demoProduct} />
    </div>
  )
}
