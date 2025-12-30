import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, TrendingUp, AlertCircle, Download, BarChart3, TrendingDown, Users, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { kitchenAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';

export default function ReportsView() {
  const { t } = useTranslation('chef');
  const [timeRange, setTimeRange] = useState('today'); // Changed default to 'today'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  // Fetch report data
  const fetchReportData = async () => {
    const token = AuthService.getToken();
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching kitchen stats...');
      const stats = await kitchenAPI.getKitchenStats(token);
      console.log('📊 Stats data:', stats);
      
      // Transform API data to match component structure
      const transformedData = transformStatsData(stats);
      setReportData(transformedData);
      
    } catch (err) {
      console.error('❌ Error fetching kitchen stats:', err);
      setError(err.message || 'Failed to load kitchen statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Transform API response to component format
  const transformStatsData = (apiData) => {
    if (!apiData || !apiData.stats) return null;
    
    const { stats, popular_items = [], date } = apiData;
    
    return {
      // Basic stats from API
      total_orders_today: stats.total_orders_today || 0,
      pending_orders: parseInt(stats.pending_orders || '0'),
      preparing_orders: parseInt(stats.preparing_orders || '0'),
      ready_orders: parseInt(stats.ready_orders || '0'),
      
      // Calculated metrics
      ordersPrepared: parseInt(stats.preparing_orders || '0') + parseInt(stats.ready_orders || '0'),
      avgPrepTime: 15, // Default value - you might need a separate API for this
      foodCost: 28.3, // Default value - you might need a separate API for this
      waste: 1240, // Default value - you might need a separate API for this
      revenue: 45890, // Default value - you might need a separate API for this
      
      // Popular dishes from API
      popularDishes: popular_items.map((item, index) => ({
        name: item.name,
        orders: parseInt(item.total_quantity || '0')
      })),
      
      // Efficiency metrics (could be calculated or from API)
      efficiency: {
        orderAccuracy: 98.2,
        onTimeDelivery: 94.7,
        staffEfficiency: 88.5
      },
      
      // Date from API
      reportDate: date || new Date().toISOString().split('T')[0]
    };
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchReportData();
  }, []);
  
  // Refresh data when timeRange changes (for future implementation)
  useEffect(() => {
    if (timeRange === 'today') {
      fetchReportData();
    }
    // Note: For 'week' and 'month', you'll need additional API endpoints
  }, [timeRange]);
  
  // Handle export
  const handleExport = () => {
    if (!reportData) {
      alert('No data to export');
      return;
    }
    
    const exportData = {
      timeRange,
      ...reportData,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitchen_report_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // If loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('reports.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('reports.subtitle', 'Kitchen performance and analytics')}
            </p>
          </div>
        </div>
        
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('reports.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('reports.subtitle', 'Kitchen performance and analytics')}
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h4 className="font-bold text-gray-900 mb-2">Error Loading Reports</h4>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchReportData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // If no data
  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('reports.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('reports.subtitle', 'Kitchen performance and analytics')}
            </p>
          </div>
        </div>
        
        <div className="text-center py-12 bg-white rounded-xl border">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No report data available</p>
        </div>
      </div>
    );
  }
  
  // Calculate some derived metrics
  const totalOrders = reportData.total_orders_today;
  const completedOrders = reportData.ready_orders;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const activeOrders = reportData.pending_orders + reportData.preparing_orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('reports.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Report for {reportData.reportDate}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            disabled={true} // Disabled until we implement week/month endpoints
          >
            <option value="today">Today</option>
            <option value="week" disabled>This Week (Coming Soon)</option>
            <option value="month" disabled>This Month (Coming Soon)</option>
          </select>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('reports.export')}</span>
          </button>
          
          <button
            onClick={fetchReportData}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg flex items-center space-x-2 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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
              {reportData.pending_orders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.pending_orders}</p>
          <p className="text-sm text-gray-600 mt-1">Pending Orders</p>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-semibold text-orange-600">
              {reportData.preparing_orders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.preparing_orders}</p>
          <p className="text-sm text-gray-600 mt-1">Preparing Orders</p>
        </div>

        {/* Ready Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">
              {reportData.ready_orders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.ready_orders}</p>
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
          <p className="text-3xl font-bold text-gray-900">{reportData.ordersPrepared}</p>
          <p className="text-sm text-gray-600 mt-2">
            {reportData.preparing_orders} preparing + {reportData.ready_orders} ready
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
              {reportData.pending_orders} Pending
            </div>
            <div className="flex-1 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {reportData.preparing_orders} Preparing
            </div>
          </div>
        </div>
      </div>

      {/* Popular Dishes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-900">Popular Dishes Today</h4>
          <span className="text-sm text-gray-500">
            {reportData.popularDishes.length} items
          </span>
        </div>
        
        {reportData.popularDishes.length > 0 ? (
          <div className="space-y-3">
            {reportData.popularDishes.map((dish, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-amber-700' : 'text-gray-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{dish.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{dish.orders} orders</span>
                  <span className="text-sm text-gray-400">
                    {totalOrders > 0 ? Math.round((dish.orders / totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No popular dishes data available
          </div>
        )}
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
                Average preparation time: {reportData.avgPrepTime} minutes
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
                {reportData.efficiency.orderAccuracy}% order accuracy • {reportData.efficiency.onTimeDelivery}% on-time delivery
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