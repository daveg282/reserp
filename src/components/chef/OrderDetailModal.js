import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function OrderDetailModal({ selectedOrder, setSelectedOrder }) {
  const { t } = useTranslation('chef');

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending' },
      preparing: { label: 'Preparing' },
      ready: { label: 'Ready' },
      completed: { label: 'Completed' }
    };
    return configs[status] || configs.pending;
  };

  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">{t('orders.orderDetails')}</h3>
            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('orders.orderNumber')}</p>
                <p className="font-semibold">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orders.table')}</p>
                <p className="font-semibold">{selectedOrder.tableNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orders.waiter')}</p>
                <p className="font-semibold">{selectedOrder.waiterName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orders.status')}</p>
                <p className="font-semibold">{getStatusConfig(selectedOrder.status).label}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">{t('orders.items')}</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-semibold">{item.quantity}x {item.name}</p>
                    {item.specialRequest && (
                      <p className="text-sm text-orange-700 mt-1">
                        {t('orders.specialRequest')}: {item.specialRequest}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{t('orders.station')}: {item.station}</span>
                      <span>{t('orders.prepTime')}: {item.prepTime || item.cookTime}m</span>
                    </div>
                    {item.ingredients && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-600">{t('orders.ingredients')}:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.ingredients.map((ing, idx) => (
                            <span key={idx} className="bg-white px-2 py-1 rounded border text-xs">
                              {ing.name} ({ing.quantity * item.quantity}{ing.unit})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {selectedOrder.customerNotes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">{t('orders.customerNotes')}</p>
                <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                  {selectedOrder.customerNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}