import { useTranslation } from 'react-i18next';

function PopularItem({ item, index }) {
  const { t } = useTranslation('waiter');

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.orders} {t('reports.orders')} • {t('reports.sold')}
          </p>
        </div>
      </div>
      <span className="font-semibold text-gray-900">{item.revenue}</span>
    </div>
  );
}

function PopularItems({ popularItems }) {
  const { t } = useTranslation('waiter');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">{t('reports.popularItems')}</h4>
        <span className="text-sm text-gray-500">{t('reports.topToday')}</span>
      </div>
      <div className="space-y-4">
        {popularItems.map((item, index) => (
          <PopularItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default PopularItems;