'use client';
import { getStatusColor } from '../../utils/helpers';

export default function BillingView({ orders, setSelectedOrder, processPayment }) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">Billing & Payments</h3>
      </div>

      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Pager</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.orderNumber}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">#{order.pagerNumber}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <p className="font-bold text-gray-900 text-sm lg:text-base">{order.total.toFixed(2)} ETB</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex space-x-1 lg:space-x-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                      >
                        View
                      </button>
                      {order.paymentStatus === 'pending' && (
                        <button 
                          onClick={() => processPayment(order)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                        >
                          Process Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}