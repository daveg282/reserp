'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { kitchenAPI, stationsAPI, chefInventoryAPI, menuAPI, ordersAPI } from '../../../lib/api';
import AuthService from '@/lib/auth-utils';

// Import components
import ChefSidebar from '../../../components/chef/Sidebar';
import ChefHeader from '../../../components/chef/Header';
import DashboardView from '../../../components/chef/DashboardView';
import OrdersView from '../../../components/chef/OrderView';
import StationsView from '../../../components/chef/StationsView';
import InventoryView from '../../../components/chef/InventoryView';
import IngredientsView from '../../../components/chef/IngredientsView';
import ReportsView from '../../../components/chef/ReportsView';
import SettingsView from '../../../components/chef/SettingsView';
import OrderDetailModal from '../../../components/chef/OrderDetailModal';
import MobileOverlay from '../../../components/chef/MobileOverlay';

// Import mock data for fallback
import { stations as mockStations } from '../../../lib/data';
import '../../../lib/i18n';


const getOverallOrderStatus = (items) => {
  if (!items || items.length === 0) return 'pending';
  
  // If backend provides order.status, use that
  // Otherwise calculate from items
  
  const allCompleted = items.every(item => item.status === 'completed');
  if (allCompleted) return 'completed';
  
  const anyReady = items.some(item => item.status === 'ready');
  if (anyReady) return 'ready';
  
  const anyPreparing = items.some(item => item.status === 'preparing');
  if (anyPreparing) return 'preparing';
  
  return 'pending';
};

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

  // Transform backend orders to frontend format
  // CORRECTED: Transform backend orders to frontend format
