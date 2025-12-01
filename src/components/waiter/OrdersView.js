import { useTranslation } from 'react-i18next';

export default function OrdersView({ orders, updateOrderStatus, setActiveView }) {
  const { t } = useTranslation('waiter');

  const getStatusTranslation = (status) => {
    switch (status) {
      case 'pending': return t('orders.status.pending');
      case 'preparing': return t('orders.status.preparing');
      case 'ready': return t('orders.status.ready');
      case 'completed': return t('orders.status.completed');
      default: return status;
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('orders.title')}</h3>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
          {activeOrders.length} {t('orders.activeOrders')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base lg:text-lg truncate">{order.orderNumber}</h4>
                <p className="text-sm text-gray-500">{t('table')} {order.tableNumber}</p>
              </div>
              <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                order.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {getStatusTranslation(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-3 lg:mb-4">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs lg:text-sm">
                  <span className="text-gray-600 truncate flex-1">{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-gray-900 flex-shrink-0 ml-2">ETB {item.price * item.quantity}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-gray-500">+{order.items.length - 3} {t('moreItems')}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200">
              <div>
                <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {order.total}</p>
                <p className="text-xs text-gray-500">{t('orders.estimatedTime')} {order.estimatedTime || 15}m</p>
              </div>
              <div className="flex space-x-2">
                {order.status === 'ready' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    {t('orders.serve')}
                  </button>
                )}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                  {t('orders.details')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeOrders.length === 0 && (
        <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-2xl border">
          <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">📋</div>
          <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3 text-black">{t('orders.noActiveOrders')}</h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 lg:mb-8">{t('orders.allCompleted')}</p>
          <button
            onClick={() => setActiveView('tables')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-xl font-semibold text-sm lg:text-base"
          >
            {t('orders.takeNewOrder')}
          </button>
        </div>
      )}
    </div>
  );
}