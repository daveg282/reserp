import { useTranslation } from 'react-i18next';
import { ChefHat, CheckCircle, Eye, AlertCircle, AlertTriangle, Clock } from 'lucide-react';

export default function OrderCard({ 
  order, 
  stations, 
  updateOrderStatus, 
  setSelectedOrder, 
  checkIngredientAvailability 
}) {
  const { t } = useTranslation('chef');

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-red-50 border-red-200 text-red-700', label: 'Pending', dot: 'bg-red-500', bg: 'bg-red-500/10' },
      preparing: { color: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Preparing', dot: 'bg-amber-500', bg: 'bg-amber-500/10' },
      ready: { color: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Ready', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
      completed: { color: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Completed', dot: 'bg-blue-500', bg: 'bg-blue-500/10' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      normal: { color: 'text-gray-600', bg: 'bg-gray-100', label: '', icon: '' },
      high: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Priority', icon: '⚡' },
      vip: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'VIP', icon: '👑' }
    };
    return configs[priority] || configs.normal;
  };

  const getTimeElapsed = (orderTime) => {
    const diff = Math.floor((new Date() - new Date(orderTime)) / 60000);
    return diff < 1 ? 'Just now' : `${diff} min ago`;
  };

  const getTimeSince = (time) => {
    if (!time) return 'N/A';
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return `${diff} min`;
  };

  const isOrderDelayed = (order) => {
    const waitTime = (new Date() - new Date(order.orderTime)) / 60000;
    return order.status === 'pending' && waitTime > 10;
  };

  const getStationColor = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? `bg-${station.color}-100 text-${station.color}-700` : 'bg-gray-100 text-gray-700';
  };

  const statusConfig = getStatusConfig(order.status);
  const priorityConfig = getPriorityConfig(order.priority);
  const isDelayed = isOrderDelayed(order);
  const ingredientShortages = checkIngredientAvailability(order.items);

  return (
    <div className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border hover:shadow-lg transition ${
      isDelayed ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
    }`}>
      {/* Order Header */}
      <div className={`p-4 lg:p-6 border-b ${isDelayed ? 'bg-red-50/30' : ''}`}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                {order.tableNumber}
              </h4>
              {priorityConfig.label && (
                <span className={`text-xs font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full ${priorityConfig.bg} ${priorityConfig.color} whitespace-nowrap`}>
                  {priorityConfig.icon} {priorityConfig.label}
                </span>
              )}
              {isDelayed && (
                <span className="flex items-center text-xs font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t('orders.delayed')}
                </span>
              )}
              {ingredientShortages.length > 0 && order.status === 'pending' && (
                <span className="flex items-center text-xs font-semibold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {t('orders.missingIngredients')}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{order.orderNumber}</p>
            <p className="text-xs text-gray-500">
              {t('orders.waiter')}: {order.waiterName}
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-3 lg:px-4 py-1.5 lg:py-2 h-fit rounded-full border ${statusConfig.color} self-start`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></div>
            <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
              {statusConfig.label}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs lg:text-sm">
          <span className="text-gray-600 flex items-center">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
            {getTimeElapsed(order.orderTime)}
          </span>
          {order.startedTime && (
            <span className="text-gray-600">
              {t('orders.prepTime')}: {getTimeSince(order.startedTime)}
            </span>
          )}
        </div>
        {order.customerNotes && (
          <div className="mt-3 lg:mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 lg:p-4">
            <p className="text-xs lg:text-sm text-blue-900 font-medium">
              💬 {order.customerNotes}
            </p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="p-4 lg:p-6">
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="p-3 lg:p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition">
              <div className="font-bold text-base lg:text-lg mb-1 text-gray-900">
                {item.quantity}x {item.name}
              </div>
              {item.specialRequest && (
                <div className="text-xs lg:text-sm text-orange-700 bg-orange-50 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg inline-block mt-2 border border-orange-200">
                  ⚠️ {item.specialRequest}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg ${getStationColor(item.station)} whitespace-nowrap`}>
                  {stations.find(s => s.id === item.station)?.icon} {item.station}
                </span>
                <span className="text-gray-600 bg-gray-100 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg whitespace-nowrap">
                  ⏱️ {item.prepTime || item.cookTime}m
                </span>
              </div>
              {item.ingredients && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">{t('orders.ingredients')}:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded border text-xs">
                        {ing.name} ({ing.quantity * item.quantity}{ing.unit})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 lg:p-6 border-t bg-gray-50/50">
        <div className="flex flex-col sm:flex-row gap-3">
          {order.status === 'pending' && ingredientShortages.length === 0 && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'preparing')} 
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2"
            >
              <ChefHat className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{t('orders.start')}</span>
            </button>
          )}
          {order.status === 'pending' && ingredientShortages.length > 0 && (
            <button 
              disabled 
              className="flex-1 bg-gray-400 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2 cursor-not-allowed"
            >
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{t('orders.missingIngredients')}</span>
            </button>
          )}
          {order.status === 'preparing' && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'ready')} 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{t('orders.ready')}</span>
            </button>
          )}
          {order.status === 'ready' && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'completed')} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3.5 rounded-xl font-semibold transition shadow-lg text-sm lg:text-base"
            >
              {t('orders.serve')}
            </button>
          )}
          <button 
            onClick={() => setSelectedOrder(order)} 
            className="bg-gray-100 hover:bg-gray-200 p-2.5 lg:p-3.5 rounded-xl transition sm:w-auto w-full flex items-center justify-center"
          >
            <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-gray-900" />
            <span className="ml-2 sm:hidden text-black">{t('orders.viewDetails')}</span>
          </button>
        </div>
        {ingredientShortages.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              {t('orders.missingIngredients')}:
            </p>
            {ingredientShortages.map((shortage, idx) => (
              <p key={idx} className="text-xs text-yellow-700">
                {shortage.ingredient}: {shortage.required}{shortage.unit} {t('orders.needed')}, {shortage.available}{shortage.unit} {t('orders.available')}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}