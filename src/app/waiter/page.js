'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { menuItems, tables } from '../lib/data';
import Sidebar from '../../components/waiter/Sidebar';
import TopBar from '../../components/waiter/TopBar';
import CartSidebar from '../../components/waiter/CartSidebar';
import TablesView from '../../components/waiter/TablesView';
import MenuView from '../../components/waiter/MenuView';
import OrdersView from '../../components/waiter/OrdersView';
import ReportsView from '../../components/waiter/ReportsView';
import SettingsView from '../../components/waiter/SettingsView';
import DailyOrders from '../../components/waiter/DailyOrders';
import '../lib/i18n'; // Import i18n configuration

export default function WaiterDashboard() {
  const { t, i18n } = useTranslation();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('tables');
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showDailyOrders, setShowDailyOrders] = useState(false);

  const categories = [
    { key: 'All', label: t('menu.category.all') },
    { key: 'Starters', label: t('menu.category.starters') },
    { key: 'Main Course', label: t('menu.category.mainCourse') },
    { key: 'Drinks', label: t('menu.category.drinks') },
    { key: 'Desserts', label: t('menu.category.desserts') },
  ];

  // Filter items by category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Popular items
  const popularItems = menuItems.filter(item => item.popular);

  // Add item to cart
  const addToCart = (item) => {
    if (!item.available || !selectedTable) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          ...item, 
          quantity: 1,
          specialInstructions: ''
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item.id !== itemId);
      } else {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  // Update special instructions
  const updateInstructions = (itemId, instructions) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Place order
  const placeOrder = () => {
    if (cart.length === 0 || !selectedTable) return;
    
    const newOrder = {
      id: Date.now(),
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      orderNumber: `ORD-${String(orders.length + 100).padStart(3, '0')}`,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions,
        preparationTime: item.preparationTime
      })),
      status: 'pending',
      orderTime: new Date().toISOString(),
      total: cartTotal,
      estimatedTime: Math.max(...cart.map(item => item.preparationTime))
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setShowCart(false);
    setSelectedTable(null);
  };

  // Get table orders
  const getTableOrders = (tableId) => {
    return orders.filter(order => order.tableId === tableId && order.status !== 'completed');
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // If showing daily orders, render only DailyOrders component
  if (showDailyOrders) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar 
            activeView="daily-orders"
            cart={cart}
            setShowCart={setShowCart}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
          <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
            <DailyOrders 
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              setShowDailyOrders={setShowDailyOrders}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        orders={orders}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar 
          activeView={activeView}
          cart={cart}
          setShowCart={setShowCart}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />

        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {activeView === 'tables' && (
            <TablesView 
              tables={tables}
              setSelectedTable={setSelectedTable}
              setActiveView={setActiveView}
              orders={orders}
              getTableOrders={getTableOrders}
            />
          )}

          {activeView === 'menu' && (
            <MenuView 
              selectedTable={selectedTable}
              setActiveView={setActiveView}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
              filteredItems={filteredItems}
              popularItems={popularItems}
              addToCart={addToCart}
            />
          )}

          {activeView === 'orders' && (
            <OrdersView 
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView 
              setActiveView={setActiveView}
              setShowDailyOrders={setShowDailyOrders}
            />
          )}
          
          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>

      {showCart && (
        <CartSidebar 
          cart={cart}
          setShowCart={setShowCart}
          selectedTable={selectedTable}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          updateInstructions={updateInstructions}
          clearCart={clearCart}
          placeOrder={placeOrder}
        />
      )}
    </div>
  );
}