import { useTranslation } from 'react-i18next';
import { ChefHat, Clock, TrendingUp, ArrowRight, Sparkles, Package, CheckCircle, Users, AlertCircle } from 'lucide-react';

export default function DashboardView({ 
  kitchenStats, 
  stations, 
  orders, 
  setStationFilter, 
  setActiveView,
  updateOrderStatus
}) {
  const { t } = useTranslation('chef');

  const stats = [
    { 
      label: t('dashboard.active'), 
      value: kitchenStats.active,
      icon: Sparkles,
      trend: '+12%',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      dotColor: 'bg-orange-500'
    },
    { 
      label: t('dashboard.efficiency'), 
      value: `${kitchenStats.efficiency || 94}%`,
      icon: TrendingUp,
      trend: '+2%',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      dotColor: 'bg-emerald-500'
    },
    { 
      label: t('dashboard.avgTime'), 
      value: `${kitchenStats.avgPrepTime || 12}m`,
      icon: Clock,
      trend: '-1m',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      dotColor: 'bg-blue-500'
    },
    { 
      label: t('dashboard.completed'), 
      value: kitchenStats.completed,
      icon: ChefHat,
      trend: '+8%',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      dotColor: 'bg-purple-500'
    }
  ];

  const getTimeAgo = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    if (diff < 1) return t('dashboard.justNow');
    if (diff < 60) return `${diff}${t('dashboard.min')}`;
    return `${Math.floor(diff / 60)}${t('dashboard.hour')}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-l-red-500',
      preparing: 'border-l-amber-500',
      ready: 'border-l-emerald-500',
      completed: 'border-l-blue-500',
      cancelled: 'border-l-gray-500'
    };
    return colors[status] || 'border-l-gray-500';
  };

  const getStatusDot = (status) => {
    const dots = {
      pending: 'bg-red-500',
      preparing: 'bg-amber-500',
      ready: 'bg-emerald-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-gray-400'
    };
    return dots[status] || 'bg-gray-400';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-red-500" />;
      case 'preparing': return <Package className="w-4 h-4 text-amber-500" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Calculate order stats for colored dots display
  const orderStats = [
    { status: 'pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-red-500' },
    { status: 'preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'bg-amber-500' },
    { status: 'ready', count: orders.filter(o => o.status === 'ready').length, color: 'bg-emerald-500' },
    { status: 'completed', count: orders.filter(o => o.status === 'completed').length, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 text-sm mt-1">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stat.dotColor}`}></div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Order Status Dots - Like Tables View */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-base sm:text-lg">{t('dashboard.orderStatus', 'Order Status')}</h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">{orders.length} {t('dashboard.totalOrders', 'total orders')}</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {orderStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                <span className="text-sm text-gray-600">
                  {stat.count} {t(`dashboard.status.${stat.status}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders - Responsive */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-semibold text-gray-900 text-base sm:text-lg">{t('dashboard.recentOrders')}</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">{t('dashboard.manageOrders', 'Manage and track recent orders')}</p>
            </div>
            <button
              onClick={() => setActiveView('orders')}
              className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>{t('dashboard.viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {orders.slice(0, 6).map(order => {
            const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
            
            return (
              <div 
                key={order.id}
                className={`p-4 sm:p-5 border-l-4 ${getStatusColor(order.status)} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></div>
                        {getStatusIcon(order.status)}
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{order.orderNumber}</h3>
                      </div>
                      <span className="text-xs font-medium px-2 sm:px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {t('dashboard.table')} {order.tableNumber}
                      </span>
                      {order.customerName && (
                        <span className="text-xs font-medium px-2 sm:px-2.5 py-1 bg-green-100 text-green-700 rounded-full truncate hidden sm:inline">
                          {order.customerName}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                        {itemCount} {t('dashboard.items')}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {getTimeAgo(order.orderTime)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-medium">
                        ETB {order.total?.toLocaleString() || '0'}
                      </span>
                    </div>
                    
                    {order.customerName && (
                      <div className="mt-2 sm:hidden flex items-center gap-2 text-xs">
                        <Users className="w-3 h-3" />
                        <span className="text-gray-700 truncate">{order.customerName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <span className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                      order.status === 'ready' ? 'bg-emerald-100 text-emerald-700 border border-gray-200' :
                      order.status === 'preparing' ? 'bg-amber-100 text-amber-700 border border-gray-200' :
                      order.status === 'pending' ? 'bg-red-100 text-red-700 border border-gray-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {t(`dashboard.status.${order.status}`)}
                    </span>
                    
                    {order.status === 'ready' && updateOrderStatus && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {t('dashboard.serve')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Orders State */}
      {orders.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📋</div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            {t('dashboard.noOrders', 'No Orders Yet')}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto px-4">
            {t('dashboard.noOrdersDesc', 'There are no active orders at the moment.')}
          </p>
        </div>
      )}
    </div>
  );
}