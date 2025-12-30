export const menuItems = [
  // Starters
  {
    id: '1',
    name: 'Caesar Salad',
    category: 'Starters',
    price: 80,
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing',
    ingredients: [
      { name: 'Lettuce', quantity: 1 },
      { name: 'Croutons', quantity: 1 },
      { name: 'Parmesan', quantity: 1 },
      { name: 'Dressing', quantity: 1 },
    ],
    available: true,
    image: '🥗',
    popular: true
  },
  {
    id: '2',
    name: 'Garlic Bread',
    category: 'Starters',
    price: 45,
    description: 'Toasted bread with garlic butter and herbs',
    ingredients: [
      { name: 'Bread', quantity: 1 },
      { name: 'Garlic', quantity: 1 },
      { name: 'Butter', quantity: 1 },
    ],
    available: true,
    image: '🍞',
    popular: false
  },
  {
    id: '3',
    name: 'Bruschetta',
    category: 'Starters',
    price: 65,
    description: 'Toasted bread topped with fresh tomatoes, basil, and olive oil',
    ingredients: [
      { name: 'Bread', quantity: 1 },
      { name: 'Tomatoes', quantity: 1 },
      { name: 'Basil', quantity: 1 },
    ],
    available: true,
    image: '🍅',
    popular: true
  },
  {
    id: '4',
    name: 'Chicken Wings',
    category: 'Starters',
    price: 95,
    description: 'Crispy chicken wings with your choice of sauce',
    ingredients: [
      { name: 'Chicken', quantity: 1 },
      { name: 'Sauce', quantity: 1 },
    ],
    available: false,
    image: '🍗',
    popular: true
  },

  // Main Courses
  {
    id: '5',
    name: 'Spaghetti Carbonara',
    category: 'Main Course',
    price: 120,
    description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
    ingredients: [
      { name: 'Pasta', quantity: 1 },
      { name: 'Bacon', quantity: 2 },
      { name: 'Eggs', quantity: 2 },
      { name: 'Parmesan', quantity: 1 },
    ],
    available: true,
    image: '🍝',
    popular: true
  },
  {
    id: '6',
    name: 'Grilled Salmon',
    category: 'Main Course',
    price: 150,
    description: 'Fresh salmon fillet grilled to perfection with lemon butter sauce',
    ingredients: [
      { name: 'Salmon', quantity: 1 },
      { name: 'Lemon', quantity: 1 },
      { name: 'Herbs', quantity: 1 },
    ],
    available: true,
    image: '🐟',
    popular: true
  },
  {
    id: '7',
    name: 'Chicken Alfredo',
    category: 'Main Course',
    price: 130,
    description: 'Creamy Alfredo pasta with grilled chicken breast',
    ingredients: [
      { name: 'Chicken', quantity: 1 },
      { name: 'Pasta', quantity: 1 },
      { name: 'Cream', quantity: 1 },
    ],
    available: true,
    image: '🍗',
    popular: false
  },
  {
    id: '8',
    name: 'Vegetable Lasagna',
    category: 'Main Course',
    price: 110,
    description: 'Layers of pasta with fresh vegetables and cheese',
    ingredients: [
      { name: 'Pasta', quantity: 1 },
      { name: 'Vegetables', quantity: 2 },
      { name: 'Cheese', quantity: 1 },
    ],
    available: true,
    image: '🍝',
    popular: false
  },
  {
    id: '9',
    name: 'Beef Burger',
    category: 'Main Course',
    price: 95,
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    ingredients: [
      { name: 'Beef', quantity: 1 },
      { name: 'Bread', quantity: 1 },
      { name: 'Vegetables', quantity: 1 },
    ],
    available: true,
    image: '🍔',
    popular: true
  },
  {
    id: '10',
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 100,
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    ingredients: [
      { name: 'Dough', quantity: 1 },
      { name: 'Cheese', quantity: 1 },
      { name: 'Tomato', quantity: 1 },
    ],
    available: true,
    image: '🍕',
    popular: true
  },

  // Drinks
  {
    id: '11',
    name: 'Fresh Orange Juice',
    category: 'Drinks',
    price: 35,
    description: 'Freshly squeezed orange juice',
    ingredients: [
      { name: 'Oranges', quantity: 3 },
    ],
    available: true,
    image: '🍊',
    popular: true
  },
  {
    id: '12',
    name: 'Iced Coffee',
    category: 'Drinks',
    price: 45,
    description: 'Chilled coffee with milk and ice',
    ingredients: [
      { name: 'Coffee', quantity: 1 },
      { name: 'Milk', quantity: 1 },
      { name: 'Ice', quantity: 1 },
    ],
    available: true,
    image: '☕',
    popular: false
  },
  {
    id: '13',
    name: 'Mineral Water',
    category: 'Drinks',
    price: 20,
    description: 'Bottled mineral water',
    ingredients: [
      { name: 'Water', quantity: 1 },
    ],
    available: true,
    image: '💧',
    popular: false
  },
  {
    id: '14',
    name: 'Mango Smoothie',
    category: 'Drinks',
    price: 55,
    description: 'Refreshing mango smoothie with yogurt',
    ingredients: [
      { name: 'Mango', quantity: 2 },
      { name: 'Yogurt', quantity: 1 },
    ],
    available: true,
    image: '🥭',
    popular: true
  },

  // Desserts
  {
    id: '15',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 60,
    description: 'Rich chocolate cake with chocolate frosting',
    ingredients: [
      { name: 'Flour', quantity: 1 },
      { name: 'Chocolate', quantity: 1 },
      { name: 'Eggs', quantity: 2 },
    ],
    available: true,
    image: '🍫',
    popular: true
  },
  {
    id: '16',
    name: 'Tiramisu',
    category: 'Desserts',
    price: 75,
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    ingredients: [
      { name: 'Coffee', quantity: 1 },
      { name: 'Cream', quantity: 1 },
      { name: 'Biscuits', quantity: 1 },
    ],
    available: true,
    image: '🍰',
    popular: true
  },
  {
    id: '17',
    name: 'Ice Cream Sundae',
    category: 'Desserts',
    price: 50,
    description: 'Vanilla ice cream with chocolate sauce and nuts',
    ingredients: [
      { name: 'Ice Cream', quantity: 1 },
      { name: 'Chocolate', quantity: 1 },
    ],
    available: true,
    image: '🍦',
    popular: false
  }
];

