import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';

export default function OrderCard({ 
  order, 
  stations, 
  updateOrderStatus,
  setSelectedOrder,
  isLoading = false,
  onStartPreparation  // This should be used for ingredient checks
}) {
  const { t } = useTranslation('chef');
  const [mounted, setMounted] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !order.orderTime) return;
    
    const updateTime = () => {
      const orderDate = new Date(order.orderTime);
      const now = new Date();
      const diffMinutes = Math.floor((now - orderDate) / (1000 * 60));
      
      if (diffMinutes < 1) {
        setTimeAgo(t('orders.justNow'));
      } else if (diffMinutes < 60) {
        setTimeAgo(`${diffMinutes}${t('orders.minutesAgo')}`);
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        setTimeAgo(`${diffHours}${t('orders.hoursAgo')}`);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [mounted, order.orderTime, t]);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl border shadow-sm p-4 lg:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        label: t('orders.statusPending'), 
        icon: Clock, 
        color: 'bg-yellow-100 text-yellow-800',
        textColor: 'text-yellow-600'
      },
      preparing: { 
        label: t('orders.statusPreparing'), 
        icon: ChefHat, 
        color: 'bg-blue-100 text-blue-800',
        textColor: 'text-blue-600'
      },
      ready: { 
        label: t('orders.statusReady'), 
        icon: CheckCircle, 
        color: 'bg-green-100 text-green-800',
        textColor: 'text-green-600'
      },
      completed: { 
        label: t('orders.statusCompleted'), 
        icon: CheckCircle, 
        color: 'bg-gray-100 text-gray-800',
        textColor: 'text-gray-600'
      }
    };
    return configs[status] || configs.pending;
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : stationId;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Handle start preparing with ingredient check
  const handleStartPreparing = async () => {
    if (isLoading) return;
    
    // Check if there's a first item to check ingredients for
    const firstItem = order.items?.[0];
    if (firstItem && onStartPreparation) {
      const canPrepare = await onStartPreparation(firstItem.id, firstItem.menu_item_id);
      if (!canPrepare) return;
    }
    
    // Update order status to preparing
    await updateOrderStatus(order.id, 'preparing');
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 lg:p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              #{order.orderNumber}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600 text-sm">
                {order.tableNumber} • {order.waiterName}
              </span>
              {timeAgo && (
                <span className="text-xs text-gray-500">• {timeAgo}</span>
              )}
            </div>
          </div>
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{statusConfig.label}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-6">
          {order.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  {item.quantity}x {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusConfig(item.status).color}`}>
                    {getStatusConfig(item.status).label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getStationName(item.station)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  {item.prepTime || 10}m
                </span>
              </div>
            </div>
          ))}
          {order.items && order.items.length > 3 && (
            <div className="text-center text-sm text-gray-500 pt-2">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>

        {/* Order Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedOrder(order)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition"
            disabled={isLoading}
          >
            {t('orders.viewDetails')}
          </button>
          
          {order.status === 'pending' && (
            <button
              onClick={handleStartPreparing}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {t('orders.startPreparing')}
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'ready')}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {t('orders.markReady')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}