'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import Image from 'next/image';
export const dynamic = 'force-dynamic';

export default function ProfessionalLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const redirect = searchParams.get('redirect');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        'admin': '/admin',
        'manager': '/dashboard',
        'cashier': '/cashier',
        'waiter': '/waiter',
        'chef': '/chef',
      };
      const route = redirect || roleRoutes[user.role] || '/dashboard';
      router.push(route);
    }
  }, [user, redirect, router]);

  // Check backend connection
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setBackendStatus(response.ok ? 'connected' : 'error');
    } catch {
      setBackendStatus('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand/Info */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 to-gray-800 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">InerNett</h1>
                <p className="text-gray-300 text-sm">Restaurant Management</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Enterprise Restaurant Platform
            </h2>
            <p className="text-gray-300 mb-8">
              Streamline operations, increase efficiency, and deliver exceptional guest experiences with our comprehensive management solution.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm">Trusted by 500+ restaurants</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">ISO</div>
                <div className="text-xs text-gray-400">Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center lg:text-left mb-10">
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your restaurant management dashboard
              </p>
            </div>

            {/* Backend Status */}
            <div className={`mb-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              backendStatus === 'connected' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : backendStatus === 'checking'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-3 ${
                backendStatus === 'connected' 
                  ? 'bg-emerald-500' 
                  : backendStatus === 'checking'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
              }`}></div>
              {backendStatus === 'connected' 
                ? 'Connected to secure server' 
                : backendStatus === 'checking'
                ? 'Establishing secure connection...'
                : 'Server connection issue'}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading || backendStatus === 'error'}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="name@restaurant.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => {/* Add forgot password */}}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading || backendStatus === 'error'}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || backendStatus === 'error'}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg text-base font-medium text-white transition-all duration-300 ${
                  isLoading || backendStatus === 'error'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800 hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Securing Access...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>

              {backendStatus === 'error' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.73 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-amber-800">Connection Required</p>
                      <p className="text-amber-700 text-sm mt-1">
                        Ensure backend server is running on <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">localhost:8000</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Security Notice */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Enterprise-grade security • HIPAA & GDPR compliant</span>
              </div>
              <div className="text-center text-xs text-gray-400 mt-4">
                <p>© {new Date().getFullYear()} InerNett Restaurant Systems. All rights reserved.</p>
                <p className="mt-1">Version 3.2.1 • Build #2024-01</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}