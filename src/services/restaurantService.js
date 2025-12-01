// services/restaurantService.js

const STORAGE_KEYS = {
  ORDERS: 'restaurant_orders_v3',
  TABLES: 'restaurant_tables',
  MENU_ITEMS: 'restaurant_menu_items',
  STATIONS: 'restaurant_stations',
  KITCHEN_QUEUE: 'kitchen_queue'
};

// Default stations mapping for menu items
const STATION_MAPPING = {
  'Starters': 'salad',
  'Main Course': 'grill',
  'Drinks': 'drinks',
  'Desserts': 'cold'
};

class RestaurantService {
  constructor() {
    this.initializeDefaultData();
    this.setupEventListeners();
  }

  // Initialize with default data from your data.js
  initializeDefaultData() {
    // Import your data
    const { menuItems, tables, stations, sampleOrders } = require('../app/lib/data');
    
    // Initialize menu items
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
    }

    // Initialize tables
    if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    }

    // Initialize stations
    if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
    }

    // Initialize orders with sample orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      const initialOrders = sampleOrders.map(order => ({
        ...order,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: order.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        waiterId: 'waiter-1',
        waiterName: 'John Doe',
        items: order.items.map(item => ({
          ...item,
          status: 'pending',
          startedAt: null,
          completedAt: null
        }))
      }));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
  }

  // Event system for real-time updates
  eventListeners = {};

  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  setupEventListeners() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.ORDERS) {
        this.emit('ordersUpdated', this.getOrders());
      }
    });
  }

  // GETTERS
  getMenuItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]');
  }

  getTables() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || '[]');
  }

  getStations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]');
  }

  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  getActiveOrders() {
    const orders = this.getOrders();
    return orders.filter(order => order.status !== 'completed');
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId);
  }

  // ORDER MANAGEMENT
  createOrder(orderData) {
    const orders = this.getOrders();
    const menuItems = this.getMenuItems();
    
    const newOrder = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD-${String(orders.length + 1001).padStart(4, '0')}`,
      table: orderData.tableNumber,
      tableNumber: orderData.tableNumber,
      tableId: orderData.tableId,
      customer: orderData.customerName || 'Guest',
      status: 'pending',
      priority: 'normal',
      timestamp: new Date().toISOString(),
      items: orderData.items.map(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        return {
          ...item,
          station: STATION_MAPPING[menuItem?.category] || 'grill',
          status: 'pending',
          startedAt: null,
          completedAt: null,
          notes: item.specialInstructions || ''
        };
      }),
      total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      waiterId: 'waiter-1',
      waiterName: 'John Doe',
      estimatedTime: this.calculateEstimatedTime(orderData.items)
    };

    orders.push(newOrder);
    this.saveOrders(orders);
    
    // Update table status
    this.updateTableStatus(orderData.tableId, 'occupied');
    
    return newOrder;
  }

  saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit('ordersUpdated', orders);
  }

  // Update order status (waiter marking as served/completed)
  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      // If order is completed, update table status
      if (status === 'completed') {
        this.updateTableStatus(orders[orderIndex].tableId, 'available');
        
        // Mark all items as served
        orders[orderIndex].items.forEach(item => {
          item.status = 'served';
        });
      }
      
      this.saveOrders(orders);
    }
  }

  // Chef updates item status (preparing → ready)
  updateItemStatus(orderId, itemIndex, status) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1 && orders[orderIndex].items[itemIndex]) {
      orders[orderIndex].items[itemIndex].status = status;
      
      // Update timestamps
      if (status === 'preparing') {
        orders[orderIndex].items[itemIndex].startedAt = new Date().toISOString();
      } else if (status === 'ready') {
        orders[orderIndex].items[itemIndex].completedAt = new Date().toISOString();
      }
      
      // Check if all items are ready
      const allItemsReady = orders[orderIndex].items.every(item => 
        item.status === 'ready' || item.status === 'served'
      );
      
      if (allItemsReady && orders[orderIndex].status !== 'ready') {
        orders[orderIndex].status = 'ready';
      }
      
      this.saveOrders(orders);
    }
  }

  // Update table status
  updateTableStatus(tableId, status) {
    const tables = this.getTables();
    const tableIndex = tables.findIndex(t => t.id === tableId);
    
    if (tableIndex > -1) {
      tables[tableIndex].status = status;
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      this.emit('tablesUpdated', tables);
    }
  }

  // Helper functions
  calculateEstimatedTime(items) {
    // Simple estimation: base time + per item time
    const baseTime = 5;
    const perItemTime = 8;
    return baseTime + (items.length * perItemTime);
  }

  // Get orders for specific table
  getTableOrders(tableId) {
    const orders = this.getOrders();
    return orders.filter(order => 
      order.tableId === tableId && order.status !== 'completed'
    );
  }

  // Get orders by station (for chef view)
  getOrdersByStation(stationId) {
    const orders = this.getActiveOrders();
    return orders.filter(order => 
      order.items.some(item => item.station === stationId && item.status !== 'served')
    );
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.MENU_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.STATIONS);
    this.initializeDefaultData();
    this.emit('ordersUpdated', []);
    this.emit('tablesUpdated', this.getTables());
  }

  // Add sample order for testing
  addSampleOrder() {
    const sampleOrder = {
      tableId: 1,
      tableNumber: 'T01',
      customerName: 'Sample Customer',
      items: [
        { id: '1', name: 'Caesar Salad', price: 80, quantity: 1 },
        { id: '9', name: 'Beef Burger', price: 95, quantity: 2 }
      ]
    };
    
    return this.createOrder(sampleOrder);
  }
}

// Export singleton instance
const restaurantService = new RestaurantService();
export default restaurantService;