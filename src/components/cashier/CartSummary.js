'use client';
import { X } from 'lucide-react';

export default function CartSummary({
  currentOrder,
  setCurrentOrder,
  cart,
  removeFromCart,
  cartTotal,
  placeOrder,
  clearCart,
  tables
}) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky top-4">
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Order Summary</h3>
      
      {/* Customer Information */}
      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            value={currentOrder.customerName}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Enter customer name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Table Number (Optional)</label>
          <select
            value={currentOrder.tableId || ''}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, tableId: e.target.value ? parseInt(e.target.value) : null }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Takeaway / No Table</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>Table {table.number} ({table.section})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
        <h4 className="font-semibold text-gray-900">Cart Items ({cart.reduce((total, item) => total + item.quantity, 0)})</h4>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Cart is empty</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-600">ETB {item.price} × {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total & Actions */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 pt-4 lg:pt-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <span className="text-lg lg:text-xl font-bold text-gray-900">Total:</span>
            <span className="text-lg lg:text-xl font-bold text-blue-600">ETB {cartTotal}</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={placeOrder}
              disabled={!currentOrder.customerName}
              className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-lg shadow-lg transition-colors ${
                currentOrder.customerName
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentOrder.customerName ? `Place Order - ETB ${cartTotal}` : 'Enter Customer Name'}
            </button>
            
            <button
              onClick={clearCart}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}