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

// Map standardized color names used for variants to hex values for UI swatches
export function getHexForColorName(colorName?: string): string | null {
  if (!colorName) return null
  const key = colorName.trim().toLowerCase()
  const map: Record<string, string> = {
    'grey': '#808080',
    'light grey': '#D3D3D3',
    'dark grey': '#505050',
    'brown': '#8B4513',
    'light brown': '#B5651D',
    'dark brown': '#5C3A21',
    'black': '#000000',
    'white': '#FFFFFF',
    'beige': '#F5F5DC',
    'lilac': '#C8A2C8',
    'cream': '#FFFDD0',
    'red': '#D32F2F',
    'orange': '#FB8C00',
    'navy blue': '#001F3F',
    'dark blue': '#0D47A1',
    'light blue': '#ADD8E6',
    'blue': '#1976D2',
    'teal': '#008080',
    'green': '#2E7D32',
    'light green': '#90EE90',
    'dark green': '#006400',
    'olive green': '#556B2F',
    'yellow': '#FBC02D',
    'pink': '#E91E63',
    'purple': '#6A1B9A',
    'soccer blue': '#0057B8',
    'soccer red': '#C8102E',
    'soccer black': '#111111',
    'taupe': '#483C32',
    'torquoise': '#40E0D0',
    'turquoise': '#40E0D0',
    'aqua blue': '#00FFFF',
    'lime': '#32CD32'
  }
  return map[key] || null
}
