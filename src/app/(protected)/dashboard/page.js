'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { reportAPI, authAPI, menuAPI, tablesAPI, ordersAPI, kitchenAPI, inventoryManagementAPI, suppliersAPI, recipesCostingAPI, purchaseOrdersAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';
import '@/lib/i18n';

// Main Components
import ManagerSidebar from '@/components/manager/Sidebar';
import ManagerHeader from '@/components/manager/TopBar';

// View Components
import DashboardView from '@/components/manager/DashboardView';
import StaffView from '@/components/manager/StaffView';
import InventoryView from '@/components/manager/InventoryView';
import ReportsView from '@/components/manager/ReportsView';
import SettingsView from '@/components/manager/SettingsView';
import MenuManagement from '@/components/manager/MenuManagement';
import UserManagement from '@/components/manager/UserManagement';
import SystemConfiguration from '@/components/manager/SystemSetting';

// Operations View Components
import TablesReservationsView from '@/components/manager/TablesReservationsView';
import OrdersServiceView from '@/components/manager/OrdersServiceView';
import KitchenOperationsView from '@/components/manager/KitchenOperationsView';

// New View Components
import StockManagementView from '@/components/manager/StockManagementView';
import SuppliersView from '@/components/manager/SuppliersView';
import RecipesCostingView from '@/components/manager/RecipesCostingView';

// Financial Dashboard Component
import FinancialDashboard from '@/components/manager/FinancialDashboard';

// Modal Components
import StaffDetailModal from '@/components/manager/StaffDetailsModal';

