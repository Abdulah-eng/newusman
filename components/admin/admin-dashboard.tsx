"use client"

import { useState } from 'react'
import { Settings, Bed, Sofa, Star, Users, BookOpen, Boxes } from 'lucide-react'
import { HomepageManagement } from './homepage-management'
import { ProductManagement } from './product-management'
import ProductsTable from './products-table'

const navigationItems = [
  { id: 'homepage', label: 'Homepage', icon: Settings },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'mattresses', label: 'Mattresses', icon: Bed },
  { id: 'beds', label: 'Beds', icon: Bed },
  { id: 'sofas', label: 'Sofas', icon: Sofa },
  { id: 'pillows', label: 'Pillows', icon: Star },
  { id: 'toppers', label: 'Toppers', icon: Star },
  { id: 'bunkbeds', label: 'Bunkbeds', icon: Bed },
  { id: 'kids', label: 'Kids', icon: Users },
  { id: 'guides', label: 'Guides', icon: BookOpen },
]

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('homepage')

  // Bridge: when the products table asks to edit a product, switch to its category
  if (typeof window !== 'undefined') {
    window.removeEventListener('admin-edit-bridge', () => {})
    window.addEventListener('admin:edit-product', (e: any) => {
      const row = e.detail
      if (!row?.category) return
      setActiveSection(row.category)
      // Optionally could broadcast selected product id here as well
    })
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'homepage':
        return <HomepageManagement />
      case 'products':
        return <ProductsTable />
      case 'mattresses':
      case 'beds':
      case 'sofas':
      case 'pillows':
      case 'toppers':
      case 'bunkbeds':
      case 'kids':
      case 'guides':
        return <ProductManagement category={activeSection} />
      default:
        return <HomepageManagement />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}
