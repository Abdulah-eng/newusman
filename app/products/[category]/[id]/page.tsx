import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Image from "next/image"
import { Check, Star } from "lucide-react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { ProductPageSkeleton } from "@/components/product-page-skeleton"

// Lazy load heavy components
const ProductDetailHappy = dynamic(() => import("@/components/product-detail-happy").then(mod => ({ default: mod.ProductDetailHappy })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
})

const ProductGridNew = dynamic(() => import("@/components/product-grid-new").then(mod => ({ default: mod.ProductGridNew })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

// Lazy load components for better performance
const LazyReviewsSection = ({ productDetail }: { productDetail: any }) => (
  <div className="mt-10 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 to-blue-50">
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < (productDetail.rating || 4) ? "text-orange-500 fill-current" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="text-base sm:text-lg font-semibold text-gray-700">{productDetail.rating || 4.0}</span>
        </div>
        <span className="text-gray-500">•</span>
        <span className="text-sm sm:text-base text-gray-600">Based on {productDetail.reviewCount || 0} reviews</span>
      </div>
      <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Real customers share their experience with the {productDetail.name}</p>
    </div>

    {/* Review Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Review 1 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">S</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Sarah M.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 5 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Absolutely love this mattress! The medium-firm feel is perfect and the pocket springs provide amazing support. I wake up feeling refreshed every morning."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 2 weeks ago</div>
      </div>

      {/* Review 2 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">M</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Michael R.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 4 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Great value for money! The memory foam layer is so comfortable and the delivery was super fast. My back pain has significantly improved."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 1 month ago</div>
      </div>

      {/* Review 3 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">E</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Emma L.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 5 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Perfect mattress for our guest room! Guests always compliment how comfortable it is. The quality is excellent and it looks great too."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 3 weeks ago</div>
      </div>

      {/* Review 4 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">D</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">David K.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 4 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Switched from a much more expensive mattress and honestly prefer this one! The pocket springs are fantastic and it stays cool throughout the night."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 2 months ago</div>
      </div>

      {/* Review 5 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">L</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Lisa P.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 5 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Best mattress I've ever owned! The combination of pocket springs and memory foam is perfect. No more tossing and turning at night."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 1 week ago</div>
      </div>

      {/* Review 6 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center">
            <span className="text-white font-semibold text-base sm:text-lg">J</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">James W.</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 4 ? "text-orange-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4">"Excellent mattress for the price! The quality is outstanding and it's incredibly comfortable. Highly recommend to anyone looking for a great mattress."</p>
        <div className="text-xs sm:text-sm text-gray-500">Verified Purchase • 1 month ago</div>
      </div>
    </div>

    {/* Review Stats */}
    <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">98%</div>
        <div className="text-xs sm:text-sm text-gray-600">Would Recommend</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{productDetail.rating || 4.0}/5</div>
        <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{productDetail.reviewCount || 0}</div>
        <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">5★</div>
        <div className="text-xs sm:text-sm text-gray-600">Most Common</div>
      </div>
    </div>

    {/* Write Review Button */}
    <div className="text-center mt-6 sm:mt-8">
      <button 
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Write a Review
      </button>
    </div>
  </div>
)

interface PageProps {
  params: { category: string; id: string }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, id } = await params

  // Resolve a robust base URL for server-side fetches (works in dev/prod)
  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.trim().length > 0)
    ? process.env.NEXT_PUBLIC_BASE_URL
    : `${protocol}://${host}`

  // OPTIMIZATION: Only fetch essential data initially
  const [productResponse, relatedProductsResponse] = await Promise.allSettled([
    fetch(`${baseUrl}/api/products/${id}`),
    fetch(`${baseUrl}/api/products/category/${category}`)
  ])

  // Handle product data
  let product: any = null
  if (productResponse.status === 'fulfilled' && productResponse.value.ok) {
    try {
      const data = await productResponse.value.json()
      product = data.product
    } catch (error) {
      console.error('Error parsing product data:', error)
    }
  }

  // Variants are now included in the main product query

  if (!product) {
    notFound()
  }

  // Show skeleton while loading
  if (!product.id) {
    return <ProductPageSkeleton />
  }

  // Handle related products
  let alsoViewed: any[] = []
  if (relatedProductsResponse.status === 'fulfilled' && relatedProductsResponse.value.ok) {
    try {
      const data = await relatedProductsResponse.value.json()
      alsoViewed = data.products?.filter((p: any) => String(p.id) !== String(id)).slice(0, 8) || []
    } catch (error) {
      console.error('Error parsing related products:', error)
    }
  }

  // Transform the product data to match ProductDetailCard interface
  const productDetail = {
    id: product.id,
    name: product.name || 'Unknown Product',
    brand: product.brand || 'Unknown Brand',
    brandColor: product.brandColor || 'blue',
    badge: product.badge || (product.on_sale ? 'On Sale' : ''),
    badgeColor: product.badgeColor || (product.on_sale ? 'orange' : 'gray'),
    image: (product.images && product.images[0]) || product.main_image || product.image || '/mattress-image.svg',
    rating: Number(product.rating || 4.0),
    reviewCount: Number(product.reviewCount || product.review_count || 50),
    firmness: product.firmness || product.firmness_description || 'Medium',
    firmnessLevel: Number(product.firmnessLevel || product.firmness_level || 6),
    features: product.features || ['Premium Quality'],
    originalPrice: Number(product.originalPrice || product.original_price || 0),
    currentPrice: Number(product.currentPrice || product.current_price || 0),
    savings: Number(product.savings || Math.max(Number(product.originalPrice || product.original_price || 0) - Number(product.currentPrice || product.current_price || 0), 0)),
    freeDelivery: product.freeDelivery || (product.free_delivery ? 'Free' : 'Tomorrow'),
    setupService: Boolean(product.setupService !== undefined ? product.setupService : product.setup_service),
    setupCost: product.setupCost !== undefined ? Number(product.setupCost) : (product.setup_cost ? Number(product.setup_cost) : undefined),
    certifications: product.certifications || ['OEKO-TEX', 'Made in UK'],
    sizes: product.sizes || ['Single', 'Double', 'King', 'Super King'],
    selectedSize: product.selectedSize || product.variants?.[0]?.size || product.sizes?.[0] || 'Queen',
    monthlyPrice: product.monthlyPrice !== undefined ? Number(product.monthlyPrice) : (product.monthly_price ? Number(product.monthly_price) : Math.floor(Number(product.currentPrice || product.current_price || 0) / 12)),
    images: product.images || [],
    variants: product.variants || [],
    category: product.category || category,
    type: product.type || product.mattress_type || product.bed_type || product.sofa_type || product.pillow_type || product.topper_type || product.bunk_bed_type || 'Standard',
    size: product.size || product.sizes?.[0] || 'Queen',
    comfortLevel: product.comfortLevel || product.firmness_description || 'Medium',
    // Characteristics from DB → pass through to component (used by sliders)
    firmnessScale: product.firmnessScale || product.firmness_scale,
    supportLevel: product.supportLevel || product.support_level,
    pressureReliefLevel: product.pressureReliefLevel || product.pressure_relief_level,
    airCirculationLevel: product.airCirculationLevel || product.air_circulation_level,
    durabilityLevel: product.durabilityLevel || product.durability_level,
    inStore: Boolean(product.inStore !== undefined ? product.inStore : product.in_stock !== false),
    onSale: Boolean(product.onSale !== undefined ? product.onSale : product.on_sale),
    colors: product.colors || [],
    materials: product.materials || [],
    // Map the database fields correctly
    headline: product.headline || null,
    dimensions: product.dimensions || {},
    dispatchTime: product.dispatchTime || product.dispatch_time,
    reasonsToBuy: product.customReasons || product.custom_reasons || [],
    // Restore marketing reasons arrays for "Features you'll love"
    reasonsToLove: (product.product_reasons_to_love?.map((r: any) => r.reason_text) || product.reasonsToLove || product.reasons_to_love || []),
    reasonsToLoveDescriptions: (product.product_reasons_to_love?.map((r: any) => r.description).filter(Boolean) || product.feature_descriptions || []),
    reasonsToLoveSmalltext: product.reasonsToLoveSmalltext || [],
    reasonsToLoveIcons: (product.product_reasons_to_love?.map((r: any) => r.icon) || product.feature_icons || []),
    customReasons: product.customReasons || product.custom_reasons || [],
    customReasonsDescriptions: (product.custom_reasons || product.customReasons || []).map((r: any) => r?.description).filter(Boolean),
    promotionalOffers: product.promotionalOffers || [],
    // Map the database fields correctly for FAQs, warranty, and description
    productQuestions: product.faqs?.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer
    })) || [],
    warrantyInfo: product.warrantySections?.map((warranty: any) => ({
      heading: warranty.heading,
      content: warranty.content
    })) || {},
    careInstructions: product.careInstructions || product.care_instructions || '',
    stockQuantity: product.stockQuantity || product.stock_quantity,
    inStock: Boolean(product.inStock !== undefined ? product.inStock : product.in_stock !== false),
    shortDescription: product.shortDescription || product.short_description,
    longDescription: product.longDescription || product.long_description,
    // Add the description paragraphs from database
    descriptionParagraphs: product.descriptionParagraphs?.map((para: any) => ({
      heading: para.heading,
      content: para.content,
      image: para.image
    })) || [],
    // Add dimension images for the dimensions section
    dimensionImages: product.dimensionImages?.map((img: any) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      fileName: img.fileName,
      fileSize: img.fileSize,
      fileType: img.fileType,
      sortOrder: img.sortOrder
    })) || [],
    // Add free gift fields
    badges: product.badges || [],
    free_gift_product_id: product.free_gift_product_id || null,
    free_gift_enabled: product.free_gift_enabled || false,
    free_gift_product_name: product.free_gift_product_name || null,
    free_gift_product_image: product.free_gift_product_image || null,
    // Add warranty delivery line
    warrantyDeliveryLine: product.warrantyDeliveryLine || null,
    // Add trial information
    trialInformation: product.trialInformation || null,
    trialInformationHeading: (product as any).trialInformationHeading || null,
    // Add important notices
    importantNotices: product.importantNotices?.map((notice: any) => ({
      noticeText: notice.noticeText,
      sortOrder: notice.sortOrder
    })) || []
  }

  // Debug logging to check what data we're getting
  console.log('Product Detail Debug:', {
    descriptionParagraphs: productDetail.descriptionParagraphs,
    productQuestions: productDetail.productQuestions,
    warrantyInfo: productDetail.warrantyInfo,
    dimensions: productDetail.dimensions,
    dimensionImages: productDetail.dimensionImages
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProductDetailHappy product={productDetail} />



        {/* Reasons to buy */}
        {(product.reasonsToBuy || product.reasons_to_buy)?.length > 0 && (
          <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Reasons to buy</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(product.reasonsToBuy || product.reasons_to_buy || []).map((reason: string, idx: number) => (
                <li key={`reason-${idx}`} className="flex items-start gap-2 text-blue-900/80">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="font-medium">{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Four blocks below hero with image + content */}
        {(product.below_hero_sections)?.length > 0 && (
          <section className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(product.below_hero_sections || []).slice(0,4).map((block: any, idx: number) => (
                <div key={`block-${idx}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {block?.image && (
                    <div className="relative h-40 bg-gray-100">
                      <Image src={block.image} alt={block?.title || `Block ${idx+1}`} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    {block?.title && <h4 className="font-semibold text-blue-900 mb-2">{block.title}</h4>}
                    {block?.content && <p className="text-blue-900/70 text-sm leading-relaxed">{block.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Reviews Section */}
        <Suspense fallback={<div>Loading reviews...</div>}>
          <LazyReviewsSection productDetail={productDetail} />
        </Suspense>
      </div>
      <ProductGridNew products={alsoViewed} title="Customers also viewed" />
    </div>
  )
}


