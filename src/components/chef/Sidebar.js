import { useTranslation } from 'react-i18next';
import { 
  Home, ShoppingCart, Utensils, Package, Scale, 
  BarChart3, Settings, Menu, LogOut, Users, RefreshCw, X
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/auth-utils';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'dashboard.title', view: 'dashboard' },
  { id: 'orders', icon: ShoppingCart, label: 'orders.title', view: 'orders' },
  { id: 'stations', icon: Utensils, label: 'stations.title', view: 'stations' },
  { id: 'inventory', icon: Package, label: 'inventory.title', view: 'inventory' },
  { id: 'ingredients', icon: Scale, label: 'ingredients.title', view: 'ingredients' },
  { id: 'reports', icon: BarChart3, label: 'reports.title', view: 'reports' },
  { id: 'settings', icon: Settings, label: 'settings.title', view: 'settings' },
];

export default function ChefSidebar({ 
  activeView, 
  setActiveView, 
  sidebarOpen, 
  setSidebarOpen, 
  user,
  isLoading, 
  onLogout 
}) {
  const { t } = useTranslation('chef');
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('chef-sidebar');
      const menuToggle = document.getElementById('chef-menu-toggle');
      
      if (window.innerWidth < 1024 && 
          sidebar && 
          !sidebar.contains(event.target) && 
          menuToggle && 
          !menuToggle.contains(event.target) && 
          sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Use auth context user if available, otherwise use the prop
  const currentUser = authUser || user;
  const userName = currentUser?.username || 'Chef';
  const userEmail = currentUser?.email || 'chef@restaurant.com';
  const userRole = currentUser?.role ? `${currentUser.role}` : 'Chef';

  // Handle logout with token removal
  const handleLogout = async () => {
    try {
      // If onLogout prop is provided, use it
      if (onLogout) {
        await onLogout();
        return;
      }
      
      // Otherwise use the auth context logout
      if (logout) {
        await logout();
        return;
      }
      
      // If no logout function is provided, manually clear tokens
      AuthService.clearToken();
      
      // Clear any other stored data
      localStorage.removeItem('chef_session');
      localStorage.removeItem('kitchen_token');
      sessionStorage.clear();
      
      // Redirect to login
      router.push('/chef/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if there's an error
      AuthService.clearToken();
      localStorage.removeItem('chef_session');
      sessionStorage.clear();
      router.push('/chef/login');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div 
        id="chef-sidebar"
        className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 h-full z-50 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Kitchen POS</h1>}
            <button 
              id="chef-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
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
                  <span className="flex-1 text-left font-medium">
                    {t(item.label)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            {sidebarOpen && (
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
              <span className="text-sm">
                {isLoading ? t('common.loggingOut') : t('common.logout')}
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}