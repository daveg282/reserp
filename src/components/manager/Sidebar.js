'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Crown, 
  LogOut, 
  RefreshCw,
  Home,
  Users,
  TrendingUp,
  Package,
  Utensils,
  BarChart3,
  Settings,
  Briefcase,
  DollarSign,
  Users as CustomersIcon,
} from 'lucide-react';

// Define menu sections with subsections
const menuSections = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Dashboard',
    view: 'dashboard',
    hasSubsections: false // Dashboard has no subsections
  },
  {
    id: 'operations',
    icon: Briefcase,
    label: 'Operations',
    view: 'operations',
    subsections: ['tables-reservations', 'orders-service', 'kitchen-operations']
  },
  {
    id: 'staff',
    icon: Users,
    label: 'Staff Management',
    view: 'staff',
    subsections: ['employee-roster', 'scheduling', 'performance', 'payroll']
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory & Supplies',
    view: 'inventory',
    subsections: ['stock-management', 'suppliers', 'recipes-costing']
  },
  {
    id: 'menu',
    icon: Utensils,
    label: 'Menu Management',
    view: 'menu',
   subsections: ['menu-items', 'special-features', 'menu-analytics']
  },
  {
    id: 'financial',
    icon: DollarSign,
    label: 'Financial',
    view: 'financial',
    subsections: ['revenue-tracking', 'expenses', 'profit-loss']
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics & Reports',
    view: 'analytics',
    subsections: ['business-intelligence', 'performance-reports', 'custom-reports']
  },
  {
    id: 'customers',
    icon: CustomersIcon,
    label: 'Customers',
    view: 'customers',
    subsections: ['customer-database', 'feedback-reviews', 'loyalty-program']
  },
   {
    id: 'settings',
    icon: Settings,
    label: 'System & Settings',
    view: 'settings',
    subsections: ['restaurant-settings', 'user-management', 'system-configuration']
  }
];

// Subsection labels mapping
const subsectionLabels = {
  'tables-reservations': 'Tables & Reservations',
  'orders-service': 'Orders & Service',
  'kitchen-operations': 'Kitchen Operations',
  'employee-roster': 'Employee Roster',
  'scheduling': 'Scheduling',
  'performance': 'Performance',
  'payroll': 'Payroll',
  'stock-management': 'Stock Management',
  'suppliers': 'Suppliers',
  'recipes-costing': 'Recipes & Costing',
  'menu-items': 'Menu Items',
  'special-features': 'Special Features',
  'menu-analytics': 'Menu Analytics',
  'revenue-tracking': 'Revenue Tracking',
  'expenses': 'Expenses',
  'profit-loss': 'Profit & Loss',
  'business-intelligence': 'Business Intelligence',
  'performance-reports': 'Performance Reports',
  'custom-reports': 'Custom Reports',
  'customer-database': 'Customer Database',
  'feedback-reviews': 'Feedback & Reviews',
  'loyalty-program': 'Loyalty Program',
  'restaurant-settings': 'Restaurant Settings',
  'user-management': 'User Management',
  'system-configuration': 'System Configuration'
};

export default function Sidebar({ 
  activeView, 
  setActiveView,
  activeSubsection,
  setActiveSubsection,
  sidebarOpen, 
  setSidebarOpen,
  isLoading,
  setIsLoading
}) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const handleSectionClick = (section) => {
    // If it's dashboard (no subsections), just navigate
    if (!section.hasSubsections && !section.subsections) {
      setActiveView(section.view);
      setExpandedSection(null); // Collapse any expanded sections
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }
    
    // For sections with subsections
    if (expandedSection === section.view && sidebarOpen) {
      // If clicking on already expanded section, collapse it
      setExpandedSection(null);
    } else {
      // Expand this section and set as active
      setExpandedSection(section.view);
      setActiveView(section.view);
      
      // Set default subsection (first one)
      if (section.subsections && section.subsections.length > 0) {
        setActiveSubsection(section.subsections[0]);
      }
    }
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSubsectionClick = (sectionView, subsection) => {
    setActiveView(sectionView);
    setActiveSubsection(subsection);
    
    // When clicking a subsection, keep the parent section expanded
    setExpandedSection(sectionView);
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 h-full z-50 overflow-y-auto ${
        sidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-purple-700 sticky top-0 bg-purple-900 z-10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
                <p className="text-xs text-purple-300 mt-1">Bistro Elegante</p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-purple-700 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeView === section.view;
            const isExpanded = expandedSection === section.view;
            const hasSubsections = section.subsections && section.subsections.length > 0;
            
            return (
              <div key={section.id} className="mb-1">
                {/* Main Section Button */}
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'hover:bg-purple-700 text-purple-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="flex-1 text-left font-medium">{section.label}</span>
                    )}
                  </div>
                  
                  {/* Expand/Collapse arrow (only for sections with subsections) */}
                  {sidebarOpen && hasSubsections && (
                    <svg 
                      className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {/* Subsection List (only show if has subsections AND sidebar is open AND section is expanded) */}
                {sidebarOpen && isExpanded && hasSubsections && (
                  <div className="ml-8 mt-1 space-y-1">
                    {section.subsections.map((subsection) => {
                      const isSubsectionActive = activeSubsection === subsection;
                      
                      return (
                        <button
                          key={subsection}
                          onClick={() => handleSubsectionClick(section.view, subsection)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg transition text-sm ${
                            isSubsectionActive
                              ? 'bg-purple-500 text-white'
                              : 'hover:bg-purple-600 text-purple-200'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-3 opacity-70"></div>
                          <span>{subsectionLabels[subsection] || subsection}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-purple-700 space-y-4 sticky bottom-0 bg-purple-900">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">Manager</p>
                <p className="text-xs text-purple-300">Full Access</p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm">{isLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
