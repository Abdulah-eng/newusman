'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('🚀 Performance Metrics:', {
            'DOM Content Loaded': `${navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart}ms`,
            'Load Complete': `${navEntry.loadEventEnd - navEntry.loadEventStart}ms`,
            'Total Load Time': `${navEntry.loadEventEnd - navEntry.fetchStart}ms`,
            'First Byte': `${navEntry.responseStart - navEntry.requestStart}ms`,
            'DOM Processing': `${navEntry.domComplete - navEntry.domLoading}ms`
          })
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })

    // Monitor LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('🎯 Largest Contentful Paint:', `${lastEntry.startTime}ms`)
    })

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Monitor FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime
        console.log('⚡ First Input Delay:', `${fid}ms`)
      }
    })

    fidObserver.observe({ entryTypes: ['first-input'] })

    return () => {
      observer.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
    }
  }, [])

  return null
}
