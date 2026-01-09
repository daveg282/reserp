import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, TrendingUp, AlertCircle, Download, BarChart3, Users, RefreshCw } from 'lucide-react';

export default function ReportsView({ 
  reportData, 
  isLoading, 
  error, 
  timeRange = 'today',
  onTimeRangeChange,
  onExport,
  onRefresh,
  onDismissError 
}) {
  const { t } = useTranslation('chef');
  
  // If loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 bg-white rounded-xl border">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Loading kitchen statistics...</p>
        </div>
      </div>
    );
  }
  
  // If error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h4 className="font-bold text-gray-900 mb-2">Database Error</h4>
          <p className="text-gray-600 mb-3">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
            >
              Try Again
            </button>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg"
              >
                Continue with Empty Data
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // If no data
  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 bg-white rounded-xl border">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No report data available</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Calculate derived metrics from the available data
  const totalOrders = reportData.total_orders_today || 0;
  const completedOrders = reportData.ready_orders || 0;
  const pendingOrders = reportData.pending_orders || 0;
  const preparingOrders = reportData.preparing_orders || 0;
  
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const activeOrders = pendingOrders + preparingOrders;
  const ordersPrepared = reportData.ordersPrepared || activeOrders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Kitchen Report</h3>
          <p className="text-sm text-gray-600 mt-1">
            Report for {reportData.reportDate || 'Today'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            disabled={!onTimeRangeChange}
          >
            <option value="today">Today</option>
            <option value="week" disabled>This Week (Coming Soon)</option>
            <option value="month" disabled>This Month (Coming Soon)</option>
          </select>
          
          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg flex items-center space-x-2 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Today */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">
              {totalOrders > 0 ? '+' : ''}{totalOrders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Total Orders Today</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-semibold text-yellow-600">
              {pendingOrders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Pending Orders</p>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-semibold text-orange-600">
              {preparingOrders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{preparingOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Preparing Orders</p>
        </div>

        {/* Ready Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">
              {completedOrders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Ready Orders</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Prepared */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Orders Prepared</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{ordersPrepared}</p>
          <p className="text-sm text-gray-600 mt-2">
            {preparingOrders} preparing + {completedOrders} ready
          </p>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm font-medium text-emerald-700">
              {completionRate}% completion rate
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Active Orders</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeOrders}</p>
          <p className="text-sm text-gray-600 mt-2">
            Currently in progress
          </p>
          <div className="mt-4 flex space-x-2">
            <div className="flex-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {pendingOrders} Pending
            </div>
            <div className="flex-1 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {preparingOrders} Preparing
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Status Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Kitchen Status Summary</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Orders Today</p>
              <p className="text-sm text-gray-600 mt-1">
                {totalOrders} total orders • {activeOrders} active • {completionRate}% completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Processing Time</p>
              <p className="text-sm text-gray-600 mt-1">
                Average preparation time: {reportData.avgPrepTime || 15} minutes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Performance</p>
              <p className="text-sm text-gray-600 mt-1">
                {reportData.efficiency?.orderAccuracy || 95}% order accuracy • {reportData.efficiency?.onTimeDelivery || 90}% on-time delivery
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last updated</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}