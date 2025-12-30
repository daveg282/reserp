'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function ProtectedLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Role-based access control configuration
  const rolePermissions = {
    admin: ['/admin'],
    cashier: ['/cashier'],
    chef: ['/chef'], 
    manager: ['/dashboard'],
    waiter: ['/waiter'],
  };

  // Default routes for each role (where to redirect if unauthorized)
  const defaultRoleRoutes = {
    admin: '/admin',
    cashier: '/cashier',
    chef: '/chef',
    manager: '/dashboard',
    waiter: '/waiter',
  };

  useEffect(() => {
    // Reset authorization check when pathname changes
    setIsAuthorized(false);

    const checkAccess = () => {
      // Check if user is authenticated
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return false;
      }

      // Check if user has access to current path
      const userRole = user.role?.toLowerCase();
      const allowedPaths = rolePermissions[userRole] || [];
      const currentPath = pathname.toLowerCase();
      
      const hasAccess = allowedPaths.some(path => 
        currentPath.startsWith(path.toLowerCase())
      );

      if (!hasAccess) {
        const defaultRoute = defaultRoleRoutes[userRole] || '/unauthorized';
        console.log(`User ${userRole} cannot access ${currentPath}, redirecting to ${defaultRoute}`);
        router.push(defaultRoute);
        return false;
      }

      return true;
    };

    // Only check after auth is loaded
    if (!authLoading) {
      const hasAccess = checkAccess();
      if (hasAccess) {
        // Small delay to ensure redirect would have happened if needed
        setTimeout(() => {
          setIsAuthorized(true);
        }, 50);
      }
    }
  }, [user, authLoading, pathname, router]);

  // Show loading state while checking auth OR while redirecting
  if (authLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Verifying authentication...' : 'Checking access permissions...'}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has access to current path
  return children;
}