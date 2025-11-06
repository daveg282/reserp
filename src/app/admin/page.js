'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, DollarSign, ShoppingCart, Package, 
  Settings, BarChart3, Bell, Menu, LogOut, Plus,
  Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle,
  CreditCard, Smartphone, ChefHat, Utensils, Home,
  FileText, Calendar, Download, Filter, Search,
  ChevronDown, ChevronRight, X, RefreshCw,
  Phone, Mail, MapPin, User, Shield, Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [timeRange, setTimeRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const demoTimeoutRef = useRef(null);
  const router = useRouter();

  // Mock data for demonstration
  const mockUsers = [
    { id: 1, name: 'Sarah Johnson', role: 'waiter', email: 'sarah@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(), phone: '+251 911 234 567', joinDate: '2023-01-15' },
    { id: 2, name: 'Michael Tesfaye', role: 'cashier', email: 'michael@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 1 * 3600000).toISOString(), phone: '+251 922 345 678', joinDate: '2023-03-22' },
    { id: 3, name: 'Marco Rossi', role: 'chef', email: 'marco@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 3 * 3600000).toISOString(), phone: '+251 933 456 789', joinDate: '2022-11-05' },
    { id: 4, name: 'Emma Daniel', role: 'waiter', email: 'emma@bistroelegante.com', status: 'inactive', lastLogin: new Date(Date.now() - 24 * 3600000).toISOString(), phone: '+251 944 567 890', joinDate: '2023-06-18' },
    { id: 5, name: 'Alex Kumar', role: 'cashier', email: 'alex@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 30 * 60000).toISOString(), phone: '+251 955 678 901', joinDate: '2023-08-30' },
    { id: 6, name: 'Abebe Mekonnen', role: 'admin', email: 'abebe@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 5 * 60000).toISOString(), phone: '+251 911 000 111', joinDate: '2022-05-10' }
  ];

  const mockOrders = [
    { id: 101, tableNumber: 'T01', orderNumber: 'ORD-001', total: 556.25, status: 'completed', paymentMethod: 'cash', waiter: 'Sarah Johnson', orderTime: new Date(Date.now() - 45 * 60000).toISOString(), items: [
      { name: 'Spaghetti Carbonara', quantity: 2, price: 180 },
      { name: 'Caesar Salad', quantity: 1, price: 120 },
      { name: 'Red Wine', quantity: 1, price: 76.25 }
    ]},
    { id: 102, tableNumber: 'T03', orderNumber: 'ORD-002', total: 962.50, status: 'completed', paymentMethod: 'card', waiter: 'Michael Tesfaye', orderTime: new Date(Date.now() - 90 * 60000).toISOString(), items: [
      { name: 'Grilled Salmon', quantity: 2, price: 320 },
      { name: 'Tiramisu', quantity: 2, price: 160 },
      { name: 'White Wine', quantity: 1, price: 162.50 }
    ]},
    { id: 103, tableNumber: 'T06', orderNumber: 'ORD-003', total: 320.00, status: 'completed', paymentMethod: 'mobile', waiter: 'Emma Daniel', orderTime: new Date(Date.now() - 120 * 60000).toISOString(), items: [
      { name: 'Margherita Pizza', quantity: 1, price: 150 },
      { name: 'Garlic Bread', quantity: 1, price: 70 },
      { name: 'Soft Drinks', quantity: 2, price: 100 }
    ]},
    { id: 104, tableNumber: 'T04', orderNumber: 'ORD-004', total: 680.00, status: 'pending', paymentMethod: null, waiter: 'Sarah Johnson', orderTime: new Date(Date.now() - 15 * 60000).toISOString(), items: [
      { name: 'Ribeye Steak', quantity: 2, price: 500 },
      { name: 'Mashed Potatoes', quantity: 2, price: 120 },
      { name: 'Beer', quantity: 1, price: 60 }
    ]},
    { id: 105, tableNumber: 'T02', orderNumber: 'ORD-005', total: 425.75, status: 'preparing', paymentMethod: null, waiter: 'Alex Kumar', orderTime: new Date(Date.now() - 25 * 60000).toISOString(), items: [
      { name: 'Chicken Alfredo', quantity: 1, price: 190 },
      { name: 'Greek Salad', quantity: 1, price: 135 },
      { name: 'Iced Tea', quantity: 2, price: 100.75 }
    ]}
  ];

  const mockTables = [
    { id: 1, number: 'T01', status: 'available', capacity: 2, section: 'Main' },
    { id: 2, number: 'T02', status: 'occupied', capacity: 4, section: 'Main', customerCount: 3, orderId: 105 },
    { id: 3, number: 'T03', status: 'available', capacity: 4, section: 'Main' },
    { id: 4, number: 'T04', status: 'occupied', capacity: 6, section: 'VIP', customerCount: 4, isVIP: true, orderId: 104 },
    { id: 5, number: 'T05', status: 'reserved', capacity: 2, section: 'Patio', reservationTime: '20:00', customerName: 'Mr. Johnson' },
    { id: 6, number: 'T06', status: 'available', capacity: 4, section: 'Patio' },
    { id: 7, number: 'T07', status: 'occupied', capacity: 8, section: 'VIP', customerCount: 6, isVIP: true, orderId: 102 },
    { id: 8, number: 'T08', status: 'available', capacity: 4, section: 'Main' }
  ];

  const mockInventory = [
    { id: 1, name: 'Chicken Breast', category: 'Proteins', currentStock: 25, minStock: 10, unit: 'kg', cost: 320, supplier: 'Fresh Meats Co.', lastOrder: '2023-10-15' },
    { id: 2, name: 'Tomatoes', category: 'Vegetables', currentStock: 15, minStock: 5, unit: 'kg', cost: 45, supplier: 'Local Market', lastOrder: '2023-10-18' },
    { id: 3, name: 'Pasta', category: 'Grains', currentStock: 8, minStock: 3, unit: 'kg', cost: 85, supplier: 'Italian Imports', lastOrder: '2023-10-10' },
    { id: 4, name: 'Olive Oil', category: 'Oils', currentStock: 12, minStock: 5, unit: 'L', cost: 180, supplier: 'Mediterranean Foods', lastOrder: '2023-10-12' },
    { id: 5, name: 'Coffee Beans', category: 'Beverages', currentStock: 6, minStock: 2, unit: 'kg', cost: 420, supplier: 'Ethiopian Coffee Co.', lastOrder: '2023-10-16' },
    { id: 6, name: 'Lettuce', category: 'Vegetables', currentStock: 3, minStock: 4, unit: 'kg', cost: 35, supplier: 'Local Market', lowStock: true, lastOrder: '2023-10-17' },
    { id: 7, name: 'Beef Tenderloin', category: 'Proteins', currentStock: 18, minStock: 8, unit: 'kg', cost: 650, supplier: 'Premium Meats', lastOrder: '2023-10-14' },
    { id: 8, name: 'Mozzarella Cheese', category: 'Dairy', currentStock: 9, minStock: 4, unit: 'kg', cost: 280, supplier: 'Italian Imports', lastOrder: '2023-10-13' }
  ];

  const mockReports = {
    sales: {
      total: 12580.75,
      today: 2519.75,
      weekly: 45890.25,
      monthly: 187650.50
    },
    orders: {
      total: 342,
      completed: 328,
      pending: 8,
      cancelled: 6
    },
    customers: {
      total: 1289,
      newThisMonth: 156,
      returning: 845
    },
    inventory: {
      totalItems: 87,
      lowStock: 5,
      outOfStock: 2
    }
  };

  // Sales chart data
  const salesData = {
    today: [450, 520, 480, 610, 730, 810, 920, 880, 950, 1020, 980, 890, 760, 680, 720, 810, 950, 1120, 1250, 1320, 1280, 1150, 980, 760],
    week: [12560, 13250, 11890, 14520, 15230, 16890, 17560],
    month: [45230, 48950, 52360, 48750, 51230, 49870, 46520, 48960, 52310, 55680, 58740, 61250, 59870, 62310, 64580, 63210, 65890, 68740, 71230, 69850, 72360, 74580, 76890, 75230, 77890, 79560, 81230, 78950, 82360, 84520],
    year: [125600, 134500, 128900, 142300, 156800, 165200, 158900, 172300, 185600, 192300, 201500, 215800]
  };

  useEffect(() => {
    setUsers(mockUsers);
    setOrders(mockOrders);
    setTables(mockTables);
    setInventory(mockInventory);
    if (isDemoMode) startDemo();
    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, [isDemoMode]);

  const startDemo = () => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    const simulateDemo = () => {
      // Simulate real-time updates
      setOrders(prev => {
        const updated = [...prev];
        if (Math.random() > 0.7 && updated.length < 8) {
          const newOrder = {
            id: Date.now(),
            tableNumber: `T0${Math.floor(Math.random() * 8) + 1}`,
            orderNumber: `ORD-${String(updated.length + 100).padStart(3, '0')}`,
            total: Math.floor(Math.random() * 1000) + 100,
            status: Math.random() > 0.3 ? 'completed' : 'pending',
            paymentMethod: ['cash', 'card', 'mobile'][Math.floor(Math.random() * 3)],
            waiter: mockUsers.find(u => u.role === 'waiter').name,
            orderTime: new Date().toISOString(),
            items: [
              { name: 'Sample Item', quantity: 1, price: Math.floor(Math.random() * 200) + 50 }
            ]
          };
          updated.unshift(newOrder);
          addNotification(`New order ${newOrder.orderNumber} placed`);
        }
        return updated;
      });

      setInventory(prev => {
        return prev.map(item => {
          if (Math.random() > 0.8) {
            const newStock = Math.max(0, item.currentStock - Math.floor(Math.random() * 3));
            if (newStock <= item.minStock && !item.lowStock) {
              addNotification(`Low stock alert: ${item.name}`, 'warning');
            }
            return { ...item, currentStock: newStock, lowStock: newStock <= item.minStock };
          }
          return item;
        });
      });

      if (isDemoMode) demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
    };
    demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
  };

  const addNotification = (message, type = 'info') => {
    const notification = { id: Date.now(), message, type, time: new Date().toISOString() };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  };

  const getTimeElapsed = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    return `${Math.floor(diff / 60)} hours ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'preparing': return 'bg-amber-100 text-amber-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'occupied': return 'bg-blue-100 text-blue-700';
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'reserved': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'waiter': return 'bg-blue-100 text-blue-700';
      case 'cashier': return 'bg-green-100 text-green-700';
      case 'chef': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const resetDemo = () => {
    setUsers(mockUsers);
    setOrders(mockOrders);
    setTables(mockTables);
    setInventory(mockInventory);
    setNotifications([]);
  };

  const exportReport = (type) => {
    addNotification(`${type} report exported successfully`);
  };

  const completeOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
    addNotification(`Order ${orderId} marked as completed`);
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    addNotification('Staff member removed');
  };

  const deleteItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    addNotification('Inventory item removed');
  };

  const handleLogout = () => {
    setIsLoading(true);
    // Simulate logout process
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.waiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview', view: 'overview' },
    { id: 'users', icon: Users, label: 'Staff', badge: users.length, view: 'users' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, view: 'orders' },
    { id: 'tables', icon: Utensils, label: 'Tables', badge: tables.filter(t => t.status === 'occupied').length, view: 'tables' },
    { id: 'inventory', icon: Package, label: 'Inventory', badge: inventory.filter(i => i.lowStock).length, view: 'inventory' },
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
      <div className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col shadow-xl`}>
        
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Bistro Elegante</h1>
                <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
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
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-6 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              AM
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">Abebe Mekonnen</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200 mt-4"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
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
                  {activeView === 'overview' && 'Dashboard Overview'}
                  {activeView === 'users' && 'Staff Management'}
                  {activeView === 'orders' && 'Order Management'}
                  {activeView === 'tables' && 'Table Management'}
                  {activeView === 'inventory' && 'Inventory Management'}
                  {activeView === 'reports' && 'Reports & Analytics'}
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
                    placeholder="Search..."
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
                      placeholder="Search reports..."
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

                  {/* Notifications */}
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Time Range Selector */}
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-black hidden lg:block"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>

                  {/* Demo Mode Toggle */}
                  <div className="hidden lg:flex space-x-2">
                    {isDemoMode ? (
                      <button 
                        onClick={() => setIsDemoMode(false)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition"
                      >
                        <span>Exit Demo</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsDemoMode(true)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium transition"
                      >
                        Start Demo
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
          
          {/* Overview Dashboard */}
          {activeView === 'overview' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
                {[
                  { label: 'Total Revenue', value: `ETB ${mockReports.sales.total.toLocaleString()}`, icon: DollarSign, color: 'emerald', change: '+12.5%' },
                  { label: 'Total Orders', value: mockReports.orders.total, icon: ShoppingCart, color: 'blue', change: '+8.2%' },
                  { label: 'Active Staff', value: users.filter(u => u.status === 'active').length, icon: Users, color: 'purple', change: '+2' },
                  { label: 'Low Stock Items', value: mockReports.inventory.lowStock, icon: Package, color: 'red', change: '-1' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2 lg:mb-3 xl:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                      </div>
                      <span className={`text-xs lg:text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Revenue Overview</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition">
                      View Detailed Report
                    </button>
                  </div>
                  <div className="h-48 lg:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-end justify-between h-full space-x-1">
                      {salesData[timeRange].slice(0, 12).map((value, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-md"
                            style={{ height: `${(value / Math.max(...salesData[timeRange])) * 80}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">
                            {timeRange === 'today' ? `${index * 2}:00` : 
                             timeRange === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] :
                             timeRange === 'month' ? index + 1 : 
                             ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded shadow"></div>
                          <span className="text-gray-600">Revenue</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-300 rounded shadow"></div>
                          <span className="text-gray-600">Target</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Recent Activity</h3>
                  <div className="space-y-3 max-h-48 lg:max-h-64 overflow-y-auto pr-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 lg:py-8">
                        <Bell className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-2 lg:mb-3" />
                        <p className="text-gray-500 text-xs lg:text-sm">No recent activity</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notification => (
                        <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{getTimeElapsed(notification.time)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
                {[
                  { label: 'Occupied Tables', value: tables.filter(t => t.status === 'occupied').length, total: tables.length, color: 'blue' },
                  { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, total: orders.length, color: 'amber' },
                  { label: 'Low Stock Items', value: inventory.filter(i => i.lowStock).length, total: inventory.length, color: 'red' },
                  { label: 'Active Staff', value: users.filter(u => u.status === 'active').length, total: users.length, color: 'emerald' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6">
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <span className={`text-xs lg:text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 lg:px-3 py-1 rounded-full`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs lg:text-sm text-gray-500">of {stat.total} total</p>
                      </div>
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-bold text-gray-700">
                          {Math.round((stat.value / stat.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Management */}
          {activeView === 'users' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Staff Management</h2>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{user.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Last login: {getTimeElapsed(user.lastLogin)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Management */}
          {activeView === 'orders' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Order Management</h2>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm lg:text-base">{order.orderNumber}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">Table {order.tableNumber}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-xs lg:text-sm">
                          <span className="text-gray-600">{item.quantity}x {item.name}</span>
                          <span className="font-medium">ETB {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <div className="text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{order.waiter}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeElapsed(order.orderTime)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">ETB {order.total.toFixed(2)}</p>
                        {order.paymentMethod && (
                          <p className="text-gray-600 capitalize">{order.paymentMethod}</p>
                        )}
                      </div>
                    </div>
                    
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button
                        onClick={() => completeOrder(order.id)}
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium transition flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete Order</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Management */}
          {activeView === 'inventory' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Inventory Management</h2>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredInventory.map(item => (
                  <div key={item.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm lg:text-base">{item.name}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">{item.category}</p>
                      </div>
                      {item.lowStock && (
                        <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock</span>
                        <span className={`font-medium ${
                          item.lowStock ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Stock</span>
                        <span className="text-gray-900">{item.minStock} {item.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost</span>
                        <span className="text-gray-900">ETB {item.cost}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier</span>
                        <span className="text-gray-900 truncate ml-2">{item.supplier}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Last ordered: {new Date(item.lastOrder).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports & Analytics */}
          {activeView === 'reports' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => exportReport('Sales')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: 'Total Revenue', value: `ETB ${mockReports.sales.total.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
                  { label: 'Completed Orders', value: mockReports.orders.completed, icon: CheckCircle, color: 'blue' },
                  { label: 'Active Customers', value: mockReports.customers.total, icon: Users, color: 'purple' },
                  { label: 'Inventory Items', value: mockReports.inventory.totalItems, icon: Package, color: 'orange' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Sales Performance */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Sales Performance</h3>
                  <div className="space-y-3">
                    {[
                      { period: 'Today', amount: mockReports.sales.today, change: '+5.2%', color: 'emerald' },
                      { period: 'This Week', amount: mockReports.sales.weekly, change: '+12.8%', color: 'emerald' },
                      { period: 'This Month', amount: mockReports.sales.monthly, change: '+8.4%', color: 'emerald' },
                      { period: 'This Year', amount: mockReports.sales.total, change: '+15.3%', color: 'emerald' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{item.period}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-900">ETB {item.amount.toLocaleString()}</span>
                          <span className={`text-xs px-2 py-1 rounded-full bg-${item.color}-100 text-${item.color}-700`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Statistics */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Order Statistics</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'Completed', count: mockReports.orders.completed, color: 'emerald', percentage: Math.round((mockReports.orders.completed / mockReports.orders.total) * 100) },
                      { status: 'Pending', count: mockReports.orders.pending, color: 'amber', percentage: Math.round((mockReports.orders.pending / mockReports.orders.total) * 100) },
                      { status: 'Cancelled', count: mockReports.orders.cancelled, color: 'red', percentage: Math.round((mockReports.orders.cancelled / mockReports.orders.total) * 100) }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{stat.status}</span>
                          <span className="font-medium text-gray-900">{stat.count} ({stat.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${stat.color}-500 transition-all duration-500`}
                            style={{ width: `${stat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeView === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">System Settings</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition">
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>General Settings</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                      <input 
                        type="text" 
                        defaultValue="Bistro Elegante"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                        <option>ETB - Ethiopian Birr</option>
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                        <option>Africa/Addis_Ababa</option>
                        <option>UTC</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Data Backup</p>
                        <p className="text-sm text-gray-600">Last backup: Today, 02:00 AM</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                        Backup Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Demo Controls */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Demo Controls</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div>
                      <p className="font-medium text-gray-900">Demo Mode</p>
                      <p className="text-sm text-gray-600">Simulate real-time restaurant operations</p>
                    </div>
                    <div className="flex space-x-3">
                      {isDemoMode ? (
                        <button 
                          onClick={() => setIsDemoMode(false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition"
                        >
                          Exit Demo Mode
                        </button>
                      ) : (
                        <button 
                          onClick={() => setIsDemoMode(true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
                        >
                          Start Demo Mode
                        </button>
                      )}
                      <button 
                        onClick={resetDemo}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition"
                      >
                        Reset Demo Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}