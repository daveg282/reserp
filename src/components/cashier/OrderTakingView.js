'use client';
import { ShoppingCart, Bell, CheckCircle, DollarSign, Clock, X } from 'lucide-react';
import StatCard from './StatCard';
import MenuItemCard from './MenuItemCard';
import CartSummary from './CartSummary';

export default function OrderTakingView({
  orders,
  getAvailablePagers,
  todaySales,
  menuItems,
  categories,
  activeCategory,
  setActiveCategory,
  popularItems,
  filteredItems,
  addToCart,
  currentOrder,
  setCurrentOrder,
  cart,
  removeFromCart,
  cartTotal,
  placeOrder,
  clearCart,
  tables
}) {
  const stats = [
    {
      value: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
      label: 'Active Orders',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      value: getAvailablePagers(),
      label: 'Pagers Available',
      icon: Bell,
      color: 'green'
    },
    {
      value: orders.filter(o => o.status === 'ready').length,
      label: 'Ready for Pickup',
      icon: CheckCircle,
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Menu</h3>
              
              {/* Category Navigation */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 lg:px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium text-sm flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Items */}
            {activeCategory === 'All' && (
              <div className="mb-6 lg:mb-8">
                <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Popular Items</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {popularItems.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4 hover:shadow-md transition">
                      <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl lg:text-2xl">{item.image}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                          <p className="text-blue-600 font-bold text-sm lg:text-base">ETB {item.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-8 lg:py-12 bg-white rounded-xl lg:rounded-2xl border">
                <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🍽️</div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 text-sm lg:text-base">Try adjusting your search or select a different category</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info & Cart Summary */}
        <div className="lg:col-span-1">
         <CartSummary
  currentOrder={currentOrder}
  setCurrentOrder={setCurrentOrder}
  cart={cart}
  removeFromCart={removeFromCart}
  cartTotal={cartTotal}
  placeOrder={placeOrder}  // This function expects a customerName parameter
  clearCart={clearCart}
  tables={tables}
/>
        </div>
      </div>
    </div>
  );
}