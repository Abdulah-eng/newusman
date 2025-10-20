"use client"

import { ReactNode, useEffect } from 'react'
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
  Moon
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { manager, logout, loading, isAdmin, isManager } = useManagerAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !manager && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [manager, loading, pathname, router])

  const handleLogout = async () => {
    try {
      logout()
      toast({
        title: "Success",
        description: "Logged out successfully"
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: Home, allowedRoles: ['admin', 'manager'] },
    { name: 'Products', href: '/admin/products', icon: Package, allowedRoles: ['admin', 'manager'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, allowedRoles: ['admin'] }, // Only admin can see orders
    { name: 'Manager Accounts', href: '/admin/manager-accounts', icon: UserPlus, allowedRoles: ['admin'] },
    { name: 'Homepage', href: '/admin/homepage', icon: BarChart3, allowedRoles: ['admin', 'manager'] },
    { name: 'Header Dropdown', href: '/admin/header-dropdown', icon: FileText, allowedRoles: ['admin', 'manager'] },
    { name: 'Promotional Banners', href: '/admin/promotional-banners', icon: Image, allowedRoles: ['admin', 'manager'] },
    { name: 'Promotional Popup', href: '/admin/promotional-popup', icon: MessageSquare, allowedRoles: ['admin', 'manager'] },
    { name: 'Quiz Recommendations', href: '/admin/quiz-recommendations', icon: HelpCircle, allowedRoles: ['admin', 'manager'] },
    { name: 'Sleep Luxury', href: '/admin/sleep-luxury', icon: Moon, allowedRoles: ['admin', 'manager'] },
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
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Bedora Admin</span>
            </div>
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
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {manager?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {manager?.email}
                </p>
                <p className="text-xs text-orange-600 font-medium capitalize">
                  {manager?.role}
                </p>
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
      <div className="pl-64">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  )
}


