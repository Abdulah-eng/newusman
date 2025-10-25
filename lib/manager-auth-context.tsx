"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Session } from '@supabase/supabase-js'
import { getAuthErrorMessage, isRateLimitError } from './auth-utils'

interface Manager {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager'
  is_active: boolean
  created_at: string
  last_login?: string
}

interface ManagerAuthContextType {
  manager: Manager | null
  loading: boolean
  login: (email: string, password: string, expectedRole?: 'admin' | 'manager') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  forceLogout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  isAdmin: boolean
  isManager: boolean
}

const ManagerAuthContext = createContext<ManagerAuthContextType | undefined>(undefined)

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)
  const supabase = useMemo(() => createClientComponentClient(), [])

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log('⏰ Auth timeout - setting loading to false')
        setLoading(false)
      }
    }, 5000) // Increased timeout for better reliability

    // Check for existing session first (avoid unnecessary API calls)
    const checkExistingSession = async () => {
      if (sessionChecked) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('🔍 Found existing session for:', session.user.email)
          await handleUserSession(session.user, isMounted, timeoutId)
        } else {
          console.log('ℹ️  No existing session found')
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ Error checking session:', error)
        setLoading(false)
      }
      setSessionChecked(true)
    }

    // Handle user session with optimized logic
    const handleUserSession = async (user: any, isMounted: boolean, timeoutId: NodeJS.Timeout) => {
      try {
        // Special bypass for mabdulaharshad@gmail.com
        if (user.email === 'mabdulaharshad@gmail.com') {
          console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com')
          const bypassManager = {
            id: user.id,
            email: user.email,
            full_name: 'Mabdulaharshad',
            role: 'admin' as const,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setManager(bypassManager)
          setLoading(false)
          clearTimeout(timeoutId)
          return
        }
        
        // For other users, check managers table with caching
        const cacheKey = `manager_${user.email}`
        const cachedManager = localStorage.getItem(cacheKey)
        
        if (cachedManager) {
          try {
            const managerData = JSON.parse(cachedManager)
            // Check if cache is still valid (less than 5 minutes old)
            if (Date.now() - managerData.cachedAt < 5 * 60 * 1000) {
              console.log('📦 Using cached manager data for:', user.email)
              setManager(managerData)
              setLoading(false)
              clearTimeout(timeoutId)
              return
            }
          } catch (e) {
            // Invalid cache, continue with fresh lookup
          }
        }
        
        // Fresh lookup with timeout protection
        console.log('🔍 Fresh manager lookup for:', user.email)
        const { data: managerData, error: managerError } = await supabase
          .from('managers')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single()

        if (managerData && !managerError) {
          console.log('✅ Manager authenticated:', managerData.email, 'Role:', managerData.role)
          setManager(managerData)
          
          // Cache the result
          const cacheData = { ...managerData, cachedAt: Date.now() }
          localStorage.setItem(cacheKey, JSON.stringify(cacheData))
          
          setLoading(false)
          clearTimeout(timeoutId)
        } else {
          console.log('❌ Manager not found in database for:', user.email)
          setManager(null)
          setLoading(false)
          clearTimeout(timeoutId)
        }
      } catch (error) {
        console.error('❌ Error in handleUserSession:', error)
        setManager(null)
        setLoading(false)
        clearTimeout(timeoutId)
      }
    }

    // Listen for auth changes (this handles both initial session and changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        console.log('🔍 Current manager state:', manager)
        console.log('🔍 Loading state:', loading)
        
        if (session?.user) {
          await handleUserSession(session.user, isMounted, timeoutId)
        } else {
          console.log('ℹ️  No user in session')
          setManager(null)
          setLoading(false)
          clearTimeout(timeoutId)
        }
      }
    )

    // Initialize session check
    checkExistingSession()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  // Helper function to force sign out
  const forceSignOut = async (email: string) => {
    try {
      console.log('🔄 Force signing out user:', email)
      
      // Clear manager state first
      setManager(null)
      
      // Try to sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        
        // Force redirect to login
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('❌ Force sign out failed:', error)
      // Even if sign out fails, clear everything and redirect
      setManager(null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/admin/login'
      }
    }
  }

  const login = async (email: string, password: string, expectedRole?: 'admin' | 'manager') => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      // Check for rate limit in localStorage
      const rateLimitKey = `rate_limit_${email}`
      const lastAttempt = localStorage.getItem(rateLimitKey)
      if (lastAttempt && Date.now() - parseInt(lastAttempt) < 30000) { // 30 second cooldown
        return { 
          success: false, 
          error: 'Please wait 30 seconds before trying again to avoid rate limits.' 
        }
      }
      
      // Record attempt time
      localStorage.setItem(rateLimitKey, Date.now().toString())
      
      // Special bypass for mabdulaharshad@gmail.com
      if (email.toLowerCase() === 'mabdulaharshad@gmail.com') {
        console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com')
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password
        })

        if (error) {
          return { 
            success: false, 
            error: getAuthErrorMessage(error)
          }
        }

        return { success: true }
      }

      // For other users, check managers table first (avoid unnecessary auth calls)
      const { data: managerData, error: managerError } = await supabase
        .from('managers')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single()

      if (managerError || !managerData) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Check if the user's role matches the expected role
      if (expectedRole && managerData.role !== expectedRole) {
        return { 
          success: false, 
          error: `This account is registered as ${managerData.role}, but you're trying to login as ${expectedRole}. Please choose the correct login type.` 
        }
      }

      // Only attempt auth if manager exists and is valid
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      })

      if (error) {
        return { 
          success: false, 
          error: getAuthErrorMessage(error)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      console.log('🔄 Logging out manager...')
      
      // Clear manager state first to prevent stuck state
      setManager(null)
      
      // Clear all authentication caches
      if (typeof window !== 'undefined') {
        // Clear manager caches
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('manager_') || key.startsWith('rate_limit_')) {
            localStorage.removeItem(key)
          }
        })
      }
      
      // Try to sign out from Supabase auth
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('❌ Supabase logout error:', error)
        } else {
          console.log('✅ Supabase logout successful')
        }
      } catch (signOutError) {
        console.error('❌ Supabase signOut failed:', signOutError)
      }
      
      // Force clear all storage and redirect
      if (typeof window !== 'undefined') {
        // Clear all localStorage
        localStorage.clear()
        
        // Clear all sessionStorage
        sessionStorage.clear()
        
        // Force redirect to login page
        console.log('🔄 Redirecting to login page...')
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Even if there's an error, clear the local state and redirect
      setManager(null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/admin/login'
      }
    }
  }

  // Force logout function that can be called from anywhere
  const forceLogout = async () => {
    console.log('🚨 Force logout triggered')
    setManager(null)
    setLoading(false)
    
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('❌ Force logout signOut error:', error)
    }
    
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/admin/login'
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Update password in Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Password change error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const isAdmin = manager?.role === 'admin'
  const isManager = manager?.role === 'manager' || manager?.role === 'admin'

  const value: ManagerAuthContextType = {
    manager,
    loading,
    login,
    logout,
    forceLogout,
    changePassword,
    isAdmin,
    isManager
  }

  return (
    <ManagerAuthContext.Provider value={value}>
      {children}
    </ManagerAuthContext.Provider>
  )
}

export function useManagerAuth() {
  const context = useContext(ManagerAuthContext)
  if (context === undefined) {
    throw new Error('useManagerAuth must be used within a ManagerAuthProvider')
  }
  return context
}
