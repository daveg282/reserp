const API_BASE_URL = 'https://vortex-admin-kuku.pro.et/api';

// Auth API endpoints
export const authAPI = {
  // Login user
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  // Get user profile
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Logout user
  async logout(token) {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },

  // Check if token is valid
  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  async updateProfile(profileData, token) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update profile');
    }

    return response.json();
  },

  // Change password
  async changePassword(currentPassword, newPassword, token) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to change password');
    }

    return response.json();
  },
  
  // Get all users
  async getAllUsers(token) {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    return response.json();
  },

  // ========== USER MANAGEMENT ENDPOINTS ==========

  // Register new user
  async register(userData, token) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to register user');
    }

    return response.json();
  },

  // Get user by ID
  async getUserById(id, token) {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    return response.json();
  },

  // Update user
  async updateUser(id, userData, token) {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update user');
    }

    return response.json();
  },

  // Delete user
  async deleteUser(id, token) {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete user');
    }

    return response.json();
  },

  // Admin reset password
  async adminResetPassword(userId, token) {
    const response = await fetch(`${API_BASE_URL}/auth/admin-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to reset password');
    }

    return response.json();
  },

  // Get user statistics
  async getUserStats(token) {
    const response = await fetch(`${API_BASE_URL}/auth/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch user statistics');
    }

    return response.json();
  }
};
// Tables API endpoints
// Tables API endpoints - CORRECTED VERSION
export const tablesAPI = {
  // ========== PUBLIC ROUTES (no token needed) ==========
  
  // Get all tables
  async getTables(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/tables${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      return data.tables || data.data || [];
    } catch (error) {
      console.error('Get tables error:', error);
      throw error;
    }
  },

  // Get available tables
  async getAvailableTables(customer_count = null) {
    try {
      const url = customer_count 
        ? `${API_BASE_URL}/tables/available?customer_count=${customer_count}`
        : `${API_BASE_URL}/tables/available`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch available tables');
      const data = await response.json();
      return data.tables || [];
    } catch (error) {
      console.error('Get available tables error:', error);
      throw error;
    }
  },

  // Get single table
  async getTable(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}`);
      if (!response.ok) throw new Error('Failed to fetch table');
      const data = await response.json();
      return data.table || data.data || null;
    } catch (error) {
      console.error('Get table error:', error);
      throw error;
    }
  },

  // Search tables
  async searchTables(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search tables');
      const data = await response.json();
      return data.tables || [];
    } catch (error) {
      console.error('Search tables error:', error);
      throw error;
    }
  },

  // Get table statistics
  async getTableStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/stats`);
      if (!response.ok) throw new Error('Failed to fetch table statistics');
      const data = await response.json();
      return data.stats || data.data || {};
    } catch (error) {
      console.error('Get table stats error:', error);
      throw error;
    }
  },

  // ========== PROTECTED ROUTES (token needed) ==========
  
  // Create table (admin/manager only)
  async createTable(tableData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tableData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to create table');
      }
      
      const data = await response.json();
      return data.table || data.data;
    } catch (error) {
      console.error('Create table error:', error);
      throw error;
    }
  },

  // Update table (admin/manager only)
  async updateTable(id, tableData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tableData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update table');
      }
      
      const data = await response.json();
      return data.table || data.data;
    } catch (error) {
      console.error('Update table error:', error);
      throw error;
    }
  },

  // Delete table (admin only)
  async deleteTable(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to delete table');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete table error:', error);
      throw error;
    }
  },

  // Occupy table (waiter/cashier/admin/manager)
  async occupyTable(id, customer_count, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}/occupy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ customer_count }), // FIXED: was 'customers' in your code
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to occupy table');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Occupy table error:', error);
      throw error;
    }
  },

  // Free table (waiter/cashier/admin/manager)
  async freeTable(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}/free`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to free table');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Free table error:', error);
      throw error;
    }
  },

  // Reserve table (waiter/cashier/admin/manager)
  async reserveTable(id, reservationData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          customer_count: reservationData.guests || reservationData.customer_count 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to reserve table');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reserve table error:', error);
      throw error;
    }
  },

  // Update table status (admin/manager only)
  async updateTableStatus(id, status, token, customer_count = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, customer_count }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update table status');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update table status error:', error);
      throw error;
    }
  },

  // ========== PAGER ROUTES ==========
  
  // Get all pagers
  async getPagers(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/tables/pagers/all${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch pagers');
      }
      
      const data = await response.json();
      return data.pagers || [];
    } catch (error) {
      console.error('Get pagers error:', error);
      throw error;
    }
  },

  // Get available pager
  async getAvailablePager(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/available`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch available pager');
      }
      
      const data = await response.json();
      return data.pager || data.data;
    } catch (error) {
      console.error('Get available pager error:', error);
      throw error;
    }
  },

  // Assign pager to order
  async assignPager(pagerNumber, orderId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }), // FIXED: was 'orderId' in your code
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to assign pager');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Assign pager error:', error);
      throw error;
    }
  },

  // Activate pager
  async activatePager(pagerNumber, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to activate pager');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Activate pager error:', error);
      throw error;
    }
  },

  // Release pager
  async releasePager(pagerNumber, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/release`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to release pager');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Release pager error:', error);
      throw error;
    }
  },

  // Buzz pager
  async buzzPager(pagerNumber, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/buzz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to buzz pager');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Buzz pager error:', error);
      throw error;
    }
  },

  // Get pager statistics
  async getPagerStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tables/pagers/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to fetch pager statistics');
      }
      
      const data = await response.json();
      return data.stats || data.data;
    } catch (error) {
      console.error('Get pager stats error:', error);
      throw error;
    }
  },
};
// Orders API endpoints
export const ordersAPI = {
  // ========== PROTECTED ROUTES (token needed) ==========
  
 async createOrder(orderData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Create Order Error Response:', errorData);
        
        // Build comprehensive error message
        let errorMessage = 'Failed to create order';
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (response.status === 400) {
          errorMessage = 'Bad request - check your order data';
        } else if (response.status === 401) {
          errorMessage = 'Authentication required';
        } else if (response.status === 403) {
          errorMessage = 'You don\'t have permission to create orders';
        } else if (response.status === 404) {
          errorMessage = 'Table or menu item not found';
        } else if (response.status === 500) {
          errorMessage = 'Server error - please try again';
        }
        
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      
      const data = await response.json();
      console.log('API Create Order Success:', data);
      return data;
      
    } catch (error) {
      console.error('API Create Order Exception:', error);
      throw error;
    }
  },

  // Get all orders (admin/manager/cashier)
  async getAllOrders(token, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/orders${query ? `?${query}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.orders || [];
  },

