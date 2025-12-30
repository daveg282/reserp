// src/components/providers/AuthProvider.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/contexts/auth-context';
import AuthService from '@/lib/auth-utils';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const token = AuthService.getToken();
      
      if (token && currentUser) {
        const isValid = await AuthService.isAuthenticated();
        if (isValid) {
          setUser(currentUser);
        } else {
          setUser(null);
          AuthService.clearAuthData();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      AuthService.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await AuthService.login(username, password);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}