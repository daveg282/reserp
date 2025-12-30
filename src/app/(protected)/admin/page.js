'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/admin/Sidebar';
import TopBar from '../../../components/admin/TopBar';
import OverviewView from '../../../components/admin/OverviewView';
import StaffView from '../../../components/admin/StaffView';
import OrdersView from '../../../components/admin/OrdersView';
import TablesView from '../../../components/admin/TablesView';
import InventoryView from '../../../components/admin/InventoryView';
import ReportsView from '../../../components/admin/ReportsView';
import SettingsView from '../../../components/admin/SettingsView';
import UserModal from '../../../components/admin/UserModal';
import ItemModal from '../../../components/admin/ItemModal';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { mockUsers, mockOrders, mockTables, mockInventory } from '../../../lib/data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // State
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeRange, setTimeRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalConfig, setModalConfig] = useState({});

  // Initialize only on client
  useEffect(() => {
    setIsClient(true);
    setUsers(mockUsers);
    setOrders(mockOrders);
    setTables(mockTables);
    setInventory(mockInventory);
  }, []);

  // Add notification
  const addNotification = (message, type = 'info') => {
    const notification = { 
      id: Date.now(), 
      message, 
      type, 
      time: new Date().toISOString() 
    };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  };

  // Filter data
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.waiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User management
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
      addNotification(`User ${userData.name} updated`, 'success');
    } else {
      const newUser = {
        ...userData,
        id: Date.now(),
        lastLogin: new Date().toISOString(),
        status: 'active'
      };
      setUsers(prev => [newUser, ...prev]);
      addNotification(`User ${userData.name} added`, 'success');
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    setModalConfig({
      type: 'danger',
      title: 'Delete Staff',
      message: `Delete ${userToDelete?.name}? This cannot be undone.`,
      onConfirm: () => {
        setUsers(prev => prev.filter(user => user.id !== userId));
        addNotification(`User ${userToDelete?.name} deleted`);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Order management
  const handleCompleteOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
    addNotification(`Order ${orderId} completed`);
  };

  // Inventory management
  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = (itemData) => {
    if (selectedItem) {
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...item, ...itemData } : item
      ));
      addNotification(`Item ${itemData.name} updated`, 'success');
    } else {
      const newItem = {
        ...itemData,
        id: Date.now(),
        lowStock: itemData.currentStock <= itemData.minStock
      };
      setInventory(prev => [newItem, ...prev]);
      addNotification(`Item ${itemData.name} added`, 'success');
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (itemId) => {
    const itemToDelete = inventory.find(i => i.id === itemId);
    
    setModalConfig({
      type: 'danger',
      title: 'Delete Item',
      message: `Delete ${itemToDelete?.name} from inventory?`,
      onConfirm: () => {
        setInventory(prev => prev.filter(item => item.id !== itemId));
        addNotification(`Item ${itemToDelete?.name} deleted`);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Export
  const handleExportReport = (type) => {
    addNotification(`${type} report exported`);
  };

  // Logout
  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  // Sales data - static for hydration
  const salesData = {
    today: [450, 520, 480, 610, 730, 810, 920, 880, 950, 1020, 980, 890],
    week: [12560, 13250, 11890, 14520, 15230, 16890, 17560],
    month: [45230, 48950, 52360, 48750, 51230, 49870, 46520, 48960, 52310, 55680, 58740, 61250],
    year: [125600, 134500, 128900, 142300, 156800, 165200, 158900, 172300, 185600, 192300, 201500, 215800]
  };

  // Mock reports
  const mockReports = {
    sales: {
      total: 12580.75,
      today: 2519.75,
      weekly: 45890.25,
      monthly: 187650.50
    },
    orders: {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: 0
    },
    customers: {
      total: 1289,
      newThisMonth: 156,
      returning: 845
    },
    inventory: {
      totalItems: inventory.length,
      lowStock: inventory.filter(i => i.lowStock).length,
      outOfStock: inventory.filter(i => i.currentStock === 0).length
    }
  };

  // Render active view
  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <OverviewView 
            users={users}
            orders={orders}
            tables={tables}
            inventory={inventory}
            notifications={notifications}
            timeRange={timeRange}
            salesData={salesData}
            mockReports={mockReports}
          />
        );
        
      case 'users':
        return (
          <StaffView 
            users={filteredUsers}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onExport={() => handleExportReport('Staff')}
          />
        );
        
      case 'orders':
        return (
          <OrdersView 
            orders={filteredOrders}
            onCompleteOrder={handleCompleteOrder}
            onExport={() => handleExportReport('Orders')}
          />
        );
        
      case 'tables':
        return <TablesView tables={tables} />;
        
      case 'inventory':
        return (
          <InventoryView 
            inventory={filteredInventory}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onExport={() => handleExportReport('Inventory')}
          />
        );
        
      case 'reports':
        return (
          <ReportsView 
            mockReports={mockReports}
            onExportReport={handleExportReport}
          />
        );
        
      case 'settings':
        return <SettingsView />;
        
      default:
        return <OverviewView users={users} orders={orders} tables={tables} inventory={inventory} />;
    }
  };

  // Show loading until client-side
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          users={users}
          orders={orders}
          tables={tables}
          inventory={inventory}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Bar */}
          <TopBar 
            activeView={activeView}
            setSidebarOpen={setSidebarOpen}
            notifications={notifications}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-3 lg:p-6 xl:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      
      <ItemModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        item={selectedItem}
        onSave={handleSaveItem}
      />
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
}