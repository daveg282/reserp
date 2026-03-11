'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';

export default function ProfessionalLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (user) {
      const roleRoutes = {
        'admin': '/admin',
        'manager': '/dashboard',
        'cashier': '/cashier',
        'waiter': '/waiter',
        'chef': '/chef',
      };
      router.push(redirect || roleRoutes[user.role] || '/dashboard');
    }
  }, [user, redirect, router]);

  useEffect(() => { checkBackendConnection(); }, []);

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
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-2xl overflow-hidden"
           style={{ maxHeight: 'calc(100vh - 2rem)' }}>

        {/* Left Side — shown only on lg+ */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 xl:p-12 flex-col justify-center relative overflow-hidden flex-shrink-0">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6 xl:mb-8">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <img src="/InernetFBIG.png" alt="InerNett Logo" className="rounded-lg w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl xl:text-2xl font-bold text-white">InerNett</h1>
                <p className="text-gray-300 text-xs xl:text-sm">Restaurant Management</p>
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-3 xl:mb-4 leading-tight">
              Restaurant Management Platform
            </h2>
            <p className="text-gray-300 text-sm xl:text-base leading-relaxed">
              Streamline operations, increase efficiency, and deliver exceptional guest experiences with our comprehensive management solution.
            </p>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-6 lg:p-8 xl:p-12">
            <div className="w-full max-w-sm xl:max-w-md">

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/InernetFBIG.png" alt="InerNett Logo" className="rounded-lg w-full h-full object-cover" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center lg:text-left mb-5">
                <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-sm xl:text-base">Sign in to your restaurant management dashboard</p>
              </div>

              {/* Backend Status */}
              <div className={`mb-5 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                backendStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                  backendStatus === 'connected' ? 'bg-emerald-500'
                  : backendStatus === 'checking' ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
                }`} />
                {backendStatus === 'connected' ? 'Connected to secure server'
                  : backendStatus === 'checking' ? 'Establishing secure connection...'
                  : 'Server connection issue'}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start text-sm">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email" name="email" type="email" autoComplete="email" required
                      value={formData.email} onChange={handleChange}
                      disabled={isLoading || backendStatus === 'error'}
                      className="block w-full pl-9 pr-4 py-2.5 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="name@restaurant.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password" name="password" type="password" autoComplete="current-password" required
                      value={formData.password} onChange={handleChange}
                      disabled={isLoading || backendStatus === 'error'}
                      className="block w-full pl-9 pr-4 py-2.5 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || backendStatus === 'error'}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-2 ${
                    isLoading || backendStatus === 'error'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Securing Access...
                    </>
                  ) : 'Sign In to Dashboard'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}