'use-client';
import Link from 'next/link';

export default function Hero() {
  const stats = [
    { value: "100%", label: "Faster Service", icon: "⚡" },
    { value: "24/7", label: "Real-time Tracking", icon: "🌐" },
    { value: "50%", label: "Error Reduction", icon: "📉" },
    { value: "99.9%", label: "Uptime Guarantee", icon: "🛡️" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-float delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-float delay-500"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main Content */}
        <div className="mt-6">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-indigo-200 px-6 py-3 rounded-full shadow-lg mb-8">
            <span className="text-sm font-semibold text-indigo-700">Complete Restaurant Management Solution</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Streamline Your
            <span className="block text-indigo-600 mt-2">Restaurant Operations</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            From order taking to kitchen management, inventory, and payments - everything you need in one powerful system designed for Ethiopian restaurants.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/menu" 
            className="group bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center min-w-[200px]"
          >
            <span>View Demo Menu</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link 
            href="/login" 
            className="group border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 font-semibold text-lg flex items-center justify-center min-w-[200px]"
          >
            <span>Staff Login</span>
            <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>

      
        {/* Trust Badge */}
    
      </div>

    </section>
  );
}