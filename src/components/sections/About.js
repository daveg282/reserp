"use client";

import { motion } from "framer-motion";
import { Building2, Users2, Target, Zap, Shield, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <section className="relative py-24 bg-white overflow-hidden" id="about">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 via-white to-blue-50/30"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 px-6 py-3 rounded-full shadow-sm mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mr-2"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Our Mission & Vision
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            What is{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              InerNett?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A revolutionary Restaurant ERP system built specifically for the unique challenges 
            and opportunities in the <span className="font-semibold text-gray-900">Ethiopian market</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5 items-center">
          {/* IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl  p-6">
              <img
                src="/InerNetFBIG.png"
                alt="InerNett ERP System Interface"
                className="w-full h-auto"
              />
              
            </div>
          </motion.div>

          {/* TEXT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-1 p-6"
          >
            {/* Main Description */}
            <div className="space-y-2 ">
              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900">InerNett</span> is more than just software — 
                it's a comprehensive ecosystem designed to streamline every aspect of restaurant operations, 
                from traditional Ethiopian cuisine management to modern digital payments.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                We've built our platform with deep understanding of local challenges: staff coordination, 
                inventory management for unique ingredients, and seamless integration with Ethiopian 
                payment systems.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-200">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Real-time Operations</h4>
                  <p className="text-gray-500 text-sm">
                    Live order tracking, inventory updates, and staff coordination
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Localized Solutions</h4>
                  <p className="text-gray-500 text-sm">
                    Built specifically for Ethiopian restaurants and payment systems
                  </p>
                </div>
              </div>
            </div>

            {/* CORE FOCUS BOXES */}
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center mb-4 border border-indigo-100">
                  <Building2 className="text-indigo-600 w-6 h-6" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-2">
                  For Restaurant Owners
                </h4>
                <p className="text-gray-500 text-sm">
                  Comprehensive analytics, cost control, and scaling tools designed for growth
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex items-center justify-center mb-4 border border-green-100">
                  <Users2 className="text-green-600 w-6 h-6" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-2">
                  For Restaurant Staff
                </h4>
                <p className="text-gray-500 text-sm">
                  Intuitive tools for efficient order management and seamless workflow
                </p>
              </motion.div>
            </div>

           
          </motion.div>
        </div>
      </div>
    </section>
  );
}