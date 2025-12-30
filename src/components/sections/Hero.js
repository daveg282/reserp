'use client';
import Link from 'next/link';

export default function Hero() {
  const stats = [
    { value: "100%", label: "Faster Service", icon: "⚡" },
    { value: "24/7", label: "Real-time Tracking", icon: "🌐" },
    { value: "50%", label: "Error Reduction", icon: "📉" },
    { value: "99.9%", label: "Uptime Guarantee", icon: "🛡️" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background with Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293722_1px,transparent_1px),linear-gradient(to_bottom,#1f293722_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 border border-gray-800/50"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 pt-20">
        {/* Main Content */}
        <div className="mt-6">
          {/* Updated Badge with Better Contrast */}
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur-lg border border-indigo-500/30 px-6 py-3 rounded-full shadow-xl mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">
              Complete Restaurant Solution
            </span>
          </div>
          
          {/* Enhanced Headline with Gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white block mb-2">Streamline Your</span>
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Restaurant Operations
            </span>
          </h1>
          
          {/* Updated Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            From order taking to kitchen management, inventory, and payments - everything you need in one powerful system designed for <span className="text-white font-semibold">Ethiopian restaurants</span>.
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            href="/menu" 
            className="group relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-5 rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-indigo-500/30 transform hover:scale-105 flex items-center justify-center min-w-[220px] overflow-hidden"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="relative z-10">View Demo Menu</span>
            <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link 
            href="/login" 
            className="group relative bg-transparent border-2 border-indigo-500/50 text-white px-10 py-5 rounded-2xl hover:bg-indigo-600/10 hover:border-indigo-400 transition-all duration-300 font-semibold text-lg backdrop-blur-sm flex items-center justify-center min-w-[220px] overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 blur-md"></div>
            <span className="relative z-10">Staff Login</span>
            <svg className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/30 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6  hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-indigo-500/30 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-indigo-500/30 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-indigo-500/30 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-indigo-500/30 rounded-br-lg"></div>
              
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
    </section>
  );
}