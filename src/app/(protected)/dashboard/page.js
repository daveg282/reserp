'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { reportAPI, authAPI, menuAPI, tablesAPI, ordersAPI, kitchenAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';
import '@/lib/i18n';

// Import components
import ManagerSidebar from '@/components/manager/Sidebar';
import ManagerHeader from '@/components/manager/TopBar';
import DashboardView from '@/components/manager/DashboardView';
import StaffView from '@/components/manager/StaffView';
import InventoryView from '@/components/manager/InventoryView';
import ReportsView from '@/components/manager/ReportsView';
import SettingsView from '@/components/manager/SettingsView';
import StaffDetailModal from '@/components/manager/StaffDetailsModal';
import UserManagement from '@/components/manager/UserManagement';
import SystemConfiguration from '@/components/manager/SystemSetting';
import MenuManagement from '@/components/manager/MenuManagement';

// Import Operations components
import TablesReservationsView from '@/components/manager/TablesReservationsView';
import OrdersServiceView from '@/components/manager/OrdersServiceView';
import KitchenOperationsView from '@/components/manager/KitchenOperationsView';

export default function ManagerDashboard() {
  const { t } = useTranslation('manager');
  const { user, logout } = useAuth();
  
  // State declarations
  const [activeView, setActiveView] = useState('dashboard');
  const [activeSubsection, setActiveSubsection] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [inventoryReports, setInventoryReports] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [menuData, setMenuData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuStats, setMenuStats] = useState({});
  
  // Operations Data States
  const [tablesData, setTablesData] = useState([]);
  const [tableStats, setTableStats] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [kitchenData, setKitchenData] = useState(null);
  const [kitchenStats, setKitchenStats] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState({
    dashboard: false,
    staff: false,
    inventory: false,
    reports: false,
    users: false,
    menu: false,
    tables: false,
    orders: false,
    kitchen: false
  });
  
  // Error states
  const [error, setError] = useState({
    dashboard: null,
    staff: null,
    inventory: null,
    reports: null,
    users: null,
    menu: null,
    tables: null,
    orders: null,
    kitchen: null
  });

  // Fetch data based on active view
  useEffect(() => {
    const fetchViewData = async () => {
      switch (activeView) {
        case 'dashboard':
          if (!dashboardData) {
            await fetchDashboardData();
          }
          break;
        case 'staff':
          if (staffPerformance.length === 0) {
            await fetchStaffPerformance();
          }
          break;
        case 'inventory':
          if (!inventoryReports) {
            await fetchInventoryReport();
          }
          break;
        case 'reports':
          if (!reportsData) {
            await fetchReportsData();
          }
          break;
        case 'settings':
          if (activeSubsection === 'user-management' && usersData.length === 0) {
            await fetchUsers();
          }
          break;
        case 'menu':
          if (!menuData) {
            await fetchMenuData();
          }
          break;
        case 'operations':
          switch (activeSubsection) {
            case 'tables-reservations':
              if (tablesData.length === 0) {
                await fetchTablesData();
              }
              break;
            case 'orders-service':
              if (ordersData.length === 0) {
                await fetchOrdersData();
              }
              break;
            case 'kitchen-operations':
              if (!kitchenData) {
                await fetchKitchenData();
              }
              break;
          }
          break;
      }
    };

    fetchViewData();
  }, [activeView, activeSubsection]);

  // ========== TABLES DATA ==========
  const fetchTablesData = async () => {
    console.log('📊 Fetching tables data...');
    
    setLoadingData(prev => ({ ...prev, tables: true }));
    setError(prev => ({ ...prev, tables: null }));
    
    try {
      const tablesData = await tablesAPI.getTables();
      console.log('✅ Tables data received:', tablesData);
      
      setTablesData(tablesData);
      
      // Calculate stats
      const stats = {
        total: tablesData.length,
        available: tablesData.filter(t => t.status === 'available').length,
        occupied: tablesData.filter(t => t.status === 'occupied').length,
        reserved: tablesData.filter(t => t.status === 'reserved').length,
        maintenance: tablesData.filter(t => t.status === 'maintenance' || t.status === 'disabled').length,
        occupancyRate: `${Math.round((tablesData.filter(t => t.status !== 'available').length / tablesData.length) * 100)}%`,
        avgTurnover: '1.8 hours'
      };
      
      setTableStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching tables data:', err);
      setError(prev => ({ ...prev, tables: err.message || 'Failed to load tables data' }));
    } finally {
      setLoadingData(prev => ({ ...prev, tables: false }));
    }
  };

  // ========== ORDERS DATA ==========
  const fetchOrdersData = async () => {
    console.log('📊 Fetching orders data...');
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      setError(prev => ({ ...prev, orders: 'Authentication required' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, orders: true }));
    setError(prev => ({ ...prev, orders: null }));
    
    try {
      const ordersData = await ordersAPI.getAllOrders(authToken);
      console.log('✅ Orders data received:', ordersData);
      
      setOrdersData(ordersData);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = ordersData.filter(order => 
        order.created_at && order.created_at.startsWith(today)
      );
      
      const stats = {
        today: {
          total: todayOrders.length,
          revenue: todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          averageTime: '24 min',
          pending: todayOrders.filter(o => o.status === 'pending').length,
          preparing: todayOrders.filter(o => o.status === 'preparing').length,
          ready: todayOrders.filter(o => o.status === 'ready').length,
          served: todayOrders.filter(o => o.status === 'served').length
        }
      };
      
      setOrderStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching orders data:', err);
      setError(prev => ({ ...prev, orders: err.message || 'Failed to load orders data' }));
    } finally {
      setLoadingData(prev => ({ ...prev, orders: false }));
    }
  };

  // ========== KITCHEN DATA ==========
  const fetchKitchenData = async () => {
    console.log('📊 Fetching kitchen data...');
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      setError(prev => ({ ...prev, kitchen: 'Authentication required' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, kitchen: true }));
    setError(prev => ({ ...prev, kitchen: null }));
    
    try {
      // Fetch kitchen orders
      const kitchenOrders = await kitchenAPI.getKitchenOrders(authToken);
      console.log('✅ Kitchen data received:', kitchenOrders);
      
      setKitchenData({
        orders: kitchenOrders,
        urgentOrders: kitchenOrders.filter(order => {
          const orderTime = new Date(order.created_at);
          const now = new Date();
          const minutes = (now - orderTime) / (1000 * 60);
          return minutes > 20;
        })
      });
      
      // Calculate kitchen stats
      const stats = {
        totalOrders: kitchenOrders.length,
        urgentOrders: kitchenOrders.filter(order => {
          const orderTime = new Date(order.created_at);
          const now = new Date();
          const minutes = (now - orderTime) / (1000 * 60);
          return minutes > 20;
        }).length,
        avgPrepTime: '18 min',
        efficiency: '92%'
      };
      
      setKitchenStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching kitchen data:', err);
      setError(prev => ({ ...prev, kitchen: err.message || 'Failed to load kitchen data' }));
    } finally {
      setLoadingData(prev => ({ ...prev, kitchen: false }));
    }
  };

  // ========== TABLE ACTION HANDLERS ==========
  const handleOccupyTable = async (tableId) => {
    console.log('👥 Occupying table:', tableId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const customers = parseInt(prompt('Number of customers:')) || 2;
      await tablesAPI.occupyTable(tableId, customers, authToken);
      alert('Table occupied successfully');
      fetchTablesData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleFreeTable = async (tableId) => {
    console.log('🆓 Freeing table:', tableId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      await tablesAPI.freeTable(tableId, authToken);
      alert('Table freed successfully');
      fetchTablesData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReserveTable = async (tableId) => {
    console.log('📅 Reserving table:', tableId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    const customerName = prompt('Customer Name:');
    if (!customerName) return;
    
    const guests = parseInt(prompt('Number of guests:')) || 2;
    
    const reservationData = {
      customerName,
      guests,
      reservationTime: new Date().toISOString(),
      notes: prompt('Notes (optional):') || ''
    };
    
    try {
      await tablesAPI.reserveTable(tableId, reservationData, authToken);
      alert('Table reserved successfully');
      fetchTablesData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // ========== ORDER ACTION HANDLERS ==========
  const handleUpdateOrderStatus = async (orderId, status) => {
    console.log('🔄 Updating order status:', orderId, status);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      await ordersAPI.updateOrderStatus(orderId, status, authToken);
      alert(`Order status updated to ${status}`);
      fetchOrdersData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // ========== KITCHEN ACTION HANDLERS ==========
  const handleUpdateKitchenItemStatus = async (itemId, status) => {
    console.log('🔄 Updating kitchen item status:', itemId, status);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      await kitchenAPI.updateItemStatus(itemId, status, authToken);
      alert(`Item status updated to ${status}`);
      fetchKitchenData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateKitchenOrderStatus = async (orderId, status) => {
    console.log('🔄 Updating kitchen order status:', orderId, status);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      await kitchenAPI.updateOrderStatus(orderId, status, authToken);
      alert(`Order status updated to ${status}`);
      fetchKitchenData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // ========== DASHBOARD DATA ==========
  const fetchDashboardData = async () => {
    console.log('📊 Fetching dashboard data...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token found');
      setError(prev => ({ ...prev, dashboard: 'No authentication token found' }));
      return;
    }

    if (!user || !['admin', 'manager'].includes(user.role)) {
      console.error('❌ User role not authorized:', user?.role);
      setError(prev => ({ 
        ...prev, 
        dashboard: 'Access Denied: Manager or admin role required.' 
      }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, dashboard: true }));
    setError(prev => ({ ...prev, dashboard: null }));
    
    try {
      const response = await reportAPI.getDashboardData(authToken);
      console.log('✅ Dashboard data received:', response);
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.error || 'Failed to load dashboard data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(prev => ({ ...prev, dashboard: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, dashboard: false }));
    }
  };

  // ========== STAFF PERFORMANCE ==========
  const fetchStaffPerformance = async (params = { period: 'week' }) => {
    console.log('👥 Fetching staff performance data...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token');
      setError(prev => ({ ...prev, staff: 'No authentication token found' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, staff: true }));
    setError(prev => ({ ...prev, staff: null }));
    
    try {
      const response = await reportAPI.getStaffPerformanceReport(authToken, params);
      console.log('✅ Staff performance data received:', response);
      
      if (response.success) {
        setStaffPerformance(response.data?.staff_performance || response.data || []);
      } else {
        throw new Error(response.error || 'Failed to load staff performance data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching staff performance:', err);
      setError(prev => ({ ...prev, staff: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, staff: false }));
    }
  };

  // ========== INVENTORY REPORT ==========
  const fetchInventoryReport = async (detailed = false) => {
    console.log('📦 Fetching inventory report...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token');
      setError(prev => ({ ...prev, inventory: 'No authentication token found' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, inventory: true }));
    setError(prev => ({ ...prev, inventory: null }));
    
    try {
      const response = await reportAPI.getInventoryReport(authToken, detailed);
      console.log('✅ Inventory report received:', response);
      
      if (response.success) {
        setInventoryReports(response.data);
      } else {
        throw new Error(response.error || 'Failed to load inventory report');
      }
      
    } catch (err) {
      console.error('❌ Error fetching inventory report:', err);
      setError(prev => ({ ...prev, inventory: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, inventory: false }));
    }
  };

  // ========== REPORTS DATA ==========
  const fetchReportsData = async () => {
    console.log('📈 Fetching reports data...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token');
      setError(prev => ({ ...prev, reports: 'No authentication token found' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, reports: true }));
    setError(prev => ({ ...prev, reports: null }));
    
    try {
      const response = await reportAPI.getCustomReport(authToken, 'manager-summary');
      console.log('✅ Reports data received:', response);
      
      if (response.success) {
        setReportsData(response.data);
      } else {
        throw new Error(response.error || 'Failed to load reports data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching reports data:', err);
      setError(prev => ({ ...prev, reports: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, reports: false }));
    }
  };

  // ========== USERS DATA ==========
  const fetchUsers = async () => {
    console.log('👥 Fetching users data...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token');
      setError(prev => ({ ...prev, users: 'No authentication token found' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, users: true }));
    setError(prev => ({ ...prev, users: null }));
    
    try {
      const response = await authAPI.getAllUsers(authToken);
      console.log('✅ Users data received:', response);
      
      if (response.success) {
        setUsersData(response.users || []);
      } else {
        throw new Error(response.error || 'Failed to load users');
      }
      
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(prev => ({ ...prev, users: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, users: false }));
    }
  };

  // ========== MENU DATA ==========
  const fetchMenuData = async () => {
    console.log('📋 Fetching menu data...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token found');
      setError(prev => ({ ...prev, menu: 'No authentication token found' }));
      return;
    }

    if (!user || !['admin', 'manager'].includes(user.role)) {
      console.error('❌ User role not authorized:', user?.role);
      setError(prev => ({ 
        ...prev, 
        menu: 'Access Denied: Manager or admin role required.' 
      }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, menu: true }));
    setError(prev => ({ ...prev, menu: null }));
    
    try {
      // Fetch all menu data in parallel
      const [itemsResponse, categoriesResponse, statsResponse] = await Promise.all([
        menuAPI.getMenuItems(),
        menuAPI.getCategories(),
        menuAPI.getMenuStats(authToken)
      ]);
      
      console.log('✅ Menu data received');
      
      setMenuData(itemsResponse);
      setCategories(categoriesResponse);
      setMenuStats(statsResponse || {});
      
    } catch (err) {
      console.error('❌ Error fetching menu data:', err);
      setError(prev => ({ ...prev, menu: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, menu: false }));
    }
  };

  // ========== MENU ITEM HANDLERS ==========
  const handleAddMenuItem = async (itemData) => {
    console.log('➕ Adding menu item:', itemData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.createMenuItem(itemData, authToken);
      console.log('✅ Menu item added successfully:', response);
      
      alert('Menu item added successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error adding menu item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateMenuItem = async (itemId, itemData) => {
    console.log('✏️ Updating menu item:', itemId, itemData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.updateMenuItem(itemId, itemData, authToken);
      console.log('✅ Menu item updated successfully:', response);
      
      alert('Menu item updated successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error updating menu item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    console.log('🗑️ Deleting menu item:', itemId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.deleteMenuItem(itemId, authToken);
      console.log('✅ Menu item deleted successfully:', response);
      
      alert('Menu item deleted successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error deleting menu item:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleToggleAvailability = async (itemId) => {
    console.log('🔄 Toggling availability for menu item:', itemId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.toggleAvailability(itemId, authToken);
      console.log('✅ Menu item availability toggled:', response);
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error toggling availability:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleTogglePopular = async (itemId) => {
    console.log('⭐ Toggling popular status for menu item:', itemId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.togglePopular(itemId, authToken);
      console.log('✅ Menu item popular status toggled:', response);
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error toggling popular status:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ========== CATEGORY HANDLERS ==========
  const handleAddCategory = async (categoryData) => {
    console.log('➕ Adding category:', categoryData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.createCategory(categoryData, authToken);
      console.log('✅ Category added successfully:', response);
      
      alert('Category added successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error adding category:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    console.log('✏️ Updating category:', categoryId, categoryData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.updateCategory(categoryId, categoryData, authToken);
      console.log('✅ Category updated successfully:', response);
      
      alert('Category updated successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error updating category:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    console.log('🗑️ Deleting category:', categoryId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await menuAPI.deleteCategory(categoryId, authToken);
      console.log('✅ Category deleted successfully:', response);
      
      alert('Category deleted successfully');
      
      // Refresh menu data
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ========== USER MANAGEMENT HANDLERS ==========
  const handleAddUser = async (userData) => {
    console.log('➕ Adding user:', userData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await authAPI.register(userData, authToken);
      console.log('✅ User added successfully:', response);
      
      alert('User added successfully');
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('❌ Error adding user:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditUser = async (userId, userData) => {
    console.log('✏️ Editing user:', userId, userData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const dataToSend = { ...userData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      
      const response = await authAPI.updateUser(userId, dataToSend, authToken);
      console.log('✅ User updated successfully:', response);
      
      alert('User updated successfully');
      
      fetchUsers();
    } catch (err) {
      console.error('❌ Error updating user:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('🗑️ Deleting user:', userId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await authAPI.deleteUser(userId, authToken);
      console.log('✅ User deleted successfully:', response);
      
      alert('User deleted successfully');
      
      fetchUsers();
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleResetPassword = async (userId) => {
    console.log('🔑 Resetting password for user:', userId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await authAPI.adminResetPassword(userId, authToken);
      console.log('✅ Password reset email sent:', response);
      
      alert('Password reset email sent');
    } catch (err) {
      console.error('❌ Error resetting password:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleToggleStatus = async (userId, status) => {
    console.log('🔄 Toggling status for user:', userId, status);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const response = await authAPI.updateUser(userId, { is_active: status }, authToken);
      console.log('✅ User status updated:', response);
      
      alert(`User ${status ? 'activated' : 'deactivated'}`);
      
      fetchUsers();
    } catch (err) {
      console.error('❌ Error toggling user status:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ========== UTILITY FUNCTIONS ==========
  const handleRefresh = () => {
    console.log('🔄 Refreshing data for view:', activeView);
    
    switch (activeView) {
      case 'dashboard':
        fetchDashboardData();
        break;
      case 'staff':
        fetchStaffPerformance();
        break;
      case 'inventory':
        fetchInventoryReport();
        break;
      case 'reports':
        fetchReportsData();
        break;
      case 'settings':
        if (activeSubsection === 'user-management') {
          fetchUsers();
        }
        break;
      case 'menu':
        fetchMenuData();
        break;
      case 'operations':
        switch (activeSubsection) {
          case 'tables-reservations':
            fetchTablesData();
            break;
          case 'orders-service':
            fetchOrdersData();
            break;
          case 'kitchen-operations':
            fetchKitchenData();
            break;
        }
        break;
      default:
        fetchDashboardData();
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      AuthService.removeToken();
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
      setError(prev => ({ ...prev, dashboard: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setShowStaffDetails(true);
  };

  const generateDailyReport = async (date = null) => {
    console.log('📄 Generating daily report...');
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      alert('Authentication required');
      return null;
    }
    
    try {
      const response = await reportAPI.getDailySalesReport(
        authToken, 
        date || new Date().toISOString().split('T')[0]
      );
      
      if (response.success) {
        console.log('✅ Daily report generated:', response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate daily report');
      }
    } catch (err) {
      console.error('❌ Error generating daily report:', err);
      setError(prev => ({ ...prev, dashboard: err.message }));
      return null;
    }
  };

  // ========== RENDER VIEW ==========
  const renderView = () => {
    // Handle Operations subsection views
    if (activeView === 'operations') {
      switch (activeSubsection) {
        case 'tables-reservations':
          return (
            <TablesReservationsView
              userRole={user.role}
              tablesData={tablesData}
              tableStats={tableStats}
              isLoading={loadingData.tables}
              error={error.tables}
              onRefresh={fetchTablesData}
              onOccupyTable={handleOccupyTable}
              onFreeTable={handleFreeTable}
              onReserveTable={handleReserveTable}
            />
          );
        case 'orders-service':
          return (
            <OrdersServiceView
              userRole={user.role}
              ordersData={ordersData}
              orderStats={orderStats}
              isLoading={loadingData.orders}
              error={error.orders}
              onRefresh={fetchOrdersData}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          );
        case 'kitchen-operations':
          return (
            <KitchenOperationsView
              userRole={user.role}
              kitchenData={kitchenData}
              kitchenStats={kitchenStats}
              isLoading={loadingData.kitchen}
              error={error.kitchen}
              onRefresh={fetchKitchenData}
              onUpdateItemStatus={handleUpdateKitchenItemStatus}
              onUpdateOrderStatus={handleUpdateKitchenOrderStatus}
            />
          );
        default:
          return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900">Operations Dashboard</h2>
              <p className="text-gray-600 mt-2">Select an operations subsection from the sidebar.</p>
            </div>
          );
      }
    }

    // Handle Settings subsection views
    if (activeView === 'settings') {
      switch (activeSubsection) {
        case 'restaurant-settings':
          return (
            <SettingsView 
              user={user}
              onRefresh={handleRefresh}
            />
          );
        case 'user-management':
          return (
            <UserManagement
              users={usersData}
              onRefresh={fetchUsers}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
              isLoading={loadingData.users}
              error={error.users}
              userRole={user.role}
            />
          );
        case 'system-configuration':
          return (
            <SystemConfiguration 
              user={user}
              onRefresh={handleRefresh}
            />
          );
        default:
          return (
            <SettingsView 
              user={user}
              onRefresh={handleRefresh}
            />
          );
      }
    }

    // Handle other views
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            performanceStats={dashboardData?.performance_stats || {}}
            staffPerformance={dashboardData?.staff_performance || []}
            recentAlerts={dashboardData?.recent_alerts || []}
            popularItems={dashboardData?.popular_items || []}
            quickStats={dashboardData?.quick_stats || []}
            timeRange={timeRange}
            setActiveView={setActiveView}
            setSelectedStaff={handleStaffSelect}
            setShowStaffDetails={setShowStaffDetails}
            onRefresh={handleRefresh}
            isLoading={loadingData.dashboard}
            userRole={user.role}
          />
        );
      
      case 'staff':
        return (
          <StaffView
            staffPerformance={staffPerformance}
            setSelectedStaff={handleStaffSelect}
            setShowStaffDetails={setShowStaffDetails}
            onRefresh={() => fetchStaffPerformance({ period: 'week' })}
            isLoading={loadingData.staff}
            error={error.staff}
            userRole={user.role}
          />
        );
      
      case 'inventory':
        return (
          <InventoryView
            inventoryReports={inventoryReports}
            onRefresh={fetchInventoryReport}
            isLoading={loadingData.inventory}
            error={error.inventory}
            userRole={user.role}
          />
        );
      
      case 'reports':
        return (
          <ReportsView
            reportsData={reportsData}
            onGenerateReport={generateDailyReport}
            onRefresh={fetchReportsData}
            isLoading={loadingData.reports}
            error={error.reports}
            userRole={user.role}
          />
        );

      case 'menu':
        return (
          <MenuManagement
            menuData={menuData}
            categories={categories}
            menuStats={menuStats}
            onRefresh={fetchMenuData}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onToggleAvailability={handleToggleAvailability}
            onTogglePopular={handleTogglePopular}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            isLoading={loadingData.menu}
            error={error.menu}
            userRole={user.role}
          />
        );
      
      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
            <p className="text-gray-600 mt-2">This view is under development.</p>
          </div>
        );
    }
  };

  // ========== PERMISSION CHECK ==========
  if (!user || !['admin', 'manager'].includes(user.role)) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be a manager or administrator to access the management dashboard.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold">{user?.role || 'Not assigned'}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <ManagerSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        activeSubsection={activeSubsection}
        setActiveSubsection={setActiveSubsection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoading={isLoading || Object.values(loadingData).some(Boolean)}
        setIsLoading={setIsLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <ManagerHeader
          activeView={activeView}
          activeSubsection={activeSubsection}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onRefresh={handleRefresh}
          isLoading={isLoading || Object.values(loadingData).some(Boolean)}
          onGenerateReport={generateDailyReport}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />

        {/* Error Messages */}
        {Object.values(error).some(err => err !== null) && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-red-700">
                {error.dashboard || error.staff || error.inventory || error.reports || 
                 error.users || error.menu || error.tables || error.orders || error.kitchen}
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
                    setError({
                      dashboard: null,
                      staff: null,
                      inventory: null,
                      reports: null,
                      users: null,
                      menu: null,
                      tables: null,
                      orders: null,
                      kitchen: null
                    });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb for subsection */}
        {activeSubsection && (
          <div className="mx-4 mt-4 px-4 py-2 bg-white rounded-xl shadow-sm">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-purple-600 font-medium capitalize">{activeView}</span>
              <span className="mx-2">›</span>
              <span className="font-medium">
                {activeSubsection.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {renderView()}
        </div>
      </div>

      {/* Staff Detail Modal */}
      <StaffDetailModal
        selectedStaff={selectedStaff}
        showStaffDetails={showStaffDetails}
        setShowStaffDetails={setShowStaffDetails}
        onRefresh={() => fetchStaffPerformance({ period: 'week' })}
      />
    </div>
  );
}