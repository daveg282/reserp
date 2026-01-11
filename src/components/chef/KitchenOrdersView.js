'use client';

export default function KitchenOrdersView({ 
  orders = [],
  markOrderPreparing,  // For pending → preparing
  markOrderReady,      // For preparing → ready  
  isLoading,
  error,
  onRefresh 
}) {
  const orderStatuses = [
    {
      status: 'pending',
      title: 'Pending Orders',
      badgeColor: 'bg-blue-100 text-blue-700',
      cardColor: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      buttonText: 'Start Preparing'
    },
    {
      status: 'preparing',
      title: 'In Progress',
      badgeColor: 'bg-amber-100 text-amber-700',
      cardColor: 'bg-amber-50 border-amber-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      buttonText: 'Mark as Ready'
    },
    {
      status: 'ready',
      title: 'Ready for Pickup',
      badgeColor: 'bg-green-100 text-green-700',
      cardColor: 'bg-green-50 border-green-200',
      buttonColor: 'bg-gray-400 cursor-not-allowed',
      buttonText: 'Awaiting Pickup'
    }
  ];

  // Always use the orders prop or empty array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter orders by status for display
  const getOrdersByStatus = (status) => {
    return safeOrders.filter(order => order && order.status === status);
  };

  // Helper function to get items from order (handles both formats)
  const getOrderItems = (order) => {
    if (!order) return [];
    
    // Check if order has items property
    if (order.items && Array.isArray(order.items)) {
      return order.items;
    }
    
    // Check if order has rawOrder with items
    if (order.rawOrder && order.rawOrder.items && Array.isArray(order.rawOrder.items)) {
      return order.rawOrder.items;
    }
    
    return [];
  };

  // Helper function to get item name
  const getItemName = (item) => {
    if (!item) return 'Unknown Item';
    
    // Try different possible property names
    return item.item_name || item.name || `Item ${item.id || item.menu_item_id || ''}`;
  };

  // Count active orders
  const activeOrdersCount = safeOrders.filter(order => 
    order && order.status && (order.status === 'pending' || order.status === 'preparing')
  ).length;

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <button
            onClick={onRefresh}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">Error loading kitchen orders: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
            {activeOrdersCount} active orders to prepare
          </div>
          <button
            onClick={onRefresh}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg"
          >
            Refresh Orders
          </button>
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
                  statusOrders.map(order => {
                    const orderItems = getOrderItems(order);
                    
                    return (
                      <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-bold text-gray-900">Order #{order.orderNumber || order.id}</h5>
                            <p className="text-sm text-gray-600">Table: {order.tableNumber || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500 block">
                              {order.orderTime ? 
                                new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                                '--:--'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {order.orderTime ? 
                                new Date(order.orderTime).toLocaleDateString() : 
                                ''}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 mb-1">Customer: {order.customerName || 'Walk-in'}</p>
                          {order.total && (
                            <p className="text-sm font-medium text-gray-900">Total: ${parseFloat(order.total).toFixed(2)}</p>
                          )}
                        </div>
                        
                        {/* Items Preview */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">Items:</p>
                          {orderItems.length > 0 ? (
                            <ul className="text-sm text-gray-700 space-y-2">
                              {orderItems.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center">
                                  <span>
                                    {item.quantity || 1}x {getItemName(item)}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    item.status === 'ready' ? 'bg-green-100 text-green-700' :
                                    item.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {item.status === 'ready' ? 'Ready' :
                                     item.status === 'preparing' ? 'Preparing' :
                                     'Pending'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No items listed</p>
                          )}
                        </div>
                        
                        {/* Action Buttons - 2-Step Chef Workflow */}
                        <div className="flex gap-2">
                          {/* STEP 1: PENDING → Start Preparing */}
                          {statusConfig.status === 'pending' && (
                            <button
                              onClick={() => markOrderPreparing(order.id)}
                              className={`flex-1 ${statusConfig.buttonColor} text-white py-2 px-3 rounded-lg text-sm font-medium hover:opacity-90 transition`}
                            >
                              Start Preparing
                            </button>
                          )}
                          
                          {/* STEP 2: PREPARING → Mark as Ready */}
                          {statusConfig.status === 'preparing' && (
                            <button
                              onClick={() => markOrderReady(order.id)}
                              className={`flex-1 ${statusConfig.buttonColor} text-white py-2 px-3 rounded-lg text-sm font-medium hover:opacity-90 transition`}
                            >
                              Mark as Ready
                            </button>
                          )}
                          
                          {/* STEP 3: READY → No action (waiting for pickup) */}
                          {statusConfig.status === 'ready' && (
                            <button
                              disabled
                              className={`flex-1 ${statusConfig.buttonColor} text-white py-2 px-3 rounded-lg text-sm font-medium`}
                            >
                              Ready for Pickup
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {statusConfig.status === 'pending' && 'No pending orders to prepare'}
                      {statusConfig.status === 'preparing' && 'No orders in progress'}
                      {statusConfig.status === 'ready' && 'No orders ready for pickup'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kitchen Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Kitchen Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-blue-600">
              {getOrdersByStatus('pending').length}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">
              {getOrdersByStatus('preparing').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Ready</p>
            <p className="text-2xl font-bold text-green-600">
              {getOrdersByStatus('ready').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Active</p>
            <p className="text-2xl font-bold text-gray-600">
              {activeOrdersCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}