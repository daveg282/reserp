'use client';

import { useState } from 'react';
import {
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Package,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText,
  Activity
} from 'lucide-react';

export default function ReportsView({
  reportsData,
  reportType = 'daily-reports',
  onGenerateReport,
  onGenerateCustomReport,
  onRefresh,
  isLoading,
  error,
  userRole
}) {
    const [dateRange, setDateRange] = useState({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [chartType, setChartType] = useState('bar');

  // Report type titles and descriptions
  const reportTypeInfo = {
    'daily-reports': {
      title: 'Daily Sales Report',
      description: 'Daily revenue, orders, and customer insights',
      icon: Calendar
    },
    'performance-reports': {
      title: 'Performance Reports',
      description: 'Staff performance and operational efficiency',
      icon: TrendingUp
    },
    'financial-reports': {
      title: 'Financial Reports',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign
    }
  };

  const currentReportInfo = reportTypeInfo[reportType] || reportTypeInfo['daily-reports'];
  const Icon = currentReportInfo.icon;

  // Handle report generation
  const handleGenerateReport = async (type = reportType) => {
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        format: selectedFormat
      };
      
      if (onGenerateCustomReport) {
        const result = await onGenerateCustomReport(type, params);
        if (result?.success) {
          alert(result.message || 'Report generated successfully!');
        }
      } else if (onGenerateReport) {
        await onGenerateReport(dateRange.start);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Download report
  const handleDownloadReport = (format = 'pdf') => {
    alert(`Downloading ${currentReportInfo.title} in ${format.toUpperCase()} format...`);
  };

  // Print report
  const handlePrintReport = () => {
    window.print();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(1)}%`;
  };

  // Safely get rating with toFixed
  const formatRating = (rating) => {
    const num = parseFloat(rating);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading report data...</p>
      </div>
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Report</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
      >
        Retry
      </button>
    </div>
  );

  // Empty report state
  const EmptyReportState = ({ onGenerateReport }) => (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Report Data Available</h3>
      <p className="text-gray-500 mb-6">Generate a report to view analytics and insights.</p>
      <button
        onClick={onGenerateReport}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generate Report
      </button>
    </div>
  );

  // ========== DAILY REPORT VIEW ==========
  const DailyReportView = ({ data }) => {
    const dailyData = data.daily_data || data;
    const todayRevenue = dailyData.today_revenue || dailyData.revenue || dailyData.total_revenue || 0;
    const totalOrders = dailyData.total_orders || dailyData.orders_count || 0;
    const avgOrderValue = dailyData.average_order_value || dailyData.avg_order || 0;
    const tableTurnover = dailyData.table_turnover || dailyData.turnover_rate || 0;
    const customers = dailyData.customers_count || dailyData.customers || 0;
    const topItems = dailyData.top_items || dailyData.popular_items || [];
    const revenueChange = dailyData.revenue_change || dailyData.change_percentage;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Today's Revenue</h4>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
            {revenueChange !== undefined && (
              <div className={`flex items-center mt-2 ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(revenueChange)}% from yesterday</span>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <div className="flex items-center mt-2">
              <Users className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600">{customers} customers</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Average Order Value</h4>
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Table Turnover</h4>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">{tableTurnover}x</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Top Selling Items Today</h3>
          </div>
          <div className="p-4">
            {topItems.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Quantity Sold</th>
                    <th className="pb-3">Revenue</th>
                    <th className="pb-3">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <span className="font-medium">{item.name || item.item_name}</span>
                        </div>
                      </td>
                      <td className="py-3">{item.quantity || item.sold_quantity || 0}</td>
                      <td className="py-3 font-medium">
                        {formatCurrency(item.revenue || item.total_amount || 0)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage || 0}%` }}
                            ></div>
                          </div>
                          <span>{(item.percentage || 0).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No item sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== PERFORMANCE REPORT VIEW ==========
  const PerformanceReportView = ({ data }) => {
    const performanceData = data.performance_data || data;
    const staffPerformance = performanceData.staff_performance || [];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">Staff Performance Metrics</h3>
          {staffPerformance.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Staff Member</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Orders Served</th>
                  <th className="pb-3">Revenue Generated</th>
                  <th className="pb-3">Avg. Rating</th>
                  <th className="pb-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{staff.name || staff.staff_name}</p>
                          <p className="text-sm text-gray-500">ID: {staff.id || staff.staff_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {staff.role || 'Staff'}
                      </span>
                    </td>
                    <td className="py-3 font-medium">{staff.orders_served || staff.total_orders || 0}</td>
                    <td className="py-3 font-medium">
                      {formatCurrency(staff.revenue_generated || staff.total_revenue || 0)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{formatRating(staff.avg_rating || staff.rating)}/5.0</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (staff.performance_score || staff.performance || 0) >= 80 ? 'bg-green-600' : 
                              (staff.performance_score || staff.performance || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${staff.performance_score || staff.performance || 0}%` }}
                          ></div>
                        </div>
                        <span>{staff.performance_score || staff.performance || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No staff performance data available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ========== FINANCIAL REPORT VIEW ==========
  const FinancialReportView = ({ data }) => {
    const financialData = data.financial_data || data;
    const totalRevenue = financialData.total_revenue || financialData.revenue || 0;
    const netProfit = financialData.net_profit || (totalRevenue - (financialData.total_expenses || 0));
    const totalExpenses = financialData.total_expenses || financialData.expenses_total || 0;
    const expenses = financialData.expenses || [];
    const revenueSources = financialData.revenue_sources || [];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Net Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="font-semibold mb-4">Expense Breakdown</h4>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{expense.category || expense.name}</span>
                  <span className="font-medium">{formatCurrency(expense.amount || expense.total)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No expense data available</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="font-semibold mb-4">Revenue Sources</h4>
            {revenueSources.length > 0 ? (
              revenueSources.map((source, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>{source.name || source.source}</span>
                    <span>
                      {formatCurrency(source.amount || source.revenue)} 
                      {source.percentage && ` (${source.percentage}%)`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${source.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No revenue source data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== RENDER REPORT CONTENT ==========
  const renderReportContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorDisplay error={error} onRetry={onRefresh} />;
    }

    if (!reportsData) {
      return <EmptyReportState onGenerateReport={() => handleGenerateReport(reportType)} />;
    }

    // Render appropriate view based on report type
    switch (reportType) {
      case 'daily-reports':
        return <DailyReportView data={reportsData} />;
      case 'performance-reports':
        return <PerformanceReportView data={reportsData} />;
      case 'financial-reports':
        return <FinancialReportView data={reportsData} />;
      default:
        return <DailyReportView data={reportsData} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentReportInfo.title}</h1>
              <p className="text-gray-600">{currentReportInfo.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Generated: {reportsData?.generated_at ? 
                  new Date(reportsData.generated_at).toLocaleString() : 'Not generated yet'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={() => handleGenerateReport()}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border rounded-lg w-full"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border rounded-lg w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`px-3 py-2 rounded-lg border ${selectedFormat === 'pdf' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300'}`}
              >
                PDF
              </button>
              <button
                onClick={() => setSelectedFormat('excel')}
                className={`px-3 py-2 rounded-lg border ${selectedFormat === 'excel' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'}`}
              >
                Excel
              </button>
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`px-3 py-2 rounded-lg border ${selectedFormat === 'csv' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'border-gray-300'}`}
              >
                CSV
              </button>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleDownloadReport(selectedFormat)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center flex-1 justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Report Details</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="table">Table</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
}