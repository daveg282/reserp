import { useTranslation } from 'react-i18next';

function TablePerformanceItem({ table }) {
  const { t } = useTranslation('waiter');

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div>
        <p className="font-medium text-gray-900">
          {t('reports.table')} {table.table}
        </p>
        <p className="text-sm text-gray-500">
          {table.orders} {t('reports.orders')} • {table.avgTime} {t('reports.avgTime')}
        </p>
      </div>
      <span className="font-semibold text-green-600">{table.revenue}</span>
    </div>
  );
}

function TablePerformance({ tablePerformance }) {
  const { t } = useTranslation('waiter');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">{t('reports.tablePerformance')}</h4>
        <span className="text-sm text-gray-500">{t('reports.today')}</span>
      </div>
      <div className="space-y-4">
        {tablePerformance.map((table, index) => (
          <TablePerformanceItem key={index} table={table} />
        ))}
      </div>
    </div>
  );
}

export default TablePerformance;