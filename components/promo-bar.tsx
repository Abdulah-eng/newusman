"use client"
import { useEffect, useMemo, useState } from 'react'
import { useMounted } from '@/hooks/use-mobile'

export function PromoBar() {
  const mounted = useMounted()
  const [config, setConfig] = useState({
    title: 'UP TO 50% OFF - MID WEEK SAVINGS',
    endsAt: '', // Will be set after mount
  })

  useEffect(() => {
    // Set default end time after mount to avoid SSR hydration issues
    if (!config.endsAt) {
      setConfig(prev => ({
        ...prev,
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }))
    }
  }, [config.endsAt])

  const endsAt = useMemo(() => new Date(config.endsAt).getTime(), [config.endsAt])
  const [now, setNow] = useState(0)
  
  useEffect(() => {
    if (!mounted) return
    
    // Set initial time after mount to avoid hydration mismatch
    setNow(Date.now())
    
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [mounted])

  const diff = Math.max(0, Math.floor((endsAt - now) / 1000))
  const days = Math.floor(diff / (24 * 3600))
  const hours = Math.floor((diff % (24 * 3600)) / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  const secs = diff % 60

  return (
    <div className="w-full bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="font-semibold text-sm md:text-base">{config.title}</div>
        {mounted ? (
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="opacity-90">ENDS IN</span>
            <span className="font-bold">{String(days).padStart(2,'0')} DAYS</span>
            <span className="font-bold">{String(hours).padStart(2,'0')} HOURS</span>
            <span className="font-bold">{String(mins).padStart(2,'0')} MINS</span>
            <span className="font-bold">{String(secs).padStart(2,'0')} SECS</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="opacity-90">ENDS IN</span>
            <span className="font-bold">01 DAYS</span>
            <span className="font-bold">00 HOURS</span>
            <span className="font-bold">00 MINS</span>
            <span className="font-bold">00 SECS</span>
          </div>
        )}
      </div>
    </div>
  )
}



