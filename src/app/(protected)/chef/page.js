'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { kitchenAPI, stationsAPI, chefInventoryAPI, menuAPI, } from '../../../lib/api';
import AuthService from '@/lib/auth-utils';

// Import components
import ChefSidebar from '../../../components/chef/Sidebar';
import ChefHeader from '../../../components/chef/Header';
import DashboardView from '../../../components/chef/DashboardView';
import OrdersView from '../../../components/chef/OrderView';
import StationsView from '../../../components/chef/StationsView';
import InventoryView from '../../../components/chef/InventoryView';
import IngredientsView from '../../../components/chef/IngredientsView'; // Added this line
import ReportsView from '../../../components/chef/ReportsView';
import SettingsView from '../../../components/chef/SettingsView';
import OrderDetailModal from '../../../components/chef/OrderDetailModal';
import MobileOverlay from '../../../components/chef/MobileOverlay';

// Import mock data for fallback
import { stations as mockStations } from '../../../lib/data';
import '../../../lib/i18n';

// Helper function to get overall order status
const getOverallOrderStatus = (items) => {
  if (!items || items.length === 0) return 'pending';
  
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
  const [menuItems, setMenuItems] = useState([]); // Added for IngredientsView
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
  const [menuItemsLoading, setMenuItemsLoading] = useState(false); // Added
  
  // Error states
  const [ordersError, setOrdersError] = useState(null);
  const [stationsError, setStationsError] = useState(null);
  const [ingredientsError, setIngredientsError] = useState(null);
  const [menuItemsError, setMenuItemsError] = useState(null); // Added

  // Enhanced transform function with better error handling
  const transformBackendOrders = (backendOrders) => {
    if (!Array.isArray(backendOrders)) return [];
    
    return backendOrders.map(order => {
      try {
        return {
          id: order.id || Math.random(),
          orderNumber: order.order_number || order.orderNumber || `ORD-${order.id}`,
          tableNumber: order.table_number || order.tableNumber || `T${order.table_id || '?'}`,
          orderTime: order.order_time || order.orderTime || new Date().toISOString(),
          status: getOverallOrderStatus(order.items || []),
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
        console.error('Error transforming order:', error, order);
        return null;
      }
    }).filter(Boolean);
  };

  // ============================================
  // Fetch real ingredients data for chef
  // ============================================
  // ============================================
// Fetch real ingredients data for chef
// ============================================
const fetchChefIngredients = async () => {
  const token = AuthService.getToken();
  
  if (!token) {
    console.error('❌ No token found for ingredients fetch');
    setIngredientsError('Authentication required');
    setIngredients([]);
    return;
  }

  if (!['admin', 'manager', 'chef'].includes(user?.role)) {
    console.log('ℹ️ User not authorized for ingredients API');
    setIngredients([]);
    return;
  }
  
  setIngredientsLoading(true);
  setIngredientsError(null);
  
  try {
    console.log('📡 Fetching chef ingredients via API wrapper...');
    
    // USE THE API WRAPPER INSTEAD OF DIRECT FETCH
    const ingredientsData = await chefInventoryAPI.getIngredients(token);
    console.log('📊 Ingredients data from API:', ingredientsData);
    
    if (!ingredientsData || ingredientsData.length === 0) {
      console.warn('⚠️ API returned empty ingredients array');
      setIngredients([]);
      setIngredientStats({
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
      });
      return;
    }
    
    console.log(`✅ Got ${ingredientsData.length} ingredients`);
    console.log('📊 Sample ingredient:', ingredientsData[0]);
    
    // ============================================
    // CALCULATE STATS for InventoryView component
    // ============================================
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
    
    console.log('📊 Calculated stats:', stats);
    
    // ============================================
    // TRANSFORM DATA for InventoryView component
    // ============================================
    const processedIngredients = ingredientsData.map(ingredient => {
      const currentStock = parseFloat(ingredient.current_stock) || 0;
      const minimumStock = parseFloat(ingredient.minimum_stock) || 10;
      const costPerUnit = parseFloat(ingredient.cost_per_unit) || 0;
      
      // Determine stock status
      let stockStatus = 'Adequate';
      if (currentStock === 0) {
        stockStatus = 'Out of Stock';
      } else if (currentStock <= minimumStock) {
        stockStatus = 'Low Stock';
      }
      
      // Calculate stock percentage
      const maxStock = Math.max(minimumStock * 3, currentStock);
      const stockPercentage = Math.min(100, (currentStock / maxStock) * 100);
      
      // Calculate stock value
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
    console.log('✅ Chef ingredients loaded successfully!');
    
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

  // Alternative endpoint fallback
  const tryAlternativeIngredientsEndpoint = async (token) => {
    try {
      console.log('🔄 Trying alternative ingredients endpoints...');
      
      const endpoints = [
        '/api/inventory/list',
        '/api/ingredients',
        '/api/ingredients/all',
        '/api/inventory'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint}`);
          const response = await fetch(`http://localhost:8000${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Found working endpoint: ${endpoint}`, data);
            // Process the data if found
            break;
          }
        } catch (err) {
          console.log(`❌ Endpoint ${endpoint} failed:`, err.message);
        }
      }
    } catch (err) {
      console.error('Alternative endpoint error:', err);
    }
  };

  // ============================================
  // Fetch menu items for IngredientsView
  // ============================================
  const fetchMenuItems = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      console.error('❌ No token found for menu items fetch');
      setMenuItemsError('Authentication required');
      setMenuItems([]);
      return;
    }

    if (!['admin', 'manager', 'chef'].includes(user?.role)) {
      console.log('ℹ️ User not authorized for menu items API');
      setMenuItems([]);
      return;
    }
    
    setMenuItemsLoading(true);
    setMenuItemsError(null);
    
    try {
      console.log('📡 Fetching menu items with recipes...');
      
      // First try the chefInventoryAPI endpoint
      let menuItemsData = [];
      
      try {
        menuItemsData = await chefInventoryAPI.getMenuItems(token, {
          include_recipes: true,
          include_ingredients: true
        });
        console.log('📊 Menu items from chefInventoryAPI:', menuItemsData);
      } catch (err) {
        console.log('🔄 Falling back to menuAPI...');
        // Fallback to regular menuAPI
        menuItemsData = await menuAPI.getMenuItems(token);
      }
      
      // Transform the data to match IngredientsView expectations
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
      console.log(`✅ Menu items loaded: ${transformedMenuItems.length} items`);
      
    } catch (err) {
      console.error('❌ Error fetching menu items:', err);
      setMenuItemsError(`Failed to load menu items: ${err.message}`);
      setMenuItems([]);
    } finally {
      setMenuItemsLoading(false);
    }
  };
 // In page.js, replace the handleLogout function with this:
const handleLogout = async () => {
  try {
    // Clear all local state
    setOrders([]);
    setIngredients([]);
    setMenuItems([]);
    setStations([]);
    
    // Clear tokens and storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Use auth context logout
    if (logout) {
      await logout();
    } else {
      // Fallback if logout not available
      AuthService.clearToken();
      // Redirect to login page
      window.location.href = '/chef/login';
    }
    
  } catch (error) {
    console.error('Logout error:', error);
    // Force cleanup on error
    localStorage.clear();
    sessionStorage.clear();
    AuthService.clearToken();
    window.location.href = '/chef/login';
  }
};
  // Test API connection for debugging
  const testApiConnection = async () => {
    const token = AuthService.getToken();
    
    console.log('🧪 ========== API CONNECTION TEST ==========');
    console.log('Token exists:', !!token);
    console.log('User role:', user?.role);
    
    try {
      // Test 1: Health check
      const healthResponse = await fetch('http://localhost:8000/api/health');
      console.log('✅ Health check:', healthResponse.status, healthResponse.statusText);
      
      // Test 2: Test inventory endpoint
      if (token) {
        console.log('🧪 Testing /api/inventory/ingredients...');
        const authResponse = await fetch('http://localhost:8000/api/inventory/ingredients', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📊 Auth response status:', authResponse.status, authResponse.statusText);
        
        if (authResponse.ok) {
          const data = await authResponse.json();
          console.log('📊 Response structure:', {
            success: data.success,
            hasData: !!data.data,
            isArray: Array.isArray(data.data),
            count: data.count,
            length: data.data?.length,
            message: data.message
          });
          
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log('✅ Sample item:', data.data[0]);
          }
        } else {
          console.error('❌ Auth failed:', authResponse.status, authResponse.statusText);
        }
      }
    } catch (err) {
      console.error('❌ API test failed:', err.message);
    }
    console.log('🧪 ========================================');
  };

  // Fetch kitchen orders
  const fetchKitchenData = async () => {
    const token = AuthService.getToken();
    
    if (!token) {
      console.error('❌ No token found');
      setOrdersError('Please login again. No authentication token found.');
      return;
    }

    if (!user || !['chef', 'admin', 'manager'].includes(user?.role)) {
      console.error('❌ User role not authorized:', user?.role);
      setOrdersError('Access Denied: Chef, manager, or admin role required.');
      return;
    }
    
    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      console.log('📡 Calling kitchenAPI.getKitchenOrders...');
      
      const ordersData = await kitchenAPI.getKitchenOrders(token);
      console.log('📊 Raw orders data:', ordersData);
      
      const transformedOrders = transformBackendOrders(Array.isArray(ordersData) ? ordersData : []);
      console.log('🔄 Transformed orders:', transformedOrders.length);
      
      setOrders(transformedOrders);
      
      // Calculate stats
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
      
      console.log('✅ Kitchen orders loaded successfully');
      
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
      console.error('❌ No token found for stations fetch');
      setStationsError('Authentication required');
      setStations([]);
      return;
    }

    if (!['admin', 'manager', 'chef'].includes(user?.role)) {
      console.log('ℹ️ User not authorized for stations API');
      setStations([]);
      return;
    }
    
    setStationsLoading(true);
    setStationsError(null);
    
    try {
      console.log('📡 Fetching stations from API...');
      
      const stationsData = await stationsAPI.getStations(token);
      console.log('📊 Stations data received:', stationsData);
      
      let stationsArray = [];
      // Handle different response formats
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
      console.log('✅ Stations loaded:', transformedStations.length);
      
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
      
      console.log(`🧑‍🍳 Starting preparation for order item ${orderItemId}`);
      
      // 1. First check if ingredients are available
      const checkResult = await chefInventoryAPI.checkOrderItemIngredients(orderItemId, token);
      console.log('📊 Check result:', checkResult);
      
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
      
      // 2. If available, deduct ingredients and start preparation
      const deductionResult = await chefInventoryAPI.deductIngredients(orderItemId, token);
      console.log('📊 Deduction result:', deductionResult);
      
      // 3. Update local state
      setOrders(prev => prev.map(order => ({
        ...order,
        items: order.items?.map(item => 
          item.id === orderItemId 
            ? { ...item, status: 'preparing' }
            : item
        )
      })));
      
      console.log('✅ Preparation started:', deductionResult.message || 'Ingredients deducted');
      
      // 4. Refresh ingredients data to show updated stock
      await fetchChefIngredients();
      
      return true;
      
    } catch (err) {
      console.error('❌ Start preparation error:', err);
      setOrdersError(err.message);
      return false;
    }
  };

  // Update order status via API
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} to ${newStatus}`);
      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Call API first
      const result = await kitchenAPI.updateOrderStatus(orderId, newStatus, token);
      console.log('📊 Update order status result:', result);
      
      if (result.success || result.message) {
        // Update local state
        setOrders(prev => prev.map(order => {
          if (order.id === orderId) {
            const updates = { status: newStatus };
            
            if (newStatus === 'preparing') {
              updates.startedTime = new Date().toISOString();
            }
            if (newStatus === 'ready') {
              updates.readyTime = new Date().toISOString();
            }
            if (newStatus === 'completed') {
              updates.completedTime = new Date().toISOString();
            }
            
            return { ...order, ...updates };
          }
          return order;
        }));
        
        // Refresh data to ensure consistency
        setTimeout(() => fetchKitchenData(), 1000);
      }
      
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      setOrdersError(err.message);
      fetchKitchenData();
    }
  };

  // Update item status via API
  const updateItemStatus = async (itemId, status, menuItemId) => {
    try {
      console.log(`🔄 Updating item ${itemId} to ${status}`);
      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // If starting preparation, use the inventory-aware method
      if (status === 'preparing') {
        const success = await handleStartPreparation(itemId, menuItemId);
        if (!success) return;
      } else {
        await kitchenAPI.updateItemStatus(itemId, status, token);
      }
      
      // Refresh orders to get updated status
      setTimeout(() => fetchKitchenData(), 1000);
      
    } catch (err) {
      console.error('❌ Error updating item status:', err);
      setOrdersError(err.message);
    }
  };

  // Handle refresh for all views
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered for view:', activeView);
    
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
  };



 const handleSaveRecipe = async (recipeData) => {
  const token = AuthService.getToken();
  
  if (!token) {
    alert('Authentication required');
    return;
  }

  try {
    console.log('💾 Saving recipe ingredients:', recipeData);
    
    // Chefs can only edit recipes for existing menu items
    if (!recipeData.menuItemId) {
      alert('Menu item ID is required to save recipe');
      return;
    }
    
    // Prepare ingredients array for bulk update
    const ingredientsArray = recipeData.ingredients.map(ingredient => ({
      ingredient_id: ingredient.ingredient_id,
      quantity_required: parseFloat(ingredient.quantity_required) || 0,
      unit: ingredient.unit,
      notes: ingredient.notes || ''
    }));
    
    console.log('📦 Bulk ingredients to add:', ingredientsArray);
    
    // First, clear existing ingredients
    const existingMenuItem = menuItems.find(m => m.id === recipeData.menuItemId);
    if (existingMenuItem && existingMenuItem.recipe && existingMenuItem.recipe.length > 0) {
      console.log('🗑️ Clearing existing recipe ingredients...');
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
    
    // Then add all ingredients at once using bulk endpoint
    if (ingredientsArray.length > 0) {
      console.log('➕ Adding new ingredients via bulk...');
      const bulkResult = await menuAPI.addIngredientsBulk(
        recipeData.menuItemId,
        ingredientsArray,
        token
      );
      
      if (!bulkResult || bulkResult.error) {
        throw new Error(bulkResult?.error || 'Failed to add ingredients');
      }
      
      console.log('✅ Bulk ingredients added:', bulkResult);
    }
    
    alert('Recipe updated successfully!');
    
    // Refresh data
    await fetchMenuItems();
    await fetchChefIngredients();
    
  } catch (err) {
    console.error('❌ Error saving recipe:', err);
    alert(`Failed to save recipe: ${err.message}`);
  }
};

  const handleUpdateRecipe = async (recipeData) => {
    // Alias for handleSaveRecipe
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
      console.log(`🗑️ Deleting menu item ${menuItemId}`);
      
      await menuAPI.deleteMenuItem(menuItemId, token);
      
      alert('Recipe deleted successfully!');
      
      // Refresh data
      await fetchMenuItems();
      
    } catch (err) {
      console.error('❌ Error deleting recipe:', err);
      alert(`Failed to delete recipe: ${err.message}`);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    console.log('🧑‍🍳 Chef Dashboard mounted');
    console.log('👤 User role:', user?.role);
    console.log('🔐 AuthService token exists:', AuthService.getToken() ? 'Yes' : 'No');
    
    // Run API connection test
    setTimeout(() => testApiConnection(), 500);
    
    const loadData = async () => {
      try {
        await Promise.all([
          fetchKitchenData(),
          fetchStations(),
          fetchChefIngredients(),
          fetchMenuItems() // Added this
        ]);
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
      }
    };
    
    loadData();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      console.log('⏰ Auto-refreshing data...');
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
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Re-fetch when view changes
  useEffect(() => {
    console.log('🔄 Active view changed to:', activeView);
    
    if (activeView === 'stations' && stations.length === 0) {
      fetchStations();
    }
    if (activeView === 'inventory' && ingredients.length === 0) {
      fetchChefIngredients();
    }
    if (activeView === 'ingredients' && menuItems.length === 0) {
      fetchMenuItems();
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
    console.log('➕ Add ingredient clicked');
    alert('Add ingredient functionality would open a form');
  };

  const handleUpdateIngredient = (itemId) => {
    console.log('✏️ Update ingredient:', itemId);
    alert(`Would open edit form for ingredient ${itemId}`);
  };

  const handleDeleteIngredient = (itemId) => {
    console.log('🗑️ Delete ingredient:', itemId);
    if (confirm(`Are you sure you want to delete ingredient ${itemId}?`)) {
      console.log(`Deleting ingredient ${itemId}`);
    }
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
        isLoading={ordersLoading || stationsLoading || ingredientsLoading || menuItemsLoading}
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
          isLoading={ordersLoading || stationsLoading || ingredientsLoading || menuItemsLoading}
        />

        {/* Error Messages */}
        {(ordersError || stationsError || ingredientsError || menuItemsError) && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-red-700">
                {ordersError || stationsError || ingredientsError || menuItemsError}
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
              updateItemStatus={updateItemStatus}
              setSelectedOrder={setSelectedOrder}
              isLoading={ordersLoading}
              error={ordersError}
              onStartPreparation={handleStartPreparation}
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

          {/* ============================================ */}
          {/* INGREDIENTS VIEW - ADDED */}
          {/* ============================================ */}
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
            <ReportsView />
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
        updateItemStatus={updateItemStatus}
        onStartPreparation={handleStartPreparation}
      />
    </div>
  );
}