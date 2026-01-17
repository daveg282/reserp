// components/manager/KitchenOperationsView.js
'use client';

import { useState, useEffect } from 'react';
import { 
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  TrendingUp,
  Activity,
  Loader2,
  Utensils,
  Timer,
  BarChart3,
  Package,
  Coffee,
  Pizza,
  Soup,
  Cake,
  Flame,
  Salad,
  Beer,
  IceCream
} from 'lucide-react';
import AuthService from '@/lib/auth-utils';
import { ordersAPI, kitchenAPI } from '@/lib/api';

export default function KitchenOperationsView({ 
  userRole,
  kitchenData = null,
  kitchenStats = null,
  isLoading = false,
  error = null,
  onRefresh,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch real orders like cashier does
  const fetchOrders = async () => {
    const token = AuthService.getToken();
    if (!token) {
      setErrorMsg('Authentication required');
      return;
    }
    
    setLoading(true);
    setErrorMsg(null);
    
    try {
      // SAME AS CASHIER: Use ordersAPI.getAllOrders()
      const ordersData = await ordersAPI.getAllOrders(token);
      
      console.log('🔍 Raw orders data from API (Manager Kitchen View):', ordersData);
      
      // TRANSFORM EXACTLY LIKE CASHIER DOES
      const transformedOrders = ordersData.map((order) => {
        // Calculate order status from items if order.status doesn't exist
        let orderStatus = 'pending';
        if (order.items && Array.isArray(order.items)) {
          const allCompleted = order.items.every(item => item.status === 'completed');
          const anyReady = order.items.some(item => item.status === 'ready');
          const anyPreparing = order.items.some(item => item.status === 'preparing');
          
          if (allCompleted) {
            orderStatus = 'completed';
          } else if (anyReady) {
            orderStatus = 'ready';
          } else if (anyPreparing) {
            orderStatus = 'preparing';
          } else {
            orderStatus = 'pending';
          }
        }
        
        // Transform items - SAME AS CASHIER
        let orderItems = [];
        let orderTotal = 0;
        
        if (order.items && Array.isArray(order.items) && order.items.length > 0) {
          orderItems = order.items.map(item => ({
            id: item.id || item.menu_item_id,
            name: item.item_name || item.name || 'Unknown Item',
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0,
            specialInstructions: item.special_instructions || '',
            status: item.status || 'pending'
          }));
          
          orderTotal = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
          }, 0);
        }
        
        // Get table info
        let tableNumber = order.table_number || `T${order.table_id}`;
        
        // Handle customer_name
        let customerName = order.customer_name || 'Walk-in Customer';
        if (customerName === '[object Object]') {
          customerName = 'Walk-in Customer';
        }
        
        return {
          id: order.id,
          orderNumber: order.order_number || `ORD-${order.id}`,
          tableId: order.table_id,
          tableNumber: tableNumber,
          items: orderItems,
          status: order.status || orderStatus,
          total: parseFloat(order.total_amount) || orderTotal,
          orderTime: order.created_at || order.order_time || new Date().toISOString(),
          estimatedTime: order.estimated_ready_time || '15-20 min',
          customerName: customerName,
          customerCount: order.customer_count || 1,
          payment_status: order.payment_status || 'pending',
          payment_method: order.payment_method,
          pager_number: order.pager_number || null,
          notes: order.notes || '',
          rawOrder: order
        };
      });
      
      console.log('✅ Transformed orders for manager kitchen:', transformedOrders);
      setOrders(transformedOrders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SAME AS CASHIER: Update order status
  const updateOrderStatus = async (orderId, status) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // SAME AS CASHIER: Use ordersAPI.updateOrderStatus()
      await ordersAPI.updateOrderStatus(orderId, status, token);
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: status } : o
      ));
      
      alert(`Order status updated to ${status}!`);
      
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Failed to update order: ${err.message}`);
    }
  };

  // SAME AS CASHIER: Mark order as preparing
  const markOrderPreparing = (orderId) => updateOrderStatus(orderId, 'preparing');
  
  // SAME AS CASHIER: Mark order as ready
  const markOrderReady = (orderId) => updateOrderStatus(orderId, 'ready');
  
  // SAME AS CASHIER: Mark order as completed
  const markOrderCompleted = (orderId) => updateOrderStatus(orderId, 'completed');

  // Fetch kitchen orders like cashier does
  const fetchKitchenOrders = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    try {
      // SAME AS CASHIER: Use kitchenAPI.getKitchenOrders()
      const kitchenOrders = await kitchenAPI.getKitchenOrders(token);
      console.log('Kitchen orders for manager:', kitchenOrders);
      // You can use this data for kitchen-specific operations
    } catch (err) {
      console.error('Error fetching kitchen orders:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
    fetchKitchenOrders();
    
    // Set up refresh interval (same as cashier: every 30 seconds)
    const intervalId = setInterval(() => {
      fetchOrders();
      fetchKitchenOrders();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Kitchen station icons
  const stationIcons = {
    grill: <Flame className="w-5 h-5" />,
    fryer: <ChefHat className="w-5 h-5" />,
    salad: <Salad className="w-5 h-5" />,
    dessert: <Cake className="w-5 h-5" />,
    beverage: <Coffee className="w-5 h-5" />,
    pizza: <Pizza className="w-5 h-5" />,
    soup: <Soup className="w-5 h-5" />,
    default: <Utensils className="w-5 h-5" />
  };

  // Order status configuration
  const orderStatuses = [
    {
      status: 'pending',
      title: 'Pending Orders',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
      cardColor: 'bg-blue-50 border border-blue-100',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      description: 'Orders waiting to be prepared'
    },
    {
      status: 'preparing',
      title: 'In Progress',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
      cardColor: 'bg-amber-50 border border-amber-100',
      icon: <ChefHat className="w-5 h-5 text-amber-600" />,
      description: 'Orders being prepared'
    },
    {
      status: 'ready',
      title: 'Ready for Service',
      badgeColor: 'bg-green-100 text-green-700 border-green-300',
      cardColor: 'bg-green-50 border border-green-100',
      icon: <Package className="w-5 h-5 text-green-600" />,
      description: 'Orders ready to serve'
    }
  ];

  // Process real kitchen data (using orders fetched like cashier)
  const kitchenOrders = Array.isArray(orders) ? orders : [];

  // Filter orders by status
  const getOrdersByStatus = (status) => {
    return kitchenOrders.filter(order => order.status === status);
  };

  // Filter orders by search
  const filteredOrders = kitchenOrders.filter(order => 
    searchQuery === '' || 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get order items
  const getOrderItems = (order) => {
    if (!order || !order.items || !Array.isArray(order.items)) return [];
    return order.items;
  };

  // Get item name
  const getItemName = (item) => {
    if (!item) return 'Unknown Item';
    return item.item_name || item.name || `Item ${item.id || item.menu_item_id || ''}`;
  };

  // Count active orders
  const activeOrdersCount = getOrdersByStatus('pending').length + getOrdersByStatus('preparing').length;

  // Loading state
  if (loading && kitchenOrders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 animate-pulse">Loading Kitchen Dashboard...</h1>
            <p className="text-gray-600 mt-1">Fetching real-time kitchen data</p>
          </div>
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (errorMsg) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kitchen Operations</h1>
            <p className="text-gray-600 mt-1">Monitor kitchen stations and orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-800">Error Loading Kitchen Data</h3>
              <p className="text-red-700 mt-1">{errorMsg}</p>
              <p className="text-sm text-red-600 mt-2">Please check your connection and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Operations</h1>
          <p className="text-gray-600 mt-1">Monitor kitchen stations and real-time order progress</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border rounded-lg px-4 py-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">{activeOrdersCount}</span>
            <span className="text-sm text-gray-600">active orders</span>
          </div>
          
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {kitchenOrders.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {getOrdersByStatus('pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Ready Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {getOrdersByStatus('ready').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeOrdersCount}
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by table, customer, or order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Orders Dashboard - 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {orderStatuses.map((statusConfig) => {
          const statusOrders = getOrdersByStatus(statusConfig.status).filter(order => 
            searchQuery === '' || 
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          return (
            <div key={statusConfig.status} className={`${statusConfig.cardColor} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border">
                    {statusConfig.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{statusConfig.title}</h4>
                    <p className="text-sm text-gray-600">{statusConfig.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusConfig.badgeColor}`}>
                  {statusOrders.length}
                </span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {statusOrders.length > 0 ? (
                  statusOrders.map(order => {
                    const orderItems = getOrderItems(order);
                    
                    return (
                      <div key={order.id} className="bg-white border rounded-lg p-4 hover:shadow transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-bold text-gray-900 text-base">{order.orderNumber}</h5>
                            <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">Customer: {order.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">ETB {order.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.orderTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        {orderItems.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-2">Items ({orderItems.length}):</p>
                            <ul className="space-y-2">
                              {orderItems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-2 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-700">
                                      {item.quantity || 1}x {getItemName(item)}
                                    </span>
                                    {item.specialInstructions && (
                                      <p className="text-xs text-gray-500 mt-1">Note: {item.specialInstructions}</p>
                                    )}
                                    <div className="flex justify-between mt-1">
                                      <span className="text-xs text-gray-600">ETB {item.price}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        item.status === 'ready' ? 'bg-green-100 text-green-700' :
                                        item.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                                        'bg-blue-100 text-blue-700'
                                      }`}>
                                        {item.status || 'pending'}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Order Notes */}
                        {order.notes && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                            <p className="text-sm text-yellow-800 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              {order.notes}
                            </p>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          {statusConfig.status === 'pending' && (
                            <button
                              onClick={() => markOrderPreparing(order.id)}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                            >
                              Mark as Preparing
                            </button>
                          )}
                          
                          {statusConfig.status === 'preparing' && (
                            <button
                              onClick={() => markOrderReady(order.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                            >
                              Mark as Ready
                            </button>
                          )}
                          
                          {statusConfig.status === 'ready' && (
                            <button
                              onClick={() => markOrderCompleted(order.id)}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 bg-white border rounded-lg">
                    <div className="text-gray-400 mb-2">
                      {statusConfig.status === 'pending' && <Clock className="w-8 h-8 mx-auto" />}
                      {statusConfig.status === 'preparing' && <ChefHat className="w-8 h-8 mx-auto" />}
                      {statusConfig.status === 'ready' && <CheckCircle className="w-8 h-8 mx-auto" />}
                    </div>
                    <p className="text-gray-500">
                      {statusConfig.status === 'pending' && 'No pending orders'}
                      {statusConfig.status === 'preparing' && 'No orders in progress'}
                      {statusConfig.status === 'ready' && 'No orders ready'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}