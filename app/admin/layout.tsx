"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useManagerAuth } from '@/lib/manager-auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Home, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  UserPlus,
  ShoppingCart,
  BarChart3,
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Moon,
  Menu,
  X,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { manager, logout, loading, isAdmin, isManager } = useManagerAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start with sidebar closed for better UX

  useEffect(() => {
    if (!loading && !manager && pathname !== '/admin/login') {
      console.log('🔄 Redirecting to login - no manager found')
      router.push('/admin/login')
    }
  }, [manager, loading, pathname, router])

  // Handle successful login navigation
  useEffect(() => {
    if (manager && !loading && pathname === '/admin/login') {
      console.log('✅ Manager logged in, redirecting to dashboard')
      router.push('/admin')
    }
  }, [manager, loading, pathname, router])

  const handleLogout = async () => {
    try {
      console.log('🔄 Admin layout logout triggered')
      await logout()
      toast({
        title: "Success",
        description: "Logged out successfully"
      })
      // The logout function will handle the redirect
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive"
      })
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: Home, allowedRoles: ['admin', 'manager'] },
    { name: 'Products', href: '/admin/products', icon: Package, allowedRoles: ['admin', 'manager'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, allowedRoles: ['admin'] }, // Only admin can see orders
    { name: 'Reviews', href: '/admin/reviews', icon: Star, allowedRoles: ['admin'] }, // Only admin can see reviews
    { name: 'Manager Accounts', href: '/admin/manager-accounts', icon: UserPlus, allowedRoles: ['admin'] },
    { name: 'Homepage', href: '/admin/homepage', icon: BarChart3, allowedRoles: ['admin', 'manager'] },
    { name: 'Header Dropdown', href: '/admin/header-dropdown', icon: FileText, allowedRoles: ['admin', 'manager'] },
    { name: 'Promotional Banners', href: '/admin/promotional-banners', icon: Image, allowedRoles: ['admin', 'manager'] },
    { name: 'Promotional Popup', href: '/admin/promotional-popup', icon: MessageSquare, allowedRoles: ['admin', 'manager'] },
    { name: 'Quiz Recommendations', href: '/admin/quiz-recommendations', icon: HelpCircle, allowedRoles: ['admin', 'manager'] },
    { name: 'Sleep Luxury', href: '/admin/sleep-luxury', icon: Moon, allowedRoles: ['admin', 'manager'] },
    { name: 'News Management', href: '/admin/news', icon: FileText, allowedRoles: ['admin', 'manager'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, allowedRoles: ['admin', 'manager'] },
  ]

  const filteredNavigationItems = navigationItems.filter(item => 
    manager && item.allowedRoles.includes(manager.role)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!manager && pathname !== '/admin/login') {
    return null // Will redirect to login
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              {/* Hamburger menu button replacing B icon */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                  sidebarOpen 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Menu className="h-4 w-4 text-white group-hover:text-white" />
              </button>
              <span className="ml-2 text-xl font-bold text-gray-900">Bedora Admin</span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                manager?.role === 'admin' 
                  ? 'bg-red-100' 
                  : 'bg-blue-100'
              }`}>
                {manager?.role === 'admin' ? (
                  <Users className="h-4 w-4 text-red-600" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {manager?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {manager?.email}
                </p>
                <div className="flex items-center space-x-1">
                  <p className={`text-xs font-medium capitalize ${
                    manager?.role === 'admin' 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                  }`}>
                    {manager?.role}
                  </p>
                  {manager?.role === 'admin' && (
                    <span className="text-xs text-red-500">👑</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Top bar with hamburger menu */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-md transition-all duration-200 group ${
                sidebarOpen 
                  ? 'bg-red-100 hover:bg-red-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu className={`h-5 w-5 transition-colors ${
                sidebarOpen 
                  ? 'text-red-600 group-hover:text-red-700' 
                  : 'text-gray-600 group-hover:text-gray-800'
              }`} />
            </button>
            
            {/* Page title or other header content can go here */}
            <div className="flex-1"></div>
          </div>
        </div>
        
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
