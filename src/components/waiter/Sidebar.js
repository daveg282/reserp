import { Menu, Users, Utensils, ShoppingCart, BarChart3, Settings, Crown, LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context'; // ADD THIS IMPORT

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeView, 
  setActiveView,
  orders,
  handleLogout, // ADD THIS PROP
  isLoading // ADD THIS PROP
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth(); // ADD THIS TO GET USER INFO

  const menuItemsList = [
    { id: 'tables', icon: Users, label: t('tables'), view: 'tables' },
    { id: 'menu', icon: Utensils, label: t('menu'), view: 'menu' },
    { id: 'orders', icon: ShoppingCart, label: t('activeOrders'), badge: orders.filter(order => order.status !== 'completed').length, view: 'orders' },
    { id: 'reports', icon: BarChart3, label: t('reports'), view: 'reports' },
    { id: 'settings', icon: Settings, label: t('settings'), view: 'settings' },
  ];

  // Use the handleLogout function passed from parent
  const onLogout = async () => {
    if (handleLogout) {
      await handleLogout();
    }
  };

  // Get user info from auth context
  const userName = user?.name || 'Waiter';
  const userEmail = user?.email || 'waiter@example.com';
  const userRole = user?.role || 'Waiter';

  return (
    <div className={`fixed lg:static bg-gradient-to-b from-green-900 to-green-800 text-white transition-all duration-300 h-full z-50 ${
      sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
    } flex flex-col`}>
      <div className="p-4 lg:p-6 border-b border-green-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Waiter POS</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-green-700 rounded-lg transition">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItemsList.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.view);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeView === item.view 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'hover:bg-green-700 text-green-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-700 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-gray-300 truncate">{userRole}</p>
            </div>
          )}
        </div>
        
        {sidebarOpen && (
          <button
            onClick={onLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="text-sm">{isLoading ? t('loggingOut') || 'Logging out...' : t('logout') || 'Logout'}</span>
          </button>
        )}
      </div>
    </div>
  );
}