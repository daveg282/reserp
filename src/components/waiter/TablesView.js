import { useTranslation } from 'react-i18next';

export default function TablesView({ tables, setSelectedTable, setActiveView, orders, getTableOrders, isLoading }) {
  const { t } = useTranslation();

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reserved': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('tables', 'Tables')}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-3 lg:p-4 text-center animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{t('tables', 'Tables')}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{tables.filter(t => t.status === 'occupied').length} {t('occupied', 'Occupied')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{tables.filter(t => t.status === 'available').length} {t('available', 'Available')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
        {tables.map(table => {
          const tableOrders = getTableOrders(table.id);
          return (
            <div
              key={table.id}
              className={`bg-white rounded-lg shadow-sm border p-3 lg:p-4 text-center cursor-pointer transition hover:shadow-md ${
                table.status === 'available' ? 'border-green-200 hover:border-green-300' :
                table.status === 'occupied' ? 'border-blue-200 hover:border-blue-300' :
                table.status === 'reserved' ? 'border-amber-200 hover:border-amber-300' :
                'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedTable(table);
                setActiveView('menu');
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  table.status === 'available' ? 'bg-green-500' :
                  table.status === 'occupied' ? 'bg-blue-500' :
                  table.status === 'reserved' ? 'bg-amber-500' :
                  'bg-gray-400'
                }`}></div>
                <h4 className="text-lg lg:text-xl font-bold text-gray-900">{table.number}</h4>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-semibold mb-2 ${getTableStatusColor(table.status)}`}>
                {t(table.status, table.status.charAt(0).toUpperCase() + table.status.slice(1))}
              </div>
              
              <p className="text-xs text-gray-600 mb-1">
                {table.customers} {t(table.customers === 1 ? 'customer' : 'customers', table.customers === 1 ? 'Customer' : 'Customers')}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {table.section}
              </p>
              
              {tableOrders.length > 0 && (
                <div className="mt-2 px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-semibold">
                  {tableOrders.length} {t(tableOrders.length === 1 ? 'order' : 'orders', tableOrders.length === 1 ? 'Order' : 'Orders')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}