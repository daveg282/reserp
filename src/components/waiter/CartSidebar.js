import { X, ShoppingCart, Plus, Minus, Loader2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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
  const [customerName, setCustomerName] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      setShowCart(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
      ></div>
      
      {/* Cart Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedTable ? `${t('table')} ${selectedTable.number}` : t('cart.title')}
                  </h2>
                  {selectedTable && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedTable.status === 'available' ? 'bg-green-100 text-green-700' :
                        selectedTable.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                        selectedTable.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {selectedTable.customers || 0} {t('customers', 'customers')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => !isLoading && setShowCart(false)}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Empty Cart State */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{t('cart.emptyTitle')}</h3>
              <p className="text-gray-600 text-center mb-6 text-sm">
                {t('cart.emptyDescription')}
              </p>
              <button
                onClick={() => !isLoading && setShowCart(false)}
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cart.browseMenu')}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Customer Name Input */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      {t('cart.customerName', 'Customer Name')}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('cart.customerNamePlaceholder', 'Enter customer name (optional)')}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-black bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                          <p className="text-gray-600 text-xs">ETB {item.price.toFixed(2)} {t('cart.each')}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => !isLoading && removeFromCart(item.id)}
                            disabled={isLoading}
                            className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          
                          <span className="font-semibold text-gray-900 w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => !isLoading && addToCart(item)}
                            disabled={isLoading}
                            className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          {t('cart.specialInstructions')}
                        </label>
                        <textarea
                          value={item.specialInstructions}
                          onChange={(e) => !isLoading && updateInstructions(item.id, e.target.value)}
                          placeholder={t('cart.instructionsPlaceholder')}
                          rows="2"
                          disabled={isLoading}
                          className="w-full px-3 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-600">{t('cart.itemTotal')}</span>
                        <span className="font-semibold text-gray-900 text-sm">
                          ETB {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-6 space-y-5 bg-white">
                {/* Total Amount */}
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-900 font-semibold">{t('cart.totalAmount')}</span>
                  <div className="text-right">
                    <span className="text-gray-900 font-bold text-lg">ETB {cartTotal.toFixed(2)}</span>
                    <p className="text-xs text-gray-500 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={() => placeOrder(customerName)}
                  disabled={!selectedTable || isLoading}
                  className={`w-full py-4 rounded-lg font-semibold text-sm shadow transition-colors ${
                    selectedTable && !isLoading
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => !isLoading && clearCart()}
                    disabled={isLoading}
                    className="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('cart.clearCart')}
                  </button>
                  
                  <button
                    onClick={() => !isLoading && setShowCart(false)}
                    disabled={isLoading}
                    className="bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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