'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Clock, CheckCircle, AlertCircle, Plus, Edit, Eye, 
  Utensils, DollarSign, Bell, Search, Filter, Home, 
  ShoppingCart, Package, BarChart3, Settings, Menu, LogOut,
  CreditCard, Receipt, Calculator, TrendingUp, ChevronDown,
  X, Download, Printer, Split, Percent, Calendar,
  Smartphone, QrCode, User, Shield, Database,
  ArrowLeft, Crown, RefreshCw, ChefHat, Vibrate
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function SelfServeCashierDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeView, setActiveView] = useState('tables');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [], customerName: '', pagerNumber: null });
  const [paymentData, setPaymentData] = useState({ method: 'cash', amount: 0, tip: 0, split: 1 });
  const [showSearch, setShowSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [pagers, setPagers] = useState([]);
  const [showPagerModal, setShowPagerModal] = useState(false);
  
  const demoTimeoutRef = useRef(null);

  // Initialize pagers (1-20)
  useEffect(() => {
    const initialPagers = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      status: 'available', // available, assigned, active
      orderId: null,
      assignedAt: null
    }));
    setPagers(initialPagers);
  }, []);

  // Menu data
  const menuItems = [
    {
      id: 1,
      name: 'Pasta Carbonara',
      description: 'Classic Italian pasta with creamy sauce and bacon',
      price: 180,
      category: 'Main Course',
      image: '🍝',
      available: true,
      popular: true,
      preparationTime: 15
    },
    {
      id: 2,
      name: 'Grilled Salmon',
      description: 'Fresh salmon with lemon butter sauce and seasonal vegetables',
      price: 280,
      category: 'Main Course',
      image: '🐟',
      available: true,
      popular: true,
      preparationTime: 20
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Crisp romaine with parmesan and croutons',
      price: 85,
      category: 'Starters',
      image: '🥗',
      available: true,
      popular: false,
      preparationTime: 8
    },
    {
      id: 4,
      name: 'Margherita Pizza',
      description: 'Traditional pizza with tomato, mozzarella, and basil',
      price: 160,
      category: 'Main Course',
      image: '🍕',
      available: true,
      popular: true,
      preparationTime: 12
    },
    {
      id: 5,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 45,
      category: 'Drinks',
      image: '🍊',
      available: true,
      popular: false,
      preparationTime: 3
    },
    {
      id: 6,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 95,
      category: 'Desserts',
      image: '🍰',
      available: true,
      popular: true,
      preparationTime: 5
    },
    {
      id: 7,
      name: 'Garlic Bread',
      description: 'Fresh baked bread with garlic and herbs',
      price: 45,
      category: 'Starters',
      image: '🍞',
      available: true,
      popular: false,
      preparationTime: 6
    },
    {
      id: 8,
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      price: 30,
      category: 'Drinks',
      image: '🥤',
      available: true,
      popular: false,
      preparationTime: 2
    }
  ];

  const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];
  const popularItems = menuItems.filter(item => item.popular);

  // Mock tables data
  const mockTables = [
    { id: 1, number: 'T01', capacity: 2, status: 'available', customerCount: 0, section: 'Main' },
    { id: 2, number: 'T02', capacity: 4, status: 'available', customerCount: 0, section: 'Main' },
    { id: 3, number: 'T03', capacity: 4, status: 'available', customerCount: 0, section: 'Main' },
    { id: 4, number: 'T04', capacity: 6, status: 'available', customerCount: 0, section: 'VIP' },
    { id: 5, number: 'T05', capacity: 2, status: 'available', customerCount: 0, section: 'Main' },
    { id: 6, number: 'T06', capacity: 4, status: 'available', customerCount: 0, section: 'Patio' },
    { id: 7, number: 'T07', capacity: 8, status: 'available', customerCount: 0, section: 'VIP' },
    { id: 8, number: 'T08', capacity: 2, status: 'available', customerCount: 0, section: 'Patio' },
  ];

  const mockOrders = [
    {
      id: 1,
      tableId: 1,
      tableNumber: 'T01',
      orderNumber: 'ORD-001',
      customerName: 'John Smith',
      pagerNumber: 5,
      items: [
        { id: 1, name: 'Pasta Carbonara', quantity: 1, price: 180, category: 'Main Course', specialInstructions: 'Extra cheese' },
        { id: 3, name: 'Caesar Salad', quantity: 2, price: 85, category: 'Salad' },
        { id: 5, name: 'Fresh Orange Juice', quantity: 2, price: 45, category: 'Drinks' }
      ],
      status: 'ready',
      orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
      total: 380,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      tableId: 3,
      tableNumber: 'T03',
      orderNumber: 'ORD-002',
      customerName: 'Sarah Johnson',
      pagerNumber: 8,
      items: [
        { id: 2, name: 'Grilled Salmon', quantity: 2, price: 280, category: 'Main Course' },
        { id: 4, name: 'Margherita Pizza', quantity: 1, price: 160, category: 'Main Course' },
        { id: 5, name: 'Fresh Orange Juice', quantity: 2, price: 45, category: 'Drinks' }
      ],
      status: 'preparing',
      orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
      total: 840,
      paymentStatus: 'paid'
    }
  ];

  const todaySales = {
    total: 4580.25,
    transactions: 28,
    average: 163.58,
    cash: 2450.00,
    card: 1860.25,
    mobile: 270.00
  };

  useEffect(() => {
    setTables(mockTables);
    setOrders(mockOrders);
    if (isDemoMode) startDemo();
    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, [isDemoMode]);

  const startDemo = () => {
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    const simulateDemo = () => {
      setOrders(prev => {
        let updated = [...prev];
        updated = updated.map(order => {
          const rand = Math.random();
          if (order.status === 'pending' && rand > 0.7) {
            return { ...order, status: 'preparing' };
          }
          if (order.status === 'preparing' && rand > 0.6) {
            return { ...order, status: 'ready' };
          }
          return order;
        });
        
        if (Math.random() > 0.8 && updated.length < 8) {
          const availablePager = pagers.find(p => p.status === 'available');
          if (availablePager) {
            const newOrder = {
              id: Date.now(),
              tableId: Math.floor(Math.random() * 8) + 1,
              tableNumber: `T0${Math.floor(Math.random() * 8) + 1}`,
              orderNumber: `ORD-${String(updated.length + 100).padStart(3, '0')}`,
              customerName: ['Alex', 'Maria', 'David', 'Lisa'][Math.floor(Math.random() * 4)],
              pagerNumber: availablePager.number,
              items: [
                { 
                  id: Math.floor(Math.random() * 8) + 1, 
                  name: 'Sample Item', 
                  quantity: Math.floor(Math.random() * 3) + 1, 
                  price: Math.floor(Math.random() * 200) + 50, 
                  category: 'Demo' 
                }
              ],
              status: 'pending',
              orderTime: new Date().toISOString(),
              total: Math.floor(Math.random() * 500) + 100,
              paymentStatus: 'paid'
            };
            updated.unshift(newOrder);
            
            // Update pager status
            setPagers(prev => prev.map(p => 
              p.number === availablePager.number 
                ? { ...p, status: 'active', orderId: newOrder.id, assignedAt: new Date().toISOString() }
                : p
            ));
          }
        }
        
        return updated;
      });

      if (isDemoMode) demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
    };
    demoTimeoutRef.current = setTimeout(simulateDemo, 8000);
  };

  // Cart functions
  const addToCart = (item) => {
    if (!item.available) return;
    
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

  const updateInstructions = (itemId, instructions) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
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

    const newOrder = {
      id: Date.now(),
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
        preparationTime: item.preparationTime
      })),
      status: 'pending',
      orderTime: new Date().toISOString(),
      total: cartTotal,
      estimatedTime: Math.max(...cart.map(item => item.preparationTime)),
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
    setShowCart(false);
    setCurrentOrder({ tableId: null, items: [], customerName: '', pagerNumber: null });
    
    // Auto-process payment for self-serve
    setTimeout(() => {
      processPayment(newOrder);
    }, 1000);
  };

  // Filter items by category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTableOrders = (tableId) => {
    return orders.filter(o => o.tableId === tableId && o.status !== 'completed');
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
      // In real implementation, this would send signal to physical pager
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

  const printReceipt = (order) => {
    console.log('Printing receipt for:', order.orderNumber);
  };

  const resetDemo = () => {
    setTables(mockTables);
    setOrders(mockOrders);
    setPagers(prev => prev.map(p => ({ ...p, status: 'available', orderId: null, assignedAt: null })));
  };

  const getTimeElapsed = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return diff < 1 ? 'Just now' : `${diff} min ago`;
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const getAvailablePagers = () => pagers.filter(p => p.status === 'available').length;

  const menuItemsList = [
    { id: 'tables', icon: Users, label: 'Order Taking', view: 'tables' },
    { id: 'orders', icon: ShoppingCart, label: 'Kitchen Orders', badge: orders.filter(o => o.status === 'ready').length, view: 'orders' },
    { id: 'pagers', icon: Bell, label: 'Pager Management', view: 'pagers' },
    { id: 'billing', icon: DollarSign, label: 'Billing', view: 'billing' },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

  // Mobile sidebar overlay
  const SidebarOverlay = () => (
    sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <SidebarOverlay />
      
      {/* Sidebar */}
      <div className={`fixed lg:static bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Self-Serve POS</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItemsList.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.view);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  activeView === item.view 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-blue-700 text-blue-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">Cashier</p>
                <p className="text-xs text-blue-300">Bistro Elegante</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm">{isLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                  {activeView === 'tables' && 'Order Taking'}
                  {activeView === 'orders' && 'Kitchen Orders'}
                  {activeView === 'pagers' && 'Pager Management'}
                  {activeView === 'billing' && 'Billing & Payments'}
                  {activeView === 'reports' && 'Sales Reports'}
                  {activeView === 'settings' && 'System Settings'}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Pager Status */}
              <div className="hidden lg:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {getAvailablePagers()}/20 Pagers Available
                </span>
              </div>

              {/* Search - Mobile */}
              {showSearch ? (
                <div className="lg:hidden relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    onClick={() => setShowSearch(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Search - Desktop */}
                  <div className="hidden lg:block relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 xl:w-64"
                    />
                  </div>

                  {/* Search Button - Mobile */}
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Cart Button */}
                  <button
                    onClick={() => setShowCart(true)}
                    className="relative bg-blue-600 hover:bg-blue-700 text-white p-2 lg:px-4 lg:py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full text-[10px] lg:text-xs">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </button>

                  {/* Demo Mode Toggle */}
                  {isDemoMode ? (
                    <button 
                      onClick={() => setIsDemoMode(false)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-xl font-medium text-sm"
                    >
                      Exit Demo
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsDemoMode(true)}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-medium text-sm"
                    >
                      Start Demo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          
          {/* Order Taking View */}
          {activeView === 'tables' && (
            <div className="space-y-6 lg:space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}</p>
                      <p className="text-sm text-gray-600">Active Orders</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{getAvailablePagers()}</p>
                      <p className="text-sm text-gray-600">Pagers Available</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Bell className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'ready').length}</p>
                      <p className="text-sm text-gray-600">Ready for Pickup</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">ETB {todaySales.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Today's Revenue</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Menu Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900">Menu</h3>
                      
                      {/* Category Navigation */}
                      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 lg:px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium text-sm flex-shrink-0 ${
                              activeCategory === category
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Popular Items */}
                    {activeCategory === 'All' && (
                      <div className="mb-6 lg:mb-8">
                        <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Popular Items</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                          {popularItems.map(item => (
                            <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4 hover:shadow-md transition">
                              <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl lg:text-2xl">{item.image}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                                  <p className="text-blue-600 font-bold text-sm lg:text-base">ETB {item.price}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="grid grid-cols-1 gap-4 lg:gap-6">
                      {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition">
                          <div className="flex gap-3 lg:gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                <span className="text-xl lg:text-2xl">{item.image}</span>
                              </div>
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-base lg:text-lg truncate">{item.name}</h4>
                                  <p className="text-gray-600 text-xs lg:text-sm mb-2 line-clamp-2">{item.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {item.price}</p>
                                  <p className="text-xs text-gray-500 flex items-center justify-end">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.preparationTime}m
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {item.category}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredItems.length === 0 && (
                      <div className="text-center py-8 lg:py-12 bg-white rounded-xl lg:rounded-2xl border">
                        <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🍽️</div>
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-600 text-sm lg:text-base">Try adjusting your search or select a different category</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info & Cart Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky top-4">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Order Summary</h3>
                    
                    {/* Customer Information */}
                    <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input
                          type="text"
                          value={currentOrder.customerName}
                          onChange={(e) => setCurrentOrder(prev => ({ ...prev, customerName: e.target.value }))}
                          placeholder="Enter customer name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Table Number (Optional)</label>
                        <select
                          value={currentOrder.tableId || ''}
                          onChange={(e) => setCurrentOrder(prev => ({ ...prev, tableId: e.target.value ? parseInt(e.target.value) : null }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                          <option value="">Takeaway / No Table</option>
                          {tables.map(table => (
                            <option key={table.id} value={table.id}>Table {table.number} ({table.section})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                      <h4 className="font-semibold text-gray-900">Cart Items ({cart.reduce((total, item) => total + item.quantity, 0)})</h4>
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">Cart is empty</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-600">ETB {item.price} × {item.quantity}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Total & Actions */}
                    {cart.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 lg:pt-6">
                        <div className="flex justify-between items-center mb-4 lg:mb-6">
                          <span className="text-lg lg:text-xl font-bold text-gray-900">Total:</span>
                          <span className="text-lg lg:text-xl font-bold text-blue-600">ETB {cartTotal}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <button
                            onClick={placeOrder}
                            disabled={!currentOrder.customerName}
                            className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-lg shadow-lg transition-colors ${
                              currentOrder.customerName
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {currentOrder.customerName ? `Place Order - ETB ${cartTotal}` : 'Enter Customer Name'}
                          </button>
                          
                          <button
                            onClick={clearCart}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base"
                          >
                            Clear Cart
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kitchen Orders View */}
          {activeView === 'orders' && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Kitchen Orders</h3>
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
                  {orders.filter(order => order.status !== 'completed').length} active orders
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Pending Orders */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h4 className="font-bold text-gray-900 text-lg">Pending</h4>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold">
                      {orders.filter(o => o.status === 'pending').length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'pending').map(order => (
                      <div key={order.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                            <p className="text-xs text-gray-500">Pager #{order.pagerNumber}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                        <button
                          onClick={() => markOrderReady(order.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          Mark as Ready
                        </button>
                      </div>
                    ))}
                    {orders.filter(o => o.status === 'pending').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending orders</p>
                    )}
                  </div>
                </div>

                {/* Preparing Orders */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h4 className="font-bold text-gray-900 text-lg">Preparing</h4>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm font-semibold">
                      {orders.filter(o => o.status === 'preparing').length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'preparing').map(order => (
                      <div key={order.id} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                            <p className="text-xs text-gray-500">Pager #{order.pagerNumber}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Preparing
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                        <button
                          onClick={() => markOrderReady(order.id)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          Mark as Ready
                        </button>
                      </div>
                    ))}
                    {orders.filter(o => o.status === 'preparing').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No orders preparing</p>
                    )}
                  </div>
                </div>

                {/* Ready Orders */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h4 className="font-bold text-gray-900 text-lg">Ready for Pickup</h4>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                      {orders.filter(o => o.status === 'ready').length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'ready').map(order => (
                      <div key={order.id} className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                            <p className="text-xs text-gray-500">Pager #{order.pagerNumber}</p>
                          </div>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Ready
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              // Buzz pager again
                              console.log(`🛎️ Buzzing pager #${order.pagerNumber} again`);
                              alert(`Pager #${order.pagerNumber} is buzzing again!`);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
                          >
                            Buzz Pager Again
                          </button>
                          <button
                            onClick={() => completeOrder(order.id)}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => o.status === 'ready').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No orders ready</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pager Management View */}
          {activeView === 'pagers' && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Pager Management</h3>
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
                  {getAvailablePagers()}/20 Pagers Available
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
                {pagers.map(pager => (
                  <div
                    key={pager.number}
                    className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border-2 p-4 text-center transition ${
                      pager.status === 'available'
                        ? 'border-green-200 bg-green-50 hover:bg-green-100'
                        : pager.status === 'assigned'
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                        : 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      pager.status === 'available'
                        ? 'bg-green-100 text-green-600'
                        : pager.status === 'assigned'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      <Bell className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">#{pager.number}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pager.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : pager.status === 'assigned'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pager.status}
                    </div>
                    {pager.status === 'active' && pager.orderId && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        Order: {orders.find(o => o.id === pager.orderId)?.orderNumber}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pager Actions */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-4 lg:mb-6">Pager Controls</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      // Test all active pagers
                      const activePagers = pagers.filter(p => p.status === 'active');
                      if (activePagers.length > 0) {
                        activePagers.forEach(pager => {
                          console.log(`🛎️ Testing pager #${pager.number}`);
                        });
                        alert(`Testing ${activePagers.length} active pagers...`);
                      } else {
                        alert('No active pagers to test');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    Test Active Pagers
                  </button>
                  
                  <button
                    onClick={() => {
                      // Return all pagers
                      setPagers(prev => prev.map(p => ({ ...p, status: 'available', orderId: null, assignedAt: null })));
                      alert('All pagers returned to available status');
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    Return All Pagers
                  </button>
                  
                  <button
                    onClick={() => {
                      // View pager history
                      setShowPagerModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    View Pager History
                  </button>
                  
                  <button
                    onClick={resetDemo}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing View */}
          {activeView === 'billing' && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Billing & Payments</h3>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Pager</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.orderNumber}</p>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">{order.customerName}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">#{order.pagerNumber}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <p className="font-bold text-gray-900 text-sm lg:text-base">{order.total.toFixed(2)} ETB</p>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex space-x-1 lg:space-x-2">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                              >
                                View
                              </button>
                              {order.paymentStatus === 'pending' && (
                                <button 
                                  onClick={() => processPayment(order)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                                >
                                  Process Payment
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Sales Reports</h3>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">Real-time sales analytics and insights</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 text-black w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium bg-white flex-1 sm:flex-none">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>Custom Range</option>
                    </select>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm flex-1 sm:flex-none">
                      <Calendar className="w-4 h-4" />
                      <span>Date Range</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors text-sm flex-1">
                      <Printer className="w-4 h-4" />
                      <span>Print Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { 
                    label: 'Total Revenue', 
                    value: `ETB ${todaySales.total.toLocaleString()}`, 
                    icon: DollarSign, 
                    color: 'emerald',
                    change: '+12.5%',
                    trend: 'up'
                  },
                  { 
                    label: 'Transactions', 
                    value: todaySales.transactions, 
                    icon: CreditCard, 
                    color: 'blue',
                    change: '+8.2%',
                    trend: 'up'
                  },
                  { 
                    label: 'Average Order', 
                    value: `ETB ${todaySales.average.toFixed(2)}`, 
                    icon: TrendingUp, 
                    color: 'purple',
                    change: '+3.1%',
                    trend: 'up'
                  },
                  { 
                    label: 'Pagers Used', 
                    value: pagers.filter(p => p.status !== 'available').length, 
                    icon: Bell, 
                    color: 'purple',
                    change: '+5',
                    trend: 'up'
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
                      </div>
                      <span className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 lg:w-4 lg:h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span>{stat.change}</span>
                      </span>
                    </div>
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-6 lg:space-y-8">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">System Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Demo Controls */}
                  <div className="space-y-4 lg:space-y-6">
                    <h4 className="font-semibold text-gray-900 text-lg">Demo Controls</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={resetDemo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base"
                      >
                        Reset Demo Data
                      </button>
                      <button 
                        onClick={() => setIsDemoMode(!isDemoMode)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm lg:text-base ${
                          isDemoMode 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {isDemoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
                      </button>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="space-y-4 lg:space-y-6">
                    <h4 className="font-semibold text-gray-900 text-lg">System Information</h4>
                    <div className="space-y-3 text-sm text-black">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Restaurant Name:</span>
                        <span className="font-semibold">Bistro Elegante</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">POS Version:</span>
                        <span className="font-semibold">v2.1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pager System:</span>
                        <span className="font-semibold">Connected (20 units)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-semibold">Today, 14:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Process Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 text-lg">{selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerName} • Pager #{selectedOrder.pagerNumber}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">Total: {selectedOrder.total.toFixed(2)} ETB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Payment Method</label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tip Amount</label>
                <input
                  type="number"
                  value={paymentData.tip}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, tip: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="0.00"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{selectedOrder.total.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tip:</span>
                  <span>{paymentData.tip.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 border-t border-blue-200 pt-2">
                  <span>Total:</span>
                  <span>{(selectedOrder.total + paymentData.tip).toFixed(2)} ETB</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={completePayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm lg:text-base"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pager History Modal */}
      {showPagerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Pager History & Status</h3>
              <button onClick={() => setShowPagerModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pager #</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Order</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned At</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pagers.map(pager => (
                      <tr key={pager.number} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Bell className={`w-4 h-4 ${
                              pager.status === 'available' ? 'text-green-500' :
                              pager.status === 'assigned' ? 'text-blue-500' : 'text-amber-500'
                            }`} />
                            <span className="font-semibold text-gray-900">#{pager.number}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(pager.status)}`}>
                            {pager.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {pager.orderId ? orders.find(o => o.id === pager.orderId)?.orderNumber || 'Unknown' : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {pager.assignedAt ? new Date(pager.assignedAt).toLocaleTimeString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {pager.assignedAt ? 
                            `${Math.floor((new Date() - new Date(pager.assignedAt)) / 60000)}m` : 
                            '—'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get status colors
function getStatusColor(status) {
  switch (status) {
    case 'available':
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'occupied':
    case 'assigned':
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'reserved':
    case 'active':
    case 'preparing':
      return 'bg-amber-100 text-amber-700';
    case 'ready':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}