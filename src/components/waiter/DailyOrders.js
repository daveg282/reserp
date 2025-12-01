// components/waiter/DailyOrders.js
'use client';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, CheckCircle, XCircle, User, Home, Truck } from 'lucide-react';

export default function DailyOrders({ orders, updateOrderStatus, setShowDailyOrders }) {
  const { t } = useTranslation('waiter'); // Same as MenuView

  // Show ALL orders including completed ones
  const allOrders = [...orders];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'dineIn': return <Home className="w-4 h-4" />;
      case 'takeaway': return <Truck className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getOrderTypeText = (type) => {
    switch (type) {
      case 'dineIn': return t('dailyOrders.dineIn');
      case 'takeaway': return t('dailyOrders.takeaway');
      case 'delivery': return t('dailyOrders.delivery');
      default: return t('dailyOrders.dineIn');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Same pattern as MenuView */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowDailyOrders(false)}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('dailyOrders.back')}
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t('dailyOrders.title')}</h3>
          <p className="text-gray-600 mt-1">{t('dailyOrders.subtitle')}</p>
        </div>
      </div>

      {/* Orders Summary - Using reports translations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">{t('dailyOrders.allOrders')}</p>
          <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">{t('reports.totalRevenue')}</p>
          <p className="text-2xl font-bold text-gray-900">
            ETB {allOrders.reduce((total, order) => total + order.total, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">{t('reports.averageOrder')}</p>
          <p className="text-2xl font-bold text-gray-900">
            ETB {allOrders.length > 0 ? Math.round(allOrders.reduce((total, order) => total + order.total, 0) / allOrders.length) : 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">{t('reports.tablesServed')}</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(allOrders.map(order => order.tableId)).size}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              {t('dailyOrders.allOrders')} ({allOrders.length})
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {allOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">{t('dailyOrders.noOrders')}</p>
            </div>
          ) : (
            allOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold text-gray-900">{order.orderNumber}</h5>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {t(`orders.status.${order.status}`)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                        {getOrderTypeIcon(order.orderType || 'dineIn')}
                        {getOrderTypeText(order.orderType || 'dineIn')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {t('dailyOrders.table')} {order.tableNumber}
                      </span>
                      <span>•</span>
                      <span>
                        {t('dailyOrders.orderTime')}: {new Date(order.orderTime).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>
                        {order.items.length} {t('dailyOrders.items')}
                      </span>
                    </div>

                    {order.customerName && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {t('dailyOrders.totalAmount')}: ETB {order.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('dailyOrders.estimatedTime')}: {order.estimatedTime}min
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h6 className="font-medium text-gray-900 mb-2">{t('orders.items')}:</h6>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{item.quantity}x</span>
                        <span className="font-medium">{item.name}</span>
                        {item.specialInstructions && (
                          <span className="text-xs text-gray-500">({item.specialInstructions})</span>
                        )}
                      </div>
                      <span className="text-gray-600">ETB {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                {(order.status === 'pending' || order.status === 'preparing' || order.status === 'ready') && (
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {t('orders.startPreparing')}
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        {t('orders.markReady')}
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        {t('orders.complete')}
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        {t('orders.cancel')}
                      </button>
                    )}
                  </div>
                )}

                {/* Completed/Cancelled Order Info */}
                {(order.status === 'completed' || order.status === 'cancelled') && (
                  <div className="text-sm text-gray-500">
                    {t('orders.status.' + order.status)} • {new Date(order.orderTime).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}