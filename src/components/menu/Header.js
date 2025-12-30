'use client';
import { ArrowLeft } from 'lucide-react';

export default function Header({ 
  isScrolled, 
  cartItemCount, 
  onShowCart, 
  onShowSearch, 
  showSearch,
  searchTerm,
  onSearchChange 
}) {
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <button
          onClick={() => window.location.href = '/'}
          className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 ${
            isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className={`transition-all duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-90'
          }`}>
            <h1 className={`text-2xl font-serif font-bold transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>Bistro Elegante</h1>
            <p className={`text-sm transition-all duration-300 ${
              isScrolled ? 'text-gray-600' : 'text-white/90'
            }`}>Fine Dining Experience</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={onShowSearch}
              className={`p-2 transition-all duration-300 rounded-full ${
                isScrolled 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button
              onClick={onShowCart}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">Cart</span>
              {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${
                  isScrolled ? 'bg-red-500' : 'bg-red-400'
                }`}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-4 fade-in">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 text-black bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </header>
  );
}