// Get waiter's active orders - FIXED to match createOrder pattern
async getWaiterOrders(token) {
  try {
    console.log('📡 ordersAPI.getWaiterOrders called');
    
    const response = await fetch(`${API_BASE_URL}/orders/waiter/active`, {
      headers: {
        'Content-Type': 'application/json', // ← ADD THIS
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('📡 API Get Orders Error Response:', errorData);
      
      // Build comprehensive error message - SAME AS createOrder
      let errorMessage = 'Failed to fetch waiter orders';
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (response.status === 400) {
        errorMessage = 'Bad request';
      } else if (response.status === 401) {
        errorMessage = 'Authentication required';
      } else if (response.status === 403) {
        errorMessage = 'You don\'t have permission to view orders';
      } else if (response.status === 404) {
        errorMessage = 'Endpoint not found';
      } else if (response.status === 500) {
        errorMessage = 'Server error - please try again';
      }
      
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }
    
    const data = await response.json();
    console.log('📡 API Get Orders Success:', data);
    
    // Return just the orders array
    return data.orders || [];
    
  } catch (error) {
    console.error('📡 API Get Orders Exception:', error);
    throw error;
  }
},

  // Get single order
 async getOrder(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch order');
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error in ordersAPI.getOrder:', error);
    throw error;
  }
},

  // Update order status
  async updateOrderStatus(id, status, token) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update order status');
    }
    
    const data = await response.json();
    return data;
  },

  // Get kitchen orders (chef/admin/manager)
  async getKitchenOrders(token) {
    const response = await fetch(`${API_BASE_URL}/orders/kitchen`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch kitchen orders');
    const data = await response.json();
    return data.orders || [];
  },

  // Search orders (admin/manager/cashier)
  async searchOrders(query, token) {
    const response = await fetch(`${API_BASE_URL}/orders/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to search orders');
    const data = await response.json();
    return data.orders || [];
  },

  // Get order by order number (public, no token needed)
  async getOrderByNumber(orderNumber) {
    const response = await fetch(`${API_BASE_URL}/orders/number/${orderNumber}`);
    
    if (!response.ok) throw new Error('Failed to fetch order by number');
    const data = await response.json();
    return data.order || null;
  },
  async getDailyOrders(token, date = null) {
    try {
      const url = date 
        ? `${API_BASE_URL}/orders/waiter/daily/${date}`
        : `${API_BASE_URL}/orders/waiter/daily`;
      
      console.log('📊 Fetching daily orders from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch daily orders');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('API Get Daily Orders Error:', error);
      throw error;
    }
  },
};

export const menuAPI = {
  // ========== PUBLIC ROUTES (no token needed) ==========
  
  // Get all menu items
  async getMenuItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Get menu items error:', error);
      throw error;
    }
  },

  // Get single menu item
  async getMenuItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}`);
      if (!response.ok) throw new Error('Failed to fetch menu item');
      const data = await response.json();
      return data.item || null;
    } catch (error) {
      console.error('Get menu item error:', error);
      throw error;
    }
  },

  // Get popular items
  async getPopularItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/popular`);
      if (!response.ok) throw new Error('Failed to fetch popular items');
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Get popular items error:', error);
      throw error;
    }
  },

  // Search menu items
  async searchMenuItems(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search menu items');
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Search menu items error:', error);
      throw error;
    }
  },

  // Get all categories
  // Get all categories - PUBLIC ROUTE
async getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.categories || []; // Returns { success: true, categories: [], count: X }
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
},

// Get category with items - PUBLIC ROUTE
async getCategory(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    const data = await response.json();
    return data.category || null; // Returns { success: true, category: {} }
  } catch (error) {
    console.error('Get category error:', error);
    throw error;
  }
},

  // ========== PROTECTED ROUTES (token needed) ==========
  
  // Create menu item (admin/manager only)
  async createMenuItem(itemData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create menu item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Create menu item error:', error);
      throw error;
    }
  },

  // Update menu item (admin/manager only)
  async updateMenuItem(id, itemData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update menu item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update menu item error:', error);
      throw error;
    }
  },

  // Delete menu item (admin/manager only)
  async deleteMenuItem(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete menu item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Delete menu item error:', error);
      throw error;
    }
  },

  // Toggle availability (admin/manager only)
  async toggleAvailability(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle availability');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Toggle availability error:', error);
      throw error;
    }
  },

  // Toggle popular status (admin/manager only)
  async togglePopular(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}/popular`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle popular status');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Toggle popular error:', error);
      throw error;
    }
  },

  // Get menu statistics (admin/manager only)
  async getMenuStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu statistics');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get menu stats error:', error);
      throw error;
    }
  },

  // Create category (admin/manager only)
  async createCategory(categoryData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create category');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  // Update category (admin/manager only)
  async updateCategory(id, categoryData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update category');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },

  // Delete category (admin/manager only)
  async deleteCategory(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  },

  // ========== MENU ITEM INGREDIENTS (RECIPES) ==========
  
  // Get menu item with ingredients (recipe) - All roles can view
  async getMenuItemIngredients(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}/ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu item ingredients');
      }
      
      const data = await response.json();
      return data.menu_item || null;
      
    } catch (error) {
      console.error('Get menu item ingredients error:', error);
      throw error;
    }
  },

  // Get all menu items with recipes (chef/admin/manager)
  async getMenuItemsWithRecipes(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/menu/items-with-recipes${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu items with recipes');
      }
      
      const data = await response.json();
      return data.menu_items || [];
      
    } catch (error) {
      console.error('Get menu items with recipes error:', error);
      throw error;
    }
  },

  // Add ingredient to menu item (chef/admin/manager)
  async addIngredientToMenuItem(menuItemId, ingredientData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ingredientData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Add ingredient error:', error);
      throw error;
    }
  },

  // Add multiple ingredients to menu item (bulk)
  async addIngredientsBulk(menuItemId, ingredientsArray, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/ingredients/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add bulk ingredients');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Add bulk ingredients error:', error);
      throw error;
    }
  },

  // Update ingredient in menu item (chef/admin/manager)
  async updateMenuItemIngredient(menuItemId, ingredientId, updateData, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/items/${menuItemId}/ingredients/${ingredientId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update menu item ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update menu item ingredient error:', error);
      throw error;
    }
  },

  // Remove ingredient from menu item (chef/admin/manager)
  async removeIngredientFromMenuItem(menuItemId, ingredientId, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/items/${menuItemId}/ingredients/${ingredientId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Remove ingredient error:', error);
      throw error;
    }
  }
};

