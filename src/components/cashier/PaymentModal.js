'use client';
import { X } from 'lucide-react';

export default function PaymentModal({
  showPaymentModal,
  setShowPaymentModal,
  selectedOrder,
  paymentData,
  setPaymentData,
  completePayment
}) {
  if (!showPaymentModal || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">Process Payment</h3>
          <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900 text-lg">{selectedOrder.orderNumber}</p>
            <p className="text-sm text-gray-600">{selectedOrder.customerName} • Pager #{selectedOrder.pagerNumber}</p>
            <p className="text-xl font-bold text-gray-900 mt-2">Total: {selectedOrder.total.toFixed(2)} ETB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Payment Method</label>
            <select
              value={paymentData.method}
              onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="mobile">Mobile Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip Amount</label>
            <input
              type="number"
              value={paymentData.tip}
              onChange={(e) => setPaymentData(prev => ({ ...prev, tip: parseFloat(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="0.00"
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-black">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{selectedOrder.total.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tip:</span>
              <span>{paymentData.tip.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 border-t border-blue-200 pt-2">
              <span>Total:</span>
              <span>{(selectedOrder.total + paymentData.tip).toFixed(2)} ETB</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition text-sm lg:text-base"
            >
              Cancel
            </button>
            <button
              onClick={completePayment}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm lg:text-base"
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}