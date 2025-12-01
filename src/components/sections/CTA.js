"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute inset-0 -z-10 opacity-40 blur-3xl bg-gradient-to-r from-indigo-200 via-blue-100 to-cyan-200" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center px-6 sm:px-8"
      >
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Ready to <span className="text-indigo-600">Transform</span> Your Restaurant?
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join modern restaurants across Ethiopia using{" "}
          <span className="font-semibold text-indigo-700">InerNett</span> to
          streamline operations, boost profits, and deliver unforgettable customer experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href="/menu"
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-10 py-4 rounded-2xl shadow-lg hover:from-indigo-700 hover:to-cyan-700 font-semibold text-lg tracking-wide transition-all duration-300"
            >
              Explore Demo Menu
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href="/login"
              className="border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-600 hover:text-white shadow-sm transition-all duration-300"
            >
              Staff Login
            </Link>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-sm text-gray-500 tracking-wide"
        >
          Empowering restaurants through digital innovation — <span className="text-indigo-600 font-medium">InerNett</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
