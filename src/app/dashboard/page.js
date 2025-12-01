'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, DollarSign, TrendingUp, BarChart3, Clock, CheckCircle, AlertCircle,
  ShoppingCart, Utensils, Package, Settings, Menu, X, Search, Filter,
  Calendar, Download, Printer, Eye, Plus, Edit, ChevronDown, ArrowUp,
  ArrowDown, Home, CreditCard, Receipt, User, Shield, Database,
  Star, Target, PieChart, Activity, Crown, LogOut, RefreshCw ,   FileText,
  FileSpreadsheet,
  File,
  Save,
  
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
    { id: 'menu', icon: Utensils, label: 'Menu ', view: 'menu' },
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
         {/* Performance Analytics View */}
{activeView === 'performance' && (
  <div className="space-y-6">
    {/* Analytics Filters */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Performance Analytics</h3>
      <div className="flex flex-wrap gap-3">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-black"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>

    {/* Performance Metrics Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trends Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Revenue Trends</h4>
          <span className="text-sm text-emerald-600 font-medium">↑ 19.8% this month</span>
        </div>
        <div className="h-64 flex items-end justify-between px-2">
          {[65, 80, 45, 90, 70, 85, 60].map((height, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="w-8 lg:w-10 bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">ETB 45,820</p>
            <p className="text-sm text-gray-600">Current Week</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">ETB 183,240</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">12.8%</p>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </div>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h4>
        <div className="space-y-4">
          {[
            { label: 'Customer Satisfaction', value: '4.7/5', change: '+2.3%', icon: Star, color: 'amber' },
            { label: 'Order Accuracy', value: '98.5%', change: '+1.2%', icon: CheckCircle, color: 'emerald' },
            { label: 'Avg Service Time', value: '18.2 min', change: '-5.6%', icon: Clock, color: 'blue' },
            { label: 'Staff Efficiency', value: '91.3%', change: '+3.8%', icon: TrendingUp, color: 'purple' },
          ].map((kpi, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${kpi.color}-100 rounded-lg flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{kpi.label}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Target: </span>
                    <span className={`text-sm font-medium ${
                      kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Detailed Analytics */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Peak Hours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours Analysis</h4>
        <div className="space-y-4">
          {[
            { hour: '12:00 PM', orders: 85, revenue: 'ETB 12,450' },
            { hour: '7:00 PM', orders: 92, revenue: 'ETB 15,280' },
            { hour: '8:00 PM', orders: 88, revenue: 'ETB 14,320' },
            { hour: '1:00 PM', orders: 76, revenue: 'ETB 10,850' },
          ].map((peak, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{peak.hour}</p>
                  <p className="text-sm text-gray-600">{peak.orders} orders</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">{peak.revenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Performance Ranking */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Staff Performance Ranking</h4>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View Detailed Report →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Rank</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Staff Member</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Revenue</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Efficiency</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Upsell Rate</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((staff, index) => (
                <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < 3 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    } font-bold`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                        {staff.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <p className="font-bold text-gray-900">ETB {staff.sales.toLocaleString()}</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${staff.efficiency}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{staff.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      index < 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {index < 2 ? '15.2%' : '9.8%'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
          {/* Inventory View */}
        {/* Inventory View */}
{activeView === 'inventory' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Inventory Management</h3>
      <div className="flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Package className="w-4 h-4" />
          <span>Order Supplies</span>
        </button>
      </div>
    </div>

    {/* Inventory Summary */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Items', value: '156', icon: Package, color: 'purple', change: '+12' },
        { label: 'Low Stock', value: '8', icon: AlertCircle, color: 'red', change: '-2' },
        { label: 'Out of Stock', value: '3', icon: X, color: 'red', change: '+1' },
        { label: 'Value', value: 'ETB 25,840', icon: DollarSign, color: 'emerald', change: '+5.2%' },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Inventory Categories */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Low Stock Items */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Low Stock Items</h4>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All Items →
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Fresh Salmon', category: 'Seafood', current: '5kg', min: '10kg', supplier: 'Ocean Foods' },
            { name: 'Basil Leaves', category: 'Herbs', current: '200g', min: '500g', supplier: 'Fresh Garden' },
            { name: 'Parmesan Cheese', category: 'Dairy', current: '3kg', min: '8kg', supplier: 'Italian Deli' },
            { name: 'Extra Virgin Olive Oil', category: 'Oils', current: '2L', min: '5L', supplier: 'Mediterranean Imports' },
            { name: 'Fresh Truffles', category: 'Gourmet', current: '150g', min: '300g', supplier: 'Truffle Masters' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white border border-red-300 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="text-red-600 font-medium">Current: {item.current}</span>
                    <span className="text-gray-600">Min: {item.min}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{item.supplier}</p>
                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
        <div className="space-y-3">
          {[
            { label: 'Inventory Count', icon: Database, color: 'blue' },
            { label: 'Suppliers List', icon: Users, color: 'purple' },
            { label: 'Waste Tracking', icon: AlertCircle, color: 'red' },
            { label: 'Stock Reports', icon: BarChart3, color: 'emerald' },
            { label: 'Purchase Orders', icon: ShoppingCart, color: 'orange' },
            { label: 'Category Management', icon: Filter, color: 'cyan' },
          ].map((action, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform rotate-270" />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Inventory Activity */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Inventory Activity</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Date & Time</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Item</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Action</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Quantity</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Staff</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Today, 14:30', item: 'Ribeye Steak', action: 'Stock In', quantity: '+20kg', staff: 'Michael Chen' },
              { date: 'Today, 11:15', item: 'Fresh Salmon', action: 'Stock Out', quantity: '-5kg', staff: 'Sarah Johnson' },
              { date: 'Yesterday, 19:45', item: 'Pasta', action: 'Stock In', quantity: '+15kg', staff: 'Emma Rodriguez' },
              { date: 'Yesterday, 16:20', item: 'Wine - Cabernet', action: 'Stock In', quantity: '+24 bottles', staff: 'David Kim' },
              { date: 'Dec 1, 09:30', item: 'Cheese Plate', action: 'Adjustment', quantity: '-3 units', staff: 'Lisa Wang' },
            ].map((activity, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-3 text-sm text-gray-600">{activity.date}</td>
                <td className="py-3">
                  <p className="font-medium text-gray-900">{activity.item}</p>
                </td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.action === 'Stock In' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : activity.action === 'Stock Out'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.action}
                  </span>
                </td>
                <td className="py-3">
                  <p className={`font-semibold ${
                    activity.quantity.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {activity.quantity}
                  </p>
                </td>
                <td className="py-3">
                  <p className="text-sm text-gray-900">{activity.staff}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}{/* Inventory View */}
{activeView === 'inventory' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Inventory Management</h3>
      <div className="flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Package className="w-4 h-4" />
          <span>Order Supplies</span>
        </button>
      </div>
    </div>

    {/* Inventory Summary */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Items', value: '156', icon: Package, color: 'purple', change: '+12' },
        { label: 'Low Stock', value: '8', icon: AlertCircle, color: 'red', change: '-2' },
        { label: 'Out of Stock', value: '3', icon: X, color: 'red', change: '+1' },
        { label: 'Value', value: 'ETB 25,840', icon: DollarSign, color: 'emerald', change: '+5.2%' },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Inventory Categories */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Low Stock Items */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Low Stock Items</h4>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All Items →
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Fresh Salmon', category: 'Seafood', current: '5kg', min: '10kg', supplier: 'Ocean Foods' },
            { name: 'Basil Leaves', category: 'Herbs', current: '200g', min: '500g', supplier: 'Fresh Garden' },
            { name: 'Parmesan Cheese', category: 'Dairy', current: '3kg', min: '8kg', supplier: 'Italian Deli' },
            { name: 'Extra Virgin Olive Oil', category: 'Oils', current: '2L', min: '5L', supplier: 'Mediterranean Imports' },
            { name: 'Fresh Truffles', category: 'Gourmet', current: '150g', min: '300g', supplier: 'Truffle Masters' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white border border-red-300 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="text-red-600 font-medium">Current: {item.current}</span>
                    <span className="text-gray-600">Min: {item.min}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{item.supplier}</p>
                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
        <div className="space-y-3">
          {[
            { label: 'Inventory Count', icon: Database, color: 'blue' },
            { label: 'Suppliers List', icon: Users, color: 'purple' },
            { label: 'Waste Tracking', icon: AlertCircle, color: 'red' },
            { label: 'Stock Reports', icon: BarChart3, color: 'emerald' },
            { label: 'Purchase Orders', icon: ShoppingCart, color: 'orange' },
            { label: 'Category Management', icon: Filter, color: 'cyan' },
          ].map((action, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform rotate-270" />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Inventory Activity */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Inventory Activity</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Date & Time</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Item</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Action</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Quantity</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Staff</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Today, 14:30', item: 'Ribeye Steak', action: 'Stock In', quantity: '+20kg', staff: 'Michael Chen' },
              { date: 'Today, 11:15', item: 'Fresh Salmon', action: 'Stock Out', quantity: '-5kg', staff: 'Sarah Johnson' },
              { date: 'Yesterday, 19:45', item: 'Pasta', action: 'Stock In', quantity: '+15kg', staff: 'Emma Rodriguez' },
              { date: 'Yesterday, 16:20', item: 'Wine - Cabernet', action: 'Stock In', quantity: '+24 bottles', staff: 'David Kim' },
              { date: 'Dec 1, 09:30', item: 'Cheese Plate', action: 'Adjustment', quantity: '-3 units', staff: 'Lisa Wang' },
            ].map((activity, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-3 text-sm text-gray-600">{activity.date}</td>
                <td className="py-3">
                  <p className="font-medium text-gray-900">{activity.item}</p>
                </td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.action === 'Stock In' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : activity.action === 'Stock Out'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.action}
                  </span>
                </td>
                <td className="py-3">
                  <p className={`font-semibold ${
                    activity.quantity.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {activity.quantity}
                  </p>
                </td>
                <td className="py-3">
                  <p className="text-sm text-gray-900">{activity.staff}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

          {/* Menu Analytics View */}
         {/* Add Menu View */}
{activeView === 'menu' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Menu Management</h3>
        <p className="text-gray-600 mt-1">Add and manage menu items, categories, and pricing</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Menu</span>
        </button>
      </div>
    </div>

    {/* Menu Management Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add New Menu Item Form */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Add New Menu Item</h4>
        
        <div className="space-y-5">
          {/* Item Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Pasta Carbonara"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select Category</option>
                <option value="appetizers">Appetizers</option>
                <option value="main-course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Drinks</option>
                <option value="sides">Side Dishes</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your menu item..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Pricing & Cost */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (ETB) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (ETB)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                placeholder="e.g., 15"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {['Pasta', 'Bacon', 'Eggs', 'Parmesan Cheese', 'Cream'].map((ingredient, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{ingredient}</span>
                  </div>
                  <button className="text-red-600 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Ingredient</span>
              </button>
            </div>
          </div>

          {/* Allergens & Dietary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergens & Dietary Information
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Contains Gluten', color: 'red' },
                { label: 'Contains Dairy', color: 'amber' },
                { label: 'Vegetarian', color: 'emerald' },
                { label: 'Spicy', color: 'orange' },
              ].map((tag, i) => (
                <div key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium bg-${tag.color}-100 text-${tag.color}-700`}>
                  {tag.label}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium">
              Save Menu Item
            </button>
          </div>
        </div>
      </div>

      {/* Menu Categories & Quick Actions */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Menu Categories</h4>
          <div className="space-y-3">
            {[
              { name: 'Appetizers', count: 12, color: 'blue' },
              { name: 'Main Course', count: 24, color: 'purple' },
              { name: 'Desserts', count: 8, color: 'pink' },
              { name: 'Drinks', count: 18, color: 'cyan' },
              { name: 'Side Dishes', count: 10, color: 'emerald' },
            ].map((category, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-8 bg-${category.color}-500 rounded-full`} />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.count} items</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
          <div className="space-y-3">
            {[
              { label: 'Import from CSV', icon: Download, color: 'blue' },
              { label: 'Print Menu', icon: Printer, color: 'gray' },
              { label: 'Set Seasonal Items', icon: Calendar, color: 'emerald' },
              { label: 'Update Prices', icon: DollarSign, color: 'amber' },
              { label: 'Manage Ingredients', icon: Package, color: 'purple' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform rotate-270" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Recent Menu Items */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900">Recent Menu Items</h4>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View All Items →
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Item Name</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Category</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Price</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Cost</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Profit Margin</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Status</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Pasta Carbonara', category: 'Main Course', price: 'ETB 180', cost: 'ETB 45', margin: '75%', status: 'active' },
              { name: 'Grilled Salmon', category: 'Main Course', price: 'ETB 280', cost: 'ETB 95', margin: '66%', status: 'active' },
              { name: 'Tiramisu', category: 'Desserts', price: 'ETB 120', cost: 'ETB 28', margin: '77%', status: 'active' },
              { name: 'Caesar Salad', category: 'Appetizers', price: 'ETB 85', cost: 'ETB 22', margin: '74%', status: 'inactive' },
              { name: 'Mojito', category: 'Drinks', price: 'ETB 95', cost: 'ETB 18', margin: '81%', status: 'active' },
            ].map((item, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Preptime: 15min</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="py-4">
                  <p className="font-bold text-gray-900">{item.price}</p>
                </td>
                <td className="py-4">
                  <p className="text-gray-600">{item.cost}</p>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: item.margin }}
                      />
                    </div>
                    <span className="font-semibold text-emerald-600">{item.margin}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4 text-gray-600" />
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

          {/* Reports View */}
         {/* Reports View */}
{activeView === 'reports' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Business Reports</h3>
        <p className="text-gray-600 mt-1">Generate and analyze detailed business reports</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Schedule Report</span>
        </button>
      </div>
    </div>

    {/* Report Types */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Sales Reports', icon: DollarSign, color: 'emerald', count: 24 },
        { label: 'Staff Reports', icon: Users, color: 'blue', count: 18 },
        { label: 'Inventory Reports', icon: Package, color: 'purple', count: 12 },
        { label: 'Financial Reports', icon: CreditCard, color: 'amber', count: 8 },
      ].map((report, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg bg-${report.color}-50`}>
              <report.icon className={`w-5 h-5 text-${report.color}-600`} />
            </div>
            <span className="text-sm font-medium text-gray-600">{report.count} reports</span>
          </div>
          <p className="text-lg font-bold text-gray-900 mb-1">{report.label}</p>
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2">
            View All →
          </button>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Report Generation */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Generate Custom Report</h4>
        
        <div className="space-y-5">
          {/* Report Type & Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select Report Type</option>
                <option value="sales-summary">Sales Summary</option>
                <option value="staff-performance">Staff Performance</option>
                <option value="inventory-analysis">Inventory Analysis</option>
                <option value="customer-analytics">Customer Analytics</option>
                <option value="profit-loss">Profit & Loss Statement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Report Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filters
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Include Staff Details',
                'Show Hourly Breakdown',
                'Compare with Previous Period',
                'Include Cost Analysis',
                'Export as PDF',
                'Include Charts'
              ].map((filter, i) => (
                <label key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span className="text-sm text-gray-700">{filter}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'PDF', icon: FileText, color: 'red' },
                { label: 'Excel', icon: FileSpreadsheet, color: 'emerald' },
                { label: 'CSV', icon: File, color: 'blue' },
                { label: 'Print', icon: Printer, color: 'gray' },
              ].map((format, i) => (
                <button
                  key={i}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  <div className={`w-6 h-6 rounded-full bg-${format.color}-100 flex items-center justify-center`}>
                    <format.icon className={`w-3 h-3 text-${format.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <button className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h4>
        <div className="space-y-4">
          {[
            { title: 'Daily Sales Report', date: 'Dec 5, 2024', type: 'PDF', size: '2.4 MB' },
            { title: 'Staff Performance - Week 48', date: 'Dec 4, 2024', type: 'Excel', size: '1.8 MB' },
            { title: 'Monthly Inventory Analysis', date: 'Dec 3, 2024', type: 'PDF', size: '3.2 MB' },
            { title: 'Customer Feedback Summary', date: 'Dec 2, 2024', type: 'CSV', size: '1.1 MB' },
            { title: 'Weekly Financial Summary', date: 'Dec 1, 2024', type: 'PDF', size: '2.1 MB' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${
                  report.type === 'PDF' ? 'bg-red-100' : 
                  report.type === 'Excel' ? 'bg-emerald-100' : 'bg-blue-100'
                } rounded-lg flex items-center justify-center`}>
                  {report.type === 'PDF' ? (
                    <FileText className="w-5 h-5 text-red-600" />
                  ) : report.type === 'Excel' ? (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <File className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{report.size}</p>
                <div className="flex space-x-1 mt-1">
                  <button className="p-1 hover:bg-white rounded">
                    <Eye className="w-3 h-3 text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-white rounded">
                    <Download className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scheduled Reports */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900">Scheduled Reports</h4>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
          <Plus className="w-3 h-3" />
          <span>Schedule New Report</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Report Name</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Frequency</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Next Run</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Recipients</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Format</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Status</th>
              <th className="pb-3 text-left text-sm font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Daily Sales Summary', frequency: 'Daily', next: 'Tomorrow, 8:00 AM', recipients: 3, format: 'PDF', status: 'active' },
              { name: 'Weekly Staff Report', frequency: 'Weekly', next: 'Monday, 9:00 AM', recipients: 2, format: 'Excel', status: 'active' },
              { name: 'Monthly Financials', frequency: 'Monthly', next: 'Jan 1, 2025', recipients: 5, format: 'PDF', status: 'paused' },
              { name: 'Inventory Check', frequency: 'Daily', next: 'Tomorrow, 7:00 AM', recipients: 1, format: 'CSV', status: 'active' },
              { name: 'Customer Analytics', frequency: 'Monthly', next: 'Jan 1, 2025', recipients: 3, format: 'PDF', status: 'active' },
            ].map((report, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{report.name}</p>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {report.frequency}
                  </span>
                </td>
                <td className="py-4">
                  <p className="text-sm text-gray-900">{report.next}</p>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(report.recipients)].map((_, idx) => (
                      <div key={idx} className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {String.fromCharCode(65 + idx)}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.format === 'PDF' ? 'bg-red-100 text-red-700' :
                    report.format === 'Excel' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {report.format}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Settings className="w-4 h-4 text-gray-600" />
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
          {/* Settings View */}
         {/* Settings View */}
{activeView === 'settings' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">System Settings</h3>
        <p className="text-gray-600 mt-1">Configure your restaurant management system</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Restore Defaults</span>
        </button>
      </div>
    </div>

    {/* Settings Tabs */}
    <div className="flex border-b border-gray-200">
      {[
        'General',
        'Staff & Permissions',
        'Menu & Inventory',
        'Billing & Payments',
        'Notifications',
        'Security',
        'Integrations'
      ].map((tab, i) => (
        <button
          key={i}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            i === 0 
              ? 'border-purple-600 text-purple-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* General Settings */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h4>
        
        <div className="space-y-6">
          {/* Restaurant Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Restaurant Information</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  defaultValue="Bistro Elegante"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  defaultValue="info@bistroelegante.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  defaultValue="+251 911 234 567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="Africa/Addis_Ababa" selected>Addis Ababa (GMT+3)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Business Hours</span>
            </h5>
            <div className="space-y-3">
              {[
                { day: 'Monday', open: '8:00 AM', close: '10:00 PM' },
                { day: 'Tuesday', open: '8:00 AM', close: '10:00 PM' },
                { day: 'Wednesday', open: '8:00 AM', close: '10:00 PM' },
                { day: 'Thursday', open: '8:00 AM', close: '10:00 PM' },
                { day: 'Friday', open: '8:00 AM', close: '11:00 PM' },
                { day: 'Saturday', open: '9:00 AM', close: '11:00 PM' },
                { day: 'Sunday', open: '9:00 AM', close: '9:00 PM' },
              ].map((schedule, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900 w-24">{schedule.day}</span>
                  <div className="flex items-center space-x-3">
                    <input
                      type="time"
                      defaultValue={schedule.open.replace(' AM', '').replace(' PM', '')}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      defaultValue={schedule.close.replace(' AM', '').replace(' PM', '')}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                    <span className="text-sm text-gray-600">Open</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Currency & Units */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Currency & Units</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="ETB" selected>Ethiopian Birr (ETB)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Symbol Position
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="before" selected>Before (ETB 100)</option>
                  <option value="after">After (100 ETB)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurement Units
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="metric" selected>Metric (kg, g, L, ml)</option>
                  <option value="imperial">Imperial (lb, oz)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings & System Status */}
      <div className="space-y-6">
        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">System Status</h4>
          <div className="space-y-4">
            {[
              { label: 'Database', status: 'online', icon: Database, color: 'emerald' },
              { label: 'Payment Gateway', status: 'online', icon: CreditCard, color: 'emerald' },
              { label: 'Inventory Sync', status: 'syncing', icon: RefreshCw, color: 'blue' },
              { label: 'Backup Service', status: 'last backup: 2h ago', icon: Shield, color: 'amber' },
              { label: 'API Connections', status: '5 active', icon: Activity, color: 'emerald' },
            ].map((system, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${system.color}-100 rounded-lg flex items-center justify-center`}>
                    <system.icon className={`w-4 h-4 text-${system.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{system.label}</p>
                    <p className={`text-xs font-medium ${
                      system.status.includes('online') ? 'text-emerald-600' :
                      system.status.includes('syncing') ? 'text-blue-600' :
                      system.status.includes('backup') ? 'text-amber-600' :
                      'text-gray-600'
                    }`}>
                      {system.status}
                    </p>
                  </div>
                </div>
                {system.status === 'online' && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
          <div className="space-y-3">
            {[
              { label: 'Backup System Data', icon: Database, color: 'blue' },
              { label: 'Clear Cache', icon: RefreshCw, color: 'gray' },
              { label: 'Update System', icon: Download, color: 'purple' },
              { label: 'User Permissions', icon: Shield, color: 'emerald' },
              { label: 'API Settings', icon: Activity, color: 'amber' },
              { label: 'System Logs', icon: FileText, color: 'red' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform rotate-270" />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <h4 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h4>
          <p className="text-sm text-gray-600 mb-4">Irreversible actions. Proceed with caution.</p>
          <div className="space-y-3">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm">
              Reset All Settings
            </button>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold text-sm">
              Delete All Data
            </button>
            <button className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold text-sm">
              Deactivate System
            </button>
          </div>
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