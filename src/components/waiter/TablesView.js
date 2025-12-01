import { useTranslation } from 'react-i18next';

export default function TablesView({ tables, setSelectedTable, setActiveView, orders, getTableOrders }) {
  const { t } = useTranslation();

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reserved': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const translateSection = (section) => {
    const sectionMap = {
      'main': t('mainSection'),
      'vip': t('vipSection'), 
      'patio': t('patioSection')
    };
    return sectionMap[section.toLowerCase()] || section;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('tables')}</h3>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
          {tables.filter(t => t.status === 'occupied').length} {t('occupied')} • {tables.filter(t => t.status === 'available').length} {t('available')}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
        {tables.map(table => {
          const tableOrders = getTableOrders(table.id);
          return (
            <div
              key={table.id}
              className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border-2 p-3 lg:p-4 text-center cursor-pointer transition ${
                table.status === 'available' ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100' :
                table.status === 'occupied' ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' :
                table.status === 'reserved' ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''
              }`}
              onClick={() => {
                setSelectedTable(table);
                setActiveView('menu');
              }}
            >
              <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">{table.number}</h4>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getTableStatusColor(table.status)}`}>
                {t(table.status)}
              </div>
              <p className="text-xs text-gray-600">
                {table.customers} {t(table.customers === 1 ? 'customer' : 'customers')}
              </p>
              
              {tableOrders.length > 0 && (
                <div className="mt-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                  {tableOrders.length} {t(tableOrders.length === 1 ? 'order' : 'orders')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}