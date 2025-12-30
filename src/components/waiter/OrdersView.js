'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Clock, User, Receipt, Package, CheckCircle, 
  AlertCircle, RefreshCw, MapPin, Calendar, Info
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';

export default function OrdersView({ 
  orders, 
  updateOrderStatus, 
  setActiveView,
  refreshOrders,
  isLoading = false 
}) {
  const { t } = useTranslation('waiter');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const getStatusTranslation = (status) => {
    const translations = {
      'pending': 'Pending',
      'preparing': 'Preparing',
      'ready': 'Ready to Serve',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return translations[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Fetch order details when modal opens
  useEffect(() => {
    if (selectedOrder && showModal) {
      fetchOrderDetails(selectedOrder.id);
    }
  }, [selectedOrder, showModal]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      setError(null);
      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await ordersAPI.getOrder(orderId, token);
      
      // Handle different response structures
      if (response.order) {
        setOrderDetails(response.order);
      } else if (response.success && response.order) {
        setOrderDetails(response.order);
      } else {
        setOrderDetails(response);
      }
      
    } catch (error) {
      console.error('❌ Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
      
      // Use basic order data if available
      if (selectedOrder?.rawOrder) {
        setOrderDetails(selectedOrder.rawOrder);
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setOrderDetails(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails(null);
    setError(null);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '--:--';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '--/--/----';
    }
  };

  const calculateTimeSince = (dateString) => {
    if (!dateString) return '';
    try {
      const orderTime = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    } catch (e) {
      return '';
    }
  };

  // Function to handle serve with confirmation
  const handleServeOrder = (orderId, orderNumber, tableNumber, customerName) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark order ${orderNumber} as served?\n\n` +
      `Table: ${tableNumber}\n` +
      `Customer: ${customerName}\n\n` +
      `Click OK to mark as served.`
    );
    
    if (confirmed) {
      updateOrderStatus(orderId, 'completed');
    }
  };

  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Active Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all ongoing orders</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                {activeOrders.length}
              </div>
              <div className="text-sm text-gray-600">Active Orders</div>
            </div>
            
            <button
              onClick={refreshOrders}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base lg:text-lg truncate">
                    {order.orderNumber}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Table {order.tableNumber}</span>
                    {order.customerName && order.customerName !== `Table ${order.tableNumber}` && (
                      <>
                        <span className="text-gray-300">•</span>
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{order.customerName}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${getStatusColor(order.status)}`}>
                  {getStatusTranslation(order.status)}
                </span>
              </div>

              {/* Order Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(order.orderTime)}</span>
                  </div>
                  <div className="font-bold text-gray-900">
                    ETB {parseFloat(order.total || 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {calculateTimeSince(order.orderTime)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {order.status === 'ready' && (
                  <button 
                    onClick={() => handleServeOrder(
                      order.id, 
                      order.orderNumber, 
                      order.tableNumber, 
                      order.customerName || `Table ${order.tableNumber}`
                    )}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Serve
                  </button>
                )}
                <button 
                  onClick={() => handleViewDetails(order)}
                  className={`${order.status === 'ready' ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2`}
                >
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeOrders.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-6">📋</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Active Orders</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            All orders are completed or there are no pending orders at the moment.
          </p>
          <button
            onClick={() => setActiveView('tables')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition shadow-lg"
          >
            Take New Order
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading orders...</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Order {selectedOrder?.orderNumber}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">Table {selectedOrder?.tableNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder?.status)}`}>
                            {getStatusTranslation(selectedOrder?.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {calculateTimeSince(selectedOrder?.orderTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-6 max-h-[calc(90vh-180px)]">
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading order details...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Failed to load details</h4>
                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => fetchOrderDetails(selectedOrder.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-6">
                    {/* Customer & Order Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Customer Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500">Customer Name</div>
                            <div className="font-medium text-gray-900 text-lg">
                              {orderDetails.customer_name || selectedOrder?.customerName || `Table ${selectedOrder?.tableNumber}`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Number of Guests</div>
                            <div className="font-medium text-gray-900">
                              {orderDetails.customer_count || selectedOrder?.customerCount || 1} people
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Order Timeline
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500">Order Time</div>
                            <div className="font-medium text-gray-900">
                              {formatTime(selectedOrder?.orderTime)} • {formatDate(selectedOrder?.orderTime)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="font-medium">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(orderDetails.status || selectedOrder?.status)}`}>
                                {getStatusTranslation(orderDetails.status || selectedOrder?.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">Order Items</h3>
                          <span className="ml-auto text-sm text-gray-500">
                            {(orderDetails.items || []).length} items
                          </span>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {(orderDetails.items || []).length > 0 ? (
                          (orderDetails.items || []).map((item, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                      <span className="text-amber-600 font-bold">{item.quantity}x</span>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{item.menu_item_name || `Item ${index + 1}`}</h4>
                                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                        <span>ETB {item.price || '0.00'} each</span>
                                        {item.special_instructions && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-600">Special instructions</span>
                                          </>
                                        )}
                                      </div>
                                      {item.special_instructions && (
                                        <p className="text-sm text-gray-600 mt-2 ml-11">
                                          "{item.special_instructions}"
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900">
                                    ETB {(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-gray-500">No items available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary - Simplified */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order Total</h3>
                          <p className="text-sm text-gray-500">Including all items</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ETB {parseFloat(orderDetails.total_amount || selectedOrder?.total || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📄</div>
                    <h4 className="font-semibold text-gray-900 mb-2">No Details Available</h4>
                    <p className="text-gray-600 text-sm">Failed to load order details</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    {selectedOrder?.status === 'ready' && (
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Are you sure you want to mark order ${selectedOrder.orderNumber} as served?\n\n` +
                            `Table: ${selectedOrder.tableNumber}\n` +
                            `Customer: ${selectedOrder.customerName || `Table ${selectedOrder.tableNumber}`}\n\n` +
                            `Click OK to mark as served.`
                          );
                          
                          if (confirmed) {
                            updateOrderStatus(selectedOrder.id, 'completed');
                            handleCloseModal();
                          }
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Served
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}