export const kitchenAPI = {
  // Get all kitchen orders (chef/admin/manager)
  async getKitchenOrders(token) {
    try {
      console.log('🧑‍🍳 kitchenAPI.getKitchenOrders called');
      console.log('🔐 Token provided:', token ? 'Yes' : 'No');
      
      const response = await fetch(`${API_BASE_URL}/kitchen/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (response.status === 403) {
        throw new Error('Permission denied. Chef, admin, or manager role required.');
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
          if (errorData.error) errorMessage = errorData.error;
          if (errorData.msg) errorMessage = errorData.msg;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ API Response success:', data.success);
      console.log('✅ Orders count:', data.count);
      
      return data.orders || [];
      
    } catch (error) {
      console.error('❌ kitchenAPI.getKitchenOrders error:', error);
      throw error;
    }
  },

  // Get urgent orders (over 20 minutes)
  async getUrgentOrders(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/kitchen/orders/urgent`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch urgent orders');
      }
      
      const data = await response.json();
      return data.orders || [];
      
    } catch (error) {
      console.error('Kitchen Urgent Orders Error:', error);
      throw error;
    }
  },

  // Get orders by station
  async getOrdersByStation(station, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/kitchen/station/${station}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch orders for station ${station}`);
      }
      
      const data = await response.json();
      return data.orders || [];
      
    } catch (error) {
      console.error(`Kitchen Station Orders Error (${station}):`, error);
      throw error;
    }
  },

  // Update order item status - CORRECTED ENDPOINT
  async updateOrderItemStatus(orderItemId, status, token) {
    try {
      console.log(`📡 Updating order item ${orderItemId} status to: ${status}`);
      
      const response = await fetch(`${API_BASE_URL}/kitchen/items/${orderItemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
        throw new Error(`Failed to update order item status: ${errorMessage}`);
      }
      
      const data = await response.json();
      console.log('✅ Order item status update successful:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error in updateOrderItemStatus API call:', error);
      throw error;
    }
  },

  // Update entire order status - NEW ENDPOINT
  async updateOrderStatus(orderId, status, token) {
    try {
      console.log(`📡 Updating entire order ${orderId} status to: ${status}`);
      
      const response = await fetch(`${API_BASE_URL}/kitchen/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
        throw new Error(`Failed to update entire order status: ${errorMessage}`);
      }
      
      const data = await response.json();
      console.log('✅ Entire order status update successful:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error in updateOrderStatus API call:', error);
      throw error;
    }
  },

  // Mark entire order as ready
  async markOrderReady(orderId, token) {
    try {
      console.log(`🔄 Marking order ${orderId} as ready`);
      
      const response = await fetch(`${API_BASE_URL}/kitchen/orders/${orderId}/ready`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to mark order as ready');
      }
      
      const data = await response.json();
      console.log('✅ Order marked as ready:', data);
      return data;
      
    } catch (error) {
      console.error('Mark Order Ready Error:', error);
      throw error;
    }
  },

  // Get kitchen statistics
  async getKitchenStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/kitchen/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch kitchen statistics');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Kitchen Stats Error:', error);
      throw error;
    }
  }
};

// Stations API endpoints
export const stationsAPI = {
  // ========== GET ALL STATIONS (FIXED TO MATCH OTHER APIS) ==========
  async getStations(token) {
    try {
      console.log('📡 stationsAPI.getStations called');
      console.log('🔐 Token provided:', token ? 'Yes' : 'No');
      
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/stations`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (response.status === 403) {
        throw new Error('Permission denied. Admin, manager, or chef role required.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `Failed to fetch stations (HTTP ${response.status})`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ Stations loaded:', data.stations?.length || 0, 'stations');
      
      return data.stations || [];
      
    } catch (error) {
      console.error('❌ stationsAPI.getStations error:', error);
      throw error;
    }
  },

  // ========== SINGLE STATION (ALSO UPDATED) ==========
  async getStation(id, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch station');
      }
      
      const data = await response.json();
      return data.station || null;
    } catch (error) {
      console.error('Get station error:', error);
      throw error;
    }
  },

  // ========== STATION WORKLOAD ==========
  async getStationWorkload(id, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}/workload`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch station workload');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get station workload error:', error);
      throw error;
    }
  },

  // ========== CREATE STATION (admin/manager only) ==========
  async createStation(stationData, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log('📡 Creating station:', stationData);
      
      const response = await fetch(`${API_BASE_URL}/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create station');
      }
      
      const data = await response.json();
      console.log('✅ Station created:', data);
      return data;
    } catch (error) {
      console.error('Create station error:', error);
      throw error;
    }
  },

  // ========== UPDATE STATION (admin/manager only) ==========
  async updateStation(id, stationData, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Updating station ${id}:`, stationData);
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update station');
      }
      
      const data = await response.json();
      console.log('✅ Station updated:', data);
      return data;
    } catch (error) {
      console.error('Update station error:', error);
      throw error;
    }
  },

  // ========== DELETE STATION (admin only) ==========
  async deleteStation(id, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Deleting station ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete station');
      }
      
      const data = await response.json();
      console.log('✅ Station deleted:', data);
      return data;
    } catch (error) {
      console.error('Delete station error:', error);
      throw error;
    }
  },

  // ========== STATION STATISTICS (admin/manager only) ==========
  async getStationStats(token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      const response = await fetch(`${API_BASE_URL}/stations/stats/summary`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch station statistics');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get station stats error:', error);
      throw error;
    }
  },

  // ========== ASSIGN CATEGORIES TO STATION ==========
  async assignCategories(stationId, categoryIds, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Assigning categories to station ${stationId}:`, categoryIds);
      
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}/assign-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ category_ids: categoryIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to assign categories');
      }
      
      const data = await response.json();
      console.log('✅ Categories assigned:', data);
      return data;
    } catch (error) {
      console.error('Assign categories error:', error);
      throw error;
    }
  },

  // ========== GET AVAILABLE CHEFS ==========
  async getAvailableChefs(token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log('📡 Fetching available chefs');
      
      const response = await fetch(`${API_BASE_URL}/stations/chefs/available`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch available chefs');
      }
      
      const data = await response.json();
      console.log('✅ Available chefs loaded:', data.chefs?.length || 0);
      return data.chefs || [];
    } catch (error) {
      console.error('Get available chefs error:', error);
      throw error;
    }
  },

  // ========== ASSIGN CHEF TO STATION ==========
  async assignChef(stationId, chefId, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Assigning chef ${chefId} to station ${stationId}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}/assign-chef`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chef_id: chefId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to assign chef');
      }
      
      const data = await response.json();
      console.log('✅ Chef assigned:', data);
      return data;
    } catch (error) {
      console.error('Assign chef error:', error);
      throw error;
    }
  },

  // ========== REMOVE CHEF FROM STATION ==========
  async removeChef(stationId, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Removing chef from station ${stationId}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}/remove-chef`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove chef');
      }
      
      const data = await response.json();
      console.log('✅ Chef removed:', data);
      return data;
    } catch (error) {
      console.error('Remove chef error:', error);
      throw error;
    }
  },

  // ========== GET ORDERS BY STATION ==========
  async getOrdersByStation(stationName, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Fetching orders for station: ${stationName}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${stationName}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch orders for station ${stationName}`);
      }
      
      const data = await response.json();
      console.log('✅ Station orders loaded:', data.orders?.length || 0);
      return data.orders || [];
    } catch (error) {
      console.error('Get orders by station error:', error);
      throw error;
    }
  },

  // ========== SEARCH STATIONS ==========
  async searchStations(query, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      const response = await fetch(`${API_BASE_URL}/stations/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to search stations');
      }
      
      const data = await response.json();
      return data.stations || [];
    } catch (error) {
      console.error('Search stations error:', error);
      throw error;
    }
  },

  // ========== TOGGLE STATION STATUS ==========
  async toggleStationStatus(id, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Toggling status for station ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle station status');
      }
      
      const data = await response.json();
      console.log('✅ Station status toggled:', data);
      return data;
    } catch (error) {
      console.error('Toggle station status error:', error);
      throw error;
    }
  },

  // ========== UPDATE STATION COLOR ==========
  async updateStationColor(id, color, token) {
    try {
      if (!token) throw new Error('Authentication token is required');
      
      console.log(`📡 Updating color for station ${id} to ${color}`);
      
      const response = await fetch(`${API_BASE_URL}/stations/${id}/color`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ color }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update station color');
      }
      
      const data = await response.json();
      console.log('✅ Station color updated:', data);
      return data;
    } catch (error) {
      console.error('Update station color error:', error);
      throw error;
    }
  }
};


