"use client"

import { useState } from 'react'
import { useManagerAuth } from '@/lib/manager-auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Key, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminSettingsPage() {
  const { manager, changePassword } = useManagerAuth()
  const { toast } = useToast()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Password changed successfully"
        })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change password",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
        
        {/* Account Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
              <p className="text-gray-900">{manager?.full_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email Address</Label>
              <p className="text-gray-900">{manager?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Role</Label>
              <p className="text-gray-900 capitalize">{manager?.role}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Account Status</Label>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Security Notice</h3>
                <p className="text-blue-800 text-sm">
                  For security reasons, please use a strong password and change it regularly. 
                  If you suspect your account has been compromised, contact the system administrator immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
