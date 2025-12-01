import { useTranslation } from 'react-i18next';
import { ChefHat, Clock, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';

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
      bg: 'bg-orange-50'
    },
    { 
      label: t('dashboard.efficiency'), 
      value: `${kitchenStats.efficiency || 94}%`,
      icon: TrendingUp,
      trend: '+2%',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: t('dashboard.avgTime'), 
      value: `${kitchenStats.avgPrepTime || 12}m`,
      icon: Clock,
      trend: '-1m',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: t('dashboard.completed'), 
      value: kitchenStats.completed,
      icon: ChefHat,
      trend: '+8%',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
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
      completed: 'border-l-blue-500'
    };
    return colors[status] || 'border-l-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">{t('dashboard.live')}</span>
        </div>
      </div>

      {/* Stats Grid - Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-500">{stat.trend}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stations */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{t('dashboard.stations')}</h2>
            </div>
            <div className="p-4 space-y-3">
              {stations.slice(0, 4).map(station => {
                const count = orders.filter(o => 
                  o.items?.some(i => i.station === station.id) && 
                  o.status !== 'completed'
                ).length;
                
                return (
                  <button
                    key={station.id}
                    onClick={() => {
                      setStationFilter(station.id);
                      setActiveView('orders');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{station.icon}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{station.name}</p>
                        <p className="text-sm text-gray-500">{count} {t('dashboard.orders')}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setActiveView('orders')}
                className="w-full text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-2"
              >
                {t('dashboard.viewAll')}
              </button>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{t('dashboard.performance')}</h3>
              <span className="text-lg font-bold text-emerald-600">{kitchenStats.efficiency || 94}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('dashboard.ontime')}</span>
                <span className="font-medium text-gray-900">{kitchenStats.onTime || 89}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${kitchenStats.onTime || 89}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{t('dashboard.recentOrders')}</h2>
                <button
                  onClick={() => setActiveView('orders')}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  {t('dashboard.viewAll')}
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 6).map(order => {
                const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
                
                return (
                  <div 
                    key={order.id}
                    className={`p-5 border-l-4 ${getStatusColor(order.status)} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm font-medium text-gray-700">
                            {t('dashboard.table')} {order.tableNumber}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{itemCount} {t('dashboard.items')}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getTimeAgo(order.orderTime)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                          order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t(`dashboard.status.${order.status}`)}
                        </span>
                        {order.status === 'ready' && updateOrderStatus && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
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

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {orders.filter(o => o.status === 'preparing').length}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.preparing')}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {orders.filter(o => o.status === 'ready').length}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.ready')}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {orders.filter(o => o.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.completed')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}