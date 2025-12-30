import { X, ShoppingCart, Plus, Minus, Loader2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react'; // Add this import

export default function CartSidebar({
  cart,
  setCart,
  showCart,
  setShowCart,
  selectedTable,
  cartTotal,
  removeFromCart,
  addToCart,
  updateInstructions,
  clearCart,
  placeOrder,
  isLoading = false
}) {
  const { t } = useTranslation('waiter');
  const [customerName, setCustomerName] = useState(''); // Add state for customer name

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && setShowCart(false)}
      ></div>
      
      {/* Cart Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {selectedTable ? `${t('table')} ${selectedTable.number}` : t('cart.title')}
              </h2>
              {selectedTable && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedTable.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    selectedTable.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                    selectedTable.status === 'reserved' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedTable.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {selectedTable.customers || 0} {t('customers', 'customers')}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => !isLoading && setShowCart(false)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* Empty Cart State */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8">
              <ShoppingCart className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mb-3 lg:mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 text-center">{t('cart.emptyTitle')}</h3>
              <p className="text-gray-600 text-center mb-4 lg:mb-6 text-sm lg:text-base">
                {t('cart.emptyDescription')}
              </p>
              <button
                onClick={() => !isLoading && setShowCart(false)}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl hover:bg-green-700 transition-colors text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cart.browseMenu')}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
                {/* Customer Name Input - ADD THIS SECTION */}
                <div className="bg-blue-50 rounded-xl p-3 lg:p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 lg:mb-3">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    <label className="block text-sm lg:text-base font-medium text-gray-700">
                      {t('cart.customerName', 'Customer Name')}
                    </label>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('cart.customerNamePlaceholder', 'Enter customer name (optional)')}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4">
                    <div className="flex justify-between items-start mb-2 lg:mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</h4>
                        <p className="text-gray-600 text-xs lg:text-sm">ETB {item.price.toFixed(2)} {t('cart.each')}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 lg:space-x-3 ml-2">
                        <button
                          onClick={() => !isLoading && removeFromCart(item.id)}
                          disabled={isLoading}
                          className="w-6 h-6 lg:w-8 lg:h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                        </button>
                        
                        <span className="font-semibold text-gray-900 w-6 lg:w-8 text-center text-sm lg:text-base">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => !isLoading && addToCart(item)}
                          disabled={isLoading}
                          className="w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="mt-2 lg:mt-3">
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        {t('cart.specialInstructions')}
                      </label>
                      <textarea
                        value={item.specialInstructions}
                        onChange={(e) => !isLoading && updateInstructions(item.id, e.target.value)}
                        placeholder={t('cart.instructionsPlaceholder')}
                        rows="2"
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs lg:text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Item Total */}
                    <div className="flex justify-between items-center mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-200">
                      <span className="text-xs lg:text-sm text-gray-600">{t('cart.itemTotal')}</span>
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">
                        ETB {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-4 lg:p-6 space-y-3 lg:space-y-4">
                {/* Total Amount */}
                <div className="flex justify-between items-center text-base lg:text-lg font-semibold">
                  <span className="text-gray-900">{t('cart.totalAmount')}</span>
                  <span className="text-gray-900">ETB {cartTotal.toFixed(2)}</span>
                </div>

                {/* Place Order Button - UPDATED to pass customerName */}
                <button
                  onClick={() => placeOrder(customerName)} // Pass customerName
                  disabled={!selectedTable || isLoading}
                  className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-lg shadow-lg transition-colors relative ${
                    selectedTable && !isLoading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t('loading', 'Processing...')}
                    </div>
                  ) : (
                    selectedTable ? 
                      `${t('cart.placeOrder')} - ETB ${cartTotal.toFixed(2)}` : 
                      t('cart.selectTableFirst')
                  )}
                </button>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <button
                    onClick={() => !isLoading && clearCart()}
                    disabled={isLoading}
                    className="bg-white border border-gray-300 text-gray-700 py-2 lg:py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('cart.clearCart')}
                  </button>
                  
                  <button
                    onClick={() => !isLoading && setShowCart(false)}
                    disabled={isLoading}
                    className="bg-gray-100 text-gray-700 py-2 lg:py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('cart.continue')}
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