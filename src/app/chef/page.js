'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Clock, ChefHat, AlertTriangle, CheckCircle, Bell, TrendingUp, X, Eye,
  Users, Utensils, DollarSign, Search, Filter, Home, ShoppingCart, 
  Package, BarChart3, Settings, Menu, LogOut, Plus, Edit,
  Download, Crown, RefreshCw ,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function ChefDashboard() {
 const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('active');
  const [stationFilter, setStationFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [kitchenStats, setKitchenStats] = useState({
    active: 0,
    completed: 0,
    avgPrepTime: 0,
    delayed: 0
  });

  const mockOrders = [
    {
      id: 101,
      tableNumber: 'Table 12',
      orderNumber: 'ORD-001',
      items: [
        { name: 'Pasta Carbonara', quantity: 1, specialRequest: 'Extra cheese, No bacon', station: 'pasta', cookTime: 12 },
        { name: 'Caesar Salad', quantity: 2, specialRequest: 'No croutons, Dressing on side', station: 'salad', cookTime: 5 }
      ],
      status: 'pending',
      orderTime: new Date(Date.now() - 8 * 60000).toISOString(),
      customerNotes: 'Celebrating anniversary',
      priority: 'high',
      estimatedTime: 20,
      waiterName: 'Sarah'
    },
    {
      id: 102,
      tableNumber: 'Table 08',
      orderNumber: 'ORD-002',
      items: [
        { name: 'Grilled Salmon', quantity: 1, specialRequest: 'Well done, Lemon wedge', station: 'grill', cookTime: 15 },
        { name: 'Seasonal Vegetables', quantity: 1, station: 'vegetables', cookTime: 6 }
      ],
      status: 'preparing',
      orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
      startedTime: new Date(Date.now() - 10 * 60000).toISOString(),
      priority: 'normal',
      estimatedTime: 18,
      waiterName: 'Michael'
    },
    {
      id: 103,
      tableNumber: 'VIP Section',
      orderNumber: 'ORD-003',
      items: [
        { name: 'Ribeye Steak', quantity: 2, specialRequest: 'Medium rare, Pink center', station: 'grill', cookTime: 18 },
        { name: 'Truffle Mashed Potatoes', quantity: 2, station: 'sides', cookTime: 8 }
      ],
      status: 'ready',
      orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
      startedTime: new Date(Date.now() - 20 * 60000).toISOString(),
      readyTime: new Date(Date.now() - 2 * 60000).toISOString(),
      priority: 'vip',
      estimatedTime: 22,
      waiterName: 'Emma'
    },
    {
      id: 104,
      tableNumber: 'Table 05',
      orderNumber: 'ORD-004',
      items: [
        { name: 'Margherita Pizza', quantity: 1, station: 'pizza', cookTime: 10 },
        { name: 'Garlic Bread', quantity: 2, station: 'sides', cookTime: 5 }
      ],
      status: 'pending',
      orderTime: new Date(Date.now() - 12 * 60000).toISOString(),
      priority: 'normal',
      estimatedTime: 15,
      waiterName: 'David'
    }
  ];

  const stations = [
    { id: 'all', name: 'All Stations', icon: '🍽️', color: 'gray' },
    { id: 'grill', name: 'Grill Station', icon: '🔥', color: 'red' },
    { id: 'pasta', name: 'Pasta Station', icon: '🍝', color: 'orange' },
    { id: 'pizza', name: 'Pizza Station', icon: '🍕', color: 'amber' },
    { id: 'salad', name: 'Salad Station', icon: '🥗', color: 'green' },
    { id: 'fryer', name: 'Fryer Station', icon: '🍟', color: 'yellow' },
    { id: 'vegetables', name: 'Vegetable Station', icon: '🥦', color: 'emerald' },
    { id: 'sides', name: 'Sides Station', icon: '🥔', color: 'blue' }
  ];

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', view: 'dashboard' },
    { id: 'orders', icon: ShoppingCart, label: 'Active Orders', badge: 0, view: 'orders' },
    { id: 'stations', icon: Utensils, label: 'Stations', view: 'stations' },
    { id: 'inventory', icon: Package, label: 'Inventory', view: 'inventory' },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

  const demoTimeoutRef = useRef(null);

  useEffect(() => {
    setOrders(mockOrders);
    calculateKitchenStats(mockOrders);
    if (isDemoMode) startDemo();
    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, [isDemoMode]);

  const addNotification = (message, type = 'info') => {
    const notification = { id: Date.now(), message, type, time: new Date().toISOString() };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  };

  const startDemo = () => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    const simulateDemo = () => {
      setOrders(prev => {
        let updated = [...prev];
        updated = updated.map(order => {
          const rand = Math.random();
          if (order.status === 'pending' && rand > 0.7) {
            addNotification(`Order ${order.orderNumber} started preparation`, 'info');
            return { ...order, status: 'preparing', startedTime: new Date().toISOString() };
          }
          if (order.status === 'preparing' && rand > 0.6) {
            addNotification(`Order ${order.orderNumber} is ready!`, 'success');
            return { ...order, status: 'ready', readyTime: new Date().toISOString() };
          }
          if (order.status === 'ready' && rand > 0.8) {
            return { ...order, status: 'completed', completedTime: new Date().toISOString() };
          }
          return order;
        });

        if (Math.random() > 0.7 && updated.length < 8) {
          const dishes = [
            { name: 'Margherita Pizza', station: 'pizza', cookTime: 12 },
            { name: 'Chicken Burger', station: 'grill', cookTime: 15 },
            { name: 'Greek Salad', station: 'salad', cookTime: 5 },
            { name: 'Fish & Chips', station: 'fryer', cookTime: 10 }
          ];
          const dish = dishes[Math.floor(Math.random() * dishes.length)];
          const newOrder = {
            id: Date.now(),
            tableNumber: `Table ${Math.floor(Math.random() * 12) + 1}`,
            orderNumber: `ORD-${String(updated.length + 100).padStart(3, '0')}`,
            items: [{ ...dish, quantity: 1 + Math.floor(Math.random() * 2) }],
            status: 'pending',
            orderTime: new Date().toISOString(),
            priority: Math.random() > 0.8 ? 'high' : 'normal',
            estimatedTime: Math.floor(Math.random() * 20) + 10,
            waiterName: ['Sarah', 'Michael', 'Emma', 'David'][Math.floor(Math.random() * 4)]
          };
          updated = [newOrder, ...updated];
          addNotification(`New order: ${newOrder.orderNumber}`, 'warning');
        }

        if (updated.length > 6) {
          updated = updated.filter(order => order.status !== 'completed' || Math.random() > 0.3);
        }
        calculateKitchenStats(updated);
        return updated;
      });
      if (isDemoMode) demoTimeoutRef.current = setTimeout(simulateDemo, 5000);
    };
    demoTimeoutRef.current = setTimeout(simulateDemo, 5000);
  };

  const calculateKitchenStats = (orderList) => {
    const active = orderList.filter(o => o.status !== 'completed').length;
    const completed = orderList.filter(o => o.status === 'completed').length;
    const delayed = orderList.filter(o => {
      if (o.status === 'pending') {
        const waitTime = (new Date() - new Date(o.orderTime)) / 60000;
        return waitTime > 10;
      }
      return false;
    }).length;
    
    const activeOrders = orderList.filter(o => o.startedTime && o.status === 'preparing');
    const avgPrepTime = activeOrders.length > 0 
      ? Math.round(activeOrders.reduce((sum, order) => {
          const prepTime = (new Date() - new Date(order.startedTime)) / 60000;
          return sum + prepTime;
        }, 0) / activeOrders.length)
      : 0;

    setKitchenStats({ active, completed, delayed, avgPrepTime });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updates = { status: newStatus };
        if (newStatus === 'preparing') {
          updates.startedTime = new Date().toISOString();
          addNotification(`Started ${order.orderNumber}`, 'info');
        }
        if (newStatus === 'ready') {
          updates.readyTime = new Date().toISOString();
          addNotification(`${order.orderNumber} ready!`, 'success');
        }
        if (newStatus === 'completed') updates.completedTime = new Date().toISOString();
        return { ...order, ...updates };
      }
      return order;
    }));
  };

  const resetDemo = () => {
    setOrders(mockOrders);
    calculateKitchenStats(mockOrders);
    setNotifications([]);
  };
