import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';

export default function DailyOrders({ orders, updateOrderStatus, setShowDailyOrders }) {
  const { t } = useTranslation('waiter');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyOrders();
  }, [selectedDate]);

  const fetchDailyOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('📡 Fetching daily orders for date:', selectedDate);
      const data = await ordersAPI.getDailyOrders(token, selectedDate);
      
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': 
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    if (!dailyData || !dailyData.orders || dailyData.orders.length === 0) {
      alert('No data to export');
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
    a.download = `daily-orders-${selectedDate}.csv`;
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
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading daily report...</p>
        <p className="text-sm text-gray-500 mt-1">Date: {selectedDate}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <XCircle className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-700">Error Loading Report</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => setShowDailyOrders(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('reports.dailyReport')}</h1>
            <p className="text-gray-600">
              {dailyData ? formatDate(selectedDate) : t('reports.viewYourDailyPerformance')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {dailyData && dailyData.orders && dailyData.orders.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              {t('reports.exportCSV')}
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {dailyData && dailyData.summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {dailyData.summary.totalOrders} {t('reports.orders')}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(dailyData.summary.totalRevenue)}
              </h4>
              <p className="text-gray-600 text-sm">{t('reports.totalRevenue')}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Avg: {formatCurrency(dailyData.summary.averageOrderValue)}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {dailyData.summary.totalOrders}
              </h4>
              <p className="text-gray-600 text-sm">{t('reports.ordersPlaced')}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  {dailyData.summary.itemsSold} {t('reports.items')}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {dailyData.summary.itemsSold}
              </h4>
              <p className="text-gray-600 text-sm">{t('reports.itemsSold')}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-100">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm text-amber-600 font-medium">
                  {dailyData.summary.tablesServed} {t('reports.tables')}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {dailyData.summary.tablesServed}
              </h4>
              <p className="text-gray-600 text-sm">{t('reports.tablesServed')}</p>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('reports.completed')}</h4>
                  <p className="text-sm text-gray-600">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {dailyData.summary.completedOrders || 0}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('reports.paid')}</h4>
                  <p className="text-sm text-gray-600">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {dailyData.summary.paidOrders || 0}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-100">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('reports.cancelled')}</h4>
                  <p className="text-sm text-gray-600">{t('reports.orders')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-red-600">
                {dailyData.summary.cancelledOrders || 0}
              </div>
            </div>
          </div>

          {/* Top Items */}
          {dailyData.topItems && dailyData.topItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('reports.topItemsToday')}
                </h3>
                <span className="text-sm text-gray-500">{t('reports.mostPopular')}</span>
              </div>
              <div className="space-y-4">
                {dailyData.topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantitySold} {t('reports.sold')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.revenue)}
                      </p>
                      <p className="text-sm text-gray-500">{t('reports.revenue')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('reports.orderDetails')} ({dailyData.orders.length})
              </h3>
              <button
                onClick={refreshData}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Refresh
              </button>
            </div>
            
            {dailyData.orders && dailyData.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.order')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.table')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.time')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.payment')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dailyData.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.order_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.table_number || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.customer_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatTime(order.order_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {t('reports.noOrders')}
                </h4>
                <p className="text-gray-600">
                  {t('reports.noOrdersMessage')} {formatDate(selectedDate)}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* No Data Message */}
      {!dailyData && !isLoading && !error && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {t('reports.selectDate')}
          </h4>
          <p className="text-gray-600">
            {t('reports.selectDateMessage')}
          </p>
        </div>
      )}
    </div>
  );
}