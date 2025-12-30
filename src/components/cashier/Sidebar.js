'use client';
import { Menu, LogOut, RefreshCw, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // ADD AUTH CONTEXT

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeView, 
  setActiveView, 
  menuItemsList, 
  isLoading, 
  handleLogout 
}) {
  const { user } = useAuth(); // GET USER FROM CONTEXT

  // Get user info from auth context
  const userName = user?.name || 'Cashier';
  const userEmail = user?.email || 'cashier@bistroelegante.com';
  const userRole = user?.role || 'Cashier';

  return (
    <div className={`fixed lg:static bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 h-full z-50 ${
      sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
    } flex flex-col`}>
      <div className="p-4 lg:p-6 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Self-Serve POS</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg transition">
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
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-blue-700 text-blue-100'
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

      <div className="p-4 border-t border-blue-700 space-y-4"> {/* Changed border color */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          {sidebarOpen && user && ( // CHECK IF USER EXISTS
            <div className="flex-1">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-blue-300 truncate">
                  {userEmail}
              </p>
            </div>
          )}
        </div>
        
        {sidebarOpen && (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200"
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
  );
}