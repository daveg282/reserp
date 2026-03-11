'use client';
import { ArrowLeft, Clock, AlertCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Icon mapping by category name keywords
const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('starter') || name.includes('appetizer') || name.includes('soup')) return '🥗';
  if (name.includes('main') || name.includes('course') || name.includes('entree')) return '🍽️';
  if (name.includes('drink') || name.includes('beverage') || name.includes('juice') || name.includes('coffee') || name.includes('tea')) return '🥤';
  if (name.includes('dessert') || name.includes('sweet') || name.includes('cake') || name.includes('pastry')) return '🍰';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('burger') || name.includes('sandwich')) return '🍔';
  if (name.includes('pasta') || name.includes('noodle')) return '🍝';
  if (name.includes('salad')) return '🥙';
  if (name.includes('grill') || name.includes('bbq') || name.includes('meat')) return '🥩';
  if (name.includes('seafood') || name.includes('fish')) return '🐟';
  if (name.includes('vegan') || name.includes('veggie') || name.includes('vegetarian')) return '🌱';
  if (name.includes('breakfast') || name.includes('brunch')) return '🍳';
  if (name.includes('snack') || name.includes('side') || name.includes('extra')) return '🍟';
  if (name.includes('alcohol') || name.includes('wine') || name.includes('beer')) return '🍷';
  if (name === 'all') return '🍴';
  return '🍴'; // default
};

// Item icon fallback based on category
const getItemIcon = (item) => {
  if (item.image) return item.image;
  return getCategoryIcon(item.category);
};

export default function MenuView({ 
  selectedTable, 
  setActiveView, 
  activeCategory, 
  setActiveCategory, 
  categories = [],
  filteredItems, 
  popularItems, 
  addToCart,
  isLoading = false
}) {
  const { t } = useTranslation('waiter');

  const isTableValidForOrder = selectedTable && 
    (selectedTable.status === 'available' || selectedTable.status === 'occupied');

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
            {selectedTable ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  {t('table')} {selectedTable.number} • {selectedTable.section}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedTable.status === 'available' ? 'bg-green-100 text-green-700' :
                  selectedTable.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                  selectedTable.status === 'reserved' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  • {selectedTable.customers || 0} {t('customers', 'customers')}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-600">{t('menu.noTableSelected')}</p>
            )}
          </div>
        </div>
        
        {!selectedTable ? (
          <button
            onClick={() => setActiveView('tables')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm lg:text-base"
          >
            {t('menu.selectTableFirst')}
          </button>
        ) : selectedTable.status === 'reserved' ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t('menu.tableReserved')}</span>
            <button
              onClick={() => setActiveView('tables')}
              className="ml-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs font-medium"
            >
              {t('menu.changeTable')}
            </button>
          </div>
        ) : null}
      </div>

      {selectedTable && selectedTable.status === 'reserved' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">{t('menu.reservedTableWarning')}</h4>
              <p className="text-amber-700 text-sm mt-1">{t('menu.reservedTableDescription')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => {
          const key = category.key || category;
          const label = category.label || category;
          const icon = getCategoryIcon(key);
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 font-medium text-sm flex-shrink-0 ${
                activeCategory === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Popular Items */}
      {activeCategory === 'All' && popularItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-3 lg:mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h4 className="text-base lg:text-lg font-bold text-gray-900">{t('menu.popularItems')}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {popularItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 lg:p-4 hover:shadow-md transition border border-gray-200">
                <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <span className="text-xl lg:text-2xl">{getItemIcon(item)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                    <p className="text-blue-600 font-bold text-sm lg:text-base">ETB {item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.available || !isTableValidForOrder}
                  className={`w-full py-2 rounded text-xs lg:text-sm font-medium transition ${
                    item.available && isTableValidForOrder
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!selectedTable 
                    ? t('menu.selectTableFirst') 
                    : selectedTable.status === 'reserved'
                    ? t('menu.tableReserved')
                    : !item.available
                    ? t('menu.itemUnavailable')
                    : t('menu.addToCart')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <span className="text-2xl lg:text-3xl">{getItemIcon(item)}</span>
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-base lg:text-lg truncate">{item.name}</h4>
                    <p className="text-gray-500 text-xs lg:text-sm mb-2 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {item.price}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-end mt-0.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.preparationTime}{t('menu.preparationTime')}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                      <span>{getCategoryIcon(item.category)}</span>
                      <span>{item.category}</span>
                    </span>
                    {!item.available && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        {t('menu.unavailable')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.available || !isTableValidForOrder}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                      item.available && isTableValidForOrder
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!selectedTable 
                      ? t('menu.selectTableFirst') 
                      : selectedTable.status === 'reserved'
                      ? t('menu.tableReserved')
                      : !item.available
                      ? t('menu.itemUnavailable')
                      : t('menu.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-8 lg:py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🍽️</div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{t('menu.noItems')}</h3>
          <p className="text-gray-600 text-sm lg:text-base">{t('menu.adjustSearch')}</p>
        </div>
      )}
    </div>
  );
}