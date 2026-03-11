'use client';
import { useState } from 'react';
import { X, Plus, Minus, Search, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../../lib/api';
import AuthService from '@/lib/auth-utils';

const orderStatuses = [
  { status: 'pending',   title: 'Pending',          emoji: '🕐', headerBg: 'bg-blue-600',   cardBorder: 'border-blue-200 bg-blue-50',   buttonLabel: 'Mark Preparing', buttonColor: 'bg-orange-500 hover:bg-orange-600' },
  { status: 'preparing', title: 'Preparing',         emoji: '🍳', headerBg: 'bg-amber-500',  cardBorder: 'border-amber-200 bg-amber-50', buttonLabel: 'Mark Ready',     buttonColor: 'bg-green-600 hover:bg-green-700' },
  { status: 'ready',     title: 'Ready for Pickup',  emoji: '✅', headerBg: 'bg-green-600',  cardBorder: 'border-green-200 bg-green-50', buttonLabel: 'Complete',       buttonColor: 'bg-purple-600 hover:bg-purple-700' },
];

const isNewItem = (item, orderTime) => {
  if (!item.createdAt || !orderTime) return false;
  return new Date(item.createdAt).getTime() - new Date(orderTime).getTime() > 30000;
};

export default function CashierKitchenOrdersView({
  orders = [],
  markOrderPreparing,
  markOrderReady,
  completeOrder,
  isLoading,
  error,
  onRefresh,
  menuItems = []   // ← needed for Add Items modal
}) {
  const [activeTab, setActiveTab] = useState('pending');

  // ── Add Items state ──────────────────────────────────────────
  const [showAddItems, setShowAddItems]           = useState(false);
  const [addItemsOrder, setAddItemsOrder]         = useState(null);
  const [addCart, setAddCart]                     = useState([]);
  const [addSearchTerm, setAddSearchTerm]         = useState('');
  const [addActiveCategory, setAddActiveCategory] = useState('All');
  const [isSubmitting, setIsSubmitting]           = useState(false);
  const [addItemsError, setAddItemsError]         = useState(null);
  // ────────────────────────────────────────────────────────────

  const safeOrders = Array.isArray(orders) ? orders : [];
  const getOrdersByStatus = (status) => safeOrders.filter(o => o?.status === status);
  const activeOrdersCount = safeOrders.filter(o => o?.status && o.status !== 'completed').length;

  const getOrderItems = (order) => {
    if (!order) return [];
    if (order.items && Array.isArray(order.items)) return order.items;
    if (order.rawOrder?.items) return order.rawOrder.items;
    return [];
  };

  const getItemName = (item) =>
    item?.item_name || item?.name || `Item ${item?.id || ''}`;

  const formatTime = (t) =>
    t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

  // ── Add Items handlers ───────────────────────────────────────
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

  const addToAddCart = (item) =>
    setAddCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, specialInstructions: '' }];
    });

  const removeFromAddCart = (itemId) =>
    setAddCart(prev => {
      const ex = prev.find(i => i.id === itemId);
      if (ex && ex.quantity > 1) return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== itemId);
    });

  const updateInstructions = (itemId, val) =>
    setAddCart(prev => prev.map(i => i.id === itemId ? { ...i, specialInstructions: val } : i));

  const handleSubmitAdditionalItems = async () => {
    if (addCart.length === 0) return;
    const token = AuthService.getToken();
    if (!token) { setAddItemsError('Not authenticated'); return; }
    setIsSubmitting(true);
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
      onRefresh();
    } catch (err) {
      setAddItemsError(err.message || 'Failed to add items');
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuCategories = ['All', ...Array.from(new Set(menuItems.map(i => i.category).filter(Boolean)))];
  const filteredMenuItems = menuItems.filter(item =>
    item.available &&
    (addActiveCategory === 'All' || item.category === addActiveCategory) &&
    (addSearchTerm === '' || item.name.toLowerCase().includes(addSearchTerm.toLowerCase()))
  );
  const addCartTotal = addCart.reduce((s, i) => s + i.price * i.quantity, 0);
  // ────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Kitchen Orders</h3>
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-3"><div className="h-20 bg-gray-200 rounded" /><div className="h-20 bg-gray-200 rounded" /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Kitchen Orders</h3>
          <button onClick={onRefresh} className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg">Retry</button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

  // ── Order card (shared between tab and grid views) ───────────
  const OrderCard = ({ order, statusConfig }) => {
    const orderItems = getOrderItems(order);
    const hasNewItems = !!order.hasNewItems;
    const isActive = statusConfig.status !== 'ready';

    return (
      <div className={`border rounded-xl p-4 transition-all ${
        hasNewItems
          ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300'
          : statusConfig.cardBorder
      }`}>
        {/* New items warning */}
        {hasNewItems && (
          <div className="flex items-center gap-1.5 mb-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            ⚠️ New items added — needs re-preparing
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-bold text-gray-900 text-sm">#{order.orderNumber || order.id}</h5>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span className="text-xs text-gray-500">
                {order.tableNumber && order.tableNumber !== 'N/A' ? `🪑 ${order.tableNumber}` : '📦 Takeaway'}
              </span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-500">👤 {order.customerName || 'Walk-in'}</span>
              {order.waiterName && (
                <>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-blue-600 font-medium">🧑‍🍳 {order.waiterName}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <span className="text-xs text-gray-500">{formatTime(order.orderTime)}</span>
            {order.total && <p className="text-xs text-gray-400">ETB {parseFloat(order.total).toFixed(2)}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="mb-3 bg-white/60 rounded-lg p-2.5 border border-white">
          {orderItems.length > 0 ? (
            <ul className="space-y-1.5">
              {orderItems.map((item, idx) => {
                const itemIsNew = hasNewItems && isNewItem(item, order.orderTime);
                return (
                  <li key={idx} className={`flex items-start justify-between gap-2 rounded-lg px-2 py-1 ${itemIsNew ? 'bg-amber-100 border border-amber-300' : ''}`}>
                    <div className="flex items-start gap-1.5 min-w-0">
                      {itemIsNew && <span className="text-amber-600 text-xs font-bold flex-shrink-0 mt-0.5">NEW</span>}
                      <span className="text-sm text-gray-800">{item.quantity || 1}× {getItemName(item)}</span>
                    </div>
                    {item.specialInstructions && (
                      <span className="text-xs text-amber-700 text-right flex-shrink-0 max-w-28 truncate">⚠ {item.specialInstructions}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 text-center py-1">No items</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Add Items — only for active orders */}
          {isActive && (
            <button
              onClick={() => handleOpenAddItems(order)}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Plus size={12} /> Add Items
            </button>
          )}

          {/* Status action */}
          <button
            onClick={() => {
              if (statusConfig.status === 'pending') markOrderPreparing(order.id);
              else if (statusConfig.status === 'preparing' && !hasNewItems) markOrderReady(order.id);
              else if (statusConfig.status === 'preparing' && hasNewItems) markOrderPreparing(order.id);
              else if (statusConfig.status === 'ready' && hasNewItems) markOrderPreparing(order.id);
              else if (statusConfig.status === 'ready') completeOrder(order.id);
            }}
            className={`flex-1 text-white py-2 px-3 rounded-lg text-xs font-semibold transition ${
              statusConfig.status === 'preparing' && hasNewItems
                ? 'bg-amber-500 hover:bg-amber-600'
                : statusConfig.status === 'ready' && hasNewItems
                ? 'bg-amber-500 hover:bg-amber-600'
                : statusConfig.buttonColor
            }`}
          >
            {statusConfig.status === 'preparing' && hasNewItems ? '⚠️ Re-prepare with new items'
              : statusConfig.status === 'ready' && hasNewItems ? '⚠️ Re-prepare with new items'
              : statusConfig.buttonLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Kitchen Orders</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-xl border">{activeOrdersCount} active</span>
          <button onClick={onRefresh} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl border">↻ Refresh</button>
        </div>
      </div>

      {/* Tab bar — below xl */}
      <div className="flex xl:hidden gap-2 bg-gray-100 p-1 rounded-xl">
        {orderStatuses.map(s => {
          const count = getOrdersByStatus(s.status).length;
          return (
            <button
              key={s.status}
              onClick={() => setActiveTab(s.status)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === s.status ? `${s.headerBg} text-white shadow` : 'text-gray-600 hover:bg-white'
              }`}
            >
              <span>{s.emoji}</span>
              <span className="hidden sm:inline">{s.title}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === s.status ? 'bg-white/30 text-white' : 'bg-white text-gray-700'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile/tablet: tabbed single column */}
      <div className="xl:hidden space-y-3">
        {orderStatuses.filter(s => s.status === activeTab).map(statusConfig => {
          const statusOrders = getOrdersByStatus(statusConfig.status);
          return statusOrders.length > 0
            ? statusOrders.map(order => <OrderCard key={order.id} order={order} statusConfig={statusConfig} />)
            : (
              <div key={statusConfig.status} className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-gray-400 text-sm">{statusConfig.emoji} No {statusConfig.title.toLowerCase()} orders</p>
              </div>
            );
        })}
      </div>

      {/* Large desktop: 3 columns */}
      <div className="hidden xl:grid xl:grid-cols-3 gap-5">
        {orderStatuses.map(statusConfig => {
          const statusOrders = getOrdersByStatus(statusConfig.status);
          return (
            <div key={statusConfig.status} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
              <div className={`${statusConfig.headerBg} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span>{statusConfig.emoji}</span>
                  <h4 className="font-bold text-white text-sm">{statusConfig.title}</h4>
                </div>
                <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full">{statusOrders.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-260px)]">
                {statusOrders.length > 0
                  ? statusOrders.map(order => <OrderCard key={order.id} order={order} statusConfig={statusConfig} />)
                  : (
                    <div className="text-center py-10">
                      <p className="text-gray-400 text-sm">{statusConfig.emoji} No orders here</p>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Items Modal ──────────────────────────────────────── */}
      {showAddItems && addItemsOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseAddItems} />
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b p-4 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Add Items to Order #{addItemsOrder.orderNumber}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {addItemsOrder.tableNumber ? `Table ${addItemsOrder.tableNumber}` : '📦 Takeaway'} • Current total: ETB {parseFloat(addItemsOrder.total || 0).toFixed(2)}
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

                {/* Categories */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {menuCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAddActiveCategory(cat)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        addActiveCategory === cat ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
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
                            <button onClick={() => removeFromAddCart(item.id)} className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100">
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 w-5 text-center text-sm">{inCart.quantity}</span>
                            <button onClick={() => addToAddCart(item)} className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center hover:bg-amber-600">
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToAddCart(item)} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium flex-shrink-0">
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Special instructions */}
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
                            onChange={(e) => updateInstructions(item.id, e.target.value)}
                            placeholder="Any special instructions? (optional)"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 bg-white border-t p-4">
                {addItemsError && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{addItemsError}
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
                    <button onClick={handleCloseAddItems} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 disabled:opacity-50">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAdditionalItems}
                      disabled={addCart.length === 0 || isSubmitting}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Adding...</> : <><PlusCircle className="w-4 h-4" /> Add to Order</>}
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