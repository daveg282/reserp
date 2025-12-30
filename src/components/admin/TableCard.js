import { Users, Utensils, Clock, AlertCircle } from 'lucide-react';
import { getStatusColor } from '@/utils/helpers';

export default function TableCard({ table }) {
  return (
    <div className={`rounded-xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
      table.status === 'occupied' ? 'bg-blue-50 border-2 border-blue-200' :
      table.status === 'reserved' ? 'bg-purple-50 border-2 border-purple-200' :
      'bg-emerald-50 border-2 border-emerald-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{table.number}</h3>
          <p className="text-sm text-gray-600">{table.section}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(table.status)}`}>
          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">{table.capacity} seats</span>
        </div>
        {table.isVIP && (
          <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
            VIP
          </div>
        )}
      </div>
      
      <div className="space-y-2 text-xs text-gray-600">
        {table.status === 'occupied' && table.customerCount && (
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3" />
            <span>{table.customerCount} customers seated</span>
          </div>
        )}
        
        {table.status === 'reserved' && table.reservationTime && (
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>Reserved for {table.reservationTime}</span>
          </div>
        )}
        
        {table.status === 'reserved' && table.customerName && (
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>{table.customerName}</span>
          </div>
        )}
        
        {table.orderId && (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-3 h-3" />
            <span>Order #{table.orderId}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
}