export const chefInventoryAPI = {
  // ========== INGREDIENTS (READ ONLY) ==========

async getIngredients(token) {
  try {
    console.log('📡 chefInventoryAPI.getIngredients called');
    
    const response = await fetch(`${API_BASE_URL}/inventory/ingredients`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });
    
    console.log('📊 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch ingredients: ${errorData.error || `HTTP ${response.status}`}`);
    }
    
    const data = await response.json();
    console.log('📊 Full API response:', data);
    
    // Handle different response structures like in your working direct fetch
    let ingredientsData = [];
    
    if (data.success === true) {
      if (Array.isArray(data.data)) {
        ingredientsData = data.data;
        console.log(`✅ Got ${ingredientsData.length} ingredients from data.data`);
      } else if (Array.isArray(data)) {
        ingredientsData = data;
        console.log(`✅ Got ${ingredientsData.length} ingredients from root array`);
      } else if (data.ingredients && Array.isArray(data.ingredients)) {
        ingredientsData = data.ingredients;
        console.log(`✅ Got ${ingredientsData.length} ingredients from data.ingredients`);
      } else {
        console.warn('⚠️ Unexpected data structure:', data);
        throw new Error('Invalid response structure from server');
      }
    } else if (Array.isArray(data)) {
      ingredientsData = data;
      console.log(`✅ Got ${ingredientsData.length} ingredients from root array`);
    } else if (data.ingredients && Array.isArray(data.ingredients)) {
      ingredientsData = data.ingredients;
      console.log(`✅ Got ${ingredientsData.length} ingredients from data.ingredients`);
    } else {
      console.warn('⚠️ API returned unsuccessful or unexpected format:', data);
      throw new Error(data.error || 'Invalid response from server');
    }
    
    console.log(`✅ chefInventoryAPI returning ${ingredientsData.length} ingredients`);
    return ingredientsData;
    
  } catch (error) {
    console.error('❌ Get ingredients error:', error);
    throw error;
  }
},

  // Get ingredient by ID for chef
  async getIngredient(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch ingredient');
      }
      
      const data = await response.json();
      return data.ingredient || null;
      
    } catch (error) {
      console.error('Get ingredient error:', error);
      throw error;
    }
  },

  // ========== MENU ITEMS WITH RECIPES (NEW ENDPOINTS) ==========
  
  // Get menu items with recipes (chef view) - USES: GET /api/menu/items-with-recipes
  async getMenuItems(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/menu/items-with-recipes${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('📡 Fetching menu items from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu items');
      }
      
      const data = await response.json();
      console.log('📊 Menu items received:', data.menu_items?.length || 0, 'items');
      return data.menu_items || [];
      
    } catch (error) {
      console.error('Get menu items error:', error);
      throw error;
    }
  },

  // Get menu item with full details and recipe - USES: GET /api/menu/items/:id/ingredients
  async getMenuItem(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${id}/ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu item');
      }
      
      const data = await response.json();
      return data.menu_item || null;
      
    } catch (error) {
      console.error('Get menu item error:', error);
      throw error;
    }
  },

  // ========== RECIPE MANAGEMENT (NEW ENDPOINTS) ==========
  
  // Add ingredient to menu item (single) - USES: POST /api/menu/items/:id/ingredients
  async addIngredientToMenuItem(menuItemId, ingredientData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ingredientData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Add ingredient error:', error);
      throw error;
    }
  },

  // Add multiple ingredients to menu item (bulk) - USES: POST /api/menu/items/:id/ingredients/bulk
  async addIngredientsBulk(menuItemId, ingredientsArray, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/ingredients/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add bulk ingredients');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Add bulk ingredients error:', error);
      throw error;
    }
  },

  // Update ingredient quantity in menu item - USES: PUT /api/menu/items/:id/ingredients/:ingredientId
  async updateMenuItemIngredient(menuItemId, ingredientId, updateData, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/items/${menuItemId}/ingredients/${ingredientId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update ingredient error:', error);
      throw error;
    }
  },

  // Remove ingredient from menu item - USES: DELETE /api/menu/items/:id/ingredients/:ingredientId
  async removeIngredientFromMenuItem(menuItemId, ingredientId, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/items/${menuItemId}/ingredients/${ingredientId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove ingredient');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Remove ingredient error:', error);
      throw error;
    }
  },

  // ========== EXISTING INVENTORY ENDPOINTS (KEEP AS IS) ==========
  
  // Get low stock alerts for chef
  async getLowStockAlerts(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/alerts/low-stock`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch stock alerts');
      }
      
      const data = await response.json();
      return data.alerts || [];
      
    } catch (error) {
      console.error('Get stock alerts error:', error);
      throw error;
    }
  },

  // Get stock summary for chef
  async getStockSummary(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stock-summary`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch stock summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get stock summary error:', error);
      throw error;
    }
  },

  // Get recipe for menu item (chef view) - Uses new endpoint
  async getRecipe(menuItemId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch recipe');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get recipe error:', error);
      throw error;
    }
  },

  // Get most profitable items (chef can view)
  async getMostProfitableItems(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/recipes/most-profitable`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch profitable items');
      }
      
      const data = await response.json();
      return data.items || [];
      
    } catch (error) {
      console.error('Get profitable items error:', error);
      throw error;
    }
  },

  // Check order item ingredients before preparation
  async checkOrderItemIngredients(orderItemId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/check/order-item/${orderItemId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to check ingredients');
      }
      
      const data = await response.json();
      return data.data || {};
      
    } catch (error) {
      console.error('Check ingredients error:', error);
      throw error;
    }
  },

  // Deduct ingredients when chef starts preparation
  async deductIngredients(orderItemId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/deduct/order-item/${orderItemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to deduct ingredients');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Deduct ingredients error:', error);
      throw error;
    }
  },

  // Get chef inventory dashboard
  async getChefInventory(token, stationId = null) {
    try {
      const url = stationId 
        ? `${API_BASE_URL}/inventory/chef-view?station_id=${stationId}`
        : `${API_BASE_URL}/inventory/chef-view`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch chef inventory');
      }
      
      const data = await response.json();
      return data.data || {};
      
    } catch (error) {
      console.error('Get chef inventory error:', error);
      throw error;
    }
  },

  // Get station-specific inventory
  async getStationInventory(stationId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/station/${stationId}/inventory`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch station inventory');
      }
      
      const data = await response.json();
      return data.data || {};
      
    } catch (error) {
      console.error('Get station inventory error:', error);
      throw error;
    }
  },

  // Get top used ingredients (read only for chef)
  async getTopUsedIngredients(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/top-used-ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch top used ingredients');
      }
      
      const data = await response.json();
      return data.data || [];
      
    } catch (error) {
      console.error('Get top used ingredients error:', error);
      throw error;
    }
  },

  // Get available ingredients for adding to menu items
  async getAvailableIngredients(token, search = '') {
    try {
      const url = `${API_BASE_URL}/inventory/ingredients/available${search ? `?search=${encodeURIComponent(search)}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch available ingredients');
      }
      
      const data = await response.json();
      return data.ingredients || [];
      
    } catch (error) {
      console.error('Get available ingredients error:', error);
      throw error;
    }
  },

  // Get menu items by category or station
  async getMenuItemsByStation(stationId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/menu-items/station/${stationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu items by station');
      }
      
      const data = await response.json();
      return data.menu_items || [];
      
    } catch (error) {
      console.error('Get menu items by station error:', error);
      throw error;
    }
  }
};
// Report API - following your exact chefInventoryAPI pattern
export const reportAPI = {
  // Get dashboard data for admin/manager
 // Get dashboard data for admin/manager
async getDashboardData(token, params = {}) {
  try {
    console.log('📊 Fetching dashboard data with params:', params);
    
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/reports/dashboard${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch dashboard data');
    }
    
    const data = await response.json();
    console.log('📊 Dashboard data received for period:', params.period || 'today');
    
    return data;
    
  } catch (error) {
    console.error('Get dashboard data error:', error);
    throw error;
  }
},

  // Get detailed sales report
  async getSalesReport(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/sales/detailed${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch sales report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  },

  // Get daily sales report
  async getDailySalesReport(token, date = null) {
    try {
      const queryParams = date ? `?date=${date}` : '';
      const url = `${API_BASE_URL}/reports/sales/daily${queryParams}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch daily sales report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get daily sales report error:', error);
      throw error;
    }
  },

  // Get weekly sales report
  async getWeeklySalesReport(token, weekStart = null) {
    try {
      const queryParams = weekStart ? `?week_start=${weekStart}` : '';
      const url = `${API_BASE_URL}/reports/sales/weekly${queryParams}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch weekly sales report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get weekly sales report error:', error);
      throw error;
    }
  },

  // Get monthly sales report
  async getMonthlySalesReport(token, year = null, month = null) {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      
      const queryParams = params.toString();
      const url = `${API_BASE_URL}/reports/sales/monthly${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch monthly sales report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get monthly sales report error:', error);
      throw error;
    }
  },

  // Get staff performance report
  async getStaffPerformanceReport(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/staff/performance${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch staff performance report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get staff performance report error:', error);
      throw error;
    }
  },

  // Get individual staff detail report
  async getStaffDetailReport(token, staffId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/staff/${staffId}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch staff detail report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get staff detail report error:', error);
      throw error;
    }
  },

  // Get inventory report
  async getInventoryReport(token, detailed = false) {
    try {
      const queryParams = detailed ? '?detailed=true' : '';
      const url = `${API_BASE_URL}/reports/inventory${queryParams}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch inventory report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get inventory report error:', error);
      throw error;
    }
  },

  // Get quick stats
  async getQuickStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/quick-stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch quick stats');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get quick stats error:', error);
      throw error;
    }
  },

  // Get table performance report
  async getTablePerformanceReport(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/tables/performance${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch table performance report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get table performance report error:', error);
      throw error;
    }
  },

  // Get custom report by type
  async getCustomReport(token, reportType, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/${reportType}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch ${reportType} report`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error(`Get ${reportType} report error:`, error);
      throw error;
    }
  },

  // Get revenue trend for charts
  async getRevenueTrend(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/revenue-trend${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch revenue trend');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get revenue trend error:', error);
      throw error;
    }
  },
  async getProfitLossReport(token, params = {}) {
    try {
      console.log('💰 Fetching P&L report with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/pl${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch profit & loss report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get profit loss report error:', error);
      throw error;
    }
  },

  // Get VAT/Tax report
  async getVATReport(token, params = {}) {
    try {
      console.log('🧾 Fetching VAT report with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/vat${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch VAT report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get VAT report error:', error);
      throw error;
    }
  },

  // Get financial summary
  async getFinancialSummary(token, params = {}) {
    try {
      console.log('📈 Fetching financial summary with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/summary${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch financial summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw error;
    }
  },
};
// Cashier-specific API consolidator

export const cashierBillingAPI = {
  // Process payment for order - POST /billing/orders/:id/pay
  async processPayment(orderId, paymentData, token) {
    try {
      console.log('💰 Processing payment for order:', orderId);
      
      const response = await fetch(`${API_BASE_URL}/billing/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process payment');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  },
  
  // Generate receipt - GET /billing/orders/:id/receipt
  async generateReceipt(orderId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/orders/${orderId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate receipt');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Generate receipt error:', error);
      throw error;
    }
  },
  
  // Get pending payments - GET /billing/pending
  async getPendingPayments(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch pending payments');
      }
      
      const data = await response.json();
      return data.orders || [];
      
    } catch (error) {
      console.error('Get pending payments error:', error);
      throw error;
    }
  },
  
  // Apply discount to order - POST /billing/orders/:id/discount
  async applyDiscount(orderId, discountData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/orders/${orderId}/discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(discountData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to apply discount');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Apply discount error:', error);
      throw error;
    }
  },
  
  // Get sales summary - GET /billing/sales/summary
  async getSalesSummary(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/billing/sales/summary${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch sales summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get sales summary error:', error);
      throw error;
    }
  },
  
  // Generate HTML receipt - GET /billing/orders/:id/receipt/html
  async generateReceiptHTML(orderId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/orders/${orderId}/receipt/html`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate HTML receipt');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Generate HTML receipt error:', error);
      throw error;
    }
  },
  // Add this to api.js in the cashierBillingAPI section, after getSalesSummary
async getDailySalesReport(token, date = null) {
  try {
    const queryParams = date ? `?date=${date}` : '';
    const url = `${API_BASE_URL}/billing/sales/daily${queryParams}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch daily sales report');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Get daily sales report error:', error);
    throw error;
  }
},
 async getProfitLossReport(token, params = {}) {
    try {
      console.log('💰 Fetching P&L report with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/pl${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch profit & loss report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get profit loss report error:', error);
      throw error;
    }
  },

  // Get VAT/Tax report
  async getVATReport(token, params = {}) {
    try {
      console.log('🧾 Fetching VAT report with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/vat${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch VAT report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get VAT report error:', error);
      throw error;
    }
  },

  // Get financial summary
  async getFinancialSummary(token, params = {}) {
    try {
      console.log('📈 Fetching financial summary with params:', params);
      
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/financial/summary${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch financial summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw error;
    }
  },

};
// ========== INVENTORY MANAGEMENT API ==========
export const inventoryManagementAPI = {
  // Get all inventory items
 async getInventory(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/ingredients`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch inventory');
    }
    
    return await response.json(); // Return FULL response
    
  } catch (error) {
    console.error('Get inventory error:', error);
    throw error;
  }
},

  // Create inventory item
  async createInventoryItem(itemData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create inventory item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Create inventory item error:', error);
      throw error;
    }
  },

  // Update inventory item
  async updateInventoryItem(id, itemData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update inventory item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update inventory item error:', error);
      throw error;
    }
  },

  // Delete inventory item
  async deleteInventoryItem(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete inventory item');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Delete inventory item error:', error);
      throw error;
    }
  },

  // Update stock level
  async updateStockLevel(id, stockData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stockData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update stock level');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update stock level error:', error);
      throw error;
    }
  },

  // Bulk update stock
  async bulkUpdateStock(stockUpdates, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/bulk-stock-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ updates: stockUpdates }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to bulk update stock');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Bulk update stock error:', error);
      throw error;
    }
  },

  // Get low stock items
  async getLowStock(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch low stock items');
      }
      
      const data = await response.json();
      return data.lowStockItems || [];
      
    } catch (error) {
      console.error('Get low stock error:', error);
      throw error;
    }
  },

  // Get stock summary
  async getStockSummary(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stock-summary`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch stock summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get stock summary error:', error);
      throw error;
    }
  },

  // Get inventory categories
  // inventoryManagementAPI.js

