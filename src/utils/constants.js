import { 
  Home, Users, ShoppingCart, Utensils, Package, 
  Settings, BarChart3 
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'overview', icon: Home, label: 'Overview', view: 'overview' },
  { id: 'users', icon: Users, label: 'Staff', view: 'users' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders', view: 'orders' },
  { id: 'tables', icon: Utensils, label: 'Tables', view: 'tables' },
  { id: 'inventory', icon: Package, label: 'Inventory', view: 'inventory' },
  { id: 'reports', icon: BarChart3, label: 'Reports', view: 'reports' },
  { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
];

export const VIEW_TITLES = {
  overview: 'Dashboard Overview',
  users: 'Staff Management',
  orders: 'Order Management',
  tables: 'Table Management',
  inventory: 'Inventory Management',
  reports: 'Reports & Analytics',
  settings: 'System Settings'
};