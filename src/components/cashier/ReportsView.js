'use client';
import { Download, Printer, Calendar, DollarSign, CreditCard, TrendingUp, Bell } from 'lucide-react';

export default function ReportsView({ todaySales, pagers }) {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `ETB ${todaySales.total.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'emerald',
      change: '+12.5%',
      trend: 'up'
    },
    { 
      label: 'Transactions', 
      value: todaySales.transactions, 
      icon: CreditCard, 
      color: 'blue',
      change: '+8.2%',
      trend: 'up'
    },
    { 
      label: 'Average Order', 
      value: `ETB ${todaySales.average.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'purple',
      change: '+3.1%',
      trend: 'up'
    },
    { 
      label: 'Pagers Used', 
      value: pagers.filter(p => p.status !== 'available').length, 
      icon: Bell, 
      color: 'purple',
      change: '+5',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Sales Reports</h3>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Real-time sales analytics and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 text-black w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium bg-white flex-1 sm:flex-none">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm flex-1 sm:flex-none">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                  <Icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                </div>
                <span className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 lg:w-4 lg:h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{stat.change}</span>
                </span>
              </div>
              <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}