'use client';
import { useState } from 'react';
import { Eye, DollarSign, User, Utensils, Clock, X, CheckCircle, RefreshCw } from 'lucide-react';

export default function BillingView({ 
  orders, 
  setSelectedOrder, 
  processPayment,
  isLoading,
  error,
  onRefresh 
}) {
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const billingOrders = orders.filter(order => {
    const paymentStatus = order.payment_status || order.paymentStatus || 'pending';
    const isPaid = paymentStatus === 'paid';
    const isReadyForBilling =
      (order.status === 'completed' || order.status === 'served' || order.status === 'ready') && !isPaid;
    return isReadyForBilling;
  });

  const getOrderTotal   = (o) => parseFloat(o.rawOrder?.total_amount || o.total || o.total_amount || o.amount || 0);
  const getOrderItems   = (o) => (o.items?.length ? o.items : o.rawOrder?.items) || [];
  const getTableInfo    = (o) => o.tableNumber ? `Table ${o.tableNumber}` : o.table_number ? `Table ${o.table_number}` : o.rawOrder?.table_number ? `Table ${o.rawOrder.table_number}` : 'Takeaway';
  const getCustomerName = (o) => o.customerName || o.customer_name || o.rawOrder?.customer_name || 'Walk-in Customer';
  const getOrderNumber  = (o) => o.orderNumber || o.order_number || o.rawOrder?.order_number || `#${o.id}`;
  const getPaymentStatus = (o) => o.payment_status || o.paymentStatus || 'pending';
  const getOrderTime    = (o) => {
    const d = o.orderTime || o.created_at || o.rawOrder?.created_at;
    return d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  };

  const viewOrderDetails = (order) => {
    setSelectedOrderDetails(orders.find(o => o.id === order.id) || order);
    setShowOrderModal(true);
  };

  const handleProcessPayment = (order) => {
    setSelectedOrder(order);
    processPayment(order);
  };

  if (error) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg"><X className="h-5 w-5 text-red-600" /></div>
        <div className="flex-1">
          <p className="text-red-700 font-medium">Failed to load billing data</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button onClick={onRefresh} className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-500 text-sm mt-0.5">Process payments for completed orders</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium text-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Sub-header */}
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pending Payments</h3>
            <span className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{billingOrders.length}</span> awaiting payment</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-gray-500 text-sm">Loading billing data...</p>
            </div>
          ) : billingOrders.length === 0 ? (
            <div className="py-14 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full mb-3">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">No pending payments. All completed orders have been processed.</p>
              <button onClick={onRefresh} className="mt-4 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition">
                Check for new orders
              </button>
            </div>
          ) : (
            <>
              {/* ── Mobile / small desktop: card list ──────────────────── */}
              <div className="lg:hidden divide-y divide-gray-100">
                {billingOrders.map(order => {
                  const orderTotal = getOrderTotal(order);
                  const isPaid = getPaymentStatus(order) === 'paid';
                  return (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">#{getOrderNumber(order)}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{getOrderTime(order)}</span>
                          </div>
                        </div>
                        <span className="text-base font-bold text-blue-600 flex-shrink-0">
                          ETB {orderTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />{getCustomerName(order)}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1">
                          <Utensils className="h-3 w-3" />{getTableInfo(order)}
                        </span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full font-semibold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        {!isPaid && (
                          <button
                            onClick={() => handleProcessPayment(order)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Process Payment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Large desktop: table ────────────────────────────────── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order #', 'Customer', 'Table', 'Amount', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {billingOrders.map(order => {
                      const orderTotal = getOrderTotal(order);
                      const isPaid = getPaymentStatus(order) === 'paid';
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900 text-sm">#{getOrderNumber(order)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{getOrderTime(order)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{getCustomerName(order)}</p>
                                <p className="text-xs text-gray-400">{isPaid ? 'Paid' : 'Payment pending'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                              <Utensils className="h-3.5 w-3.5 text-gray-600" />
                              <span className="font-medium text-gray-900 text-sm">{getTableInfo(order)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 text-base">{orderTotal.toFixed(2)} ETB</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => viewOrderDetails(order)}
                                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition"
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                              {!isPaid && (
                                <button
                                  onClick={() => handleProcessPayment(order)}
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                                >
                                  <DollarSign className="h-4 w-4" /> Process Payment
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
            </>
          )}
        </div>
      </div>

      {/* ── Order Details Modal ──────────────────────────────────── */}
      {showOrderModal && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Modal header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Order #{getOrderNumber(selectedOrderDetails)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{getOrderTime(selectedOrderDetails)}</span>
                    <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5" />{getTableInfo(selectedOrderDetails)}</span>
                  </div>
                </div>
                <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Customer + Payment status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-lg p-3 border flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><User className="h-4 w-4 text-blue-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900 text-sm">{getCustomerName(selectedOrderDetails)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-4 w-4 text-green-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      getPaymentStatus(selectedOrderDetails) === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {getPaymentStatus(selectedOrderDetails) === 'paid' ? <CheckCircle className="h-3 w-3" /> : <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />}
                      {getPaymentStatus(selectedOrderDetails) === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Order Items</h3>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {getOrderItems(selectedOrderDetails).length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {getOrderItems(selectedOrderDetails).length > 0 ? (
                    getOrderItems(selectedOrderDetails).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border flex-shrink-0">
                            <span className="text-base">{item.emoji || '🍽️'}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{item.name || `Item ${idx + 1}`}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1} × ETB {(item.price || 0).toFixed(2)}</p>
                            {item.special_instructions && (
                              <p className="text-xs text-blue-600 mt-0.5">Note: {item.special_instructions}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 text-sm flex-shrink-0 ml-3">
                          ETB {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-gray-500 text-sm">No items found in this order</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 flex justify-between items-center mb-5">
                <span className="font-bold text-gray-900">Total Amount</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">ETB {getOrderTotal(selectedOrderDetails).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Ethiopian Birr</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleProcessPayment(selectedOrderDetails)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
                >
                  <DollarSign className="h-4 w-4" /> Process Payment
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
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