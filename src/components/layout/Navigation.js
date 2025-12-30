'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-0' 
        : 'bg-white backdrop-blur-lg border-b border-gray-200/30 py-0'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Refined Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img 
                  src="/favicon.svg" 
                  alt="InerNett Logo" 
                  className="w-6 h-6 filter brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-blue-700 transition-all duration-300">
                InerNett
              </h1>
              <p className="text-[10px] text-gray-500 hidden sm:block transition-colors duration-300 font-medium tracking-wide">
                RESTAURANT ERP SYSTEM
              </p>
            </div>
          </Link>

          {/* Refined Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/login" 
              className="relative group text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
            >
              <span className="relative z-10 flex items-center text-sm">
                Staff Login
                <svg className="w-4 h-4 ml-2"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="/menu" 
              className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
            >
              <span className="relative flex items-center text-sm">
                View Demo
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Refined Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                relative p-2.5 rounded-lg transition-all duration-300 group
                ${isMenuOpen 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span className={`
                  absolute block w-5 h-0.5 bg-current transition-all duration-300 rounded-full
                  ${isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}
                `}></span>
                <span className={`
                  absolute block w-5 h-0.5 bg-current transition-all duration-300 rounded-full top-2.5
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                `}></span>
                <span className={`
                  absolute block w-5 h-0.5 bg-current transition-all duration-300 rounded-full
                  ${isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'}
                `}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Refined Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 rounded-b-xl overflow-hidden animate-in slide-in-from-top duration-300">
            <div className="flex flex-col py-4 px-4">
              {/* Refined Auth Buttons */}
              <div className="space-y-3">
                <Link 
                  href="/login" 
                  className="group flex items-center justify-between text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 px-4 py-3.5 rounded-lg hover:bg-gray-50 border border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Staff Login</span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/menu" 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3.5 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium text-center shadow-md hover:shadow-lg active:scale-95 flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>View Demo Menu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}