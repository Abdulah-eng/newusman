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
      // Preloaded images for better performance
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
