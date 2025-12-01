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
      fixed top-0 w-full z-50 transition-all duration-500
      ${isScrolled 
        ? 'bg-white/98 backdrop-blur-xl border-b border-gray-300/30 shadow-2xl py-1' 
        : 'bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-lg py-2'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="text-white p-2.5 rounded-2xl mr-3 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <img 
                  src="/favicon.svg" 
                  alt="InerNett Logo" 
                  className="w-7 h-7 filter"
                />
              </div>
   
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-indigo-600  group-hover:from-blue-700 group-hover:to-cyan-700 transition-all duration-500 ">
                InerNett
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block transition-colors duration-300 font-medium">
                Restaurant ERP System
              </p>
            </div>
          </Link>

          {/* Enhanced Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="relative group text-gray-700 hover:text-blue-700 font-semibold transition-all duration-500 px-7 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-2 border-transparent hover:border-blue-200/50"
            >
              <span className="relative z-10 flex items-center">
                Staff Login
              </span>
            </Link>
            <Link 
              href="/menu" 
              className="relative group bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-500 font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:shadow-blue-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center">
                View Demo
              </span>
            </Link>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                relative p-3 rounded-2xl transition-all duration-500 group
                ${isMenuOpen 
                  ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 shadow-inner' 
                  : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 text-gray-700 hover:bg-blue-100 hover:text-blue-600 shadow-lg hover:shadow-xl'
                }
              `}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`
                  absolute block w-6 h-0.5 bg-current transition-all duration-500 rounded-full
                  ${isMenuOpen ? 'rotate-45 top-3 translate-y-0' : 'top-2 -translate-y-1'}
                `}></span>
                <span className={`
                  absolute block w-6 h-0.5 bg-current transition-all duration-500 rounded-full top-3
                  ${isMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
                `}></span>
                <span className={`
                  absolute block w-6 h-0.5 bg-current transition-all duration-500 rounded-full
                  ${isMenuOpen ? '-rotate-45 top-3 translate-y-0' : 'top-4 translate-y-1'}
                `}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200/30 shadow-2xl rounded-b-3xl overflow-hidden">
            <div className="flex flex-col py-6 px-5">
              {/* Enhanced Auth Buttons */}
              <div className="space-y-4">
                <Link 
                  href="/login" 
                  className="group flex items-center justify-center text-gray-700 hover:text-blue-700 font-semibold transition-all duration-500 px-6 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-300/50 hover:border-blue-200/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Staff Login
                </Link>
                <Link 
                  href="/menu" 
                  className="group bg-indigo-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-500 font-semibold text-center shadow-2xl hover:shadow-3xl active:scale-95 flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Demo Menu
                </Link>
              </div>

              {/* Enhanced Contact Info */}
              <div className="border-t border-gray-200/50 pt-6 mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-3">Need help? Contact us:</p>
                  <div className="space-y-2">
                    <p className="text-base text-gray-800 font-bold">+251 911 234 567</p>
                    <p className="text-sm text-gray-600">info@inernett.com</p>
                    <p className="text-xs text-gray-500 mt-3">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}