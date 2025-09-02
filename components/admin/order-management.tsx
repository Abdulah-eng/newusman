"use client"

import { useState, useEffect } from 'react'
import { Eye, Package, Truck, CheckCircle, Trash2, X, Calendar, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: string
  sku: string
  product_name: string
  product_size?: string
  product_color?: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  tracking_number?: string
  dispatched_at?: string
  shipping_address?: string
  billing_address?: string
  order_items: OrderItem[]
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isDispatching, setIsDispatching] = useState(false)


  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load orders')
      const json = await res.json()
      setOrders(json.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }
    
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === id) {
          setShowOrderDetails(false)
          setSelectedOrder(null)
        }
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const dispatchOrder = async (orderId: string, tracking: string) => {
    if (!tracking.trim()) {
      alert('Please enter a tracking number')
      return
    }

    setIsDispatching(true)
    try {
      const res = await fetch('/api/orders/dispatch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber: tracking })
      })
      
      if (res.ok) {
        const result = await res.json()
        alert(`Order dispatched successfully! Tracking number: ${tracking}`)
        setTrackingNumber('')
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: 'dispatched', tracking_number: tracking })
        }
      } else {
        const error = await res.json()
        alert(`Failed to dispatch order: ${error.error}`)
      }
    } catch (error) {
      console.error('Error dispatching order:', error)
      alert('Failed to dispatch order')
    } finally {
      setIsDispatching(false)
    }
  }



  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Package, label: 'Pending' },
      'processing': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package, label: 'Processing' },
      'dispatched': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck, label: 'Dispatched' },
      'delivered': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-800 border-red-200', icon: X, label: 'Cancelled' }
    }

    const config = statusConfig[status] || statusConfig['pending']
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const getStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400">Orders will appear here once customers complete purchases</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Order #{order.order_number || order.id.slice(0, 8)}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                         <div>
                           <p className="text-gray-600">
                             <Mail className="h-4 w-4 inline mr-2" />
                             {order.customer_email}
                           </p>
                           {order.customer_name && (
                             <p className="text-gray-600">
                               <span className="font-medium">{order.customer_name}</span>
                             </p>
                           )}
                         </div>
                         <div className="text-right">
                           <p className="text-2xl font-bold text-gray-900">£{order.total_amount?.toFixed(2)}</p>
                           <p className="text-gray-500">
                             <Calendar className="h-4 w-4 inline mr-2" />
                             {new Date(order.created_at).toLocaleDateString()}
                           </p>
                         </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                                         <div className="text-sm text-gray-600">
                       <span className="font-medium">{order.order_items?.length || 0}</span> items
                                               {order.order_items && order.order_items.length > 0 && (
                          <span className="ml-2 text-gray-500">
                            ({order.order_items.map(item => {
                              let variantInfo = item.product_name || 'Product'
                              if (item.product_size) variantInfo += ` (${item.product_size})`
                              if (item.product_color) variantInfo += ` - ${item.product_color}`
                              return `${variantInfo} × ${item.quantity}`
                            }).join(', ')})
                          </span>
                        )}
                     </div>
                    
                    <div className="flex items-center gap-2">
                      <Select 
                        value={order.status} 
                        onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatusOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - #{selectedOrder?.order_number || selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{selectedOrder.order_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg">£{selectedOrder.total_amount?.toFixed(2)}</span>
                    </div>
                                         <div className="flex justify-between">
                       <span className="text-gray-600">Order ID:</span>
                       <span className="font-mono text-sm text-gray-500">
                         {selectedOrder.id}
                       </span>
                     </div>
                  </CardContent>
                </Card>

                                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Customer Information</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4 text-gray-500" />
                       <span className="font-medium">{selectedOrder.customer_email}</span>
                     </div>
                     {selectedOrder.customer_name && (
                       <div className="flex items-center gap-2">
                         <span className="text-gray-600">Name:</span>
                         <span className="font-medium">{selectedOrder.customer_name}</span>
                       </div>
                     )}

                     {selectedOrder.shipping_address && (
                       <div className="flex items-start gap-2">
                         <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                         <div>
                           <span className="text-gray-600">Shipping Address:</span>
                           <p className="font-medium">{selectedOrder.shipping_address}</p>
                         </div>
                       </div>
                     )}
                   </CardContent>
                 </Card>
              </div>

              

                             {/* Order Items */}
               {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Order Items</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       {selectedOrder.order_items.map((item, index) => (
                         <div key={item.id || index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                           <div>
                             <p className="font-medium">{item.product_name || 'Product'}</p>
                             <p className="text-sm text-gray-600">
                               <span className="font-semibold text-orange-600">SKU: {item.sku}</span> • Qty: {item.quantity}
                               {item.product_size && ` • Size: ${item.product_size}`}
                               {item.product_color && ` • Color: ${item.product_color}`}
                             </p>
                           </div>
                           <div className="text-right">
                             <p className="font-medium">£{item.unit_price?.toFixed(2)}</p>
                             <p className="text-sm text-gray-600">Total: £{item.total_price?.toFixed(2) || (item.unit_price * item.quantity).toFixed(2)}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                     
                     {/* Variant Summary */}
                     <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                       <h4 className="font-medium text-gray-900 mb-2">Variant Summary</h4>
                       <div className="text-sm text-gray-600 space-y-1">
                         {selectedOrder.order_items.map((item, index) => (
                           <div key={index} className="flex justify-between">
                             <span>{item.product_name}: {item.sku}</span>
                             <span className="font-medium">{item.quantity} × £{item.unit_price?.toFixed(2)}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               )}

               {/* Tracking and Dispatch */}
               {selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? (
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg flex items-center gap-2">
                       <Truck className="h-5 w-5" />
                       Dispatch Order
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="flex items-center gap-3">
                       <Input
                         placeholder="Enter tracking number"
                         value={trackingNumber}
                         onChange={(e) => setTrackingNumber(e.target.value)}
                         className="flex-1"
                       />
                       <Button
                         onClick={() => dispatchOrder(selectedOrder.id, trackingNumber)}
                         disabled={isDispatching || !trackingNumber.trim()}
                         className="bg-orange-600 hover:bg-orange-700"
                       >
                         {isDispatching ? 'Dispatching...' : 'Dispatch Order'}
                       </Button>
                     </div>
                     <p className="text-sm text-gray-600">
                       Enter the tracking number and click dispatch to mark this order as shipped.
                     </p>
                   </CardContent>
                 </Card>
               ) : selectedOrder.tracking_number ? (
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg flex items-center gap-2">
                       <Truck className="h-5 w-5" />
                       Tracking Information
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-2">
                       <p><strong>Tracking Number:</strong> {selectedOrder.tracking_number}</p>
                       {selectedOrder.dispatched_at && (
                         <p><strong>Dispatched:</strong> {new Date(selectedOrder.dispatched_at).toLocaleString()}</p>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               ) : null}

                             

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOrderDetails(false)}
                >
                  Close
                </Button>
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

