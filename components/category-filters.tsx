"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface CategoryFiltersProps {
  category: string
  onFiltersChange: (filters: any) => void
}

export function CategoryFilters({ category, onFiltersChange }: CategoryFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState([0, 2000])

  const filterOptions: Record<string, Record<string, string[]>> = {
    mattresses: {
      "Mattress Type": ["Memory Foam", "Innerspring", "Hybrid", "Latex", "Adjustable"],
      "Firmness": ["Soft", "Medium", "Firm", "Extra Firm"],
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King", "Split King"],
      "Features": ["Cooling", "Motion Isolation", "Edge Support", "Organic", "Hypoallergenic"],
      "Brand": ["Tempur-Pedic", "Sealy", "Serta", "Purple", "Casper"]
    },
    beds: {
      "Bed Type": ["Platform Bed", "Storage Bed", "Canopy Bed", "Four Poster", "Sleigh Bed"],
      "Material": ["Wood", "Metal", "Upholstered", "Leather", "Fabric"],
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King", "Split King"],
      "Style": ["Modern", "Traditional", "Industrial", "Rustic", "Contemporary"],
      "Brand": ["Zinus", "Ashley", "Modway", "Novogratz"]
    },
    sofas: {
      "Sofa Type": ["Sectional", "Loveseat", "Sleeper Sofa", "Recliner", "Chesterfield"],
      "Material": ["Fabric", "Leather", "Velvet", "Linen"],
      "Size": ["Small", "Medium", "Large", "Extra Large"],
      "Color": ["Gray", "Blue", "Black", "White", "Beige", "Green"],
      "Brand": ["Ashley", "Modway", "Zinus", "Novogratz"]
    },
    pillows: {
      "Pillow Type": ["Memory Foam", "Down", "Feather", "Latex", "Buckwheat"],
      "Firmness": ["Soft", "Medium", "Firm"],
      "Size": ["Standard", "Queen", "King"],
      "Features": ["Cooling", "Hypoallergenic", "Adjustable"],
      "Brand": ["Tempur-Pedic", "Casper", "Purple"]
    },
    accessories: {
      "Accessory Type": ["Mattress Protector", "Topper", "Sheets", "Duvet Cover", "Pillowcase"],
      "Material": ["Cotton", "Bamboo", "Tencel", "Microfiber"],
      "Features": ["Waterproof", "Cooling", "Hypoallergenic"],
      "Brand": ["Malouf", "Protect-A-Bed"]
    }
  }

  const currentFilters = filterOptions[category] || {}

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      if (!Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = []
      }
      
      if (checked) {
        newFilters[filterType] = [...newFilters[filterType], value]
      } else {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value)
      }
      
      onFiltersChange({ ...newFilters, priceRange })
      return newFilters
    })
  }

  const removeFilter = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = newFilters[filterType].filter((item: string) => item !== value);
      }
      onFiltersChange({ ...newFilters, priceRange });
      return newFilters;
    });
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setPriceRange([0, 2000])
    onFiltersChange({ priceRange: [0, 2000] })
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, filtersArray) => {
      if (Array.isArray(filtersArray)) {
        return count + filtersArray.length;
      }
      return count;
    }, 0);
  }

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters ({getActiveFilterCount()})</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([filterType, values]) =>
                values.map(value => (
                  <Badge key={`${filterType}-${value}`} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <button onClick={() => removeFilter(filterType, value)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value)
                onFiltersChange({ ...activeFilters, priceRange: value })
              }}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>£{priceRange[0]}</span>
              <span>£{priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      {Object.entries(currentFilters).map(([filterType, options]) => (
        <Card key={filterType}>
          <CardHeader>
            <CardTitle className="text-sm">{filterType}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filterType}-${option}`}
                    checked={(activeFilters[filterType] || []).includes(option)}
                    onCheckedChange={(checked) => 
                      handleFilterChange(filterType, option, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${filterType}-${option}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