async getCategories(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/categories`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // If endpoint doesn't exist, throw a specific error
      if (response.status === 404) {
        throw new Error('Categories endpoint not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch categories');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
},

  // Search ingredients
  async searchIngredients(query, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to search ingredients');
      }
      
      const data = await response.json();
      return data.ingredients || [];
      
    } catch (error) {
      console.error('Search ingredients error:', error);
      throw error;
    }
  }
};

// ========== SUPPLIERS API ==========
export const suppliersAPI = {
  // Get all suppliers
  async getSuppliers(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/suppliers${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch suppliers');
      }
      
      const data = await response.json();
      return data.suppliers || [];
      
    } catch (error) {
      console.error('Get suppliers error:', error);
      throw error;
    }
  },

  // Get supplier by ID
 async getSuppliers(token, filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/suppliers${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch suppliers');
    }
    
    const data = await response.json();
    console.log('📊 Full supplier response:', data); // DEBUG LOG
    
    // Check ALL possible response structures
    if (data.success === true) {
      // Try multiple possible keys
      return data.suppliers || data.data || []; // FIXED HERE
    }
    
    // Fallback if no success flag
    return data.suppliers || data.data || data || [];
    
  } catch (error) {
    console.error('Get suppliers error:', error);
    throw error;
  }
},

  // Create supplier
  async createSupplier(supplierData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(supplierData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create supplier');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Create supplier error:', error);
      throw error;
    }
  },

  // Update supplier
  async updateSupplier(id, supplierData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(supplierData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update supplier');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update supplier error:', error);
      throw error;
    }
  },

  // Delete supplier
  // In api.js - suppliersAPI.deleteSupplier
async deleteSupplier(id, token) {
  try {
    console.log(`🗑️ Deleting supplier ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // ADD THIS
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Delete response status:', response.status);
    
    if (!response.ok) {
      // Try to get detailed error from backend
      const errorData = await response.json().catch(() => ({}));
      console.error('📡 Delete error response:', errorData);
      
      let errorMessage = 'Failed to delete supplier';
      if (errorData.message) errorMessage = errorData.message;
      if (errorData.error) errorMessage = errorData.error;
      
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Delete successful:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Delete supplier API error:', error);
    throw error; // Re-throw to be caught by page.js
  }
},

  // Get suppliers with their ingredients
  async getSuppliersWithIngredients(supplierId = null, token) {
    try {
      let url = `${API_BASE_URL}/suppliers/with-ingredients/all`;
      if (supplierId) {
        url = `${API_BASE_URL}/suppliers/${supplierId}/ingredients`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch suppliers with ingredients');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get suppliers with ingredients error:', error);
      throw error;
    }
  },

  // Get supplier performance
  async getSupplierPerformance(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/performance/report`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch supplier performance');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get supplier performance error:', error);
      throw error;
    }
  }
};

// ========== PURCHASE ORDERS API ==========
export const purchaseOrdersAPI = {
  // Get all purchase orders
  async getPurchaseOrders(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/purchase-orders${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch purchase orders');
      }
      
      const data = await response.json();
      return data.purchaseOrders || [];
      
    } catch (error) {
      console.error('Get purchase orders error:', error);
      throw error;
    }
  },

  // Get purchase order by ID
  async getPurchaseOrder(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch purchase order');
      }
      
      const data = await response.json();
      return data.purchaseOrder || null;
      
    } catch (error) {
      console.error('Get purchase order error:', error);
      throw error;
    }
  },

  // Create purchase order
  async createPurchaseOrder(orderData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create purchase order');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Create purchase order error:', error);
      throw error;
    }
  },

  // Update purchase order status
  async updatePurchaseOrderStatus(id, status, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update purchase order status');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update purchase order status error:', error);
      throw error;
    }
  },

  // Add item to purchase order
  async addItemToPurchaseOrder(orderId, itemData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/${orderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add item to purchase order');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Add item to purchase order error:', error);
      throw error;
    }
  },

  // Remove item from purchase order
  async removeItemFromPurchaseOrder(orderId, itemId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/${orderId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove item from purchase order');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Remove item from purchase order error:', error);
      throw error;
    }
  },

  // Receive partial shipment
  async receivePartialShipment(orderId, receiptData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/${orderId}/receive-partial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(receiptData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to receive partial shipment');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Receive partial shipment error:', error);
      throw error;
    }
  },

  // Get pending purchase orders
  async getPendingPurchaseOrders(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/pending/all`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch pending purchase orders');
      }
      
      const data = await response.json();
      return data.pendingOrders || [];
      
    } catch (error) {
      console.error('Get pending purchase orders error:', error);
      throw error;
    }
  },

  // Get purchase order statistics
  async getPurchaseOrderStatistics(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/statistics/summary`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch purchase order statistics');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get purchase order statistics error:', error);
      throw error;
    }
  },

  // Get suggested purchases for low stock
  async getSuggestedPurchases(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase-orders/suggestions/low-stock`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch suggested purchases');
      }
      
      const data = await response.json();
      return data.suggestions || [];
      
    } catch (error) {
      console.error('Get suggested purchases error:', error);
      throw error;
    }
  }
};

