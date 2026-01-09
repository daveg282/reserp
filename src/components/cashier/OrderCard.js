'use client';
import OrderCard from './OrderCard';

export default function KitchenOrdersView({ 
  orders, 
  markOrderReady, 
  completeOrder, 
  completeOrderWithPayment,
  isLoading, 
  error, 
  onRefresh 
}) {
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

  // Filter orders by status for display
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Kitchen Orders</h3>
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Kitchen Orders</h3>
          <button
            onClick={onRefresh}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Kitchen Orders</h3>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
          {orders.filter(order => order.status !== 'completed').length} active orders
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {orderStatuses.map((statusConfig) => {
          const statusOrders = getOrdersByStatus(statusConfig.status);
          
          return (
            <div key={statusConfig.status} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-900 text-lg">{statusConfig.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.badgeColor}`}>
                  {statusOrders.length}
                </span>
              </div>
              <div className="space-y-4">
                {statusOrders.length > 0 ? (
                  statusOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      statusConfig={statusConfig}
                      markOrderReady={markOrderReady}
                      completeOrder={completeOrder}
                      completeOrderWithPayment={completeOrderWithPayment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {statusConfig.status === 'pending' && 'No pending orders'}
                      {statusConfig.status === 'preparing' && 'No orders preparing'}
                      {statusConfig.status === 'ready' && 'No orders ready'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}