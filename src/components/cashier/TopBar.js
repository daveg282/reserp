'use client';
import { Menu, ShoppingCart } from 'lucide-react';

export default function TopBar({
  setSidebarOpen,
  activeView,
  cart,
  setShowCart,
  todaySales
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {activeView === 'tables' && 'Order Taking'}
              {activeView === 'orders' && 'Kitchen Orders'}
              {activeView === 'pagers' && 'Pager Management'}
              {activeView === 'billing' && 'Billing & Payments'}
              {activeView === 'reports' && 'Sales Reports'}
              {activeView === 'settings' && 'System Settings'}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-blue-600 hover:bg-blue-700 text-white p-2 lg:px-4 lg:py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 lg:w-4 lg:h-4" />
            <span className="hidden lg:inline">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full text-[10px] lg:text-xs">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}