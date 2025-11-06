'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, DollarSign, TrendingUp, BarChart3, Clock, CheckCircle, AlertCircle,
  ShoppingCart, Utensils, Package, Settings, Menu, X, Search, Filter,
  Calendar, Download, Printer, Eye, Plus, Edit, ChevronDown, ArrowUp,
  ArrowDown, Home, CreditCard, Receipt, User, Shield, Database,
  Star, Target, PieChart, Activity, Crown, LogOut, RefreshCw 
  
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function ManagerDashboard() {

  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Mock data for manager dashboard
  const performanceStats = {
    revenue: {
      current: 45820.50,
      previous: 38250.75,
      trend: 'up',
      change: 19.8
    },
    customers: {
      current: 328,
      previous: 285,
      trend: 'up',
      change: 15.1
    },
    averageOrder: {
      current: 139.65,
      previous: 134.20,
      trend: 'up',
      change: 4.1
    },
    tableTurnover: {
      current: 2.8,
      previous: 2.5,
      trend: 'up',
      change: 12.0
    }
  };
  const handleLogout = () => {
  setIsLoading(true);
  // Simulate logout process
  setTimeout(() => {
    router.push('/login'); // Navigate to home page
  }, 1000);
};


  const staffPerformance = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Head Waiter',
      avatar: 'SJ',
      tablesServed: 28,
      sales: 12580.25,
      efficiency: 94.2,
      rating: 4.8,
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Senior Waiter',
      avatar: 'MC',
      tablesServed: 24,
      sales: 11245.50,
      efficiency: 91.5,
      rating: 4.6,
      status: 'active'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Waiter',
      avatar: 'ER',
      tablesServed: 22,
      sales: 9850.75,
      efficiency: 88.3,
      rating: 4.4,
      status: 'break'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Waiter',
      avatar: 'DK',
      tablesServed: 20,
      sales: 8765.25,
      efficiency: 85.7,
      rating: 4.3,
      status: 'active'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      role: 'Trainee',
      avatar: 'LW',
      tablesServed: 15,
      sales: 6540.80,
      efficiency: 82.1,
      rating: 4.1,
      status: 'active'
    }
  ];

  const popularItems = [
    { name: 'Pasta Carbonara', orders: 156, revenue: 28080, trend: 'up' },
    { name: 'Grilled Salmon', orders: 143, revenue: 40040, trend: 'up' },
    { name: 'Ribeye Steak', orders: 128, revenue: 44800, trend: 'stable' },
    { name: 'Margherita Pizza', orders: 122, revenue: 19520, trend: 'up' },
    { name: 'Caesar Salad', orders: 118, revenue: 10030, trend: 'down' }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'inventory',
      message: 'Low stock: Fresh Salmon (5kg remaining)',
      priority: 'high',
      time: '10 minutes ago'
    },
    {
      id: 2,
      type: 'staff',
      message: 'Lisa Wang completed training session',
      priority: 'medium',
      time: '25 minutes ago'
    },
    {
      id: 3,
      type: 'equipment',
      message: 'Oven #3 requires maintenance',
      priority: 'medium',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'customer',
      message: 'New VIP reservation for 8 people at 19:00',
      priority: 'low',
      time: '2 hours ago'
    }
  ];

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', view: 'dashboard' },
    { id: 'staff', icon: Users, label: 'Staff Management', view: 'staff' },
    { id: 'performance', icon: TrendingUp, label: 'Performance', view: 'performance' },
    { id: 'inventory', icon: Package, label: 'Inventory', view: 'inventory' },
    { id: 'menu', icon: Utensils, label: 'Menu Analytics', view: 'menu' },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 text-gray-400">→</span>;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'break': return 'bg-amber-100 text-amber-700';
      case 'off': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
      <div className={`fixed lg:static bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-purple-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Manager Dashboard</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-purple-700 rounded-lg transition">
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
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'hover:bg-purple-700 text-purple-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-700 space-y-4">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
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
                  {activeView === 'dashboard' && 'Manager Dashboard'}
                  {activeView === 'staff' && 'Staff Management'}
                  {activeView === 'performance' && 'Performance Analytics'}
                  {activeView === 'inventory' && 'Inventory Overview'}
                  {activeView === 'menu' && 'Menu Analytics'}
                  {activeView === 'reports' && 'Business Reports'}
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
                    className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-48 xl:w-64"
                    />
                  </div>

                  {/* Search Button - Mobile */}
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
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
                    <option value="quarter">This Quarter</option>
                  </select>

                  {/* Export Button */}
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">Export</span>
                  </button>
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
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
                {[
                  { 
                    label: 'Total Revenue', 
                    value: `ETB ${performanceStats.revenue.current.toLocaleString()}`,
                    change: `${performanceStats.revenue.change}%`,
                    trend: performanceStats.revenue.trend,
                    icon: DollarSign,
                    color: 'emerald'
                  },
                  { 
                    label: 'Customers Served', 
                    value: performanceStats.customers.current,
                    change: `${performanceStats.customers.change}%`,
                    trend: performanceStats.customers.trend,
                    icon: Users,
                    color: 'blue'
                  },
                  { 
                    label: 'Avg Order Value', 
                    value: `ETB ${performanceStats.averageOrder.current}`,
                    change: `${performanceStats.averageOrder.change}%`,
                    trend: performanceStats.averageOrder.trend,
                    icon: TrendingUp,
                    color: 'purple'
                  },
                  { 
                    label: 'Table Turnover', 
                    value: performanceStats.tableTurnover.current,
                    change: `${performanceStats.tableTurnover.change}%`,
                    trend: performanceStats.tableTurnover.trend,
                    icon: Clock,
                    color: 'orange'
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2 lg:mb-3 xl:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {getTrendIcon(stat.trend)}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Staff Performance */}
                <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Staff Performance</h3>
                    <button 
                      onClick={() => setActiveView('staff')}
                      className="text-purple-600 hover:text-purple-700 text-xs lg:text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    {staffPerformance.slice(0, 4).map(staff => (
                      <div 
                        key={staff.id} 
                        className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => {
                          setSelectedStaff(staff);
                          setShowStaffDetails(true);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                            {staff.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{staff.name}</p>
                            <p className="text-xs text-gray-500">{staff.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {staff.sales.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{staff.tablesServed} tables</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span className="font-semibold text-gray-900 text-sm">{staff.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Alerts</h3>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">4 new</span>
                  </div>
                  <div className="space-y-3">
                    {recentAlerts.map(alert => (
                      <div key={alert.id} className={`p-3 rounded-xl border ${getPriorityColor(alert.priority)}`}>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs text-gray-600">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Items & Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Popular Items */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Popular Items</h3>
                  <div className="space-y-3">
                    {popularItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <Utensils className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {item.revenue.toLocaleString()}</p>
                          <div className="flex items-center justify-end space-x-1">
                            {getTrendIcon(item.trend)}
                            <span className="text-xs text-gray-500">Trend</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Occupancy Rate', value: '78%', icon: Users, color: 'blue' },
                      { label: 'Food Cost', value: '28.3%', icon: PieChart, color: 'emerald' },
                      { label: 'Labor Cost', value: '22.1%', icon: User, color: 'purple' },
                      { label: 'Waste', value: '4.2%', icon: AlertCircle, color: 'red' }
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                        </div>
                        <p className="text-lg lg:text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Staff Management View */}
          {activeView === 'staff' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Staff Management</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                  <select className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black">
                    <option>All Roles</option>
                    <option>Head Waiter</option>
                    <option>Senior Waiter</option>
                    <option>Waiter</option>
                    <option>Trainee</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Staff Member</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sales</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Efficiency</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {staffPerformance.map(staff => (
                        <tr key={staff.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                {staff.avatar}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm lg:text-base">{staff.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">{staff.role}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">ETB {staff.sales.toLocaleString()}</p>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 lg:w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${staff.efficiency}%` }}
                                ></div>
                              </div>
                              <span className="text-xs lg:text-sm font-semibold text-gray-900">{staff.efficiency}%</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400" />
                              <span className="font-semibold text-gray-900 text-sm lg:text-base">{staff.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(staff.status)}`}>
                              {staff.status}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setShowStaffDetails(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                              >
                                View
                              </button>
                              <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition">
                                Edit
                              </button>
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

          {/* Performance Analytics View */}
          {activeView === 'performance' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Performance Analytics</h3>
                <div className="text-center py-12 lg:py-20">
                  <BarChart3 className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-600 text-sm lg:text-base">Detailed performance metrics and analytics coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {/* Inventory View */}
          {activeView === 'inventory' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Inventory Overview</h3>
                <div className="text-center py-12 lg:py-20">
                  <Package className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Inventory Management</h4>
                  <p className="text-gray-600 text-sm lg:text-base">Complete inventory tracking and management system coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Analytics View */}
          {activeView === 'menu' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Menu Analytics</h3>
                <div className="text-center py-12 lg:py-20">
                  <Utensils className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Menu Performance</h4>
                  <p className="text-gray-600 text-sm lg:text-base">Detailed menu item performance and analytics coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Business Reports</h3>
                <div className="text-center py-12 lg:py-20">
                  <BarChart3 className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Comprehensive Reports</h4>
                  <p className="text-gray-600 text-sm lg:text-base">Detailed business intelligence and reporting features coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Manager Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-4">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      Restaurant Settings
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      Staff Permissions
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      Menu Configuration
                    </button>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      Reporting Settings
                    </button>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      Backup & Restore
                    </button>
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                      System Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Details Modal */}
      {showStaffDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Staff Details</h3>
              <button onClick={() => setShowStaffDetails(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                  {selectedStaff.avatar}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h4>
                  <p className="text-gray-600">{selectedStaff.role}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-gray-900">{selectedStaff.rating}</span>
                    <span className="text-gray-500 text-sm">rating</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedStaff.tablesServed}</p>
                  <p className="text-sm text-gray-600">Tables Served</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">ETB {selectedStaff.sales.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedStaff.efficiency}%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedStaff.rating}</p>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base">
                  View Schedule
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}