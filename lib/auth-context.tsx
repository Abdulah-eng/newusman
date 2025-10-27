"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      // Check for rate limit in localStorage
      const rateLimitKey = `rate_limit_${email}`
      const lastAttempt = localStorage.getItem(rateLimitKey)
      if (lastAttempt && Date.now() - parseInt(lastAttempt) < 60000) { // 60 second cooldown
        return { 
          error: {
            status: 429,
            message: 'Too many login attempts. Please wait 1 minute before trying again.'
          }
        }
      }
      
      // Record attempt time
      localStorage.setItem(rateLimitKey, Date.now().toString())
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      // If login successful, clear the rate limit
      if (!error) {
        localStorage.removeItem(rateLimitKey)
      }
      
      return { error }
    } catch (error: any) {
      return { 
        error: {
          status: error?.status || 500,
          message: error?.message || 'Login failed. Please try again.'
        }
      }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check for rate limit in localStorage
      const rateLimitKey = `rate_limit_${email}`
      const lastAttempt = localStorage.getItem(rateLimitKey)
      if (lastAttempt && Date.now() - parseInt(lastAttempt) < 60000) { // 60 second cooldown
        return { 
          error: {
            status: 429,
            message: 'Too many registration attempts. Please wait 1 minute before trying again.'
          }
        }
      }
      
      // Record attempt time
      localStorage.setItem(rateLimitKey, Date.now().toString())
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      // If signup successful, clear the rate limit
      if (!error) {
        localStorage.removeItem(rateLimitKey)
      }
      
      return { error }
    } catch (error: any) {
      return { 
        error: {
          status: error?.status || 500,
          message: error?.message || 'Registration failed. Please try again.'
        }
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
