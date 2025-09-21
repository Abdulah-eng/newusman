import { Suspense } from "react"
import dynamic from "next/dynamic"
import { HomepageSkeleton } from "@/components/homepage-skeleton"
import { CategoryProvider } from "@/lib/category-context"
import { CardLoadingText } from "@/components/loading-text"

// Lazy load components for better performance
const HeroSection = dynamic(() => import("@/components/hero-section"), {
  loading: () => <CardLoadingText className="h-96" />
})

const FeaturedProducts = dynamic(() => import("@/components/featured-products").then(mod => ({ default: mod.FeaturedProducts })), {
  loading: () => <CardLoadingText className="h-64" />
})

const CategoryFilterCards = dynamic(() => import("@/components/category-filter-cards").then(mod => ({ default: mod.CategoryFilterCards })), {
  loading: () => <CardLoadingText className="h-32" />
})

const MattressFinderPromo = dynamic(() => import("@/components/mattress-finder-promo").then(mod => ({ default: mod.MattressFinderPromo })), {
  loading: () => <CardLoadingText className="h-48" />
})

const MattressTypesSection = dynamic(() => import("@/components/mattress-types-section").then(mod => ({ default: mod.MattressTypesSection })), {
  loading: () => <CardLoadingText className="h-64" />
})

const DealOfTheDay = dynamic(() => import("@/components/deal-of-the-day").then(mod => ({ default: mod.DealOfTheDay })), {
  loading: () => <CardLoadingText className="h-96" />
})

const IdeasGuides = dynamic(() => import("@/components/ideas-guides").then(mod => ({ default: mod.IdeasGuides })), {
  loading: () => <CardLoadingText className="h-64" />
})

const BedroomInspirationSection = dynamic(() => import("@/components/bedroom-inspiration-section").then(mod => ({ default: mod.BedroomInspirationSection })), {
  loading: () => <CardLoadingText className="h-64" />
})

const OurSofaTypesSection = dynamic(() => import("@/components/our-sofa-types-section").then(mod => ({ default: mod.OurSofaTypesSection })), {
  loading: () => <CardLoadingText className="h-64" />
})

const TrendingSection = dynamic(() => import("@/components/trending-section").then(mod => ({ default: mod.TrendingSection })), {
  loading: () => <CardLoadingText className="h-64" />
})

const CategoryGrid = dynamic(() => import("@/components/category-grid").then(mod => ({ default: mod.CategoryGrid })), {
  loading: () => <CardLoadingText className="h-48" />
})

const ReviewSection = dynamic(() => import("@/components/review-section").then(mod => ({ default: mod.ReviewSection })), {
  loading: () => <CardLoadingText className="h-64" />
})

export default function HomePage() {
  return (
    <CategoryProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <Suspense fallback={<HomepageSkeleton />}>
          {/* Hero Section with database content */}
          <HeroSection />
          
          <FeaturedProducts />
          <CategoryFilterCards />
          
          <MattressFinderPromo />
          <MattressTypesSection />
          <DealOfTheDay />
          
          {/* Database-driven sections */}
          <BedroomInspirationSection />
          <OurSofaTypesSection />
          
          <TrendingSection />
          <CategoryGrid />
          
          <IdeasGuides />
          <ReviewSection />
        </Suspense>
      </div>
    </CategoryProvider>
  )
}
