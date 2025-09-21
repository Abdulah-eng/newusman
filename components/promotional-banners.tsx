"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PromotionalBanner {
  id: string
  banner_type: string
  title: string
  subtitle: string
  description: string
  image_url: string
  link_url: string
  badge_text: string
  badge_color: string
  discount_percentage: number
  discount_text: string
  is_active: boolean
  sort_order: number
}

interface PromotionalBannersProps {
  className?: string
}

export default function PromotionalBanners({ className = "" }: PromotionalBannersProps) {
  const [banners, setBanners] = useState<PromotionalBanner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/promotional-banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data.banners || [])
      }
    } catch (error) {
      console.error('Error fetching promotional banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    }
    return colorMap[color] || 'bg-red-500'
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-3 gap-8 max-w-7xl mx-auto ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-200 h-80 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="h-6 bg-gray-300 rounded mb-2 w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-20 mt-1"></div>
              </div>
              <div className="absolute top-4 right-4 bg-gray-300 text-white px-3 py-1 rounded-full h-6 w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (banners.length === 0) {
    // Fallback to hardcoded banners if no data
    return (
      <div className={`grid grid-cols-3 gap-8 max-w-7xl mx-auto ${className}`}>
        {/* Flash Sale Image */}
        <div className="relative group cursor-pointer">
          <Link href="/sale">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="/clearance.png" 
                alt="Flash Sale" 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">FLASH SALE</h3>
                <p className="text-base font-semibold">Up to 70% Off</p>
                <p className="text-xs opacity-90">Limited Time Only</p>
              </div>
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                HOT DEAL
              </div>
            </div>
          </Link>
        </div>

        {/* Clearance Items Image */}
        <div className="relative group cursor-pointer">
          <Link href="/sale">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="/secondbanner.jpg" 
                alt="Clearance Items" 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">CLEARANCE</h3>
                <p className="text-base font-semibold">Up to 60% Off</p>
                <p className="text-xs opacity-90">While Stocks Last</p>
              </div>
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                SAVE BIG
              </div>
            </div>
          </Link>
        </div>

        {/* End of Season Image */}
        <div className="relative group cursor-pointer">
          <Link href="/sale">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src="/secondbanner.jpg" 
                alt="End of Season" 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">END OF SEASON</h3>
                <p className="text-base font-semibold">Up to 50% Off</p>
                <p className="text-xs opacity-90">Final Reductions</p>
              </div>
              <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                LAST CHANCE
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-3 gap-8 max-w-7xl mx-auto ${className}`}>
      {banners.slice(0, 3).map((banner) => (
        <div key={banner.id} className="relative group cursor-pointer">
          <Link href={banner.link_url || '/sale'}>
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src={banner.image_url} 
                alt={banner.title} 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                <p className="text-base font-semibold">{banner.subtitle}</p>
                <p className="text-xs opacity-90">{banner.description}</p>
              </div>
              <div className={`absolute top-4 right-4 ${getBadgeColorClass(banner.badge_color)} text-white px-3 py-1 rounded-full font-bold text-xs`}>
                {banner.badge_text}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
