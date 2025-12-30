'use client';

export default function CartSidebar({ 
  showCart, 
  cart, 
  cartTotal, 
  onClose, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateInstructions, 
  onClearCart, 
  onPlaceOrder 
}) {
  if (!showCart) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl slide-in">
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-light text-gray-900">Your Order</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-8xl mb-6 text-gray-300">🛒</div>
              <h3 className="text-xl font-serif text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">
                Discover our exquisite dishes and add them to your order
              </p>
              <button
                onClick={onClose}
                className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-gray-600 text-sm">ETB {item.price} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => onAddToCart(item)}
                          className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={item.specialInstructions || ''}
                        onChange={(e) => onUpdateInstructions(item.id, e.target.value)}
                        placeholder="Any special preparation requests?"
                        rows="2"
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
                      />
                    </div>

                    {/* Item Total */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Item Total</span>
                      <span className="font-semibold text-gray-900">
                        ETB {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">ETB {cartTotal}</span>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={onPlaceOrder}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg shadow-lg"
                >
                  Place Order - ETB {cartTotal}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onClearCart}
                    className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Clear Cart
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}