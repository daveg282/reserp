import { Download, DollarSign, CheckCircle, Users, Package, TrendingUp } from 'lucide-react';
import PageHeader from './PageHeader';

export default function ReportsView() {
  const handleExport = () => {
    console.log('Export report clicked');
    // Implementation for export report
  };

  const mockReports = {
    sales: {
      total: 12580.75,
      today: 2519.75,
      weekly: 45890.25,
      monthly: 187650.50
    },
    orders: {
      total: 342,
      completed: 328,
      pending: 8,
      cancelled: 6
    },
    customers: {
      total: 1289,
      newThisMonth: 156,
      returning: 845
    },
    inventory: {
      totalItems: 87,
      lowStock: 5,
      outOfStock: 2
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `ETB ${mockReports.sales.total.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
    { label: 'Completed Orders', value: mockReports.orders.completed, icon: CheckCircle, color: 'blue' },
    { label: 'Active Customers', value: mockReports.customers.total, icon: Users, color: 'purple' },
    { label: 'Inventory Items', value: mockReports.inventory.totalItems, icon: Package, color: 'orange' }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Reports & Analytics"
        actions={[
          {
            icon: Download,
            label: 'Export Report',
            onClick: handleExport,
            variant: 'primary'
          }
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Sales Performance */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Sales Performance</h3>
          <div className="space-y-3">
            {[
              { period: 'Today', amount: mockReports.sales.today, change: '+5.2%', color: 'emerald' },
              { period: 'This Week', amount: mockReports.sales.weekly, change: '+12.8%', color: 'emerald' },
              { period: 'This Month', amount: mockReports.sales.monthly, change: '+8.4%', color: 'emerald' },
              { period: 'This Year', amount: mockReports.sales.total, change: '+15.3%', color: 'emerald' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.period}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">ETB {item.amount.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${item.color}-100 text-${item.color}-700`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Order Statistics</h3>
          <div className="space-y-4">
            {[
              { status: 'Completed', count: mockReports.orders.completed, color: 'emerald', percentage: Math.round((mockReports.orders.completed / mockReports.orders.total) * 100) },
              { status: 'Pending', count: mockReports.orders.pending, color: 'amber', percentage: Math.round((mockReports.orders.pending / mockReports.orders.total) * 100) },
              { status: 'Cancelled', count: mockReports.orders.cancelled, color: 'red', percentage: Math.round((mockReports.orders.cancelled / mockReports.orders.total) * 100) }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{stat.status}</span>
                  <span className="font-medium text-gray-900">{stat.count} ({stat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${stat.color}-500 transition-all duration-500`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Customer Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-blue-700">Total Customers</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockReports.customers.total}</p>
            <p className="text-xs text-gray-600 mt-1">All-time registered customers</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-emerald-700">New This Month</p>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">+{mockReports.customers.newThisMonth}</p>
            <p className="text-xs text-gray-600 mt-1">New customer growth</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-purple-700">Returning Customers</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockReports.customers.returning}</p>
            <p className="text-xs text-gray-600 mt-1">Repeat business rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}