// ========== RECIPES & COSTING API ==========
export const recipesCostingAPI = {
  // Get menu items with costing analysis
  async getMenuItemsWithCosting(token, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/menu/items-with-costing${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch menu items with costing');
      }
      
      const data = await response.json();
      return data.menuItems || [];
      
    } catch (error) {
      console.error('Get menu items with costing error:', error);
      throw error;
    }
  },

  // Get recipe cost breakdown
  async getRecipeCostBreakdown(menuItemId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/cost-breakdown`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch recipe cost breakdown');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get recipe cost breakdown error:', error);
      throw error;
    }
  },

  // Update recipe ingredients (costing)
  async updateRecipeCosting(menuItemId, costingData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/items/${menuItemId}/costing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(costingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update recipe costing');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Update recipe costing error:', error);
      throw error;
    }
  },

  // Calculate optimal menu prices
  async calculateOptimalPrices(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/menu/optimal-prices${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to calculate optimal prices');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Calculate optimal prices error:', error);
      throw error;
    }
  },

  // Get profitability analysis
  async getProfitabilityAnalysis(token, period = 'month') {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/profitability/${period}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch profitability analysis');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get profitability analysis error:', error);
      throw error;
    }
  },

  // Get cost variance report
  async getCostVarianceReport(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/reports/cost-variance${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch cost variance report');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get cost variance report error:', error);
      throw error;
    }
  },

  // Get ingredient cost trends
  async getIngredientCostTrends(token, ingredientId = null) {
    try {
      let url = `${API_BASE_URL}/reports/ingredient-cost-trends`;
      if (ingredientId) {
        url += `?ingredient_id=${ingredientId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch ingredient cost trends');
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Get ingredient cost trends error:', error);
      throw error;
    }
  }
};