export const users = [
  { 
    id: '1', 
    username: 'admin', 
    role: 'admin', 
    name: 'System Administrator', 
    password: 'admin123',
    email: 'admin@inernett.com',
    permissions: ['all']
  },
  { 
    id: '2', 
    username: 'manager', 
    role: 'manager', 
    name: 'Restaurant Manager', 
    password: 'manager123',
    email: 'manager@restaurant.com',
    permissions: ['reports', 'staff', 'inventory', 'menu']
  },
  { 
    id: '3', 
    username: 'cashier1', 
    role: 'cashier', 
    name: 'Cashier One', 
    password: 'cashier123',
    email: 'cashier@restaurant.com',
    permissions: ['pos', 'orders', 'payments']
  },
  { 
    id: '4', 
    username: 'waiter1', 
    role: 'waiter', 
    name: 'Waiter One', 
    password: 'waiter123',
    email: 'waiter@restaurant.com',
    permissions: ['orders', 'tables']
  },
  { 
    id: '5', 
    username: 'chef1', 
    role: 'chef', 
    name: 'Head Chef', 
    password: 'chef123',
    email: 'chef@restaurant.com',
    permissions: ['kitchen', 'orders']
  },
];

// lib/data.js
export const sampleOrders = [
  {
    id: 'ORD-1001',
    table: 'T-02',
    customer: 'Family (4 pax)',
    status: 'preparing',
    priority: 'high',
    timestamp: new Date(Date.now() - 8 * 60000),
    specialInstructions: 'Extra spicy, no boiled eggs',
    items: [
      {
        name: 'Doro Wot',
        quantity: 2,
        station: 'stew',
        prepTime: 25,
        status: 'preparing',
        notes: 'Extra spicy'
      },
      {
        name: 'Injera',
        quantity: 4,
        station: 'bread',
        prepTime: 2,
        status: 'ready',
        notes: ''
      }
    ]
  },
  {
    id: 'ORD-1002',
    table: 'T-05',
    customer: 'Couple',
    status: 'pending',
    priority: 'normal',
    timestamp: new Date(Date.now() - 3 * 60000),
    specialInstructions: '',
    items: [
      {
        name: 'Tibs',
        quantity: 2,
        station: 'grill',
        prepTime: 12,
        status: 'pending',
        notes: 'Well done'
      }
    ]
  }
  
];

