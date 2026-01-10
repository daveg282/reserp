import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw } from 'lucide-react';
import OrderCard from './OrderCard';

export default function OrdersView({ 
  orders, 
  filter, 
  setFilter, 
  stationFilter, 
  setStationFilter, 
  searchQuery, 
  setSearchQuery, 
  stations, 
  updateOrderStatus,  // This updates ENTIRE order status
  setSelectedOrder,
  isLoading = false
  // Removed: onStartPreparation (not needed anymore)
}) {
  const { t } = useTranslation('chef');
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR
  if (!mounted) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
              <div className="h-10 bg-gray-200 rounded-xl w-full sm:w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-full sm:w-32 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-full sm:w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Filter orders directly - NO local state needed
  const filteredOrders = orders.filter(order => {
    if (filter === 'active' && order.status === 'completed') return false;
    if (filter === 'completed' && order.status !== 'completed') return false;
    if (stationFilter !== 'all') {
      return order.items?.some(item => item.station === stationFilter);
    }
    if (searchQuery) {
      return (
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.waiterName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  // REMOVED: handleOrderStatusUpdate function - use updateOrderStatus directly

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('orders.title')}</h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating...</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <option value="active">{t('orders.activeOrders')}</option>
              <option value="completed">{t('orders.completed')}</option>
              <option value="all">{t('orders.allOrders')}</option>
            </select>
            <select 
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black flex-1 sm:flex-none"
              disabled={isLoading}
            >
              <option value="all">{t('orders.allStations')}</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>{station.name}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('orders.searchOrders')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            stations={stations}
            updateOrderStatus={updateOrderStatus}  // Pass directly from parent
            setSelectedOrder={setSelectedOrder}
            isLoading={isLoading}
            // Removed: onStartPreparation
          />
        ))}
      </div>

      {isLoading && filteredOrders.length === 0 ? (
        <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-2xl border shadow-sm">
          <div className="text-4xl lg:text-6xl mb-4 lg:mb-6 animate-pulse">👨‍🍳</div>
          <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3 text-black">
            {t('orders.loading')}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base">
            {t('orders.fetchingOrders')}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-2xl border shadow-sm">
          <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">🍽️</div>
          <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3 text-black">
            {t('orders.kitchenClear')}
          </h3>
          <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base">
            {t('orders.noOrders')}
          </p>
        </div>
      ) : null}
    </div>
  );
}