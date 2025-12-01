import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';

export default function ChefHeader({ 
  activeView, 
  setSidebarOpen
}) {
  const { t } = useTranslation('chef');

  const getViewTitle = () => {
    const viewTitles = {
      dashboard: t('orders.title'),
      orders: t('orders.title'),
      stations: t('stations.title'),
      inventory: t('inventory.title'),
      ingredients: t('ingredients.title'),
      reports: t('reports.title'),
      settings: t('settings.title')
    };
    return viewTitles[activeView] || t('title');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {getViewTitle()}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}