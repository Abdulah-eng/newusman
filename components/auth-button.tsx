"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowRight } from 'lucide-react'

export function AuthButton() {
  const supabase = createClientComponentClient()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!ignore) setLoggedIn(Boolean(data.session))
      setLoading(false)
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(Boolean(session))
    })
    return () => { sub.subscription.unsubscribe(); ignore = true }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // optional: refresh page
    if (typeof window !== 'undefined') window.location.reload()
  }

  if (loading) return null

  if (loggedIn) {
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


