'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2 rounded-lg mr-3 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">InerNett</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Restaurant ERP System</p>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Staff Login
              </Link>
              <Link 
                href="/menu" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View Demo
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <Link 
                    href="/login" 
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Staff Login
                  </Link>
                  <Link 
                    href="/menu" 
                    className="block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-medium text-center mt-2 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Demo Menu
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
               Complete Restaurant Management Solution
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Restaurant
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent block mt-2">Operations Today</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            From taking orders to managing kitchen, inventory, and payments - all in one unified system. 
            <span className="font-semibold text-blue-600"> Built for modern restaurants in Ethiopia.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
            <Link 
              href="/menu" 
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center"
            >
              <span>View Menu Demo</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-lg group"
            >
              <span className="group-hover:scale-105 transition-transform block">Staff Dashboard</span>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
            {[
              { value: "100%", label: "Faster Service", icon: "⚡" },
              { value: "24/7", label: "Real-time Tracking", icon: "🌐" },
              { value: "50%", label: "Error Reduction", icon: "📉" },
              { value: "99.9%", label: "Uptime Guarantee", icon: "🛡️" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Complete Restaurant Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run your restaurant efficiently, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature 1 - Order Management */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 hover:shadow-2xl transition-all duration-300 group hover:border-blue-300">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Order Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Real-time order tracking from placement to completion. Seamless coordination between waiters, cashiers, and kitchen staff with instant updates.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Table-side mobile ordering", "Real-time status updates", "Special requests handling", "Order modification & splitting"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Feature 2 - Kitchen Display System */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-2xl transition-all duration-300 group hover:border-green-300">
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kitchen Display System</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Digital order management for kitchen staff with real-time updates, preparation timers, and priority management.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Live order queue display", "Preparation time tracking", "Chef notifications & alerts", "Order priority management"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Feature 3 - POS & Payments */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl border border-purple-100 hover:shadow-2xl transition-all duration-300 group hover:border-purple-300">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">POS & Payment System</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive point of sale with multiple payment options, instant receipt generation, and secure transaction processing.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Split bill & multiple payments", "Digital receipt generation", "Real-time sales tracking", "Tax & discount management"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Feature 4 - Inventory Management */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 hover:shadow-2xl transition-all duration-300 group hover:border-orange-300">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Automated stock tracking, low-stock alerts, and consumption analytics to optimize inventory and reduce waste.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Automatic stock deduction", "Low stock alerts & notifications", "Supplier management", "Waste tracking & reporting"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Feature 5 - Analytics & Reports */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border border-red-100 hover:shadow-2xl transition-all duration-300 group hover:border-red-300">
              <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reporting</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive business intelligence with sales analytics, performance metrics, and actionable insights.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Sales performance dashboards", "Staff performance analytics", "Profit margin tracking", "Customer behavior insights"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Feature 6 - Customer Management */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 hover:shadow-2xl transition-all duration-300 group hover:border-indigo-300">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Build customer relationships with loyalty programs, feedback collection, and personalized service features.
              </p>
              <ul className="text-gray-600 space-y-3">
                {["Customer loyalty programs", "Feedback & review management", "Reservation management", "Customer preference tracking"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Workflow Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Streamlined Workflow</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              From customer order to kitchen preparation and payment - all seamlessly connected
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Order Taking', desc: 'Waiters take orders via tablet or mobile', icon: '📱' },
              { step: '2', title: 'Kitchen Display', desc: 'Chefs receive orders in real-time', icon: '👨‍🍳' },
              { step: '3', title: 'Preparation', desc: 'Track order status and preparation time', icon: '⏱️' },
              { step: '4', title: 'Payment', desc: 'Instant billing and multiple payment options', icon: '💳' }
            ].map((item) => (
              <div key={item.step} className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-blue-300 text-sm font-semibold mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-blue-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join modern restaurants in Ethiopia using InerNett to streamline operations and enhance customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Explore Demo Menu
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-lg group"
            >
              <span className="group-hover:scale-105 transition-transform block">Staff Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">InerNett</h4>
              <p className="text-gray-400 text-sm">
                Complete Restaurant Management System for modern Ethiopian restaurants.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">System</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/menu" className="hover:text-white transition-colors">Customer Menu</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Addis Ababa, Ethiopia</li>
                <li>+251 911 234 567</li>
                <li>info@inernett.com</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Technology</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Next.js 14</li>
                <li>React 18</li>
                <li>Tailwind CSS</li>
                <li>Real-time Updates</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 InerNett Restaurant ERP System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}