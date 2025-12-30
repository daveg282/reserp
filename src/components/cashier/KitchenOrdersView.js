'use client';
import OrderCard from './OrderCard';

export default function KitchenOrdersView({ orders, markOrderReady, completeOrder }) {
  const orderStatuses = [
    {
      status: 'pending',
      title: 'Pending',
      badgeColor: 'bg-blue-100 text-blue-700',
      cardColor: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      status: 'preparing',
      title: 'Preparing',
      badgeColor: 'bg-amber-100 text-amber-700',
      cardColor: 'bg-amber-50 border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      status: 'ready',
      title: 'Ready for Pickup',
      badgeColor: 'bg-green-100 text-green-700',
      cardColor: 'bg-green-50 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">Kitchen Orders</h3>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
          {orders.filter(order => order.status !== 'completed').length} active orders
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {orderStatuses.map((statusConfig) => (
          <div key={statusConfig.status} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h4 className="font-bold text-gray-900 text-lg">{statusConfig.title}</h4>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusConfig.badgeColor}`}>
                {orders.filter(o => o.status === statusConfig.status).length}
              </span>
            </div>
            <div className="space-y-4">
              {orders
                .filter(order => order.status === statusConfig.status)
                .map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    statusConfig={statusConfig}
                    markOrderReady={markOrderReady}
                    completeOrder={completeOrder}
                  />
                ))}
              
              {orders.filter(o => o.status === statusConfig.status).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  {statusConfig.status === 'pending' && 'No pending orders'}
                  {statusConfig.status === 'preparing' && 'No orders preparing'}
                  {statusConfig.status === 'ready' && 'No orders ready'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}