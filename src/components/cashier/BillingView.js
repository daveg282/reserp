'use client';
import { useState } from 'react';
import { Eye, DollarSign, User, Utensils, Clock, X, CheckCircle } from 'lucide-react';

export default function BillingView({ 
  orders, 
  setSelectedOrder, 
  processPayment,
  isLoading,
  error,
  onRefresh 
}) {
  
  // State for order details modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Filter orders for billing - only completed/served orders with pending payment
  const billingOrders = orders.filter(order => {
    const paymentStatus = order.payment_status || order.paymentStatus || 'pending';
    const isPaid = paymentStatus === 'paid';
    
    // Only show orders that are completed/served/ready AND not paid
    const isReadyForBilling = 
      (order.status === 'completed' || order.status === 'served' || order.status === 'ready') &&
      !isPaid;
    
    return isReadyForBilling;
  });

  // Helper functions
  const getOrderTotal = (order) => {
    if (order.rawOrder && order.rawOrder.total_amount) {
      return parseFloat(order.rawOrder.total_amount);
    }
    return parseFloat(order.total || order.total_amount || order.amount || 0);
  };

  const getOrderItems = (order) => {
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items;
    }
    if (order.rawOrder && order.rawOrder.items && Array.isArray(order.rawOrder.items)) {
      return order.rawOrder.items;
    }
    return [];
  };

  const getTableInfo = (order) => {
    if (order.tableNumber) return `Table ${order.tableNumber}`;
    if (order.table_number) return `Table ${order.table_number}`;
    if (order.rawOrder && order.rawOrder.table_number) return `Table ${order.rawOrder.table_number}`;
    if (order.tableId) return `Table ${order.tableId}`;
    return 'Takeaway';
  };

  const getCustomerName = (order) => {
    if (order.customerName) return order.customerName;
    if (order.customer_name) return order.customer_name;
    if (order.rawOrder && order.rawOrder.customer_name) return order.rawOrder.customer_name;
    return 'Walk-in Customer';
  };

  const getOrderNumber = (order) => {
    if (order.orderNumber) return order.orderNumber;
    if (order.order_number) return order.order_number;
    if (order.rawOrder && order.rawOrder.order_number) return order.rawOrder.order_number;
    return `#${order.id}`;
  };

  const getOrderTime = (order) => {
    const date = order.orderTime || order.created_at || order.rawOrder?.created_at;
    if (date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const getPaymentStatus = (order) => {
    return order.payment_status || order.paymentStatus || 'pending';
  };

  const viewOrderDetails = (order) => {
    const fullOrder = orders.find(o => o.id === order.id) || order;
    setSelectedOrderDetails(fullOrder);
    setShowOrderModal(true);
  };

  const handleProcessPayment = (order) => {
    setSelectedOrder(order);
    processPayment(order);
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-red-700 font-medium">Failed to load billing data</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={onRefresh}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-1">Process payments for completed orders</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-5 lg:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Pending Payments</h3>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{billingOrders.length}</span> orders awaiting payment
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading billing data...</p>
            </div>
          ) : billingOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No pending payments. All completed orders have been processed.
              </p>
              <button 
                onClick={onRefresh}
                className="mt-4 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Check for new orders
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-5 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-5 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingOrders.map(order => {
                    const orderTotal = getOrderTotal(order);
                    const paymentStatus = getPaymentStatus(order);
                    const isPaid = paymentStatus === 'paid';
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 lg:px-6 py-4 lg:py-5">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">
                              #{getOrderNumber(order)}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {getOrderTime(order)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 lg:px-6 py-4 lg:py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {getCustomerName(order)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {isPaid ? 'Paid' : 'Payment pending'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 lg:px-6 py-4 lg:py-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                            <Utensils className="h-3.5 w-3.5 text-gray-600" />
                            <span className="font-medium text-gray-900 text-sm">
                              {getTableInfo(order)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 lg:px-6 py-4 lg:py-5">
                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {orderTotal.toFixed(2)} ETB
                            </p>
                          </div>
                        </td>
                        <td className="px-5 lg:px-6 py-4 lg:py-5">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => viewOrderDetails(order)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition duration-200"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">View</span>
                            </button>
                            {!isPaid && (
                              <button 
                                onClick={() => handleProcessPayment(order)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
                              >
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Process Payment</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{getOrderNumber(selectedOrderDetails)}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {getOrderTime(selectedOrderDetails)}
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <Utensils className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {getTableInfo(selectedOrderDetails)}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Customer</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{getCustomerName(selectedOrderDetails)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Payment Status</h3>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${
                    getPaymentStatus(selectedOrderDetails) === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {getPaymentStatus(selectedOrderDetails) === 'paid' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    )}
                    <span className="font-semibold text-sm">
                      {getPaymentStatus(selectedOrderDetails) === 'paid' ? 'Paid' : 'Payment Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                    {getOrderItems(selectedOrderDetails).length} items
                  </span>
                </div>
                
                <div className="space-y-3">
                  {(() => {
                    const items = getOrderItems(selectedOrderDetails);
                    if (items.length > 0) {
                      return items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                                <span className="text-lg">{item.emoji || '🍽️'}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name || `Item ${index + 1}`}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-gray-600">Qty: {item.quantity || 1}</span>
                                  <span className="text-sm text-gray-600">× {item.price ? item.price.toFixed(2) : '0.00'} ETB</span>
                                </div>
                                {item.special_instructions && (
                                  <p className="text-xs text-blue-600 mt-2">
                                    Note: {item.special_instructions}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {((item.price || 0) * (item.quantity || 1)).toFixed(2)} ETB
                            </p>
                          </div>
                        </div>
                      ));
                    } else {
                      return (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-3">📄</div>
                          <p className="text-gray-600">No items found in this order</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Total Section */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-gray-900">Total Amount</h4>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {getOrderTotal(selectedOrderDetails).toFixed(2)} ETB
                    </p>
                    <p className="text-gray-600 text-sm">Ethiopian Birr</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => handleProcessPayment(selectedOrderDetails)}
                  className="flex-1 flex items-center justify-center gap-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200"
                >
                  <DollarSign className="h-5 w-5" />
                  Process Payment
                </button>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}