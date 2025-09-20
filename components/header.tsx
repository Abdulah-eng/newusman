"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthButton } from '@/components/auth-button'
import { Search, ShoppingCart, Heart, Mail, X, Truck, HeadphonesIcon, ArrowRight, Instagram, Facebook, Youtube, Package, Car, RotateCcw, CreditCard, ChevronDown, Menu, User, Snowflake, Waves, Bed, Crown, Cpu, Layers, Baby, ArrowUp, Leaf } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Sora } from 'next/font/google'
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { usePathname } from 'next/navigation'

const sora = Sora({ subsets: ['latin'], weight: ['800'] })

export default function Header() {
  const { state } = useCart()
  const { wishlistCount } = useWishlist()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTopBarVisible, setIsTopBarVisible] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Check if we're on a category page
  const isOnCategoryPage = pathname && (
    pathname.startsWith('/mattresses') ||
    pathname.startsWith('/beds') ||
    pathname.startsWith('/sofas') ||
    pathname.startsWith('/kids') ||
    pathname.startsWith('/pillows') ||
    pathname.startsWith('/toppers') ||
    pathname.startsWith('/bunkbeds') ||
    pathname.startsWith('/guides')
  )

  // Disable dropdowns when on category pages
  const handleCategoryHover = (category: string) => {
    if (isOnCategoryPage) return // Disable dropdowns on category pages
    
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveDropdown(category)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCategoryLeave = () => {
    // Add a small delay before closing to allow moving to dropdown
    const timeout = setTimeout(() => {
    setActiveDropdown(null)
    }, 200) // 200ms delay
    setHoverTimeout(timeout)
  }

  const handleDropdownEnter = () => {
    // Clear timeout when entering dropdown
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  const handleDropdownLeave = () => {
    // Close dropdown when leaving
    setActiveDropdown(null)
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  // Fetch dropdown products for category when active
  const [dropdownProducts, setDropdownProducts] = useState<Record<string, any[]>>({})

  // Helper function to calculate display price with discount
  const getDisplayPrice = (product: any) => {
    if (product.discount_price) {
      return {
        current: product.discount_price,
        original: product.current_price,
        hasDiscount: true
      }
    } else if (product.discount_percentage && product.current_price) {
      const discountAmount = (product.current_price * product.discount_percentage) / 100
      return {
        current: product.current_price - discountAmount,
        original: product.current_price,
        hasDiscount: true
      }
    } else {
      return {
        current: product.current_price,
        original: null,
        hasDiscount: false
      }
    }
  }

  useEffect(() => {
    const cat = activeDropdown
    if (!cat || isOnCategoryPage) return
    
    
    // Handle other categories
    const already = dropdownProducts[cat]
    if (already && already.length > 0) return
    const limit = (cat === 'mattresses' || cat === 'beds' || cat === 'sofas') ? 3 : 4
    fetch(`/api/header-dropdown/${cat}?limit=${limit}`)
      .then(res => res.ok ? res.json() : { products: [] })
      .then(data => {
        setDropdownProducts(prev => ({ ...prev, [cat]: data.products || [] }))
      })
      .catch(() => {})
  }, [activeDropdown, isOnCategoryPage])

  return (
    <header className="relative z-50">
      {/* Top Bar - Dark Grey - Hidden on mobile */}
      <div className={`text-white border-b-2 border-gray-600 transition-all duration-300 ${isTopBarVisible ? 'block' : 'hidden'} lg:block`} style={{ backgroundColor: '#33373E' }}>
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-0.5 text-sm">
            {/* Left Side - Navigation Links */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-2 lg:mb-0">
              <Link href="/contact" className="hover:text-orange-400 transition-colors text-xs lg:text-sm">Contact</Link>
              <div className="w-px h-4 bg-white hidden lg:block"></div>
              <Link href="/reviews" className="hover:text-orange-400 transition-colors text-xs lg:text-sm">Reviews</Link>
              <div className="w-px h-4 bg-white hidden lg:block"></div>
              <Link href="/support" className="hover:text-orange-400 transition-colors text-xs lg:text-sm">Support</Link>
            </div>
            
            {/* Right Side - Email and Social Icons */}
            <div className="flex items-center justify-center lg:justify-end space-x-4">
              <div className="flex items-center space-x-2 text-xs lg:text-sm">
                <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">hello@bedoraliving.co.uk</span>
                <span className="sm:hidden">hello@bedoraliving.co.uk</span>
              </div>
              <div className="w-px h-4 bg-white hidden lg:block"></div>
              <div className="flex items-center space-x-2">
              <a href="#" className="hover:text-orange-400 transition-colors">
                  <X className="w-3 h-3 lg:w-4 lg:h-4" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                  <Instagram className="w-3 h-3 lg:w-5 lg:h-5" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                  <Facebook className="w-3 h-3 lg:w-5 lg:h-5" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                  <Youtube className="w-3 h-3 lg:w-5 lg:h-5" />
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Dark Grey Background */}
      <div className="text-white" style={{ backgroundColor: '#33373E' }}>
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between py-2 lg:py-3">
            {/* Left: Logo and Brand */}
            <Link href="/" className="flex items-center" style={{ gap: '-20px' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                <img 
                  src="/mainlogo.png" 
                  alt="Bedora Living Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`${sora.className} text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold tracking-tight whitespace-nowrap`}>Bedora Living</span>
            </Link>

            {/* Center: Search Bar - With category dropdown */}
            <div className="hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4 lg:mx-8">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 text-sm"
                />
                <div className="flex items-center border-l border-gray-200">
                  <select className="px-2 lg:px-3 py-2 text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs lg:text-sm">
                    <option>All Category</option>
                    <option>Mattresses</option>
                    <option>Beds</option>
                    <option>Sofas</option>
                    <option>Pillows</option>
                    <option>Toppers</option>
                    <option>Bunkbeds</option>
                    <option>Kids</option>
                  </select>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <div className="bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center rounded-sm" style={{ width: '64px', height: '36px', padding: '8px 12px', marginLeft: '12px', marginRight: '8px', marginTop: '4px', marginBottom: '4px' }}>
                    <Search className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info Boxes and User Icons */}
            <div className="flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
              {/* Free Shipping Box - Consistent rectangular size */}
              <div className="hidden lg:flex items-center space-x-2 lg:space-x-3 border border-white rounded-lg p-2 lg:p-3 min-w-[140px] lg:min-w-[160px]">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="text-xs lg:text-sm min-w-0">
                  <div className="font-semibold leading-tight">Free delivery</div>
                  <div className="text-gray-300 leading-tight">Most locations</div>
                </div>
              </div>

              {/* Call Us Box - Consistent rectangular size */}
              <div className="hidden xl:flex items-center space-x-2 lg:space-x-3 border border-white rounded-lg p-2 lg:p-3 min-w-[140px] lg:min-w-[160px]">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="text-xs lg:text-sm min-w-0">
                  <div className="font-semibold leading-tight">CALL US</div>
                  <div className="text-gray-300 leading-tight">03301336323</div>
                </div>
              </div>

              {/* User Icons */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Login/Logout */}
                <AuthButton />
                
                <Link href="/wishlist" className="relative hover:text-orange-400 transition-colors">
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>
                
                <div className="relative group">
                  <div 
                    className="relative hover:text-orange-400 transition-colors cursor-pointer"
                    onClick={() => window.location.href = '/cart'}
                  >
                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                    {isMounted && state.itemCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{state.itemCount}</span>
                    </div>
                    )}
                  </div>
                  
                  {/* Cart Dropdown on Hover */}
                  {isMounted && state.itemCount > 0 && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[9999]">
                      {/* Dropdown Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-900">Your Basket</h3>
                          <span className="text-lg font-bold text-gray-900">Total £{state.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Cart Items */}
                      <div className="max-h-64 overflow-y-auto">
                        {state.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <img 
                                  src={item.image || "/placeholder.svg"} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                                {item.size && (
                                  <p className="text-xs text-gray-500">Size: {item.size}</p>
                                )}
                                {item.color && (
                                  <p className="text-xs text-gray-500">Color: {item.color}</p>
                                )}
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                  <span className="text-sm font-semibold text-gray-900">£{item.currentPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {state.items.length > 3 && (
                          <div className="p-4 text-center">
                            <p className="text-sm text-gray-500">+{state.items.length - 3} more items</p>
                          </div>
                        )}
                      </div>
                      
                                      {/* Dropdown Footer */}
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  <Link 
                    href="/cart" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    View Basket
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:text-orange-400 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Visible only on mobile */}
      <div className="lg:hidden px-4 sm:px-6 py-3" style={{ backgroundColor: '#33373E' }}>
        <div className="flex items-center bg-white rounded-md overflow-hidden">
          <Input
            type="search"
            placeholder="Search..."
            className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 text-sm"
          />
          <div className="bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center rounded-sm" style={{ width: '60px', height: '36px', padding: '8px 10px', marginLeft: '10px', marginRight: '6px', marginTop: '4px', marginBottom: '4px' }}>
            <Search className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Mobile Menu - Collapsible */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`} style={{ backgroundColor: '#33373E' }}>
        <div className="px-6 sm:px-8 py-4 space-y-4">
          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link href="/mattresses" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Mattresses
            </Link>
            <Link href="/beds" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Beds
            </Link>
            <Link href="/sofas" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Sofas
            </Link>
            <Link href="/kids" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Kids
            </Link>
            <Link href="/pillows" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Pillows
            </Link>
            <Link href="/toppers" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Toppers
            </Link>
            <Link href="/bunkbeds" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              <ChevronDown className="w-4 h-4 text-gray-300" />
              Bunkbeds
            </Link>
            <Link href="/guides" className="flex items-center gap-2 hover:text-orange-400 transition-colors p-2 rounded">
              Guide
            </Link>
          </div>

          {/* Mobile Special Links */}
          <div className="space-y-3">
                          <Link href="/sale" className="flex items-center space-x-3 rounded-lg p-3 bg-gray-700">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/clearance.png" alt="Clearance" className="w-16 h-16 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                </div>
                <div className="leading-5">
                  <div className="text-sm font-semibold">SALES & CLEARANCE</div>
                  <div className="text-xs text-gray-300">Hurry! Discounts Up to 60%</div>
                </div>
              </Link>
                          <Link href="/mattress-finder" className="flex items-center space-x-3 rounded-lg p-3 bg-gray-700">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src="/quiz.png" alt="Mattress Quiz" className="w-20 h-20 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                </div>
                <div className="leading-5">
                  <div className="text-sm font-semibold whitespace-nowrap">MATTRESS QUIZ</div>
                  <div className="text-xs text-gray-300">find your perfect match</div>
                </div>
              </Link>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar - Dark Grey with Product Categories */}
      <div className="hidden lg:block text-white relative" style={{ backgroundColor: '#33373E' }}>
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Partition line above categories */}
          <div className="border-t border-gray-500 mx-4"></div>
          <div className="flex items-center justify-center pt-3 pb-1.5">
            <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 text-sm font-medium">
              {/* Mattresses Dropdown */}
              <div className={`group relative ${isOnCategoryPage && pathname.startsWith('/mattresses') ? 'opacity-50 cursor-not-allowed' : ''}`} onMouseEnter={() => handleCategoryHover('mattresses')} onMouseLeave={handleCategoryLeave}>
                <Link href="/mattresses" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/mattresses') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Mattresses <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/mattresses') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Beds Dropdown */}
              <div className={`group relative ${isOnCategoryPage && pathname.startsWith('/beds') ? 'opacity-50 cursor-not-allowed' : ''}`} onMouseEnter={() => handleCategoryHover('beds')} onMouseLeave={handleCategoryLeave}>
                <Link href="/beds" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/beds') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Beds <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/beds') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Sofas Dropdown */}
              <div 
                className={`group relative ${isOnCategoryPage && pathname.startsWith('/sofas') ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => handleCategoryHover('sofas')}
                onMouseLeave={handleCategoryLeave}
              >
                <Link href="/sofas" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/sofas') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Sofas <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/sofas') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Kids Dropdown */}
              <div className={`group relative ${isOnCategoryPage && pathname.startsWith('/kids') ? 'opacity-50 cursor-not-allowed' : ''}`} onMouseEnter={() => handleCategoryHover('kids')} onMouseLeave={handleCategoryLeave}>
                <Link href="/kids" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/kids') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Kids <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/kids') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Pillows Dropdown */}
              <div 
                className={`group relative ${isOnCategoryPage && pathname.startsWith('/pillows') ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => handleCategoryHover('pillows')}
                onMouseLeave={handleCategoryLeave}
              >
                <Link href="/pillows" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/pillows') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Pillows <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/pillows') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Toppers Dropdown */}
              <div className={`group relative ${isOnCategoryPage && pathname.startsWith('/toppers') ? 'opacity-50 cursor-not-allowed' : ''}`} onMouseEnter={() => handleCategoryHover('toppers')} onMouseLeave={handleCategoryLeave}>
                <Link href="/toppers" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/toppers') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Toppers <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/toppers') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Bunkbeds Dropdown */}
              <div 
                className={`group relative ${isOnCategoryPage && pathname.startsWith('/bunkbeds') ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => handleCategoryHover('bunkbeds')}
                onMouseLeave={handleCategoryLeave}
              >
                <Link href="/bunkbeds" className={`flex items-center gap-1 transition-colors ${isOnCategoryPage && pathname.startsWith('/bunkbeds') ? 'text-gray-400' : 'hover:text-orange-400'}`}>
                  Bunkbeds <ChevronDown className={`w-4 h-4 transition-transform ${isOnCategoryPage && pathname.startsWith('/bunkbeds') ? 'text-gray-400' : 'text-gray-300 group-hover:text-orange-400 group-hover:rotate-180'}`} />
                </Link>
                {/* Transparent bridge to prevent gap */}
                <div className="absolute top-full left-0 right-0 h-4 bg-transparent"></div>
              </div>

              {/* Guide Link */}
              <Link href="/guides" className="flex items-center gap-1 transition-colors hover:text-orange-400">
                Guide
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-600"></div>

              {/* SALES & CLEARANCE */}
              <div 
                className="relative"
                onMouseEnter={() => setSalesDropdownOpen(true)}
                onMouseLeave={() => setSalesDropdownOpen(false)}
              >
                <Link href="/sale" className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-700 transition-colors duration-200">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <img src="/clearance.png" alt="Clearance" className="w-14 h-14 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                  </div>
                  <div className="leading-5">
                    <div className="text-sm font-semibold">SALES & CLEARANCE</div>
                    <div className="text-xs text-gray-300">Hurry! Discounts Up to 60%</div>
                  </div>
                </Link>
              </div>

              {/* MATTRESS QUIZ */}
              <Link href="/mattress-finder" className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-700 transition-colors duration-200">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/quiz.png" alt="Mattress Quiz" className="w-16 h-16 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                </div>
                <div className="leading-5">
                  <div className="text-sm font-semibold whitespace-nowrap">MATTRESS QUIZ</div>
                  <div className="text-xs text-gray-300">find your perfect match</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Sales & Clearance Dropdown */}
          {salesDropdownOpen && (
            <div 
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50"
              onMouseEnter={() => setSalesDropdownOpen(true)}
              onMouseLeave={() => setSalesDropdownOpen(false)}
            >
              <div className="w-full px-4 py-6">
                <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {/* Flash Sale Image */}
                  <div className="relative group cursor-pointer">
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
                  </div>

                  {/* Clearance Items Image */}
                  <div className="relative group cursor-pointer">
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
                  </div>

                  {/* End of Season Image */}
                  <div className="relative group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src="/banner.jpg" 
                        alt="End of Season" 
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-2">END OF SEASON</h3>
                        <p className="text-base font-semibold">Up to 50% Off</p>
                        <p className="text-xs opacity-90">Final Reductions</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                        LAST CHANCE
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* View More Button */}
                <div className="text-center mt-6">
                  <Link href="/sale" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                    View All Sales & Clearance
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Product Dropdowns */}
          <div className="absolute top-full left-0 w-full z-50 transition-all duration-200">
                  {/* Mattresses Content */}
                  {activeDropdown === 'mattresses' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('mattresses')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Category Name - Left Side */}
                    <div className="col-span-1">
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Mattresses</h2>
                        {/* 3rd Product Card */}
                        {(dropdownProducts['mattresses'] || []).slice(2, 3).map((p: any) => {
                          const price = getDisplayPrice(p)
                          return (
                            <Link key={p.id} href={`/products/mattresses/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                  <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  {price.hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h4>
                                  {price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                          </div>
                    </div>

                    {/* Popular Categories - Middle Left */}
                     <div className="col-span-1">
                       <div className="grid grid-cols-3 gap-2">
                         {/* Most Cooling */}
                         <Link href="/mattresses?features=cooling" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                               <Snowflake className="h-4 w-4 text-gray-600" />
                             </div>
                             <p className="font-medium text-gray-800 text-xs">Most Cooling</p>
                        </div>
                      </Link>

                         {/* Soft Comfort */}
                         <Link href="/mattresses?firmness=soft" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <div className="flex flex-col items-center">
                                   <div className="w-3 h-3 bg-gray-500 rounded-full mb-1"></div>
                                   <Waves className="h-4 w-4 text-gray-600" />
                        </div>
                          </div>
                             <p className="font-medium text-gray-800 text-xs">Soft Comfort</p>
                        </div>
                      </Link>

                         {/* Firm Comfort */}
                         <Link href="/mattresses?firmness=firm" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <div className="flex flex-col items-center">
                                   <div className="w-3 h-3 bg-gray-500 rounded-full mb-1"></div>
                                   <div className="flex flex-col gap-1">
                                     <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                     <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                        </div>
                          </div>
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Firm Comfort</p>
                        </div>
                      </Link>

                         {/* Medium Comfort */}
                         <Link href="/mattresses?firmness=medium" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <div className="flex flex-col items-center">
                                   <div className="w-3 h-3 bg-gray-500 rounded-full mb-1"></div>
                                   <Waves className="h-4 w-4 text-gray-600" />
                        </div>
                          </div>
                             <p className="font-medium text-gray-800 text-xs">Medium Comfort</p>
                        </div>
                      </Link>

                         {/* Super Firm */}
                         <Link href="/mattresses?features=heavy-duty" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2 relative">
                                 <Bed className="h-4 w-4 text-gray-600" />
                                 <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                   240+
                                 </div>
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Super Firm</p>
                           </div>
                         </Link>

                         {/* Most Support */}
                         <Link href="/mattresses?features=extra-support" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <div className="flex flex-col items-center">
                                   <Waves className="h-4 w-4 text-gray-600 mb-1" />
                                   <div className="flex gap-1">
                                     <ArrowUp className="h-3 w-3 text-gray-600" />
                                     <ArrowUp className="h-3 w-3 text-gray-600" />
                                     <ArrowUp className="h-3 w-3 text-gray-600" />
                                   </div>
                                 </div>
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Most Support</p>
                           </div>
                         </Link>

                         {/* Luxury */}
                         <Link href="/mattresses?mattress-type=luxury" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Crown className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Luxury</p>
                           </div>
                         </Link>

                         {/* Hybrid */}
                         <Link href="/mattresses?mattress-type=hybrid" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Cpu className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="text-xs font-medium text-gray-800">Hybrid</p>
                           </div>
                         </Link>

                         {/* Pocket Sprung */}
                         <Link href="/mattresses?mattress-type=foam" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <div className="flex flex-col gap-1">
                                   <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                   <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                   <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                 </div>
                               </div>
                             <p className="text-xs font-medium text-gray-800">Pocket Sprung</p>
                           </div>
                         </Link>

                         {/* Coil Sprung */}
                         <Link href="/mattresses?mattress-type=latex" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Waves className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Coil Sprung</p>
                           </div>
                         </Link>

                         {/* Kids */}
                         <Link href="/mattresses?mattress-type=kids" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Baby className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Kids</p>
                           </div>
                         </Link>

                         {/* Memory Foam */}
                         <Link href="/mattresses?mattress-type=standard-foam" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Layers className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Memory Foam</p>
                           </div>
                         </Link>

                         {/* Latex Foam */}
                         <Link href="/mattresses?mattress-type=latex-foam" className="block">
                           <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                             <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                 <Leaf className="h-4 w-4 text-gray-600" />
                               </div>
                             <p className="font-medium text-gray-800 text-xs">Latex Foam</p>
                           </div>
                         </Link>
                       </div>
                     </div>

                    {/* Mattress Types - Middle */}
                    <div className="col-span-1">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-3">Mattress Types</h3>
                        
                        <Link href="/mattresses?mattress-type=hybrid" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Hybrid Mattresses
                      </Link>

                        <Link href="/mattresses?mattress-type=foam" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Memory Foam
                      </Link>

                        <Link href="/mattresses?mattress-type=latex" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Pocket Sprung
                      </Link>

                        <Link href="/mattresses?mattress-type=standard-foam" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Coil Sprung
                      </Link>
                        
                        <Link href="/mattresses?mattress-type=luxury" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Luxury Mattresses
                        </Link>

                        <Link href="/mattresses?mattress-type=kids" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Kids Mattresses
                        </Link>

                        <Link href="/mattresses?mattress-type=latex-foam" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Latex Foam
                        </Link>

                        <Link href="/mattresses?features=orthopedic" className="block text-sm text-gray-700 hover:text-orange-600 transition-colors">
                          Orthopedic
                        </Link>
                      </div>
                    </div>


                    {/* Dynamic Products (2 for mattresses) */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        {(dropdownProducts['mattresses'] || []).slice(0,2).map((p: any) => {
                          const price = getDisplayPrice(p)
                          return (
                            <Link key={p.id} href={`/products/mattresses/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                  <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  {price.hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h4>
                                  {price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/mattresses" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Mattresses
                      <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Beds Content */}
                  {activeDropdown === 'beds' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('beds')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Category Name - Left Side */}
                    <div className="col-span-1">
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Beds</h2>
                        {/* 3rd Product Card */}
                        {(dropdownProducts['beds'] || []).slice(2, 3).map((p: any) => {
                          const price = getDisplayPrice(p)
                          return (
                            <Link key={p.id} href={`/products/beds/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                  <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  {price.hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h4>
                                  {price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                          </div>
                    </div>

                    {/* Popular Categories - Middle Left */}
                    <div className="col-span-1">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Luxury Beds */}
                        <Link href="/beds?bed-type=luxury" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Crown className="h-4 w-4 text-gray-600" />
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Luxury Beds</p>
                            <p className="text-xs text-gray-500">15 Items</p>
                        </div>
                      </Link>

                        {/* Fabric Beds */}
                        <Link href="/beds?bed-type=fabric" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2 relative">
                              <div className="w-6 h-6 bg-gray-500 rounded-full opacity-20"></div>
                              <div className="absolute w-4 h-4 bg-gray-500 rounded-full"></div>
                        </div>
                            <p className="font-medium text-gray-800 text-xs">Fabric Beds</p>
                            <p className="text-xs text-gray-500">22 Items</p>
                          </div>
                        </Link>

                        {/* Wooden Beds */}
                        <Link href="/beds?bed-type=wooden" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                                <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Wooden Beds</p>
                            <p className="text-xs text-gray-500">18 Items</p>
                        </div>
                      </Link>

                        {/* Children Beds */}
                        <Link href="/beds?bed-type=children" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Baby className="h-4 w-4 text-gray-600" />
                        </div>
                            <p className="font-medium text-gray-800 text-xs">Children Beds</p>
                            <p className="text-xs text-gray-500">12 Items</p>
                          </div>
                        </Link>

                        {/* Bunk Beds */}
                        <Link href="/beds?bed-type=bunk" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="w-6 h-2 bg-gray-500 rounded"></div>
                                <div className="w-6 h-2 bg-gray-500 rounded"></div>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Bunk Beds</p>
                            <p className="text-xs text-gray-500">8 Items</p>
                        </div>
                      </Link>

                        {/* Sofa Beds */}
                        <Link href="/beds?bed-type=sofa" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                        </div>
                            <p className="font-medium text-gray-800 text-xs">Sofa Beds</p>
                            <p className="text-xs text-gray-500">14 Items</p>
                          </div>
                        </Link>

                        {/* Storage Beds */}
                        <Link href="/beds?bed-type=storage" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded border-2 border-gray-300"></div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Storage Beds</p>
                            <p className="text-xs text-gray-500">16 Items</p>
                        </div>
                      </Link>

                        {/* Ottoman Beds */}
                        <Link href="/beds?bed-type=ottoman" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded-full"></div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Ottoman Beds</p>
                            <p className="text-xs text-gray-500">11 Items</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Bed Types - Middle */}
                    <div className="col-span-1">
                      <div className="space-y-3">
                        {/* Storage Beds */}
                        <Link href="/beds?features=storage" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">Storage Beds</p>
                                <p className="text-xs text-gray-600 font-medium">Space Saving</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Platform Beds */}
                        <Link href="/beds?style=platform" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">Platform Beds</p>
                                <p className="text-xs text-gray-600 font-medium">Modern Design</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Adjustable Beds */}
                        <Link href="/beds?features=adjustable" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">Adjustable Beds</p>
                                <p className="text-xs text-gray-600 font-medium">Custom Comfort</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Canopy Beds */}
                        <Link href="/beds?style=canopy" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">Canopy Beds</p>
                                <p className="text-xs text-gray-600 font-medium">Elegant Style</p>
                              </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    </div>

                    {/* Dynamic Products (2 for beds) */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        {(dropdownProducts['beds'] || []).slice(0,2).map((p: any) => (
                          <Link key={p.id} href={`/products/beds/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                {(() => {
                                  const price = getDisplayPrice(p)
                                  return price.hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                    </div>
                                  )
                                })()}
                            </div>
                            <div className="p-3">
                                <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                                {(() => {
                                  const price = getDisplayPrice(p)
                                  return price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700 mb-2">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )
                                })()}
                            </div>
                          </div>
                        </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/beds" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Beds
                      <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Sofas Content */}
                  {activeDropdown === 'sofas' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('sofas')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Category Name - Left Side */}
                    <div className="col-span-1">
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Sofas</h2>
                        {/* 3rd Product Card */}
                        {(dropdownProducts['sofas'] || []).slice(2, 3).map((p: any) => (
                          <Link key={p.id} href={`/products/sofas/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h4>
                                {p.current_price != null && (
                                  <p className="text-xs text-gray-700">£{Number(p.current_price).toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Popular Categories - Middle Left */}
                    <div className="col-span-1">
                                            <div className="grid grid-cols-3 gap-2">
                        {/* L Shape Sofa */}
                        <Link href="/sofas?sofa-type=l-shape" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                              <div className="w-4 h-6 bg-gray-500 rounded ml-2"></div>
                        </div>
                            <p className="font-medium text-gray-800 text-xs">L Shape Sofa</p>
                          </div>
                      </Link>

                        {/* 3 Seater Sofa */}
                        <Link href="/sofas?sofa-type=3-seater" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                        </div>
                            <p className="font-medium text-gray-800 text-xs">3 Seater Sofa</p>
                        </div>
                      </Link>

                        {/* Sofa Bed */}
                        <Link href="/sofas?sofa-type=sofa-bed" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                              <div className="w-6 h-1 bg-gray-500 rounded mt-1"></div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Sofa Bed</p>
                        </div>
                      </Link>

                        {/* 2 Seater Sofa */}
                        <Link href="/sofas?sofa-type=2-seater" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-5 h-4 bg-gray-500 rounded"></div>
                        </div>
                            <p className="text-xs font-medium text-gray-800">2 Seater Sofa</p>
                          </div>
                        </Link>

                        {/* Recliner Sofa */}
                        <Link href="/sofas?sofa-type=recliner" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                              <div className="w-6 h-1 bg-gray-500 rounded mt-1 transform rotate-12"></div>
                            </div>
                            <p className="text-xs font-medium text-gray-800">Recliner Sofa</p>
                        </div>
                      </Link>

                        {/* Corner Sofa */}
                        <Link href="/sofas?sofa-type=corner" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-4 h-4 bg-gray-500 rounded"></div>
                              <div className="w-4 h-4 bg-gray-500 rounded ml-2"></div>
                              <div className="w-4 h-4 bg-gray-500 rounded mt-2"></div>
                        </div>
                            <p className="text-xs font-medium text-gray-800">Corner Sofa</p>
                          </div>
                        </Link>

                        {/* Fabric Sofa */}
                        <Link href="/sofas?sofa-material=fabric" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded opacity-80"></div>
                              <div className="w-6 h-1 bg-gray-500 rounded mt-1 opacity-60"></div>
                            </div>
                            <p className="text-xs font-medium text-gray-800">Fabric Sofa</p>
                        </div>
                      </Link>

                        {/* Leather Sofa */}
                        <Link href="/sofas?sofa-material=leather" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded border-2 border-gray-300"></div>
                            </div>
                            <p className="text-xs font-medium text-gray-800">Leather Sofa</p>
                          </div>
                        </Link>





                        {/* Clearance */}
                        <Link href="/sofas?status=clearance" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-gray-800">Clearance</p>
                          </div>
                        </Link>

                        {/* Sale */}
                        <Link href="/sofas?status=sale" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">S</span>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Sale</p>
                            <p className="text-xs text-gray-500">12 Items</p>
                          </div>
                        </Link>

                        {/* New In */}
                        <Link href="/sofas?status=new" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">N</span>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-gray-800">New In</p>
                            <p className="text-xs text-gray-500">8 Items</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Sofa Features - Middle */}
                    <div className="col-span-1">

                      <div className="space-y-3">
                        {/* Fabric */}
                        <Link href="/sofas?material=fabric" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                        </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">Fabric</p>
                                <p className="text-xs text-gray-600">Soft & Durable</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Leather */}
                        <Link href="/sofas?material=leather" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                        </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">Leather</p>
                                <p className="text-xs text-gray-600">Premium Quality</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Storage */}
                        <Link href="/sofas?features=storage" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                        </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">Storage</p>
                                <p className="text-xs text-gray-600">Hidden Compartments</p>
                              </div>
                          </div>
                        </div>
                      </Link>

                        {/* Convertible */}
                        <Link href="/sofas?features=convertible" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">Convertible</p>
                                <p className="text-xs text-gray-600">Sofa Bed</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Dynamic Products (2 for sofas) */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        {(dropdownProducts['sofas'] || []).slice(0,2).map((p: any) => (
                          <Link key={p.id} href={`/products/sofas/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                {(() => {
                                  const price = getDisplayPrice(p)
                                  return price.hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                    </div>
                                  )
                                })()}
                            </div>
                            <div className="p-3">
                                <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                                {(() => {
                                  const price = getDisplayPrice(p)
                                  return price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700 mb-2">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )
                                })()}
                            </div>
                          </div>
                        </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/sofas" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Sofas
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Pillows Content */}
                  {activeDropdown === 'pillows' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('pillows')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-4 gap-4">
                    {(dropdownProducts['pillows'] || []).slice(0,4).map((p: any) => (
                      <Link key={p.id} href={`/products/pillows/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {(() => {
                              const price = getDisplayPrice(p)
                              return price.hasDiscount && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                </div>
                              )
                            })()}
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                            {p.current_price != null && (
                              <p className="text-sm text-gray-700 mb-2">£{Number(p.current_price).toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/pillows" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Pillows
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Toppers Content */}
                  {activeDropdown === 'toppers' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('toppers')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-4 gap-4">
                    {(dropdownProducts['toppers'] || []).slice(0,4).map((p: any) => (
                      <Link key={p.id} href={`/products/toppers/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {(() => {
                              const price = getDisplayPrice(p)
                              return price.hasDiscount && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                </div>
                              )
                            })()}
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                            {p.current_price != null && (
                              <p className="text-sm text-gray-700 mb-2">£{Number(p.current_price).toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/toppers" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Toppers
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Bunkbeds Content */}
                  {activeDropdown === 'bunkbeds' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('bunkbeds')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-4 gap-4">
                    {(dropdownProducts['bunkbeds'] || []).slice(0,4).map((p: any) => (
                      <Link key={p.id} href={`/products/bunkbeds/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {(() => {
                              const price = getDisplayPrice(p)
                              return price.hasDiscount && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  {p.discount_percentage ? `${p.discount_percentage}% OFF` : 'SALE'}
                                </div>
                              )
                            })()}
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                            {p.current_price != null && (
                              <p className="text-sm text-gray-700 mb-2">£{Number(p.current_price).toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/bunkbeds" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Bunkbeds
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                    </div>
                  )}

                  {/* Kids Content */}
                  {activeDropdown === 'kids' && !isOnCategoryPage && (
              <div 
                className="w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in duration-200"
                onMouseEnter={() => handleCategoryHover('kids')}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="w-full px-4 py-6">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Category Name - Left Side */}
                    <div className="col-span-1">
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Kids</h2>
                        {/* 3rd Product Card */}
                        {(dropdownProducts['kids'] || []).slice(2, 3).map((p: any) => (
                          <Link key={p.id} href={`/products/kids/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h4>
                                {p.current_price != null && (
                                  <p className="text-xs text-gray-700">£{Number(p.current_price).toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                          </div>
                    </div>

                    {/* Popular Categories - Middle Left */}
                    <div className="col-span-1">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Kids Mattresses */}
                        <Link href="/kids?kids-category=mattresses" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                              <div className="w-6 h-1 bg-gray-500 rounded mt-1"></div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Mattresses</p>
                            <p className="text-xs text-gray-500">15 Items</p>
                        </div>
                      </Link>

                        {/* Kids Beds */}
                        <Link href="/kids?kids-category=beds" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-4 bg-gray-500 rounded"></div>
                        </div>
                            <p className="font-medium text-gray-800 text-xs">Beds</p>
                            <p className="text-xs text-gray-500">20 Items</p>
                          </div>
                        </Link>

                        {/* Kids Bunk Beds */}
                        <Link href="/kids?kids-category=bunkbeds" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="w-6 h-2 bg-gray-500 rounded"></div>
                                <div className="w-6 h-2 bg-gray-500 rounded"></div>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Bunk Beds</p>
                            <p className="text-xs text-gray-500">12 Items</p>
                        </div>
                      </Link>

                        {/* New In */}
                        <Link href="/kids?kids-status=new" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">N</span>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">New In</p>
                            <p className="text-xs text-gray-500">8 Items</p>
                          </div>
                        </Link>

                        {/* Clearance */}
                        <Link href="/kids?kids-status=clearance" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Clearance</p>
                            <p className="text-xs text-gray-500">6 Items</p>
                          </div>
                        </Link>

                        {/* Sale */}
                        <Link href="/kids?kids-status=sale" className="block">
                          <div className="bg-white rounded-lg p-2 border border-white hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">S</span>
                              </div>
                            </div>
                            <p className="font-medium text-gray-800 text-xs">Sale</p>
                            <p className="text-xs text-gray-500">10 Items</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Kids Features - Middle */}
                    <div className="col-span-1">
                      <div className="space-y-3">
                        <Link href="/kids?features=safety" className="block">
                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-white hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">Safety</p>
                                <p className="text-xs text-gray-600">Child Safe</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Dynamic Products (2 for kids) */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        {(dropdownProducts['kids'] || []).slice(0,2).map((p: any) => (
                          <Link key={p.id} href={`/products/kids/${p.id}`} target="_blank" rel="noopener noreferrer" className="group">
                          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-white">
                            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={p.custom_image || p.product_images?.[0]?.image_url || '/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4">
                                <h4 className="font-semibold text-gray-900 text-xs mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                                {(() => {
                                  const price = getDisplayPrice(p)
                                  return price.current != null && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-gray-700 mb-2">£{Number(price.current).toFixed(2)}</p>
                                      {price.hasDiscount && price.original && (
                                        <p className="text-xs text-gray-400 line-through">£{Number(price.original).toFixed(2)}</p>
                                      )}
                                    </div>
                                  )
                                })()}
                          </div>
                        </div>
                      </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-6">
                    <Link href="/kids" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      View All Kids
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                    </div>
                  )}

          </div>
        </div>
      </div>

    </header>
  )
}


