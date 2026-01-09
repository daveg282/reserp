'use client';
import { Download, Printer, Calendar, DollarSign, CreditCard, TrendingUp, Bell, Loader2, AlertCircle } from 'lucide-react';

export default function ReportsView({ 
  // Data props
  reportData = null,
  todaySales = null,
  pagers = [],
  
  // State props
  isLoading = false,
  error = null,
  timeRange = 'Today',
  
  // Action props
  onTimeRangeChange = () => {},
  onExportCSV = () => {},
  onPrintReport = () => {},
  onRefresh = () => {}
}) {
  
  // Calculate stats based on available data
  const stats = [
    { 
      label: 'Total Revenue', 
      value: reportData?.total_revenue 
        ? `ETB ${reportData.total_revenue.toLocaleString()}` 
        : todaySales?.total 
        ? `ETB ${todaySales.total.toLocaleString()}`
        : 'ETB 0',
      icon: DollarSign, 
      color: 'emerald',
      change: reportData?.revenue_change || 'N/A',
      trend: reportData?.revenue_change?.includes('+') ? 'up' : 'down'
    },
    { 
      label: 'Transactions', 
      value: reportData?.total_transactions || todaySales?.transactions || 0, 
      icon: CreditCard, 
      color: 'blue',
      change: reportData?.transaction_change || 'N/A',
      trend: reportData?.transaction_change?.includes('+') ? 'up' : 'down'
    },
    { 
      label: 'Average Order', 
      value: reportData?.average_order_value 
        ? `ETB ${reportData.average_order_value.toFixed(2)}` 
        : todaySales?.average 
        ? `ETB ${todaySales.average.toFixed(2)}`
        : 'ETB 0.00', 
      icon: TrendingUp, 
      color: 'purple',
      change: reportData?.avg_order_change || 'N/A',
      trend: reportData?.avg_order_change?.includes('+') ? 'up' : 'down'
    },
    { 
      label: 'Pagers Used', 
      value: reportData?.pagers_used || pagers.filter(p => p.status !== 'available').length, 
      icon: Bell, 
      color: 'purple',
      change: reportData?.pagers_change || 'N/A',
      trend: reportData?.pagers_change?.includes('+') ? 'up' : 'down'
    }
  ];

  // Show error state
  if (error && !reportData && !todaySales) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Sales Reports</h3>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Financial reports and analytics</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800">Unable to Load Report Data</h4>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Sales Reports</h3>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            {isLoading ? 'Loading report data...' : 'Real-time financial analytics'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 text-black w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select 
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium bg-white flex-1 sm:flex-none"
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              disabled={isLoading}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
            <button 
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onExportCSV}
              disabled={isLoading || (!reportData && !todaySales)}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export CSV</span>
            </button>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onPrintReport}
              disabled={isLoading || (!reportData && !todaySales)}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !reportData && !todaySales && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading report data...</p>
        </div>
      )}

      {/* Error State (with partial data) */}
      {error && (reportData || todaySales) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <p className="text-yellow-700 text-sm">{error} (Showing available data)</p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {(reportData || todaySales) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-gray-600'
                  }`}>
                    {stat.change !== 'N/A' && (
                      <>
                        <TrendingUp className={`w-3 h-3 lg:w-4 lg:h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span>{stat.change}</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* No data state */}
      {!isLoading && !error && !reportData && !todaySales && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Report Data Available</h3>
            <p className="text-gray-600 mb-6">
              {timeRange === 'Today' 
                ? 'No sales data available for today yet.' 
                : `No sales data available for ${timeRange.toLowerCase()}.`}
            </p>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}