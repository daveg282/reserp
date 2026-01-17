'use client';

import { useState } from 'react';
import { 
  User,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Key,
  Phone,
  Mail
} from 'lucide-react';

export default function SettingsView({ 
  user,
  onRefresh,
  isLoading = false 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Manager profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Validate password if changing
      if (showPasswordFields) {
        if (!profileData.currentPassword) {
          throw new Error('Current password is required');
        }
        if (profileData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In reality, you would call your API here
      // await authAPI.updateProfile(profileData, token);
      
      console.log('Saving profile:', profileData);
      
      // Clear password fields after successful save
      if (showPasswordFields) {
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordFields(false);
      }
      
      setSaveMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleReset = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordFields(false);
    setSaveMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600 mt-1">Manage your personal information and security</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleReset}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-xl ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            )}
            <p className={`font-medium ${
              saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {saveMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 sm:mb-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div className="sm:ml-6">
              <h3 className="text-xl font-bold text-gray-900">{profileData.name || 'Manager Name'}</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {profileData.email || 'manager@restaurant.com'}
                </div>
                {profileData.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {profileData.phone}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Role: {user?.role || 'Manager'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your.email@restaurant.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Change Password
            </h3>
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showPasswordFields
                  ? 'bg-red-100 hover:bg-red-200 text-red-700'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          
          {showPasswordFields && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Re-enter your new password"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Both passwords must match
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Password Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${profileData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least 6 characters long
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${profileData.newPassword === profileData.confirmPassword && profileData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Both passwords match
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${profileData.currentPassword.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Current password provided
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Account Security Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Last Login</p>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600">
                For additional security, contact your system administrator to enable two-factor authentication or modify advanced security settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}