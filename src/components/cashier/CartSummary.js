'use client';
import { X, UtensilsCrossed, ShoppingBag } from 'lucide-react';

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
  const isTakeaway = currentOrder?.orderType === 'takeaway';

  const setOrderType = (type) => {
    setCurrentOrder(prev => ({
      ...prev,
      orderType: type,
      tableId: type === 'takeaway' ? null : prev.tableId
    }));
  };

  const handlePlaceOrder = () => {
    const customerName = currentOrder.customerName?.trim() || 'Walk-in Customer';
    placeOrder(customerName);
  };

  const canPlace = isTakeaway ? cart.length > 0 : !!currentOrder.tableId && cart.length > 0;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky top-4">
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

      {/* ── Order Type Toggle ─────────────────────────────────── */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setOrderType('dine-in')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            !isTakeaway
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-600 hover:bg-white'
          }`}
        >
          <UtensilsCrossed size={15} />
          Dine-in
        </button>
        <button
          onClick={() => setOrderType('takeaway')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            isTakeaway
              ? 'bg-orange-500 text-white shadow'
              : 'text-gray-600 hover:bg-white'
          }`}
        >
          <ShoppingBag size={15} />
          Takeaway
        </button>
      </div>
      {/* ─────────────────────────────────────────────────────── */}

      {/* Customer Info */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name</label>
          <input
            type="text"
            value={currentOrder.customerName || ''}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Enter customer name (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
          />
        </div>

        {/* Table selector — hidden for takeaway */}
        {!isTakeaway && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Table Number</label>
            <select
              value={currentOrder.tableId || ''}
              onChange={(e) => setCurrentOrder(prev => ({
                ...prev,
                tableId: e.target.value ? parseInt(e.target.value) : null
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
            >
              <option value="">Select Table</option>
              {tables.map(table => (
                <option key={table.id} value={table.id}>
                  Table {table.number} ({table.section})
                </option>
              ))}
            </select>
          </div>
        )}

        {isTakeaway && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            <ShoppingBag size={14} className="text-orange-500 flex-shrink-0" />
            <p className="text-xs text-orange-700 font-medium">Takeaway — no table required</p>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          Cart Items ({cart.reduce((total, item) => total + item.quantity, 0)})
        </h4>
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Cart is empty</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">ETB {item.price} × {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total & Actions */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-blue-600">ETB {cartTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handlePlaceOrder}
              disabled={!canPlace}
              className={`w-full py-3 rounded-xl font-semibold text-sm shadow-md transition-colors ${
                canPlace
                  ? isTakeaway
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {!canPlace && !isTakeaway
                ? 'Select a Table First'
                : `${isTakeaway ? '📦 Takeaway' : '🪑 Place Order'} — ETB ${cartTotal.toFixed(2)}`}
            </button>

            <button
              onClick={clearCart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium text-sm transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}