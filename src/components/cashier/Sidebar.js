'use client';
import { Menu, LogOut, RefreshCw, Users, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeView, 
  setActiveView, 
  menuItemsList, 
  isLoading, 
  handleLogout 
}) {
  const { user } = useAuth();

  // Get user info from auth context
  const userName = user?.name || 'Cashier';
  const userEmail = user?.email || 'cashier@bistroelegante.com';
  const userRole = user?.role || 'Cashier';

  return (
    <>
      {/* Mobile overlay - Added from chef sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Cashier POS</h1>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-700 text-gray-100'
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

        <div className="p-4 border-t border-gray-700 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            {sidebarOpen && user && (
              <div className="flex-1">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs text-gray-300 truncate">
                    {userEmail}
                </p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm">{isLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}