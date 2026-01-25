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
    id: 'menu',
    icon: Utensils,
    label: 'Menu Management',
    view: 'menu',
  },
  {
    id: 'operations',
    icon: Briefcase,
    label: 'Operations',
    view: 'operations',
    subsections: ['tables-reservations', 'orders-service', 'kitchen-operations']
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory & Supplies',
    view: 'inventory',
    subsections: ['stock-management', 'suppliers']
  },
  {
    id: 'financial',
    icon: DollarSign,
    label: 'Financial',
    view: 'financial',
    subsections: ['profit-loss', 'vat-report', 'financial-summary']
  },
  {
    id: 'settings',
    icon: Settings,
    label:' System & Settings',
    view: 'settings',
    subsections: ['user-management', 'restaurant-settings']
  }
];

// Subsection labels mapping
const subsectionLabels = {
  'tables-reservations': 'Tables & Reservations',
  'orders-service': 'Orders & Service',
  'kitchen-operations': 'Kitchen Operations',
  'stock-management': 'Stock Management',
  'suppliers': 'Suppliers',
  'profit-loss': 'Profit & Loss',
  'vat-report': 'VAT Report',
  'financial-summary': 'Financial Summary',
  'daily-reports': 'Daily Reports',
  'performance-reports': 'Performance Reports',
  'financial-reports': 'Financial Reports',
  'restaurant-settings': 'Restaurant Settings',
  'user-management': 'User Management'
};

// Mapping of views to their default subsections
const viewToSubsectionMap = {
  'stock': 'stock-management',
  'suppliers': 'suppliers',
  'recipes': 'recipes-costing',
  'operations': 'tables-reservations',
  'settings': 'restaurant-settings',
  'financial': 'financial-summary',
  'reports': 'daily-reports'
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
      setActiveSubsection(null);
      setExpandedSection(null);
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }
    
    // Toggle expansion
    if (expandedSection === section.view && sidebarOpen) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section.view);
      
      if (section.subsections && section.subsections.length > 0) {
        // Set the first subsection as active
        const firstSubsection = section.subsections[0];
        setActiveSubsection(firstSubsection);
        
        // Determine which view to set based on the subsection
        let viewToSet = section.view;
        
        // Map subsection to view
        if (firstSubsection === 'stock-management') viewToSet = 'stock';
        else if (firstSubsection === 'suppliers') viewToSet = 'suppliers';
        else if (firstSubsection === 'profit-loss' || firstSubsection === 'vat-report' || firstSubsection === 'financial-summary') viewToSet = 'financial';
        else if (firstSubsection === 'user-management' || firstSubsection === 'restaurant-settings') viewToSet = 'settings';
        else if (firstSubsection === 'tables-reservations' || firstSubsection === 'orders-service' || firstSubsection === 'kitchen-operations') viewToSet = 'operations';
        
        setActiveView(viewToSet);
      } else {
        setActiveView(section.view);
      }
    }
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSubsectionClick = (sectionView, subsection) => {
    // Determine which view to set based on the subsection
    let viewToSet = sectionView;
    
    // Map subsection to view
    if (subsection === 'stock-management') viewToSet = 'stock';
    else if (subsection === 'suppliers') viewToSet = 'suppliers';
    else if (subsection === 'profit-loss' || subsection === 'vat-report' || subsection === 'financial-summary') viewToSet = 'financial';
    else if (subsection === 'user-management' || subsection === 'restaurant-settings') viewToSet = 'settings';
    else if (subsection === 'tables-reservations' || subsection === 'orders-service' || subsection === 'kitchen-operations') viewToSet = 'operations';
    
    setActiveView(viewToSet);
    setActiveSubsection(subsection);
    setExpandedSection(sectionView);
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Helper function to determine if a section is active
  const isSectionActive = (section) => {
    // If section has no subsections, check if activeView matches
    if (!section.subsections || section.subsections.length === 0) {
      return activeView === section.view;
    }
    
    // For sections with subsections, check if current view belongs to this section
    if (section.view === 'inventory') {
      // Inventory section is active if we're in stock or suppliers views
      return activeView === 'stock' || activeView === 'suppliers';
    }
    else if (section.view === 'financial') {
      // Financial section is active if we're in financial view
      return activeView === 'financial';
    }
    else if (section.view === 'settings') {
      // Settings section is active if we're in settings view
      return activeView === 'settings';
    }
    else if (section.view === 'operations') {
      // Operations section is active if we're in operations view
      return activeView === 'operations';
    }
    
    return false;
  };

  // Helper function to determine if a subsection is active
  const isSubsectionActive = (subsection) => {
    // First, if we have an activeSubsection, check exact match
    if (activeSubsection) {
      return activeSubsection === subsection;
    }
    
    // If no activeSubsection, check if the current view maps to this subsection
    const mappedSubsection = viewToSubsectionMap[activeView];
    if (mappedSubsection === subsection) {
      return true;
    }
    
    // Special mapping for inventory views
    if (activeView === 'stock' && subsection === 'stock-management') return true;
    if (activeView === 'suppliers' && subsection === 'suppliers') return true;
    
    return false;
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
            const isActive = isSectionActive(section);
            const isExpanded = expandedSection === section.view || isActive;
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
                      const isSubActive = isSubsectionActive(subsection);
                      
                      return (
                        <button
                          key={subsection}
                          onClick={() => handleSubsectionClick(section.view, subsection)}
                          className={`w-full flex items-center px-4 py-2 rounded-lg transition text-sm ${
                            isSubActive
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