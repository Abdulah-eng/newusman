"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Snowflake, Waves, Weight, ArrowUpFromLine, ChevronRight, Bed, ArrowUp, Crown, Cpu, Cloud, Leaf, Baby, Layers, Zap, ChevronLeft, Circle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

interface PopularCategory {
  name: string
  icon: React.ElementType
  itemsCount: number
  filterKey: string
  filterValue: string
}

interface PopularCategoriesProps {
  onCategorySelect: (filterKey: string, filterValue: string) => void
  category?: string // Add optional category parameter
  selectedFilters?: Record<string, any> // Add selected filters prop
}

// Custom icon for Heavy people category
const HeavyPeopleIcon = () => (
  <div className="relative">
    <Bed className="h-8 w-8 text-orange-500" />
    <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      240+
    </div>
  </div>
)

// Custom icon for Most Support category
const MostSupportIcon = () => (
  <div className="flex flex-col items-center">
    <Waves className="h-8 w-8 text-orange-500 mb-1" />
    <div className="flex gap-1">
      <ArrowUp className="h-4 w-4 text-orange-500" />
      <ArrowUp className="h-4 w-4 text-orange-500" />
      <ArrowUp className="h-4 w-4 text-orange-500" />
    </div>
  </div>
)

// Custom icon for Soft/Medium Comfort with circle above waves
const ComfortIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-orange-500 rounded-full mb-1"></div>
    <Waves className="h-8 w-8 text-orange-500" />
  </div>
)

// Custom icon for Firm Comfort with lines and circle
const FirmComfortIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-orange-500 rounded-full mb-1"></div>
    <div className="flex flex-col gap-1">
      <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
      <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
    </div>
  </div>
)

// Custom icon for Luxury Mattresses
const LuxuryIcon = () => (
  <div className="flex flex-col items-center">
    <Crown className="w-8 h-8 text-orange-500" />
  </div>
);

const HybridIcon = () => (
  <div className="flex flex-col items-center">
    <Cpu className="w-8 h-8 text-orange-500" />
  </div>
);

const FoamIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="flex flex-col gap-1">
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

const LatexIcon = () => (
  <div className="flex flex-col items-center">
    <Leaf className="w-8 h-8 text-orange-500" />
  </div>
);

const KidsIcon = () => (
  <div className="flex flex-col items-center">
    <Baby className="w-8 h-8 text-orange-500" />
  </div>
);

const StandardFoamIcon = () => (
  <div className="flex flex-col items-center">
    <Layers className="w-8 h-8 text-orange-500" />
  </div>
);

const StandardSprungIcon = () => (
  <div className="flex flex-col items-center">
    <Waves className="w-8 h-8 text-orange-500" />
  </div>
);

// New bed category icons
const LuxuryBedsIcon = () => (
  <div className="flex flex-col items-center">
    <Crown className="w-8 h-8 text-orange-500" />
  </div>
);

const FabricBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full opacity-20"></div>
      <div className="absolute w-4 h-4 bg-orange-500 rounded-full"></div>
    </div>
  </div>
);

const WoodenBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="flex flex-col gap-1">
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
        <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

const ChildrenBedsIcon = () => (
  <div className="flex flex-col items-center">
    <Baby className="w-8 h-8 text-orange-500" />
  </div>
);

const BunkBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="flex flex-col gap-1">
        <div className="w-6 h-2 bg-orange-500 rounded"></div>
        <div className="w-6 h-2 bg-orange-500 rounded"></div>
      </div>
    </div>
  </div>
);

const SofaBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
    </div>
  </div>
);

const StorageBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded border-2 border-orange-300"></div>
    </div>
  </div>
);

const OttomanBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded-full"></div>
    </div>
  </div>
);

// New sofa category icons
const LShapeSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
      <div className="w-4 h-6 bg-orange-500 rounded ml-2"></div>
    </div>
  </div>
);

const ThreeSeaterSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
    </div>
  </div>
);

const SofaBedIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
      <div className="w-6 h-1 bg-orange-500 rounded mt-1"></div>
    </div>
  </div>
);

const TwoSeaterSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-5 h-4 bg-orange-500 rounded"></div>
    </div>
  </div>
);

const ReclinerSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
      <div className="w-6 h-1 bg-orange-500 rounded mt-1 transform rotate-12"></div>
    </div>
  </div>
);

const CornerSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-4 h-4 bg-orange-500 rounded"></div>
      <div className="w-4 h-4 bg-orange-500 rounded ml-2"></div>
      <div className="w-4 h-4 bg-orange-500 rounded mt-2"></div>
    </div>
  </div>
);

const FabricSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded opacity-80"></div>
      <div className="w-6 h-1 bg-orange-500 rounded mt-1 opacity-60"></div>
    </div>
  </div>
);

const LeatherSofaIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded border-2 border-orange-300"></div>
    </div>
  </div>
);

const NewInIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
    </div>
  </div>
);

const SaleIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">S</span>
      </div>
    </div>
  </div>
);

const ClearanceIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">C</span>
      </div>
    </div>
  </div>
);

// New kids category icons
const KidsMattressesIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
      <div className="w-6 h-1 bg-orange-500 rounded mt-1"></div>
    </div>
  </div>
);

const KidsBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-4 bg-orange-500 rounded"></div>
    </div>
  </div>
);

const KidsBunkBedsIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="flex flex-col gap-1">
        <div className="w-6 h-2 bg-orange-500 rounded"></div>
        <div className="w-6 h-2 bg-orange-500 rounded"></div>
      </div>
    </div>
  </div>
);

const KidsNewInIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
    </div>
  </div>
);

const KidsClearanceIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">C</span>
      </div>
    </div>
  </div>
);

const KidsSaleIcon = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 flex items-center justify-center">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">S</span>
      </div>
    </div>
  </div>
);

