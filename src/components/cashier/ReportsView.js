'use client';
import { useState, useEffect } from 'react';
import { Download, Printer, Calendar, DollarSign, CreditCard, TrendingUp, Bell, Loader2, AlertCircle, Users, ShoppingBag, Percent, Clock, BarChart, CheckCircle } from 'lucide-react';

export default function ReportsView({ 
  // Data from parent (page.js)
  todaySales = null,
  pagers = [],
  orders = [],
  getSalesSummary = null,
  
  // Loading state
  isLoading = false,
  error = null,
  
  // Callbacks
  onRefresh = () => {}
}) {
  const [timeRange, setTimeRange] = useState('today');
  const [reportData, setReportData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);

  // Fetch report data when timeRange changes
  useEffect(() => {
    const fetchReportData = async () => {
      if (!getSalesSummary) return;
      
      setIsLoadingReport(true);
      setReportError(null);
      
      try {
        const data = await getSalesSummary();
        if (data && data.success) {
          setReportData(data);
        } else {
          setReportError('Failed to fetch report data');
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setReportError(err.message || 'Failed to load report');
      } finally {
        setIsLoadingReport(false);
      }
    };
    
    fetchReportData();
  }, [getSalesSummary, timeRange]);

  // Calculate stats from reportData or use todaySales as fallback
  const stats = reportData?.summary ? [
    { 
      label: 'Total Sales', 
      value: `ETB ${reportData.summary.total_sales?.toLocaleString() || '0'}`,
      icon: DollarSign, 
      color: 'emerald',
      tooltip: 'Total revenue from all paid orders'
    },
    { 
      label: 'Transactions', 
      value: reportData.summary.total_orders || 0,
      icon: CreditCard, 
      color: 'blue',
      tooltip: 'Total number of paid orders'
    },
    { 
      label: 'Avg Order Value', 
      value: `ETB ${(reportData.summary.average_order_value || 0).toFixed(2)}`,
      icon: TrendingUp, 
      color: 'purple',
      tooltip: 'Average amount per order'
    },
    { 
      label: 'Completed Orders', 
      value: reportData.summary.completed_orders || 0,
      icon: CheckCircle || Users, 
      color: 'green',
      tooltip: 'Orders marked as completed'
    },
    { 
      label: 'Total Tips', 
      value: `ETB ${(reportData.summary.total_tips || 0).toFixed(2)}`,
      icon: DollarSign, 
      color: 'amber',
      tooltip: 'Total tips received'
    },
    { 
      label: 'Cash Sales', 
      value: `ETB ${(reportData.summary.cash_sales || 0).toFixed(2)}`,
      icon: DollarSign, 
      color: 'emerald',
      tooltip: 'Revenue from cash payments'
    },
    { 
      label: 'Card Sales', 
      value: `ETB ${(reportData.summary.card_sales || 0).toFixed(2)}`,
      icon: CreditCard, 
      color: 'blue',
      tooltip: 'Revenue from card payments'
    },
    { 
      label: 'Mobile Sales', 
      value: `ETB ${(reportData.summary.mobile_sales || 0).toFixed(2)}`,
      icon: ShoppingBag, 
      color: 'purple',
      tooltip: 'Revenue from mobile payments'
    }
  ] : [
    // Fallback to todaySales if no reportData
    { 
      label: 'Total Revenue', 
      value: todaySales?.total ? `ETB ${todaySales.total.toLocaleString()}` : 'ETB 0',
      icon: DollarSign, 
      color: 'emerald'
    },
    { 
      label: 'Transactions', 
      value: todaySales?.transactions || 0, 
      icon: CreditCard, 
      color: 'blue'
    },
    { 
      label: 'Avg Order', 
      value: todaySales?.average ? `ETB ${todaySales.average.toFixed(2)}` : 'ETB 0.00', 
      icon: TrendingUp, 
      color: 'purple'
    },
    { 
      label: 'Available Pagers', 
      value: pagers.filter(p => p.status === 'available').length, 
      icon: Bell, 
      color: 'purple'
    }
  ];

  // Handle export CSV
  const handleExportCSV = () => {
    if (!reportData?.detailed_data) {
      alert('No data available to export');
      return;
    }
    
    const headers = ['Order #', 'Amount', 'Payment Method', 'Payment Time', 'Table', 'Customer', 'Waiter', 'Cashier', 'Tip', 'Tax', 'Discount'];
    const csvData = reportData.detailed_data.map(order => [
      order.order_number,
      order.amount,
      order.payment_method,
      order.payment_time,
      order.table_number,
      order.customer_name,
      order.waiter_name,
      order.cashier_name,
      order.tip,
      order.tax,
      order.discount
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle print report
  // Handle print report - UPDATED to include all data
const handlePrintReport = () => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .stat { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .stat-value { font-size: 24px; font-weight: bold; }
            .stat-label { color: #666; font-size: 14px; }
            .section { margin: 30px 0; }
            .tax-note { font-size: 12px; color: #666; margin-top: 5px; }
            .total-row { background-color: #f8f9fa; font-weight: bold; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
            .date-range { color: #666; font-size: 14px; }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Restaurant Sales Report</h1>
            <p class="date-range">Generated: ${new Date().toLocaleString()}</p>
            <p class="date-range">Time Range: ${timeRange === 'today' ? 'Today' : timeRange}</p>
            <p class="date-range">KUKU CHICKEN - Dire Diwa</p>
          </div>
          
          <!-- Key Metrics Section -->
          <div class="section">
            <h2>Key Performance Indicators</h2>
            <div class="summary">
              ${stats.slice(0, 4).map(stat => `
                <div class="stat">
                  <div class="stat-value">${stat.value}</div>
                  <div class="stat-label">${stat.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Additional Stats Section -->
          ${reportData?.summary ? `
          <div class="section">
            <h2>Detailed Financial Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Amount (ETB)</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Sales Revenue</td>
                  <td>${reportData.summary.total_sales?.toFixed(2) || '0.00'}</td>
                  <td>${reportData.summary.total_orders || 0} orders</td>
                </tr>
                <tr>
                  <td>Total VAT Collected (15%)</td>
                  <td>${reportData.summary.total_tax?.toFixed(2) || '0.00'}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Tips Received</td>
                  <td>${reportData.summary.total_tips?.toFixed(2) || '0.00'}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total Discounts Given</td>
                  <td>${reportData.summary.total_discounts?.toFixed(2) || '0.00'}</td>
                  <td>-</td>
                </tr>
                <tr class="total-row">
                  <td>Average Order Value</td>
                  <td>${(reportData.summary.average_order_value || 0).toFixed(2)}</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- Payment Methods Section -->
          ${reportData?.payment_methods?.length > 0 ? `
          <div class="section">
            <h2>Payment Method Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Number of Orders</th>
                  <th>Total Amount (ETB)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.payment_methods.map(method => `
                  <tr>
                    <td>${method.payment_method.toUpperCase()}</td>
                    <td>${method.count}</td>
                    <td>${method.total_amount?.toFixed(2) || '0.00'}</td>
                    <td>${method.percentage || 0}%</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td><strong>TOTAL</strong></td>
                  <td><strong>${reportData.payment_methods.reduce((sum, m) => sum + (m.count || 0), 0)}</strong></td>
                  <td><strong>${reportData.payment_methods.reduce((sum, m) => sum + (parseFloat(m.total_amount) || 0), 0).toFixed(2)}</strong></td>
                  <td><strong>100%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <!-- Top Items Section -->
          ${reportData?.top_items?.length > 0 ? `
          <div class="section">
            <h2>Top Selling Menu Items</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Menu Item</th>
                  <th>Quantity Sold</th>
                  <th>Revenue (ETB)</th>
                  <th>Avg Price (ETB)</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.top_items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity_sold}</td>
                    <td>${item.revenue?.toFixed(2) || '0.00'}</td>
                    <td>${(item.revenue / item.quantity_sold).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="2"><strong>TOTAL</strong></td>
                  <td><strong>${reportData.top_items.reduce((sum, item) => sum + (item.quantity_sold || 0), 0)}</strong></td>
                  <td><strong>${reportData.top_items.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0).toFixed(2)}</strong></td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <p class="tax-note">Note: Prices include 15% Ethiopian VAT</p>
          </div>
          ` : ''}
          
          <!-- Detailed Transactions Section -->
          ${reportData?.detailed_data?.length > 0 ? `
          <div class="section" style="page-break-before: always;">
            <h2>Detailed Transaction List</h2>
            <p>Showing all ${reportData.detailed_data.length} transactions</p>
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Amount (ETB)</th>
                  <th>VAT (ETB)</th>
                  <th>Tip (ETB)</th>
                  <th>Payment Method</th>
                  <th>Payment Time</th>
                  <th>Cashier</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.detailed_data.map((order, index) => `
                  <tr>
                    <td>${order.order_number}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.table_number}</td>
                    <td>${parseFloat(order.amount).toFixed(2)}</td>
                    <td>${parseFloat(order.tax || 0).toFixed(2)}</td>
                    <td>${parseFloat(order.tip || 0).toFixed(2)}</td>
                    <td>${order.payment_method}</td>
                    <td>${order.payment_time}</td>
                    <td>${order.cashier_name || 'N/A'}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3"><strong>TOTAL</strong></td>
                  <td><strong>${reportData.detailed_data.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0).toFixed(2)}</strong></td>
                  <td><strong>${reportData.detailed_data.reduce((sum, order) => sum + parseFloat(order.tax || 0), 0).toFixed(2)}</strong></td>
                  <td><strong>${reportData.detailed_data.reduce((sum, order) => sum + parseFloat(order.tip || 0), 0).toFixed(2)}</strong></td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
            <p class="tax-note">VAT: Value Added Tax at 15% as per Ethiopian Revenue Law</p>
          </div>
          ` : ''}
          
          <!-- Summary Section -->
          <div class="section" style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333;">
            <h3>Report Summary</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>Report Period:</strong></td>
                  <td>${timeRange === 'today' ? 'Today' : timeRange}</td>
                  <td><strong>Generated By:</strong></td>
                  <td>Cashier System</td>
                </tr>
                <tr>
                  <td><strong>Total Orders:</strong></td>
                  <td>${reportData?.summary?.total_orders || 0}</td>
                  <td><strong>Total Revenue:</strong></td>
                  <td>ETB ${(reportData?.summary?.total_sales || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Total VAT Collected:</strong></td>
                  <td>ETB ${(reportData?.summary?.total_tax || 0).toFixed(2)}</td>
                  <td><strong>Report Timestamp:</strong></td>
                  <td>${new Date().toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
              --- End of Report ---<br>
              KUKU CHICKEN Restaurant Management System<br>
              Dire Diwa | Phone: (251) 9-01-55-55-99
            </p>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

  const isDataAvailable = reportData || todaySales;
  const loading = isLoading || isLoadingReport;
  const errorMessage = error || reportError;

  // Show error state
  if (errorMessage && !isDataAvailable) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sales Reports</h1>
            <p className="text-gray-600 mt-1">Financial reports and analytics</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800">Unable to Load Report Data</h4>
              <p className="text-red-700 mt-1">{errorMessage}</p>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600 mt-1">Financial reports and analytics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportCSV}
            disabled={loading || !isDataAvailable}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Export CSV</span>
          </button>
          <button 
            onClick={handlePrintReport}
            disabled={loading || !isDataAvailable}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !isDataAvailable && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading report data...</p>
        </div>
      )}

      {/* Error State (with partial data) */}
      {errorMessage && isDataAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <p className="text-yellow-700 text-sm">{errorMessage} (Showing available data)</p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {isDataAvailable && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.slice(0, 4).map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Stats */}
          {reportData?.summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.slice(4).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                        <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                      </div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Payment Methods Breakdown */}
          {reportData?.payment_methods && reportData.payment_methods.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {reportData.payment_methods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        method.payment_method === 'cash' ? 'bg-green-100' :
                        method.payment_method === 'card' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {method.payment_method === 'cash' ? (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        ) : method.payment_method === 'card' ? (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ShoppingBag className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{method.payment_method}</p>
                        <p className="text-sm text-gray-600">{method.count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">ETB {method.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{method.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Items */}
          {reportData?.top_items && reportData.top_items.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
              <div className="space-y-4">
                {reportData.top_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                        <span className="text-lg">🍽️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity_sold} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">ETB {item.revenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        ETB {(item.revenue / item.quantity_sold).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {reportData?.detailed_data && reportData.detailed_data.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.detailed_data.slice(0, 10).map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{order.order_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{order.customer_name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                            {order.table_number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">ETB {parseFloat(order.amount).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
                            order.payment_method === 'cash' ? 'bg-green-100 text-green-700' :
                            order.payment_method === 'card' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {order.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{order.payment_time}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Showing {Math.min(10, reportData.detailed_data.length)} of {reportData.detailed_data.length} transactions
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* No data state */}
      {!loading && !errorMessage && !isDataAvailable && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Report Data Available</h3>
            <p className="text-gray-600 mb-6">
              {timeRange === 'today' 
                ? 'No sales data available for today yet.' 
                : `No sales data available for ${timeRange}.`}
            </p>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}