// Table Modal Component
import TableModal from '@/components/manager/TableModal';

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

  // Table Modal State
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableModalMode, setTableModalMode] = useState('create'); // 'create' or 'edit'
  
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
  
  // New Data States
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stockSummary, setStockSummary] = useState(null);
  const [suppliersData, setSuppliersData] = useState([]);
  const [supplierPerformanceData, setSupplierPerformanceData] = useState([]);
  const [recipesCostingData, setRecipesCostingData] = useState([]);
  const [costingAnalysis, setCostingAnalysis] = useState({});
  
  // Financial Data States
  const [financialData, setFinancialData] = useState(null);
  const [profitLossData, setProfitLossData] = useState(null);
  const [vatData, setVatData] = useState(null);
  const [financialPeriod, setFinancialPeriod] = useState('month');
  const [financialStartDate, setFinancialStartDate] = useState(null);
  const [financialEndDate, setFinancialEndDate] = useState(null);
  
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
    kitchen: false,
    stock: false,
    suppliers: false,
    recipes: false,
    financial: false
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
    kitchen: null,
    stock: null,
    suppliers: null,
    recipes: null,
    financial: null
  });

  // Ref to track previous subsection
  const previousSubsectionRef = useRef(activeSubsection);

  // Fetch data based on active view
  useEffect(() => {
  const fetchViewData = async () => {
    switch (activeView) {
      case 'dashboard':
        await fetchDashboardData(timeRange);
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
        // Handle inventory subsections
        if (activeSubsection === 'stock-management' && inventoryData.length === 0) {
          await fetchInventoryData();
        } else if (activeSubsection === 'suppliers' && suppliersData.length === 0) {
          await fetchSuppliersData();
        }
        break;
      case 'reports':
        if (!reportsData || activeSubsection !== previousSubsectionRef.current) {
          await fetchReportsData();
        }
        // REMOVE financial data fetching from here - it's now separate
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
      case 'stock':
        if (inventoryData.length === 0) {
          await fetchInventoryData();
        }
        break;
      case 'suppliers':
        if (suppliersData.length === 0) {
          await fetchSuppliersData();
        }
        break;
      case 'recipes':
        if (recipesCostingData.length === 0) {
          await fetchRecipesCostingData();
        }
        break;
      case 'financial': // NEW: Handle financial view
        if (!financialData || activeSubsection !== previousSubsectionRef.current) {
          await fetchFinancialData(financialPeriod, financialStartDate, financialEndDate);
        }
        break;
    }
  };

  fetchViewData();
}, [activeView, activeSubsection]);

  // Update the ref when activeSubsection changes
  useEffect(() => {
    previousSubsectionRef.current = activeSubsection;
  }, [activeSubsection]);

  // Set up real-time polling for dashboard
  useEffect(() => {
    let intervalId;

    if (activeView === 'dashboard') {
      // Fetch immediately
      fetchDashboardData(timeRange);
      
      // Set up polling every 30 seconds
      intervalId = setInterval(() => {
        fetchDashboardData(timeRange);
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeView, timeRange]);

  

  // ========== DASHBOARD DATA ==========
  const fetchDashboardData = async (period = 'today') => {
    console.log('📊 Fetching dashboard data for period:', period);
    
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
      // Pass the period as a query parameter
      const response = await reportAPI.getDashboardData(authToken, { period });
      
      console.log('✅ Dashboard data received for', period, ':', response);
      
      if (response.success) {
        let dashboardData = response.data;
        
        console.log('📋 Dashboard data structure:', dashboardData);
        console.log('📋 Performance stats for period:', dashboardData?.performance_stats?.[period]);
        
        if (dashboardData) {
          // Ensure we have performance stats for the current period
          const currentPeriodStats = dashboardData.performance_stats?.[period] || {
            revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
            customers: { current: 0, previous: 0, trend: 'up', change: 0 },
            averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
            tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
          };
          
          // Create a structure with all periods, but only fill the current one
          const transformedStats = {
            today: period === 'today' ? currentPeriodStats : {
              revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
              customers: { current: 0, previous: 0, trend: 'up', change: 0 },
              averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
              tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
            },
            week: period === 'week' ? currentPeriodStats : {
              revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
              customers: { current: 0, previous: 0, trend: 'up', change: 0 },
              averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
              tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
            },
            month: period === 'month' ? currentPeriodStats : {
              revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
              customers: { current: 0, previous: 0, trend: 'up', change: 0 },
              averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
              tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
            }
          };
          
          const finalDashboardData = {
            performance_stats: transformedStats,
            staff_performance: dashboardData.staff_performance || [],
            popular_items: dashboardData.popular_items || [],
            recent_orders: dashboardData.recent_orders || [],
            user_role: dashboardData.user_role || user?.role || 'manager',
            generated_at: dashboardData.generated_at || new Date().toISOString()
          };
          
          console.log('📊 Final dashboard data to set:', finalDashboardData);
          console.log('📊 Stats for current period', period, ':', transformedStats[period]);
          
          setDashboardData(finalDashboardData);
        }
      } else {
        throw new Error(response.error || response.message || 'Failed to load dashboard data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(prev => ({ ...prev, dashboard: err.message }));
      
      // Set empty data structure
      const emptyDashboardData = {
        performance_stats: {
          today: {
            revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
            customers: { current: 0, previous: 0, trend: 'up', change: 0 },
            averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
            tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
          },
          week: {
            revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
            customers: { current: 0, previous: 0, trend: 'up', change: 0 },
            averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
            tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
          },
          month: {
            revenue: { current: 0, previous: 0, trend: 'up', change: 0 },
            customers: { current: 0, previous: 0, trend: 'up', change: 0 },
            averageOrder: { current: 0, previous: 0, trend: 'up', change: 0 },
            tableTurnover: { current: 0, previous: 0, trend: 'up', change: 0 }
          }
        },
        staff_performance: [],
        popular_items: [],
        recent_orders: [],
        user_role: user?.role || 'manager',
        generated_at: new Date().toISOString()
      };
      
      setDashboardData(emptyDashboardData);
    } finally {
      setLoadingData(prev => ({ ...prev, dashboard: false }));
    }
  };

  // ========== FINANCIAL DATA ==========
// ========== FINANCIAL DATA ==========
const fetchFinancialData = async (period = 'month', startDate = null, endDate = null) => {
  console.log('💰 [START] Fetching financial data...', { period, startDate, endDate });
  
  const authToken = AuthService.getToken();
  console.log('🔑 Auth token:', authToken ? 'Present' : 'Missing');
  
  if (!authToken) {
    console.error('❌ No auth token found');
    setError(prev => ({ ...prev, financial: 'Authentication required' }));
    return;
  }

  setLoadingData(prev => ({ ...prev, financial: true }));
  setError(prev => ({ ...prev, financial: null }));
  
  try {
    // Build params
    const params = {
      period,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate })
    };
    
    console.log('📡 API params:', params);
    
    // Fetch all financial reports with detailed logging
    console.log('📊 Fetching summary report...');
    const summaryResponse = await reportAPI.getFinancialSummary(authToken, params);
    console.log('✅ Summary response:', summaryResponse);
    
    console.log('📊 Fetching profit loss report...');
    const plResponse = await reportAPI.getProfitLossReport(authToken, params);
    console.log('✅ Profit loss response:', plResponse);
    
    console.log('📊 Fetching VAT report...');
    const vatResponse = await reportAPI.getVATReport(authToken, params);
    console.log('✅ VAT response:', vatResponse);
    
    // Process responses
    console.log('🔄 Processing API responses...');
    
    if (summaryResponse && (summaryResponse.success || summaryResponse.data)) {
      console.log('📈 Setting financial summary data:', summaryResponse.data);
      setFinancialData(summaryResponse.data || summaryResponse);
    } else {
      console.warn('⚠️ Summary response not in expected format:', summaryResponse);
      setFinancialData(summaryResponse);
    }
    
    if (plResponse && (plResponse.success || plResponse.data)) {
      console.log('📊 Setting profit loss data:', plResponse.data);
      setProfitLossData(plResponse.data || plResponse);
    } else {
      console.warn('⚠️ Profit loss response not in expected format:', plResponse);
      setProfitLossData(plResponse);
    }
    
    if (vatResponse && (vatResponse.success || vatResponse.data)) {
      console.log('🧾 Setting VAT data:', vatResponse.data);
      setVatData(vatResponse.data || vatResponse);
    } else {
      console.warn('⚠️ VAT response not in expected format:', vatResponse);
      setVatData(vatResponse);
    }
    
    console.log('🎉 Financial data fetch complete!');
    
  } catch (err) {
    console.error('❌ Error fetching financial data:', err);
    console.error('❌ Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    setError(prev => ({ ...prev, financial: err.message || 'Failed to load financial data' }));
    
    // Set fallback empty data
    const emptyData = {
      total_revenue: 0,
      vat_collected: 0,
      avg_transaction_value: 0,
      transaction_count: 0,
      tips_collected: 0,
      discounts_given: 0,
      total_collected: 0,
      payment_methods: { cash: 0, card: 0, mobile: 0 }
    };
    
    setFinancialData(emptyData);
    setProfitLossData({
      revenue: { ...emptyData, net_revenue: 0 },
      gross_profit: { amount: 0, margin: 0 },
      net_profit: { amount: 0, margin: 0, is_profitable: false }
    });
    setVatData({
      summary: {
        total_transactions: 0,
        total_taxable_amount: 0,
        total_vat_collected: 0
      }
    });
  } finally {
    setLoadingData(prev => ({ ...prev, financial: false }));
    console.log('🏁 Financial data loading completed');
  }
};

  // ========== TABLES DATA ==========
  const fetchTablesData = async (filters = {}) => {
    console.log('📊 Fetching tables data...', filters);
    
    setLoadingData(prev => ({ ...prev, tables: true }));
    setError(prev => ({ ...prev, tables: null }));
    
    try {
      const tablesData = await tablesAPI.getTables(filters);
      console.log('✅ Tables data received:', tablesData.length, 'tables');
      
      setTablesData(tablesData);
      
      // Calculate stats from real data
      const stats = {
        total: tablesData.length,
        available: tablesData.filter(t => t.status === 'available').length,
        occupied: tablesData.filter(t => t.status === 'occupied').length,
        reserved: tablesData.filter(t => t.status === 'reserved').length,
        maintenance: tablesData.filter(t => t.status === 'maintenance' || t.status === 'disabled').length || 0,
        occupancyRate: tablesData.length > 0 ? 
          `${Math.round((tablesData.filter(t => t.status !== 'available').length / tablesData.length) * 100)}%` : '0%',
        avgTurnover: 'Calculating...'
      };
      
      setTableStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching tables data:', err);
      setError(prev => ({ ...prev, tables: err.message || 'Failed to load tables data' }));
      setTablesData([]);
      setTableStats({
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0,
        occupancyRate: '0%',
        avgTurnover: 'N/A'
      });
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
      
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = ordersData.filter(order => 
        order.created_at && order.created_at.startsWith(today)
      );
      
      const totalRevenue = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      const stats = {
        today: {
          total: todayOrders.length,
          revenue: totalRevenue,
          averageTime: calculateAverageOrderTime(todayOrders),
          pending: todayOrders.filter(o => o.status === 'pending').length,
          preparing: todayOrders.filter(o => o.status === 'preparing' || o.status === 'preparation').length,
          ready: todayOrders.filter(o => o.status === 'ready').length,
          served: todayOrders.filter(o => o.status === 'served' || o.status === 'completed').length,
          cancelled: todayOrders.filter(o => o.status === 'cancelled').length
        },
        allTime: {
          total: ordersData.length,
          totalRevenue: ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          averageOrderValue: ordersData.length > 0 ? 
            ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0) / ordersData.length : 0
        }
      };
      
      setOrderStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching orders data:', err);
      setError(prev => ({ ...prev, orders: err.message || 'Failed to load orders data' }));
      setOrdersData([]);
      setOrderStats({
        today: {
          total: 0,
          revenue: 0,
          averageTime: '0 min',
          pending: 0,
          preparing: 0,
          ready: 0,
          served: 0,
          cancelled: 0
        },
        allTime: {
          total: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        }
      });
    } finally {
      setLoadingData(prev => ({ ...prev, orders: false }));
    }
  };

  // Helper function to calculate average order time
  const calculateAverageOrderTime = (orders) => {
    if (!orders || orders.length === 0) return '0 min';
    
    let totalMinutes = 0;
    let count = 0;
    
    orders.forEach(order => {
      if (order.created_at && order.completed_at) {
        const created = new Date(order.created_at);
        const completed = new Date(order.completed_at);
        const diffMinutes = (completed - created) / (1000 * 60);
        
        if (diffMinutes > 0 && diffMinutes < 480) {
          totalMinutes += diffMinutes;
          count++;
        }
      }
    });
    
    if (count === 0) return 'N/A';
    
    const avgMinutes = Math.round(totalMinutes / count);
    return `${avgMinutes} min`;
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
      
      const stats = {
        totalOrders: kitchenOrders.length,
        urgentOrders: kitchenOrders.filter(order => {
          const orderTime = new Date(order.created_at);
          const now = new Date();
          const minutes = (now - orderTime) / (1000 * 60);
          return minutes > 20;
        }).length,
        avgPrepTime: calculateAveragePrepTime(kitchenOrders),
        efficiency: calculateKitchenEfficiency(kitchenOrders)
      };
      
      setKitchenStats(stats);
      
    } catch (err) {
      console.error('❌ Error fetching kitchen data:', err);
      setError(prev => ({ ...prev, kitchen: err.message || 'Failed to load kitchen data' }));
      setKitchenData({
        orders: [],
        urgentOrders: []
      });
      setKitchenStats({
        totalOrders: 0,
        urgentOrders: 0,
        avgPrepTime: '0 min',
        efficiency: '0%'
      });
    } finally {
      setLoadingData(prev => ({ ...prev, kitchen: false }));
    }
  };

  // Helper function to calculate average prep time
  const calculateAveragePrepTime = (orders) => {
    if (!orders || orders.length === 0) return '0 min';
    
    let totalMinutes = 0;
    let count = 0;
    
    orders.forEach(order => {
      if (order.started_at && order.completed_at) {
        const started = new Date(order.started_at);
        const completed = new Date(order.completed_at);
        const diffMinutes = (completed - started) / (1000 * 60);
        
        if (diffMinutes > 0 && diffMinutes < 120) {
          totalMinutes += diffMinutes;
          count++;
        }
      }
    });
    
    if (count === 0) return 'N/A';
    
    const avgMinutes = Math.round(totalMinutes / count);
    return `${avgMinutes} min`;
  };

  // Helper function to calculate kitchen efficiency
  const calculateKitchenEfficiency = (orders) => {
    if (!orders || orders.length === 0) return '0%';
    
    const completedOrders = orders.filter(order => 
      order.status === 'completed' || order.status === 'ready' || order.status === 'served'
    ).length;
    
    const onTimeOrders = orders.filter(order => {
      if (order.created_at && order.completed_at) {
        const created = new Date(order.created_at);
        const completed = new Date(order.completed_at);
        const diffMinutes = (completed - created) / (1000 * 60);
        return diffMinutes <= 30;
      }
      return false;
    }).length;
    
    const efficiency = (onTimeOrders / orders.length) * 100;
    return `${Math.round(efficiency)}%`;
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
      setStaffPerformance([]);
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
      setInventoryReports(null);
    } finally {
      setLoadingData(prev => ({ ...prev, inventory: false }));
    }
  };

  // ========== REPORTS DATA ==========
  const fetchReportsData = async () => {
    console.log('📈 Fetching reports data for:', activeSubsection);
    
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      console.error('❌ No auth token');
      setError(prev => ({ ...prev, reports: 'No authentication token found' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, reports: true }));
    setError(prev => ({ ...prev, reports: null }));
    
    try {
      let response;
      
      // Use ONLY the endpoints that exist in your backend
      switch (activeSubsection) {
        case 'daily-reports':
          response = await reportAPI.getDailySalesReport(authToken);
          break;
        case 'financial-reports':
        case 'revenue-tracking':
        case 'profit-loss':
          // For financial reports, we'll use FinancialDashboard component
          // Don't fetch separate reports data here
          response = await reportAPI.getDashboardData(authToken);
          break;
        case 'inventory-reports':
          response = await reportAPI.getInventoryReport(authToken);
          break;
        case 'performance-reports':
          response = await reportAPI.getStaffPerformanceReport(authToken);
          break;
        case 'business-intelligence':
        case 'expenses':
        default:
          // For other report types or default, use dashboard data
          response = await reportAPI.getDashboardData(authToken);
      }
      
      console.log('✅ Reports data received:', response);
      
      if (response.success) {
        // Pass the API data directly to ReportsView
        setReportsData({
          ...response.data,
          reportType: activeSubsection,
          generated_at: response.data?.generated_at || new Date().toISOString()
        });
      } else {
        throw new Error(response.error || response.message || 'Failed to load reports data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching reports data:', err);
      setError(prev => ({ ...prev, reports: err.message }));
      setReportsData(null);
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
      setUsersData([]);
    } finally {
      setLoadingData(prev => ({ ...prev, users: false }));
    }
  };

  // ========== MENU DATA ==========
  const fetchMenuData = async () => {
    const authToken = AuthService.getToken();
    
    setLoadingData(prev => ({ ...prev, menu: true }));
    setError(prev => ({ ...prev, menu: null }));
    
    try {
      // Get menu items and categories
      const [itemsResponse, categoriesResponse] = await Promise.all([
        menuAPI.getMenuItems(),
        menuAPI.getCategories()
      ]);
      
      const menuItems = itemsResponse.items || itemsResponse || [];
      const categories = categoriesResponse.categories || categoriesResponse || [];
      
      console.log('📊 Categories from API:', categories);
      
      // DEBUG: Check what available values we actually have
      console.log('🔍 Checking menu items availability:');
      console.log('📊 Total menu items:', menuItems.length);
      console.log('📊 Sample items (first 3):', menuItems.slice(0, 3).map(item => ({
        name: item.name,
        available: item.available,
        available_type: typeof item.available
      })));
      
      // Count availability types
      const availabilityCounts = {
        available_1: menuItems.filter(item => item.available === 1).length,
        available_true: menuItems.filter(item => item.available === true).length,
        unavailable_0: menuItems.filter(item => item.available === 0).length,
        unavailable_false: menuItems.filter(item => item.available === false).length,
        null_undefined: menuItems.filter(item => 
          item.available === null || item.available === undefined
        ).length
      };
      console.log('📊 Availability counts:', availabilityCounts);
      
      // Calculate basic stats from menu items
      const menuStats = {
        total_items: menuItems.length,
        available_items: menuItems.filter(item => item.available === 1).length,
        popular_items: menuItems.filter(item => item.popular === 1).length,
        total_categories: categories.length,
      };
      
      console.log('📊 Calculated menu stats:', menuStats);
      
      // IMPORTANT: Preserve ALL category data from API, just add item_count
      const categoriesWithCounts = categories.map(category => {
        // Check if category is an object with id property
        if (!category || typeof category !== 'object') {
          console.warn('Invalid category data:', category);
          return { ...category, item_count: 0 };
        }
        
        return {
          ...category,
          item_count: menuItems.filter(item => {
            // Handle both category_id and category.id
            const itemCategoryId = item.category_id || item.category?.id;
            return itemCategoryId === category.id;
          }).length
        };
      });
      
      console.log('📊 Categories with counts:', categoriesWithCounts);
      
      setMenuData(menuItems);
      setCategories(categoriesWithCounts);
      setMenuStats(menuStats);
      
    } catch (err) {
      console.error('❌ Error fetching menu data:', err);
      setError(prev => ({ ...prev, menu: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, menu: false }));
    }
  };

  // ========== STOCK MANAGEMENT DATA ==========
  const fetchInventoryData = async () => {
  console.log('📦 [START] Fetching inventory data...');
  
  const authToken = AuthService.getToken();
  if (!authToken) {
    setError(prev => ({ ...prev, stock: 'Authentication required' }));
    return;
  }
  
  setLoadingData(prev => ({ ...prev, stock: true }));
  setError(prev => ({ ...prev, stock: null }));
  
  try {
    // Fetch inventory data
    console.log('📡 Calling GET /inventory/ingredients');
    const inventoryResponse = await inventoryManagementAPI.getInventory(authToken);
    console.log('✅ Inventory API response:', inventoryResponse);
    
    // DEBUG: Check the actual response structure
    console.log('🔍 Response type:', typeof inventoryResponse);
    console.log('🔍 Is array?', Array.isArray(inventoryResponse));
    if (!Array.isArray(inventoryResponse) && inventoryResponse) {
      console.log('🔍 Object keys:', Object.keys(inventoryResponse));
    }
    
    // Extract inventory data - Handle multiple possible response formats
    let inventoryDataFromAPI = [];
    
    if (Array.isArray(inventoryResponse)) {
      // Case 1: API returns array directly
      inventoryDataFromAPI = inventoryResponse;
      console.log('📊 API returned array directly');
    } else if (inventoryResponse && typeof inventoryResponse === 'object') {
      // Case 2: API returns object with data property
      if (Array.isArray(inventoryResponse.data)) {
        inventoryDataFromAPI = inventoryResponse.data;
        console.log('📊 API returned {data: array}');
      } 
      // Case 3: API returns object with items property
      else if (Array.isArray(inventoryResponse.items)) {
        inventoryDataFromAPI = inventoryResponse.items;
        console.log('📊 API returned {items: array}');
      }
      // Case 4: API returns object with ingredients property
      else if (Array.isArray(inventoryResponse.ingredients)) {
        inventoryDataFromAPI = inventoryResponse.ingredients;
        console.log('📊 API returned {ingredients: array}');
      }
      // Case 5: API returns success wrapper
      else if (inventoryResponse.success && Array.isArray(inventoryResponse.data)) {
        inventoryDataFromAPI = inventoryResponse.data;
        console.log('📊 API returned {success: true, data: array}');
      }
    }
    
    console.log(`📊 Extracted ${inventoryDataFromAPI.length} items`);
    
    // Debug first item to see structure
    if (inventoryDataFromAPI.length > 0) {
      console.log('🔍 First item structure:', inventoryDataFromAPI[0]);
      console.log('🔍 First item keys:', Object.keys(inventoryDataFromAPI[0]));
    }
    
    // Transform inventory data
    // In fetchInventoryData function in page.js
const transformedInventory = inventoryDataFromAPI.map(item => {
  // DEBUG: Log what we're receiving
  console.log('🔍 Raw item from API:', {
    id: item.id,
    name: item.name,
    all_keys: Object.keys(item)
  });
  
  // Use the EXACT ID from the database
  const itemId = item.id; // Don't look for alternatives, use item.id
  
  return {
    id: itemId, // This must be 25 for Basmati Rice
    name: item.name || item.ingredient_name || 'Unnamed Item',
    code: item.code || `ING-${itemId.toString().padStart(3, '0')}`,
    stockLevel: parseFloat(item.current_stock || item.stock || item.quantity || 0),
    minStock: parseFloat(item.minimum_stock || item.min_stock || item.reorder_level || 0),
    unit: item.unit || 'unit',
    unitCost: parseFloat(item.cost_per_unit || item.unit_cost || item.cost || 0),
    supplier: item.supplier_name || item.supplier || 'No supplier',
    supplierCode: item.supplier_id || '',
    category: item.category || 'Uncategorized',
    lastUpdated: item.updated_at || item.last_updated || new Date().toISOString(),
    // Keep original data
    _original: item
  };
});

// Add debugging after transformation
console.log('🔍 Transformed inventory IDs:', transformedInventory.map(item => ({
  id: item.id,
  name: item.name
})));
    // Try to fetch other data (low stock, summary, categories)
    let lowStockData = [];
    let summaryData = {};
    let categories = [];
    
    try {
      const lowStockResponse = await inventoryManagementAPI.getLowStock(authToken);
      console.log('✅ Low stock API response:', lowStockResponse);
      
      // Extract low stock data with same logic
      if (Array.isArray(lowStockResponse)) {
        lowStockData = lowStockResponse;
      } else if (lowStockResponse && Array.isArray(lowStockResponse.data)) {
        lowStockData = lowStockResponse.data;
      } else if (lowStockResponse && Array.isArray(lowStockResponse.lowStockItems)) {
        lowStockData = lowStockResponse.lowStockItems;
      } else {
        lowStockData = lowStockResponse.data || lowStockResponse || [];
      }
    } catch (lowStockError) {
      console.warn('⚠️ Low stock API failed, using fallback:', lowStockError.message);
      // Fallback: Calculate low stock from inventory
      lowStockData = transformedInventory.filter(item => item.stockLevel <= item.minStock);
    }
    
    try {
      const summaryResponse = await inventoryManagementAPI.getStockSummary(authToken);
      console.log('✅ Summary API response:', summaryResponse);
      summaryData = summaryResponse.data || summaryResponse || {};
    } catch (summaryError) {
      console.warn('⚠️ Summary API failed, calculating manually:', summaryError.message);
      // Calculate summary manually
      const totalValue = transformedInventory.reduce((sum, item) => 
        sum + (item.stockLevel * item.unitCost), 0);
      
      const lowStockItems = transformedInventory.filter(item => 
        item.stockLevel <= item.minStock);
      
      summaryData = {
        totalValue: totalValue,
        lowStockCount: lowStockItems.length,
        turnoverRate: 3.2,
        turnoverDays: 30,
        newItemsThisMonth: 5,
        totalValueChange: '+5.2%'
      };
    }
    
    try {
      const categoriesResponse = await inventoryManagementAPI.getCategories(authToken);
      console.log('✅ Categories API response:', categoriesResponse);
      
      // Extract categories with same logic
      if (Array.isArray(categoriesResponse)) {
        categories = categoriesResponse;
      } else if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
        categories = categoriesResponse.data;
      } else if (categoriesResponse && Array.isArray(categoriesResponse.categories)) {
        categories = categoriesResponse.categories;
      }
    } catch (categoriesError) {
      console.warn('⚠️ Categories API failed, extracting from inventory:', categoriesError.message);
      // Extract categories from inventory data
      const uniqueCategories = [...new Set(transformedInventory
        .map(item => item.category)
        .filter(Boolean))];
      
      categories = uniqueCategories.map((cat, index) => ({ 
        id: index + 1, 
        name: cat 
      }));
    }
    
    // Transform low stock data
    const transformedLowStock = lowStockData.map(item => ({
      id: item.id || item.ingredient_id || item.item_id,
      name: item.name || item.ingredient_name || 'Unnamed',
      stockLevel: parseFloat(item.current_stock || item.stock || item.quantity || 0),
      minStock: parseFloat(item.minimum_stock || item.min_stock || item.reorder_level || 0),
      unit: item.unit || 'unit'
    }));
    
    // Calculate final values
    const totalValue = transformedInventory.reduce((sum, item) => 
      sum + (item.stockLevel * item.unitCost), 0);
    
    const lowStockItemsFromInventory = transformedInventory.filter(item => 
      item.stockLevel <= item.minStock);
    
    const lowStockValue = lowStockItemsFromInventory.reduce((sum, item) => 
      sum + (item.stockLevel * item.unitCost), 0);
    
    console.log('📊 Final data ready:');
    console.log('- Inventory items:', transformedInventory.length);
    console.log('- Low stock items:', transformedLowStock.length);
    console.log('- Total value:', totalValue);
    
    // Set the state
    setInventoryData(transformedInventory);
    setLowStockItems(transformedLowStock);
    setStockSummary({
      totalItems: transformedInventory.length,
      lowStockCount: lowStockItemsFromInventory.length,
      lowStockValue: lowStockValue,
      totalValue: totalValue,
      totalValueChange: summaryData.totalValueChange || '+5.2%',
      turnoverRate: summaryData.turnoverRate || 3.2,
      turnoverDays: summaryData.turnoverDays || 30,
      newItemsThisMonth: summaryData.newItemsThisMonth || 5,
      categories: categories
    });
    
  } catch (err) {
    console.error('❌ Error in fetchInventoryData:', err);
    setError(prev => ({ ...prev, stock: err.message || 'Failed to fetch inventory data' }));
    
    // Set empty state on error
    setInventoryData([]);
    setLowStockItems([]);
    setStockSummary({
      totalItems: 0,
      lowStockCount: 0,
      lowStockValue: 0,
      totalValue: 0,
      totalValueChange: '0%',
      turnoverRate: 0,
      turnoverDays: 0,
      newItemsThisMonth: 0,
      categories: []
    });
  } finally {
    setLoadingData(prev => ({ ...prev, stock: false }));
  }
};

  // ========== SUPPLIERS DATA ==========
  const fetchSuppliersData = async () => {
    console.log('🏢 Fetching suppliers data...');
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      setError(prev => ({ ...prev, suppliers: 'Authentication required' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, suppliers: true }));
    setError(prev => ({ ...prev, suppliers: null }));
    
    try {
      // Fetch suppliers data
      const suppliersResponse = await suppliersAPI.getSuppliers(authToken);
      console.log('✅ Suppliers API raw response:', suppliersResponse);
      
      // CRITICAL FIX: The API returns an ARRAY directly, not {data: [...]}
      const suppliersFromAPI = Array.isArray(suppliersResponse) 
        ? suppliersResponse 
        : suppliersResponse?.data || suppliersResponse?.suppliers || [];
      
      console.log('📊 Suppliers array:', suppliersFromAPI);
      console.log('📊 First supplier:', suppliersFromAPI[0]);
      
      // Transform API data to match frontend component expectations
      const transformedSuppliers = suppliersFromAPI.map(supplier => ({
        // Basic info from API (already in correct format)
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contact_person || '',  // FIX: Use actual field name
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address || '',
        paymentTerms: supplier.payment_terms || '',    // FIX: Use actual field name
        status: supplier.status || 'active',
        
        // Fields that come from API
        lastOrderDate: supplier.last_order_date || supplier.created_at,
        
        // Default values (since performance API might fail)
        rating: 4.5,
        totalOrders: 0,
        totalValue: 0,
        deliveryTime: 2,
        monthlySpend: 0,
        
        // Additional fields for the UI
        category: supplier.category || 'general',
        isPreferred: supplier.is_preferred || false
      }));
      
      console.log('📊 Transformed suppliers:', transformedSuppliers);
      
      // Set the transformed data
      setSuppliersData(transformedSuppliers);
      
      // Try to fetch performance data
      try {
        const performanceResponse = await suppliersAPI.getSupplierPerformance(authToken);
        console.log('✅ Supplier performance data:', performanceResponse);
        
        // If performance data exists, enrich the suppliers
        if (Array.isArray(performanceResponse)) {
          const enrichedSuppliers = transformedSuppliers.map(supplier => {
            const perf = performanceResponse.find(p => p.id === supplier.id);
            return perf ? {
              ...supplier,
              rating: perf.rating || 4.5,
              totalOrders: perf.total_orders || 0,
              totalValue: perf.total_value || 0,
              deliveryTime: perf.avg_delivery_days || 2,
              monthlySpend: perf.monthly_spend || 0,
              lastOrderDate: perf.last_order_date || supplier.lastOrderDate
            } : supplier;
          });
          
          console.log('💰 Enriched suppliers:', enrichedSuppliers);
          setSuppliersData(enrichedSuppliers);
        }
        
        setSupplierPerformanceData(performanceResponse);
        
      } catch (perfError) {
        console.warn('⚠️ Performance data failed:', perfError.message);
        // Keep using default values if performance data fails
      }
      
    } catch (err) {
      console.error('❌ Error fetching suppliers data:', err);
      setError(prev => ({ ...prev, suppliers: err.message || 'Failed to load suppliers' }));
      setSuppliersData([]);
      setSupplierPerformanceData([]);
    } finally {
      setLoadingData(prev => ({ ...prev, suppliers: false }));
    }
  };

  // ========== RECIPES & COSTING DATA ==========
  const fetchRecipesCostingData = async () => {
    console.log('🧮 Fetching recipes & costing data...');
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      setError(prev => ({ ...prev, recipes: 'Authentication required' }));
      return;
    }
    
    setLoadingData(prev => ({ ...prev, recipes: true }));
    setError(prev => ({ ...prev, recipes: null }));
    
    try {
      // Fetch recipes with costing and analysis
      const [menuItems, costingAnalysis] = await Promise.all([
        recipesCostingAPI.getMenuItemsWithCosting(authToken),
        recipesCostingAPI.getCostVarianceReport(authToken)
      ]);
      
      console.log('✅ Recipes & costing data loaded:', menuItems.length, 'items');
      
      setRecipesCostingData(menuItems);
      setCostingAnalysis(costingAnalysis);
      
    } catch (err) {
      console.error('❌ Error fetching recipes & costing data:', err);
      setError(prev => ({ ...prev, recipes: err.message }));
    } finally {
      setLoadingData(prev => ({ ...prev, recipes: false }));
    }
  };

  // ========== TABLE CRUD ACTION HANDLERS ==========
  const handleCreateTable = async (tableData) => {
    console.log('➕ Creating new table - data received:', tableData);
    
    // Validate that we got data
    if (!tableData || typeof tableData !== 'object') {
      console.error('❌ No table data received or invalid data');
      alert('Error: No table data received');
      return false;
    }
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return false;
    }
    
    try {
      // The data should already have customer_count and notes from TableModal
      console.log('📤 Sending to API:', tableData);
      
      const response = await tablesAPI.createTable(tableData, authToken);
      console.log('✅ API Response:', response);
      
      alert('Table created successfully');
      fetchTablesData();
      setShowTableModal(false);
      return true;
      
    } catch (err) {
      console.error('❌ Error creating table:', err);
      alert(`Error: ${err.message}`);
      return false;
    }
  };

  const handleEditTable = async (tableId, tableData) => {
    console.log('✏️ Editing table:', tableId, tableData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return false;
    }
    
    try {
      const response = await tablesAPI.updateTable(tableId, tableData, authToken);
      console.log('✅ Table updated successfully:', response);
      
      alert('Table updated successfully');
      fetchTablesData();
      setShowTableModal(false);
      return true;
    } catch (err) {
      console.error('❌ Error updating table:', err);
      alert(`Error: ${err.message}`);
      return false;
    }
  };

  const handleDeleteTable = async (tableId) => {
    console.log('🗑️ Deleting table:', tableId);
    
    if (!confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
      return false;
    }
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return false;
    }
    
    try {
      const response = await tablesAPI.deleteTable(tableId, authToken);
      console.log('✅ Table deleted successfully:', response);
      
      alert('Table deleted successfully');
      fetchTablesData();
      return true;
    } catch (err) {
      console.error('❌ Error deleting table:', err);
      alert(`Error: ${err.message}`);
      return false;
    }
  };

  const handleOccupyTable = async (tableId) => {
    console.log('👥 Occupying table:', tableId);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      const customer_count = parseInt(prompt('Number of customers:')) || 2;
      if (isNaN(customer_count) || customer_count < 1) {
        alert('Please enter a valid number of customers (at least 1)');
        return;
      }
      
      await tablesAPI.occupyTable(tableId, customer_count, authToken);
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
    
    const customer_count = parseInt(prompt('Number of guests:')) || 2;
    if (isNaN(customer_count) || customer_count < 1) {
      alert('Please enter a valid number of guests (at least 1)');
      return;
    }
    
    try {
      await tablesAPI.reserveTable(tableId, { customer_count }, authToken);
      alert('Table reserved successfully');
      fetchTablesData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateTableStatus = async (tableId, status, customer_count = 0) => {
    console.log('🔄 Updating table status:', tableId, status);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      await tablesAPI.updateTableStatus(tableId, status, authToken, customer_count);
      alert(`Table status updated to ${status}`);
      fetchTablesData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Table Modal Handlers
  const openCreateTableModal = () => {
    setSelectedTable(null);
    setTableModalMode('create');
    setShowTableModal(true);
  };

  const openEditTableModal = (tableId, tableData) => {
    const table = tablesData.find(t => t.id === tableId);
    if (table) {
      setSelectedTable({
        id: table.id,
        table_number: table.table_number || table.number,
        capacity: table.capacity,
        section: table.section || table.location,
        status: table.status,
        notes: table.notes || ''
      });
      setTableModalMode('edit');
      setShowTableModal(true);
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
      await kitchenAPI.updateOrderItemStatus(itemId, status, authToken);
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
      fetchMenuData();
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ========== STOCK MANAGEMENT HANDLERS ==========
const handleAddInventoryItem = async (itemData) => {
  console.log('🔍 [START] handleAddInventoryItem');
  console.log('📥 Received itemData:', itemData);
  
  const authToken = AuthService.getToken();
  if (!authToken) {
    console.error('❌ No auth token');
    throw new Error('Authentication required');
  }
  
  try {
    const backendItemData = convertFormToBackend(itemData);
    
    console.log('📤 Calling API with:', backendItemData);
    console.log('🔑 Auth token present:', !!authToken);
    
    const response = await inventoryManagementAPI.createInventoryItem(backendItemData, authToken);
    console.log('✅ API Response:', response);
    
    // Refresh data after success
    if (fetchInventoryData) {
      await fetchInventoryData();
    }
    
    return { success: true, data: response };
    
  } catch (error) {
    console.error('❌ Error in handleAddInventoryItem:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

const handleEditInventoryItem = async (itemId, itemData) => {
  console.log('✏️ Editing item:', itemId, itemData);
  
  const authToken = AuthService.getToken();
  if (!authToken) {
    throw new Error('Authentication required');
  }
  
  try {
    // Use the helper function to convert data
    const backendItemData = convertFormToBackend(itemData);
    
    console.log('📤 Updating item (converted):', backendItemData);
    
    const response = await inventoryManagementAPI.updateInventoryItem(itemId, backendItemData, authToken);
    console.log('✅ Update result:', response);
    
    // Check if response indicates success
    if (response && (response.success === true || response.id || response.message)) {
      // Refresh data after success
      if (fetchInventoryData) {
        await fetchInventoryData();
      }
      return { success: true, data: response };
    } else {
      const errorMsg = response?.error || response?.message || 'Failed to update item';
      throw new Error(errorMsg);
    }
    
  } catch (error) {
    console.error('❌ Error updating item:', error);
    throw error;
  }
};

  const handleDeleteInventoryItem = async (itemId) => {
  try {
    console.log('🔄 Starting delete for item:', itemId);
    const authToken = AuthService.getToken();
    
    if (!authToken) {
      return { success: false, message: 'Authentication required' };
    }
    
    console.log('📡 Calling delete API for ID:', itemId);
    
    // ✅ CORRECT: (id, token) - matches API signature
    const response = await inventoryManagementAPI.deleteInventoryItem(itemId, authToken);
    
    console.log('✅ Delete API Response:', response);
    
    if (response && (response.success === true || response.message || response.id)) {
      console.log('✅ Delete successful');
      fetchInventoryData(); // Refresh the list
      return { success: true, message: 'Item deleted successfully!' };
    } else {
      console.log('⚠️ Delete response ambiguous:', response);
      // Still try to refresh if no error
      fetchInventoryData();
      return { success: true, message: 'Item deleted successfully!' };
    }
    
  } catch (error) {
    console.error('❌ Delete item error:', error);
    return { success: false, message: error.message || 'Failed to delete item' };
  }
};
// ========== HELPER FUNCTIONS ==========
const convertFormToBackend = (formData) => {
  console.log('🔄 Converting form data to backend format:', formData);
  
  return {
    name: formData.name,
    category: formData.category,
    unit: formData.unit,
    current_stock: parseFloat(formData.current_stock) || 0,
    minimum_stock: parseFloat(formData.minimum_stock) || 0,
    cost_per_unit: parseFloat(formData.cost_per_unit) || 0,
    // CRITICAL: Handle supplier_id conversion
    supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
    notes: formData.notes || ''
  };
};

  const handleUpdateStock = async (itemId, adjustmentData) => {
  try {
    console.log('🔄 [START] handleUpdateStock');
    console.log('📦 Item ID:', itemId);
    console.log('📊 Adjustment data:', adjustmentData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      return { success: false, message: 'Authentication required' };
    }
    
    console.log('📡 Calling inventoryManagementAPI.updateStockLevel...');
    
    // The function signature is: updateStockLevel(id, stockData, token)
    // So we need to call it correctly
    const response = await inventoryManagementAPI.updateStockLevel(itemId, adjustmentData, authToken);
    
    console.log('✅ API Response:', response);
    
    // Refresh the inventory data
    if (fetchInventoryData) {
      await fetchInventoryData();
    }
    
    return { 
      success: true, 
      message: 'Stock updated successfully!' 
    };
    
  } catch (error) {
    console.error('❌ Error in handleUpdateStock:', error);
    
    // Check if it's the 404 HTML error
    if (error.message && error.message.includes('Unexpected token')) {
      console.error('🔥 API endpoint not found! Getting 404 HTML page.');
      
      // Check what endpoints DO exist
      console.log('🔍 Checking available inventory endpoints...');
      console.log('Known working: inventoryManagementAPI.getInventory()');
      console.log('Known working: inventoryManagementAPI.getLowStock()');
      
      // Since the PATCH endpoint doesn't exist, let's simulate the update locally
      console.log('🔄 Simulating stock update locally...');
      
      // Update local state
      const updatedInventory = inventoryData.map(item => {
        if (item.id == itemId) {
          const newStock = item.stockLevel + (adjustmentData.quantity || 0);
          return {
            ...item,
            stockLevel: newStock > 0 ? newStock : 0,
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      });
      
      setInventoryData(updatedInventory);
      
      // Update low stock items
      const newLowStock = updatedInventory.filter(item => 
        item.stockLevel <= item.minStock
      );
      setLowStockItems(newLowStock);
      
      // Update summary
      const totalValue = updatedInventory.reduce((sum, item) => 
        sum + (item.stockLevel * item.unitCost), 0);
      
      const lowStockValue = newLowStock.reduce((sum, item) => 
        sum + (item.stockLevel * item.unitCost), 0);
      
      setStockSummary(prev => ({
        ...prev,
        totalValue,
        lowStockValue,
        lowStockCount: newLowStock.length
      }));
      
      return { 
        success: true, 
        message: 'Stock updated locally (backend endpoint not configured)' 
      };
    }
    
    return { 
      success: false, 
      message: error.message || 'Failed to update stock' 
    };
  }
};

  const handleBulkUpdateStock = async (itemIds, adjustmentData) => {
    try {
      const authToken = AuthService.getToken();
      const response = await inventoryManagementAPI.bulkUpdateStock(authToken, itemIds, adjustmentData);
      
      if (response.success) {
        // Refresh the inventory list
        fetchInventoryData();
        return { success: true, message: 'Bulk stock update successful!' };
      }
      
      return { success: false, message: response.error || 'Failed to bulk update stock' };
      
    } catch (error) {
      console.error('Bulk update error:', error);
      return { success: false, message: error.message || 'Failed to bulk update stock' };
    }
  };

  const handleGenerateInventoryReport = async (reportType = 'full', format = 'pdf') => {
    try {
      const authToken = AuthService.getToken();
      const response = await inventoryManagementAPI.generateReport(authToken, reportType, format);
      
      if (response.success && response.data?.url) {
        // Download the report
        window.open(response.data.url, '_blank');
        return { success: true, message: 'Report generated!' };
      }
      
      return { success: false, message: 'Failed to generate report' };
      
    } catch (error) {
      console.error('Generate report error:', error);
      return { success: false, message: 'Failed to generate report' };
    }
  };

  // ========== SUPPLIERS HANDLERS ==========
  const handleAddSupplier = async (supplierData) => {
    console.log('➕ Adding supplier:', supplierData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      console.error('No authentication token');
      return;
    }
    
    try {
      console.log('🔄 Creating new supplier with data:', supplierData);
      
      // The formData already has the correct field names from SuppliersView modal
      const response = await suppliersAPI.createSupplier(supplierData, authToken);
      console.log('✅ Supplier created successfully:', response);
      
      // Refresh the suppliers list
      fetchSuppliersData();
      
    } catch (error) {
      console.error('❌ Error adding supplier:', error);
      // Let the SuppliersView handle the error display
      throw error;
    }
  };

  const handleEditSupplier = async (supplierId, supplierData) => {
    console.log('✏️ Editing supplier:', supplierId, supplierData);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      console.error('No authentication token');
      return;
    }
    
    try {
      console.log('🔄 Updating supplier:', supplierId, supplierData);
      
      const response = await suppliersAPI.updateSupplier(supplierId, supplierData, authToken);
      console.log('✅ Supplier updated successfully:', response);
      
      // Refresh the suppliers list
      fetchSuppliersData();
      
    } catch (error) {
      console.error('❌ Error updating supplier:', error);
      // Let the SuppliersView handle the error display
      throw error;
    }
  };

  const handleDeleteSupplier = async (supplierId, supplierName) => {
    console.log('🗑️ Deleting supplier:', supplierId, supplierName);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      console.error('No authentication token');
      return;
    }
    
    try {
      console.log('🔄 Deleting supplier:', supplierId);
      const response = await suppliersAPI.deleteSupplier(supplierId, authToken);
      console.log('✅ Supplier deleted successfully:', response);
      
      // Refresh the suppliers list
      fetchSuppliersData();
      
    } catch (error) {
      console.error('❌ Error deleting supplier:', error);
      // Let the SuppliersView handle the error display
      throw error;
    }
  };

  const handleViewSupplierDetails = (supplierId) => {
    console.log('👁️ Viewing supplier details:', supplierId);
    
    const supplier = suppliersData.find(s => s.id === supplierId);
    if (!supplier) {
      console.warn('Supplier not found');
      return;
    }
    
    // Just log for now - you can add a details modal later
    console.log('Supplier details:', supplier);
  };

  const handleGenerateSupplierReport = async () => {
    console.log('📄 Generating supplier report');
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      console.error('No authentication token');
      return;
    }
    
    try {
      const response = await suppliersAPI.getSupplierPerformance(authToken);
      console.log('✅ Supplier report generated:', response);
      
      // You could open a report modal or download here
      
    } catch (error) {
      console.error('❌ Error generating supplier report:', error);
      throw error;
    }
  };

  // ========== FINANCIAL HANDLERS ==========
  const handleFinancialRefresh = () => {
    console.log('🔄 Refreshing financial data');
    fetchFinancialData(financialPeriod, financialStartDate, financialEndDate);
  };

  const handleFinancialExport = () => {
    console.log('📤 Exporting financial report');
    // Implement export logic here
    alert('Financial report export feature coming soon!');
  };

  const handleFinancialDateRangeChange = (period, startDate, endDate) => {
    console.log('📅 Financial date range changed:', period, startDate, endDate);
    setFinancialPeriod(period);
    setFinancialStartDate(startDate);
    setFinancialEndDate(endDate);
    fetchFinancialData(period, startDate, endDate);
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
        fetchDashboardData(timeRange);
        break;
      case 'staff':
        fetchStaffPerformance({ period: timeRange });
        break;
      case 'inventory':
        fetchInventoryReport();
        break;
      case 'reports':
        fetchReportsData();
        // If financial reports, also refresh financial data
        if (activeSubsection === 'financial-reports' || 
            activeSubsection === 'profit-loss' ||
            activeSubsection === 'revenue-tracking') {
          fetchFinancialData(financialPeriod, financialStartDate, financialEndDate);
        }
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
      case 'stock':
        fetchInventoryData();
        break;
      case 'suppliers':
        fetchSuppliersData();
        break;
      case 'recipes':
        fetchRecipesCostingData();
        break;
      default:
        fetchDashboardData(timeRange);
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

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange) => {
    console.log('🕒 Time range changed to:', newTimeRange);
    setTimeRange(newTimeRange);
    
    if (activeView === 'dashboard') {
      fetchDashboardData(newTimeRange);
    }
  };

  const handleViewReceipt = async (order) => {
    console.log('📄 Viewing receipt for order:', order);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Call API to get receipt data or generate receipt
      const receiptData = await ordersAPI.getReceipt(order.id, authToken);
      
      if (receiptData.success) {
        // Open receipt in new window or modal
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
          receiptWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Receipt - ${order.orderNumber || order.id}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .info { margin: 10px 0; }
                .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .total { text-align: right; font-weight: bold; margin-top: 20px; }
                @media print { button { display: none; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Restaurant Receipt</h2>
                <p>Order: ${order.orderNumber || order.id}</p>
                <p>Date: ${new Date(order.orderTime || Date.now()).toLocaleString()}</p>
              </div>
              
              <div class="info">
                <p><strong>Table:</strong> ${order.tableNumber || 'N/A'}</p>
                <p><strong>Customer:</strong> ${order.customerName || 'Walk-in'}</p>
                <p><strong>Server:</strong> ${order.server_name || 'N/A'}</p>
              </div>
              
              <table class="items">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(order.items || []).map(item => `
                    <tr>
                      <td>${item.name || item.item_name || 'Item'}</td>
                      <td>${item.quantity || 1}</td>
                      <td>ETB ${(item.price || item.unit_price || 0).toFixed(2)}</td>
                      <td>ETB ${((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="total">
                <p>Subtotal: ETB ${(order.total || 0).toFixed(2)}</p>
                <p>VAT: ETB ${(order.vat_amount || 0).toFixed(2)}</p>
                <p><strong>Total: ETB ${(order.total_with_vat || order.total_amount || 0).toFixed(2)}</strong></p>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <p>Thank you for your business!</p>
                <button onclick="window.print()" style="padding: 10px 20px; margin: 10px;">
                  Print Receipt
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; margin: 10px;">
                  Close
                </button>
              </div>
            </body>
            </html>
          `);
          receiptWindow.document.close();
        }
      } else {
        throw new Error(receiptData.error || 'Failed to generate receipt');
      }
    } catch (err) {
      console.error('❌ Error viewing receipt:', err);
      alert(`Error viewing receipt: ${err.message}`);
    }
  };

  const handleDownloadReceipt = async (order) => {
    console.log('💾 Downloading receipt for order:', order);
    
    const authToken = AuthService.getToken();
    if (!authToken) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Call API to download receipt as PDF
      const response = await ordersAPI.downloadReceipt(order.id, authToken);
      
      if (response.success) {
        // Create a download link for the receipt
        const blob = response.data ? new Blob([response.data], { type: 'application/pdf' }) : null;
        
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${order.orderNumber || order.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          alert('Receipt downloaded successfully');
        }
      } else {
        throw new Error(response.error || 'Failed to download receipt');
      }
    } catch (err) {
      console.error('❌ Error downloading receipt:', err);
      
      // Fallback: Generate a simple text receipt for download
      const receiptText = generateTextReceipt(order);
      const blob = new Blob([receiptText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${order.orderNumber || order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // Helper function to generate text receipt
  const generateTextReceipt = (order) => {
    return `
Restaurant Receipt
===================
Order Number: ${order.orderNumber || order.id}
Date: ${new Date(order.orderTime || Date.now()).toLocaleString()}
Table: ${order.tableNumber || 'N/A'}
Customer: ${order.customerName || 'Walk-in'}
Server: ${order.server_name || 'N/A'}
Payment: ${order.payment_method || 'cash'} (${order.payment_status || 'pending'})

Items:
${(order.items || []).map(item => 
  `  ${item.quantity || 1}x ${item.name || item.item_name || 'Item'}: ETB ${((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}`
).join('\n')}

Subtotal: ETB ${(order.total || 0).toFixed(2)}
VAT: ETB ${(order.vat_amount || 0).toFixed(2)}
Total: ETB ${(order.total_with_vat || order.total_amount || 0).toFixed(2)}

Thank you for your business!
=============================
`;
  };

  // ========== RENDER VIEW ==========
  const renderView = () => {
    // Handle Operations subsection views
    if (activeView === 'operations') {
      switch (activeSubsection) {
        case 'tables-reservations':
          return (
            <>
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
                onAddTable={openCreateTableModal}
                onEditTable={openEditTableModal}
                onDeleteTable={handleDeleteTable}
              />
            </>
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
              onViewReceipt={handleViewReceipt}
              onDownloadReceipt={handleDownloadReceipt}
              totalOrders={ordersData.length}
              currentPage={1}
              totalPages={Math.ceil(ordersData.length / 20)}
              pageSize={20}
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
   if (activeView === 'financial') {
    // Map sidebar subsection to FinancialDashboard viewType
    let viewType = 'summary'; // default
    
    if (activeSubsection === 'profit-loss') {
      viewType = 'profit-loss';
    } else if (activeSubsection === 'vat-report') {
      viewType = 'vat';  // Map 'vat-report' to 'vat' view
    } else if (activeSubsection === 'financial-summary') {
      viewType = 'summary';  // Map 'financial-summary' to 'summary' view
    }
    
    console.log('💰 Rendering FinancialDashboard with:', {
      activeSubsection,
      viewType,
      hasFinancialData: !!financialData,
      hasProfitLossData: !!profitLossData,
      hasVatData: !!vatData
    });
    
    return (
      <FinancialDashboard
        financialData={financialData}
        vatData={vatData}
        profitLossData={profitLossData}
        isLoading={loadingData.financial}
        error={error.financial}
        onRefresh={() => fetchFinancialData(financialPeriod, financialStartDate, financialEndDate)}
        onExport={() => console.log('Export financial report')}
        onDateRangeChange={(period, startDate, endDate) => {
          setFinancialPeriod(period);
          setFinancialStartDate(startDate);
          setFinancialEndDate(endDate);
          fetchFinancialData(period, startDate, endDate);
        }}
        period={financialPeriod}
        startDate={financialStartDate}
        endDate={financialEndDate}
        viewType={viewType}
      />
    );
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
            popularItems={dashboardData?.popular_items || []}
            recentOrders={dashboardData?.recent_orders || []}
            timeRange={timeRange}
            setActiveView={setActiveView}
            setSelectedStaff={handleStaffSelect}
            setShowStaffDetails={setShowStaffDetails}
            onRefresh={() => fetchDashboardData(timeRange)}
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
            onRefresh={() => fetchStaffPerformance({ period: timeRange })}
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
        // For financial reports, show FinancialDashboard
        if (activeSubsection === 'financial-reports' || 
            activeSubsection === 'profit-loss' ||
            activeSubsection === 'revenue-tracking') {
          return (
            <FinancialDashboard
              financialData={financialData}
              profitLossData={profitLossData}
              vatData={vatData}
              isLoading={loadingData.financial}
              error={error.financial}
              onRefresh={handleFinancialRefresh}
              onExport={handleFinancialExport}
              onDateRangeChange={handleFinancialDateRangeChange}
              period={financialPeriod}
              startDate={financialStartDate}
              endDate={financialEndDate}
            />
          );
        }
        
        // For other reports, show ReportsView
        return (
          <ReportsView
            reportsData={reportsData}
            reportType={activeSubsection} // Pass the active subsection
            onGenerateReport={generateDailyReport}
            onGenerateCustomReport={async (reportType, params) => {
              const authToken = AuthService.getToken();
              switch (reportType) {
                case 'daily':
                  return await generateDailyReport(params.date);
                case 'financial':
                  return {
                    financialData,
                    profitLossData,
                    vatData
                  };
                case 'inventory':
                  return await reportAPI.getInventoryReport(authToken, params.detailed);
                case 'performance':
                  return await reportAPI.getStaffPerformanceReport(authToken, params);
                case 'business-intelligence':
                  return await reportAPI.getBusinessIntelligenceReport(authToken, params);
                default:
                  return await generateDailyReport();
              }
            }}
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
      
      case 'stock':
        return (
       <StockManagementView
  inventoryData={inventoryData}
  lowStockItems={lowStockItems}
  stockSummary={stockSummary}
   suppliers={suppliersData} 
  categories={categories}
  onRefresh={fetchInventoryData}
  onAddItem={handleAddInventoryItem}
  onEditItem={handleEditInventoryItem}
  onDeleteItem={handleDeleteInventoryItem}
  onUpdateStock={handleUpdateStock}
  onGenerateReport={handleGenerateInventoryReport}
  isLoading={loadingData.stock}
  error={error.stock}
  userRole={user.role}
/>
        );
      
      case 'suppliers':
        return (
          <SuppliersView
            suppliers={suppliersData}
            supplierPerformance={supplierPerformanceData}
            onRefresh={fetchSuppliersData}
            onAddSupplier={handleAddSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onViewDetails={handleViewSupplierDetails}
            onGenerateReport={handleGenerateSupplierReport}
            isLoading={loadingData.suppliers}
            error={error.suppliers}
            userRole={user.role}
          />
        );
      
      case 'recipes':
        return (
          <RecipesCostingView
            menuItems={recipesCostingData}
            costingAnalysis={costingAnalysis}
            profitabilityData={costingAnalysis?.profitability || {}}
            onRefresh={fetchRecipesCostingData}
            onEditRecipe={handleEditRecipe}
            onUpdateCosting={handleUpdateCosting}
            onGenerateReport={handleGenerateCostingReport}
            onCalculateOptimalPrices={handleCalculateOptimalPrices}
            isLoading={loadingData.recipes}
            error={error.recipes}
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
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
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
          setTimeRange={handleTimeRangeChange}
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
                 error.users || error.menu || error.tables || error.orders || error.kitchen ||
                 error.stock || error.suppliers || error.recipes || error.financial}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors"
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
                      kitchen: null,
                      stock: null,
                      suppliers: null,
                      recipes: null,
                      financial: null
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

      {/* Table Modal for Create/Edit */}
      <TableModal
        show={showTableModal}
        onClose={() => setShowTableModal(false)}
        mode={tableModalMode}
        tableData={selectedTable}
        onSubmit={tableModalMode === 'create' ? handleCreateTable : handleEditTable}
        userRole={user.role}
      />
    </div>
  );
}