"use client"

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight } from 'lucide-react'

export function AuthButton() {
  const { user, loading, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    // optional: refresh page
    if (typeof window !== 'undefined') window.location.reload()
  }

  if (loading) return null

  if (user) {
    return (
      <button onClick={handleLogout} className="hidden sm:flex items-center space-x-2 hover:text-orange-400 transition-colors">
        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-700 rounded-lg flex items-center justify-center">
          <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 rotate-180" />
        </div>
        <span className="text-xs lg:text-sm">Logout</span>
      </button>
    )
  }

  return (
    <Link href="/login" className="hidden sm:flex items-center space-x-2 hover:text-orange-400 transition-colors">
      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-700 rounded-lg flex items-center justify-center">
        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
      </div>
      <span className="text-xs lg:text-sm">Login</span>
    </Link>
  )
}


