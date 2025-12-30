import { useTranslation } from 'react-i18next';
import { 
  ChefHat, AlertCircle, Utensils, Package, 
  RefreshCw, Clock, CheckCircle, AlertTriangle,
  Eye, List, X, ArrowRight, User, Table
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StationsView({ 
  stations = [],
  orders = [],
  setStationFilter = () => {},
  setActiveView = () => {},
  isLoading = false,
  error = null,
  onRefresh = () => {},
  user = null,
  updateItemStatus = null,
  updateOrderStatus = null,
  setSelectedOrder = null
}) {
  const { t } = useTranslation('chef');
  const [isClient, setIsClient] = useState(false);
  const [expandedStation, setExpandedStation] = useState(null);
  const [assignedStation, setAssignedStation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stationOrdersModal, setStationOrdersModal] = useState(null);

  // Set isClient after mount (for hydration)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Find the chef's assigned station
  useEffect(() => {
    if (isClient && user && stations.length > 0 && user.role === 'chef') {
      const chefStation = stations.find(station => 
        station.assigned_chef_id === user.id
      );
      setAssignedStation(chefStation || null);
    }
  }, [isClient, user, stations]);

  // Get station icon based on name
  const getStationIcon = (stationName) => {
    const name = stationName.toLowerCase();
    if (name.includes('grill') || name.includes('flame') || name.includes('bbq')) return '🔥';
    if (name.includes('pizza') || name.includes('oven')) return '🍕';
    if (name.includes('fryer') || name.includes('fried') || name.includes('fries')) return '🍟';
    if (name.includes('dessert') || name.includes('sweet') || name.includes('ice')) return '🍰';
    if (name.includes('salad') || name.includes('cold')) return '🥗';
    if (name.includes('soup') || name.includes('stew')) return '🍲';
    if (name.includes('beverage') || name.includes('bar') || name.includes('drink') || name.includes('coffee')) return '☕';
    if (name.includes('wine') || name.includes('cocktail')) return '🍷';
    if (name.includes('meat') || name.includes('steak') || name.includes('beef')) return '🥩';
    return '🍽️';
  };

  // Get orders for a specific station
  const getStationOrders = (stationName) => {
    if (!stationName || !Array.isArray(orders)) return [];
    
    const stationOrders = orders.filter(order => 
      order.items?.some(item => 
        item.station?.toLowerCase() === stationName.toLowerCase()
      )
    );
    
    // Sort by status: pending first, then preparing, then ready, then completed
    return stationOrders.sort((a, b) => {
      const statusOrder = { 'pending': 1, 'preparing': 2, 'ready': 3, 'completed': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };

  // Get station stats
  const getStationStats = (station) => {
    if (!station) return { totalOrders: 0, pendingItems: 0, preparingItems: 0, readyItems: 0 };
    
    const stationOrders = getStationOrders(station.name);
    
    const pendingItems = stationOrders.reduce((count, order) => {
      return count + order.items.filter(item => 
        item.station?.toLowerCase() === station.name.toLowerCase() && 
        item.status === 'pending'
      ).length;
    }, 0);
    
    const preparingItems = stationOrders.reduce((count, order) => {
      return count + order.items.filter(item => 
        item.station?.toLowerCase() === station.name.toLowerCase() && 
        item.status === 'preparing'
      ).length;
    }, 0);
    
    const readyItems = stationOrders.reduce((count, order) => {
      return count + order.items.filter(item => 
        item.station?.toLowerCase() === station.name.toLowerCase() && 
        item.status === 'ready'
      ).length;
    }, 0);
    
    return {
      totalOrders: stationOrders.length,
      pendingItems,
      preparingItems,
      readyItems,
      stationOrders // Include the actual orders
    };
  };

  // Toggle station expansion
  const toggleStationExpansion = (stationId) => {
    if (expandedStation === stationId) {
      setExpandedStation(null);
    } else {
      setExpandedStation(stationId);
    }
  };

  // Open station orders modal
  const openStationOrdersModal = (station) => {
    setStationOrdersModal(station);
  };

  // Close station orders modal
  const closeStationOrdersModal = () => {
    setStationOrdersModal(null);
  };

  // Handle update item status
  const handleUpdateItemStatus = (itemId, status) => {
    if (updateItemStatus) {
      updateItemStatus(itemId, status);
    }
  };

  // Handle update order status
  const handleUpdateOrderStatus = (orderId, status) => {
    if (updateOrderStatus) {
      updateOrderStatus(orderId, status);
    }
  };

  // Handle view order details in modal
  const handleViewOrderDetails = (order) => {
    if (setSelectedOrder) {
      setSelectedOrder(order);
      closeStationOrdersModal();
    }
  };

  // Format time for display
  const formatOrderTime = (orderTime) => {
    if (!isClient || !orderTime) return '--:--';
    
    try {
      const date = new Date(orderTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      return '--:--';
    }
  };

  // Calculate time since order
  const getTimeSinceOrder = (orderTime) => {
    if (!isClient || !orderTime) return '';
    
    try {
      const orderDate = new Date(orderTime);
      const now = new Date();
      const diffMinutes = Math.floor((now - orderDate) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes === 1) return '1 min ago';
      if (diffMinutes < 60) return `${diffMinutes} mins ago`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours === 1) return '1 hour ago';
      return `${diffHours} hours ago`;
    } catch (error) {
      return '';
    }
  };

  // Get station color based on workload
  const getStationColor = (stats) => {
    if (stats.pendingItems > 5) return 'bg-red-500';
    if (stats.pendingItems > 2) return 'bg-orange-500';
    if (stats.pendingItems > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get station badge color based on workload
  const getStationBadgeColor = (stats) => {
    if (stats.pendingItems > 5) return 'bg-red-100 text-red-800';
    if (stats.pendingItems > 2) return 'bg-orange-100 text-orange-800';
    if (stats.pendingItems > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Don't render anything during SSR to avoid hydration mismatches
  if (!isClient) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading && stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-lg">Loading stations...</span>
      </div>
    );
  }

  if (error && stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Stations</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalOrdersCount = stations.reduce((total, station) => total + getStationStats(station).totalOrders, 0);
  const totalPendingItems = stations.reduce((total, station) => total + getStationStats(station).pendingItems, 0);
  const totalReadyItems = stations.reduce((total, station) => total + getStationStats(station).readyItems, 0);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kitchen Stations</h1>
          <p className="text-gray-600">
            {user?.role === 'chef' && assignedStation 
              ? `Your station: ${assignedStation.name} | ${getStationStats(assignedStation).pendingItems} items pending`
              : `${stations.length} stations | ${totalOrdersCount} active orders`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            disabled={isLoading || actionLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Chef's Assigned Station Banner */}
      {user?.role === 'chef' && assignedStation && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-800">Your Assigned Station</h3>
              <p className="text-gray-600">
                You are working at <strong>{assignedStation.name}</strong>. 
                You have {getStationStats(assignedStation).pendingItems} pending items to prepare.
              </p>
            </div>
            <button
              onClick={() => openStationOrdersModal(assignedStation)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex-shrink-0"
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-gray-800">{stations.length}</p>
            </div>
            <div className="text-2xl">🏪</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrdersCount}</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Items</p>
              <p className="text-2xl font-bold text-yellow-600">{totalPendingItems}</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ready Items</p>
              <p className="text-2xl font-bold text-green-600">{totalReadyItems}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Kitchen Stations</h2>
          <span className="text-sm text-gray-500">{stations.length} stations</span>
        </div>
        
        {stations.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Stations Configured</h3>
            <p className="text-gray-500">No kitchen stations have been set up yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {stations.map((station) => {
              const stats = getStationStats(station);
              const isExpanded = expandedStation === station.id;
              const stationBadgeColor = getStationBadgeColor(stats);
              
              return (
                <div 
                  key={station.id}
                  className={`bg-white rounded-xl shadow-lg border overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:shadow-md'
                  }`}
                >
                  {/* Station Header - Clickable to expand */}
                  <div 
                    className="p-4 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleStationExpansion(station.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getStationColor(stats)} text-white`}>
                          {getStationIcon(station.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{station.name}</h3>
                          <p className="text-sm text-gray-500">{station.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${stationBadgeColor}`}>
                        {stats.pendingItems} pending
                      </span>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Total Orders</p>
                        <p className="font-bold text-gray-800">{stats.totalOrders}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500">In Progress</p>
                        <p className="font-bold text-blue-600">{stats.preparingItems}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-500">Ready</p>
                        <p className="font-bold text-green-600">{stats.readyItems}</p>
                      </div>
                    </div>
                  </div>

                  {/* Station Details (Always visible) */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{station.menu_item_count || 0} menu items</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openStationOrdersModal(station);
                        }}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                      >
                        <List className="w-4 h-4" />
                        View Orders ({stats.stationOrders.length})
                      </button>
                    </div>
                  </div>

                  {/* Expanded Orders Preview */}
                  {isExpanded && (
                    <div className="animate-slideDown">
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-700">Recent Orders</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openStationOrdersModal(station);
                            }}
                            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                          >
                            View All {stats.stationOrders.length} Orders
                          </button>
                        </div>
                        
                        {stats.stationOrders.length === 0 ? (
                          <div className="text-center py-4">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-gray-500">No current orders</p>
                            <p className="text-sm text-gray-400">All caught up!</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {stats.stationOrders.slice(0, 3).map((order) => (
                              <div 
                                key={order.id}
                                className="bg-white border rounded-lg p-3 hover:shadow-sm cursor-pointer"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium text-sm text-gray-800">Order #{order.orderNumber}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Table className="w-3 h-3" />
                                        <span>Table {order.tableNumber}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="w-3 h-3" />
                                        <span>{order.waiterName}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs mt-2">
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{getTimeSinceOrder(order.orderTime)}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewOrderDetails(order);
                                    }}
                                    className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1"
                                  >
                                    Details
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="p-4 border-t">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openStationOrdersModal(station);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          <List className="w-4 h-4" />
                          View All {stats.stationOrders.length} Orders
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Station Orders Modal */}
      {stationOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl ${getStationColor(getStationStats(stationOrdersModal))}`}>
                    {getStationIcon(stationOrdersModal.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{stationOrdersModal.name} Station</h2>
                    <p className="text-gray-600">{stationOrdersModal.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeStationOrdersModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-xl font-bold text-gray-800">{getStationStats(stationOrdersModal).totalOrders}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border">
                  <p className="text-sm text-gray-500">Pending Items</p>
                  <p className="text-xl font-bold text-blue-600">{getStationStats(stationOrdersModal).pendingItems}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-xl font-bold text-yellow-600">{getStationStats(stationOrdersModal).preparingItems}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border">
                  <p className="text-sm text-gray-500">Ready</p>
                  <p className="text-xl font-bold text-green-600">{getStationStats(stationOrdersModal).readyItems}</p>
                </div>
              </div>
            </div>
            
            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-6">
              {getStationStats(stationOrdersModal).stationOrders.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Active Orders</h3>
                  <p className="text-gray-500">All orders for this station are completed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getStationStats(stationOrdersModal).stationOrders.map((order) => {
                    const stationItems = order.items.filter(item => 
                      item.station?.toLowerCase() === stationOrdersModal.name.toLowerCase()
                    );
                    
                    return (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        {/* Order Header */}
                        <div className="p-4 bg-gray-50 border-b">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-4 mb-2">
                                <span className="font-bold text-lg text-gray-800">Order #{order.orderNumber}</span>
                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Table className="w-4 h-4" />
                                  <span>Table {order.tableNumber}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{order.waiterName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatOrderTime(order.orderTime)}</span>
                                  <span className="text-gray-400">({getTimeSinceOrder(order.orderTime)})</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                            >
                              <Eye className="w-4 h-4" />
                              Full Details
                            </button>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="p-4">
                          <h4 className="font-medium text-gray-700 mb-3">Items for this station:</h4>
                          <div className="space-y-3">
                            {stationItems.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    item.status === 'pending' ? 'bg-yellow-500' :
                                    item.status === 'preparing' ? 'bg-blue-500' :
                                    item.status === 'ready' ? 'bg-green-500' :
                                    'bg-gray-500'
                                  }`} />
                                  <div>
                                    <p className="font-medium text-gray-800">{item.quantity}x {item.name}</p>
                                    {item.specialRequest && (
                                      <p className="text-sm text-gray-500 mt-1">Note: {item.specialRequest}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                                    {item.status}
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleUpdateItemStatus(item.id, 'preparing')}
                                      disabled={item.status === 'preparing' || item.status === 'ready'}
                                      className={`px-2 py-1 text-xs rounded ${
                                        item.status === 'preparing' 
                                          ? 'bg-blue-500 text-white' 
                                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                      }`}
                                    >
                                      Start
                                    </button>
                                    <button
                                      onClick={() => handleUpdateItemStatus(item.id, 'ready')}
                                      disabled={item.status === 'ready'}
                                      className={`px-2 py-1 text-xs rounded ${
                                        item.status === 'ready' 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      Ready
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Order Actions */}
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {stationItems.length} item{stationItems.length !== 1 ? 's' : ''} for this station
                            </div>
                            <div className="flex gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                  Start All Items
                                </button>
                              )}
                              {order.status === 'preparing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  Mark All Ready
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {getStationStats(stationOrdersModal).stationOrders.length} active orders
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button
                    onClick={closeStationOrdersModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}