export const tables = [
  { id: 1, number: 'T01', status: 'occupied', customers: 2, section: 'Main' },
  { id: 2, number: 'T02', status: 'available', customers: 0, section: 'Main' },
  { id: 3, number: 'T03', status: 'occupied', customers: 4, section: 'Main' },
  { id: 4, number: 'T04', status: 'reserved', customers: 0, section: 'VIP' },
  { id: 5, number: 'T05', status: 'available', customers: 0, section: 'Main' },
  { id: 6, number: 'T06', status: 'occupied', customers: 3, section: 'Patio' },
  { id: 7, number: 'T07', status: 'occupied', customers: 6, section: 'VIP' },
  { id: 8, number: 'T08', status: 'available', customers: 0, section: 'Patio' },
];
export const reportsData = {
  stats: [
    {
      title: 'Total Revenue',
      value: 'ETB 12,450',
      change: '+12.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'bg-green-500'
    },
    {
      title: 'Orders Today',
      value: '24',
      change: '+8.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'bg-blue-500'
    },
    {
      title: 'Avg. Order Value',
      value: 'ETB 518',
      change: '+5.3%',
      trend: 'up',
      icon: 'BarChart3',
      color: 'bg-purple-500'
    },
    {
      title: 'Preparation Time',
      value: '18 min',
      change: '-2.1%',
      trend: 'down',
      icon: 'Clock',
      color: 'bg-orange-500'
    }
  ],
  popularItems: [
    { name: 'Pasta Carbonara', orders: 45, revenue: 'ETB 8,100' },
    { name: 'Grilled Salmon', orders: 32, revenue: 'ETB 8,960' },
    { name: 'Margherita Pizza', orders: 28, revenue: 'ETB 4,480' },
    { name: 'Tiramisu', orders: 25, revenue: 'ETB 2,375' },
    { name: 'Caesar Salad', orders: 22, revenue: 'ETB 1,870' }
  ],
  tablePerformance: [
    { table: 'T07 (VIP)', revenue: 'ETB 2,850', orders: 8, avgTime: '22 min' },
    { table: 'T03 (Main)', revenue: 'ETB 2,150', orders: 6, avgTime: '19 min' },
    { table: 'T01 (Main)', revenue: 'ETB 1,980', orders: 5, avgTime: '16 min' },
    { table: 'T06 (Patio)', revenue: 'ETB 1,750', orders: 4, avgTime: '24 min' }
  ]
};

// In your data file, make sure settingsOptions looks like this:
export const settingsOptions = [
  {
    id: 1,
    icon: 'User',
    titleKey: 'profile',
    descriptionKey: 'profileDesc',
    buttonKey: 'manageProfile',
    color: 'bg-green-500'
  },
  {
    id: 2,
    icon: 'Shield',
    titleKey: 'security', 
    descriptionKey: 'securityDesc',
    buttonKey: 'manageSecurity',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    icon: 'Bell',
    titleKey: 'notifications',
    descriptionKey: 'notificationsDesc',
    buttonKey: 'manageNotifications',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    icon: 'Palette',
    titleKey: 'appearance',
    descriptionKey: 'appearanceDesc',
    buttonKey: 'customizeAppearance',
    color: 'bg-amber-500'
  }
];
// Menu items with ingredient requirements

