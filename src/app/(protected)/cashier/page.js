'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  Users, ShoppingCart, Bell, DollarSign, BarChart3, Settings 
} from 'lucide-react';

// Import existing APIs
import { ordersAPI, tablesAPI, menuAPI, kitchenAPI } from '../../../lib/api';
// Import cashier-specific billing APIs
import { cashierBillingAPI } from '../../../lib/api';
import AuthService from '@/lib/auth-utils';

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
  const { logout, user } = useAuth();
  
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
  const [currentOrder, setCurrentOrder] = useState({ tableId: null, items: [], customerName: '', pagerNumber: null, orderType: 'dine-in' });
  const [paymentData, setPaymentData] = useState({ 
    payment_method: 'cash', 
    tip: 0, 
    discount: 0, 
    split_count: 1 
  });
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    orders: false,
    tables: false,
    menuItems: false,
    pagers: false
  });
  const [errorStates, setErrorStates] = useState({
    orders: null,
    tables: null,
    menuItems: null,
    pagers: null
  });
  
  // Counter for generating unique IDs
  const orderIdCounter = useRef(1000);
  
  const [categories, setCategories] = useState(['All']);
  
  // Fetch data functions using existing APIs
  const fetchTables = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    setLoadingStates(prev => ({ ...prev, tables: true }));
    setErrorStates(prev => ({ ...prev, tables: null }));
    
    try {
      const tablesData = await tablesAPI.getTables();
      setTables(tablesData);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setErrorStates(prev => ({ ...prev, tables: err.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, tables: false }));
    }
  };
  
  const fetchMenuItems = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    setLoadingStates(prev => ({ ...prev, menuItems: true }));
    setErrorStates(prev => ({ ...prev, menuItems: null }));
    
    try {
      // Fetch menu data
      const menuData = await menuAPI.getMenuItems();
      
      console.log('🔍 Raw menu data from API:', menuData);
      
      // TRANSFORM EXACTLY LIKE WAITER DOES
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
      
      console.log('✅ Transformed menu items:', transformedMenuItems);
      
      // Set transformed menu items
      setMenuItems(transformedMenuItems);
      
      // EXTRACT CATEGORIES EXACTLY LIKE WAITER DOES
      const uniqueCategories = {};
      menuData.forEach(item => {
        const categoryName = item.category_name || `Category ${item.category_id}`;
        if (!uniqueCategories[categoryName]) {
          uniqueCategories[categoryName] = categoryName;
        }
      });
      
      // Create categories array with 'All' first
      const allCategories = ['All', ...Object.values(uniqueCategories)];
      
      console.log('📋 Extracted categories:', allCategories);
      setCategories(allCategories);
      
    } catch (err) {
      console.error('❌ Error fetching menu items:', err);
      setErrorStates(prev => ({ ...prev, menuItems: err.message }));
      
      // Fallback to hardcoded if API fails
      setCategories(['All', 'Starters', 'Main Course', 'Drinks', 'Desserts']);
    } finally {
      setLoadingStates(prev => ({ ...prev, menuItems: false }));
    }
  };
  
  const fetchOrders = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    setLoadingStates(prev => ({ ...prev, orders: true }));
    setErrorStates(prev => ({ ...prev, orders: null }));
    
    try {
      // Fetch active orders using ordersAPI
      const ordersData = await ordersAPI.getAllOrders(token);
      
      console.log('🔍 Raw orders data from API:', ordersData);
      
      // Transform orders data for cashier display
      const transformedOrders = await Promise.all(
        ordersData.map(async (order) => {
          // Calculate order status from items if order.status doesn't exist
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
          
          // Transform items - FIXED VERSION
          let orderItems = [];
          let orderTotal = 0;
          
          if (order.items && Array.isArray(order.items) && order.items.length > 0) {
            orderItems = order.items.map(item => ({
              id: item.id || item.menu_item_id,
              name: item.item_name || item.name || 'Unknown Item',
              quantity: item.quantity || 1,
              price: parseFloat(item.price) || 0,
              specialInstructions: item.special_instructions || '',
              status: item.status || 'pending'
            }));
            
            orderTotal = orderItems.reduce((sum, item) => {
              return sum + (item.price * item.quantity);
            }, 0);
          } else if (order.id) {
            console.log(`⚠️ Order ${order.id} has no items in API response, trying to fetch separately...`);
            try {
              const orderDetails = await ordersAPI.getOrder(order.id, token);
              if (orderDetails.order && orderDetails.order.items) {
                const detailedItems = orderDetails.order.items;
                orderItems = detailedItems.map(item => ({
                  id: item.id || item.menu_item_id,
                  name: item.item_name || item.name || 'Unknown Item',
                  quantity: item.quantity || 1,
                  price: parseFloat(item.price) || 0,
                  specialInstructions: item.special_instructions || '',
                  status: item.status || 'pending'
                }));
              }
            } catch (err) {
              console.warn(`Could not fetch details for order ${order.id}:`, err);
            }
          }
          
          // Find table number
          let tableNumber = order.table_number || `T${order.table_id}`;
          if (tables.length > 0) {
            const table = tables.find(t => t.id === order.table_id);
            if (table) {
              tableNumber = `Table ${table.number}`;
            }
          }
          
          // Handle customer_name being "[object Object]"
          let customerName = order.customer_name || 'Walk-in Customer';
          if (customerName === '[object Object]') {
            console.warn(`Order ${order.id} has invalid customer_name: ${customerName}`);
            customerName = 'Walk-in Customer';
          }
          
          return {
            id: order.id,
            orderNumber: order.order_number || `ORD-${order.id}`,
            tableId: order.table_id,
            tableNumber: tableNumber,
            items: orderItems,
            status: order.status || orderStatus,
            total: parseFloat(order.total_amount) || orderTotal,
            orderTime: order.created_at || order.order_time || new Date().toISOString(),
            estimatedTime: order.estimated_ready_time || '15-20 min',
            customerName: customerName,
            customerCount: order.customer_count || 1,
            payment_status: order.payment_status || 'pending',
            payment_method: order.payment_method,
            pager_number: order.pager_number || null,
            notes: order.notes || '',
            rawOrder: order
          };
        })
      );
      
      console.log('✅ Transformed orders for cashier:', transformedOrders);
      console.log('✅ Sample order items check:', {
        orderId: transformedOrders[0]?.id,
        hasItems: transformedOrders[0]?.items?.length > 0,
        itemsCount: transformedOrders[0]?.items?.length || 0
      });
      
      setOrders(transformedOrders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setErrorStates(prev => ({ ...prev, orders: err.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, orders: false }));
    }
  };
  
  const fetchPagers = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    setLoadingStates(prev => ({ ...prev, pagers: true }));
    setErrorStates(prev => ({ ...prev, pagers: null }));
    
    try {
      const pagersData = await tablesAPI.getPagers(token);
      setPagers(pagersData || []);
    } catch (err) {
      console.error('Error fetching pagers:', err);
      setErrorStates(prev => ({ ...prev, pagers: err.message }));
      
      // Fallback to mock pagers if API fails
      const initialPagers = Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: 'available',
        orderId: null,
        assignedAt: null
      }));
      setPagers(initialPagers);
    } finally {
      setLoadingStates(prev => ({ ...prev, pagers: false }));
    }
  };
  
  // Fetch kitchen orders for cashier to monitor
  const fetchKitchenOrders = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    try {
      const kitchenOrders = await kitchenAPI.getKitchenOrders(token);
      console.log('Kitchen orders for monitoring:', kitchenOrders);
    } catch (err) {
      console.error('Error fetching kitchen orders:', err);
    }
  };
  
  // Fetch pending payments for billing view
  const fetchPendingPayments = async () => {
    const token = AuthService.getToken();
    if (!token) return;
    
    try {
      const pendingPayments = await cashierBillingAPI.getPendingPayments(token);
      return pendingPayments;
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      return [];
    }
  };
  
  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTables(),
          fetchMenuItems(),
          fetchOrders(),
          fetchPagers(),
          fetchKitchenOrders()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadData();
    
    // Set up refresh interval for orders (every 30 seconds)
    const intervalId = setInterval(() => {
      if (activeView === 'orders' || activeView === 'tables' || activeView === 'billing') {
        fetchOrders();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Re-fetch when view changes
  useEffect(() => {
    if (activeView === 'tables' && tables.length === 0) {
      fetchTables();
    }
    if (activeView === 'orders' && orders.length === 0) {
      fetchOrders();
    }
    if (activeView === 'billing' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeView]);
  
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

  const demoTimeoutRef = useRef(null);

  // Handle logout using auth context
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
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
    setCurrentOrder(prev => ({ ...prev, customerName: '', pagerNumber: null, tableId: null, orderType: 'dine-in' }));
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

  const placeOrder = async (customerName) => {
    console.log('🚀 === placeOrder STARTED (Cashier) ===');
    
    // Convert customerName to string SAFELY
    let safeCustomerName;
    if (typeof customerName === 'string') {
      safeCustomerName = customerName;
    } else if (customerName === null || customerName === undefined) {
      safeCustomerName = '';
    } else {
      try {
        safeCustomerName = String(customerName);
      } catch (e) {
        safeCustomerName = '';
      }
    }
    
    console.log('✅ Safe customer name:', safeCustomerName);
    
    // Validation
    if (cart.length === 0) {
      console.error('❌ Validation failed: Cart is empty');
      alert('Please add items to cart first');
      return;
    }
    
    if (!currentOrder.tableId && currentOrder.orderType !== 'takeaway') {
      console.error('❌ Validation failed: No table selected');
      alert('Please select a table first');
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
      
      const isTakeaway = currentOrder.tableId === 'takeaway' || currentOrder.orderType === 'takeaway';

      // Find table — for takeaway, look for a table named "Takeaway" or use tableId
      let selectedTable = null;
      if (isTakeaway) {
        selectedTable = tables.find(t =>
          t.name?.toLowerCase().includes('takeaway') ||
          t.number?.toString().toLowerCase().includes('takeaway')
        ) || { id: null, number: 'Takeaway', customers: 1 };
      } else {
        selectedTable = tables.find(table => table.id === currentOrder.tableId);
        if (!selectedTable) {
          console.error('❌ Table not found with ID:', currentOrder.tableId);
          alert('Table not found');
          return;
        }
      }
      
      // Determine final customer name
      let finalCustomerName;
      
      if (safeCustomerName && safeCustomerName.trim && typeof safeCustomerName.trim === 'function' && safeCustomerName.trim().length > 0) {
        finalCustomerName = safeCustomerName.trim();
        console.log('✅ Using safeCustomerName:', finalCustomerName);
      }
      else if (currentOrder.customerName && 
               typeof currentOrder.customerName === 'string' && 
               currentOrder.customerName.trim().length > 0) {
        finalCustomerName = currentOrder.customerName.trim();
        console.log('✅ Using currentOrder.customerName:', finalCustomerName);
      }
      else {
        finalCustomerName = `Table ${selectedTable.number}`;
        console.log('⚠️ Using default table name:', finalCustomerName);
      }
      
      // Prepare order data
      const orderData = {
        table_id: isTakeaway ? (selectedTable?.id || null) : currentOrder.tableId,
        customer_name: finalCustomerName,
        customer_count: selectedTable.customers || 1,
        order_type: currentOrder.orderType || 'dine-in',
        notes: currentOrder.notes || '',
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: item.specialInstructions || ''
        }))
      };
      
      console.log('📤 Sending order data...');
      const response = await ordersAPI.createOrder(orderData, authToken);
      
      if (response.success) {
        // Create new order object
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
          customerName: response.order.customer_name || finalCustomerName,
          customerCount: response.order.customer_count || selectedTable.customers || 1,
          rawOrder: response.order
        };
        
        // Update state
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        setCurrentOrder({
          tableId: null,
          customerName: '',
          pagerNumber: null,
          notes: '',
          orderType: 'dine-in'
        });
        
        // Refresh and show success
        await fetchTables();
        alert(`✅ Order ${response.order.order_number} for ${finalCustomerName} placed successfully!`);
        
      } else {
        throw new Error(response.error || 'Order creation failed');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`❌ Failed to place order: ${error.message}`);
    } finally {
      setIsLoading(false);
      console.log('🏁 === placeOrder COMPLETED ===');
    }
  };

  // PROCESS PAYMENT - Updated with correct data structure
  const processPayment = (order) => {
    console.log('💳 Process payment called for order:', order);
    
    setSelectedOrder(order);
    setPaymentData({
      payment_method: 'cash',
      tip: 0,
      discount: 0,
      split_count: 1
    });
    setShowPaymentModal(true);
  };

  const completePayment = async () => {
  if (!selectedOrder) {
    alert('No order selected for payment');
    return;
  }
  
  console.log('💳 Complete payment called for order:', selectedOrder.id);
  console.log('💰 Payment data:', paymentData);
  
  const token = AuthService.getToken();
  if (!token) {
    alert('Authentication required');
    return;
  }
  
  // Validate payment method is selected
  if (!paymentData.payment_method) {
    alert('Please select a payment method');
    return;
  }
  
  try {
    setIsLoading(true);
    
    // ─── VAT CALCULATION (prices are VAT-inclusive) ───────────────────────────
    // Back-calculate net and VAT — do NOT add VAT on top of an already-inclusive total
    const vatInclusiveTotal = parseFloat(selectedOrder.total || selectedOrder.total_amount || 0);
    const netAmount  = vatInclusiveTotal / 1.15;           // pre-VAT base
    const vatAmount  = vatInclusiveTotal - netAmount;      // = total × 0.15/1.15 ≈ 13.04%
    const tip        = parseFloat(paymentData.tip)      || 0;
    const discount   = parseFloat(paymentData.discount) || 0;
    const finalTotal = vatInclusiveTotal + tip - discount; // VAT already baked in
    // ─────────────────────────────────────────────────────────────────────────

    // Prepare payment payload for backend
    const paymentPayload = {
      payment_method: paymentData.payment_method,
      tip:         tip,
      discount:    discount,
      split_count: parseInt(paymentData.split_count) || 1,
      vat_amount:       vatAmount.toFixed(2),        // back-calculated VAT component
      total_with_vat:   vatInclusiveTotal.toFixed(2) // = total_amount (already inclusive)
    };
    
    console.log('📤 Sending payment payload:', paymentPayload);
    console.log('🧾 VAT Breakdown (inclusive):', {
      vatInclusiveTotal: vatInclusiveTotal.toFixed(2),
      netAmount:  netAmount.toFixed(2),
      vatAmount:  vatAmount.toFixed(2),
      tip,
      discount,
      finalTotal: finalTotal.toFixed(2)
    });
    
    // Process payment using cashierBillingAPI
    const paymentResult = await cashierBillingAPI.processPayment(
      selectedOrder.id, 
      paymentPayload, 
      token
    );
    
    console.log('✅ Payment result:', paymentResult);
    
    if (paymentResult.success) {
      // Update order payment status locally with VAT info
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id ? { 
          ...o, 
          payment_status: 'paid', 
          payment_method: paymentData.payment_method,
          status: 'completed',
          vat_amount: vatAmount,
          total_with_vat: vatInclusiveTotal,
          final_total: finalTotal,
          payment_data: paymentData 
        } : o
      ));
      
      // Close modal and reset
      setShowPaymentModal(false);
      setSelectedOrder(null);
      
      // Generate receipt using the HTML endpoint
      try {
        // Call the generateReceiptHTML endpoint
        const response = await fetch(
          `/api/billing/orders/${selectedOrder.id}/receipt/html`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'text/html' // Changed from Content-Type to Accept
            }
          }
        );
        
        if (response.ok) {
          // Get the HTML receipt
          const receiptHTML = await response.text();
          
          // Open receipt in new tab
          const receiptWindow = window.open('', '_blank');
          if (receiptWindow) {
            receiptWindow.document.write(receiptHTML);
            receiptWindow.document.close();
            
            // Auto-print after a short delay
            setTimeout(() => {
              receiptWindow.print();
            }, 500);
          }
        } else {
          // Fallback to simple receipt if HTML endpoint fails
          console.warn('HTML receipt endpoint failed, using fallback');
          generateFallbackReceipt(netAmount, vatAmount, vatInclusiveTotal, paymentPayload);
        }
      } catch (receiptError) {
        console.warn('Could not generate HTML receipt:', receiptError);
        generateFallbackReceipt(netAmount, vatAmount, vatInclusiveTotal, paymentPayload);
      }
      
      alert(`✅ Payment processed successfully! Order ${selectedOrder.orderNumber} is now paid.`);
      
      // Refresh orders to get updated data from backend
      await fetchOrders();
      
    } else {
      throw new Error(paymentResult.error || 'Failed to process payment');
    }
    
  } catch (err) {
    console.error('❌ Error completing payment:', err);
    alert(`❌ Failed to complete payment: ${err.message || 'Server error'}`);
  } finally {
    setIsLoading(false);
  }
};

