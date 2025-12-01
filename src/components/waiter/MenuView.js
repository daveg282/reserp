import { ArrowLeft, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MenuView({ 
  selectedTable, 
  setActiveView, 
  activeCategory, 
  setActiveCategory, 
  filteredItems, 
  popularItems, 
  addToCart 
}) {
  const { t } = useTranslation('waiter');

  // Define categories with translations
  const categories = [
    { key: 'All', label: t('menu.category.all') },
    { key: 'Starters', label: t('menu.category.starters') },
    { key: 'Main Course', label: t('menu.category.mainCourse') },
    { key: 'Drinks', label: t('menu.category.drinks') },
    { key: 'Desserts', label: t('menu.category.desserts') }
  ];

  // Category mapping for the menu item categories
  const categoryMap = {
    'Starters': t('menu.category.starters'),
    'Main Course': t('menu.category.mainCourse'),
    'Drinks': t('menu.category.drinks'),
    'Desserts': t('menu.category.desserts')
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveView('tables')}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('menu.title')}</h3>
            {selectedTable && (
              <p className="text-sm text-gray-600">{t('table')} {selectedTable.number} • {selectedTable.section}</p>
            )}
          </div>
        </div>
        
        {!selectedTable && (
          <button
            onClick={() => setActiveView('tables')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm lg:text-base"
          >
            {t('menu.selectTableFirst')}
          </button>
        )}
      </div>

      {/* Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-3 lg:px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium text-sm flex-shrink-0 ${
              activeCategory === category.key
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Popular Items */}
      {activeCategory === 'All' && (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">{t('menu.popularItems')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {popularItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl lg:text-2xl">{item.image}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                    <p className="text-green-600 font-bold text-sm lg:text-base">ETB {item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.available || !selectedTable}
                  className={`w-full py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                    item.available && selectedTable
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!selectedTable ? t('menu.selectTableFirst') : t('menu.addToCart')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition">
            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <span className="text-xl lg:text-2xl">{item.image}</span>
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-base lg:text-lg truncate">{item.name}</h4>
                    <p className="text-gray-600 text-xs lg:text-sm mb-2 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {item.price}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.preparationTime}{t('menu.preparationTime')}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {categoryMap[item.category] || item.category}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.available || !selectedTable}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                      item.available && selectedTable
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!selectedTable ? t('menu.selectTableFirst') : t('menu.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 lg:py-12 bg-white rounded-xl lg:rounded-2xl border">
          <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🍽️</div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{t('menu.noItems')}</h3>
          <p className="text-gray-600 text-sm lg:text-base">{t('menu.adjustSearch')}</p>
        </div>
      )}
    </div>
  );
}