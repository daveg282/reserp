'use client';

export default function KitchenOrdersView({ 
  orders = [],  // Provide default empty array
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

  // Always use the orders prop or empty array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter orders by status for display
  const getOrdersByStatus = (status) => {
    return safeOrders.filter(order => order && order.status === status);
  };

  // Count active orders
  const activeOrdersCount = safeOrders.filter(order => 
    order && order.status && order.status !== 'completed'
  ).length;

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
          {activeOrdersCount} active orders
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
                    <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-bold text-gray-900">Order #{order.orderNumber || order.id}</h5>
                          <p className="text-sm text-gray-600">Table: {order.tableNumber || 'N/A'}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-1">Customer: {order.customerName || 'Walk-in'}</p>
                        <p className="text-sm font-medium text-gray-900">Total: ${order.total?.toFixed(2) || '0.00'}</p>
                      </div>
                      
                      {/* Items Preview */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Items:</p>
                        {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                          <ul className="text-sm text-gray-700 space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name || `Item ${idx + 1}`}
                              </li>
                            ))}
                            {order.items.length > 2 && (
                              <li className="text-gray-500">+{order.items.length - 2} more items</li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No items listed</p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {statusConfig.status === 'ready' && (
                          <>
                            {order.payment_status !== 'paid' ? (
                              <>
                                <button
                                  onClick={() => completeOrder(order.id)}
                                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => completeOrderWithPayment(order.id, 'cash')}
                                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                >
                                  Pay Now
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => markOrderReady(order.id)}
                                className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                              >
                                Buzz Pager
                              </button>
                            )}
                          </>
                        )}
                        
                        {statusConfig.status === 'pending' && (
                          <button
                            onClick={() => markOrderReady(order.id)}
                            className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                          >
                            Mark as Ready
                          </button>
                        )}
                        
                        {statusConfig.status === 'preparing' && (
                          <button
                            onClick={() => markOrderReady(order.id)}
                            className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-amber-700 transition"
                          >
                            Ready for Pickup
                          </button>
                        )}
                      </div>
                    </div>
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