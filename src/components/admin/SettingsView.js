import { Settings, Shield, Database } from 'lucide-react';
import PageHeader from './PageHeader';

export default function SettingsView({ isDemoMode, setIsDemoMode, resetDemo }) {
  const handleSaveChanges = () => {
    console.log('Save changes clicked');
    // Implementation for saving settings
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="System Settings"
        actions={[
          {
            label: 'Save Changes',
            onClick: handleSaveChanges,
            variant: 'primary'
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>General Settings</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
              <input 
                type="text" 
                defaultValue="Bistro Elegante"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                <option>ETB - Ethiopian Birr</option>
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                <option>Africa/Addis_Ababa</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Backup</p>
                <p className="text-sm text-gray-600">Last backup: Today, 02:00 AM</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Backup Now
              </button>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Demo Controls</span>
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <p className="font-medium text-gray-900">Demo Mode</p>
              <p className="text-sm text-gray-600">Simulate real-time restaurant operations</p>
            </div>
            <div className="flex space-x-3">
              {isDemoMode ? (
                <button 
                  onClick={() => setIsDemoMode(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  Exit Demo Mode
                </button>
              ) : (
                <button 
                  onClick={() => setIsDemoMode(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  Start Demo Mode
                </button>
              )}
              <button 
                onClick={resetDemo}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}