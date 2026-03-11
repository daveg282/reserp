'use client';

const orderStatuses = [
  {
    status: 'pending',
    title: 'Pending Orders',
    headerColor: 'bg-blue-600',
    cardColor: 'bg-blue-50 border-blue-200',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    emptyText: 'No pending orders'
  },
  {
    status: 'preparing',
    title: 'In Progress',
    headerColor: 'bg-amber-500',
    cardColor: 'bg-amber-50 border-amber-200',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    emptyText: 'No orders in progress'
  },
  {
    status: 'ready',
    title: 'Ready for Pickup',
    headerColor: 'bg-green-600',
    cardColor: 'bg-green-50 border-green-200',
    buttonColor: 'bg-gray-400 cursor-not-allowed',
    emptyText: 'No orders ready yet'
  }
];

// An item is "new" if it was created more than 30s after the order itself
const isNewItem = (item, orderTime) => {
  if (!item.createdAt || !orderTime) return false;
  const itemTime = new Date(item.createdAt).getTime();
  const orderCreated = new Date(orderTime).getTime();
  return itemTime - orderCreated > 30000;
};

export default function KitchenOrdersView({ 
  orders = [],
  markOrderPreparing,
  markOrderReady,
  isLoading,
  error,
  onRefresh 
}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const getOrdersByStatus = (status) => safeOrders.filter(o => o?.status === status);
  const activeOrdersCount = safeOrders.filter(o =>
    o?.status === 'pending' || o?.status === 'preparing'
  ).length;

  const getOrderItems = (order) => {
    if (!order) return [];
    if (order.items && Array.isArray(order.items)) return order.items;
    if (order.rawOrder?.items) return order.rawOrder.items;
    return [];
  };

  const getItemName = (item) =>
    item?.item_name || item?.name || `Item ${item?.id || ''}`;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <button onClick={onRefresh} className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded">
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
            {activeOrdersCount} active order{activeOrdersCount !== 1 ? 's' : ''} to prepare
          </div>
          <button
            onClick={onRefresh}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {orderStatuses.map((statusConfig) => {
          const statusOrders = getOrdersByStatus(statusConfig.status);

          return (
            <div key={statusConfig.status} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className={`${statusConfig.headerColor} px-5 py-3 flex items-center justify-between`}>
                <h4 className="font-bold text-white text-base">{statusConfig.title}</h4>
                <span className="bg-white/20 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
                  {statusOrders.length}
                </span>
              </div>

              <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
                {statusOrders.length > 0 ? (
                  statusOrders.map(order => {
                    const orderItems = getOrderItems(order);
                    const hasNewItems = !!order.hasNewItems;

                    return (
                      <div
                        key={order.id}
                        className={`border rounded-xl p-4 transition-all ${
                          hasNewItems
                            ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300'
                            : statusConfig.cardColor
                        }`}
                      >
                        {/* New items badge */}
                        {hasNewItems && (
                          <div className="flex items-center gap-1.5 mb-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                            ⚠️ New items added — needs re-preparing
                          </div>
                        )}

                        {/* Order header */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-bold text-gray-900 text-sm">
                              Order #{order.orderNumber || order.id}
                            </h5>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                              <span className="text-xs text-gray-500">
                                🪑 Table {order.tableNumber || 'N/A'}
                              </span>
                              <span className="text-gray-300 text-xs">·</span>
                             
                              {order.waiterName && (
                                <>
                                  <span className="text-gray-300 text-xs">·</span>
                                  <span className="text-xs text-blue-600 font-medium">
                                     {order.waiterName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-xs text-gray-500 block font-medium">
                              {order.orderTime
                                ? new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '--:--'}
                            </span>
                            {order.total && (
                              <span className="text-xs text-gray-400">
                                ETB {parseFloat(order.total).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="mb-4 bg-white/60 rounded-lg p-2.5 border border-white">
                          {orderItems.length > 0 ? (
                            <ul className="space-y-1.5">
                              {orderItems.map((item, idx) => {
                                const itemIsNew = hasNewItems && isNewItem(item, order.orderTime);
                                return (
                                  <li
                                    key={idx}
                                    className={`flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 ${
                                      itemIsNew
                                        ? 'bg-amber-100 border border-amber-300'
                                        : ''
                                    }`}
                                  >
                                    <div className="flex items-start gap-1.5 min-w-0">
                                      {itemIsNew && (
                                        <span className="text-amber-600 text-xs font-bold flex-shrink-0 mt-0.5">NEW</span>
                                      )}
                                      <span className="text-sm text-gray-800 font-medium">
                                        {item.quantity || 1}× {getItemName(item)}
                                      </span>
                                    </div>
                                    {item.specialInstructions && (
                                      <span className="text-xs text-amber-700 text-right flex-shrink-0 max-w-28 truncate">
                                        ⚠ {item.specialInstructions}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 text-center py-1">No items</p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {statusConfig.status === 'pending' && (
                            <button
                              onClick={() => markOrderPreparing(order.id)}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition"
                            >
                              Start Preparing
                            </button>
                          )}

                          {statusConfig.status === 'preparing' && !hasNewItems && (
                            <button
                              onClick={() => markOrderReady(order.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition"
                            >
                              Mark as Ready
                            </button>
                          )}

                          {statusConfig.status === 'preparing' && hasNewItems && (
                            <button
                              onClick={() => markOrderPreparing(order.id)}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-bold transition"
                            >
                              ⚠️ Re-prepare with new items
                            </button>
                          )}

                          {statusConfig.status === 'ready' && hasNewItems && (
                            <button
                              onClick={() => markOrderPreparing(order.id)}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-bold transition"
                            >
                              ⚠️ Re-prepare with new items
                            </button>
                          )}

                          {statusConfig.status === 'ready' && !hasNewItems && (
                            <button
                              disabled
                              className="flex-1 bg-gray-200 text-gray-400 cursor-not-allowed py-2 px-3 rounded-lg text-sm font-medium"
                            >
                              Awaiting Pickup
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm">{statusConfig.emptyText}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Kitchen Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-blue-600">{getOrdersByStatus('pending').length}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">{getOrdersByStatus('preparing').length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Ready</p>
            <p className="text-2xl font-bold text-green-600">{getOrdersByStatus('ready').length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Active</p>
            <p className="text-2xl font-bold text-gray-600">{activeOrdersCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}