'use client';

export default function SettingsView({ resetDemo, isDemoMode, setIsDemoMode }) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">System Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Demo Controls */}
          <div className="space-y-4 lg:space-y-6">
            <h4 className="font-semibold text-gray-900 text-lg">Demo Controls</h4>
            <div className="space-y-3">
              <button 
                onClick={resetDemo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm lg:text-base"
              >
                Reset Demo Data
              </button>
              <button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`w-full py-3 rounded-xl font-semibold text-sm lg:text-base ${
                  isDemoMode 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isDemoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-4 lg:space-y-6">
            <h4 className="font-semibold text-gray-900 text-lg">System Information</h4>
            <div className="space-y-3 text-sm text-black">
              <div className="flex justify-between">
                <span className="text-gray-600">Restaurant Name:</span>
                <span className="font-semibold">Bistro Elegante</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">POS Version:</span>
                <span className="font-semibold">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pager System:</span>
                <span className="font-semibold">Connected (20 units)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-semibold">Today, 14:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}