'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { tablesAPI, menuAPI, ordersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils'; // Import AuthService
import Sidebar from '../../../components/waiter/Sidebar';
import TopBar from '../../../components/waiter/TopBar';
import CartSidebar from '../../../components/waiter/CartSidebar';
import TablesView from '../../../components/waiter/TablesView';
import MenuView from '../../../components/waiter/MenuView';
import OrdersView from '../../../components/waiter/OrdersView';
import ReportsView from '../../../components/waiter/ReportsView';
import SettingsView from '../../../components/waiter/SettingsView';
import DailyOrders from '../../../components/waiter/DailyOrders';
import '../../../lib/i18n';

export default function WaiterDashboard() {
  const { t, i18n } = useTranslation();
  const { user, token: authContextToken, logout } = useAuth();
  
  // State
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
  const [isLoading, setIsLoading] = useState(false);
  
  // State for API data
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingData, setLoadingData] = useState({
    tables: true,
    menu: true,
    orders: false, // Start as false, we'll fetch on demand
  });
  const [error, setError] = useState({
    tables: null,
    menu: null,
    orders: null,
  });

  const [categories, setCategories] = useState([]);

  // Debug: Check auth state
  console.log('🔐 Auth state:', {
    authContextToken: authContextToken ? 'Yes' : 'No',
    authServiceToken: AuthService.getToken() ? 'Yes' : 'No',
    user: user,
    isAuthenticated: AuthService.getToken() ? 'Yes' : 'No'
  });

  // Fetch tables and menu on mount
  useEffect(() => {
    console.log('📦 Initial data fetch');
    fetchTables();
    fetchMenuItems();
  }, []);

  // Fetch orders when switching to orders view OR when we have a token
  useEffect(() => {
    if (activeView === 'orders') {
      console.log('🔍 Switching to orders view, fetching orders...');
      fetchOrders();
    }
  }, [activeView]);

  // Also fetch orders when token becomes available
  useEffect(() => {
    const authToken = AuthService.getToken();
    if (authToken && activeView === 'orders' && orders.length === 0) {
      console.log('🔑 Token available, fetching orders...');
      fetchOrders();
    }
  }, [authContextToken, activeView]);

  const fetchTables = async () => {
    try {
      setLoadingData(prev => ({ ...prev, tables: true }));
      setError(prev => ({ ...prev, tables: null }));
      const tablesData = await tablesAPI.getTables();
      
      const transformedTables = tablesData.map(table => ({
        id: table.id,
        number: table.table_number,
        capacity: table.capacity,
        status: table.status,
        customers: table.customer_count || 0,
        section: table.section
      }));
      
      setTables(transformedTables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError(prev => ({ ...prev, tables: 'Failed to load tables from server' }));
    } finally {
      setLoadingData(prev => ({ ...prev, tables: false }));
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoadingData(prev => ({ ...prev, menu: true }));
      setError(prev => ({ ...prev, menu: null }));
      const menuData = await menuAPI.getMenuItems();
      
      const transformedMenuItems = menuData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price) || 0,
        category: item.category_name || item.category_id,
        available: item.available === 1 || item.available === true,
        popular: item.popular === 1 || item.popular === true,
        preparationTime: item.preparation_time || 10,
        image: item.image,
        ingredients: item.ingredients
      }));
      
      setMenuItems(transformedMenuItems);
      
      const uniqueCategories = {};
      menuData.forEach(item => {
        const categoryName = item.category_name || `Category ${item.category_id}`;
        if (!uniqueCategories[categoryName]) {
          uniqueCategories[categoryName] = {
            key: categoryName,
            label: categoryName
          };
        }
      });
      
      const allCategories = [
        { key: 'All', label: 'All' },
        ...Object.values(uniqueCategories)
      ];
      setCategories(allCategories);
      
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError(prev => ({ ...prev, menu: 'Failed to load menu items from server' }));
    } finally {
      setLoadingData(prev => ({ ...prev, menu: false }));
    }
  };

  // FIXED: Use AuthService.getToken() like placeOrder does
  const fetchOrders = async () => {
    console.log('🚀 === fetchOrders STARTED ===');
    
    // Use AuthService.getToken() - SAME AS placeOrder
    const authToken = AuthService.getToken();
    
    console.log('🔐 Using AuthService.getToken():', authToken ? 'Yes' : 'No');
    
    if (!authToken) {
      console.error('❌ No auth token from AuthService');
      setError(prev => ({ ...prev, orders: 'Please login again' }));
      return;
    }
    
    try {
      setLoadingData(prev => ({ ...prev, orders: true }));
      setError(prev => ({ ...prev, orders: null }));
      
      console.log('📡 Calling ordersAPI.getWaiterOrders...');
      const ordersData = await ordersAPI.getWaiterOrders(authToken);
      
      console.log('✅ ordersAPI.getWaiterOrders returned:', ordersData);
      console.log('✅ Type:', typeof ordersData);
      console.log('✅ Is array?', Array.isArray(ordersData));
      
      if (!Array.isArray(ordersData)) {
        console.error('❌ ordersData is not an array:', ordersData);
        setOrders([]);
        return;
      }
      
      console.log('✅ Number of orders:', ordersData.length);
      
      // Transform orders
      const transformedOrders = ordersData.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        tableId: order.table_id,
        tableNumber: order.table_number || `T${order.table_id}`,
        items: [], // We'll fetch on demand
        status: order.status,
        total: parseFloat(order.total_amount) || 0,
        orderTime: order.order_time || order.created_at,
        estimatedTime: order.estimated_ready_time,
        customerName: order.customer_name || `Table ${order.table_number || order.table_id}`,
        customerCount: order.customer_count || 1,
        notes: order.notes || '',
        rawOrder: order
      }));
      
      console.log('✅ Setting', transformedOrders.length, 'orders to state');
      setOrders(transformedOrders);
      
    } catch (error) {
      console.error('❌ Error in fetchOrders:', error);
      setError(prev => ({ 
        ...prev, 
        orders: error.message || 'Failed to load orders from server' 
      }));
    } finally {
      setLoadingData(prev => ({ ...prev, orders: false }));
      console.log('🏁 === fetchOrders COMPLETED ===');
    }
  };

  // Filter items by category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Popular items
  const popularItems = menuItems.filter(item => item.popular);

  // Add item to cart
  const addToCart = (item) => {
    if (!item.available || !selectedTable) {
      if (!selectedTable) {
        alert('Please select a table first');
      } else if (!item.available) {
        alert(`Sorry, ${item.name} is not available`);
      }
      return;
    }
    
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

  // Place order - ALREADY WORKING
  // Place order - FIXED to use customerName parameter
const placeOrder = async (customerName = '') => {
  console.log('🚀 === placeOrder STARTED ===');
  console.log('📝 Customer name parameter received:', customerName);
  console.log('📝 Customer name type:', typeof customerName);
  console.log('📝 Customer name trimmed:', customerName?.trim());
  console.log('📝 Customer name length after trim:', customerName?.trim()?.length);
  
  if (cart.length === 0 || !selectedTable) {
    console.error('❌ Validation failed: No cart items or no table selected');
    alert('Please select items and a table first');
    return;
  }
  
  const authToken = AuthService.getToken();
  
  if (!authToken) {
    console.error('❌ No auth token');
    alert('Session expired. Please login again.');
    return;
  }
  
  try {
    setIsLoading(true);
    
    // DEBUG: Check what we're working with
    console.log('🔍 Selected table:', selectedTable.number);
    console.log('🔍 Default table name:', `Table ${selectedTable.number}`);
    
    // Handle customer name - IMPORTANT FIX!
    let finalCustomerName;
    
    if (customerName && customerName.trim().length > 0) {
      // Use the provided customer name
      finalCustomerName = customerName.trim();
      console.log('✅ Using provided customer name:', finalCustomerName);
    } else {
      // Use default table name
      finalCustomerName = `Table ${selectedTable.number}`;
      console.log('⚠️ No customer name provided, using default:', finalCustomerName);
    }
    
    console.log('📋 Final customer name to send:', finalCustomerName);
    
    // Prepare order data
    const orderData = {
      table_id: selectedTable.id,
      customer_name: finalCustomerName, // This should now be correct
      customer_count: selectedTable.customers || 1,
      notes: '',
      items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        special_instructions: item.specialInstructions || ''
      }))
    };

    console.log('📤 Order data being sent:', JSON.stringify(orderData, null, 2));
    
    // Create order via API
    console.log('📡 Making API call to create order...');
    const response = await ordersAPI.createOrder(orderData, authToken);
    
    console.log('✅ API Response:', response);
    console.log('✅ Order customer_name in response:', response.order?.customer_name);
    
    if (response.success) {
      console.log('🎉 Order created successfully!');
      
      // Transform the response
      const newOrder = {
        id: response.order.id,
        orderNumber: response.order.order_number,
        tableId: response.order.table_id,
        tableNumber: selectedTable.number,
        items: response.items || [],
        status: response.order.status || 'pending',
        total: parseFloat(response.order.total_amount) || cartTotal,
        orderTime: response.order.created_at || new Date().toISOString(),
        estimatedTime: response.order.estimated_ready_time,
        customerName: response.order.customer_name || finalCustomerName, // Use the customer name
        customerCount: response.order.customer_count || selectedTable.customers || 1,
        rawOrder: response.order
      };
      
      console.log('📝 New order created with customer name:', newOrder.customerName);
      
      // Add to beginning of orders list
      setOrders(prev => [newOrder, ...prev]);
      
      // Clear cart and close sidebar
      setCart([]);
      setShowCart(false);
      
      // Refresh tables to update status
      fetchTables();
      
      // Show success message with customer name
      alert(`✅ Order ${response.order.order_number} for ${finalCustomerName} placed successfully!`);
      
      // Reset selected table
      setSelectedTable(null);
      
      // Switch to orders view to see the new order
      setActiveView('orders');
    } else {
      console.error('❌ Order creation failed in response');
      alert(`❌ Order creation failed: ${response.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ Error in placeOrder:', error);
    console.error('❌ Error details:', error.message);
    alert(`❌ Failed to place order: ${error.message}`);
  } finally {
    console.log('🏁 === placeOrder COMPLETED ===');
    setIsLoading(false);
  }
};
  // Get table orders
  const getTableOrders = (tableId) => {
    return orders.filter(order => 
      order.tableId === tableId && 
      ['pending', 'preparing', 'ready'].includes(order.status)
    );
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    // Use AuthService.getToken()
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Update via API
      const response = await ordersAPI.updateOrderStatus(orderId, newStatus, authToken);
      
      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { 
            ...order, 
            status: newStatus,
            ...(response.order || {})
          } : order
        ));
        
        // If order is completed, refresh tables
        if (newStatus === 'completed') {
          fetchTables();
        }
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  // Handle logout using auth context
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
  };

  // Refresh data
  const refreshData = () => {
    fetchTables();
    fetchMenuItems();
    if (activeView === 'orders') {
      fetchOrders();
    }
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
  setSidebarOpen={setSidebarOpen} // Add this
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
        handleLogout={handleLogout}
        isLoading={isLoading}
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
  setSidebarOpen={setSidebarOpen} // Add this
/>

        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {error.tables && activeView === 'tables' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700">{error.tables}</span>
                <button 
                  onClick={fetchTables}
                  className="ml-auto text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {error.menu && activeView === 'menu' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700">{error.menu}</span>
                <button 
                  onClick={fetchMenuItems}
                  className="ml-auto text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {error.orders && activeView === 'orders' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700">{error.orders}</span>
                <button 
                  onClick={fetchOrders}
                  className="ml-auto text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {activeView === 'tables' && (
            <TablesView 
              tables={tables}
              setSelectedTable={setSelectedTable}
              setActiveView={setActiveView}
              orders={orders}
              getTableOrders={getTableOrders}
              isLoading={loadingData.tables}
              error={error.tables}
              refreshTables={fetchTables}
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
              isLoading={loadingData.menu}
            />
          )}

          {activeView === 'orders' && (
            <OrdersView 
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              setActiveView={setActiveView}
              isLoading={loadingData.orders}
              refreshOrders={fetchOrders}
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
          setCart={setCart}
          showCart={showCart}
          setShowCart={setShowCart}
          selectedTable={selectedTable}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          updateInstructions={updateInstructions}
          clearCart={clearCart}
          placeOrder={placeOrder}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}