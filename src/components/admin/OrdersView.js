'use client';
import { Filter, Download, User, Clock, CheckCircle, ShoppingCart } from 'lucide-react';
import OrderCard from './OrderCard';
import PageHeader from './PageHeader';
import { getTimeElapsed } from '../../utils/helpers';

export default function OrdersView({ 
  orders = [], 
  onCompleteOrder, 
  onExport 
}) {
  const handleFilter = () => {
    console.log('Filter orders');
  };

  // Safe calculations with defaults
  const safeOrders = Array.isArray(orders) ? orders : [];
  const stats = {
    total: safeOrders.length,
    completed: safeOrders.filter(o => o.status === 'completed').length,
    pending: safeOrders.filter(o => o.status === 'pending').length,
    preparing: safeOrders.filter(o => o.status === 'preparing').length,
    revenue: safeOrders.reduce((sum, order) => sum + (order.total || 0), 0)
  };

  const orderStatuses = [
    { status: 'all', label: 'All Orders', count: stats.total, color: 'gray' },
    { status: 'completed', label: 'Completed', count: stats.completed, color: 'emerald' },
    { status: 'pending', label: 'Pending', count: stats.pending, color: 'amber' },
    { status: 'preparing', label: 'Preparing', count: stats.preparing, color: 'orange' }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Order Management"
        description={`${stats.total} total orders • ETB ${stats.revenue.toFixed(2)} revenue`}
        actions={[
          {
            icon: Filter,
            label: 'Filter',
            onClick: handleFilter,
            variant: 'secondary'
          },
          {
            icon: Download,
            label: 'Export',
            onClick: onExport,
            variant: 'secondary'
          }
        ]}
      />

      {/* Order Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {orderStatuses.map((stat) => (
          <div key={stat.status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <ShoppingCart className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stat.count}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            {stat.status !== 'all' && stats.total > 0 && (
              <p className="text-xs text-gray-500">
                {Math.round((stat.count / stats.total) * 100)}% of total
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <span className="text-sm text-gray-600">
            Last updated: {getTimeElapsed(new Date().toISOString())}
          </span>
        </div>

        {/* Orders Grid */}
        {safeOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {safeOrders.map(order => (
              <OrderCard 
                key={order.id || Math.random()} 
                order={order} 
                onCompleteOrder={() => onCompleteOrder(order.id)}
              />
            ))}
          </div>
        )}

        {/* Orders Summary */}
        {safeOrders.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">ETB {stats.revenue.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-600 mb-1">Completed</p>
                <p className="text-xl font-bold text-gray-900">{stats.completed} orders</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-600 mb-1">Pending</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending} orders</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Average Order</p>
                <p className="text-xl font-bold text-gray-900">
                  ETB {stats.total > 0 ? (stats.revenue / stats.total).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}