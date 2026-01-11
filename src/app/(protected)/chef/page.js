'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { stationsAPI, chefInventoryAPI, menuAPI, ordersAPI } from '../../../lib/api'; // Removed kitchenAPI
import AuthService from '@/lib/auth-utils';

// Import components
import ChefSidebar from '../../../components/chef/Sidebar';
import ChefHeader from '../../../components/chef/Header';
import DashboardView from '../../../components/chef/DashboardView';
import KitchenOrdersView from '../../../components/chef/KitchenOrdersView';
import StationsView from '../../../components/chef/StationsView';
import InventoryView from '../../../components/chef/InventoryView';
import IngredientsView from '../../../components/chef/IngredientsView';
import ReportsView from '../../../components/chef/ReportsView';
import SettingsView from '../../../components/chef/SettingsView';
import OrderDetailModal from '../../../components/chef/OrderDetailModal';
import MobileOverlay from '../../../components/chef/MobileOverlay';

import '../../../lib/i18n';

// Map category to station function
const mapCategoryToStation = (category) => {
  const categoryToStation = {
    'Starters': 'Fryer',
    'Main Course': 'Grill',
    'Desserts': 'Dessert',
    'Drinks': 'Beverage',
    'Salads': 'Salad',
    'Appetizers': 'Fryer',
    'Sides': 'Fryer',
    'Specials': 'Stove'
  };
  return categoryToStation[category] || 'Grill';
};

