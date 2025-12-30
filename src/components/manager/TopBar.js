'use client';
import { Menu, Search, X, Download, Calendar } from 'lucide-react';

export default function TopBar({
  activeView,
  sidebarOpen,
  setSidebarOpen,
  timeRange,
  setTimeRange,
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch,
  isLoading = false,
  onGenerateReport
}) {
  const viewTitles = {
    dashboard: 'Manager Dashboard',
    staff: 'Staff Management',
    performance: 'Performance Analytics',
    inventory: 'Inventory Overview',
    menu: 'Menu Analytics',
    reports: 'Business Reports',
    settings: 'System Settings'
  };

  const handleExport = async () => {
    if (activeView === 'dashboard' && onGenerateReport) {
      try {
        const report = await onGenerateReport();
        if (report) {
          console.log('Report generated for export:', report);
          alert('Report exported successfully!');
        }
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export report');
      }
    } else {
      alert('Export functionality coming soon!');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {viewTitles[activeView]}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Time Range Selector - Only for dashboard */}
          {activeView === 'dashboard' && (
            <div className="hidden lg:flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-0 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
                disabled={isLoading}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          )}

        
        </div>
      </div>
    </div>
  );
}