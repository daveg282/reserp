import { useTranslation } from 'react-i18next';
import { 
  Home, ShoppingCart, Utensils, Package, Scale, 
  BarChart3, Settings, Menu, LogOut, Crown, RefreshCw 
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // ADD THIS IMPORT

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
  user, // This prop might be passed from parent, but we'll use auth context instead
  isLoading, 
  onLogout 
}) {
  const { t } = useTranslation('chef');
  const { user: authUser } = useAuth(); // GET USER FROM AUTH CONTEXT

  // Use auth context user if available, otherwise use the prop
  const currentUser = authUser || user;

  return (
    <div className={`fixed lg:static bg-gradient-to-b from-orange-900 to-orange-800 text-white transition-all duration-300 h-full z-50 ${
      sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
    } flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-orange-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Kitchen POS</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-orange-700 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
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
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'hover:bg-orange-700 text-orange-100'
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
      <div className="p-4 border-t border-orange-700 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          {sidebarOpen && currentUser && (
            <div className="flex-1">
              <p className="font-semibold text-sm truncate">
                {currentUser.name || currentUser.email || 'Chef'}
              </p>
              <p className="text-xs text-orange-300 truncate">
                {currentUser.role ? `${currentUser.role} • ` : ''}
                {currentUser.email || 'chef@restaurant.com'}
              </p>
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
            <span className="text-sm">
              {isLoading ? t('common.loggingOut') : t('common.logout')}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}