'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

// Import components
import ChefSidebar from '../../components/chef/Sidebar';
import ChefHeader from '../../components/chef/Header';
import DashboardView from '../../components/chef/DashboardView';
import OrdersView from '../../components/chef/OrderView';
import StationsView from '../../components/chef/StationsView';
import InventoryView from '../../components/chef/InventoryView';
import IngredientsView from '../../components/chef/IngredientsView';
import ReportsView from '../../components/chef/ReportsView';
import SettingsView from '../../components/chef/SettingsView';
import OrderDetailModal from '../../components/chef/OrderDetailModal';
import MobileOverlay from '../../components/chef/MobileOverlay';

// Import data
import { menuItems, mockInventory, mockOrders, stations } from '../lib/data';
import '../lib/i18n';

export default function ChefDashboard() {
  const { t } = useTranslation('chef');
  const router = useRouter();
  
  // State declarations
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    setOrders(mockOrders);
    setInventory(mockInventory);
    calculateKitchenStats(mockOrders);
  }, []);

  // Ingredient tracking functions
  const checkIngredientAvailability = (orderItems) => {
    const requiredIngredients = {};
    
    orderItems.forEach(item => {
      if (item.ingredients) {
        item.ingredients.forEach(ing => {
          const key = ing.id;
          if (!requiredIngredients[key]) {
            requiredIngredients[key] = { ...ing, totalQuantity: 0 };
          }
          requiredIngredients[key].totalQuantity += ing.quantity * item.quantity;
        });
      }
    });

    const shortages = [];
    Object.values(requiredIngredients).forEach(ing => {
      const inventoryItem = inventory.find(i => i.id === ing.id);
      if (inventoryItem && inventoryItem.currentStock < ing.totalQuantity) {
        shortages.push({
          ingredient: inventoryItem.name,
          required: ing.totalQuantity,
          available: inventoryItem.currentStock,
          unit: ing.unit
        });
      }
    });

    return shortages;
  };

  const consumeIngredients = (orderItems) => {
    const updatedInventory = [...inventory];
    
    orderItems.forEach(item => {
      if (item.ingredients) {
        item.ingredients.forEach(ing => {
          const inventoryIndex = updatedInventory.findIndex(i => i.id === ing.id);
          if (inventoryIndex !== -1) {
            updatedInventory[inventoryIndex].currentStock -= ing.quantity * item.quantity;
            updatedInventory[inventoryIndex].currentStock = Math.max(0, updatedInventory[inventoryIndex].currentStock);
            updatedInventory[inventoryIndex].lastUpdated = new Date().toISOString().split('T')[0];
          }
        });
      }
    });

    setInventory(updatedInventory);
  };

  const calculateKitchenStats = (orderList) => {
    const active = orderList.filter(o => o.status !== 'completed').length;
    const completed = orderList.filter(o => o.status === 'completed').length;
    const delayed = orderList.filter(o => {
      if (o.status === 'pending') {
        const waitTime = (new Date() - new Date(o.orderTime)) / 60000;
        return waitTime > 10;
      }
      return false;
    }).length;
    
    const activeOrders = orderList.filter(o => o.startedTime && o.status === 'preparing');
    const avgPrepTime = activeOrders.length > 0 
      ? Math.round(activeOrders.reduce((sum, order) => {
          const prepTime = (new Date() - new Date(order.startedTime)) / 60000;
          return sum + prepTime;
        }, 0) / activeOrders.length)
      : 0;

    setKitchenStats({ active, completed, delayed, avgPrepTime });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updates = { status: newStatus };
        if (newStatus === 'preparing') {
          const shortages = checkIngredientAvailability(order.items);
          if (shortages.length > 0) {
            return order;
          }
          consumeIngredients(order.items);
          updates.startedTime = new Date().toISOString();
        }
        if (newStatus === 'ready') {
          updates.readyTime = new Date().toISOString();
        }
        if (newStatus === 'completed') updates.completedTime = new Date().toISOString();
        return { ...order, ...updates };
      }
      return order;
    }));
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item
    ));
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.minStock);
  };

  const getTotalStockValue = () => {
    return inventory.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const user = {
    name: 'Chef Manager',
    email: 'chef@bistroelegante.com',
    role: 'Head Chef'
  };

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
        user={user}
        isLoading={isLoading}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <ChefHeader
          activeView={activeView}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8">
          {activeView === 'dashboard' && (
            <DashboardView
              kitchenStats={kitchenStats}
              stations={stations}
              orders={orders}
              setStationFilter={setStationFilter}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'orders' && (
            <OrdersView
              orders={orders}
              filter={filter}
              setFilter={setFilter}
              stationFilter={stationFilter}
              setStationFilter={setStationFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stations={stations}
              updateOrderStatus={updateOrderStatus}
              setSelectedOrder={setSelectedOrder}
              checkIngredientAvailability={checkIngredientAvailability}
            />
          )}

          {activeView === 'stations' && (
            <StationsView
              stations={stations}
              orders={orders}
              setStationFilter={setStationFilter}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView
              inventory={inventory}
              getLowStockItems={getLowStockItems}
              getTotalStockValue={getTotalStockValue}
            />
          )}

          {activeView === 'ingredients' && (
            <IngredientsView
              inventory={inventory}
              updateInventoryItem={updateInventoryItem}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </div>
  );
}