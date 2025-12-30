import { Menu, Bell } from 'lucide-react';
import SearchBar from './SearchBar';
import { VIEW_TITLES } from '@/utils/constants';

export default function TopBar({
  activeView,
  setSidebarOpen,
  notifications,
  timeRange,
  setTimeRange,
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch,
  isDemoMode,
  setIsDemoMode
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Left Section: Mobile Menu + Page Title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {VIEW_TITLES[activeView]}
            </h1>
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

        {/* Right Section: Search & Controls */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
          
          {!showSearch && (
            <>
              {/* Notifications */}
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Time Range Selector */}
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-black hidden lg:block"
                aria-label="Select time range"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Demo Mode Toggle */}
              <div className="hidden lg:flex space-x-2">
                {isDemoMode ? (
                  <button 
                    onClick={() => setIsDemoMode(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium transition"
                  >
                    Exit Demo
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsDemoMode(true)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium transition"
                  >
                    Start Demo
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}