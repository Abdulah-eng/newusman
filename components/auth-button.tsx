"use client"

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useManagerAuth } from '@/lib/manager-auth-context'
import { ArrowRight, Crown, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function AuthButton() {
  const { user, loading, signOut } = useAuth()
  const { manager, logout: managerLogout, forceLogout } = useManagerAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      console.log('🔄 AuthButton logout triggered')
      
      // Check if we're in admin area and user is a manager
      if (pathname.startsWith('/admin') && manager) {
        console.log('🔄 Manager logout from header')
        await managerLogout()
        // The managerLogout function will handle the redirect
      } else if (pathname.startsWith('/admin') && !manager) {
        // If we're in admin area but no manager, force logout
        console.log('🔄 Force logout from admin area')
        await forceLogout()
      } else {
        // Regular customer logout
        console.log('🔄 Customer logout from header')
        await signOut()
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('❌ Header logout error:', error)
      // Force redirect even if logout fails
      if (typeof window !== 'undefined') {
        if (pathname.startsWith('/admin')) {
          // Use force logout for admin area
          await forceLogout()
        } else {
          window.location.reload()
        }
      }
    }
  }

  // Show loading state
  if (loading) return null

  // If user is logged in (either customer or manager)
  if (user || manager) {
    return (
      <button onClick={handleLogout} className="hidden sm:flex items-center space-x-2 hover:text-orange-400 transition-colors">
        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-700 rounded-lg flex items-center justify-center">
          {manager ? (
            manager.role === 'admin' ? (
              <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-red-500" />
            ) : (
              <User className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
            )
          ) : (
            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 rotate-180" />
          )}
        </div>
        <span className="text-xs lg:text-sm">
          {manager ? `Logout (${manager.role})` : 'Logout'}
        </span>
      </button>
    )
  }

  // Show login button
  return (
    <Link 
      href={pathname.startsWith('/admin') ? '/admin/login' : '/login'} 
      className="hidden sm:flex items-center space-x-2 hover:text-orange-400 transition-colors"
    >
      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-700 rounded-lg flex items-center justify-center">
        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
      </div>
      <span className="text-xs lg:text-sm">Login</span>
    </Link>
  )
}


