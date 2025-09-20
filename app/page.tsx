import { Suspense } from "react"
import dynamic from "next/dynamic"
import { HomepageSkeleton } from "@/components/homepage-skeleton"

// Lazy load components for better performance
const HeroSection = dynamic(() => import("@/components/hero-section"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
})

const FeaturedProducts = dynamic(() => import("@/components/featured-products").then(mod => ({ default: mod.FeaturedProducts })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const CategoryFilterCards = dynamic(() => import("@/components/category-filter-cards").then(mod => ({ default: mod.CategoryFilterCards })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
})

const MattressFinderPromo = dynamic(() => import("@/components/mattress-finder-promo").then(mod => ({ default: mod.MattressFinderPromo })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
})

const MattressTypesSection = dynamic(() => import("@/components/mattress-types-section").then(mod => ({ default: mod.MattressTypesSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const DealOfTheDay = dynamic(() => import("@/components/deal-of-the-day").then(mod => ({ default: mod.DealOfTheDay })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
})

const IdeasGuides = dynamic(() => import("@/components/ideas-guides").then(mod => ({ default: mod.IdeasGuides })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const BedroomInspirationSection = dynamic(() => import("@/components/bedroom-inspiration-section").then(mod => ({ default: mod.BedroomInspirationSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const OurSofaTypesSection = dynamic(() => import("@/components/our-sofa-types-section").then(mod => ({ default: mod.OurSofaTypesSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const TrendingSection = dynamic(() => import("@/components/trending-section").then(mod => ({ default: mod.TrendingSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const CategoryGrid = dynamic(() => import("@/components/category-grid").then(mod => ({ default: mod.CategoryGrid })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
})

const ReviewSection = dynamic(() => import("@/components/review-section").then(mod => ({ default: mod.ReviewSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Suspense fallback={<HomepageSkeleton />}>
        {/* Hero Section with database content */}
        <HeroSection />
        
        <FeaturedProducts selectedCategory="Silentnight mattresses" />
        <CategoryFilterCards />
        
        <MattressFinderPromo />
        <MattressTypesSection />
        <DealOfTheDay />
        
        <IdeasGuides />
        
        {/* Database-driven sections */}
        <BedroomInspirationSection />
        <OurSofaTypesSection />
        
        <TrendingSection />
        <CategoryGrid />
        <ReviewSection />
      </Suspense>
    </div>
  )
}
