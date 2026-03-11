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
  
  // Calculate derived metrics from the available data
  const totalOrders = reportData?.total_orders_today || 0;
  const completedOrders = reportData?.ready_orders || 0;
  const pendingOrders = reportData?.pending_orders || 0;
  const preparingOrders = reportData?.preparing_orders || 0;
  
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const activeOrders = pendingOrders + preparingOrders;
  const ordersPrepared = reportData?.ordersPrepared || activeOrders;

  // If loading
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-8 md:py-12 bg-white rounded-xl border w-full max-w-md mx-auto">
          <RefreshCw className="w-6 h-6 md:w-8 md:h-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">Loading kitchen statistics...</p>
        </div>
      </div>
    );
  }
  
  // If error
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 max-w-lg w-full mx-auto">
          <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-400 mx-auto mb-3 md:mb-4" />
          <h4 className="font-bold text-gray-900 mb-2 text-center text-base md:text-lg">Database Error</h4>
          <p className="text-xs md:text-sm text-gray-600 mb-3 text-center break-words">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <button
              onClick={onRefresh}
              className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto"
            >
              Try Again
            </button>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="px-3 md:px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors text-sm md:text-base w-full sm:w-auto"
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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-8 md:py-12 bg-white rounded-xl border w-full max-w-md mx-auto">
          <BarChart3 className="w-8 h-8 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4" />
          <p className="text-sm md:text-base text-gray-600">No report data available</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-3 md:mt-4 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Kitchen Report</h3>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
            Report for {reportData.reportDate || 'Today'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm md:text-base bg-white"
            disabled={!onTimeRangeChange}
          >
            <option value="today">Today</option>
            <option value="week" disabled>This Week (Coming Soon)</option>
            <option value="month" disabled>This Month (Coming Soon)</option>
          </select>
          
          <button
            onClick={onExport}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm md:text-base"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4" />
            <span className="inline">Export</span>
          </button>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 md:px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg flex items-center justify-center transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Orders Today */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-3 h-3 md:w-5 md:h-5 text-blue-600" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-green-600">
              {totalOrders > 0 ? '+' : ''}{totalOrders}
            </span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Total Orders Today</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-3 h-3 md:w-5 md:h-5 text-yellow-600" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-yellow-600">
              {pendingOrders}
            </span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{pendingOrders}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Pending Orders</p>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-orange-50 rounded-lg">
              <Clock className="w-3 h-3 md:w-5 md:h-5 text-orange-600" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-orange-600">
              {preparingOrders}
            </span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{preparingOrders}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Preparing Orders</p>
        </div>

        {/* Ready Orders */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-green-600" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-green-600">
              {completedOrders}
            </span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{completedOrders}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Ready Orders</p>
        </div>
      </div>

  
      {/* Kitchen Status Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6">
        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4">Kitchen Status Summary</h4>
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white rounded-lg flex-shrink-0">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-900">Orders Today</p>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 break-words">
                {totalOrders} total orders • {activeOrders} active • {completionRate}% completed
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white rounded-lg flex-shrink-0">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-900">Processing Time</p>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                Average preparation time: {reportData.avgPrepTime || 15} minutes
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white rounded-lg flex-shrink-0">
              <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-900">Performance</p>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 break-words">
                {reportData.efficiency?.orderAccuracy || 95}% order accuracy • {reportData.efficiency?.onTimeDelivery || 90}% on-time delivery
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Last updated</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}