import { Menu, ShoppingCart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TopBar({ 
  activeView, 
  cart, 
  setShowCart, 
  selectedTable, 
  setSelectedTable,
  setSidebarOpen // Add this prop
}) {
  const { t } = useTranslation();

  const getViewTitle = () => {
    switch(activeView) {
      case 'tables': return t('tableManagement');
      case 'menu': return t('menuOrdering');
      case 'orders': return t('activeOrders');
      case 'reports': return t('salesReports');
      case 'settings': return t('systemSettings');
      default: return '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Updated button to open sidebar on mobile */}
          <button 
            onClick={() => setSidebarOpen(true)} // Call setSidebarOpen here
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {getViewTitle()}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{t('cart')}</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>

          {selectedTable && (
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-blue-900">{t('table')} {selectedTable.number}</p>
              <button 
                onClick={() => setSelectedTable(null)}
                className="ml-2 text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedTable && (
        <div className="sm:hidden mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm font-medium text-blue-900">{t('table')} {selectedTable.number}</p>
          </div>
          <button 
            onClick={() => setSelectedTable(null)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}