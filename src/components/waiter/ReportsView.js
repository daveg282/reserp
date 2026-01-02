import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';

export default function DailyOrders({ orders, updateOrderStatus, setShowDailyOrders }) {
  const { t } = useTranslation('waiter');
  const [dailyData, setDailyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    fetchDailyOrders();
  }, []);

  const fetchDailyOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Get today's date in YYYY-MM-DD format
      const today = currentDate.toISOString().split('T')[0];
      console.log('📡 Fetching daily orders for today:', today);
      const data = await ordersAPI.getDailyOrders(token, today);
      
      if (data.success) {
        setDailyData(data);
        console.log('✅ Daily orders data received:', data);
      } else {
        throw new Error(data.error || 'Failed to load daily orders');
      }
      
    } catch (error) {
      console.error('❌ Error fetching daily orders:', error);
      setError(error.message || 'Failed to load daily orders');
      setDailyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'ETB 0.00';
    return `ETB ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border border-green-200';
      case 'ready': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700 border border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'pending': 
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const exportToCSV = () => {
    if (!dailyData || !dailyData.orders || dailyData.orders.length === 0) {
      alert(t('reports.noDataToExport'));
      return;
    }
    
    const headers = ['Order #', 'Table', 'Customer', 'Time', 'Status', 'Payment', 'Total', 'Items'];
    const rows = dailyData.orders.map(order => [
      order.order_number,
      order.table_number || 'N/A',
      order.customer_name,
      formatTime(order.order_time),
      order.status,
      order.payment_status,
      formatCurrency(order.total_amount),
      order.items?.length || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-orders-${currentDate.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    fetchDailyOrders();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">{t('reports.loadingReport')}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatDate(currentDate)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-3 sm:mb-4">
          <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2" />
          <h3 className="text-base sm:text-lg font-semibold text-red-700">{t('reports.errorLoadingReport')}</h3>
        </div>
        <p className="text-red-600 text-sm sm:text-base mb-3 sm:mb-4">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={refreshData}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {t('common.tryAgain')}
          </button>
          <button
            onClick={() => setShowDailyOrders(false)}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
          >
            {t('reports.backToReports')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div>
           <button
                onClick={refreshData}
                className="px-2 sm:px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('reports.refresh')}
              </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {dailyData && dailyData.orders && dailyData.orders.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('reports.exportCSV')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {dailyData && dailyData.summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Revenue */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {dailyData.summary.totalOrders} {t('reports.orders').toLowerCase()}
                </span>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                {formatCurrency(dailyData.summary.totalRevenue)}
              </h4>
              <p className="text-gray-600 text-xs">{t('reports.totalRevenue')}</p>
            </div>

            {/* Orders Placed */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {t('reports.avg')}: {formatCurrency(dailyData.summary.averageOrderValue)}
                </span>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                {dailyData.summary.totalOrders}
              </h4>
              <p className="text-gray-600 text-xs">{t('reports.ordersPlaced')}</p>
            </div>

            {/* Items Sold */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {dailyData.summary.itemsSold} {t('reports.items')}
                </span>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                {dailyData.summary.itemsSold}
              </h4>
              <p className="text-gray-600 text-xs">{t('reports.itemsSold')}</p>
            </div>

            {/* Tables Served */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {dailyData.summary.tablesServed} {t('reports.tables')}
                </span>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                {dailyData.summary.tablesServed}
              </h4>
              <p className="text-gray-600 text-xs">{t('reports.tablesServed')}</p>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{t('reports.completed')}</h4>
                  <p className="text-gray-600 text-xs">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {dailyData.summary.completedOrders || 0}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{t('reports.paid')}</h4>
                  <p className="text-gray-600 text-xs">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {dailyData.summary.paidOrders || 0}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-red-100">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{t('reports.cancelled')}</h4>
                  <p className="text-gray-600 text-xs">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {dailyData.summary.cancelledOrders || 0}
              </div>
            </div>
          </div>

          {/* Top Items */}
          {dailyData.topItems && dailyData.topItems.length > 0 && (
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  {t('reports.topItemsToday')}
                </h3>
                <span className="text-xs text-gray-500">{t('reports.mostPopular')}</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {dailyData.topItems.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="font-bold text-blue-600 text-xs sm:text-sm">{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantitySold} {t('reports.sold')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {formatCurrency(item.revenue)}
                      </p>
                      <p className="text-xs text-gray-500">{t('reports.revenue')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                {t('reports.orderDetails')} ({dailyData.orders.length})
              </h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={refreshData}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('reports.refresh')}</span>
                </button>
              </div>
            </div>
            
            {dailyData.orders && dailyData.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-0">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.order')}
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.table')}
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.customer')}
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.time')}
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.status')}
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reports.total')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyData.orders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {order.order_number}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <div className="text-xs sm:text-sm text-gray-900">
                              {order.table_number || 'N/A'}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[100px]">
                              {order.customer_name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <div className="text-xs sm:text-sm text-gray-500">
                              {formatTime(order.order_time)}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {dailyData.orders.length > 10 && (
                  <div className="text-center py-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {t('reports.showingOrders', { count: 10, total: dailyData.orders.length })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {t('reports.noOrders')}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {t('reports.noOrdersToday')}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* No Data Message */}
      {!dailyData && !isLoading && !error && (
        <div className="text-center py-8 sm:py-12">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
            {t('reports.dailyReport')}
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm">
            {formatDate(currentDate)}
          </p>
        </div>
      )}
    </div>
  );
}