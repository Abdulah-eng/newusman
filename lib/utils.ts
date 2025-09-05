import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image caching and preloading utilities
export const imageCache = {
  // Preload an image and store it in memory
  preload: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  },

  // Preload multiple images
  preloadMultiple: async (urls: string[]): Promise<void> => {
    const validUrls = urls.filter(url => url && url.startsWith('http'))
    if (validUrls.length === 0) return
    
    try {
      await Promise.allSettled(
        validUrls.map(url => imageCache.preload(url))
      )
      console.log(`🖼️ Preloaded ${validUrls.length} images`)
    } catch (error) {
      console.error('Error preloading images:', error)
    }
  },

  // Check if image is cached in browser
  isCached: (src: string): boolean => {
    try {
      const img = new Image()
      img.src = src
      return img.complete
    } catch {
      return false
    }
  }
}

// Cache management utilities
export const cacheManager = {
  // Set cache with expiration
  set: (key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void => {
    if (typeof window === 'undefined') return
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  },

  // Get cache if not expired - optimized for speed
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null
      
      const parsed = JSON.parse(cached)
      const now = Date.now()
      
      if (now - parsed.timestamp < parsed.ttl) {
        return parsed.data
      } else {
        localStorage.removeItem(key)
        return null
      }
    } catch (error) {
      console.error('Error getting cache:', error)
      localStorage.removeItem(key)
      return null
    }
  },

  // Ultra-fast cache check without parsing (for immediate checks)
  hasValidCache: (key: string): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return false
      
      // Quick check if it's valid JSON and has timestamp
      return cached.includes('"timestamp"') && cached.includes('"data"')
    } catch {
      return false
    }
  },

  // Get cached data without expiration check (for immediate use)
  getImmediate: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null
      
      const parsed = JSON.parse(cached)
      return parsed.data
    } catch (error) {
      return null
    }
  },

  // Clear specific cache
  clear: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  // Clear all caches
  clearAll: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('cache') || key.includes('homepage')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing caches:', error)
    }
  }
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
