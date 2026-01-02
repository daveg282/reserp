'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import Image from 'next/image';

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
      const response = await fetch('https://vortex-admin-kuku.pro.et/api/health', {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand/Info */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 to-gray-800 p-12 flex-col justify-center relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <img 
             src="/InernetFBIG.png" 
              alt="InerNett Logo" 
             className="rounded-lg"
             />

              </div>
              <div >
                <h1 className="text-2xl font-bold text-white">InerNett</h1>
                <p className="text-gray-300 text-sm">Restaurant Management</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
               Restaurant Management Platform
            </h2>
            <p className="text-gray-300 mb-8">
              Streamline operations, increase efficiency, and deliver exceptional guest experiences with our comprehensive management solution.
            </p>
          </div>

        
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center lg:text-left mb-6">
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                 <img 
             src="/InernetFBIG.png" 
              alt="InerNett Logo" 
             className="rounded-lg"
             />
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

              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}