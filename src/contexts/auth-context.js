// src/contexts/auth-context.js
'use client';
import { createContext, useContext } from 'react';

// Only define the context structure here
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isAuthenticated: false,
  hasRole: () => false,
  hasAnyRole: () => false,
});

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };