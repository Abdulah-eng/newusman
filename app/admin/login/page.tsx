"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useManagerAuth } from '@/lib/manager-auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff, Loader2, User, Crown, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type LoginType = 'admin' | 'manager' | null

export default function AdminLoginPage() {
  const { manager, login, loading, isAdmin, isManager, forceLogout } = useManagerAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loginType, setLoginType] = useState<LoginType>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (manager && !loading) {
      console.log('✅ Manager found, redirecting to admin dashboard')
      router.push('/admin')
    }
  }, [manager, loading, router])

  // Handle case where user is signed in but not a manager
  useEffect(() => {
    console.log('🔍 Login page state:', { loading, manager, isAdmin, isManager })
    if (!loading && !manager) {
      console.log('ℹ️  No manager found, staying on login page')
    }
  }, [manager, loading, isAdmin, isManager])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    setIsLoggingIn(true)
    
    try {
      const result = await login(formData.email, formData.password, loginType)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Login successful as ${loginType}`
        })
        // Redirect will happen automatically via useEffect
      } else {
        toast({
          title: "Error",
          description: result.error || "Login failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleBackToSelection = () => {
    setLoginType(null)
    setFormData({ email: '', password: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Always show login forms on the login page, regardless of manager status
  // The bypass logic will be handled in the ManagerAuthContext

  if (manager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // Login type selection screen
  if (!loginType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              Admin Panel Access
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Choose your login type to access the admin panel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Login Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-300"
              onClick={() => setLoginType('admin')}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h3>
                <p className="text-gray-600 mb-4">
                  Full access to all admin features including:
                </p>
                <ul className="text-sm text-gray-500 text-left space-y-1">
                  <li>• Manage all products</li>
                  <li>• View and manage orders</li>
                  <li>• Create/delete manager accounts</li>
                  <li>• Access all settings</li>
                  <li>• Full system control</li>
                </ul>
                <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
                  Login as Admin
                </Button>
              </CardContent>
            </Card>

            {/* Manager Login Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-300"
              onClick={() => setLoginType('manager')}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Manager Login</h3>
                <p className="text-gray-600 mb-4">
                  Limited access to admin features:
                </p>
                <ul className="text-sm text-gray-500 text-left space-y-1">
                  <li>• Manage products</li>
                  <li>• Update homepage content</li>
                  <li>• Manage promotional content</li>
                  <li>• Access settings</li>
                  <li>• Cannot access orders</li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Login as Manager
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Login form screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            {loginType === 'admin' ? (
              <Crown className="h-6 w-6 text-red-600" />
            ) : (
              <User className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {loginType === 'admin' ? 'Admin Login' : 'Manager Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin panel as {loginType}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSelection}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 ${
                    loginType === 'admin' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    `Sign In as ${loginType === 'admin' ? 'Admin' : 'Manager'}`
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Need help? Contact your system administrator
          </p>
          
          {/* Force logout button for stuck sessions */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Having trouble logging in?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                console.log('🚨 Force logout from login page')
                await forceLogout()
              }}
              className="text-xs text-gray-600 hover:text-red-600"
            >
              Force Logout & Clear Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
