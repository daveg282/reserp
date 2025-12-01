import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TopBar({ 
  activeView, 
  cart, 
  setShowCart, 
  selectedTable, 
  setSelectedTable,
  searchTerm,
  setSearchTerm,
  showSearch,
  setShowSearch
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
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
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

        <div className="flex items-center space-x-2 lg:space-x-4">
          {showSearch ? (
            <div className="lg:hidden relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchMenu')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchMenu')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48 xl:w-64"
                />
              </div>

              <button 
                onClick={() => setShowSearch(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => setShowCart(true)}
                className="relative bg-green-600 hover:bg-green-700 text-white p-2 lg:px-4 lg:py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 lg:w-4 lg:h-4" />
                <span className="hidden lg:inline">{t('cart')}</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full text-[10px] lg:text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>

              {selectedTable && (
                <div className="hidden sm:flex bg-blue-50 border border-blue-200 px-3 lg:px-4 py-2 rounded-xl">
                  <p className="text-sm font-medium text-blue-900">{t('table')} {selectedTable.number}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedTable && (
        <div className="sm:hidden mt-3 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl inline-flex items-center">
          <p className="text-sm font-medium text-blue-900">{t('table')} {selectedTable.number}</p>
          <button 
            onClick={() => setSelectedTable(null)}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}