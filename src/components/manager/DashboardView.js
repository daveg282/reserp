'use client';
import { 
  DollarSign, Users, TrendingUp, Clock, Star, 
  Utensils, TrendingDown, Receipt, AlertCircle
} from 'lucide-react';
import StatsCard from './StatsCard';
import { useState, useEffect } from 'react';

export default function DashboardView({
  performanceStats = {},
  staffPerformance = [],
  popularItems = [],
  recentOrders = [],
  timeRange = 'today',
  setActiveView,
  setSelectedStaff,
  setShowStaffDetails,
  onRefresh,
  isLoading = false,
  userRole = 'manager'
}) {
  // Debug - log what we're receiving
  useEffect(() => {
    console.log('🔍 DashboardView received recentOrders:', recentOrders);
    console.log('🔍 Type:', typeof recentOrders);
    console.log('🔍 Is array?', Array.isArray(recentOrders));
    if (recentOrders && recentOrders.length > 0) {
      console.log('🔍 First order:', recentOrders[0]);
    }
  }, [recentOrders]);

  // Default stats structure
  const defaultPerformanceStats = {
    today: {
      revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
      customers: { current: 0, previous: 0, trend: 'up', change: 0 },
      averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
      tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
    },
    week: {
      revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
      customers: { current: 0, previous: 0, trend: 'up', change: 0 },
      averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
      tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
    },
    month: {
      revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
      customers: { current: 0, previous: 0, trend: 'up', change: 0 },
      averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
      tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
    }
  };

  // Get stats for selected timeRange
  const periodStats = performanceStats[timeRange] || 
                     (timeRange === 'today' ? performanceStats.today : 
                      timeRange === 'week' ? performanceStats.week : 
                      performanceStats.month) || 
                     defaultPerformanceStats[timeRange];

  // Format change value with icon
  const getChangeDisplay = (change, trend) => {
    const changeNum = parseFloat(change) || 0;
    const isUp = trend === 'up' || (trend !== 'down' && changeNum >= 0);
    const Icon = isUp ? TrendingUp : TrendingDown;
    
    return (
      <span className={`flex items-center ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span className="font-semibold">{Math.abs(changeNum).toFixed(1)}%</span>
      </span>
    );
  };

  // Format currency with commas
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return `ETB ${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const stats = [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(periodStats.revenue?.current || 0),
      change: getChangeDisplay(periodStats.revenue?.change, periodStats.revenue?.trend),
      icon: DollarSign,
      color: 'emerald'
    },
    { 
      label: 'Customers Served', 
      value: periodStats.customers?.current || 0,
      change: getChangeDisplay(periodStats.customers?.change, periodStats.customers?.trend),
      icon: Users,
      color: 'blue'
    },
    { 
      label: 'Avg Order Value', 
      value: formatCurrency(periodStats.averageOrder?.current || 0),
      change: getChangeDisplay(periodStats.averageOrder?.change, periodStats.averageOrder?.trend),
      icon: TrendingUp,
      color: 'purple'
    },
    { 
      label: 'Table Turnover', 
      value: periodStats.tableTurnover?.current || 0,
      change: getChangeDisplay(periodStats.tableTurnover?.change, periodStats.tableTurnover?.trend),
      icon: Clock,
      color: 'orange'
    }
  ];

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Just now';
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting time:', e, 'for date:', dateString);
      return 'Recently';
    }
  };

  // Calculate staff rating properly
  const calculateStaffRating = (staff) => {
    if (!staff.orders_handled || staff.orders_handled === 0) return '0.0';
    
    let rating = 3.5; // Base rating
    
    // Adjust based on sales
    if (staff.total_sales > 10000) rating += 1.5;
    else if (staff.total_sales > 5000) rating += 1.0;
    else if (staff.total_sales > 1000) rating += 0.5;
    
    // Adjust based on orders handled
    if (staff.orders_handled > 50) rating += 0.5;
    else if (staff.orders_handled > 20) rating += 0.3;
    else if (staff.orders_handled > 10) rating += 0.2;
    
    // Adjust based on average order value
    if (staff.avg_order_value > 500) rating += 0.5;
    else if (staff.avg_order_value > 250) rating += 0.3;
    
    // Cap at 5.0
    return Math.min(5.0, rating).toFixed(1);
  };

  // Filter active staff (with sales > 0)
  const activeStaff = staffPerformance?.filter(staff => (staff.total_sales || 0) > 0) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Staff Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900">Staff Performance</h3>
              <p className="text-sm text-gray-500 mt-1">
                Top performers this {timeRange === 'today' ? 'today' : timeRange === 'week' ? 'week' : 'month'}
              </p>
            </div>
            <button 
              onClick={() => setActiveView('staff')}
              className="text-purple-600 hover:text-purple-700 text-xs lg:text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {activeStaff.length > 0 ? (
              activeStaff
                .slice(0, 4)
                .map(staff => (
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
                        {staff.avatar || (staff.name ? staff.name.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">{staff.name || 'Staff'}</p>
                        <p className="text-xs text-gray-500 capitalize">{staff.role || 'staff'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm lg:text-base">
                          {formatCurrency(staff.total_sales)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {staff.orders_handled || 0} orders · {staff.tables_served || 0} tables
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                        <span className="font-semibold text-gray-900 text-sm">
                          {calculateStaffRating(staff)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No staff activity this {timeRange}</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h3 className="text-base lg:text-lg font-bold text-gray-900">
              Popular Items ({timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'})
            </h3>
            <button 
              onClick={() => setActiveView('menu')}
              className="text-purple-600 hover:text-purple-700 text-xs lg:text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {popularItems && popularItems.length > 0 ? (
              popularItems.slice(0, 5).map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name || 'Menu Item'}</p>
                      <p className="text-xs text-gray-500 truncate">{item.category || 'General'}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-gray-900 text-sm lg:text-base whitespace-nowrap">
                      {formatCurrency(item.total_revenue)}
                    </p>
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.order_count || 0} orders
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No popular items data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Orders</h3>
          <button 
            onClick={() => setActiveView('orders-service')}
            className="text-purple-600 hover:text-purple-700 text-xs lg:text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentOrders && Array.isArray(recentOrders) && recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <div 
                key={order.id || index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  // You can add order details modal here if needed
                  console.log('Order clicked:', order);
                }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                      {order.order_number || `Order #${order.id}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.payment_status === 'paid' ? 'Paid' : 
                         order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {order.customer_name || 'Walk-in'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className="font-bold text-gray-900 text-sm lg:text-base whitespace-nowrap">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {order.table_number ? `Table ${order.table_number}` : 'Takeaway'}
                    </span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(order.order_time)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {recentOrders ? 'No recent orders' : 'Loading recent orders...'}
              </p>
              {!Array.isArray(recentOrders) && (
                <div className="mt-2 p-2 bg-yellow-50 rounded">
                  <AlertCircle className="w-4 h-4 text-yellow-600 inline mr-1" />
                  <span className="text-xs text-yellow-700">Data format issue detected</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}