// Fallback receipt — used only when the HTML receipt endpoint is unavailable.
// Matches the premium design from generateReceiptHTML in BillingController.
// Parameters: netAmount (pre-VAT), vatAmount (component), vatInclusiveTotal, paymentPayload
const generateFallbackReceipt = (netAmount, vatAmount, vatInclusiveTotal, paymentPayload) => {
  if (!selectedOrder) return;

  const receiptWindow = window.open('', '_blank');
  if (!receiptWindow) return;

  const tip        = parseFloat(paymentData.tip)      || 0;
  const discount   = parseFloat(paymentData.discount) || 0;
  const finalTotal = vatInclusiveTotal + tip - discount; // VAT already included

  const tableInfo = selectedOrder.table
    ? (selectedOrder.table.name || selectedOrder.table.number || selectedOrder.table)
    : selectedOrder.tableNumber || 'Takeaway';

  const now     = new Date();
  const fmtDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  receiptWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt · ${selectedOrder.orderNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #e8e4dc; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 32px 16px; font-family: 'IBM Plex Mono', monospace; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { width: 100%; max-width: 420px; }
    .receipt { background: #faf8f4; border: 1px solid #c8bfaf; box-shadow: 0 2px 0 #bdb3a3, 0 6px 24px rgba(0,0,0,0.12); position: relative; overflow: hidden; }
    .receipt::before, .receipt::after { content: ''; position: absolute; width: 18px; height: 18px; border-color: #c0b49e; border-style: solid; }
    .receipt::before { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
    .receipt::after  { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }
    .header { background: #1a1a1a; color: #faf8f4; text-align: center; padding: 28px 24px 22px; }
    .header-badge { font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: #888; margin-bottom: 10px; }
    .restaurant-name { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; letter-spacing: 1px; line-height: 1.1; color: #ffffff; }
    .restaurant-sub { font-size: 9.5px; letter-spacing: 3.5px; text-transform: uppercase; color: #8a8a8a; margin-top: 6px; }
    .header-divider { width: 40px; height: 1px; background: #444; margin: 14px auto; }
    .receipt-meta { display: flex; justify-content: space-between; font-size: 10px; color: #999; letter-spacing: 0.5px; }
    .receipt-number { color: #faf8f4; font-weight: 600; font-size: 11px; letter-spacing: 1px; }
    .tear { height: 12px; background: repeating-linear-gradient(90deg, #faf8f4 0px, #faf8f4 8px, #1a1a1a 8px, #1a1a1a 12px); opacity: 0.15; }
    .body { padding: 20px 24px; }
    .section-label { font-size: 8.5px; letter-spacing: 3px; text-transform: uppercase; color: #9a9080; font-weight: 600; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e0d9ce; }
    .info-grid { margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; align-items: baseline; padding: 5px 0; font-size: 11px; }
    .info-label { color: #9a9080; }
    .info-value { color: #1a1a1a; font-weight: 500; text-align: right; max-width: 60%; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    .items-table thead tr th { font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: #9a9080; font-weight: 600; padding: 0 0 8px; border-bottom: 1px dashed #c8bfaf; }
    .items-table thead tr th:last-child { text-align: right; }
    .items-table thead tr th:nth-child(2), .items-table thead tr th:nth-child(3) { text-align: center; }
    .items-table tbody tr td { padding: 9px 0; font-size: 11.5px; color: #1a1a1a; border-bottom: 1px dashed #e4ddd3; vertical-align: top; }
    .items-table tbody tr:last-child td { border-bottom: none; }
    .item-qty, .item-unit { text-align: center; color: #6a6055; }
    .item-total { text-align: right; font-weight: 600; white-space: nowrap; }
    .totals-block { background: #f0ece4; border: 1px solid #ddd6c8; border-radius: 2px; padding: 14px 16px; margin: 18px 0; }
    .total-row { display: flex; justify-content: space-between; font-size: 11px; padding: 4px 0; color: #4a4035; }
    .total-row.vat-row { color: #7a7065; font-size: 10.5px; font-style: italic; }
    .total-row.tip-row { color: #2a6a3a; }
    .total-row.disc-row { color: #8a2a1a; }
    .total-separator { border: none; border-top: 1px solid #c8bfaf; margin: 10px 0; }
    .total-row.grand { font-size: 14px; font-weight: 700; color: #1a1a1a; padding-top: 6px; }
    .payment-block { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border: 1px solid #c8bfaf; margin-bottom: 18px; }
    .payment-method-label { font-size: 8.5px; letter-spacing: 2.5px; text-transform: uppercase; color: #9a9080; }
    .payment-method-value { font-size: 13px; font-weight: 700; color: #1a1a1a; letter-spacing: 1px; margin-top: 2px; }
    .payment-status { font-size: 9px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase; background: #1a1a1a; color: #faf8f4; padding: 5px 10px; }
    .footer-divider { border: none; border-top: 1px dashed #c0b49e; margin: 4px 0 16px; }
    .footer { text-align: center; padding-bottom: 24px; }
    .footer-thanks { font-family: 'Playfair Display', serif; font-size: 14px; color: #3a3530; margin-bottom: 10px; }
    .footer-tin { font-size: 9px; letter-spacing: 1.5px; color: #a09080; line-height: 1.8; }
    .footer-tin span { color: #6a6055; font-weight: 600; }
    @media print { body { background: white; padding: 0; } .receipt { border: none; box-shadow: none; } .receipt::before, .receipt::after { display: none; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="receipt">
      <div class="header">
        <div class="header-badge">Official Tax Receipt</div>
        <div class="restaurant-name">KUKU CHICKEN</div>
        <div class="restaurant-sub">Dire Diwa · Addis Ababa</div>
        <div class="header-divider"></div>
        <div class="receipt-meta">
          <span class="receipt-number">#${selectedOrder.orderNumber}</span>
          <span>${fmtDate} &nbsp;·&nbsp; ${fmtTime}</span>
        </div>
      </div>
      <div class="tear"></div>
      <div class="body">
        <div class="info-grid">
          <div class="section-label">Order Details</div>
          <div class="info-row"><span class="info-label">Customer</span><span class="info-value">${selectedOrder.customerName || 'Walk-in'}</span></div>
          <div class="info-row"><span class="info-label">Table</span><span class="info-value">${tableInfo}</span></div>
          <div class="info-row"><span class="info-label">Served by</span><span class="info-value">${user?.username || 'System'}</span></div>
        </div>
        <div style="margin-bottom:20px">
          <div class="section-label">Items Ordered</div>
          <table class="items-table">
            <thead><tr><th style="text-align:left;width:45%">Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
            <tbody>
              ${selectedOrder.items && selectedOrder.items.length > 0
                ? selectedOrder.items.map(item => {
                    const unitPrice = parseFloat(item.price || 0);
                    const qty = item.quantity || 1;
                    return `<tr>
                      <td style="font-weight:500">${item.name || 'Item'}</td>
                      <td class="item-qty">${qty}</td>
                      <td class="item-unit">${unitPrice.toFixed(2)}</td>
                      <td class="item-total">${(unitPrice * qty).toFixed(2)} ETB</td>
                    </tr>`;
                  }).join('')
                : '<tr><td colspan="4" style="text-align:center;padding:12px 0;color:#9a9080">No items</td></tr>'
              }
            </tbody>
          </table>
        </div>
        <div class="totals-block">
          <div class="total-row"><span>Net Amount (excl. VAT)</span><span>${netAmount.toFixed(2)} ETB</span></div>
          <div class="total-row vat-row"><span>VAT @ 15% &nbsp;<em>(incl. in price)</em></span><span>${vatAmount.toFixed(2)} ETB</span></div>
          ${tip > 0 ? `<div class="total-row tip-row"><span>Tip / Service</span><span>+ ${tip.toFixed(2)} ETB</span></div>` : ''}
          ${discount > 0 ? `<div class="total-row disc-row"><span>Discount</span><span>− ${discount.toFixed(2)} ETB</span></div>` : ''}
          <hr class="total-separator">
          <div class="total-row grand"><span>TOTAL</span><span>${finalTotal.toFixed(2)} ETB</span></div>
        </div>
        <div class="payment-block">
          <div>
            <div class="payment-method-label">Payment Method</div>
            <div class="payment-method-value">${(paymentPayload.payment_method || 'CASH').toUpperCase()}</div>
          </div>
          <div style="text-align:right">
            <div class="payment-status">PAID</div>
          </div>
        </div>
        <hr class="footer-divider">
        <div class="footer">
          <div class="footer-thanks">Thank you for dining with us</div>
          <div class="footer-tin">VAT Registration No. &nbsp;<span>ETH-VAT-000000</span><br>TIN: <span>0000000</span> &nbsp;·&nbsp; VAT incl. at 15%<br>Kuku Chicken · Addis Ababa, Ethiopia</div>
        </div>
      </div>
    </div>
  </div>
  <script>setTimeout(() => { window.print(); }, 600);</script>
</body>
</html>`);
  receiptWindow.document.close();
};
  // MARK ORDER READY FOR SERVING (Cashier can buzz pager)
  const markOrderReady = async (orderId) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Update order status to ready using ordersAPI
      await ordersAPI.updateOrderStatus(orderId, 'ready', token);
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'ready' } : o
      ));
      
      // Buzz the pager if order has pager number
      const order = orders.find(o => o.id === orderId);
      if (order && order.pager_number) {
        console.log(`🛎️ Buzzing pager #${order.pager_number} for order ${order.order_number}`);
        await tablesAPI.buzzPager(order.pager_number, token);
        alert(`Pager #${order.pager_number} is now buzzing! Order ${order.order_number} is ready for pickup.`);
      }
      
    } catch (err) {
      console.error('Error marking order as ready:', err);
      alert(`Failed to mark order as ready: ${err.message}`);
    }
  };

  // MARK ORDER AS PREPARING
  const markOrderPreparing = async (orderId) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Update order status to preparing
      await ordersAPI.updateOrderStatus(orderId, 'preparing', token);
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'preparing' } : o
      ));
      
      alert(`Order marked as preparing!`);
      
    } catch (err) {
      console.error('Error marking order as preparing:', err);
      alert(`Failed to update order: ${err.message}`);
    }
  };

  // MARK ORDER AS SERVED (Cashier/waiter picks up ready order)
  const markOrderServed = async (orderId) => {
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Update order status to 'served' or 'completed' depending on your workflow
      await ordersAPI.updateOrderStatus(orderId, 'served', token);
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'served' } : o
      ));
      
      // Show success message
      const order = orders.find(o => o.id === orderId);
      if (order) {
        alert(`✅ Order ${order.orderNumber} marked as served!`);
      }
      
    } catch (err) {
      console.error('Error marking order as served:', err);
      alert(`Failed to mark order as served: ${err.message}`);
    }
  };

  // COMPLETE ORDER (For final closure - goes to billing)
  const completeOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // Update order status to completed
      await ordersAPI.updateOrderStatus(orderId, 'completed', token);
      
      // Return pager to available status
      if (order.pager_number) {
        await tablesAPI.releasePager(order.pager_number, token);
        setPagers(prev => prev.map(p => 
          p.number === order.pager_number 
            ? { ...p, status: 'available', orderId: null, assignedAt: null }
            : p
        ));
      }
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'completed' } : o
      ));
      
      alert(`✅ Order ${order.orderNumber} completed and ready for billing!`);
      
    } catch (err) {
      console.error('Error completing order:', err);
      alert(`Failed to complete order: ${err.message}`);
    }
  };

  // COMPLETE ORDER WITH PAYMENT (One-step process)
  const completeOrderWithPayment = async (orderId, paymentMethod = 'cash') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const token = AuthService.getToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    try {
      // First mark order as completed
      await ordersAPI.updateOrderStatus(orderId, 'completed', token);
      
      // Process payment with correct data structure
      const paymentPayload = {
        payment_method: paymentMethod,
        tip: 0,
        discount: 0,
        split_count: 1
      };
      
      const paymentResult = await cashierBillingAPI.processPayment(
        orderId,
        paymentPayload,
        token
      );
      
      if (paymentResult.success) {
        // Update local state
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { 
            ...o, 
            status: 'completed',
            payment_status: 'paid',
            payment_method: paymentMethod
          } : o
        ));
        
        // Return pager if exists
        if (order.pager_number) {
          await tablesAPI.releasePager(order.pager_number, token);
          setPagers(prev => prev.map(p => 
            p.number === order.pager_number 
              ? { ...p, status: 'available', orderId: null, assignedAt: null }
              : p
          ));
        }
        
        alert(`Order ${order.orderNumber} completed and paid successfully!`);
        
        // Generate receipt
        try {
          const receipt = await cashierBillingAPI.generateReceipt(orderId, token);
          if (receipt.success && receipt.receipt_url) {
            window.open(receipt.receipt_url, '_blank');
          }
        } catch (receiptErr) {
          console.warn('Could not generate receipt:', receiptErr);
        }
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
      
    } catch (err) {
      console.error('Error in complete order with payment:', err);
      alert(`Failed to complete order: ${err.message}`);
    }
  };

  // APPLY DISCOUNT TO ORDER
  const applyDiscountToOrder = async (orderId, discountPercentage) => {
    const token = AuthService.getToken();
    if (!token) return;
    
    try {
      const result = await cashierBillingAPI.applyDiscount(
        orderId,
        { discount_percentage: discountPercentage },
        token
      );
      
      if (result.success) {
        // Refresh orders to get updated total
        await fetchOrders();
        alert(`Discount of ${discountPercentage}% applied successfully!`);
      }
    } catch (err) {
      console.error('Error applying discount:', err);
      alert(`Failed to apply discount: ${err.message}`);
    }
  };

  // GET SALES SUMMARY FOR REPORTS
  const getSalesSummary = async () => {
    const token = AuthService.getToken();
    if (!token) return null;
    
    try {
      const summary = await cashierBillingAPI.getSalesSummary(token);
      return summary;
    } catch (err) {
      console.error('Error fetching sales summary:', err);
      return null;
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
    { id: 'billing', icon: DollarSign, label: 'Billing', view: 'billing', badge: orders.filter(o => o.status === 'ready' && o.payment_status !== 'paid').length },
    { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports', badge: 0 },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings', badge: 0 },
  ];

  // Calculate today's sales
  const calculateTodaySales = () => {
    const paidOrders = orders.filter(o => o.payment_status === 'paid');
    
    return {
      total: paidOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      transactions: paidOrders.length,
      average: paidOrders.length > 0 
        ? paidOrders.reduce((sum, order) => sum + (order.total || 0), 0) / paidOrders.length 
        : 0,
      cash: paidOrders.filter(o => o.payment_method === 'cash')
                .reduce((sum, order) => sum + (order.total || 0), 0),
      card: paidOrders.filter(o => o.payment_method === 'card')
                .reduce((sum, order) => sum + (order.total || 0), 0),
      mobile: paidOrders.filter(o => o.payment_method === 'mobile')
                  .reduce((sum, order) => sum + (order.total || 0), 0)
    };
  };

  const todaySales = calculateTodaySales();

  // Handle refresh for all views
  const handleRefresh = async () => {
    if (activeView === 'tables' || activeView === 'orders' || activeView === 'billing') {
      await fetchOrders();
      await fetchTables();
    }
    if (activeView === 'pagers') {
      await fetchPagers();
    }
    if (activeView === 'reports') {
      // Optional: Refresh report data
    }
  };

  // Display errors
  const hasErrors = Object.values(errorStates).some(error => error !== null);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <SidebarOverlay sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        menuItemsList={menuItemsList}
        isLoading={isLoading || Object.values(loadingStates).some(state => state)}
        handleLogout={handleLogout}
        onRefresh={handleRefresh}
        user={user}
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

        {/* Error Messages */}
        {hasErrors && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-red-700">
                {Object.values(errorStates).filter(error => error).join(', ')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                >
                  Retry
                </button>
                <button
                  onClick={() => setErrorStates({ orders: null, tables: null, menuItems: null, pagers: null })}
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
              isLoading={loadingStates.menuItems || loadingStates.tables}
              error={errorStates.menuItems || errorStates.tables}
            />
          )}

          {activeView === 'orders' && (
            <KitchenOrdersView
              orders={orders}
              markOrderPreparing={markOrderPreparing}
              markOrderReady={markOrderReady}
              completeOrder={completeOrder}
              completeOrderWithPayment={completeOrderWithPayment}
              isLoading={loadingStates.orders}
              error={errorStates.orders}
              onRefresh={fetchOrders}
              menuItems={menuItems}
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
              isLoading={loadingStates.pagers}
              error={errorStates.pagers}
              onRefresh={fetchPagers}
            />
          )}

          {activeView === 'billing' && (
            <BillingView
              orders={orders}
              setSelectedOrder={setSelectedOrder}
              processPayment={processPayment}
              completeOrderWithPayment={completeOrderWithPayment}
              applyDiscountToOrder={applyDiscountToOrder}
              getPendingPayments={fetchPendingPayments}
              isLoading={loadingStates.orders}
              error={errorStates.orders}
              onRefresh={fetchOrders}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              todaySales={todaySales}
              pagers={pagers}
              orders={orders}
              getSalesSummary={getSalesSummary}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              resetDemo={resetDemo}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
              user={user}
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