// Mock inventory data
export const mockInventory = [
  { id: 1, name: 'Chicken Breast', category: 'proteins', currentStock: 25, unit: 'kg', minStock: 5, costPerUnit: 320, lastUpdated: '2024-01-15' },
  { id: 2, name: 'Tomatoes', category: 'vegetables', currentStock: 15, unit: 'kg', minStock: 3, costPerUnit: 80, lastUpdated: '2024-01-15' },
  { id: 3, name: 'Lettuce', category: 'vegetables', currentStock: 3, unit: 'kg', minStock: 2, costPerUnit: 60, lastUpdated: '2024-01-15' },
  { id: 4, name: 'Pasta', category: 'grains', currentStock: 8, unit: 'kg', minStock: 2, costPerUnit: 120, lastUpdated: '2024-01-15' },
  { id: 5, name: 'Coffee Beans', category: 'beverages', currentStock: 6, unit: 'kg', minStock: 1, costPerUnit: 450, lastUpdated: '2024-01-15' },
  { id: 6, name: 'Salmon Fillet', category: 'proteins', currentStock: 12, unit: 'kg', minStock: 3, costPerUnit: 680, lastUpdated: '2024-01-15' },
  { id: 7, name: 'Rice', category: 'grains', currentStock: 20, unit: 'kg', minStock: 5, costPerUnit: 85, lastUpdated: '2024-01-15' },
  { id: 8, name: 'Olive Oil', category: 'condiments', currentStock: 8, unit: 'L', minStock: 2, costPerUnit: 280, lastUpdated: '2024-01-15' }
];

// Mock orders data
export const mockOrders = [
  {
    id: 101,
    tableNumber: 'Table 12',
    orderNumber: 'ORD-001',
    items: [
      { ...menuItems[1], quantity: 1, specialRequest: 'Extra cheese, No bacon' },
      { ...menuItems[2], quantity: 2, specialRequest: 'No croutons, Dressing on side' }
    ],
    status: 'pending',
    orderTime: new Date(Date.now() - 8 * 60000).toISOString(),
    customerNotes: 'Celebrating anniversary',
    priority: 'high',
    estimatedTime: 20,
    waiterName: 'Sarah'
  },
  {
    id: 102,
    tableNumber: 'Table 08',
    orderNumber: 'ORD-002',
    items: [
      { ...menuItems[0], quantity: 1, specialRequest: 'Well done, Lemon wedge' },
      { name: 'Seasonal Vegetables', price: 280, quantity: 1, station: 'vegetables', cookTime: 6 }
    ],
    status: 'preparing',
    orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
    startedTime: new Date(Date.now() - 10 * 60000).toISOString(),
    priority: 'normal',
    estimatedTime: 18,
    waiterName: 'Michael'
  }
];

// Kitchen stations
export const stations = [
  { id: 'all', name: 'All Stations', icon: '🍽️', color: 'gray' },
  { id: 'grill', name: 'Grill Station', icon: '🔥', color: 'red' },
  { id: 'pasta', name: 'Pasta Station', icon: '🍝', color: 'orange' },
  { id: 'pizza', name: 'Pizza Station', icon: '🍕', color: 'amber' },
  { id: 'salad', name: 'Salad Station', icon: '🥗', color: 'green' },
  { id: 'fryer', name: 'Fryer Station', icon: '🍟', color: 'yellow' },
  { id: 'vegetables', name: 'Vegetable Station', icon: '🥦', color: 'emerald' },
  { id: 'sides', name: 'Sides Station', icon: '🥔', color: 'blue' }
];

