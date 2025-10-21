/**
 * Unified Authentication Handler
 * 
 * This utility helps manage authentication state across different contexts
 * and prevents conflicts between customer and manager authentication systems.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface AuthState {
  isAuthenticated: boolean
  user: any | null
  manager: any | null
  loading: boolean
  userType: 'customer' | 'manager' | 'admin' | null
}

export class UnifiedAuthHandler {
  private supabase = createClientComponentClient()

  /**
   * Get unified authentication state
   */
  async getAuthState(): Promise<AuthState> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (!session?.user) {
        return {
          isAuthenticated: false,
          user: null,
          manager: null,
          loading: false,
          userType: null
        }
      }

      // Check if user is a manager
      const { data: managerData, error } = await this.supabase
        .from('managers')
        .select('*')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single()

      if (managerData && !error) {
        return {
          isAuthenticated: true,
          user: session.user,
          manager: managerData,
          loading: false,
          userType: managerData.role === 'admin' ? 'admin' : 'manager'
        }
      }

      // Regular customer
      return {
        isAuthenticated: true,
        user: session.user,
        manager: null,
        loading: false,
        userType: 'customer'
      }
    } catch (error) {
      console.error('Error getting auth state:', error)
      return {
        isAuthenticated: false,
        user: null,
        manager: null,
        loading: false,
        userType: null
      }
    }
  }

  /**
   * Sign out from all authentication contexts
   */
  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  /**
   * Check if user has access to admin area
   */
  async hasAdminAccess(): Promise<boolean> {
    const authState = await this.getAuthState()
    return authState.userType === 'admin' || authState.userType === 'manager'
  }

  /**
   * Check if user has admin privileges
   */
  async isAdmin(): Promise<boolean> {
    const authState = await this.getAuthState()
    return authState.userType === 'admin'
  }
}

export const unifiedAuthHandler = new UnifiedAuthHandler()
