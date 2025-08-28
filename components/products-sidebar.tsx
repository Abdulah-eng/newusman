"use client"

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductsSidebarProps {
  category: string
  filters: any
  setFilters: (filters: any) => void
  isOpen: boolean
  onClose: () => void
}

export function ProductsSidebar({ category, filters, setFilters, isOpen, onClose }: ProductsSidebarProps) {
  const filterOptions = {
    mattresses: {
      type: ["Foam", "Spring", "Hybrid", "Memory Foam", "Orthopedic", "Kids"],
      size: ["Small Single", "Single", "Small Double", "Double", "King Size", "Super King"],
      firmness: ["Soft", "Medium", "Firm", "Extra Firm"],
      features: ["Memory Foam", "Hypoallergenic", "Waterproof", "Cooling", "Eco-Friendly"]
    },
    beds: {
      type: ["Storage", "Wooden", "Metal", "Upholstered", "Divan", "Ottoman"],
      size: ["Small Single", "Single", "Small Double", "Double", "King Size", "Super King"],
      features: ["Storage", "Guest Bed", "Kids Bed", "Adjustable"]
    },
    sofas: {
      type: ["2 Seater", "3 Seater", "Corner", "Sofa Bed", "Recliner"],
      material: ["Fabric", "Leather", "Velvet"],
      color: ["Grey", "Beige", "Blue", "Brown", "Black"]
    }
  }

  const currentFilters = filterOptions[category as keyof typeof filterOptions] || {}

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item: string) => item !== value)
    }))
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters((prev: any) => ({ ...prev, priceRange: value }))}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>£{filters.priceRange[0]}</span>
              <span>£{filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Filters */}
      {Object.entries(currentFilters).map(([filterType, options]) => (
        <Card key={filterType}>
          <CardHeader>
            <CardTitle className="text-sm capitalize">{filterType}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(options as string[]).map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filterType}-${option}`}
                    checked={(filters[filterType] || []).includes(option)}
                    onCheckedChange={(checked) => 
                      handleFilterChange(filterType, option, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${filterType}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({
          type: [],
          size: [],
          firmness: [],
          features: [],
          priceRange: [0, 1000]
        })}
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
