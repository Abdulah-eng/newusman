"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Plus, 
  Settings, 
  BarChart3, 
  ShoppingCart,
  Users,
  FileText
} from 'lucide-react'

const navItems = [
  {
    href: '/admin',
    label: 'Add Product',
    icon: Plus,
    description: 'Create new products'
  },
  {
    href: '/admin/products',
    label: 'Manage Products',
    icon: Package,
    description: 'View, edit, and delete products'
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingCart,
    description: 'Manage customer orders'
  },
  {
    href: '/admin/stats',
    label: 'Analytics',
    icon: BarChart3,
    description: 'View sales and performance data'
  },
  {
    href: '/admin/customers',
    label: 'Customers',
    icon: Users,
    description: 'Manage customer accounts'
  },
  {
    href: '/admin/homepage',
    label: 'Homepage Content',
    icon: FileText,
    description: 'Manage homepage sections and content'
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configure system settings'
  }
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex flex-col items-center py-4 px-2 border-b-2 transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
