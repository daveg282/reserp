import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Clock, ChefHat } from 'lucide-react';

export default function OrderDetailModal({ selectedOrder, setSelectedOrder, updateOrderStatus, updateItemStatus }) {
  const { t } = useTranslation('chef');
  const [updating, setUpdating] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-blue-100 text-blue-800' },
      ready: { label: 'Ready', icon: Check, color: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', icon: Check, color: 'bg-gray-100 text-gray-800' }
    };
    return configs[status] || configs.pending;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder || updating) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleItemStatusUpdate = async (itemId, newStatus) => {
    if (!itemId || updating) return;
    
    setUpdating(true);
    try {
      await updateItemStatus(itemId, newStatus);
      // Update local state
      const updatedItems = selectedOrder.items.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      setSelectedOrder({ ...selectedOrder, items: updatedItems });
    } catch (error) {
      console.error('Error updating item status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const canMarkAsReady = selectedOrder?.items?.every(item => 
    item.status === 'ready' || item.status === 'completed'
  );

  if (!selectedOrder) return null;

  const StatusIcon = getStatusConfig(selectedOrder.status).icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${getStatusConfig(selectedOrder.status).color.replace('bg-', 'text-')}`} />
              <h3 className="text-xl font-bold text-gray-900">{t('orders.orderDetails')}</h3>
            </div>
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              disabled={updating}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getStatusConfig(selectedOrder.status).color}`}>
                  <span className="text-xs font-semibold">{getStatusConfig(selectedOrder.status).label}</span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            {selectedOrder.status !== 'completed' && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate('preparing')}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {updating ? 'Starting...' : 'Start Preparing'}
                    </button>
                  )}
                  
                  {selectedOrder.status === 'preparing' && canMarkAsReady && (
                    <button
                      onClick={() => handleStatusUpdate('ready')}
                      disabled={updating}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {updating ? 'Marking...' : 'Mark as Ready'}
                    </button>
                  )}
                  
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={updating}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      {updating ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">{t('orders.items')}</p>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{item.quantity}x {item.name}</p>
                        {item.specialRequest && (
                          <p className="text-sm text-orange-700 mt-1">
                            {t('orders.specialRequest')}: {item.specialRequest}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusConfig(item.status).color}`}>
                          {getStatusConfig(item.status).label}
                        </span>
                        {item.status === 'preparing' && (
                          <button
                            onClick={() => handleItemStatusUpdate(item.id, 'ready')}
                            disabled={updating}
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Ready
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{t('orders.station')}: {item.station}</span>
                      <span>{t('orders.prepTime')}: {item.prepTime || item.cookTime || 'N/A'}m</span>
                    </div>
                    
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-600 mb-1">{t('orders.ingredients')}:</p>
                        <div className="flex flex-wrap gap-1">
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

            {/* Customer Notes */}
            {selectedOrder.customerNotes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">{t('orders.customerNotes')}</p>
                <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                  {selectedOrder.customerNotes}
                </p>
              </div>
            )}

            {/* Order Times */}
            <div className="text-sm text-gray-500">
              <p>Ordered: {new Date(selectedOrder.orderTime).toLocaleTimeString()}</p>
              {selectedOrder.startedTime && <p>Started: {new Date(selectedOrder.startedTime).toLocaleTimeString()}</p>}
              {selectedOrder.readyTime && <p>Ready: {new Date(selectedOrder.readyTime).toLocaleTimeString()}</p>}
              {selectedOrder.completedTime && <p>Completed: {new Date(selectedOrder.completedTime).toLocaleTimeString()}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}