'use client';
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react';

export default function PaymentModal({
  showPaymentModal,
  setShowPaymentModal,
  selectedOrder,
  paymentData,
  setPaymentData,
  completePayment
}) {
  if (!showPaymentModal || !selectedOrder) return null;

  // Safely get order data
  const orderTotal = selectedOrder.total || selectedOrder.total_amount || selectedOrder.amount || 0;
  const orderNumber = selectedOrder.orderNumber || selectedOrder.order_number || `#${selectedOrder.id}`;
  const customerName = selectedOrder.customerName || selectedOrder.customer_name || 'Walk-in Customer';
  const pagerNumber = selectedOrder.pagerNumber || selectedOrder.pager_number;
  
  const totalAmount = parseFloat(orderTotal) + (paymentData.tip || 0);

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Wallet, color: 'bg-green-100 text-green-600' },
    { value: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
    { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-auto my-4"> {/* Changed to max-w-sm */}
        {/* Header */}
        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Process Payment</h3>
            <p className="text-sm text-gray-600">Complete payment for this order</p>
          </div>
          <button 
            onClick={() => setShowPaymentModal(false)} 
            className="ml-2 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable if needed */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-4">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900">Order #{orderNumber}</p>
              <p className="text-sm text-gray-600 mt-1">{customerName}</p>
              {pagerNumber && (
                <p className="text-sm text-gray-600">Pager #{pagerNumber}</p>
              )}
              <p className="text-xl font-bold text-blue-600 mt-2">
                Total: {parseFloat(orderTotal).toFixed(2)} ETB
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentData(prev => ({ ...prev, method: method.value }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                        paymentData.method === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${method.color} mb-2`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tip Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Amount (ETB)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentData.tip || 0}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  tip: parseFloat(e.target.value) || 0 
                }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="0.00"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[0, 50, 100, 200].map(tip => (
                  <button
                    key={`tip-${tip}`}
                    type="button"
                    onClick={() => setPaymentData(prev => ({ ...prev, tip }))}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      (paymentData.tip || 0) === tip
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tip === 0 ? 'No Tip' : `${tip} ETB`}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-medium">{parseFloat(orderTotal).toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tip:</span>
                  <span className="font-medium">{(paymentData.tip || 0).toFixed(2)} ETB</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total to Pay:</span>
                    <span className="text-blue-600">{totalAmount.toFixed(2)} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={completePayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}