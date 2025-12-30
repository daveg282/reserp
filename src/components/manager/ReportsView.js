'use client';
import { 
  BarChart3, Calendar, DollarSign, Users, Package, CreditCard,
  FileText, FileSpreadsheet, File, Printer, Eye, Download,
  Plus, Settings, Edit, ChevronDown 
} from 'lucide-react';

export default function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Business Reports</h3>
          <p className="text-gray-600 mt-1">Generate and analyze detailed business reports</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Sales Reports', icon: DollarSign, color: 'emerald', count: 24 },
          { label: 'Staff Reports', icon: Users, color: 'blue', count: 18 },
          { label: 'Inventory Reports', icon: Package, color: 'purple', count: 12 },
          { label: 'Financial Reports', icon: CreditCard, color: 'amber', count: 8 },
        ].map((report, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-${report.color}-50`}>
                <report.icon className={`w-5 h-5 text-${report.color}-600`} />
              </div>
              <span className="text-sm font-medium text-gray-600">{report.count} reports</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">{report.label}</p>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2">
              View All →
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Generate Custom Report</h4>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Report Type</option>
                  <option value="sales-summary">Sales Summary</option>
                  <option value="staff-performance">Staff Performance</option>
                  <option value="inventory-analysis">Inventory Analysis</option>
                  <option value="customer-analytics">Customer Analytics</option>
                  <option value="profit-loss">Profit & Loss Statement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Include Staff Details',
                  'Show Hourly Breakdown',
                  'Compare with Previous Period',
                  'Include Cost Analysis',
                  'Export as PDF',
                  'Include Charts'
                ].map((filter, i) => (
                  <label key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="rounded text-purple-600" />
                    <span className="text-sm text-gray-700">{filter}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'PDF', icon: FileText, color: 'red' },
                  { label: 'Excel', icon: FileSpreadsheet, color: 'emerald' },
                  { label: 'CSV', icon: File, color: 'blue' },
                  { label: 'Print', icon: Printer, color: 'gray' },
                ].map((format, i) => (
                  <button
                    key={i}
                    className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    <div className={`w-6 h-6 rounded-full bg-${format.color}-100 flex items-center justify-center`}>
                      <format.icon className={`w-3 h-3 text-${format.color}-600`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h4>
          <div className="space-y-4">
            {[
              { title: 'Daily Sales Report', date: 'Dec 5, 2024', type: 'PDF', size: '2.4 MB' },
              { title: 'Staff Performance - Week 48', date: 'Dec 4, 2024', type: 'Excel', size: '1.8 MB' },
              { title: 'Monthly Inventory Analysis', date: 'Dec 3, 2024', type: 'PDF', size: '3.2 MB' },
              { title: 'Customer Feedback Summary', date: 'Dec 2, 2024', type: 'CSV', size: '1.1 MB' },
              { title: 'Weekly Financial Summary', date: 'Dec 1, 2024', type: 'PDF', size: '2.1 MB' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${
                    report.type === 'PDF' ? 'bg-red-100' : 
                    report.type === 'Excel' ? 'bg-emerald-100' : 'bg-blue-100'
                  } rounded-lg flex items-center justify-center`}>
                    {report.type === 'PDF' ? (
                      <FileText className="w-5 h-5 text-red-600" />
                    ) : report.type === 'Excel' ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <File className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{report.size}</p>
                  <div className="flex space-x-1 mt-1">
                    <button className="p-1 hover:bg-white rounded">
                      <Eye className="w-3 h-3 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-white rounded">
                      <Download className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Scheduled Reports</h4>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
            <Plus className="w-3 h-3" />
            <span>Schedule New Report</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Report Name</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Frequency</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Next Run</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Recipients</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Format</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Daily Sales Summary', frequency: 'Daily', next: 'Tomorrow, 8:00 AM', recipients: 3, format: 'PDF', status: 'active' },
                { name: 'Weekly Staff Report', frequency: 'Weekly', next: 'Monday, 9:00 AM', recipients: 2, format: 'Excel', status: 'active' },
                { name: 'Monthly Financials', frequency: 'Monthly', next: 'Jan 1, 2025', recipients: 5, format: 'PDF', status: 'paused' },
                { name: 'Inventory Check', frequency: 'Daily', next: 'Tomorrow, 7:00 AM', recipients: 1, format: 'CSV', status: 'active' },
                { name: 'Customer Analytics', frequency: 'Monthly', next: 'Jan 1, 2025', recipients: 3, format: 'PDF', status: 'active' },
              ].map((report, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{report.name}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {report.frequency}
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-900">{report.next}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(report.recipients)].map((_, idx) => (
                        <div key={idx} className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          {String.fromCharCode(65 + idx)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.format === 'PDF' ? 'bg-red-100 text-red-700' :
                      report.format === 'Excel' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}