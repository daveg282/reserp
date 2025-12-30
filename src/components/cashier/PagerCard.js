'use client';
import { Bell } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

export default function PagerCard({ pager, orders }) {
  const statusColors = {
    available: {
      border: 'border-green-200',
      bg: 'bg-green-50 hover:bg-green-100',
      iconBg: 'bg-green-100 text-green-600',
      badgeBg: 'bg-green-100 text-green-700'
    },
    assigned: {
      border: 'border-blue-200',
      bg: 'bg-blue-50 hover:bg-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-700'
    },
    active: {
      border: 'border-amber-200',
      bg: 'bg-amber-50 hover:bg-amber-100',
      iconBg: 'bg-amber-100 text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-700'
    }
  };

  const colors = statusColors[pager.status] || statusColors.available;

  return (
    <div className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border-2 p-4 text-center transition ${colors.border} ${colors.bg}`}>
      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${colors.iconBg}`}>
        <Bell className="w-6 h-6" />
      </div>
      <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">#{pager.number}</h4>
      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badgeBg}`}>
        {pager.status}
      </div>
      {pager.status === 'active' && pager.orderId && (
        <p className="text-xs text-gray-600 mt-1 truncate">
          Order: {orders.find(o => o.id === pager.orderId)?.orderNumber}
        </p>
      )}
    </div>
  );
}