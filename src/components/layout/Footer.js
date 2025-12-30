'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter Section */}
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Image 
                    src="/favicon.svg" 
                    alt="InerNett Logo" 
                    width={24}
                    height={24}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Iner<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Nett</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide mt-1">
                    RESTAURANT ERP SYSTEM
                  </p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                A comprehensive ERP solution designed to streamline restaurant operations, 
                enhance customer experience, and drive business growth.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 ">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links & Contact - Combined Section */}
          <div className="lg:col-span-4">
            <h4 className="text-lg font-semibold mb-8 text-white">Quick Links</h4>
            <div className="space-y-4 mb-10">
              <Link 
                href="/menu" 
                className="flex items-center group text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Customer Menu
              </Link>
              <Link 
                href="/login" 
                className="flex items-center group text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Staff Login
              </Link>
              <Link 
                href="/features" 
                className="flex items-center group text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="flex items-center group text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pricing
              </Link>
            </div>

           
           
          </div>

          {/* Hours Section */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold mb-8 text-white">Business Hours</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-300 text-sm">Monday - Friday</span>
                <span className="text-white font-medium text-sm">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-300 text-sm">Saturday</span>
                <span className="text-white font-medium text-sm">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-300 text-sm">Sunday</span>
                <span className="text-white font-medium text-sm">Closed</span>
              </div>
              <div className="pt-2">
                <p className="text-gray-400 text-xs">
                  Support available 24/7 for critical system issues
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
              © 2025 InerNett Restaurant ERP System.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}