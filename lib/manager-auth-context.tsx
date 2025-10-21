"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Session } from '@supabase/supabase-js'

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
    }, 3000) // Reduced to 3 second timeout

    // Listen for auth changes (this handles both initial session and changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        console.log('🔍 Current manager state:', manager)
        console.log('🔍 Loading state:', loading)
        
        if (session?.user) {
          try {
            console.log('🔍 Checking manager status for:', session.user.email)
            
            // Special bypass for mabdulaharshad@gmail.com
            if (session.user.email === 'mabdulaharshad@gmail.com') {
              console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com')
              const bypassManager = {
                id: session.user.id,
                email: session.user.email,
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
            
            // Get manager details for other users with improved error handling
            console.log('🔍 Querying managers table for:', session.user.email)
            
            // Try to get manager data with timeout
            let managerData = null
            let error = null
            
            try {
              const queryPromise = supabase
            .from('managers')
            .select('*')
            .eq('email', session.user.email)
            .eq('is_active', true)
            .single()

              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 1500)
              )

              const result = await Promise.race([queryPromise, timeoutPromise])
              managerData = result.data
              error = result.error
              
              console.log('📊 Manager query result:', { managerData, error })

          if (managerData && !error) {
                console.log('✅ Manager authenticated:', managerData.email, 'Role:', managerData.role)
            setManager(managerData)
        setLoading(false)
                clearTimeout(timeoutId)
                return
              }
            } catch (timeoutError) {
              console.error('❌ Database query timed out:', timeoutError)
              error = timeoutError
            }
            
            // If first query failed, try without is_active filter
            if (!managerData || error) {
              try {
                console.log('🔄 Trying query without is_active filter...')
                const allQueryPromise = supabase
            .from('managers')
            .select('*')
            .eq('email', session.user.email)
            .single()

                const allTimeoutPromise = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Database query timeout')), 1500)
                )

                const allResult = await Promise.race([allQueryPromise, allTimeoutPromise])
                console.log('📋 All manager data (including inactive):', allResult)
                
                if (allResult.data && !allResult.error) {
                  const allManagerData = allResult.data
                  console.log('⚠️  Manager found but checking status:', allManagerData.email, 'is_active:', allManagerData.is_active)
                  
                  if (allManagerData.is_active === false) {
                    console.log('❌ Manager account is inactive')
                    setManager(null)
                    // Force sign out inactive user
                    await forceSignOut(session.user.email)
                    return
          } else {
                    // is_active might be null/undefined, treat as active
                    console.log('✅ Manager authenticated (no is_active field):', allManagerData.email, 'Role:', allManagerData.role)
                    setManager(allManagerData)
                    setLoading(false)
                    clearTimeout(timeoutId)
                    return
                  }
                }
              } catch (allTimeoutError) {
                console.error('❌ All manager query timed out:', allTimeoutError)
              }
            }
            
            // If we get here, no manager was found
            console.log('❌ Manager not found in database for:', session.user.email)
            setManager(null)
            // Force sign out non-manager user
            await forceSignOut(session.user.email)
            
          } catch (error) {
            console.error('❌ Error checking manager status:', error)
            setManager(null)
            // Force sign out on any error
            await forceSignOut(session?.user?.email || 'unknown')
          }
        } else {
          console.log('ℹ️  No user in session')
          setManager(null)
        }
        
        setLoading(false)
        clearTimeout(timeoutId)
      }
    )

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
      // Special bypass for mabdulaharshad@gmail.com
      if (email.toLowerCase() === 'mabdulaharshad@gmail.com') {
        console.log('🚀 Bypassing manager check for mabdulaharshad@gmail.com')
        // Use Supabase auth for login
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password
        })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true }
      }

      // First check if this email exists in managers table
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

      // Use Supabase auth for login
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      })

      if (error) {
        return { success: false, error: error.message }
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
        
        // Clear any cached auth tokens
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key)
          }
        })
        
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
