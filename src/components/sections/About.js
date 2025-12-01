"use client";

import { motion } from "framer-motion";
import { Building2, Users2 } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="about">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="/favicon.svg"
            alt="InerNett ERP System"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </motion.div>

        {/* TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-gray-700"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What is <span className="text-indigo-600">InerNett?</span>
          </h2>

          <p className="text-lg leading-relaxed mb-5">
            <strong>InerNett</strong> is a powerful Restaurant ERP system tailored
            for the Ethiopian market — designed to streamline everything from
            kitchen operations to financial reporting in one seamless platform.
          </p>

          <p className="text-base leading-relaxed mb-8">
            We understand the local challenges restaurants face, including
            traditional cuisine management, staff coordination, and diverse
            payment integrations. InerNett bridges these gaps with technology
            built for you.
          </p>

          {/* CORE FOCUS BOXES */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                For Restaurant Owners
              </h4>
              <p className="text-sm text-gray-600">
                Real-time analytics, cost control, and management tools to help
                you scale your business efficiently.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users2 className="text-white w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                For Restaurant Staff
              </h4>
              <p className="text-sm text-gray-600">
                Simplified order management and workflow tools for a smoother,
                faster service experience.
              </p>
            </div>
          </div>

          {/* CLOSING STATEMENT */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
            <p className="text-lg font-medium text-indigo-700">
              “We’re not just software — we’re your partner in building a thriving
              restaurant business in Ethiopia.”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
