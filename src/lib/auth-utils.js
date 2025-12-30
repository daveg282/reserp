// src/lib/auth-utils.js
import { authAPI } from './api';

class AuthService {
  // Check if user is authenticated
  async isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const isValid = await authAPI.validateToken(token);
      if (!isValid) {
        this.clearAuthData();
        return false;
      }
      return true;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Login user
  async login(username, password) {
    const response = await authAPI.login(username, password);
    this.setAuthData(response.token, response.user);
    return response;
  }

  // Logout user
async logout() {
  try {
    const token = this.getToken();
    if (token) {
      await authAPI.logout(token);
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    this.clearAuthData();
    
    // ADD THIS - Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
  // Set authentication data
  setAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Set token expiry (24 hours)
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    
    // Also set cookie for middleware
    document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`;
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    
    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // Check token expiry
  isTokenExpired() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.role);
  }
}

export default new AuthService();