export const mockUsers = [
  { id: 1, name: 'Sarah Johnson', role: 'waiter', email: 'sarah@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(), phone: '+251 911 234 567', joinDate: '2023-01-15' },
  { id: 2, name: 'Michael Tesfaye', role: 'cashier', email: 'michael@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 1 * 3600000).toISOString(), phone: '+251 922 345 678', joinDate: '2023-03-22' },
  { id: 3, name: 'Marco Rossi', role: 'chef', email: 'marco@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 3 * 3600000).toISOString(), phone: '+251 933 456 789', joinDate: '2022-11-05' },
  { id: 4, name: 'Emma Daniel', role: 'waiter', email: 'emma@bistroelegante.com', status: 'inactive', lastLogin: new Date(Date.now() - 24 * 3600000).toISOString(), phone: '+251 944 567 890', joinDate: '2023-06-18' },
  { id: 5, name: 'Alex Kumar', role: 'cashier', email: 'alex@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 30 * 60000).toISOString(), phone: '+251 955 678 901', joinDate: '2023-08-30' },
  { id: 6, name: 'Abebe Mekonnen', role: 'admin', email: 'abebe@bistroelegante.com', status: 'active', lastLogin: new Date(Date.now() - 5 * 60000).toISOString(), phone: '+251 911 000 111', joinDate: '2022-05-10' }
];


export const mockTables = [
  { id: 1, number: 'T01', status: 'available', capacity: 2, section: 'Main' },
  { id: 2, number: 'T02', status: 'occupied', capacity: 4, section: 'Main', customerCount: 3, orderId: 105 },
  { id: 3, number: 'T03', status: 'available', capacity: 4, section: 'Main' },
  { id: 4, number: 'T04', status: 'occupied', capacity: 6, section: 'VIP', customerCount: 4, isVIP: true, orderId: 104 },
  { id: 5, number: 'T05', status: 'reserved', capacity: 2, section: 'Patio', reservationTime: '20:00', customerName: 'Mr. Johnson' },
  { id: 6, number: 'T06', status: 'available', capacity: 4, section: 'Patio' },
  { id: 7, number: 'T07', status: 'occupied', capacity: 8, section: 'VIP', customerCount: 6, isVIP: true, orderId: 102 },
  { id: 8, number: 'T08', status: 'available', capacity: 4, section: 'Main' }
];


// data.js - Only keep what's needed for DashboardView and other components
export const performanceStats = {
  revenue: {
    current: 45820.50,
    previous: 38250.75,
    trend: 'up',
    change: 19.8
  },
  customers: {
    current: 328,
    previous: 285,
    trend: 'up',
    change: 15.1
  },
  averageOrder: {
    current: 139.65,
    previous: 134.20,
    trend: 'up',
    change: 4.1
  },
  tableTurnover: {
    current: 2.8,
    previous: 2.5,
    trend: 'up',
    change: 12.0
  }
};

export const staffPerformance = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Head Waiter',
    avatar: 'SJ',
    tablesServed: 28,
    sales: 12580.25,
    efficiency: 94.2,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Senior Waiter',
    avatar: 'MC',
    tablesServed: 24,
    sales: 11245.50,
    efficiency: 91.5,
    rating: 4.6,
    status: 'active'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Waiter',
    avatar: 'ER',
    tablesServed: 22,
    sales: 9850.75,
    efficiency: 88.3,
    rating: 4.4,
    status: 'break'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Waiter',
    avatar: 'DK',
    tablesServed: 20,
    sales: 8765.25,
    efficiency: 85.7,
    rating: 4.3,
    status: 'active'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Trainee',
    avatar: 'LW',
    tablesServed: 15,
    sales: 6540.80,
    efficiency: 82.1,
    rating: 4.1,
    status: 'active'
  }
];

export const recentAlerts = [
  {
    id: 1,
    type: 'inventory',
    message: 'Low stock: Fresh Salmon (5kg remaining)',
    priority: 'high',
    time: '10 minutes ago'
  },
  {
    id: 2,
    type: 'staff',
    message: 'Lisa Wang completed training session',
    priority: 'medium',
    time: '25 minutes ago'
  },
  {
    id: 3,
    type: 'equipment',
    message: 'Oven #3 requires maintenance',
    priority: 'medium',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'customer',
    message: 'New VIP reservation for 8 people at 19:00',
    priority: 'low',
    time: '2 hours ago'
  }
];

export const popularItems = [
  { name: 'Pasta Carbonara', orders: 156, revenue: 28080, trend: 'up' },
  { name: 'Grilled Salmon', orders: 143, revenue: 40040, trend: 'up' },
  { name: 'Ribeye Steak', orders: 128, revenue: 44800, trend: 'stable' },
  { name: 'Margherita Pizza', orders: 122, revenue: 19520, trend: 'up' },
  { name: 'Caesar Salad', orders: 118, revenue: 10030, trend: 'down' }
];

export function getStatusColor(status) {
  switch (status) {
    case 'available':
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'occupied':
    case 'assigned':
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'reserved':
    case 'active':
    case 'preparing':
      return 'bg-amber-100 text-amber-700';
    case 'ready':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function getTimeElapsed(time) {
  const diff = Math.floor((new Date() - new Date(time)) / 60000);
  return diff < 1 ? 'Just now' : `${diff} min ago`;
}