'use client';
import { Plus, Calendar, CheckCircle, Users, Utensils, Clock } from 'lucide-react'; // Added Clock
import PageHeader from './PageHeader';
import { getStatusColor } from '../../utils/helpers';

export default function TablesView({ tables = [] }) {
  const handleAddTable = () => {
    console.log('Add table clicked');
  };

  const handleViewReservations = () => {
    console.log('View reservations clicked');
  };

  const stats = [
    { label: 'Total Tables', value: tables.length, icon: Utensils, color: 'gray' },
    { label: 'Occupied', value: tables.filter(t => t.status === 'occupied').length, icon: Users, color: 'blue' },
    { label: 'Available', value: tables.filter(t => t.status === 'available').length, icon: CheckCircle, color: 'emerald' },
    { label: 'Reserved', value: tables.filter(t => t.status === 'reserved').length, icon: Calendar, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Table Management"
        description="Manage restaurant tables and seating"
        actions={[
          {
            icon: Plus,
            label: 'Add Table',
            onClick: handleAddTable,
            variant: 'primary'
          },
          {
            icon: Calendar,
            label: 'View Reservations',
            onClick: handleViewReservations,
            variant: 'secondary'
          }
        ]}
      />

      {/* Table Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {stat.value}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">{stat.label}</p>
            <p className="text-sm text-gray-600">
              {stat.label === 'Total Tables' ? `${stat.value} tables` : `${Math.round((stat.value / tables.length) * 100)}% of total`}
            </p>
          </div>
        ))}
      </div>

      {/* Floor Plan Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Restaurant Floor Plan</h3>
        
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {tables.map(table => (
            <TableGridItem key={table.id} table={table} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            {[
              { status: 'Available', color: 'emerald', count: tables.filter(t => t.status === 'available').length },
              { status: 'Occupied', color: 'blue', count: tables.filter(t => t.status === 'occupied').length },
              { status: 'Reserved', color: 'purple', count: tables.filter(t => t.status === 'reserved').length },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-3 h-12 bg-${item.color}-500 rounded-full`}></div>
                <div>
                  <p className="font-semibold text-gray-900">{item.status}</p>
                  <p className="text-sm text-gray-600">{item.count} tables</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TableGridItem component - Also needs Clock import
function TableGridItem({ table }) {
  // Add safe defaults
  const status = table.status || 'available';
  const number = table.number || 'T00';
  const capacity = table.capacity || 2;
  const section = table.section || 'Main';
  const customerCount = table.customerCount;
  const isVIP = table.isVIP || false;
  const reservationTime = table.reservationTime;
  const customerName = table.customerName;

  return (
    <div
      className={`relative rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer ${
        status === 'occupied' ? 'bg-blue-50 border-2 border-blue-200' :
        status === 'reserved' ? 'bg-purple-50 border-2 border-purple-200' :
        'bg-emerald-50 border-2 border-emerald-200'
      }`}
    >
      {/* Table Number */}
      <div className="mb-2">
        <span className={`text-lg font-bold ${
          status === 'occupied' ? 'text-blue-700' :
          status === 'reserved' ? 'text-purple-700' :
          'text-emerald-700'
        }`}>
          {number}
        </span>
      </div>

      {/* Table Icon */}
      <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2">
        <Utensils className={`w-6 h-6 ${
          status === 'occupied' ? 'text-blue-600' :
          status === 'reserved' ? 'text-purple-600' :
          'text-emerald-600'
        }`} />
      </div>

      {/* Table Details */}
      <div className="space-y-1">
        <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <p className="text-xs text-gray-600">{capacity} seats</p>
        <p className="text-xs text-gray-500">{section}</p>
      </div>

      {/* Additional Info */}
      {status === 'occupied' && customerCount && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {customerCount}
          </div>
        </div>
      )}

      {status === 'reserved' && (
        <div className="absolute -top-2 -right-2">
          <Clock className="w-5 h-5 text-purple-600" />
        </div>
      )}

      {isVIP && (
        <div className="absolute -top-2 -left-2">
          <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            VIP
          </div>
        </div>
      )}
    </div>
  );
}