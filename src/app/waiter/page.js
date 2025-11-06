'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Plus, Minus, X, Clock, 
  Users, Utensils, DollarSign, Home, Package, 
  BarChart3, Settings, Menu, ChefHat, Bell,
  ArrowLeft, CheckCircle, AlertCircle, Crown, RefreshCw , LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

// Mock data - in real app this would come from API
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

const tables = [
  { id: 1, number: 'T01', status: 'occupied', customers: 2, section: 'Main' },
  { id: 2, number: 'T02', status: 'available', customers: 0, section: 'Main' },
  { id: 3, number: 'T03', status: 'occupied', customers: 4, section: 'Main' },
  { id: 4, number: 'T04', status: 'reserved', customers: 0, section: 'VIP' },
  { id: 5, number: 'T05', status: 'available', customers: 0, section: 'Main' },
  { id: 6, number: 'T06', status: 'occupied', customers: 3, section: 'Patio' },
  { id: 7, number: 'T07', status: 'occupied', customers: 6, section: 'VIP' },
  { id: 8, number: 'T08', status: 'available', customers: 0, section: 'Patio' },
];


export default function WaiterDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('tables');
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];

  const menuItemsList = [
    { id: 'tables', icon: Users, label: 'Tables', view: 'tables' },
    { id: 'menu', icon: Utensils, label: 'Menu', view: 'menu' },
    { id: 'orders', icon: ShoppingCart, label: 'Active Orders', badge: 0, view: 'orders' },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

  // Update orders badge count
  useEffect(() => {
    const activeOrdersCount = orders.filter(order => order.status !== 'completed').length;
    const updatedMenuItems = menuItemsList.map(item => 
      item.id === 'orders' ? { ...item, badge: activeOrdersCount } : item
    );
  }, [orders]);

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
    addNotification(`Order ${newOrder.orderNumber} placed for ${selectedTable.number}`, 'success');
    
    setCart([]);
    setShowCart(false);
    setSelectedTable(null);
  };

  const addNotification = (message, type = 'info') => {
    const notification = { id: Date.now(), message, type, time: new Date().toISOString() };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reserved': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTableOrders = (tableId) => {
    return orders.filter(order => order.tableId === tableId && order.status !== 'completed');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Mobile sidebar overlay
  const SidebarOverlay = () => (
    sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )
  );

  const handleLogout = () => {
  setIsLoading(true);
  // Simulate logout process
  setTimeout(() => {
    router.push('/login'); // Navigate to home page
  }, 1000);
};

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <SidebarOverlay />
      
      {/* Sidebar */}
      <div className={`fixed lg:static bg-gradient-to-b from-green-900 to-green-800 text-white transition-all duration-300 h-full z-50 ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-4 lg:p-6 border-b border-green-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Waiter POS</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-green-700 rounded-lg transition">
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
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'hover:bg-green-700 text-green-100'
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
        <p className="font-semibold text-sm">Manager</p>
        <p className="text-xs text-purple-300">Bistro Elegante</p>
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
                  {activeView === 'tables' && 'Table Management'}
                  {activeView === 'menu' && 'Menu & Ordering'}
                  {activeView === 'orders' && 'Active Orders'}
                  {activeView === 'reports' && 'Sales Reports'}
                  {activeView === 'settings' && 'System Settings'}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search - Mobile */}
              {showSearch ? (
                <div className="lg:hidden relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48 xl:w-64"
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
                    className="relative bg-green-600 hover:bg-green-700 text-white p-2 lg:px-4 lg:py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-full text-[10px] lg:text-xs">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </button>

                  {selectedTable && (
                    <div className="hidden sm:flex bg-blue-50 border border-blue-200 px-3 lg:px-4 py-2 rounded-xl">
                      <p className="text-sm font-medium text-blue-900">Table {selectedTable.number}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Selected Table - Mobile */}
          {selectedTable && (
            <div className="sm:hidden mt-3 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl inline-flex items-center">
              <p className="text-sm font-medium text-blue-900">Table {selectedTable.number}</p>
              <button 
                onClick={() => setSelectedTable(null)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          
          {/* Tables View */}
          {activeView === 'tables' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Table Management</h3>
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
                  {tables.filter(t => t.status === 'occupied').length} occupied • {tables.filter(t => t.status === 'available').length} available
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                {tables.map(table => {
                  const tableOrders = getTableOrders(table.id);
                  return (
                    <div
                      key={table.id}
                      className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border-2 p-3 lg:p-4 text-center cursor-pointer transition ${
                        table.status === 'available' ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100' :
                        table.status === 'occupied' ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' :
                        table.status === 'reserved' ? 'border-amber-300 bg-amber-50 hover:bg-amber-100' : ''
                      } ${selectedTable?.id === table.id ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                      onClick={() => {
                        setSelectedTable(table);
                        setActiveView('menu');
                      }}
                    >
                      <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">{table.number}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getTableStatusColor(table.status)}`}>
                        {table.status}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{table.section}</p>
                      <p className="text-xs text-gray-600">{table.customers} {table.customers === 1 ? 'customer' : 'customers'}</p>
                      
                      {tableOrders.length > 0 && (
                        <div className="mt-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                          {tableOrders.length} active {tableOrders.length === 1 ? 'order' : 'orders'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu View */}
          {activeView === 'menu' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setActiveView('tables')}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">Menu & Ordering</h3>
                    {selectedTable && (
                      <p className="text-sm text-gray-600">Table {selectedTable.number} • {selectedTable.section}</p>
                    )}
                  </div>
                </div>
                
                {!selectedTable && (
                  <button
                    onClick={() => setActiveView('tables')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm lg:text-base"
                  >
                    Select Table
                  </button>
                )}
              </div>

              {/* Category Navigation */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 lg:px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium text-sm flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Popular Items */}
              {activeCategory === 'All' && (
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Popular Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                    {popularItems.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4 hover:shadow-md transition">
                        <div className="flex items-center space-x-3 mb-2 lg:mb-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xl lg:text-2xl">{item.image}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{item.name}</h5>
                            <p className="text-green-600 font-bold text-sm lg:text-base">ETB {item.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.available || !selectedTable}
                          className={`w-full py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                            item.available && selectedTable
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {!selectedTable ? 'Select Table' : 'Add to Cart'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                            disabled={!item.available || !selectedTable}
                            className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                              item.available && selectedTable
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {!selectedTable ? 'Select Table' : 'Add to Cart'}
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
          )}

          {/* Active Orders View */}
          {activeView === 'orders' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Active Orders</h3>
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border">
                  {orders.filter(order => order.status !== 'completed').length} active orders
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {orders.filter(order => order.status !== 'completed').map(order => (
                  <div key={order.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-base lg:text-lg truncate">{order.orderNumber}</h4>
                        <p className="text-sm text-gray-500">Table {order.tableNumber}</p>
                      </div>
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                        order.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3 lg:mb-4">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs lg:text-sm">
                          <span className="text-gray-600 truncate flex-1">{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-gray-900 flex-shrink-0 ml-2">ETB {item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200">
                      <div>
                        <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {order.total}</p>
                        <p className="text-xs text-gray-500">Est. {order.estimatedTime}m</p>
                      </div>
                      <div className="flex space-x-2">
                        {order.status === 'ready' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium"
                          >
                            Serve
                          </button>
                        )}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {orders.filter(order => order.status !== 'completed').length === 0 && (
                <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-2xl border">
                  <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">📋</div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3 text-black">No Active Orders</h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-6 lg:mb-8">All orders have been completed</p>
                  <button
                    onClick={() => setActiveView('tables')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-xl font-semibold text-sm lg:text-base"
                  >
                    Take New Order
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Sales Reports</h3>
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="text-center py-8 lg:py-12">
                  <BarChart3 className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Reports Coming Soon</h4>
                  <p className="text-gray-600 text-sm lg:text-base">Sales analytics and performance reports are under development</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">Waiter Settings</h3>
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="space-y-4">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                    Update Profile
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                    Change Password
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base">
                    Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          ></div>
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {selectedTable ? `Table ${selectedTable.number}` : 'Cart'}
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8">
                  <ShoppingCart className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mb-3 lg:mb-4" />
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 text-center">Your cart is empty</h3>
                  <p className="text-gray-600 text-center mb-4 lg:mb-6 text-sm lg:text-base">
                    Add items from the menu to place an order
                  </p>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setActiveView('menu');
                    }}
                    className="bg-green-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl hover:bg-green-700 transition-colors text-sm lg:text-base"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-3 lg:p-4">
                        <div className="flex justify-between items-start mb-2 lg:mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</h4>
                            <p className="text-gray-600 text-xs lg:text-sm">ETB {item.price} each</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 lg:space-x-3 ml-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 lg:w-8 lg:h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                            </button>
                            
                            <span className="font-semibold text-gray-900 w-6 lg:w-8 text-center text-sm lg:text-base">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                            >
                              <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 lg:mt-3">
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                            Special Instructions
                          </label>
                          <textarea
                            value={item.specialInstructions}
                            onChange={(e) => updateInstructions(item.id, e.target.value)}
                            placeholder="Any special requests?"
                            rows="2"
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs lg:text-sm resize-none"
                          />
                        </div>

                        <div className="flex justify-between items-center mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-200">
                          <span className="text-xs lg:text-sm text-gray-600">Item Total</span>
                          <span className="font-semibold text-gray-900 text-sm lg:text-base">
                            ETB {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 p-4 lg:p-6 space-y-3 lg:space-y-4">
                    <div className="flex justify-between items-center text-base lg:text-lg font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-gray-900">ETB {cartTotal}</span>
                    </div>

                    <button
                      onClick={placeOrder}
                      disabled={!selectedTable}
                      className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-lg shadow-lg transition-colors ${
                        selectedTable
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {selectedTable ? `Place Order - ETB ${cartTotal}` : 'Select Table First'}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2 lg:gap-3">
                      <button
                        onClick={clearCart}
                        className="bg-white border border-gray-300 text-gray-700 py-2 lg:py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs lg:text-sm"
                      >
                        Clear Cart
                      </button>
                      
                      <button
                        onClick={() => setShowCart(false)}
                        className="bg-gray-100 text-gray-700 py-2 lg:py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium text-xs lg:text-sm"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}