const handleLogout = () => {
  setIsLoading(true);
  // Simulate logout process
  setTimeout(() => {
    router.push('/login'); // Navigate to home page
  }, 1000);
};
  const filteredOrders = orders.filter(order => {
    if (filter === 'active' && order.status === 'completed') return false;
    if (filter === 'completed' && order.status !== 'completed') return false;
    if (stationFilter !== 'all') return order.items.some(item => item.station === stationFilter);
    if (searchQuery) {
      return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.waiterName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-red-50 border-red-200 text-red-700', label: 'Pending', dot: 'bg-red-500', bg: 'bg-red-500/10' },
      preparing: { color: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Preparing', dot: 'bg-amber-500', bg: 'bg-amber-500/10' },
      ready: { color: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Ready', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
      completed: { color: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Completed', dot: 'bg-blue-500', bg: 'bg-blue-500/10' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      normal: { color: 'text-gray-600', bg: 'bg-gray-100', label: '', icon: '' },
      high: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Priority', icon: '⚡' },
      vip: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'VIP', icon: '👑' }
    };
    return configs[priority] || configs.normal;
  };

  const getTimeElapsed = (orderTime) => {
    const diff = Math.floor((new Date() - new Date(orderTime)) / 60000);
    return diff < 1 ? 'Just now' : `${diff} min ago`;
  };

  const getTimeSince = (time) => {
    if (!time) return 'N/A';
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return `${diff} min`;
  };

  const isOrderDelayed = (order) => {
    const waitTime = (new Date() - new Date(order.orderTime)) / 60000;
    return order.status === 'pending' && waitTime > 10;
  };

  const getStationColor = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? `bg-${station.color}-100 text-${station.color}-700` : 'bg-gray-100 text-gray-700';
  };

  // Mobile sidebar overlay
  const SidebarOverlay = () => (
    sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <SidebarOverlay />
      
      {/* Sidebar */}
      <div className={`fixed lg:static bg-gradient-to-b from-orange-900 to-orange-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-orange-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Kitchen POS</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.view);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  activeView === item.view 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'hover:bg-orange-700 text-orange-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

       <div className="p-4 border-t border-gray-100 space-y-4">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
      <Crown className="w-5 h-5" />
    </div>
    {sidebarOpen && (
      <div className="flex-1">
        <p className="font-semibold text-sm">Manager</p>
        <p className="text-xs text-purple-300">Bistro Elegante</p>
      </div>
    )}
  </div>
  
  {sidebarOpen && (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200"
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span className="text-sm">{isLoading ? 'Logging out...' : 'Logout'}</span>
    </button>
  )}
</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                  {activeView === 'dashboard' && 'Kitchen Dashboard'}
                  {activeView === 'orders' && 'Order Management'}
                  {activeView === 'stations' && 'Station Overview'}
                  {activeView === 'inventory' && 'Inventory Management'}
                  {activeView === 'reports' && 'Kitchen Reports'}
                  {activeView === 'settings' && 'System Settings'}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Demo Mode Toggle */}
              {isDemoMode ? (
                <button 
                  onClick={() => setIsDemoMode(false)}
                  className="bg-orange-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-xl font-medium text-sm"
                >
                  Exit Demo
                </button>
              ) : (
                <button 
                  onClick={() => setIsDemoMode(true)}
                  className="bg-gray-200 text-gray-700 px-3 py-2 lg:px-4 lg:py-2 rounded-xl font-medium text-sm"
                >
                  Start Demo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
                {[
                  { label: 'Active Orders', value: kitchenStats.active, icon: ShoppingCart, color: 'orange' },
                  { label: 'Completed Today', value: kitchenStats.completed, icon: CheckCircle, color: 'emerald' },
                  { label: 'Avg Prep Time', value: `${kitchenStats.avgPrepTime}m`, icon: Clock, color: 'blue' },
                  { label: 'Delayed Orders', value: kitchenStats.delayed, icon: AlertTriangle, color: 'red' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2 lg:mb-3 xl:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Quick Stations */}
                <div className="lg:col-span-1 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Kitchen Stations</h3>
                  <div className="space-y-2 lg:space-y-3">
                    {stations.filter(s => s.id !== 'all').map(station => (
                      <button
                        key={station.id}
                        onClick={() => {
                          setStationFilter(station.id);
                          setActiveView('orders');
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg lg:rounded-xl transition"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg lg:text-xl">{station.icon}</span>
                          <span className="font-medium text-gray-900 text-sm lg:text-base">{station.name}</span>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-500">
                          {orders.filter(order => 
                            order.items.some(item => item.station === station.id) && 
                            order.status !== 'completed'
                          ).length} orders
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveView('orders')}
                      className="text-orange-600 hover:text-orange-700 text-xs lg:text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    {orders.slice(0, 5).map(order => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl border">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{order.orderNumber}</p>
                            <p className="text-xs lg:text-sm text-gray-500 truncate">{order.tableNumber} • {getTimeElapsed(order.orderTime)}</p>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3 ml-2">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                            {order.status === 'ready' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap"
                              >
                                Serve
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeView === 'orders' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Order Management</h3>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black flex-1 sm:flex-none"
                    >
                      <option value="active">Active Orders</option>
                      <option value="completed">Completed</option>
                      <option value="all">All Orders</option>
                    </select>
                    <select 
                      value={stationFilter}
                      onChange={(e) => setStationFilter(e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black flex-1 sm:flex-none"
                    >
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredOrders.map(order => {
                  const statusConfig = getStatusConfig(order.status);
                  const priorityConfig = getPriorityConfig(order.priority);
                  const isDelayed = isOrderDelayed(order);
                  
                  return (
                    <div key={order.id} className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border hover:shadow-lg transition ${
                      isDelayed ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
                    }`}>
                      <div className={`p-4 lg:p-6 border-b ${isDelayed ? 'bg-red-50/30' : ''}`}>
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-lg lg:text-xl font-bold text-gray-900 truncate">{order.tableNumber}</h4>
                              {priorityConfig.label && (
                                <span className={`text-xs font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full ${priorityConfig.bg} ${priorityConfig.color} whitespace-nowrap`}>
                                  {priorityConfig.icon} {priorityConfig.label}
                                </span>
                              )}
                              {isDelayed && (
                                <span className="flex items-center text-xs font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                                  <AlertTriangle className="w-3 h-3 mr-1" />Delayed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">Waiter: {order.waiterName}</p>
                          </div>
                          <div className={`flex items-center space-x-2 px-3 lg:px-4 py-1.5 lg:py-2 h-fit rounded-full border ${statusConfig.color} self-start`}>
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></div>
                            <span className="text-xs lg:text-sm font-medium whitespace-nowrap">{statusConfig.label}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs lg:text-sm">
                          <span className="text-gray-600 flex items-center"><Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />{getTimeElapsed(order.orderTime)}</span>
                          {order.startedTime && <span className="text-gray-600">Prep: {getTimeSince(order.startedTime)}</span>}
                        </div>
                        {order.customerNotes && (
                          <div className="mt-3 lg:mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-blue-900 font-medium">💬 {order.customerNotes}</p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 lg:p-6">
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="p-3 lg:p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition">
                              <div className="font-bold text-base lg:text-lg mb-1 text-gray-900">{item.quantity}x {item.name}</div>
                              {item.specialRequest && (
                                <div className="text-xs lg:text-sm text-orange-700 bg-orange-50 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg inline-block mt-2 border border-orange-200">
                                  ⚠️ {item.specialRequest}
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                                <span className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg ${getStationColor(item.station)} whitespace-nowrap`}>
                                  {stations.find(s => s.id === item.station)?.icon} {item.station}
                                </span>
                                <span className="text-gray-600 bg-gray-100 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg whitespace-nowrap">⏱️ {item.cookTime}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 lg:p-6 border-t bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {order.status === 'pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2">
                              <ChefHat className="w-4 h-4 lg:w-5 lg:h-5" /><span>Start</span>
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" /><span>Ready</span>
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg text-sm lg:text-base">
                              Served
                            </button>
                          )}
                          <button onClick={() => setSelectedOrder(order)} className="bg-gray-100 hover:bg-gray-200 p-2.5 lg:p-3.5 rounded-xl transition sm:w-auto w-full flex items-center justify-center">
                            <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-gray-900" />
                            <span className="ml-2 sm:hidden text-black">View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-2xl border shadow-sm">
                  <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">🍽️</div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3 text-black">Kitchen is Clear</h3>
                  <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base">No orders match your filters</p>
                  {isDemoMode && (
                    <button onClick={resetDemo} className="bg-gray-900 text-white px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-xl font-semibold text-sm lg:text-base">Reset Demo</button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Stations View */}
          {activeView === 'stations' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Kitchen Stations</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stations.filter(s => s.id !== 'all').map(station => {
                  const stationOrders = orders.filter(order => 
                    order.items.some(item => item.station === station.id) && 
                    order.status !== 'completed'
                  );
                  return (
                    <div key={station.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 text-center hover:shadow-md transition">
                      <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">{station.icon}</div>
                      <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-2">{station.name}</h4>
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stationOrders.length}</div>
                      <p className="text-xs lg:text-sm text-gray-600">Active Orders</p>
                      <button 
                        onClick={() => {
                          setStationFilter(station.id);
                          setActiveView('orders');
                        }}
                        className="w-full mt-3 lg:mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 lg:py-2.5 rounded-xl font-medium transition text-sm lg:text-base"
                      >
                        View Orders
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inventory View */}
        {activeView === 'inventory' && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add Item</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">87</p>
        <p className="text-sm text-gray-600">Total Items</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">8</p>
        <p className="text-sm text-gray-600">Low Stock</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">45,820</p>
        <p className="text-sm text-gray-600">Stock Value (ETB)</p>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Item</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Chicken Breast', stock: '25 kg', status: 'Good' },
              { name: 'Tomatoes', stock: '15 kg', status: 'Good' },
              { name: 'Lettuce', stock: '3 kg', status: 'Low', alert: true },
              { name: 'Pasta', stock: '8 kg', status: 'Good' },
              { name: 'Coffee Beans', stock: '6 kg', status: 'Good' }
            ].map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">{item.stock}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.alert ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

          {/* Reports View */}
          {activeView === 'reports' && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900">Kitchen Reports</h3>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2">
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">328</p>
        <p className="text-sm text-gray-600">Orders Prepared</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">18.5m</p>
        <p className="text-sm text-gray-600">Avg Prep Time</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">28.3%</p>
        <p className="text-sm text-gray-600">Food Cost</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <p className="text-2xl font-bold text-gray-900">1,240</p>
        <p className="text-sm text-gray-600">Waste (ETB)</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">Popular Dishes</h4>
        <div className="space-y-3">
          {[
            { name: 'Grilled Salmon', orders: 156 },
            { name: 'Spaghetti Carbonara', orders: 143 },
            { name: 'Ribeye Steak', orders: 128 },
            { name: 'Chicken Alfredo', orders: 112 }
          ].map((dish, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-900">{dish.name}</span>
              <span className="text-gray-600">{dish.orders} orders</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">Kitchen Efficiency</h4>
        <div className="space-y-4">
          {[
            { metric: 'Order Accuracy', value: '98.2%' },
            { metric: 'On-Time Delivery', value: '94.7%' },
            { metric: 'Staff Efficiency', value: '88.5%' }
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">{item.metric}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: item.value }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">System Settings</h3>
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <p className="text-gray-600 text-center py-8 lg:py-12">Settings features coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Table</p>
                    <p className="font-semibold">{selectedOrder.tableNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Waiter</p>
                    <p className="font-semibold">{selectedOrder.waiterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{getStatusConfig(selectedOrder.status).label}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-semibold">{item.quantity}x {item.name}</p>
                        {item.specialRequest && (
                          <p className="text-sm text-orange-700 mt-1">Special: {item.specialRequest}</p>
                        )}
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Station: {item.station}</span>
                          <span>Cook Time: {item.cookTime}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedOrder.customerNotes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Customer Notes</p>
                    <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                      {selectedOrder.customerNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}