'use client';
import { useState } from 'react';
import { 
  Menu, 
  Crown, 
  LogOut, 
  RefreshCw,
  Home,
  Users,
  Package,
  Utensils,
  BarChart3,
  Settings,
  Briefcase,
  DollarSign,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

// Define menu sections with subsections
const menuSections = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Dashboard',
    view: 'dashboard',
    hasSubsections: false
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
    subsections: ['employee-roster', 'payroll']
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
    id: 'settings',
    icon: Settings,
    label: 'System & Settings',
    view: 'settings',
    subsections: ['restaurant-settings', 'user-management']
  }
];

// Subsection labels mapping
const subsectionLabels = {
  'tables-reservations': 'Tables & Reservations',
  'orders-service': 'Orders & Service',
  'kitchen-operations': 'Kitchen Operations',
  'employee-roster': 'Employee Roster',
  'payroll': 'Payroll',
  'stock-management': 'Stock Management',
  'suppliers': 'Suppliers',
  'recipes-costing': 'Recipes & Costing',
  'menu-items': 'Menu Items',
  'revenue-tracking': 'Revenue Tracking',
  'expenses': 'Expenses',
  'profit-loss': 'Profit & Loss',
  'business-intelligence': 'Business Intelligence',
  'performance-reports': 'Performance Reports',
  'custom-reports': 'Custom Reports',
  'restaurant-settings': 'Restaurant Settings',
  'user-management': 'User Management'
};

export default function ManagerSidebar({ 
  activeView, 
  setActiveView,
  activeSubsection,
  setActiveSubsection,
  sidebarOpen, 
  setSidebarOpen,
  isLoading,
  handleLogout
}) {
  const [expandedSection, setExpandedSection] = useState(null);
  const { user, logout } = useAuth(); 

  const userName = user?.name || 'Manager';
  const userEmail = user?.email || 'manager@bistroelegante.com';
  const userRole = user?.role || 'Manager';

  const handleLogoutClick = async () => {
    try {
      if (handleLogout) {
        await handleLogout();
      } else if (logout) {
        await logout();
      } else {
        console.log('Logging out...');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSectionClick = (section) => {
    if (!section.hasSubsections && !section.subsections) {
      setActiveView(section.view);
      setExpandedSection(null);
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }
    
    if (expandedSection === section.view && sidebarOpen) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section.view);
      setActiveView(section.view);
      
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
    setExpandedSection(sectionView);
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 h-full z-50 overflow-y-auto ${
        sidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeView === section.view;
            const isExpanded = expandedSection === section.view;
            const hasSubsections = section.subsections && section.subsections.length > 0;
            
            return (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="flex-1 text-left font-medium">{section.label}</span>
                    )}
                  </div>
                  
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
                
                {sidebarOpen && isExpanded && hasSubsections && (
                  <div className="ml-10 mt-2 space-y-1">
                    {section.subsections.map((subsection) => {
                      const isSubsectionActive = activeSubsection === subsection;
                      
                      return (
                        <button
                          key={subsection}
                          onClick={() => handleSubsectionClick(section.view, subsection)}
                          className={`w-full flex items-center px-4 py-2 rounded-lg transition text-sm ${
                            isSubsectionActive
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-700 text-gray-200'
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
        <div className="p-4 border-t border-gray-700 space-y-4 sticky bottom-0 bg-gray-900">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs text-gray-300 truncate">
                  {userEmail}
                </p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          {sidebarOpen && (
            <button
              onClick={handleLogoutClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-200"
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