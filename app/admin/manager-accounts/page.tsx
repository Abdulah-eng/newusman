"use client"

import { useState, useEffect } from 'react'
import { useManagerAuth } from '@/lib/manager-auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, User, Shield, UserCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Manager {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager'
  is_active: boolean
  created_at: string
  last_login?: string
}

export default function ManagerAccountsPage() {
  const { manager, isAdmin } = useManagerAuth()
  const { toast } = useToast()
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'manager' as 'admin' | 'manager'
  })

  useEffect(() => {
    if (isAdmin) {
      fetchManagers()
    }
  }, [isAdmin])

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('manager_token')
      const response = await fetch('/api/manager/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setManagers(data.managers || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch manager accounts",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching managers:', error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('manager_token')
      const response = await fetch('/api/manager/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Manager account created successfully"
        })
        setIsCreateDialogOpen(false)
        setFormData({ email: '', password: '', fullName: '', role: 'manager' })
        fetchManagers()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create manager account",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating manager:', error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    }
  }

  const handleDeleteManager = async () => {
    if (!selectedManager) return

    try {
      const token = localStorage.getItem('manager_token')
      const response = await fetch(`/api/manager/accounts?id=${selectedManager.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Manager account deleted successfully"
        })
        setIsDeleteDialogOpen(false)
        setSelectedManager(null)
        fetchManagers()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete manager account",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting manager:', error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manager accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Accounts</h1>
          <p className="text-gray-600 mt-2">Manage admin and manager accounts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Manager Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateManager} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'manager') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Create Account
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {managers.map((managerAccount) => (
          <Card key={managerAccount.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    {managerAccount.role === 'admin' ? (
                      <Shield className="h-6 w-6 text-orange-600" />
                    ) : (
                      <User className="h-6 w-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{managerAccount.full_name}</h3>
                    <p className="text-gray-600">{managerAccount.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={managerAccount.role === 'admin' ? 'default' : 'secondary'}>
                        {managerAccount.role}
                      </Badge>
                      <Badge variant={managerAccount.is_active ? 'default' : 'destructive'}>
                        {managerAccount.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <p>Created: {formatDate(managerAccount.created_at)}</p>
                  {managerAccount.last_login && (
                    <p>Last login: {formatDate(managerAccount.last_login)}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {managerAccount.id !== manager?.id && (
                    <Dialog open={isDeleteDialogOpen && selectedManager?.id === managerAccount.id} onOpenChange={(open) => {
                      if (open) {
                        setSelectedManager(managerAccount)
                        setIsDeleteDialogOpen(true)
                      } else {
                        setSelectedManager(null)
                        setIsDeleteDialogOpen(false)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Manager Account</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-gray-600">
                            Are you sure you want to delete the account for <strong>{managerAccount.full_name}</strong> ({managerAccount.email})?
                          </p>
                          <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => {
                            setSelectedManager(null)
                            setIsDeleteDialogOpen(false)
                          }}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteManager}>
                            Delete Account
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {managers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <UserCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Manager Accounts</h3>
            <p className="text-gray-600">Create your first manager account to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
