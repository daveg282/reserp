"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Enhanced gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb22_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb22_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center px-6 sm:px-8 relative z-10"
      >
        {/* Enhanced Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 px-6 py-3 rounded-full shadow-sm mb-8">
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mr-2"></div>
          <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Get Started Today
          </span>
        </div>

        {/* Enhanced Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Ready to{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform
          </span>{" "}
          Your Restaurant?
        </h2>

        {/* Enhanced Subheading */}
        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Join modern restaurants across Ethiopia using{" "}
          <span className="font-semibold text-gray-900">InerNett</span> to
          streamline operations, boost profits, and deliver unforgettable customer experiences.
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative group"
          >
            <Link
              href="/menu"
              className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-200 font-semibold text-lg transition-all duration-300 flex items-center justify-center min-w-[220px] overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="relative z-10">Explore Demo Menu</span>
              <svg className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative group"
          >
            <Link
              href="/login"
              className="relative border-2 border-indigo-600 text-indigo-600 px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center min-w-[220px]"
            >
              <span>Staff Login</span>
              <svg className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full border-2 border-white"></div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                Trusted by 50+ restaurants
              </p>
              <p className="text-xs text-gray-500 mt-1">
                24/7 support • No setup fees • 30-day trial
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}