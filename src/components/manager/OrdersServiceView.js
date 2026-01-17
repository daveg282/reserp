// components/manager/OrdersServiceView.js
'use client';

import { useState, Fragment } from 'react';
import { 
  Search, RefreshCw, Filter, Printer, Eye, Download, 
  Clock, CheckCircle, XCircle, AlertTriangle, DollarSign,
  Users, Calendar, CreditCard, Smartphone, ChevronRight,
  Loader2, ExternalLink, FileText, ChevronDown, ChevronUp,
  Package, ShoppingBag, Receipt, Tag, Percent,
  ChevronLeft, ChevronDoubleLeft, ChevronRight as RightIcon, ChevronDoubleRight
} from 'lucide-react';

export default function OrdersServiceView({ 
  userRole,
  ordersData = [],
  orderStats = null,
  isLoading = false,
  error = null,
  onRefresh,
  onUpdateOrderStatus,
  onViewReceipt,  // Parent should pass receipt viewing function
  onDownloadReceipt,  // Parent should pass receipt download function
  totalOrders = 0,  // For pagination
  currentPage = 1,
  totalPages = 1,
  onPageChange,  // Parent handles pagination
  pageSize = 20
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Transform and normalize orders data from parent
  const normalizedOrders = Array.isArray(ordersData) ? ordersData.map(order => {
    // Normalize field names for consistent access
    // Ensure all numeric values are properly converted to numbers
    const totalAmount = parseFloat(order.total_amount || order.total_with_tax || order.total || 0);
    const vatAmount = parseFloat(order.tax_amount || order.vat_amount || 0);
    const subtotal = parseFloat(order.subtotal || order.total_before_tax || totalAmount - vatAmount || 0);
    
    return {
      id: order.id || order.order_id,
      orderNumber: order.order_number || order.orderNumber || order.id || `ORD-${order.id}`,
      tableNumber: order.table_number || order.tableNumber || order.table_id || 'N/A',
      customerName: order.customer_name || order.customerName || 
                   `${order.first_name || ''} ${order.last_name || ''}`.trim() || 
                   (order.customer_id ? `Customer ${order.customer_id}` : 'Walk-in'),
      customerCount: parseInt(order.customer_count || order.guest_count || order.party_size || 1),
      orderTime: order.created_at || order.order_date || order.orderTime,
      status: order.status || 'pending',
      payment_status: order.payment_status || (order.paid ? 'paid' : 'pending'),
      payment_method: order.payment_method || order.payment_type || 'cash',
      total_with_vat: totalAmount,
      total: subtotal,
      vat_amount: vatAmount,
      items: Array.isArray(order.items) ? order.items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity || 1),
        price: parseFloat(item.price || item.unit_price || 0),
        total: parseFloat(item.total || (item.price || 0) * (item.quantity || 1))
      })) : Array.isArray(order.order_items) ? order.order_items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity || 1),
        price: parseFloat(item.price || item.unit_price || 0),
        total: parseFloat(item.total || (item.price || 0) * (item.quantity || 1))
      })) : [],
      notes: order.notes || order.special_instructions || '',
      server_name: order.server_name || order.waiter_name || '',
      completed_at: order.completed_at,
      served_at: order.served_at
    };
  }) : [];

  // Filter orders locally (client-side filtering for current page)
  const filteredOrders = normalizedOrders.filter(order => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' ||
      order.orderNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === 'all' || 
      order.status === filterStatus ||
      (filterStatus === 'paid' && order.payment_status === 'paid') ||
      (filterStatus === 'unpaid' && order.payment_status !== 'paid');
    
    // Payment method filter
    const matchesPayment = 
      filterPayment === 'all' ||
      order.payment_method?.toLowerCase() === filterPayment.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'served':
        return 'bg-green-100 text-green-700';
      case 'ready':
        return 'bg-purple-100 text-purple-700';
      case 'preparing':
      case 'preparation':
        return 'bg-amber-100 text-amber-700';
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get payment badge color
  const getPaymentBadge = (paymentStatus) => {
    if (!paymentStatus) return 'bg-gray-100 text-gray-700';
    
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Format time safely
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Time';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid Time';
    }
  };

  // Format status display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Safe number formatting
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `ETB ${num.toFixed(2)}`;
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Calculate summary stats from current data
  const calculateSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = normalizedOrders.filter(order => 
      order.orderTime && order.orderTime.startsWith(today)
    );
    
    return {
      totalOrders: totalOrders || normalizedOrders.length,
      todayOrders: todayOrders.length,
      totalRevenue: normalizedOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      paidOrders: normalizedOrders.filter(o => o.payment_status === 'paid').length,
      pendingOrders: normalizedOrders.filter(o => o.status === 'pending').length,
      averageOrderValue: normalizedOrders.length > 0 
        ? normalizedOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0) / normalizedOrders.length 
        : 0,
      cashRevenue: normalizedOrders.filter(o => o.payment_method?.toLowerCase() === 'cash')
        .reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      cardRevenue: normalizedOrders.filter(o => o.payment_method?.toLowerCase() === 'card')
        .reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      mobileRevenue: normalizedOrders.filter(o => 
        o.payment_method?.toLowerCase() === 'mobile' || 
        o.payment_method?.toLowerCase() === 'mobile_money'
      ).reduce((sum, order) => sum + (order.total_with_vat || 0), 0)
    };
  };

  const summary = calculateSummary();

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  // Handle search/filter changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handlePaymentFilter = (payment) => {
    setFilterPayment(payment);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxPages - 1);
      
      if (end - start + 1 < maxPages) {
        start = end - maxPages + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Handle receipt actions
  const handleViewReceipt = (order) => {
    if (onViewReceipt) {
      onViewReceipt(order);
    } else {
      alert('Receipt view functionality not implemented');
    }
  };

  const handleDownloadReceipt = (order) => {
    if (onDownloadReceipt) {
      onDownloadReceipt(order);
    } else {
      alert('Receipt download functionality not implemented');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders & Service History</h1>
            <p className="text-gray-600 mt-1">View all orders and service details</p>
          </div>
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders & Service History</h1>
            <p className="text-gray-600 mt-1">View all orders and service details</p>
          </div>
          <button
            onClick={onRefresh}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-800">Error Loading Orders</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Service History</h1>
          <p className="text-gray-600 mt-1">View all orders and service details</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white border rounded-lg px-4 py-2">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">{summary.totalOrders}</span>
            <span className="text-sm text-gray-600">total orders</span>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalOrders}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Showing {normalizedOrders.length} on this page
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ETB {summary.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Page total: ETB {summary.totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Paid Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.paidOrders}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {summary.pendingOrders} pending
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ETB {summary.averageOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <Tag className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="served">Served</option>
              <option value="cancelled">Cancelled</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            
            <select
              value={filterPayment}
              onChange={(e) => handlePaymentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Payment</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile</option>
              <option value="credit">Credit</option>
            </select>
            
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-900">All Orders ({summary.totalOrders})</h3>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, summary.totalOrders)} of {summary.totalOrders}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600">
                            Table {order.tableNumber} • {formatDate(order.orderTime)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(order.orderTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-600">{order.customerCount} people</div>
                        {order.server_name && (
                          <div className="text-xs text-gray-500">Server: {order.server_name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(order.payment_status)}`}>
                            {order.payment_status || 'pending'}
                          </span>
                          {order.payment_method && (
                            <span className="text-xs text-gray-600">
                              {order.payment_method.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(order.total_with_vat)}
                        </div>
                        <div className="text-xs text-gray-600">
                          VAT: {formatCurrency(order.vat_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewReceipt(order)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm flex items-center gap-1"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(order)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm"
                          >
                            {expandedOrder === order.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50 border-t">
                          <div className="space-y-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                              <div className="bg-white rounded-lg border p-4">
                                <div className="space-y-3">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item, idx) => (
                                      <div key={`${order.id}-item-${idx}`} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                          <div className="font-medium text-gray-900">
                                            {item.quantity || 1}x {item.name || item.item_name || 'Item'}
                                          </div>
                                          {item.special_instructions && (
                                            <div className="text-sm text-gray-600">
                                              Note: {item.special_instructions}
                                            </div>
                                          )}
                                          {item.status && (
                                            <div className="text-xs text-gray-500">
                                              Status: <span className={`px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                                                {formatStatus(item.status)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium text-gray-900">
                                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {formatCurrency(item.price || 0)} each
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">No items found</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Notes */}
                            {order.notes && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                                <div className="bg-white rounded-lg border p-4">
                                  <p className="text-gray-700">{order.notes}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Order Actions */}
                            <div className="flex gap-2 flex-wrap">
                              {order.status === 'pending' && onUpdateOrderStatus && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                                >
                                  Mark as Preparing
                                </button>
                              )}
                              {order.status === 'preparing' && onUpdateOrderStatus && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                  Mark as Ready
                                </button>
                              )}
                              {order.status === 'ready' && onUpdateOrderStatus && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'served')}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                  Mark as Served
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleViewReceipt(order)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                              >
                                <Printer className="w-4 h-4" />
                                Print Receipt
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchQuery || filterStatus !== 'all' || filterPayment !== 'all' ? (
                        'No orders match your filters'
                      ) : (
                        'No orders found on this page'
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <RightIcon className="w-4 h-4" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-700">
                {pageSize} per page
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}