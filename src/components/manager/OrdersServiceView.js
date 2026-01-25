// components/manager/OrdersServiceView.js
'use client';

import { useState, Fragment, useMemo } from 'react';
import { 
  Search, RefreshCw, Filter, Printer, Eye, Download, 
  Clock, CheckCircle, XCircle, AlertTriangle, DollarSign,
  Users, Calendar, CreditCard, Smartphone, ChevronRight,
  Loader2, ExternalLink, FileText, ChevronDown, ChevronUp,
  Package, ShoppingBag, Receipt, Tag, Percent,
  ChevronLeft, ChevronRight as RightIcon
} from 'lucide-react';
import AuthService from '@/lib/auth-utils';
export default function OrdersServiceView({ 
  userRole,
  ordersData = [],
  orderStats = null,
  isLoading = false,
  error = null,
  onRefresh,
  onUpdateOrderStatus,
  onViewReceipt,
  onDownloadReceipt
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loadingReceipts, setLoadingReceipts] = useState({}); // Track receipt loading per order

  // Transform and normalize orders data from parent
  const normalizedOrders = useMemo(() => {
    return Array.isArray(ordersData) ? ordersData.map(order => {
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
        served_at: order.served_at,
        rawOrder: order // Keep original order data
      };
    }) : [];
  }, [ordersData]);

  // CLIENT-SIDE FILTERING (main filtering logic)
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(normalizedOrders)) return [];
    
    return normalizedOrders.filter(order => {
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
      
      // Date filter
      const matchesDate = (() => {
        if (filterDate === 'all') return true;
        if (!order.orderTime) return false;
        
        const orderDate = new Date(order.orderTime);
        const today = new Date();
        
        switch (filterDate) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate.toDateString() === yesterday.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          case 'custom':
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999); // Include entire end day
            return orderDate >= start && orderDate <= end;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [normalizedOrders, searchQuery, filterStatus, filterPayment, filterDate, dateRange]);

  // CLIENT-SIDE PAGINATION
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize) || 1;
  
  // Ensure currentPage is valid
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (currentPage !== safeCurrentPage) {
    // Use timeout to avoid state update during render
    setTimeout(() => setCurrentPage(safeCurrentPage), 0);
  }
  
  // Get paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, safeCurrentPage, pageSize]);

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

  // Calculate summary stats from ALL filtered data (not just current page)
  const calculateSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = filteredOrders.filter(order => 
      order.orderTime && order.orderTime.startsWith(today)
    );
    
    return {
      totalOrders: filteredOrders.length,
      todayOrders: todayOrders.length,
      totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      paidOrders: filteredOrders.filter(o => o.payment_status === 'paid').length,
      pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
      averageOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, order) => sum + (order.total_with_vat || 0), 0) / filteredOrders.length 
        : 0,
      cashRevenue: filteredOrders.filter(o => o.payment_method?.toLowerCase() === 'cash')
        .reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      cardRevenue: filteredOrders.filter(o => o.payment_method?.toLowerCase() === 'card')
        .reduce((sum, order) => sum + (order.total_with_vat || 0), 0),
      mobileRevenue: filteredOrders.filter(o => 
        o.payment_method?.toLowerCase() === 'mobile' || 
        o.payment_method?.toLowerCase() === 'mobile_money'
      ).reduce((sum, order) => sum + (order.total_with_vat || 0), 0)
    };
  };

  const summary = calculateSummary();

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table for better UX
      const tableElement = document.querySelector('.overflow-x-auto');
      if (tableElement) {
        tableElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Handle search
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  // Handle payment filter
  const handlePaymentFilter = (payment) => {
    setFilterPayment(payment);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  // Handle date filter
  const handleDateFilter = (date) => {
    setFilterDate(date);
    setCurrentPage(1); // Reset to page 1 when filtering
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
      let start = Math.max(1, safeCurrentPage - 2);
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

  // ✅ GET AUTH TOKEN FUNCTION
  const getAuthToken = () => {
    // Try to get token from localStorage (adjust based on your auth implementation)
      const token = AuthService.getToken();
    if (!token) {
      console.warn('No auth token found in storage');
    }
    
    return token;
  };

  // ✅ GENERATE RECEIPT USING HTML ENDPOINT (Same as Billing)
  const generateReceipt = async (orderId, action = 'view') => {
    const token = getAuthToken();
    if (!token) {
      alert('Authentication required. Please login again.');
      return;
    }
    
    // Set loading state for this specific order
    setLoadingReceipts(prev => ({ ...prev, [orderId]: true }));
    
    try {
      console.log(`📄 Generating receipt for order ${orderId} (action: ${action})`);
      
      // Call the HTML receipt endpoint (same as billing view)
      const response = await fetch(
        `http://localhost:8000/api/billing/orders/${orderId}/receipt/html`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/html'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get the HTML receipt
      const receiptHTML = await response.text();
      
      if (action === 'view') {
        // Open receipt in new tab for viewing
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
          receiptWindow.document.write(receiptHTML);
          receiptWindow.document.close();
          
          // Focus on the window
          receiptWindow.focus();
          
          alert('Receipt opened in new tab');
        }
      } else if (action === 'download') {
        // For download, we can:
        // 1. Save as PDF (if server supports it)
        // 2. Or open in new tab and trigger print/download
        
        // Option A: Try PDF endpoint if available
        try {
          const pdfResponse = await fetch(
            `/api/billing/orders/${orderId}/receipt/pdf`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/pdf'
              }
            }
          );
          
          if (pdfResponse.ok) {
            // Create download link for PDF
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            alert('Receipt downloaded as PDF');
          } else {
            // Fallback to HTML print
            throw new Error('PDF endpoint not available');
          }
        } catch (pdfError) {
          console.warn('PDF download failed, using HTML fallback:', pdfError);
          
          // Option B: Open HTML and trigger print (user can save as PDF)
          const receiptWindow = window.open('', '_blank');
          if (receiptWindow) {
            receiptWindow.document.write(receiptHTML);
            receiptWindow.document.close();
            
            // Auto-print after a short delay
            setTimeout(() => {
              receiptWindow.print();
            }, 500);
            
            alert('Receipt ready to print/save as PDF');
          }
        }
      } else if (action === 'print') {
        // Open receipt and auto-print
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
          receiptWindow.document.write(receiptHTML);
          receiptWindow.document.close();
          
          // Auto-print after a short delay
          setTimeout(() => {
            receiptWindow.print();
          }, 500);
          
          alert('Print dialog opened');
        }
      }
      
    } catch (err) {
      console.error('❌ Error generating receipt:', err);
      
      // Generate fallback receipt (similar to billing view)
      const order = normalizedOrders.find(o => o.id === orderId);
      if (order) {
        generateFallbackReceipt(order, action);
      } else {
        alert(`Could not generate receipt: ${err.message}`);
      }
    } finally {
      // Clear loading state
      setLoadingReceipts(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // ✅ FALLBACK RECEIPT GENERATION (similar to billing view)
  const generateFallbackReceipt = (order, action = 'view') => {
    if (!order) return;
    
    const subtotal = order.total || order.total_amount || 0;
    const vatAmount = order.vat_amount || subtotal * 0.15; // 15% VAT
    const totalWithVAT = subtotal + vatAmount;
    const finalTotal = totalWithVAT;
    
    // Format table information
    const tableInfo = order.tableNumber || 'Takeaway';
    
    // Create receipt HTML
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt #${order.orderNumber}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px; 
              max-width: 400px;
              margin: 0 auto;
            }
            .receipt { 
              border: 2px solid #000; 
              padding: 20px; 
            }
            .header { 
              text-align: center; 
              border-bottom: 2px dashed #000; 
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              text-transform: uppercase;
            }
            .restaurant-address {
              font-size: 14px;
              margin: 5px 0;
              text-transform: uppercase;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 4px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .items-table th {
              text-align: left;
              border-bottom: 1px solid #000;
              padding: 8px 0;
              font-weight: bold;
            }
            .items-table td {
              padding: 6px 0;
              border-bottom: 1px dashed #ccc;
            }
            .items-table tr:last-child td {
              border-bottom: none;
            }
            .total-section {
              border-top: 2px solid #000;
              margin-top: 20px;
              padding-top: 15px;
            }
            .highlight {
              font-weight: bold;
              font-size: 18px;
            }
            .payment-info {
              background-color: #f5f5f5;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
            .vat-note {
              font-size: 10px;
              color: #666;
              text-align: center;
              margin-top: 10px;
            }
            .section-title {
              font-weight: bold;
              margin: 15px 0 8px 0;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="restaurant-name">KUKU CHICKEN</h1>
              <p class="restaurant-address">DIRE DIWA ADDIS ABABA</p>
              <p>Phone: (555) 123-4567</p>
              <p><strong>RECEIPT #${order.orderNumber}</strong></p>
              <p>Date: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="section-title">ORDER DETAILS</div>
            <div class="row">
              <span>Customer:</span>
              <span><strong>${order.customerName || 'Walk-in Customer'}</strong></span>
            </div>
            <div class="row">
              <span>Table:</span>
              <span><strong>${tableInfo}</strong></span>
            </div>
            <div class="row">
              <span>Payment Status:</span>
              <span><strong>${order.payment_status || 'pending'}</strong></span>
            </div>
            <div class="row">
              <span>Payment Method:</span>
              <span>${order.payment_method ? order.payment_method.toUpperCase() : 'CASH'}</span>
            </div>
            
            <div class="section-title">ORDER ITEMS</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items && order.items.length > 0 ? 
                  order.items.map(item => `
                    <tr>
                      <td>${item.name || item.item_name || 'Item'}</td>
                      <td>${item.quantity || 1}</td>
                      <td style="text-align: right;">${formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="4" style="text-align: center;">No items found</td></tr>'
                }
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="row">
                <span>Subtotal:</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              <div class="row">
                <span>VAT (15%):</span>
                <span>${formatCurrency(vatAmount)}</span>
              </div>
              <div class="row highlight">
                <span>FINAL TOTAL:</span>
                <span>${formatCurrency(finalTotal)}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for dining with us!</p>
              <p class="vat-note">VAT included at 15% | TIN: 0000000</p>
            </div>
          </div>
          <script>
            // Auto-print if action is print
            setTimeout(() => {
              ${action === 'print' ? 'window.print();' : ''}
            }, 500);
          </script>
        </body>
      </html>
    `;
    
    // Open receipt
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(receiptHTML);
      receiptWindow.document.close();
      
      if (action === 'print') {
        setTimeout(() => {
          receiptWindow.print();
        }, 500);
      }
    }
  };

  // ✅ HANDLE VIEW RECEIPT (Eye Icon)
  const handleViewReceipt = async (order) => {
    if (onViewReceipt) {
      // Use parent callback if provided
      onViewReceipt(order);
    } else {
      // Use our local implementation
      await generateReceipt(order.id, 'view');
    }
  };

  // ✅ HANDLE DOWNLOAD RECEIPT (Download Icon)
  const handleDownloadReceipt = async (order) => {
    if (onDownloadReceipt) {
      // Use parent callback if provided
      onDownloadReceipt(order);
    } else {
      // Use our local implementation
      await generateReceipt(order.id, 'download');
    }
  };

  // ✅ HANDLE PRINT RECEIPT (Print Receipt Button in Expanded View)
  const handlePrintReceipt = async (order) => {
    await generateReceipt(order.id, 'print');
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPayment('all');
    setFilterDate('all');
    setCurrentPage(1);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(Number(size));
    setCurrentPage(1); // Reset to page 1 when changing page size
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
            <span className="text-sm font-medium text-gray-900">{totalOrders}</span>
            <span className="text-sm text-gray-600">total orders</span>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4 text-black" />
            <span className='text-black'>Refresh</span>
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
                Showing {paginatedOrders.length} on page {safeCurrentPage}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Filtered Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ETB {summary.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Page {safeCurrentPage} of {totalPages}
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
                {pageSize} per page
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
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterPayment}
              onChange={(e) => handlePaymentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Payment</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile</option>
            </select>
            
            <select
              value={filterDate}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {/* Custom date range inputs */}
            {filterDate === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="self-center text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
            
            {(searchQuery || filterStatus !== 'all' || filterPayment !== 'all' || filterDate !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Active filters indicator */}
        {(searchQuery || filterStatus !== 'all' || filterPayment !== 'all' || filterDate !== 'all') && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Status: {filterStatus}
                </span>
              )}
              {filterPayment !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Payment: {filterPayment}
                </span>
              )}
              {filterDate !== 'all' && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Date: {filterDate}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-900">
              All Orders ({totalOrders})
              {filteredOrders.length !== normalizedOrders.length && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Filtered from {normalizedOrders.length})
                </span>
              )}
            </h3>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="text-sm border border-gray-300 text-black rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {Math.min((safeCurrentPage - 1) * pageSize + 1, totalOrders)} to {Math.min(safeCurrentPage * pageSize, totalOrders)} of {totalOrders}
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
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
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
                            onClick={() => handlePrintReceipt(order)}
                            disabled={loadingReceipts[order.id]}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download Receipt"
                          >
                            {loadingReceipts[order.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
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
                            
                              
                              {/* ✅ Print Receipt Button */}
                              <button
                                onClick={() => handlePrintReceipt(order)}
                                disabled={loadingReceipts[order.id]}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingReceipts[order.id] ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Printer className="w-4 h-4" />
                                    Print Receipt
                                  </>
                                )}
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
                      {searchQuery || filterStatus !== 'all' || filterPayment !== 'all' || filterDate !== 'all' ? (
                        <>
                          <p className="mb-2">No orders match your current filters</p>
                          <button
                            onClick={handleClearFilters}
                            className="text-purple-600 hover:text-purple-800 underline"
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        'No orders found'
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Now works with client-side filtering */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {safeCurrentPage} of {totalPages} • {totalOrders} orders
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className={`p-2 rounded-lg ${safeCurrentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
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
                        safeCurrentPage === pageNum
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
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className={`p-2 rounded-lg ${safeCurrentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <RightIcon className="w-4 h-4" />
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