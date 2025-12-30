'use client';
import { Bell } from 'lucide-react';
import PagerCard from './PagerCard';

export default function PagerManagementView({
  pagers,
  orders,
  getAvailablePagers,
  setShowPagerModal,
  resetDemo,
  setPagers
}) {
  const pagerControls = [
    {
      label: 'Test Active Pagers',
      color: 'blue',
      action: () => {
        const activePagers = pagers.filter(p => p.status === 'active');
        if (activePagers.length > 0) {
          activePagers.forEach(pager => {
            console.log(`🛎️ Testing pager #${pager.number}`);
          });
          alert(`Testing ${activePagers.length} active pagers...`);
        } else {
          alert('No active pagers to test');
        }
      }
    },
    {
      label: 'Return All Pagers',
      color: 'green',
      action: () => {
        setPagers(prev => prev.map(p => ({ ...p, status: 'available', orderId: null, assignedAt: null })));
        alert('All pagers returned to available status');
      }
    },
    {
      label: 'View Pager History',
      color: 'purple',
      action: () => setShowPagerModal(true)
    },
    {
      label: 'Reset Demo',
      color: 'gray',
      action: resetDemo
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">Pager Management</h3>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
          {getAvailablePagers()}/20 Pagers Available
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
        {pagers.map(pager => (
          <PagerCard key={pager.number} pager={pager} orders={orders} />
        ))}
      </div>

      {/* Pager Actions */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h4 className="font-bold text-gray-900 text-lg mb-4 lg:mb-6">Pager Controls</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pagerControls.map((control, index) => (
            <button
              key={index}
              onClick={control.action}
              className={`bg-${control.color}-600 hover:bg-${control.color}-700 text-white py-3 rounded-xl font-semibold text-sm`}
            >
              {control.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}