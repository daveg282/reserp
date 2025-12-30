// components/admin/Sidebar.js
'use client';
import { Menu, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context'; // Add this import
import SidebarMenuItem from './SidebarMenuItem';
import { MENU_ITEMS } from '../../utils/constants';

export default function Sidebar({
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
  users,
  orders,
  tables,
  inventory
  // Remove handleLogout and isLoading from props
}) {
  const { logout, user, loading } = useAuth(); // Get auth functions

  const getBadgeCount = (view) => {
    switch (view) {
      case 'users': return users.length;
      case 'orders': return orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
      case 'tables': return tables.filter(t => t.status === 'occupied').length;
      case 'inventory': return inventory.filter(i => i.lowStock).length;
      default: return 0;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col shadow-xl`}>
        
        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Bistro Elegante</h1>
                <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
          {MENU_ITEMS.map(item => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              activeView={activeView}
              setActiveView={setActiveView}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              badgeCount={getBadgeCount(item.view)}
            />
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200 mt-4"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>{loading ? 'Logging out...' : 'Logout'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}