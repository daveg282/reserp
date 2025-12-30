'use client';
import { X, Bell } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

export default function PagerHistoryModal({ showPagerModal, setShowPagerModal, pagers, orders }) {
  if (!showPagerModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">Pager History & Status</h3>
          <button onClick={() => setShowPagerModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <div className="p-4 lg:p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pager #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagers.map(pager => (
                  <tr key={pager.number} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Bell className={`w-4 h-4 ${
                          pager.status === 'available' ? 'text-green-500' :
                          pager.status === 'assigned' ? 'text-blue-500' : 'text-amber-500'
                        }`} />
                        <span className="font-semibold text-gray-900">#{pager.number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(pager.status)}`}>
                        {pager.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pager.orderId ? orders.find(o => o.id === pager.orderId)?.orderNumber || 'Unknown' : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {pager.assignedAt ? new Date(pager.assignedAt).toLocaleTimeString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {pager.assignedAt ? 
                        `${Math.floor((new Date() - new Date(pager.assignedAt)) / 60000)}m` : 
                        '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}