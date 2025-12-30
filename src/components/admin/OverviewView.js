import { DollarSign, ShoppingCart, Users, Package, Bell } from 'lucide-react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import { getTimeElapsed } from '../../utils/helpers';

export default function OverviewView({ 
  users = [], 
  orders = [], 
  tables = [], 
  inventory = [], 
  notifications = [], 
  timeRange = 'today',
  salesData 
}) {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `ETB ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'emerald', 
      change: '+12.5%' 
    },
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: ShoppingCart, 
      color: 'blue', 
      change: '+8.2%' 
    },
    { 
      label: 'Active Staff', 
      value: users.filter(u => u.status === 'active').length, 
      icon: Users, 
      color: 'purple', 
      change: '+2' 
    },
    { 
      label: 'Low Stock Items', 
      value: inventory.filter(i => i.lowStock).length, 
      icon: Package, 
      color: 'red', 
      change: '-1' 
    }
  ];

  const quickStats = [
    { 
      label: 'Occupied Tables', 
      value: tables.filter(t => t.status === 'occupied').length, 
      total: tables.length, 
      color: 'blue' 
    },
    { 
      label: 'Pending Orders', 
      value: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, 
      total: orders.length, 
      color: 'amber' 
    },
    { 
      label: 'Low Stock Items', 
      value: inventory.filter(i => i.lowStock).length, 
      total: inventory.length, 
      color: 'red' 
    },
    { 
      label: 'Active Staff', 
      value: users.filter(u => u.status === 'active').length, 
      total: users.length, 
      color: 'emerald' 
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-base lg:text-lg font-bold text-gray-900">Revenue Overview</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition">
              View Detailed Report
            </button>
          </div>
          <RevenueChart timeRange={timeRange} salesData={salesData} />
        </div>

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
        {quickStats.map((stat, i) => (
          <QuickStatCard key={i} stat={stat} />
        ))}
      </div>
    </div>
  );
}

function QuickStatCard({ stat }) {
  const percentage = Math.round((stat.value / stat.total) * 100);
  
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6">
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
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}