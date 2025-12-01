import FeatureCard from '../ui/FeatureCard';

export default function Features() {
  const features = [
    {
      title: "Smart Order Management",
      description: "Streamline your order workflow with real-time tracking from placement to completion. Perfect coordination between front and back of house.",
      items: ["Mobile table-side ordering", "Live order status updates", "Special requests handling", "Easy order modifications"],
      gradientFrom: "from-blue-50",
      gradientTo: "to-indigo-50",
      borderColor: "border-blue-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: "Kitchen Display System",
      description: "Digital order management for your kitchen team with real-time updates, preparation timers, and smart priority handling.",
      items: ["Live order queue display", "Preparation time tracking", "Chef notifications & alerts", "Smart priority management"],
      gradientFrom: "from-emerald-50",
      gradientTo: "to-green-50",
      borderColor: "border-emerald-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "POS & Payment System",
      description: "Complete point of sale solution with multiple payment options, instant receipts, and secure transaction processing.",
      items: ["Split bill & group payments", "Digital receipt generation", "Real-time sales analytics", "Tax & discount management"],
      gradientFrom: "from-purple-50",
      gradientTo: "to-violet-50",
      borderColor: "border-purple-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Inventory Management",
      description: "Automated stock tracking with smart alerts and consumption analytics to optimize inventory and minimize waste.",
      items: ["Automatic stock updates", "Low inventory alerts", "Supplier management", "Waste tracking & reports"],
      gradientFrom: "from-amber-50",
      gradientTo: "to-orange-50",
      borderColor: "border-amber-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m-4-5v5m4-5v5m4-5v5" />
        </svg>
      )
    },
    {
      title: "Analytics & Reporting",
      description: "Comprehensive business intelligence with detailed sales analytics, performance metrics, and actionable insights.",
      items: ["Sales performance dashboards", "Staff productivity analytics", "Profit margin tracking", "Customer insights"],
      gradientFrom: "from-rose-50",
      gradientTo: "to-pink-50",
      borderColor: "border-rose-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Customer Management",
      description: "Build lasting customer relationships with loyalty programs, feedback systems, and personalized service features.",
      items: ["Loyalty & rewards programs", "Feedback collection", "Reservation management", "Customer preferences"],
      gradientFrom: "from-indigo-50",
      gradientTo: "to-blue-50",
      borderColor: "border-indigo-100",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete Solution
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything Your Restaurant Needs
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From front-of-house to back-of-house operations, manage every aspect of your restaurant with our comprehensive platform designed for Ethiopian restaurants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

       
      </div>
    </section>
  );
}