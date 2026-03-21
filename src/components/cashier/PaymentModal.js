'use client';
import { X, CreditCard, Smartphone, Wallet, Info } from 'lucide-react';

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

  // ─── VAT CALCULATION (prices are VAT-inclusive) ───────────────────────────
  // Back-calculate net and VAT — do NOT add 15% on top of an already-inclusive price
  const vatInclusiveTotal = parseFloat(orderTotal);
  const netAmount         = vatInclusiveTotal / 1.15;        // pre-VAT base
  const vatAmount         = vatInclusiveTotal - netAmount;   // component already inside price
  const tipAmount         = parseFloat(paymentData.tip) || 0;
  const totalToPay        = vatInclusiveTotal + tipAmount;   // VAT already baked in
  // ─────────────────────────────────────────────────────────────────────────

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Wallet, color: 'bg-green-100 text-green-600' },
    { value: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
    { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleMethodChange = (methodValue) => {
    setPaymentData(prev => ({ ...prev, payment_method: methodValue }));
  };

  const handleTipInputChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPaymentData(prev => ({ ...prev, tip: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto my-4">
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

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-4">

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900">Order #{orderNumber}</p>
              <p className="text-sm text-gray-600 mt-1">{customerName}</p>
              {pagerNumber && (
                <p className="text-sm text-gray-600">Pager #{pagerNumber}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="text-black">
              <label className="block text-sm font-medium mb-3">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleMethodChange(method.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                        paymentData.payment_method === method.value
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
              {!paymentData.payment_method && (
                <p className="text-red-500 text-sm mt-2">Please select a payment method</p>
              )}
            </div>

            {/* VAT Breakdown */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-black">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-gray-900">Tax Breakdown</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Net Amount (excl. VAT):</span>
                  <span className="font-medium">{netAmount.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (15%) <em className="text-xs text-gray-400">incl. in price</em>:</span>
                  <span className="font-medium">{vatAmount.toFixed(2)} ETB</span>
                </div>
                <div className="border-t border-yellow-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-black">
                    <span>Order Total (VAT inclusive):</span>
                    <span className="text-blue-600">{vatInclusiveTotal.toFixed(2)} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="text-black">
              <label className="block text-sm font-medium mb-2">Tip (optional)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={paymentData.tip || ''}
                onChange={handleTipInputChange}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payment Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border text-black border-blue-200">
              <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Total (VAT incl.):</span>
                  <span className="font-medium">{vatInclusiveTotal.toFixed(2)} ETB</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tip:</span>
                    <span className="font-medium">+ {tipAmount.toFixed(2)} ETB</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {paymentData.payment_method || 'Not selected'}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total to Pay:</span>
                    <span className="text-blue-600">{totalToPay.toFixed(2)} ETB</span>
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
                disabled={!paymentData.payment_method}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  paymentData.payment_method
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete Payment
              </button>
            </div>

            {/* Tax Note */}
            <div className="text-xs text-gray-500 text-center pt-2">
              <p>Prices are VAT-inclusive at the standard Ethiopian rate of 15%.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}