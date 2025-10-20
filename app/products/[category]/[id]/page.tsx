import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Image from "next/image"
import { Star } from "lucide-react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { ProductPageSkeleton } from "@/components/product-page-skeleton"
import { CardLoadingText } from "@/components/loading-text"
import type { Metadata } from 'next'
import { ProductStructuredData } from '@/components/product-structured-data'

// Lazy load heavy components
const ProductDetailHappy = dynamic(() => import("@/components/product-detail-happy").then(mod => ({ default: mod.ProductDetailHappy })), {
  loading: () => <CardLoadingText className="h-96" />
})

const ProductGridNew = dynamic(() => import("@/components/product-grid-new").then(mod => ({ default: mod.ProductGridNew })), {
  loading: () => <CardLoadingText className="h-64" />
})

// Lazy load components for better performance
const DynamicReviewsSection = dynamic(() => import("@/components/dynamic-reviews-section").then(mod => ({ default: mod.DynamicReviewsSection })), {
  loading: () => <div className="mt-10 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 to-blue-50">
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
})

interface PageProps {
  params: { category: string; id: string }
}

// Generate dynamic metadata for product pages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params
  
  try {
    // Fetch product data for metadata
    const hdrs = await headers()
    const host = hdrs.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`
    
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.log('Metadata generation - API call failed:', response.status, response.statusText)
      return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Bedora Living`,
        description: `Shop premium ${category} at Bedora Living. Quality furniture and bedding for your home.`
      }
    }
    
    const data = await response.json()
    const product = data.product // The API returns { product: ... }
    
    console.log('Metadata generation - Product data:', {
      hasProduct: !!product,
      productName: product?.name,
      productDescription: product?.description,
      category
    })
    
    // Ensure we have a valid product name
    const productName = product?.name || 'Product'
    
    return {
      title: `${productName} - Bedora Living`,
      description: product?.description || `Shop ${productName} at Bedora Living. Premium quality ${category} with free delivery.`,
      openGraph: {
        title: `${productName} - Bedora Living`,
        description: product?.description || `Shop ${productName} at Bedora Living. Premium quality ${category} with free delivery.`,
        images: product?.images && product.images.length > 0 ? [product.images[0]] : [],
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Bedora Living`,
      description: `Shop premium ${category} at Bedora Living. Quality furniture and bedding for your home.`
    }
  }
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
        {/* SEO JSON-LD (client-wrapped to avoid React version mismatch) */}
        <ProductStructuredData
          breadcrumb={[
            { position: 1, name: 'Home', item: '/' },
            { position: 2, name: productDetail.category || 'Products', item: `/${productDetail.category || 'products'}` },
            { position: 3, name: productDetail.name, item: `/products/${productDetail.category}/${productDetail.id}` },
          ]}
          name={productDetail.name}
          images={productDetail.images && productDetail.images.length > 0 ? productDetail.images : [productDetail.image]}
          description={productDetail.longDescription || productDetail.shortDescription || 'Premium product from Bedora Living'}
          brandName={productDetail.brand || 'Bedora'}
          ratingValue={productDetail.rating || 4.5}
          reviewCount={productDetail.reviewCount || 100}
          price={String(productDetail.currentPrice || 0)}
          url={`/products/${productDetail.category}/${productDetail.id}`}
        />
        <ProductDetailHappy product={productDetail} />




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
          <DynamicReviewsSection 
            productId={productDetail.id}
            productName={productDetail.name}
            productRating={productDetail.rating}
            productReviewCount={productDetail.reviewCount}
          />
        </Suspense>
      </div>
      <ProductGridNew products={alsoViewed} title="Customers also viewed" />
    </div>
  )
}


