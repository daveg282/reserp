'use client';
import { User, Clock, CheckCircle } from 'lucide-react';
import { getTimeElapsed, getStatusColor } from '../../utils/helpers';

export default function OrderCard({ order, onCompleteOrder }) {
  const handleComplete = () => {
    if (window.confirm(`Complete order ${order.orderNumber}?`)) {
      onCompleteOrder(order.id);
    }
  };

  const isActionable = order.status === 'pending' || order.status === 'preparing';
  
  // Safe access to properties with defaults
  const total = order.total || 0;
  const items = order.items || [];
  const orderNumber = order.orderNumber || 'N/A';
  const tableNumber = order.tableNumber || 'N/A';
  const waiter = order.waiter || 'Unknown';
  const orderTime = order.orderTime || new Date().toISOString();
  const paymentMethod = order.paymentMethod || null;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm lg:text-base">{orderNumber}</h3>
          <p className="text-xs lg:text-sm text-gray-600">Table {tableNumber}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {order.status || 'unknown'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {items.slice(0, 2).map((item, index) => (
          <div key={index} className="flex justify-between text-xs lg:text-sm">
            <span className="text-gray-600">
              {(item.quantity || 1)}x {item.name || 'Item'}
            </span>
            <span className="font-medium">
              ETB {(item.price || 0).toFixed(2)}
            </span>
          </div>
        ))}
        {items.length > 2 && (
          <div className="text-xs text-gray-500 text-center">
            +{items.length - 2} more items
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs lg:text-sm">
        <div className="text-gray-600">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{waiter}</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeElapsed(orderTime)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">ETB {total.toFixed(2)}</p>
          {paymentMethod && (
            <p className="text-gray-600 capitalize">{paymentMethod}</p>
          )}
        </div>
      </div>
      
      {isActionable && (
        <button
          onClick={handleComplete}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium transition flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete Order</span>
        </button>
      )}
    </div>
  );
}