const transformBackendOrders = (backendOrders) => {
  if (!Array.isArray(backendOrders)) return [];
  
  return backendOrders.map(order => {
    try {
      // DEBUG: See what the backend actually provides
      console.log('🎯 Order from backend:', {
        orderId: order.id,
        backendStatus: order.status,  // This should exist after fixing backend query
        hasItems: Array.isArray(order.items),
        itemStatuses: order.items?.map(i => i.status)
      });
      
      return {
        id: order.id || Math.random(),
        orderNumber: order.order_number || order.orderNumber || `ORD-${order.id}`,
        tableNumber: order.table_number || order.tableNumber || `T${order.table_id || '?'}`,
        orderTime: order.order_time || order.orderTime || new Date().toISOString(),
        // ✅ FIX: Use order.status from backend, NOT calculated
        status: order.status || 'pending',  // ← CHANGE THIS LINE!
        items: (Array.isArray(order.items) ? order.items : []).map(item => ({
          id: item.id || Math.random(),
          name: item.item_name || item.name || 'Unknown Item',
          quantity: item.quantity || 1,
          status: item.status || 'pending',
          station: mapCategoryToStation(item.category_name || item.category || 'Unknown'),
          specialRequest: item.special_instructions || item.specialRequest || '',
          prepTime: item.preparation_time || item.prepTime || 10,
          category: item.category_name || item.category,
          menu_item_id: item.menu_item_id || item.menuItemId
        })),
        waiterName: order.waiter_name || order.waiterName || 'Waiter',
        customerNotes: order.notes || order.customerNotes || '',
        startedTime: order.started_time || order.startedTime,
        readyTime: order.ready_time || order.readyTime,
        completedTime: order.completed_time || order.completedTime
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
      const apiResponse = await kitchenAPI.getKitchenStats(token);
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

  // Fetch kitchen orders
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
      const ordersData = await kitchenAPI.getKitchenOrders(token);
      const transformedOrders = transformBackendOrders(Array.isArray(ordersData) ? ordersData : []);
      setOrders(transformedOrders);
      
      const active = transformedOrders.filter(o => o.status !== 'completed').length;
      const completed = transformedOrders.filter(o => o.status === 'completed').length;
      
      const delayed = transformedOrders.filter(o => {
        if (o.status === 'pending' || o.status === 'preparing') {
          const orderDate = new Date(o.orderTime);
          const now = new Date();
          const waitTimeMinutes = (now - orderDate) / (1000 * 60);
          return waitTimeMinutes > 10;
        }
        return false;
      }).length;
      
      const preparingOrders = transformedOrders.filter(o => o.startedTime && o.status === 'preparing');
      let avgPrepTime = 0;
      
      if (preparingOrders.length > 0) {
        const totalPrepTime = preparingOrders.reduce((sum, order) => {
          const startDate = new Date(order.startedTime);
          const now = new Date();
          const prepTimeMinutes = (now - startDate) / (1000 * 60);
          return sum + prepTimeMinutes;
        }, 0);
        
        avgPrepTime = Math.round(totalPrepTime / preparingOrders.length);
      }
      
      setKitchenStats({ 
        active, 
        completed, 
        delayed, 
        avgPrepTime 
      });
      
    } catch (err) {
      console.error('❌ Error fetching kitchen data:', err);
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

  // Handle start preparation with ingredient check
  const handleStartPreparation = async (orderItemId, menuItemId) => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const checkResult = await chefInventoryAPI.checkOrderItemIngredients(orderItemId, token);
      
      let canPrepare = false;
      let warnings = [];
      
      if (checkResult.success !== undefined) {
        canPrepare = checkResult.success || checkResult.can_prepare || false;
        warnings = checkResult.warnings || checkResult.data?.warnings || [];
      } else if (checkResult.data) {
        canPrepare = checkResult.data.can_prepare || false;
        warnings = checkResult.data.warnings || [];
      } else {
        canPrepare = checkResult.can_prepare || false;
        warnings = checkResult.warnings || [];
      }
      
      if (!canPrepare) {
        if (warnings.length > 0) {
          alert(`Cannot start preparation: ${warnings[0].message || warnings[0]}`);
        } else {
          alert('Insufficient ingredients to prepare this item');
        }
        return false;
      }
      
      const deductionResult = await chefInventoryAPI.deductIngredients(orderItemId, token);
      
      setOrders(prev => prev.map(order => ({
        ...order,
        items: order.items?.map(item => 
          item.id === orderItemId 
            ? { ...item, status: 'preparing' }
            : item
        )
      })));
      
      await fetchChefIngredients();
      
      return true;
      
    } catch (err) {
      console.error('❌ Start preparation error:', err);
      setOrdersError(err.message);
      return false;
    }
  };

 // UPDATED: Update order status function - FIXED VERSION
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log(`🔄 Updating order ${orderId} to ${newStatus}`);
    
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const result = await ordersAPI.updateOrderStatus(orderId, newStatus, token);
    console.log('✅ Order status updated via ordersAPI:', result);
    
    // Update local state
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus,
          items: order.items?.map(item => ({
            ...item,
            status: newStatus
          }))
        };
        
        // Add timestamps based on status change
        const now = new Date().toISOString();
        if (newStatus === 'preparing' && !order.startedTime) {
          updatedOrder.startedTime = now;
        }
        if (newStatus === 'ready' && !order.readyTime) {
          updatedOrder.readyTime = now;
        }
        if (newStatus === 'completed' && !order.completedTime) {
          updatedOrder.completedTime = now;
        }
        
        return updatedOrder;
      }
      return order;
    }));
    
    // Refresh data
    setTimeout(() => {
      fetchKitchenData();
    }, 1000);
    
    return true;
    
  } catch (err) {
    console.error('❌ Error updating order status:', err);
    setOrdersError(err.message || 'Failed to update order status');
    return false;
  }
};

  // Handle refresh for all views
  const handleRefresh = () => {
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

  const handleSaveRecipe = async (recipeData) => {
    const token = AuthService.getToken();
    
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      if (!recipeData.menuItemId) {
        alert('Menu item ID is required to save recipe');
        return;
      }
      
      const ingredientsArray = recipeData.ingredients.map(ingredient => ({
        ingredient_id: ingredient.ingredient_id,
        quantity_required: parseFloat(ingredient.quantity_required) || 0,
        unit: ingredient.unit,
        notes: ingredient.notes || ''
      }));
      
      const existingMenuItem = menuItems.find(m => m.id === recipeData.menuItemId);
      if (existingMenuItem && existingMenuItem.recipe && existingMenuItem.recipe.length > 0) {
        for (const ingredient of existingMenuItem.recipe) {
          try {
            await menuAPI.removeIngredientFromMenuItem(
              recipeData.menuItemId,
              ingredient.ingredient_id || ingredient.id,
              token
            );
          } catch (err) {
            console.warn('Could not remove ingredient:', err.message);
          }
        }
      }
      
      if (ingredientsArray.length > 0) {
        const bulkResult = await menuAPI.addIngredientsBulk(
          recipeData.menuItemId,
          ingredientsArray,
          token
        );
        
        if (!bulkResult || bulkResult.error) {
          throw new Error(bulkResult?.error || 'Failed to add ingredients');
        }
      }
      
      alert('Recipe updated successfully!');
      
      await fetchMenuItems();
      await fetchChefIngredients();
      
    } catch (err) {
      console.error('❌ Error saving recipe:', err);
      alert(`Failed to save recipe: ${err.message}`);
    }
  };

  const handleUpdateRecipe = async (recipeData) => {
    return handleSaveRecipe(recipeData);
  };

  const handleDeleteRecipe = async (menuItemId) => {
    const token = AuthService.getToken();
    
    if (!token) {
      alert('Authentication required');
      return;
    }

    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      await menuAPI.deleteMenuItem(menuItemId, token);
      alert('Recipe deleted successfully!');
      await fetchMenuItems();
      
    } catch (err) {
      console.error('❌ Error deleting recipe:', err);
      alert(`Failed to delete recipe: ${err.message}`);
    }
  };

  // Handle time range change for reports
  const handleTimeRangeChange = (range) => {
    fetchKitchenReportData();
  };

  // Handle export for reports
  const handleExportReport = () => {
    alert('Export functionality would generate a report file');
  };

  // Initialize data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
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
    
    const intervalId = setInterval(() => {
      fetchKitchenData();
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

  // Filter orders for display
  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (filter === 'active' && order.status === 'completed') return false;
      if (filter === 'completed' && order.status !== 'completed') return false;
      if (stationFilter !== 'all') {
        return order.items?.some(item => 
          item.station?.toLowerCase() === stationFilter.toLowerCase()
        );
      }
      if (searchQuery) {
        return (
          order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.waiterName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Callback functions for InventoryView
  const handleAddIngredient = () => {
    alert('Add ingredient functionality would open a form');
  };

  const handleUpdateIngredient = (itemId) => {
    alert(`Would open edit form for ingredient ${itemId}`);
  };

  const handleDeleteIngredient = (itemId) => {
    if (confirm(`Are you sure you want to delete ingredient ${itemId}?`)) {
      console.log(`Deleting ingredient ${itemId}`);
    }
  };

  // Dismiss report error
  const handleDismissReportError = () => {
    setReportError(null);
    setKitchenReportData(transformKitchenStatsData(null));
  };

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
            <OrdersView
              orders={filteredOrders}
              filter={filter}
              setFilter={setFilter}
              stationFilter={stationFilter}
              setStationFilter={setStationFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stations={stations}
              updateOrderStatus={updateOrderStatus}
              setSelectedOrder={setSelectedOrder}
              isLoading={ordersLoading}
              error={ordersError}
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
              onAddItem={handleAddIngredient}
              onUpdateItem={handleUpdateIngredient}
              onDeleteItem={handleDeleteIngredient}
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
              onSaveRecipe={handleSaveRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              reportData={kitchenReportData}
              isLoading={reportLoading}
              error={reportError}
              timeRange="today"
              onTimeRangeChange={handleTimeRangeChange}
              onExport={handleExportReport}
              onRefresh={fetchKitchenReportData}
              onDismissError={handleDismissReportError}
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
        updateOrderStatus={updateOrderStatus}
        onStartPreparation={handleStartPreparation}
      />
    </div>
  );
}