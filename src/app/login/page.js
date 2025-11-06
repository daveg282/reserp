'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '../lib/data';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Store user in localStorage (in real app, use proper auth)
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'manager':
          router.push('/dashboard');
          break;
        case 'cashier':
          router.push('/cashier');
          break;
        case 'waiter':
          router.push('/waiter');
          break;
        case 'chef':
          router.push('/chef');
          break;
        default:
          router.push('/dashboard');
      }
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const fillDemoAccount = (demoUser) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Header - Responsive sizing */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white mb-2">Staff Portal</h2>
          <p className="text-gray-300 text-sm sm:text-base">Sign in to your restaurant management system</p>
        </div>

        {/* Login Form - Responsive padding and spacing */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors placeholder-gray-400"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm sm:text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {showDemoAccounts ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
              </button>
            </div>
          </form>

          {/* Demo Accounts - Responsive layout */}
          {showDemoAccounts && (
            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Demo Accounts:</h4>
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => fillDemoAccount(user)}
                    className="w-full text-left p-2 sm:p-3 rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md border border-transparent hover:border-amber-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          user.role === 'admin' ? 'bg-red-500' :
                          user.role === 'manager' ? 'bg-orange-500' :
                          user.role === 'cashier' ? 'bg-blue-500' :
                          user.role === 'waiter' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}>
                          {user.role.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm">{user.name}</div>
                          <div className="text-xs text-gray-600 capitalize">{user.role}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border self-start sm:self-auto">
                        {user.username}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center justify-center space-x-2 transition-colors group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </a>
          </div>
        </div>

        

        {/* Footer Note */}
        <div className="text-center text-white/70 text-xs sm:text-sm">
          <p>InerNett Restaurant Management System</p>
        </div>
      </div>
    </div>
  );
}