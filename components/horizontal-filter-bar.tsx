"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, Bed, DollarSign, Waves, Store, Tag, ChevronDown, Filter } from 'lucide-react'

interface HorizontalFilterBarProps {
  category: string
  filters: Record<string, any>
  onFiltersChange: (filters: Record<string, any>) => void
  onOpenAllFilters: () => void
  sortBy: string
  onSortByChange: (value: string) => void
}

export function HorizontalFilterBar({ 
  category, 
  filters, 
  onFiltersChange, 
  onOpenAllFilters,
  sortBy,
  onSortByChange
}: HorizontalFilterBarProps) {

  const filterOptions: Record<string, Record<string, string[]>> = {
    mattresses: {
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King", "Split King"],
      "Feels": ["Soft", "Medium", "Firm", "Extra Firm"],
    },
    beds: {
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King", "Split King"],
      "Style": ["Modern", "Traditional", "Industrial", "Rustic", "Contemporary"],
    },
    sofas: {
      "Size": ["Small", "Medium", "Large", "Extra Large"],
      "Style": ["Modern", "Traditional", "Scandinavian", "Industrial", "Bohemian"],
    },
    pillows: {
      "Size": ["Standard", "Queen", "King"],
      "Style": ["Modern", "Traditional", "Luxury", "Minimalist"],
    },
    bedding: {
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King"],
      "Style": ["Modern", "Traditional", "Luxury", "Minimalist"],
    },
    "adjustable-bases": {
      "Size": ["Twin XL", "Full", "Queen", "King", "Split King"],
      "Style": ["Modern", "Traditional", "Luxury", "Minimalist"],
    },
    "box-springs": {
      "Size": ["Twin", "Twin XL", "Full", "Queen", "King", "California King"],
      "Style": ["Modern", "Traditional", "Industrial", "Rustic"],
    }
  }

  const currentCategoryFilters = filterOptions[category] || {}

  const handleCheckboxFilterChange = (filterType: string, value: string, checked: boolean) => {
    const currentValues = Array.isArray(filters[filterType]) ? filters[filterType] : [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item: string) => item !== value);
    onFiltersChange({ ...filters, [filterType]: newValues });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleToggleFilterChange = (filterType: string) => {
    onFiltersChange({ ...filters, [filterType]: !filters[filterType] });
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div className="flex items-center gap-3 flex-wrap">
        {/* All Filters Button - Blue with white icon */}
        <Button
          onClick={onOpenAllFilters}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          All Filters
        </Button>

        {/* Size Filter */}
        {currentCategoryFilters["Size"] && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-6 py-2 rounded-lg flex items-center gap-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                <Bed className="h-4 w-4 text-orange-600" />
                Size
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <div className="space-y-2">
                {currentCategoryFilters["Size"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={Array.isArray(filters["Size"]) && filters["Size"].includes(size)}
                      onCheckedChange={(checked) => handleCheckboxFilterChange("Size", size, checked as boolean)}
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Price Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-6 py-2 rounded-lg flex items-center gap-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Price
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4 w-64">
            <Label className="mb-2 block">Price Range</Label>
            <Slider
              value={filters.priceRange || [0, 2000]}
              onValueChange={handlePriceRangeChange}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>£{filters.priceRange ? filters.priceRange[0] : 0}</span>
              <span>£{filters.priceRange ? filters.priceRange[1] : 2000}</span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Feels Filter */}
        {currentCategoryFilters["Feels"] && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-6 py-2 rounded-lg flex items-center gap-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                <Waves className="h-4 w-4 text-orange-600" />
                Feels
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <div className="space-y-2">
                {currentCategoryFilters["Feels"].map((feel) => (
                  <div key={feel} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feel-${feel}`}
                      checked={Array.isArray(filters["Feels"]) && filters["Feels"].includes(feel)}
                      onCheckedChange={(checked) => handleCheckboxFilterChange("Feels", feel, checked as boolean)}
                    />
                    <Label htmlFor={`feel-${feel}`}>{feel}</Label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sale Filter */}
        <Button 
          variant={filters["Sale"] ? "default" : "outline"} 
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            filters["Sale"] 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => handleToggleFilterChange("Sale")}
        >
          <Store className="h-4 w-4 text-orange-600" />
          Sale
        </Button>

        {/* Clearance Filter */}
        <Button 
          variant={filters["Clearance"] ? "default" : "outline"} 
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            filters["Clearance"] 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => handleToggleFilterChange("Clearance")}
        >
          <Tag className="h-4 w-4 text-orange-600" />
          Clearance
        </Button>
      </div>

      {/* Sort by Section */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-black">Sort by:</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-40 border-gray-200 hover:border-gray-300 focus:border-orange-500 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance" className="text-black hover:bg-gray-50 focus:bg-gray-100 focus:text-black">
              Relevance
            </SelectItem>
            <SelectItem value="popular" className="text-black hover:bg-gray-50 focus:bg-gray-100 focus:text-black">
              Popular
            </SelectItem>
            <SelectItem value="price-low" className="text-black hover:bg-gray-50 focus:bg-gray-100 focus:text-black">
              Price, low to high
            </SelectItem>
            <SelectItem value="price-high" className="text-black hover:bg-gray-50 focus:bg-gray-100 focus:text-black">
              Price, high to low
            </SelectItem>
            <SelectItem value="sale" className="text-black hover:bg-gray-50 focus:bg-gray-100 focus:text-black">
              Sale
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
