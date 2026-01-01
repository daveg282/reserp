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
export const tablesAPI = {
  // ========== PUBLIC ROUTES (no token needed) ==========
  
  // Get all tables
  async getTables() {
    const response = await fetch(`${API_BASE_URL}/tables`);
    if (!response.ok) throw new Error('Failed to fetch tables');
    const data = await response.json();
    return data.tables || [];
  },

  // Get available tables
  async getAvailableTables() {
    const response = await fetch(`${API_BASE_URL}/tables/available`);
    if (!response.ok) throw new Error('Failed to fetch available tables');
    const data = await response.json();
    return data.tables || [];
  },

  // Get single table
  async getTable(id) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`);
    if (!response.ok) throw new Error('Failed to fetch table');
    const data = await response.json();
    return data.table || null;
  },

  // Search tables
  async searchTables(query) {
    const response = await fetch(`${API_BASE_URL}/tables/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search tables');
    const data = await response.json();
    return data.tables || [];
  },

  // Get table statistics
  async getTableStats() {
    const response = await fetch(`${API_BASE_URL}/tables/stats`);
    if (!response.ok) throw new Error('Failed to fetch table statistics');
    const data = await response.json();
    return data;
  },

  // ========== PROTECTED ROUTES (token needed) ==========
  
  // Create table (admin/manager only)
  async createTable(tableData, token) {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tableData),
    });
    if (!response.ok) throw new Error('Failed to create table');
    const data = await response.json();
    return data;
  },

  // Update table (admin/manager only)
  async updateTable(id, tableData, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tableData),
    });
    if (!response.ok) throw new Error('Failed to update table');
    const data = await response.json();
    return data;
  },

  // Delete table (admin only)
  async deleteTable(id, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete table');
    const data = await response.json();
    return data;
  },

  // Occupy table (waiter/cashier/admin/manager)
  async occupyTable(id, customers, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/occupy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ customers }),
    });
    if (!response.ok) throw new Error('Failed to occupy table');
    const data = await response.json();
    return data;
  },

  // Free table (waiter/cashier/admin/manager)
  async freeTable(id, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/free`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to free table');
    const data = await response.json();
    return data;
  },

  // Reserve table (waiter/cashier/admin/manager)
  async reserveTable(id, reservationData, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) throw new Error('Failed to reserve table');
    const data = await response.json();
    return data;
  },

  // Update table status (admin/manager only)
  async updateTableStatus(id, status, token) {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update table status');
    const data = await response.json();
    return data;
  },

  // ========== PAGER ROUTES ==========
  
  // Get all pagers
  async getPagers(token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch pagers');
    const data = await response.json();
    return data.pagers || [];
  },

  // Get available pager
  async getAvailablePager(token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/available`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch available pager');
    const data = await response.json();
    return data;
  },

  // Assign pager to order
  async assignPager(pagerNumber, orderId, token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });
    if (!response.ok) throw new Error('Failed to assign pager');
    const data = await response.json();
    return data;
  },

  // Activate pager
  async activatePager(pagerNumber, token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to activate pager');
    const data = await response.json();
    return data;
  },

  // Release pager
  async releasePager(pagerNumber, token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/release`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to release pager');
    const data = await response.json();
    return data;
  },

  // Buzz pager
  async buzzPager(pagerNumber, token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/${pagerNumber}/buzz`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to buzz pager');
    const data = await response.json();
    return data;
  },

  // Get pager statistics
  async getPagerStats(token) {
    const response = await fetch(`${API_BASE_URL}/tables/pagers/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch pager statistics');
    const data = await response.json();
    return data;
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
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Get category with items
  async getCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      return data.category || null;
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

  // Update item status
  async updateItemStatus(itemId, status, token) {
    try {
      console.log(`🔄 Updating item ${itemId} to status: ${status}`);
      
      const response = await fetch(`${API_BASE_URL}/kitchen/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update item status');
      }
      
      const data = await response.json();
      console.log('✅ Item status updated:', data);
      return data;
      
    } catch (error) {
      console.error('Update Item Status Error:', error);
      throw error;
    }
  },
   async updateOrderStatus(orderId, status, token) {
    try {
      console.log(`🔄 Updating ORDER ${orderId} to ${status}`);
      
      const response = await fetch(`${API_BASE_URL}/kitchen/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update order status to ${status}`);
      }
      
      const data = await response.json();
      console.log('✅ Order status updated:', data);
      return data;
      
    } catch (error) {
      console.error('Update Order Status Error:', error);
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

// Inventory API endpoints for chefs (READ ONLY)
// ========== CHEF INVENTORY API (READ ONLY) ==========
// ========== CHEF INVENTORY API (READ ONLY + Recipe Management) ==========
export const chefInventoryAPI = {
  // ========== INGREDIENTS (READ ONLY) ==========
  
  // Get all ingredients for chef (read only)
  async getIngredients(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch ingredients');
      }
      
      const data = await response.json();
      return data.ingredients || [];
      
    } catch (error) {
      console.error('Get ingredients error:', error);
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
  async getDashboardData(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/dashboard`, {
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
  }
};