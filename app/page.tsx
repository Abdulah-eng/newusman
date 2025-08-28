"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { MattressFinderPromo } from "@/components/mattress-finder-promo"
import { TrendingSection } from "@/components/trending-section"

import { IdeasGuides } from "@/components/ideas-guides"
import { CategoryFilterCards } from "@/components/category-filter-cards"
import { ReviewSection } from "@/components/review-section"
import { DealOfTheDay } from "@/components/deal-of-the-day"
import { MattressTypesSection } from "@/components/mattress-types-section"
import { OurSofaTypesSection } from "@/components/our-sofa-types-section"
import { BedroomInspirationSection } from "@/components/bedroom-inspiration-section"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Silentnight mattresses')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section with database content */}
      <HeroSection onCategoryChange={setSelectedCategory} />
      
      <FeaturedProducts selectedCategory={selectedCategory} />
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
    </div>
  )
}
