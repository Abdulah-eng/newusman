import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Map standardized color names used for variants to premium hex values for UI swatches
export function getHexForColorName(colorName?: string): string | null {
  if (!colorName) return null
  const key = colorName.trim().toLowerCase()
  const map: Record<string, string> = {
    'grey': '#6B7280', // Premium charcoal grey
    'light grey': '#E5E7EB', // Elegant light grey
    'dark grey': '#374151', // Rich dark grey
    'brown': '#92400E', // Warm chocolate brown
    'light brown': '#D97706', // Golden brown
    'dark brown': '#451A03', // Deep espresso brown
    'black': '#111827', // Rich black
    'white': '#FEFEFE', // Pure white
    'beige': '#F3F4F6', // Sophisticated beige
    'lilac': '#C084FC', // Vibrant lilac
    'cream': '#FFFBEB', // Luxurious cream
    'red': '#DC2626', // Bold crimson red
    'orange': '#EA580C', // Vibrant orange
    'navy blue': '#1E3A8A', // Deep navy
    'dark blue': '#1D4ED8', // Rich dark blue
    'light blue': '#3B82F6', // Bright light blue
    'blue': '#1E40AF', // Rich royal blue
    'teal': '#0D9488', // Sophisticated teal
    'green': '#059669', // Forest green
    'light green': '#10B981', // Fresh light green
    'dark green': '#047857', // Deep emerald
    'olive green': '#65A30D', // Rich olive
    'yellow': '#EAB308', // Golden yellow
    'pink': '#EC4899', // Vibrant pink
    'purple': '#7C3AED', // Royal purple
    'soccer blue': '#1E40AF', // Team blue
    'soccer red': '#B91C1C', // Team red
    'soccer black': '#1F2937', // Team black
    'taupe': '#78716C', // Elegant taupe
    'torquoise': '#14B8A6', // Bright turquoise
    'turquoise': '#14B8A6', // Bright turquoise
    'aqua blue': '#06B6D4', // Crystal aqua
    'lime': '#65A30D' // Vibrant emerald lime
  }
  return map[key] || null
}