export function PopularCategories({ onCategorySelect, category, selectedFilters = {} }: PopularCategoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<PopularCategory[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch popular categories from database
  useEffect(() => {
    const fetchPopularCategories = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/popular-categories/${category}`)
        if (!response.ok) {
          throw new Error('Failed to fetch popular categories')
        }
        const data = await response.json()
        
        // Transform database data to component format
        const transformedCategories = data.popularCategories?.map((cat: any) => ({
          name: cat.name,
          icon: getIconForCategory(cat.name, category || 'mattresses'),
          itemsCount: cat.itemsCount,
          filterKey: cat.filterKey,
          filterValue: cat.filterValue
        })) || []
        
        setCategories(transformedCategories)
      } catch (error) {
        console.error('Error fetching popular categories:', error)
        // Fallback to default categories if API fails
        setCategories(getDefaultCategories())
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchPopularCategories()
    }
  }, [category])
  
  // Get icon for category name
  const getIconForCategory = (name: string, category: string) => {
    // Map category names to icons
    const iconMap: Record<string, React.ElementType> = {
      'Most Cooling': Snowflake,
      'Soft Comfort': ComfortIcon,
      'Firm Comfort': FirmComfortIcon,
      'Medium Comfort': ComfortIcon,
      'Super Firm': HeavyPeopleIcon,
      'Most Support': MostSupportIcon,
      'Luxury': LuxuryIcon,
      'Hybrid': HybridIcon,
      'Pocket Sprung': FoamIcon,
      'Coil Sprung': StandardSprungIcon,
      'Kids': KidsIcon,
      'Memory Foam': StandardFoamIcon,
      'Latex Foam': LatexIcon,
      'Luxury Beds': LuxuryBedsIcon,
      'Fabric Beds': FabricBedsIcon,
      'Wooden Beds': WoodenBedsIcon,
      'Children Beds': ChildrenBedsIcon,
      'Bunk Beds': BunkBedsIcon,
      'Sofa Beds': SofaBedsIcon,
      'Storage Beds': StorageBedsIcon,
      'Ottoman Beds': OttomanBedsIcon,
      'L Shape Sofa': LShapeSofaIcon,
      '3 Seater Sofa': ThreeSeaterSofaIcon,
      'Sofa Bed': SofaBedIcon,
      '2 Seater Sofa': TwoSeaterSofaIcon,
      'Recliner Sofa': ReclinerSofaIcon,
      'Corner Sofa': CornerSofaIcon,
      'Fabric Sofa': FabricSofaIcon,
      'Leather Sofa': LeatherSofaIcon,
      'New In': NewInIcon,
      'Sale': SaleIcon,
      'Clearance': ClearanceIcon,
      'Mattresses': KidsMattressesIcon,
      'Beds': KidsBedsIcon,
      'Kids Bunk Beds': KidsBunkBedsIcon,
      'Kids New In': KidsNewInIcon,
      'Kids Clearance': KidsClearanceIcon,
      'Kids Sale': KidsSaleIcon
    }
    
    return iconMap[name] || Circle
  }
  
  // Default categories fallback
  const getDefaultCategories = (): PopularCategory[] => {
    if (category === 'beds') {
      return [
        { name: "Luxury Beds", icon: LuxuryBedsIcon, itemsCount: 15, filterKey: "Bed Type", filterValue: "Luxury" },
        { name: "Fabric Beds", icon: FabricBedsIcon, itemsCount: 22, filterKey: "Bed Type", filterValue: "Fabric" },
        { name: "Wooden Beds", icon: WoodenBedsIcon, itemsCount: 18, filterKey: "Bed Type", filterValue: "Wooden" },
        { name: "Children Beds", icon: ChildrenBedsIcon, itemsCount: 12, filterKey: "Bed Type", filterValue: "Children" },
        { name: "Bunk Beds", icon: BunkBedsIcon, itemsCount: 8, filterKey: "Bed Type", filterValue: "Bunk" },
        { name: "Sofa Beds", icon: SofaBedsIcon, itemsCount: 14, filterKey: "Bed Type", filterValue: "Sofa" },
        { name: "Storage Beds", icon: StorageBedsIcon, itemsCount: 16, filterKey: "Bed Type", filterValue: "Storage" },
        { name: "Ottoman Beds", icon: OttomanBedsIcon, itemsCount: 11, filterKey: "Bed Type", filterValue: "Ottoman" },
      ]
    } else if (category === 'sofas') {
      return [
        { name: "L Shape Sofa", icon: LShapeSofaIcon, itemsCount: 18, filterKey: "Sofa Type", filterValue: "L Shape" },
        { name: "3 Seater Sofa", icon: ThreeSeaterSofaIcon, itemsCount: 25, filterKey: "Sofa Type", filterValue: "3 Seater" },
        { name: "Sofa Bed", icon: SofaBedIcon, itemsCount: 12, filterKey: "Sofa Type", filterValue: "Sofa Bed" },
        { name: "2 Seater Sofa", icon: TwoSeaterSofaIcon, itemsCount: 20, filterKey: "Sofa Type", filterValue: "2 Seater" },
        { name: "Recliner Sofa", icon: ReclinerSofaIcon, itemsCount: 15, filterKey: "Sofa Type", filterValue: "Recliner" },
        { name: "Corner Sofa", icon: CornerSofaIcon, itemsCount: 16, filterKey: "Sofa Type", filterValue: "Corner" },
        { name: "Fabric Sofa", icon: FabricSofaIcon, itemsCount: 22, filterKey: "Sofa Material", filterValue: "Fabric" },
        { name: "Leather Sofa", icon: LeatherSofaIcon, itemsCount: 14, filterKey: "Sofa Material", filterValue: "Leather" },
        { name: "New In", icon: NewInIcon, itemsCount: 8, filterKey: "Status", filterValue: "New" },
        { name: "Sale", icon: SaleIcon, itemsCount: 12, filterKey: "Status", filterValue: "Sale" },
        { name: "Clearance", icon: ClearanceIcon, itemsCount: 6, filterKey: "Status", filterValue: "Clearance" },
      ]
    } else if (category === 'kids') {
      return [
        { name: "Mattresses", icon: KidsMattressesIcon, itemsCount: 15, filterKey: "Kids Category", filterValue: "Mattresses" },
        { name: "Beds", icon: KidsBedsIcon, itemsCount: 20, filterKey: "Kids Category", filterValue: "Beds" },
        { name: "Bunk Beds", icon: KidsBunkBedsIcon, itemsCount: 12, filterKey: "Kids Category", filterValue: "Bunk Beds" },
        { name: "New In", icon: KidsNewInIcon, itemsCount: 8, filterKey: "Kids Status", filterValue: "New" },
        { name: "Clearance", icon: KidsClearanceIcon, itemsCount: 6, filterKey: "Kids Status", filterValue: "Clearance" },
        { name: "Sale", icon: KidsSaleIcon, itemsCount: 10, filterKey: "Kids Status", filterValue: "Sale" },
      ]
    } else {
      // Default mattress categories for other pages
      return [
        { name: "Most Cooling", icon: Snowflake, itemsCount: 10, filterKey: "Features", filterValue: "Cooling" },
        { name: "Soft Comfort", icon: ComfortIcon, itemsCount: 8, filterKey: "Firmness", filterValue: "Soft" },
        { name: "Firm Comfort", icon: FirmComfortIcon, itemsCount: 7, filterKey: "Firmness", filterValue: "Firm" },
        { name: "Medium Comfort", icon: ComfortIcon, itemsCount: 16, filterKey: "Firmness", filterValue: "Medium" },
        { name: "Super Firm", icon: HeavyPeopleIcon, itemsCount: 12, filterKey: "Features", filterValue: "Heavy Duty" },
        { name: "Most Support", icon: MostSupportIcon, itemsCount: 14, filterKey: "Features", filterValue: "Extra Support" },
        { name: "Luxury", icon: LuxuryIcon, itemsCount: 10, filterKey: "Mattress Type", filterValue: "Luxury" },
        { name: "Hybrid", icon: HybridIcon, itemsCount: 12, filterKey: "Mattress Type", filterValue: "Hybrid" },
        { name: "Pocket Sprung", icon: FoamIcon, itemsCount: 15, filterKey: "Mattress Type", filterValue: "Foam" },
        { name: "Coil Sprung", icon: StandardSprungIcon, itemsCount: 11, filterKey: "Mattress Type", filterValue: "Latex" },
        { name: "Kids", icon: KidsIcon, itemsCount: 13, filterKey: "Mattress Type", filterValue: "Kids" },
        { name: "Memory Foam", icon: StandardFoamIcon, itemsCount: 18, filterKey: "Mattress Type", filterValue: "Standard Foam" },
        { name: "Latex Foam", icon: LatexIcon, itemsCount: 16, filterKey: "Mattress Type", filterValue: "Latex Foam" },
      ]
    }
  }

  const cardsPerView = 6
  const maxIndex = Math.max(0, categories.length - cardsPerView)

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 176 // w-40 = 160px + gap (16px) = 176px
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      })
    }
    setCurrentIndex(index)
  }

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToIndex(newIndex)
  }

  const scrollRight = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  // Check if a category is selected
  const isCategorySelected = (filterKey: string, filterValue: string) => {
    const key = filterKey.toLowerCase()
    return selectedFilters[key] && selectedFilters[key].includes(filterValue)
  }

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular categories</h2>
        <div className="text-center text-gray-500">Loading popular categories...</div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular categories</h2>
        <div className="text-center text-gray-500">No popular categories found</div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Popular categories</h2>
      <div className="relative">
        {/* Left Arrow Button */}
        <Button 
          variant="outline" 
          size="icon" 
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md border-gray-200 hover:border-gray-300 z-10 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          onClick={scrollLeft}
          disabled={currentIndex === 0}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Right Arrow Button */}
        <Button 
          variant="outline" 
          size="icon" 
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md border-gray-200 hover:border-gray-300 z-10 ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          onClick={scrollRight}
          disabled={currentIndex >= maxIndex}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Button>

        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-hidden pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = isCategorySelected(cat.filterKey, cat.filterValue)
            return (
              <Card 
                key={cat.name} 
                className={`flex-shrink-0 w-40 h-32 flex flex-col items-center justify-center text-center cursor-pointer transition-colors border ${
                  isSelected 
                    ? 'bg-orange-50 border-orange-300 hover:bg-orange-100' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={() => onCategorySelect(cat.filterKey, cat.filterValue)}
              >
              <CardContent className="p-4 flex flex-col items-center justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center flex-1">
                  {cat.name === "Super Firm" ? (
                  <HeavyPeopleIcon />
                  ) : cat.name === "Most Support" ? (
                  <MostSupportIcon />
                  ) : cat.name === "Soft Comfort" || cat.name === "Medium Comfort" ? (
                  <ComfortIcon />
                  ) : cat.name === "Firm Comfort" ? (
                  <FirmComfortIcon />
                  ) : cat.name === "Luxury" ? (
                    <LuxuryIcon />
                  ) : cat.name === "Hybrid" ? (
                    <HybridIcon />
                  ) : cat.name === "Pocket Sprung" ? (
                    <FoamIcon />
                  ) : cat.name === "Coil Sprung" ? (
                    <StandardSprungIcon />
                  ) : cat.name === "Kids" ? (
                    <KidsIcon />
                  ) : cat.name === "Memory Foam" ? (
                    <StandardFoamIcon />
                  ) : cat.name === "Latex Foam" ? (
                    <LatexIcon />
                  ) : cat.name === "Luxury Beds" ? (
                    <LuxuryBedsIcon />
                  ) : cat.name === "Fabric Beds" ? (
                    <FabricBedsIcon />
                  ) : cat.name === "Wooden Beds" ? (
                    <WoodenBedsIcon />
                  ) : cat.name === "Children Beds" ? (
                    <ChildrenBedsIcon />
                  ) : cat.name === "Bunk Beds" ? (
                    <BunkBedsIcon />
                  ) : cat.name === "Sofa Beds" ? (
                    <SofaBedsIcon />
                  ) : cat.name === "Storage Beds" ? (
                    <StorageBedsIcon />
                  ) : cat.name === "Ottoman Beds" ? (
                    <OttomanBedsIcon />
                  ) : cat.name === "L Shape Sofa" ? (
                    <LShapeSofaIcon />
                  ) : cat.name === "3 Seater Sofa" ? (
                    <ThreeSeaterSofaIcon />
                  ) : cat.name === "Sofa Bed" ? (
                    <SofaBedIcon />
                  ) : cat.name === "2 Seater Sofa" ? (
                    <TwoSeaterSofaIcon />
                  ) : cat.name === "Recliner Sofa" ? (
                    <ReclinerSofaIcon />
                  ) : cat.name === "Corner Sofa" ? (
                    <CornerSofaIcon />
                  ) : cat.name === "Fabric Sofa" ? (
                    <FabricSofaIcon />
                  ) : cat.name === "Leather Sofa" ? (
                    <LeatherSofaIcon />
                  ) : cat.name === "New In" ? (
                    <NewInIcon />
                  ) : cat.name === "Sale" ? (
                    <SaleIcon />
                  ) : cat.name === "Clearance" ? (
                    <ClearanceIcon />
                  ) : cat.name === "Mattresses" && category === 'kids' ? (
                    <KidsMattressesIcon />
                  ) : cat.name === "Beds" && category === 'kids' ? (
                    <KidsBedsIcon />
                  ) : cat.name === "Bunk Beds" && category === 'kids' ? (
                    <KidsBunkBedsIcon />
                  ) : cat.name === "New In" && category === 'kids' ? (
                    <KidsNewInIcon />
                  ) : cat.name === "Clearance" && category === 'kids' ? (
                    <KidsClearanceIcon />
                  ) : cat.name === "Sale" && category === 'kids' ? (
                    <KidsSaleIcon />
                  ) : (
                    <cat.icon className="h-8 w-8 text-orange-500" />
                  )}
                </div>
                <div className="text-center mt-auto">
                  <p className={`font-medium text-sm ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.itemsCount} Items</p>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
