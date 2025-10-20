"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  isAdmin: boolean
  isManager: boolean
}

const ManagerAuthContext = createContext<ManagerAuthContextType | undefined>(undefined)

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get manager details from our managers table
          const { data: managerData, error } = await supabase
            .from('managers')
            .select('*')
            .eq('email', session.user.email)
            .eq('is_active', true)
            .single()

          if (managerData && !error) {
            setManager(managerData)
          } else {
            // User is not a manager, sign them out
            await supabase.auth.signOut()
          }
        }
      } catch (error) {
        console.error('Error checking manager session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get manager details
          const { data: managerData, error } = await supabase
            .from('managers')
            .select('*')
            .eq('email', session.user.email)
            .eq('is_active', true)
            .single()

          if (managerData && !error) {
            setManager(managerData)
          } else {
            setManager(null)
          }
        } else {
          setManager(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string) => {
    try {
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
    await supabase.auth.signOut()
    setManager(null)
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
