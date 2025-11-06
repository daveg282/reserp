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