export default function ChefDashboard() {
  const { t } = useTranslation('chef');
  const { user, token: authContextToken, logout } = useAuth();
  
  // State declarations
  const [orders, setOrders] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [ingredientStats, setIngredientStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });
  const [stations, setStations] = useState([]);
  const [kitchenStats, setKitchenStats] = useState({
    active: 0,
    completed: 0,
    avgPrepTime: 0,
    delayed: 0
  });
  const [kitchenReportData, setKitchenReportData] = useState(null);
  const [filter, setFilter] = useState('active');
  const [stationFilter, setStationFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Separate loading states
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  
  // Error states
  const [ordersError, setOrdersError] = useState(null);
  const [stationsError, setStationsError] = useState(null);
  const [ingredientsError, setIngredientsError] = useState(null);
  const [menuItemsError, setMenuItemsError] = useState(null);
  const [reportError, setReportError] = useState(null);

  // Transform backend orders to frontend format - SAME AS CASHIER
  const transformBackendOrders = (backendOrders) => {
    if (!Array.isArray(backendOrders)) return [];
    
    console.log('🔄 Transforming orders from backend:', backendOrders.length);
    
    return backendOrders.map(order => {
      try {
        // Calculate order status from items if order.status doesn't exist - SAME AS CASHIER
        let orderStatus = 'pending';
        if (order.items && Array.isArray(order.items)) {
          const allCompleted = order.items.every(item => item.status === 'completed');
          const anyReady = order.items.some(item => item.status === 'ready');
          const anyPreparing = order.items.some(item => item.status === 'preparing');
          
          if (allCompleted) {
            orderStatus = 'completed';
          } else if (anyReady) {
            orderStatus = 'ready';
          } else if (anyPreparing) {
            orderStatus = 'preparing';
          } else {
            orderStatus = 'pending';
          }
        }
        
        // Transform items - SAME AS CASHIER
        let orderItems = [];
        let orderTotal = 0;
        
        if (order.items && Array.isArray(order.items) && order.items.length > 0) {
          orderItems = order.items.map(item => ({
            id: item.id || item.menu_item_id,
            name: item.item_name || item.name || 'Unknown Item',
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0,
            specialInstructions: item.special_instructions || '',
            status: item.status || 'pending',
            station: mapCategoryToStation(item.category_name || item.category || 'Unknown'),
            menu_item_id: item.menu_item_id,
            category: item.category_name || item.category
          }));
          
          orderTotal = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
          }, 0);
        }
        
        // Find table number
        let tableNumber = order.table_number || `T${order.table_id}`;
        
        // Handle customer_name safely
        let customerName = order.customer_name || 'Walk-in Customer';
        if (customerName === '[object Object]') {
          console.warn(`Order ${order.id} has invalid customer_name`);
          customerName = 'Walk-in Customer';
        }
        
        return {
          id: order.id,
          orderNumber: order.order_number || `ORD-${order.id}`,
          tableId: order.table_id,
          tableNumber: tableNumber,
          items: orderItems,
          // ✅ SAME LOGIC AS CASHIER: Use backend status OR calculate from items
          status: order.status || orderStatus,
          total: parseFloat(order.total_amount) || orderTotal,
          orderTime: order.created_at || order.order_time || new Date().toISOString(),
          estimatedTime: order.estimated_ready_time || '15-20 min',
          customerName: customerName,
          customerCount: order.customer_count || 1,
          notes: order.notes || '',
          rawOrder: order,
          startedTime: order.started_time,
          readyTime: order.ready_time,
          completedTime: order.completed_time
        };
        
      } catch (error) {
        console.error('❌ Error transforming order:', error, order);
        return null;
      }
    }).filter(Boolean);
  };

  // Transform kitchen stats data for ReportsView
  const transformKitchenStatsData = (apiData) => {
    try {
      if (!apiData || !apiData.stats) {
        return {
          reportDate: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          total_orders_today: 0,
          pending_orders: 0,
          preparing_orders: 0,
          ready_orders: 0,
          ordersPrepared: 0,
          avgPrepTime: 0,
        };
      }
      
      const stats = apiData.stats;
      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const ordersPrepared = (stats.pending_orders || 0) + (stats.preparing_orders || 0);
      
      let popularDishes = [];
      if (apiData.popular_items && Array.isArray(apiData.popular_items)) {
        popularDishes = apiData.popular_items.map(item => ({
          name: item.menu_item_name || item.name || 'Unknown Dish',
          orders: item.order_count || 0
        })).slice(0, 5);
      }
      
      const efficiency = {
        orderAccuracy: Math.min(100, Math.floor(Math.random() * 10) + 90),
        onTimeDelivery: Math.min(100, Math.floor(Math.random() * 15) + 85)
      };
      
      return {
        reportDate: today,
        total_orders_today: stats.total_orders_today || 0,
        pending_orders: stats.pending_orders || 0,
        preparing_orders: stats.preparing_orders || 0,
        ready_orders: stats.ready_orders || 0,
        ordersPrepared: ordersPrepared,
        avgPrepTime: stats.avg_preparation_time || stats.avgPrepTime || 0,
        popularDishes: popularDishes,
        efficiency: efficiency
      };
      
    } catch (error) {
      console.error('❌ Error transforming kitchen stats:', error);
      return {
        reportDate: new Date().toLocaleDateString(),
        total_orders_today: 0,
        pending_orders: 0,
        preparing_orders: 0,
        ready_orders: 0,
        ordersPrepared: 0,
        avgPrepTime: 0,
        popularDishes: [],
        efficiency: {
          orderAccuracy: 0,
          onTimeDelivery: 0
        }
      };
    }
  };

  // Fetch kitchen statistics for reports
  const fetchKitchenReportData = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      setReportError('Authentication required');
      return;
    }

    if (!user || !['chef', 'admin', 'manager'].includes(user?.role)) {
      setReportError('Access Denied: Chef, manager, or admin role required.');
      return;
    }
    
    setReportLoading(true);
    setReportError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vortex-admin-kuku.pro.et/api'}/kitchen/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch kitchen stats`);
      }
      
      const apiResponse = await response.json();
      const transformedData = transformKitchenStatsData(apiResponse);
      setKitchenReportData(transformedData);
      
    } catch (err) {
      console.error('❌ Error fetching kitchen report data:', err);
      setReportError(err.message || 'Failed to load kitchen statistics');
      setKitchenReportData(transformKitchenStatsData(null));
    } finally {
      setReportLoading(false);
    }
  };

  // Fetch real ingredients data for chef
  const fetchChefIngredients = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      setIngredientsError('Authentication required');
      setIngredients([]);
      return;
    }

    if (!['admin', 'manager', 'chef'].includes(user?.role)) {
      setIngredients([]);
      return;
    }
    
    setIngredientsLoading(true);
    setIngredientsError(null);
    
    try {
      const ingredientsData = await chefInventoryAPI.getIngredients(token);
      
      if (!ingredientsData || ingredientsData.length === 0) {
        setIngredients([]);
        setIngredientStats({
          totalItems: 0,
          lowStock: 0,
          outOfStock: 0,
          totalValue: 0
        });
        return;
      }
      
      const stats = {
        totalItems: ingredientsData.length,
        lowStock: ingredientsData.filter(item => {
          const current = parseFloat(item.current_stock) || 0;
          const minimum = parseFloat(item.minimum_stock) || 0;
          return current > 0 && current <= minimum;
        }).length,
        outOfStock: ingredientsData.filter(item => 
          (parseFloat(item.current_stock) || 0) === 0
        ).length,
        totalValue: ingredientsData.reduce((sum, item) => {
          const cost = parseFloat(item.cost_per_unit) || 0;
          const stock = parseFloat(item.current_stock) || 0;
          const itemValue = cost * stock;
          return sum + itemValue;
        }, 0)
      };
      
      const processedIngredients = ingredientsData.map(ingredient => {
        const currentStock = parseFloat(ingredient.current_stock) || 0;
        const minimumStock = parseFloat(ingredient.minimum_stock) || 10;
        const costPerUnit = parseFloat(ingredient.cost_per_unit) || 0;
        
        let stockStatus = 'Adequate';
        if (currentStock === 0) {
          stockStatus = 'Out of Stock';
        } else if (currentStock <= minimumStock) {
          stockStatus = 'Low Stock';
        }
        
        const maxStock = Math.max(minimumStock * 3, currentStock);
        const stockPercentage = Math.min(100, (currentStock / maxStock) * 100);
        const stockValue = costPerUnit * currentStock;
        
        return {
          id: ingredient.id,
          name: ingredient.name || 'Unnamed Ingredient',
          description: ingredient.description || '',
          category: ingredient.category || 'Uncategorized',
          unit: ingredient.unit || 'unit',
          current_stock: currentStock,
          minimum_stock: minimumStock,
          cost_per_unit: costPerUnit,
          supplier_id: ingredient.supplier_id,
          supplier_name: ingredient.supplier_name || ingredient.supplier,
          status: ingredient.status || 'active',
          location: ingredient.location || '',
          notes: ingredient.notes || '',
          created_at: ingredient.created_at,
          updated_at: ingredient.updated_at,
          stock_status: ingredient.stock_status || stockStatus,
          stock_percentage: ingredient.stock_percentage || stockPercentage,
          stock_value: ingredient.stock_value || stockValue
        };
      });
      
      setIngredients(processedIngredients);
      setIngredientStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching chef ingredients:', err);
      setIngredientsError(`Failed to load ingredients: ${err.message}`);
      setIngredients([]);
      setIngredientStats({
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
      });
    } finally {
      setIngredientsLoading(false);
    }
  };

  // Fetch menu items for IngredientsView
  const fetchMenuItems = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      setMenuItemsError('Authentication required');
      setMenuItems([]);
      return;
    }

    if (!['admin', 'manager', 'chef'].includes(user?.role)) {
      setMenuItems([]);
      return;
    }
    
    setMenuItemsLoading(true);
    setMenuItemsError(null);
    
    try {
      let menuItemsData = [];
      
      try {
        menuItemsData = await chefInventoryAPI.getMenuItems(token, {
          include_recipes: true,
          include_ingredients: true
        });
      } catch (err) {
        menuItemsData = await menuAPI.getMenuItems(token);
      }
      
      const transformedMenuItems = menuItemsData.map(item => ({
        id: item.id || item.menu_item_id,
        name: item.name || item.item_name || 'Unnamed Item',
        description: item.description || '',
        category: item.category || item.category_name || 'Uncategorized',
        price: parseFloat(item.price) || 0,
        status: item.status || 'active',
        recipe: item.recipe || item.ingredients || [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setMenuItems(transformedMenuItems);
      
    } catch (err) {
      console.error('❌ Error fetching menu items:', err);
      setMenuItemsError(`Failed to load menu items: ${err.message}`);
      setMenuItems([]);
    } finally {
      setMenuItemsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setOrders([]);
      setIngredients([]);
      setMenuItems([]);
      setStations([]);
      setKitchenReportData(null);
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (logout) {
        await logout();
      } else {
        AuthService.clearToken();
        window.location.href = '/chef/login';
      }
      
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      AuthService.clearToken();
      window.location.href = '/chef/login';
    }
  };

  // ✅ FETCH ORDERS - EXACT SAME AS CASHIER
  const fetchKitchenData = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      setOrdersError('Please login again. No authentication token found.');
      return;
    }

    if (!user || !['chef', 'admin', 'manager'].includes(user?.role)) {
      setOrdersError('Access Denied: Chef, manager, or admin role required.');
      return;
    }
    
    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      console.log('🔍 Chef fetching orders using ordersAPI.getAllOrders()...');
      
      // ✅ SAME API AS CASHIER
      const ordersData = await ordersAPI.getAllOrders(token);
      console.log('📦 Raw orders from ordersAPI.getAllOrders:', ordersData?.length || 0);
      
      // ✅ SAME TRANSFORMATION AS CASHIER
      const transformedOrders = transformBackendOrders(ordersData);
      console.log('✅ Transformed orders:', transformedOrders.map(o => ({ 
        id: o.id, 
        status: o.status,
        items: o.items?.map(i => ({ name: i.name, status: i.status }))
      })));
      
      setOrders(transformedOrders);
      
      // Update stats
      const pending = transformedOrders.filter(o => o.status === 'pending').length;
      const preparing = transformedOrders.filter(o => o.status === 'preparing').length;
      const ready = transformedOrders.filter(o => o.status === 'ready').length;
      const completed = transformedOrders.filter(o => o.status === 'completed').length;
      const active = pending + preparing + ready;
      
      console.log('📊 Kitchen stats:', { pending, preparing, ready, completed, active });
      
      setKitchenStats({ 
        active, 
        completed,
        ready,
        pending,
        preparing,
        delayed: 0,
        avgPrepTime: 0
      });
      
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setOrdersError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch real stations from API
  const fetchStations = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      setStationsError('Authentication required');
      setStations([]);
      return;
    }

    if (!['admin', 'manager', 'chef'].includes(user?.role)) {
      setStations([]);
      return;
    }
    
    setStationsLoading(true);
    setStationsError(null);
    
    try {
      const stationsData = await stationsAPI.getStations(token);
      
      let stationsArray = [];
      if (Array.isArray(stationsData)) {
        stationsArray = stationsData;
      } else if (stationsData && Array.isArray(stationsData.stations)) {
        stationsArray = stationsData.stations;
      } else if (stationsData && stationsData.success && Array.isArray(stationsData.data)) {
        stationsArray = stationsData.data;
      }
      
      const transformedStations = stationsArray.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description || '',
        status: station.status || 'active',
        color: station.color || '#4CAF50',
        chef_name: station.chef_name,
        first_name: station.first_name,
        last_name: station.last_name,
        assigned_chef_id: station.assigned_chef_id,
        category_count: station.category_count || 0,
        menu_item_count: station.menu_item_count || 0,
        active: station.active !== undefined ? station.active : 1
      }));
      
      setStations(transformedStations);
      
    } catch (err) {
      console.error('❌ Error fetching stations:', err);
      setStationsError(err.message || 'Failed to load stations');
      setStations([]);
    } finally {
      setStationsLoading(false);
    }
  };

  // ✅ MARK ORDER AS PREPARING - EXACT SAME AS CASHIER
  const markOrderPreparing = async (orderId) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      console.log(`🔄 Chef marking order ${orderId} as preparing...`);
      
      // ✅ SAME API AS CASHIER
      const result = await ordersAPI.updateOrderStatus(orderId, 'preparing', token);
      console.log('✅ ordersAPI.updateOrderStatus result:', result);
      
      // ✅ SAME STATE UPDATE AS CASHIER
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: 'preparing',
          startedTime: order.startedTime || new Date().toISOString(),
          items: order.items?.map(item => ({
            ...item,
            status: 'preparing'
          }))
        } : order
      ));
      
      console.log(`✅ Order ${orderId} marked as preparing locally`);
      alert(`✅ Order marked as preparing!`);
      
      // Refresh after 2 seconds to sync with backend
      setTimeout(() => {
        fetchKitchenData();
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error marking order as preparing:', err);
      alert(`❌ Failed to update order: ${err.message}`);
    }
  };

  // ✅ MARK ORDER AS READY - EXACT SAME AS CASHIER
  const markOrderReady = async (orderId) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      console.log(`✅ Chef marking order ${orderId} as ready...`);
      
      // ✅ SAME API AS CASHIER
      const result = await ordersAPI.updateOrderStatus(orderId, 'ready', token);
      console.log('✅ ordersAPI.updateOrderStatus result:', result);
      
      // ✅ SAME STATE UPDATE AS CASHIER
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: 'ready',
          readyTime: order.readyTime || new Date().toISOString(),
          items: order.items?.map(item => ({
            ...item,
            status: 'ready'
          }))
        } : order
      ));
      
      console.log(`✅ Order ${orderId} marked as ready locally`);
      alert(`✅ Order is ready for pickup!`);
      
      // Refresh after 2 seconds to sync with backend
      setTimeout(() => {
        fetchKitchenData();
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error marking order as ready:', err);
      alert(`❌ Failed to mark order as ready: ${err.message}`);
    }
  };

  // Handle refresh for all views
  const handleRefresh = () => {
    console.log('🔄 Refreshing all data...');
    if (activeView === 'orders' || activeView === 'dashboard') {
      fetchKitchenData();
    }
    if (activeView === 'stations' || activeView === 'dashboard') {
      fetchStations();
    }
    if (activeView === 'inventory' || activeView === 'dashboard') {
      fetchChefIngredients();
    }
    if (activeView === 'ingredients' || activeView === 'dashboard') {
      fetchMenuItems();
    }
    if (activeView === 'reports' || activeView === 'dashboard') {
      fetchKitchenReportData();
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Loading initial chef data...');
        await Promise.all([
          fetchKitchenData(),
          fetchStations(),
          fetchChefIngredients(),
          fetchMenuItems(),
          fetchKitchenReportData()
        ]);
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
      }
    };
    
    loadData();
    
    // Set up refresh interval (every 30 seconds) - SAME AS CASHIER
    const intervalId = setInterval(() => {
      if (activeView === 'orders' || activeView === 'dashboard') {
        fetchKitchenData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Re-fetch when view changes
  useEffect(() => {
    if (activeView === 'stations' && stations.length === 0) {
      fetchStations();
    }
    if (activeView === 'inventory' && ingredients.length === 0) {
      fetchChefIngredients();
    }
    if (activeView === 'ingredients' && menuItems.length === 0) {
      fetchMenuItems();
    }
    if (activeView === 'reports' && !kitchenReportData) {
      fetchKitchenReportData();
    }
  }, [activeView]);

  // Check if user has permission
  if (!user || !['chef', 'admin', 'manager'].includes(user.role)) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be a chef, manager, or administrator to access the kitchen dashboard.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold">{user?.role || 'Not assigned'}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      <MobileOverlay sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar */}
      <ChefSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoading={ordersLoading || stationsLoading || ingredientsLoading || menuItemsLoading || reportLoading}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
        user={user} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <ChefHeader
          activeView={activeView}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onRefresh={handleRefresh}
          isLoading={ordersLoading || stationsLoading || ingredientsLoading || menuItemsLoading || reportLoading}
        />

        {/* Error Messages */}
        {(ordersError || stationsError || ingredientsError || menuItemsError || reportError) && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-red-700">
                {ordersError || stationsError || ingredientsError || menuItemsError || reportError}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    setOrdersError(null);
                    setStationsError(null);
                    setIngredientsError(null);
                    setMenuItemsError(null);
                    setReportError(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {activeView === 'dashboard' && (
            <DashboardView
              kitchenStats={kitchenStats}
              ingredientStats={ingredientStats}
              stations={stations}
              orders={orders}
              setStationFilter={setStationFilter}
              setActiveView={setActiveView}
              onRefresh={handleRefresh}
              isLoading={ordersLoading || ingredientsLoading}
            />
          )}

          {activeView === 'orders' && (
            <KitchenOrdersView
              orders={orders}
              markOrderPreparing={markOrderPreparing}
              markOrderReady={markOrderReady}
              isLoading={ordersLoading}
              error={ordersError}
              onRefresh={fetchKitchenData}
            />
          )}

          {activeView === 'stations' && (
            <StationsView
              stations={stations}
              orders={orders}
              setStationFilter={setStationFilter}
              setActiveView={setActiveView}
              isLoading={stationsLoading}
              error={stationsError}
              onRefresh={fetchStations}
              user={user}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView
              inventory={ingredients}
              stats={ingredientStats}
              isLoading={ingredientsLoading}
              error={ingredientsError}
              onRefresh={fetchChefIngredients}
              userRole={user?.role}
              onAddItem={() => alert('Add ingredient would open form')}
              onUpdateItem={(id) => alert(`Edit ingredient ${id}`)}
              onDeleteItem={(id) => {
                if (confirm(`Delete ingredient ${id}?`)) {
                  console.log(`Delete ${id}`);
                }
              }}
            />
          )}

          {activeView === 'ingredients' && (
            <IngredientsView
              ingredients={ingredients}
              menuItems={menuItems}
              isLoading={ingredientsLoading || menuItemsLoading}
              error={ingredientsError || menuItemsError}
              onRefresh={() => {
                fetchChefIngredients();
                fetchMenuItems();
              }}
              userRole={user?.role}
              onSaveRecipe={async (recipeData) => {
                alert('Save recipe functionality');
              }}
              onUpdateRecipe={async (recipeData) => {
                alert('Update recipe functionality');
              }}
              onDeleteRecipe={async (menuItemId) => {
                if (confirm('Delete recipe?')) {
                  alert(`Delete recipe ${menuItemId}`);
                }
              }}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              reportData={kitchenReportData}
              isLoading={reportLoading}
              error={reportError}
              timeRange="today"
              onTimeRangeChange={() => {}}
              onExport={() => alert('Export report')}
              onRefresh={fetchKitchenReportData}
              onDismissError={() => setReportError(null)}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView user={user} />
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        updateOrderStatus={markOrderPreparing}
        onStartPreparation={async (orderItemId, menuItemId) => {
          alert(`Start preparation for item ${orderItemId}`);
          return true;
        }}
      />
    </div>
  );
}