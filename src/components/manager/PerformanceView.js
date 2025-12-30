'use client';
import { 
  Download, Star, CheckCircle, Clock, TrendingUp, 
  ArrowUp, ArrowDown, ChevronDown 
} from 'lucide-react';

export default function PerformanceView({ timeRange, setTimeRange, staffPerformance }) {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    return <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Performance Analytics</h3>
        <div className="flex flex-wrap gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-black"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Revenue Trends</h4>
            <span className="text-sm text-emerald-600 font-medium">↑ 19.8% this month</span>
          </div>
          <div className="h-64 flex items-end justify-between px-2">
            {[65, 80, 45, 90, 70, 85, 60].map((height, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-8 lg:w-10 bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">ETB 45,820</p>
              <p className="text-sm text-gray-600">Current Week</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">ETB 183,240</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">12.8%</p>
              <p className="text-sm text-gray-600">Growth Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h4>
          <div className="space-y-4">
            {[
              { label: 'Customer Satisfaction', value: '4.7/5', change: '+2.3%', icon: Star, color: 'amber' },
              { label: 'Order Accuracy', value: '98.5%', change: '+1.2%', icon: CheckCircle, color: 'emerald' },
              { label: 'Avg Service Time', value: '18.2 min', change: '-5.6%', icon: Clock, color: 'blue' },
              { label: 'Staff Efficiency', value: '91.3%', change: '+3.8%', icon: TrendingUp, color: 'purple' },
            ].map((kpi, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${kpi.color}-100 rounded-lg flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{kpi.label}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Target: </span>
                      <span className={`text-sm font-medium ${
                        kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours Analysis</h4>
          <div className="space-y-4">
            {[
              { hour: '12:00 PM', orders: 85, revenue: 'ETB 12,450' },
              { hour: '7:00 PM', orders: 92, revenue: 'ETB 15,280' },
              { hour: '8:00 PM', orders: 88, revenue: 'ETB 14,320' },
              { hour: '1:00 PM', orders: 76, revenue: 'ETB 10,850' },
            ].map((peak, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{peak.hour}</p>
                    <p className="text-sm text-gray-600">{peak.orders} orders</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">{peak.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Staff Performance Ranking</h4>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View Detailed Report →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-500">Rank</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-500">Staff Member</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-500">Revenue</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-500">Efficiency</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-500">Upsell Rate</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < 3 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      } font-bold`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                          {staff.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-gray-900">ETB {staff.sales.toLocaleString()}</p>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${staff.efficiency}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{staff.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        index < 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {index < 2 ? '15.2%' : '9.8%'}
                      </span>
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