// components/manager/OrdersServiceView.js
'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Loader2,
  ChefHat,
  Coffee,
  ShoppingBag,
  Check,
  X
} from 'lucide-react';

export default function OrdersServiceView({ 
  userRole,
  ordersData = [],           // Receive data from parent
  orderStats = null,         // Receive stats from parent
  isLoading = false,         // Receive loading state
  error = null,              // Receive error state
  onRefresh,                 // Refresh function from parent
  onUpdateOrderStatus        // Function to update order status
}) {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orderStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    served: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  };

  const orderStatusIcons = {
    pending: <Clock className="w-4 h-4" />,
    preparing: <ChefHat className="w-4 h-4" />,
    ready: <CheckCircle className="w-4 h-4" />,
    served: <Package className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
    completed: <Check className="w-4 h-4" />
  };

  // Transform API data to match component expectations
  const transformedOrders = Array.isArray(ordersData) ? ordersData.map(order => ({
    id: order.id || order.order_id,
    orderNumber: order.order_number || `ORD${(order.id || '').toString().padStart(4, '0')}`,
    table: order.table_number || order.table || 'Takeaway',
    customer: order.customer_name || order.customer || 'Walk-in',
    items: order.items_count || order.items || 0,
    total: order.total_amount || order.total || 0,
    status: order.status || 'pending',
    time: order.created_at ? new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now',
    waiter: order.waiter_name || order.waiter || null,
    notes: order.notes || '',
    type: order.order_type || 'dine-in'
  })) : [];

  const filteredOrders = transformedOrders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      (order.orderNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.table?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.customer?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status) => {
    return filteredOrders.filter(order => order.status === status);
  };

  if (isLoading && transformedOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading orders data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Service</h1>
          <p className="text-gray-600">Monitor and manage restaurant orders and service flow</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Activity className="w-4 h-4" />
            Live View
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={onRefresh}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : (orderStats?.today?.total || transformedOrders.length)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from yesterday
              </p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ETB {isLoading ? '...' : (orderStats?.today?.revenue || transformedOrders.reduce((sum, order) => sum + (order.total || 0), 0)).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from yesterday
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Preparation</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : (orderStats?.today?.averageTime || '24 min')}
              </p>
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                +3 min from target
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : getOrdersByStatus('preparing').length + getOrdersByStatus('ready').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {getOrdersByStatus('preparing').length} preparing • {getOrdersByStatus('ready').length} ready
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kitchen'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kitchen Queue
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'service'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Service Metrics
          </button>
        </nav>
      </div>

      {/* Active Orders Tab */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by table, customer, or order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-purple-600 mx-auto" />
              <p className="text-gray-600 mt-2">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No orders found</p>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{order.orderNumber}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${orderStatusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {orderStatusIcons[order.status] || <Clock className="w-4 h-4" />}
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.type === 'takeaway' ? 'Takeaway' : `Table ${order.table}`} • {order.customer}
                      </p>
                      {order.waiter && (
                        <p className="text-xs text-gray-500 mt-1">Waiter: {order.waiter}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">ETB {order.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{order.items} items</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  
                  {order.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {order.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'preparing')}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'ready')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'served')}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
                      >
                        Mark Served
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kitchen Queue Tab */}
      {activeTab === 'kitchen' && (
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Kitchen Order Queue</h3>
          
          <div className="space-y-4">
            {/* Preparing Orders */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-blue-600" />
                Preparing Orders ({getOrdersByStatus('preparing').length})
              </h4>
              <div className="space-y-3">
                {getOrdersByStatus('preparing').map((order) => (
                  <div key={order.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Table {order.table} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">ETB {order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'ready')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Mark Ready
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                {getOrdersByStatus('preparing').length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No orders being prepared</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ready Orders */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Ready for Service ({getOrdersByStatus('ready').length})
              </h4>
              <div className="space-y-3">
                {getOrdersByStatus('ready').map((order) => (
                  <div key={order.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Table {order.table} • Ready to serve</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">ETB {order.total.toLocaleString()}</p>
                        <p className="text-xs text-green-600 font-medium">READY</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'served')}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
                      >
                        Mark Served
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Notify Waiter
                      </button>
                    </div>
                  </div>
                ))}
                {getOrdersByStatus('ready').length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No orders ready for service</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Metrics Tab */}
      {activeTab === 'service' && (
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Service Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Order Status Distribution</h4>
              <div className="space-y-3">
                {Object.entries(orderStatusColors).map(([status, colorClass]) => {
                  const count = getOrdersByStatus(status).length;
                  const percentage = transformedOrders.length > 0 ? Math.round((count / transformedOrders.length) * 100) : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colorClass.split(' ')[0]}`}></div>
                        <span className="text-gray-700 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass.split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Key Performance Indicators</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Average Order Value</span>
                    <span className="font-bold text-gray-900">
                      ETB {transformedOrders.length > 0 ? Math.round(transformedOrders.reduce((sum, order) => sum + order.total, 0) / transformedOrders.length).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Average spend per order</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Peak Order Time</span>
                    <span className="font-bold text-gray-900">7:00 PM - 9:00 PM</span>
                  </div>
                  <div className="text-sm text-gray-600">Busiest period for orders</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Order Accuracy</span>
                    <span className="font-bold text-green-600">98.5%</span>
                  </div>
                  <div className="text-sm text-gray-600">Correct orders vs total orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}