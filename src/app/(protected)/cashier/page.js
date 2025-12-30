'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context'; // ADD AUTH
import { 
  Users, ShoppingCart, Bell, DollarSign, BarChart3, Settings 
} from 'lucide-react';

// Import local data
import { menuItems, tables } from '../../../lib/data';

// Layout Components
import Sidebar from '../../../components/cashier/Sidebar';
import SidebarOverlay from '../../../components/cashier/SidebarOverlay';
import TopBar from '../../../components/cashier/TopBar';

// View Components
import OrderTakingView from '../../../components/cashier/OrderTakingView';
import KitchenOrdersView from '../../../components/cashier/KitchenOrdersView';
import PagerManagementView from '../../../components/cashier/PagerManagementView';
import BillingView from '../../../components/cashier/BillingView';
import ReportsView from '../../../components/cashier/ReportsView';
import SettingsView from '../../../components/cashier/SettingsView';

// Modal Components
import PaymentModal from '../../../components/cashier/PaymentModal';
import PagerHistoryModal from '../../../components/cashier/PagerHistoryModal';

export default function SelfServeCashierDashboard() {
  const { logout } = useAuth(); // GET LOGOUT FUNCTION
  
  // State
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeView, setActiveView] = useState('tables');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [pagers, setPagers] = useState([]);
  const [showPagerModal, setShowPagerModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [], customerName: '', pagerNumber: null });
  const [paymentData, setPaymentData] = useState({ method: 'cash', amount: 0, tip: 0, split: 1 });
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ADD LOADING STATE
  
  // Counter for generating unique IDs (prevents hydration mismatch)
  const orderIdCounter = useRef(1000);
  
  const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];
  
  // Safe filtering
  const popularItems = Array.isArray(menuItems) 
    ? menuItems.filter(item => item?.popular === true)
    : [];

  // Filter items by category and search
  const filteredItems = Array.isArray(menuItems) 
    ? menuItems.filter(item => {
        if (!item) return false;
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = 
          (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
    : [];

  // Initialize pagers (1-20) - use static data to prevent hydration issues
  useEffect(() => {
    const initialPagers = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      status: 'available',
      orderId: null,
      assignedAt: null
    }));
    setPagers(initialPagers);
  }, []);

  const demoTimeoutRef = useRef(null);

  // Handle logout using auth context
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    // Auth context handles redirect to /login
  };

  // Cart functions
  const addToCart = (item) => {
    if (!item || !item.available) return;
    
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

  const clearCart = () => {
    setCart([]);
    setCurrentOrder(prev => ({ ...prev, customerName: '', pagerNumber: null }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const assignPager = () => {
    const availablePager = pagers.find(p => p.status === 'available');
    if (availablePager) {
      setCurrentOrder(prev => ({ ...prev, pagerNumber: availablePager.number }));
      setPagers(prev => prev.map(p => 
        p.number === availablePager.number 
          ? { ...p, status: 'assigned' }
          : p
      ));
      return availablePager.number;
    }
    return null;
  };

  const placeOrder = () => {
    if (cart.length === 0 || !currentOrder.customerName) return;
    
    const pagerNumber = currentOrder.pagerNumber || assignPager();
    if (!pagerNumber) {
      alert('No pagers available. Please wait for a pager to be returned.');
      return;
    }

    // Use counter instead of Date.now() to prevent hydration mismatch
    const orderId = orderIdCounter.current + 1;
    orderIdCounter.current = orderId;

    const newOrder = {
      id: orderId,
      tableId: currentOrder.tableId,
      tableNumber: currentOrder.tableId ? tables.find(t => t.id === currentOrder.tableId)?.number : 'Takeaway',
      orderNumber: `ORD-${String(orders.length + 100).padStart(3, '0')}`,
      customerName: currentOrder.customerName,
      pagerNumber: pagerNumber,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions,
        preparationTime: item.preparationTime || 10
      })),
      status: 'pending',
      orderTime: new Date().toISOString(),
      total: cartTotal,
      estimatedTime: Math.max(...cart.map(item => item.preparationTime || 10)),
      paymentStatus: 'pending'
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Update pager status
    setPagers(prev => prev.map(p => 
      p.number === pagerNumber 
        ? { ...p, status: 'active', orderId: newOrder.id, assignedAt: new Date().toISOString() }
        : p
    ));
    
    setCart([]);
    setCurrentOrder({ tableId: null, items: [], customerName: '', pagerNumber: null });
    
    // Auto-process payment for self-serve
    setTimeout(() => {
      processPayment(newOrder);
    }, 1000);
  };

  const processPayment = (order) => {
    setSelectedOrder(order);
    setPaymentData({
      method: 'cash',
      amount: order.total,
      tip: 0,
      split: 1
    });
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id ? { ...o, paymentStatus: 'paid', payment: paymentData } : o
      ));
      
      // Send order to kitchen after payment
      setTimeout(() => {
        setOrders(prev => prev.map(o => 
          o.id === selectedOrder.id ? { ...o, status: 'preparing' } : o
        ));
      }, 2000);
      
      setShowPaymentModal(false);
      setSelectedOrder(null);
    }
  };

  const markOrderReady = (orderId) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'ready' } : o
    ));
    
    // Buzz the pager
    const order = orders.find(o => o.id === orderId);
    if (order) {
      console.log(`🛎️ Buzzing pager #${order.pagerNumber} for order ${order.orderNumber}`);
      alert(`Pager #${order.pagerNumber} is now buzzing! Order ${order.orderNumber} is ready for pickup.`);
    }
  };

  const completeOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Return pager to available status
      setPagers(prev => prev.map(p => 
        p.number === order.pagerNumber 
          ? { ...p, status: 'available', orderId: null, assignedAt: null }
          : p
      ));
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'completed' } : o
      ));
    }
  };

  const resetDemo = () => {
    setOrders([]);
    setPagers(prev => prev.map(p => ({ ...p, status: 'available', orderId: null, assignedAt: null })));
  };

  const getAvailablePagers = () => pagers.filter(p => p.status === 'available').length;

  const menuItemsList = [
    { id: 'tables', icon: Users, label: 'Order Taking', view: 'tables', badge: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length },
    { id: 'orders', icon: ShoppingCart, label: 'Kitchen Orders', view: 'orders', badge: orders.filter(o => o.status === 'ready').length },
    { id: 'pagers', icon: Bell, label: 'Pager Management', view: 'pagers', badge: 0 },
    { id: 'billing', icon: DollarSign, label: 'Billing', view: 'billing', badge: 0 },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports', badge: 0 },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings', badge: 0 },
  ];

  const todaySales = {
    total: 0,
    transactions: 0,
    average: 0,
    cash: 0,
    card: 0,
    mobile: 0
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <SidebarOverlay sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar - WITH LOGOUT PROP */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        menuItemsList={menuItemsList}
        isLoading={isLoading}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <TopBar
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          cart={cart}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          getAvailablePagers={getAvailablePagers}
          todaySales={todaySales}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {activeView === 'tables' && (
            <OrderTakingView
              orders={orders}
              getAvailablePagers={getAvailablePagers}
              todaySales={todaySales}
              menuItems={menuItems}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              popularItems={popularItems}
              filteredItems={filteredItems}
              addToCart={addToCart}
              currentOrder={currentOrder}
              setCurrentOrder={setCurrentOrder}
              cart={cart}
              removeFromCart={removeFromCart}
              cartTotal={cartTotal}
              placeOrder={placeOrder}
              clearCart={clearCart}
              tables={tables}
            />
          )}

          {activeView === 'orders' && (
            <KitchenOrdersView
              orders={orders}
              markOrderReady={markOrderReady}
              completeOrder={completeOrder}
            />
          )}

          {activeView === 'pagers' && (
            <PagerManagementView
              pagers={pagers}
              orders={orders}
              getAvailablePagers={getAvailablePagers}
              setShowPagerModal={setShowPagerModal}
              resetDemo={resetDemo}
              setPagers={setPagers}
            />
          )}

          {activeView === 'billing' && (
            <BillingView
              orders={orders}
              setSelectedOrder={setSelectedOrder}
              processPayment={processPayment}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              todaySales={todaySales}
              pagers={pagers}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              resetDemo={resetDemo}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
            />
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        selectedOrder={selectedOrder}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        completePayment={completePayment}
      />

      {/* Pager History Modal */}
      <PagerHistoryModal
        showPagerModal={showPagerModal}
        setShowPagerModal={setShowPagerModal}
        pagers={pagers}
        orders={orders}
      />
    </div>
  );
}