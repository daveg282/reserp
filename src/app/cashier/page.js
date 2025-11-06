'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Clock, CheckCircle, AlertCircle, Plus, Edit, Eye, 
  Utensils, DollarSign, Bell, Search, Filter, Home, 
  ShoppingCart, Package, BarChart3, Settings, Menu, LogOut,
  CreditCard, Receipt, Calculator, TrendingUp, ChevronDown,
  X, Download, Printer, Split, Percent, Calendar,
  Smartphone, QrCode, User, Shield, Database,
  ArrowLeft, Crown, RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function CashierDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [] });
  const [paymentData, setPaymentData] = useState({ method: 'cash', amount: 0, tip: 0, split: 1 });
  const [showSearch, setShowSearch] = useState(false);
  
  const demoTimeoutRef = useRef(null);

  // Mock data
  const mockTables = [
    { id: 1, number: 'T01', capacity: 2, status: 'occupied', customerCount: 2, waiter: 'Sarah', section: 'Main' },
    { id: 2, number: 'T02', capacity: 4, status: 'available', customerCount: 0, waiter: '', section: 'Main' },
    { id: 3, number: 'T03', capacity: 4, status: 'occupied', customerCount: 4, waiter: 'Michael', section: 'Main' },
    { id: 4, number: 'T04', capacity: 6, status: 'reserved', customerCount: 0, waiter: '', section: 'VIP', reservationTime: '19:00' },
    { id: 5, number: 'T05', capacity: 2, status: 'available', customerCount: 0, waiter: '', section: 'Main' },
    { id: 6, number: 'T06', capacity: 4, status: 'occupied', customerCount: 3, waiter: 'Emma', section: 'Patio' },
    { id: 7, number: 'T07', capacity: 8, status: 'occupied', customerCount: 6, waiter: 'Sarah', section: 'VIP', isVIP: true },
    { id: 8, number: 'T08', capacity: 2, status: 'available', customerCount: 0, waiter: '', section: 'Patio' },
  ];
  const handleLogout = () => {
  setIsLoading(true);
  // Simulate logout process
  setTimeout(() => {
    router.push('/login'); // Navigate to home page
  }, 1000);
};
  const mockOrders = [
    {
      id: 1,
      tableId: 1,
      tableNumber: 'T01',
      orderNumber: 'ORD-001',
      items: [
        { id: 1, name: 'Pasta Carbonara', quantity: 1, price: 180, category: 'Main Course', specialRequest: 'Extra cheese' },
        { id: 2, name: 'Caesar Salad', quantity: 2, price: 85, category: 'Salad' },
        { id: 501, name: 'Coca Cola', quantity: 2, price: 25, category: 'Drinks' }
      ],
      status: 'ready',
      orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
      total: 380
    },
    {
      id: 2,
      tableId: 3,
      tableNumber: 'T03',
      orderNumber: 'ORD-002',
      items: [
        { id: 3, name: 'Grilled Salmon', quantity: 2, price: 280, category: 'Main Course' },
        { id: 4, name: 'French Fries', quantity: 2, price: 55, category: 'Sides' },
        { id: 502, name: 'Fresh Orange Juice', quantity: 2, price: 45, category: 'Drinks' }
      ],
      status: 'preparing',
      orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
      total: 840
    },
    {
      id: 3,
      tableId: 6,
      tableNumber: 'T06',
      orderNumber: 'ORD-003',
      items: [
        { id: 5, name: 'Margherita Pizza', quantity: 1, price: 160, category: 'Pizza' },
        { id: 401, name: 'Greek Salad', quantity: 1, price: 95, category: 'Salads' }
      ],
      status: 'pending',
      orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
      total: 255
    },
    {
      id: 4,
      tableId: 7,
      tableNumber: 'T07',
      orderNumber: 'ORD-004',
      items: [
        { id: 203, name: 'Ribeye Steak', quantity: 2, price: 350, category: 'Main Course' },
        { id: 303, name: 'Vegetarian Pizza', quantity: 1, price: 175, category: 'Pizza' },
        { id: 102, name: 'Garlic Bread', quantity: 2, price: 45, category: 'Starters' },
        { id: 504, name: 'Iced Tea', quantity: 4, price: 30, category: 'Drinks' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 45 * 60000).toISOString(),
      total: 1265
    }
  ];

  const menuCategories = [
    {
      name: 'Starters',
      items: [
        { id: 101, name: 'Bruschetta', price: 65, description: 'Toasted bread with tomatoes' },
        { id: 102, name: 'Garlic Bread', price: 45, description: 'Fresh baked with herbs' },
        { id: 103, name: 'Soup of the Day', price: 70, description: 'Chef special' }
      ]
    },
    {
      name: 'Main Course',
      items: [
        { id: 201, name: 'Pasta Carbonara', price: 180, description: 'Classic Italian pasta' },
        { id: 202, name: 'Grilled Salmon', price: 280, description: 'With lemon butter sauce' },
        { id: 203, name: 'Ribeye Steak', price: 350, description: 'Premium cut, 250g' },
        { id: 204, name: 'Chicken Parmesan', price: 220, description: 'Breaded with marinara' }
      ]
    },
    {
      name: 'Pizza',
      items: [
        { id: 301, name: 'Margherita Pizza', price: 160, description: 'Tomato, mozzarella, basil' },
        { id: 302, name: 'Pepperoni Pizza', price: 190, description: 'Loaded with pepperoni' },
        { id: 303, name: 'Vegetarian Pizza', price: 175, description: 'Fresh vegetables' }
      ]
    },
    {
      name: 'Salads',
      items: [
        { id: 401, name: 'Caesar Salad', price: 85, description: 'Romaine, parmesan, croutons' },
        { id: 402, name: 'Greek Salad', price: 95, description: 'Feta, olives, cucumber' }
      ]
    },
    {
      name: 'Drinks',
      items: [
        { id: 501, name: 'Coca Cola', price: 25, description: '330ml can' },
        { id: 502, name: 'Fresh Orange Juice', price: 45, description: 'Freshly squeezed' },
        { id: 503, name: 'Coffee', price: 35, description: 'Espresso or Americano' },
        { id: 504, name: 'Iced Tea', price: 30, description: 'Lemon or peach' }
      ]
    }
  ];

  const todaySales = {
    total: 4580.25,
    transactions: 28,
    average: 163.58,
    cash: 2450.00,
    card: 1860.25,
    mobile: 270.00
  };

  useEffect(() => {
    setTables(mockTables);
    setOrders(mockOrders);
    if (isDemoMode) startDemo();
    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, [isDemoMode]);

  const startDemo = () => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    const simulateDemo = () => {
      setOrders(prev => {
        let updated = [...prev];
        updated = updated.map(order => {
          const rand = Math.random();
          if (order.status === 'pending' && rand > 0.7) {
            return { ...order, status: 'preparing' };
          }
          if (order.status === 'preparing' && rand > 0.6) {
            return { ...order, status: 'ready' };
          }
          return order;
        });
        
        // Add new orders occasionally
        if (Math.random() > 0.8 && updated.length < 8) {
          const newOrder = {
            id: Date.now(),
            tableId: Math.floor(Math.random() * 8) + 1,
            tableNumber: `T0${Math.floor(Math.random() * 8) + 1}`,
            orderNumber: `ORD-${String(updated.length + 100).padStart(3, '0')}`,
            items: [
              { 
                id: Math.floor(Math.random() * 500) + 1, 
                name: 'Sample Item', 
                quantity: Math.floor(Math.random() * 3) + 1, 
                price: Math.floor(Math.random() * 200) + 50, 
                category: 'Demo' 
              }
            ],
            status: 'pending',
            orderTime: new Date().toISOString(),
            total: Math.floor(Math.random() * 500) + 100
          };
          updated.unshift(newOrder);
        }
        
        return updated;
      });

      if (isDemoMode) demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
    };
    demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
  };

  const getTableStatus = (tableId) => {
    const tableOrders = orders.filter(o => o.tableId === tableId && o.status !== 'completed');
    if (tableOrders.length === 0) return null;
    
    const hasReady = tableOrders.some(o => o.status === 'ready');
    const hasPreparing = tableOrders.some(o => o.status === 'preparing');
    const hasPending = tableOrders.some(o => o.status === 'pending');

    if (hasReady) return { label: 'Ready to Bill', color: 'bg-emerald-500', icon: CheckCircle };
    if (hasPreparing) return { label: 'Preparing', color: 'bg-amber-500', icon: Clock };
    if (hasPending) return { label: 'Pending', color: 'bg-blue-500', icon: AlertCircle };
    return null;
  };

  const getTableOrders = (tableId) => {
    return orders.filter(o => o.tableId === tableId && o.status !== 'completed');
  };

  const getTableTotal = (tableId) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const addItemToOrder = (item) => {
    const existingItem = currentOrder.items.find(i => i.id === item.id);
    if (existingItem) {
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }));
    } else {
      setCurrentOrder(prev => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1, specialRequest: '' }]
      }));
    }
  };

  const removeItemFromOrder = (itemId) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId)
    }));
  };

  const updateItemQuantity = (itemId, change) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.map(i => {
        if (i.id === itemId) {
          const newQty = Math.max(1, i.quantity + change);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    }));
  };

  const updateSpecialRequest = (itemId, request) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, specialRequest: request } : i)
    }));
  };

  const submitOrder = () => {
    if (currentOrder.items.length === 0 || !currentOrder.tableId) {
      alert('Please select a table and add items');
      return;
    }

    const table = tables.find(t => t.id === currentOrder.tableId);
    const newOrder = {
      id: Date.now(),
      tableId: currentOrder.tableId,
      tableNumber: table.number,
      orderNumber: `ORD-${String(orders.length + 100).padStart(3, '0')}`,
      items: currentOrder.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: menuCategories.find(cat => cat.items.some(i => i.id === item.id))?.name || 'Other',
        specialRequest: item.specialRequest || undefined
      })),
      status: 'pending',
      orderTime: new Date().toISOString(),
      total: currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder({ tableId: null, items: [] });
    setShowNewOrder(false);
  };

  const processPayment = (order) => {
    setSelectedOrder(order);
    setPaymentData({
      method: 'cash',
      amount: order.total,
      tip: 0,
      split: 1
    });
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id ? { ...o, status: 'completed', payment: paymentData } : o
      ));
      setShowPaymentModal(false);
      setSelectedOrder(null);
    }
  };

  const printReceipt = (order) => {
    // In real implementation, this would connect to a receipt printer
    console.log('Printing receipt for:', order.orderNumber);
  };

  const resetDemo = () => {
    setTables(mockTables);
    setOrders(mockOrders);
  };

  const getTimeElapsed = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return diff < 1 ? 'Just now' : `${diff} min ago`;
  };

  const getOrderTotal = () => {
    return currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', view: 'dashboard' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: orders.filter(o => o.status === 'ready').length, view: 'orders' },
    { id: 'tables', icon: Utensils, label: 'Tables', view: 'tables' },
    { id: 'menu', icon: Package, label: 'Menu Management', view: 'menu' },
    { id: 'billing', icon: DollarSign, label: 'Billing', view: 'billing' },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

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
      <div className={`fixed lg:static bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Cashier POS</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
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
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-blue-700 text-blue-100'
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
  
        {/* User Info */}
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
                  {activeView === 'dashboard' && 'POS Dashboard'}
                  {activeView === 'orders' && 'Order Management'}
                  {activeView === 'tables' && 'Table Management'}
                  {activeView === 'menu' && 'Menu Management'}
                  {activeView === 'billing' && 'Billing & Payments'}
                  {activeView === 'reports' && 'Sales Reports'}
                  {activeView === 'settings' && 'System Settings'}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search - Mobile */}
              {showSearch ? (
                <div className="lg:hidden relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    onClick={() => setShowSearch(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Search - Desktop */}
                  <div className="hidden lg:block relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 xl:w-64"
                    />
                  </div>

                  {/* Search Button - Mobile */}
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* New Order Button */}
                  <button
                    onClick={() => setShowNewOrder(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2 lg:px-4 lg:py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">New Order</span>
                  </button>

                  {/* Demo Mode Toggle */}
                  {isDemoMode ? (
                    <button 
                      onClick={() => setIsDemoMode(false)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-xl font-medium text-sm"
                    >
                      Exit Demo
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsDemoMode(true)}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-medium text-sm"
                    >
                      Start Demo
                    </button>
                  )}
                </>
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
                  { label: 'Today Revenue', value: `ETB ${todaySales.total.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
                  { label: 'Pending Orders', value: orders.filter(o => o.status === 'ready').length, icon: ShoppingCart, color: 'blue' },
                  { label: 'Occupied Tables', value: tables.filter(t => t.status === 'occupied').length, icon: Users, color: 'purple' },
                  { label: 'Transactions', value: todaySales.transactions, icon: CreditCard, color: 'purple' }
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

              {/* Quick Actions & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowNewOrder(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm lg:text-base"
                    >
                      <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Create New Order</span>
                    </button>
                    <button 
                      onClick={() => setActiveView('billing')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm lg:text-base"
                    >
                      <DollarSign className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Process Payments</span>
                    </button>
                    <button 
                      onClick={() => setActiveView('reports')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm lg:text-base"
                    >
                      <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>View Reports</span>
                    </button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveView('orders')}
                      className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl border">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{order.orderNumber}</p>
                          <p className="text-xs lg:text-sm text-gray-500 truncate">Table {order.tableNumber} • {getTimeElapsed(order.orderTime)}</p>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 ml-2">
                          <span className="font-bold text-gray-900 text-sm lg:text-base">{order.total.toFixed(2)} ETB</span>
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                          {order.status === 'ready' && (
                            <button 
                              onClick={() => processPayment(order)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap"
                            >
                              Bill
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeView === 'orders' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Order Management</h3>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black flex-1 sm:flex-none"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready to Bill</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {orders
                  .filter(order => filterStatus === 'all' || order.status === filterStatus)
                  .filter(order => 
                    searchQuery === '' || 
                    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(order => (
                  <div key={order.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-base lg:text-lg truncate">{order.orderNumber}</h4>
                        <p className="text-sm text-gray-500">Table {order.tableNumber} • {getTimeElapsed(order.orderTime)}</p>
                      </div>
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3 lg:mb-4 text-black">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs lg:text-sm">
                          <span className="text-gray-600 truncate flex-1">{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-gray-900 flex-shrink-0 ml-2">{(item.price * item.quantity).toFixed(2)} ETB</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200">
                      <p className="text-base lg:text-lg font-bold text-black">Total: {order.total.toFixed(2)} ETB</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                        >
                          View
                        </button>
                        {order.status === 'ready' && (
                          <button 
                            onClick={() => processPayment(order)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                          >
                            Bill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables View */}
          {activeView === 'tables' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Table Management</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                {tables.map(table => {
                  const orderStatus = getTableStatus(table.id);
                  const tableOrders = getTableOrders(table.id);
                  const tableTotal = getTableTotal(table.id);

                  return (
                    <div
                      key={table.id}
                      className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border-2 p-3 lg:p-4 text-center cursor-pointer transition ${
                        table.status === 'available' ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100' :
                        table.status === 'occupied' ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' :
                        table.status === 'reserved' ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''
                      } ${table.isVIP ? 'ring-2 ring-purple-300' : ''}`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">{table.number}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getStatusColor(table.status)}`}>
                        {table.status}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{table.section}</p>
                      <p className="text-xs text-gray-600">Capacity: {table.capacity}</p>
                      
                      {orderStatus && (
                        <div className={`mt-2 px-2 py-1 rounded-lg text-xs font-semibold text-white ${orderStatus.color}`}>
                          {orderStatus.label}
                        </div>
                      )}
                      
                      {tableOrders.length > 0 && (
                        <p className="text-sm font-semibold text-gray-900 mt-2">{tableTotal.toFixed(2)} ETB</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Billing View */}
          {activeView === 'billing' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Billing & Payments</h3>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Table</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.orderNumber}</p>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">{order.tableNumber}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <p className="font-bold text-gray-900 text-sm lg:text-base">{order.total.toFixed(2)} ETB</p>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-500">{getTimeElapsed(order.orderTime)}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex space-x-1 lg:space-x-2">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                              >
                                View
                              </button>
                              {order.status === 'ready' && (
                                <button 
                                  onClick={() => processPayment(order)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                                >
                                  Bill
                                </button>
                              )}
                              {order.status === 'completed' && (
                                <button 
                                  onClick={() => printReceipt(order)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                                >
                                  Receipt
                                </button>
                              )}
                            </div>
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
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Sales Reports</h3>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">Real-time sales analytics and insights</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 text-black w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium bg-white flex-1 sm:flex-none">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>Custom Range</option>
                    </select>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm flex-1 sm:flex-none">
                      <Calendar className="w-4 h-4" />
                      <span>Date Range</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
                      <Printer className="w-4 h-4" />
                      <span>Print Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { 
                    label: 'Total Revenue', 
                    value: `ETB ${todaySales.total.toLocaleString()}`, 
                    icon: DollarSign, 
                    color: 'emerald',
                    change: '+12.5%',
                    trend: 'up'
                  },
                  { 
                    label: 'Transactions', 
                    value: todaySales.transactions, 
                    icon: CreditCard, 
                    color: 'blue',
                    change: '+8.2%',
                    trend: 'up'
                  },
                  { 
                    label: 'Average Order', 
                    value: `ETB ${todaySales.average.toFixed(2)}`, 
                    icon: TrendingUp, 
                    color: 'purple',
                    change: '+3.1%',
                    trend: 'up'
                  },
                  { 
                    label: 'Active Tables', 
                    value: tables.filter(t => t.status === 'occupied').length, 
                    icon: Utensils, 
                    color: 'purple',
                    change: '+2',
                    trend: 'up'
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                      </div>
                      <span className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 lg:w-4 lg:h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span>{stat.change}</span>
                      </span>
                    </div>
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Payment Methods Breakdown */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h4 className="font-bold text-gray-900 text-base lg:text-lg">Payment Methods</h4>
                    <span className="text-sm text-black">Today</span>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    {[
                      { method: 'Cash', amount: todaySales.cash, percentage: ((todaySales.cash / todaySales.total) * 100).toFixed(1), color: 'emerald' },
                      { method: 'Card', amount: todaySales.card, percentage: ((todaySales.card / todaySales.total) * 100).toFixed(1), color: 'blue' },
                      { method: 'Mobile', amount: todaySales.mobile, percentage: ((todaySales.mobile / todaySales.total) * 100).toFixed(1), color: 'purple' }
                    ].map((payment, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-${payment.color}-500`}></div>
                            <span className="font-medium text-gray-700 text-sm lg:text-base">{payment.method}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">{payment.amount.toFixed(2)} ETB</span>
                            <span className="text-xs lg:text-sm text-gray-500 ml-1 lg:ml-2">{payment.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                          <div 
                            className={`h-1.5 lg:h-2 rounded-full bg-${payment.color}-500 transition-all duration-500`}
                            style={{ width: `${payment.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="xl:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h4 className="font-bold text-gray-900 text-base lg:text-lg">Revenue Trend</h4>
                    <select className="border border-gray-300 rounded-lg px-2 lg:px-3 py-1 lg:py-1 text-xs lg:text-sm text-black">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                    </select>
                  </div>
                  <div className="h-48 lg:h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm lg:text-base">Revenue chart visualization</p>
                      <p className="text-xs lg:text-sm text-gray-400">Chart would display here with real data</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                  <h4 className="font-bold text-gray-900 text-base lg:text-lg">Top Selling Items</h4>
                  <button className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-medium">
                    View All Items
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 font-semibold text-gray-900 text-xs lg:text-sm">Item Name</th>
                        <th className="text-left py-2 lg:py-3 font-semibold text-gray-900 text-xs lg:text-sm">Category</th>
                        <th className="text-right py-2 lg:py-3 font-semibold text-gray-900 text-xs lg:text-sm">Quantity Sold</th>
                        <th className="text-right py-2 lg:py-3 font-semibold text-gray-900 text-xs lg:text-sm">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'Pasta Carbonara', category: 'Main Course', quantity: 24, revenue: 4320 },
                        { name: 'Grilled Salmon', category: 'Main Course', quantity: 18, revenue: 5040 },
                        { name: 'Margherita Pizza', category: 'Pizza', quantity: 22, revenue: 3520 },
                        { name: 'Caesar Salad', category: 'Salads', quantity: 32, revenue: 2720 },
                        { name: 'Fresh Orange Juice', category: 'Drinks', quantity: 45, revenue: 2025 }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2 lg:py-3 font-medium text-gray-900 text-xs lg:text-sm">{item.name}</td>
                          <td className="py-2 lg:py-3 text-gray-600 text-xs lg:text-sm">{item.category}</td>
                          <td className="py-2 lg:py-3 text-right font-semibold text-gray-900 text-xs lg:text-sm">{item.quantity}</td>
                          <td className="py-2 lg:py-3 text-right font-bold text-blue-600 text-xs lg:text-sm">{item.revenue.toFixed(2)} ETB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">System Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* Demo Controls */}
                  <div className="space-y-3 lg:space-y-4">
                    <h4 className="font-semibold text-gray-900 text-base lg:text-lg">Demo Controls</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={resetDemo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold text-sm lg:text-base"
                      >
                        Reset Demo Data
                      </button>
                      <button 
                        onClick={() => setIsDemoMode(!isDemoMode)}
                        className={`w-full py-2.5 lg:py-3 rounded-xl font-semibold text-sm lg:text-base ${
                          isDemoMode 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {isDemoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
                      </button>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="space-y-3 lg:space-y-4">
                    <h4 className="font-semibold text-gray-900 text-base lg:text-lg">System Information</h4>
                    <div className="space-y-2 text-sm text-black">
                      <div className="flex justify-between text-black">
                        <span className="text-gray-600">Restaurant Name:</span>
                        <span className="font-semibold">Bistro Elegante</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">POS Version:</span>
                        <span className="font-semibold">v2.1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-semibold">Today, 14:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Management View */}
          {activeView === 'menu' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Menu Management</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium flex items-center space-x-2 text-sm lg:text-base">
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 lg:gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                      />
                    </div>
                    <select className="border border-gray-300 rounded-xl text-black px-3 lg:px-4 py-2 text-sm font-medium w-full sm:w-auto mt-3 sm:mt-0">
                      <option>All Categories</option>
                      <option>Starters</option>
                      <option>Main Course</option>
                      <option>Pizza</option>
                      <option>Salads</option>
                      <option>Drinks</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 lg:p-6">
                  <div className="space-y-4 lg:space-y-6">
                    {menuCategories.map(category => (
                      <div key={category.name}>
                        <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                          {category.items.map(item => (
                            <div key={item.id} className="border border-gray-200 rounded-xl p-3 lg:p-4 hover:shadow-md transition">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</h5>
                                <span className="font-bold text-blue-600 text-sm lg:text-base">{item.price} ETB</span>
                              </div>
                              <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">{item.description}</p>
                              <div className="flex space-x-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition">
                                  Edit
                                </button>
                                <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition">
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Create New Order</h3>
              <button onClick={() => setShowNewOrder(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 h-[60vh]">
              {/* Table Selection */}
              <div className="lg:col-span-1 border-r border-gray-200 p-4 lg:p-6 overflow-y-auto">
                <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">Select Table</h4>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {tables.map(table => (
                    <button
                      key={table.id}
                      onClick={() => setCurrentOrder(prev => ({ ...prev, tableId: table.id }))}
                      className={`p-3 lg:p-4 rounded-xl border-2 text-center transition ${
                        currentOrder.tableId === table.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${
                        table.status === 'available' ? 'bg-emerald-50 border-emerald-200' :
                        table.status === 'occupied' ? 'bg-blue-50 border-blue-200' :
                        table.status === 'reserved' ? 'bg-amber-50 border-amber-200' : ''
                      }`}
                      disabled={table.status !== 'available'}
                    >
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">{table.number}</p>
                      <p className="text-xs text-gray-500">{table.status}</p>
                      <p className="text-xs text-gray-500">{table.capacity} seats</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu */}
              <div className="lg:col-span-1 border-r border-gray-200 p-4 lg:p-6 overflow-y-auto">
                <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">Menu</h4>
                <div className="space-y-3 lg:space-y-4">
                  {menuCategories.map(category => (
                    <div key={category.name}>
                      <h5 className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">{category.name}</h5>
                      <div className="space-y-2">
                        {category.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => addItemToOrder(item)}
                            className="w-full text-left p-2 lg:p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition text-sm lg:text-base"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                <p className="text-gray-500 text-xs lg:text-sm truncate">{item.description}</p>
                              </div>
                              <span className="font-bold text-blue-600 text-sm lg:text-base flex-shrink-0 ml-2">{item.price} ETB</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Order */}
              <div className="lg:col-span-1 p-4 lg:p-6 overflow-y-auto text-black">
                <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">Current Order</h4>
                {currentOrder.tableId && (
                  <p className="text-sm text-gray-600 mb-3 lg:mb-4">Table: {tables.find(t => t.id === currentOrder.tableId)?.number}</p>
                )}
                
                <div className="space-y-3 lg:space-y-4 mb-3 lg:mb-4">
                  {currentOrder.items.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-2 lg:p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</p>
                          <p className="text-gray-600 text-xs lg:text-sm">{item.price} ETB × {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <button 
                            onClick={() => updateItemQuantity(item.id, -1)}
                            className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs lg:text-sm"
                          >
                            -
                          </button>
                          <span className="font-semibold text-sm lg:text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateItemQuantity(item.id, 1)}
                            className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs lg:text-sm"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeItemFromOrder(item.id)}
                            className="text-red-500 hover:text-red-700 ml-1 lg:ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Special requests..."
                        value={item.specialRequest}
                        onChange={(e) => updateSpecialRequest(item.id, e.target.value)}
                        className="w-full px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-lg text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>

                {currentOrder.items.length > 0 && (
                  <div className="border-t border-gray-200 pt-3 lg:pt-4">
                    <div className="flex justify-between items-center mb-3 lg:mb-4">
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">Total:</span>
                      <span className="text-lg lg:text-xl font-bold text-blue-600">{getOrderTotal().toFixed(2)} ETB</span>
                    </div>
                    <button
                      onClick={submitOrder}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                    >
                      Submit Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Process Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-3 lg:space-y-4 text-black">
              <div className="bg-gray-50 rounded-xl p-3 lg:p-4">
                <p className="font-semibold text-gray-900 text-sm lg:text-base">{selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-600">Table {selectedOrder.tableNumber}</p>
                <p className="text-base lg:text-lg font-bold text-gray-900 mt-1 lg:mt-2">Total: {selectedOrder.total.toFixed(2)} ETB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1 lg:mb-2">Payment Method</label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2 lg:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Tip Amount</label>
                <input
                  type="number"
                  value={paymentData.tip}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, tip: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2 lg:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">Split Bill (Number of ways)</label>
                <input
                  type="number"
                  value={paymentData.split}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, split: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-300 rounded-xl px-3 lg:px-4 py-2 lg:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  min="1"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-3 lg:p-4">
                <div className="flex justify-between text-xs lg:text-sm">
                  <span>Subtotal:</span>
                  <span>{selectedOrder.total.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-xs lg:text-sm">
                  <span>Tip:</span>
                  <span>{paymentData.tip.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between font-bold text-base lg:text-lg mt-1 lg:mt-2">
                  <span>Total:</span>
                  <span>{(selectedOrder.total + paymentData.tip).toFixed(2)} ETB</span>
                </div>
                {paymentData.split > 1 && (
                  <div className="flex justify-between text-xs lg:text-sm mt-1 lg:mt-2">
                    <span>Per person ({paymentData.split}):</span>
                    <span>{((selectedOrder.total + paymentData.tip) / paymentData.split).toFixed(2)} ETB</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 lg:space-x-3 pt-3 lg:pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={completePayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Order Details - {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Table Number</p>
                  <p className="font-semibold text-sm lg:text-base">{selectedOrder.tableNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Order Time</p>
                  <p className="font-semibold text-sm lg:text-base">{new Date(selectedOrder.orderTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Status</p>
                  <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Total Amount</p>
                  <p className="font-bold text-base lg:text-lg">{selectedOrder.total.toFixed(2)} ETB</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Order Items</h4>
                <div className="space-y-2 lg:space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-2 lg:p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.quantity}x {item.name}</p>
                        <p className="text-gray-600 text-xs lg:text-sm">{item.category}</p>
                        {item.specialRequest && (
                          <p className="text-xs text-blue-600 mt-1">Note: {item.specialRequest}</p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm lg:text-base flex-shrink-0 ml-2">{(item.price * item.quantity).toFixed(2)} ETB</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 lg:space-x-3 pt-3 lg:pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Close
                </button>
                {selectedOrder.status === 'ready' && (
                  <button
                    onClick={() => processPayment(selectedOrder)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                  >
                    Process Payment
                  </button>
                )}
                <button
                  onClick={() => printReceipt(selectedOrder)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                  >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Details Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Table {selectedTable.number}</h3>
              <button onClick={() => setSelectedTable(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Section</p>
                  <p className="font-semibold text-sm lg:text-base">{selectedTable.section}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Capacity</p>
                  <p className="font-semibold text-sm lg:text-base">{selectedTable.capacity} people</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs lg:text-sm">Status</p>
                  <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTable.status)}`}>
                    {selectedTable.status}
                  </span>
                </div>
                {selectedTable.waiter && (
                  <div>
                    <p className="text-gray-600 text-xs lg:text-sm">Waiter</p>
                    <p className="font-semibold text-sm lg:text-base">{selectedTable.waiter}</p>
                  </div>
                )}
              </div>

              {selectedTable.status === 'reserved' && selectedTable.reservationTime && (
                <div className="bg-amber-50 rounded-xl p-3 lg:p-4">
                  <p className="text-sm font-semibold text-amber-800">Reserved for {selectedTable.reservationTime}</p>
                </div>
              )}

              {selectedTable.status === 'occupied' && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Active Orders</h4>
                  {getTableOrders(selectedTable.id).length === 0 ? (
                    <p className="text-gray-500 text-sm">No active orders</p>
                  ) : (
                    <div className="space-y-2">
                      {getTableOrders(selectedTable.id).map(order => (
                        <div key={order.id} className="flex justify-between items-center p-2 lg:p-3 bg-gray-50 rounded-xl">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.orderNumber}</p>
                            <p className="text-xs text-gray-600">{order.status}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.total.toFixed(2)} ETB</p>
                            {order.status === 'ready' && (
                              <button
                                onClick={() => {
                                  processPayment(order);
                                  setSelectedTable(null);
                                }}
                                className="text-green-600 hover:text-green-700 text-xs lg:text-sm font-medium"
                              >
                                Bill Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2">
                        <p className="font-bold text-gray-900 text-right text-sm lg:text-base">
                          Table Total: {getTableTotal(selectedTable.id).toFixed(2)} ETB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-2 lg:space-x-3 pt-3 lg:pt-4">
                <button
                  onClick={() => setSelectedTable(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Close
                </button>
                {selectedTable.status === 'available' && (
                  <button
                    onClick={() => {
                      setCurrentOrder(prev => ({ ...prev, tableId: selectedTable.id }));
                      setShowNewOrder(true);
                      setSelectedTable(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                  >
                    Create Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get status colors
function getStatusColor(status) {
  switch (status) {
    case 'available':
      return 'bg-emerald-100 text-emerald-700';
    case 'occupied':
      return 'bg-blue-100 text-blue-700';
    case 'reserved':
      return 'bg-amber-100 text-amber-700';
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'preparing':
      return 'bg-amber-100 text-amber-700';
    case 'ready':
      return 'bg-emerald-100 text-emerald-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}