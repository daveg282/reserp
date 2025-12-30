'use client';
import { 
  DollarSign, Users, TrendingUp, Clock, Star, 
  Utensils, PieChart, User, AlertCircle, RefreshCw,
  TrendingDown
} from 'lucide-react';
import StatsCard from './StatsCard';
import AlertCard from './AlertCard';

export default function DashboardView({
  performanceStats = {},
  staffPerformance = [],
  recentAlerts = [],
  popularItems = [],
  quickStats = [],
  timeRange = 'today', // Added: gets timeRange from parent
  setActiveView,
  setSelectedStaff,
  setShowStaffDetails,
  onRefresh,
  isLoading = false,
  userRole = 'manager'
}) {
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

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `ETB ${(periodStats.revenue?.current || 0).toLocaleString()}`,
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
      value: `ETB ${periodStats.averageOrder?.current || 0}`,
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

  const defaultQuickStats = [
    { label: 'Occupancy Rate', value: '78%', icon: Users, color: 'blue' },
    { label: 'Food Cost', value: '28.3%', icon: PieChart, color: 'emerald' },
    { label: 'Labor Cost', value: '22.1%', icon: User, color: 'purple' },
    { label: 'Waste', value: '4.2%', icon: AlertCircle, color: 'red' }
  ];

  const displayQuickStats = quickStats.length > 0 ? quickStats : defaultQuickStats;

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
            {staffPerformance
              .filter(staff => (staff.total_sales || 0) > 0)
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
                    <p className="text-xs text-gray-500">{staff.role || 'staff'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm lg:text-base">
                      ETB {(staff.total_sales || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {staff.orders_handled || 0} orders · {staff.tables_served || 0} tables
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="font-semibold text-gray-900 text-sm">
                      {/* Calculate rating based on performance */}
                      {staff.orders_handled > 0 ? 
                        Math.min(5.0, 3.5 + (staff.total_sales / 10000)).toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {staffPerformance.filter(staff => (staff.total_sales || 0) > 0).length === 0 && (
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No staff activity this {timeRange}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Alerts</h3>
            <span className={`bg-${recentAlerts.length > 0 ? 'red' : 'green'}-500 text-white text-xs px-2 py-1 rounded-full`}>
              {recentAlerts.length} {recentAlerts.length === 1 ? 'alert' : 'alerts'}
            </span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {recentAlerts.length === 0 && (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Popular Items */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">
            Popular Items ({timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'})
          </h3>
          <div className="space-y-3">
            {popularItems.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.name || 'Menu Item'}</p>
                    <p className="text-xs text-gray-500">{item.category || 'General'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm lg:text-base">
                    ETB {(item.total_revenue || 0).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs text-gray-500">{item.order_count || 0} orders</span>
                  </div>
                </div>
              </div>
            ))}
            {popularItems.length === 0 && (
              <div className="text-center py-4">
                <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No popular items data</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {displayQuickStats.map((stat, i) => {
              const statValue = typeof stat === 'object' ? stat.value : stat;
              const statLabel = typeof stat === 'object' ? stat.label : '';
              const statIcon = typeof stat === 'object' ? stat.icon : null;
              const statColor = typeof stat === 'object' ? stat.color : 'gray';

              return (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 ${getBgColor(statColor)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    {statIcon ? (
                      <stat.icon className={`w-5 h-5 ${getTextColor(statColor)}`} />
                    ) : (
                      i === 0 && <Users className={`w-5 h-5 ${getTextColor(statColor)}`} />
                    )}
                  </div>
                  <p className="text-lg lg:text-xl font-bold text-gray-900">{statValue}</p>
                  <p className="text-xs text-gray-600">{statLabel}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refresh button at bottom */}
      <div className="flex justify-center">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 ${isLoading ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'} transition`}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
    </div>
  );
}

// Helper functions for dynamic Tailwind classes
const getBgColor = (color) => {
  switch(color) {
    case 'blue': return 'bg-blue-100';
    case 'emerald': return 'bg-emerald-100';
    case 'purple': return 'bg-purple-100';
    case 'red': return 'bg-red-100';
    case 'orange': return 'bg-orange-100';
    default: return 'bg-gray-100';
  }
};

const getTextColor = (color) => {
  switch(color) {
    case 'blue': return 'text-blue-600';
    case 'emerald': return 'text-emerald-600';
    case 'purple': return 'text-purple-600';
    case 'red': return 'text-red-600';
    case 'orange': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};