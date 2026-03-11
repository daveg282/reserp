'use client';
import { ShoppingCart, Bell, CheckCircle, Plus, Minus } from 'lucide-react';
import StatCard from './StatCard';
import CartSummary from './CartSummary';

const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name === 'all') return '🍴';
  if (name.includes('starter') || name.includes('appetizer') || name.includes('soup')) return '🥗';
  if (name.includes('main') || name.includes('course') || name.includes('entree')) return '🍽️';
  if (name.includes('drink') || name.includes('beverage') || name.includes('juice') || name.includes('coffee') || name.includes('tea')) return '🥤';
  if (name.includes('dessert') || name.includes('sweet') || name.includes('cake') || name.includes('pastry')) return '🍰';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('burger') || name.includes('sandwich')) return '🍔';
  if (name.includes('pasta') || name.includes('noodle')) return '🍝';
  if (name.includes('salad')) return '🥙';
  if (name.includes('grill') || name.includes('bbq') || name.includes('meat')) return '🥩';
  if (name.includes('seafood') || name.includes('fish')) return '🐟';
  if (name.includes('vegan') || name.includes('veggie') || name.includes('vegetarian')) return '🌱';
  if (name.includes('breakfast') || name.includes('brunch')) return '🍳';
  if (name.includes('snack') || name.includes('side') || name.includes('extra')) return '🍟';
  if (name.includes('alcohol') || name.includes('wine') || name.includes('beer')) return '🍷';
  return '🍴';
};

const getItemIcon = (item) => item.image || getCategoryIcon(item.category);

export default function OrderTakingView({
  orders,
  getAvailablePagers,
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
    { value: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, label: 'Active Orders', icon: ShoppingCart, color: 'blue' },
    { value: getAvailablePagers(), label: 'Pagers Available', icon: Bell, color: 'green' },
    { value: orders.filter(o => o.status === 'ready').length, label: 'Ready for Pickup', icon: CheckCircle, color: 'amber' }
  ];

  const getCartQty = (itemId) => cart.find(i => i.id === itemId)?.quantity || 0;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
        {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
        {/* Menu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-5">

            {/* Header + Category pills */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Menu</h3>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide w-full sm:w-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-sm flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="text-base leading-none">{getCategoryIcon(category)}</span>
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* All Menu Items */}
            <div className="space-y-3">
              {filteredItems.map(item => {
                const qty = getCartQty(item.id);
                return (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition hover:shadow-sm ${item.available ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {getItemIcon(item)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h5>
                        {item.popular && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">⭐ Popular</span>}
                        {!item.available && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Unavailable</span>}
                      </div>
                      {item.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-600 font-bold text-sm">ETB {item.price}</span>
                        <span className="text-xs text-gray-400">{getCategoryIcon(item.category)} {item.category}</span>
                      </div>
                    </div>

                    {/* Add/qty controls */}
                    <div className="flex-shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 bg-black rounded-full flex items-center justify-center"><Minus size={14} /></button>
                          <span className="font-bold text-black text-sm w-4 text-center">{qty}</span>
                          <button onClick={() => addToCart(item)} disabled={!item.available} className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center disabled:bg-gray-300"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-base font-semibold text-gray-900 mb-1">No items found</p>
                <p className="text-gray-500 text-sm">Try a different category</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <CartSummary
            currentOrder={currentOrder}
            setCurrentOrder={setCurrentOrder}
            cart={cart}
            removeFromCart={removeFromCart}
            cartTotal={cartTotal}
            placeOrder={placeOrder}
            clearCart={clearCart}
            tables={tables}
          />
        </div>
      </div>
    </div>
  );
}