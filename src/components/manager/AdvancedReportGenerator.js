// components/manager/AdvancedReportGenerator.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  FileText,
  Download,
  Printer,
  Filter,
  X,
  Search,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Loader2,
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart3,
  TrendingUp,
  Clock,
  CreditCard,
  Smartphone,
  MapPin,
  User,
  Tag,
  Percent,
  RefreshCw,
  Save,
  Mail,
  Eye
} from 'lucide-react';
import AuthService from '@/lib/auth-utils';
import { reportAPI, ordersAPI } from '@/lib/api';

export default function AdvancedReportGenerator({
  userRole,
  onGenerateReport,
  onExportPDF,
  onExportExcel,
  onPrint,
  onEmailReport,
  isLoading = false
}) {
  // Report type state
  const [reportType, setReportType] = useState('sales'); // sales, items, orders, payments, staff, custom
  const [dateRange, setDateRange] = useState('custom'); // today, yesterday, week, month, custom
  const [customStartDate, setCustomStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // Filter states
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedWaiter, setSelectedWaiter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeVAT, setIncludeVAT] = useState(true);
  const [includeTips, setIncludeTips] = useState(true);
  const [includeDiscounts, setIncludeDiscounts] = useState(true);
  
  // Data states
  const [availableItems, setAvailableItems] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableWaiters, setAvailableWaiters] = useState([]);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  // UI states
  const [showFilters, setShowFilters] = useState(true);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [showOrderSelector, setShowOrderSelector] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Pagination for results
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Load initial data
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Fetch filter dropdown data
  const fetchFilterData = async () => {
    const token = AuthService.getToken();
    if (!token) return;

    try {
      // Fetch menu items for filtering
      const itemsResponse = await fetch('http://localhost:8000/api/menu/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const itemsData = await itemsResponse.json();
      setAvailableItems(itemsData.items || []);

      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:8000/api/menu/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const categoriesData = await categoriesResponse.json();
      setAvailableCategories(categoriesData.categories || []);

      // Fetch staff for waiter filter
      const staffResponse = await fetch('http://localhost:8000/api/auth/users?role=waiter', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const staffData = await staffResponse.json();
      setAvailableWaiters(staffData.users || []);
      
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  // Search orders by number
  const searchOrders = async (query) => {
    if (!query || query.length < 2) return;
    
    const token = AuthService.getToken();
    if (!token) return;

    try {
      const response = await ordersAPI.searchOrders(query, token);
      setSelectedOrders(response.orders || []);
    } catch (err) {
      console.error('Error searching orders:', err);
    }
  };

  // Generate report based on all filters
  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);
    
    const token = AuthService.getToken();
    if (!token) {
      setError('Authentication required');
      setIsGenerating(false);
      return;
    }

    try {
      // Build filter parameters
      const params = {
        report_type: reportType,
        date_range: dateRange,
        start_date: dateRange === 'custom' ? customStartDate : null,
        end_date: dateRange === 'custom' ? customEndDate : null,
        filters: {
          items: selectedItems,
          categories: selectedCategories,
          orders: selectedOrders,
          status: selectedStatus !== 'all' ? selectedStatus : null,
          payment_method: selectedPaymentMethod !== 'all' ? selectedPaymentMethod : null,
          waiter_id: selectedWaiter !== 'all' ? selectedWaiter : null,
          min_amount: minAmount ? parseFloat(minAmount) : null,
          max_amount: maxAmount ? parseFloat(maxAmount) : null,
          search: searchQuery || null,
          include_vat: includeVAT,
          include_tips: includeTips,
          include_discounts: includeDiscounts
        },
        pagination: {
          page: currentPage,
          page_size: pageSize
        },
        sorting: {
          field: sortField,
          direction: sortDirection
        }
      };

      console.log('📊 Generating report with params:', params);

      // Call API to generate report
      const response = await reportAPI.generateAdvancedReport(params, token);
      
      if (response.success) {
        setGeneratedReport(response.data);
        setReportData(response.data);
        setSuccess(`Report generated successfully with ${response.data.total_records || 0} records`);
        
        // Call parent callback if provided
        if (onGenerateReport) {
          onGenerateReport(response.data);
        }
      } else {
        throw new Error(response.error || 'Failed to generate report');
      }
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export handlers
  const handleExportPDF = async () => {
    if (!generatedReport) return;
    
    const token = AuthService.getToken();
    if (!token) return;

    try {
      const response = await reportAPI.exportReportPDF(generatedReport.report_id, token);
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportType}-${customStartDate}-to-${customEndDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('PDF exported successfully');
      
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    if (!generatedReport) return;
    
    const token = AuthService.getToken();
    if (!token) return;

    try {
      const response = await reportAPI.exportReportExcel(generatedReport.report_id, token);
      
      // Create download link
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportType}-${customStartDate}-to-${customEndDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Excel exported successfully');
      
    } catch (err) {
      console.error('Error exporting Excel:', err);
      setError('Failed to export Excel');
    }
  };

  const handlePrint = () => {
    if (!generatedReport) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Report - ${reportType}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${reportType.toUpperCase()} REPORT</h1>
            <p>Date Range: ${dateRange === 'custom' ? `${customStartDate} to ${customEndDate}` : dateRange}</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          
          ${generateReportHTML(generatedReport)}
          
          <div class="footer">
            <p>Generated by Restaurant Management System</p>
          </div>
          
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleEmailReport = async () => {
    const email = prompt('Enter email address to send report to:');
    if (!email) return;
    
    const token = AuthService.getToken();
    if (!token) return;

    try {
      await reportAPI.emailReport(generatedReport.report_id, email, token);
      setSuccess(`Report sent to ${email}`);
    } catch (err) {
      console.error('Error emailing report:', err);
      setError('Failed to send report');
    }
  };

  // Generate HTML for print view
  const generateReportHTML = (report) => {
    if (!report) return '';
    
    let html = '';
    
    if (report.summary) {
      html += `
        <div style="margin: 20px 0;">
          <h2>Summary</h2>
          <table>
            <tr><th>Total Records</th><td>${report.summary.total_records || 0}</td></tr>
            <tr><th>Total Amount</th><td>$${(report.summary.total_amount || 0).toFixed(2)}</td></tr>
            <tr><th>Average Value</th><td>$${(report.summary.average_value || 0).toFixed(2)}</td></tr>
          </table>
        </div>
      `;
    }
    
    if (report.data && report.data.length > 0) {
      html += `
        <div style="margin: 20px 0;">
          <h2>Details</h2>
          <table>
            <thead>
              <tr>
                ${Object.keys(report.data[0]).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${report.data.map(row => `
                <tr>
                  ${Object.values(row).map(val => `<td>${val || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    
    return html;
  };

  // Toggle item selection
  const toggleItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedItems([]);
    setSelectedCategories([]);
    setSelectedOrders([]);
    setSelectedStatus('all');
    setSelectedPaymentMethod('all');
    setSelectedWaiter('all');
    setMinAmount('');
    setMaxAmount('');
    setSearchQuery('');
    setCustomStartDate(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
    setCustomEndDate(new Date().toISOString().split('T')[0]);
    setDateRange('custom');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `ETB ${Number(amount || 0).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Report Generator</h1>
          <p className="text-gray-600 mt-1">
            Create custom reports with specific filters and date ranges
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Main Report Generator Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Report Configuration</h2>
              <p className="text-sm text-gray-600">
                Select report type, date range, and apply filters
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { id: 'sales', label: 'Sales Report', icon: DollarSign },
              { id: 'items', label: 'Item Analysis', icon: Package },
              { id: 'orders', label: 'Order Details', icon: ShoppingBag },
              { id: 'payments', label: 'Payment Summary', icon: CreditCard },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`p-4 border rounded-lg text-left transition ${
                    reportType === type.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${
                    reportType === type.id ? 'text-purple-600' : 'text-gray-500'
                  }`} />
                  <p className={`font-medium ${
                    reportType === type.id ? 'text-purple-700' : 'text-gray-700'
                  }`}>{type.label}</p>
                </button>
              );
            })}
          </div>

          {/* Date Range Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    dateRange === range.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range Inputs */}
            {dateRange === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Advanced Filters Section */}
          {showFilters && (
            <div className="space-y-4 border-t pt-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order number or customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Money</option>
                </select>
              </div>

              {/* Waiter Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waiter
                </label>
                <select
                  value={selectedWaiter}
                  onChange={(e) => setSelectedWaiter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="all">All Waiters</option>
                  {availableWaiters.map(waiter => (
                    <option key={waiter.id} value={waiter.id}>
                      {waiter.username || waiter.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Item Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Items
                </label>
                <button
                  onClick={() => setShowItemSelector(!showItemSelector)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="text-gray-700">
                    {selectedItems.length > 0 
                      ? `${selectedItems.length} items selected` 
                      : 'Select specific items...'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showItemSelector && (
                  <div className="mt-2 p-3 border rounded-lg max-h-60 overflow-y-auto">
                    {availableItems.map(item => (
                      <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-900">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {formatCurrency(item.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Categories
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg">
                  {availableCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        selectedCategories.includes(category.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Report Results */}
      {generatedReport && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Report Results</h2>
              <p className="text-sm text-gray-600">
                Generated: {new Date().toLocaleString()} • 
                {generatedReport.total_records || 0} records found
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                title="Export as PDF"
              >
                <FileText className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleExportExcel}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                title="Export as Excel"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                title="Print Report"
              >
                <Printer className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleEmailReport}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                title="Email Report"
              >
                <Mail className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Report Summary Cards */}
          {generatedReport.summary && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {generatedReport.summary.total_records || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(generatedReport.summary.total_amount || 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(generatedReport.summary.average_value || 0)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Date Range</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(customStartDate)} - {formatDate(customEndDate)}
                </p>
              </div>
            </div>
          )}

          {/* Data Table */}
          {generatedReport.data && generatedReport.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(generatedReport.data[0]).map(key => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          if (sortField === key) {
                            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(key);
                            setSortDirection('asc');
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {key.replace(/_/g, ' ')}
                          {sortField === key && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generatedReport.data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((value, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                          {typeof value === 'number' && value.toString().includes('.')
                            ? formatCurrency(value)
                            : value || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No data found for the selected criteria
            </div>
          )}

          {/* Pagination */}
          {generatedReport.total_records > pageSize && (
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {Math.ceil(generatedReport.total_records / pageSize)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(generatedReport.total_records / pageSize)}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}