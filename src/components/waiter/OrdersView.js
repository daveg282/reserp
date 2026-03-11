'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Clock, User, Receipt, Package, CheckCircle, 
  AlertCircle, RefreshCw, MapPin, Calendar, Info,
  ShoppingBag, Plus, Minus, Search, PlusCircle
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';

export default function OrdersView({ 
  orders, 
  updateOrderStatus, 
  setActiveView,
  refreshOrders,
  isLoading = false,
  menuItems = []
}) {
  const { t } = useTranslation(['waiter', 'common']);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Add Items state
  const [showAddItems, setShowAddItems] = useState(false);
  const [addItemsOrder, setAddItemsOrder] = useState(null);
  const [addCart, setAddCart] = useState([]);
  const [addSearchTerm, setAddSearchTerm] = useState('');
  const [addActiveCategory, setAddActiveCategory] = useState('All');
  const [isSubmittingItems, setIsSubmittingItems] = useState(false);
  const [addItemsError, setAddItemsError] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getStatusTranslation = (status) => {
    const translations = {
      'pending': t('waiter:orders.status.pending', 'Pending'),
      'preparing': t('waiter:orders.status.preparing', 'Preparing'),
      'ready': t('waiter:orders.status.ready', 'Ready'),
      'completed': t('waiter:orders.status.completed', 'Completed'),
      'cancelled': t('waiter:orders.status.cancelled', 'Cancelled')
    };
    return translations[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'preparing': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'ready': return 'bg-green-100 text-green-700 border border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  useEffect(() => {
    if (selectedOrder && showModal) {
      fetchOrderDetails(selectedOrder.id);
    }
  }, [selectedOrder, showModal]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      setError(null);
      const token = AuthService.getToken();
      if (!token) throw new Error('No authentication token found');
      const response = await ordersAPI.getOrder(orderId, token);
      if (response.order) {
        setOrderDetails(response.order);
      } else {
        setOrderDetails(response);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
      if (selectedOrder?.rawOrder) setOrderDetails(selectedOrder.rawOrder);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setOrderDetails(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails(null);
    setError(null);
  };

  // ── Add Items handlers ──────────────────────────────────────
  const handleOpenAddItems = (order) => {
    setAddItemsOrder(order);
    setAddCart([]);
    setAddSearchTerm('');
    setAddActiveCategory('All');
    setAddItemsError(null);
    setShowAddItems(true);
  };

  const handleCloseAddItems = () => {
    setShowAddItems(false);
    setAddItemsOrder(null);
    setAddCart([]);
    setAddItemsError(null);
  };

  const addToAddCart = (item) => {
    setAddCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, specialInstructions: '' }];
    });
  };

  const removeFromAddCart = (itemId) => {
    setAddCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const updateAddCartInstructions = (itemId, value) => {
    setAddCart(prev => prev.map(i => i.id === itemId ? { ...i, specialInstructions: value } : i));
  };

  const handleSubmitAdditionalItems = async () => {
    if (addCart.length === 0) return;
    const token = AuthService.getToken();
    if (!token) { setAddItemsError('Not authenticated'); return; }

    setIsSubmittingItems(true);
    setAddItemsError(null);

    try {
      for (const item of addCart) {
        await ordersAPI.addItemToOrder(addItemsOrder.id, {
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: item.specialInstructions || ''
        }, token);
      }
      handleCloseAddItems();
      refreshOrders();
    } catch (error) {
      setAddItemsError(error.message || 'Failed to add items');
    } finally {
      setIsSubmittingItems(false);
    }
  };

  // Derive categories from menuItems
  const menuCategories = ['All', ...Array.from(new Set(menuItems.map(i => i.category).filter(Boolean)))];

  const filteredMenuItems = menuItems.filter(item =>
    item.available &&
    (addActiveCategory === 'All' || item.category === addActiveCategory) &&
    (addSearchTerm === '' ||
      item.name.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(addSearchTerm.toLowerCase())))
  );

  const addCartTotal = addCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // ────────────────────────────────────────────────────────────

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '--:--'; }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    try {
      return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) { return '--/--/----'; }
  };

  const calculateTimeSince = (dateString) => {
    if (!dateString) return '';
    try {
      const diffMinutes = Math.floor((new Date() - new Date(dateString)) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    } catch (e) { return ''; }
  };

  const handleServeOrder = (orderId, orderNumber, tableNumber, customerName) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark order ${orderNumber} as served?\n\nTable: ${tableNumber}\nCustomer: ${customerName}\n\nClick OK to mark as served.`
    );
    if (confirmed) updateOrderStatus(orderId, 'completed');
  };

  const activeOrders = orders.filter(order =>
    order.status !== 'completed' && order.status !== 'cancelled'
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
              {t('waiter:orders.title', 'Active Orders')}
            </h1>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              {t('waiter:orders.subtitle', 'Manage and track all ongoing orders')}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none sm:text-left">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{activeOrders.length}</div>
              <div className="text-xs text-gray-600">{t('waiter:orders.activeOrders', 'Active Orders')}</div>
            </div>
            <button
              onClick={refreshOrders}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm flex-shrink-0"
            >
              <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2 md:mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                    <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{order.orderNumber}</h4>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-600 flex-wrap">
                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">Table {order.tableNumber}</span>
                    {order.customerName && order.customerName !== `Table ${order.tableNumber}` && (
                      <>
                        <span className="text-gray-300 hidden md:inline">•</span>
                        <span className="font-medium truncate hidden md:inline">{order.customerName}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${getStatusColor(order.status)}`}>
                  {isMobile ? getStatusTranslation(order.status).charAt(0) : getStatusTranslation(order.status)}
                </span>
              </div>

              <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{formatTime(order.orderTime)}</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    ETB {parseFloat(order.total || 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-400">{calculateTimeSince(order.orderTime)}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleServeOrder(order.id, order.orderNumber, order.tableNumber, order.customerName || `Table ${order.tableNumber}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs md:text-sm font-medium transition flex items-center justify-center gap-1 md:gap-2"
                  >
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Serve</span>
                  </button>
                )}
                <div className="flex gap-2">
                  {/* Add Items button - only for non-completed/cancelled orders */}
                  <button
                    onClick={() => handleOpenAddItems(order)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded text-xs md:text-sm font-medium transition flex items-center justify-center gap-1 md:gap-2"
                  >
                    <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Add Items</span>
                  </button>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs md:text-sm font-medium transition flex items-center justify-center gap-1 md:gap-2"
                  >
                    <Info className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeOrders.length === 0 && !isLoading && (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">📋</div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">No Active Orders</h3>
          <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 max-w-md mx-auto px-4">
            All orders are completed or there are no pending orders at the moment.
          </p>
          <button
            onClick={() => setActiveView('tables')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition"
          >
            Take New Order
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 md:py-12">
          <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading orders...</p>
        </div>
      )}

      {/* ── Add Items Modal ─────────────────────────────────────── */}
      {showAddItems && addItemsOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseAddItems} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Add Items to Order {addItemsOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Table {addItemsOrder.tableNumber} • Current total: ETB {parseFloat(addItemsOrder.total || 0).toFixed(2)}
                    </p>
                  </div>
                  <button onClick={handleCloseAddItems} className="p-2 hover:bg-gray-100 rounded transition">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={addSearchTerm}
                    onChange={(e) => setAddSearchTerm(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {menuCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAddActiveCategory(cat)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        addActiveCategory === cat
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
                {/* Menu Items */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMenuItems.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-gray-500 text-sm">No items found</div>
                  ) : filteredMenuItems.map(item => {
                    const inCart = addCart.find(i => i.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <p className="text-sm font-semibold text-blue-600 mt-0.5">ETB {parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => removeFromAddCart(item.id)}
                              className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 w-5 text-center text-sm">{inCart.quantity}</span>
                            <button
                              onClick={() => addToAddCart(item)}
                              className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center hover:bg-amber-600"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToAddCart(item)}
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Special instructions for cart items */}
                {addCart.length > 0 && (
                  <div className="px-4 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Special Instructions</h3>
                    <div className="space-y-2">
                      {addCart.map(item => (
                        <div key={item.id} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                          <p className="text-xs font-medium text-gray-700 mb-1">{item.name} × {item.quantity}</p>
                          <input
                            type="text"
                            value={item.specialInstructions}
                            onChange={(e) => updateAddCartInstructions(item.id, e.target.value)}
                            placeholder="Any special instructions? (optional)"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                {addItemsError && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {addItemsError}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    {addCart.length > 0 && (
                      <p className="text-sm font-semibold text-gray-900">
                        {addCart.reduce((s, i) => s + i.quantity, 0)} item(s) • ETB {addCartTotal.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCloseAddItems}
                      disabled={isSubmittingItems}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAdditionalItems}
                      disabled={addCart.length === 0 || isSubmittingItems}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmittingItems ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Adding...</>
                      ) : (
                        <><PlusCircle className="w-4 h-4" /> Add to Order</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className={`relative bg-white rounded-lg shadow-xl w-full ${isMobile ? 'max-w-full h-full max-h-full' : 'max-w-4xl max-h-[90vh]'} overflow-hidden`}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 z-10">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          Order {selectedOrder?.orderNumber}
                        </h2>
                        <div className="flex items-center gap-1 sm:gap-2 mt-0.5 text-xs sm:text-sm flex-wrap">
                          <span className="text-gray-600 truncate">Table {selectedOrder?.tableNumber}</span>
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(selectedOrder?.status)}`}>
                            {getStatusTranslation(selectedOrder?.status)}
                          </span>
                          <span className="text-xs text-gray-500 hidden sm:inline">• {calculateTimeSince(selectedOrder?.orderTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCloseModal} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className={`overflow-y-auto ${isMobile ? 'h-[calc(100vh-140px)] p-3' : 'max-h-[calc(90vh-140px)] p-4'}`}>
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 text-sm">Loading order details...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mx-auto mb-2 sm:mb-3" />
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Failed to load details</h4>
                    <p className="text-gray-600 text-xs mb-3 max-w-xs mx-auto">{error}</p>
                    <button onClick={() => fetchOrderDetails(selectedOrder.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs">
                      Retry
                    </button>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Customer Information</span>
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500">Customer Name</div>
                            <div className="font-medium text-gray-900 text-sm">
                              {orderDetails.customer_name || selectedOrder?.customerName || `Table ${selectedOrder?.tableNumber}`}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Number of Guests</div>
                            <div className="font-medium text-gray-900 text-sm">
                              {orderDetails.customer_count || selectedOrder?.customerCount || 1} people
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Order Timeline</span>
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500">Order Time</div>
                            <div className="font-medium text-gray-900 text-sm">
                              {formatTime(selectedOrder?.orderTime)} • {formatDate(selectedOrder?.orderTime)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Status</div>
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(orderDetails.status || selectedOrder?.status)}`}>
                              {getStatusTranslation(orderDetails.status || selectedOrder?.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Order Items</h3>
                          <span className="ml-auto text-xs text-gray-500">{(orderDetails.items || []).length} items</span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto">
                        {(orderDetails.items || []).length > 0 ? (
                          orderDetails.items.map((item, index) => (
                            <div key={index} className="p-2 sm:p-3 hover:bg-gray-50">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-blue-600 font-bold text-xs">{item.quantity}x</span>
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                        {item.menu_item_name || `Item ${index + 1}`}
                                      </h4>
                                      <div className="text-xs text-gray-600 mt-0.5">ETB {item.price || '0.00'} each</div>
                                      {item.special_instructions && (
                                        <p className="text-xs text-gray-600 mt-1">"{item.special_instructions}"</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap ml-2">
                                  ETB {(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 sm:p-6 text-center">
                            <p className="text-gray-500 text-sm">No items available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Order Total</h3>
                          <p className="text-xs text-gray-500 hidden sm:block">Including all items</p>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-gray-900">
                          ETB {parseFloat(orderDetails.total_amount || selectedOrder?.total || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📄</div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">No Details Available</h4>
                    <p className="text-gray-600 text-xs">Failed to load order details</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <div className="w-full sm:w-auto">
                    {selectedOrder?.status === 'ready' && (
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Mark order ${selectedOrder.orderNumber} as served?\n\nTable: ${selectedOrder.tableNumber}`
                          );
                          if (confirmed) {
                            updateOrderStatus(selectedOrder.id, 'completed');
                            handleCloseModal();
                          }
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded font-medium transition text-xs sm:text-sm"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Mark as Served</span>
                      </button>
                    )}
                  </div>
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition text-xs sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}