'use client';

import { useState } from 'react';
import { 
  User,
  Building,
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Percent,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Bell,
  Palette,
  Shield,
  Key
} from 'lucide-react';

export default function RestaurantSettings({ 
  user,
  onRefresh,
  isLoading = false 
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Restaurant and user settings data
  const [settingsData, setSettingsData] = useState({
    // User Profile
    name: user?.name || 'Manager Name',
    email: user?.email || 'manager@restaurant.com',
    phone: '+1 (555) 123-4567',
    position: 'Restaurant Manager',
    
    // Restaurant Details
    restaurantName: 'Bistro Elegante',
    restaurantAddress: '123 Main Street, City, Country',
    restaurantPhone: '+1 (555) 987-6543',
    restaurantEmail: 'info@bistroelegante.com',
    website: 'www.bistroelegante.com',
    taxId: 'TAX-12345678',
    
    // Business Hours
    openingTime: '09:00',
    closingTime: '23:00',
    daysOpen: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    
    // Pricing & Tax
    currency: 'ETB',
    taxRate: 15,
    serviceCharge: 10,
    acceptTips: true,
    tippingPolicy: 'optional',
    
    // Personal Preferences
    language: 'en',
    theme: 'light',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    notifications: true,
    emailAlerts: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'restaurant', label: 'Restaurant', icon: Building },
    { id: 'business', label: 'Business Hours', icon: Clock },
    { id: 'pricing', label: 'Pricing & Tax', icon: DollarSign },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleInputChange = (field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDayToggle = (day) => {
    setSettingsData(prev => {
      const daysOpen = [...prev.daysOpen];
      if (daysOpen.includes(day)) {
        return { ...prev, daysOpen: daysOpen.filter(d => d !== day) };
      } else {
        return { ...prev, daysOpen: [...daysOpen, day] };
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In reality, you would call your API here
      // await authAPI.updateProfile(settingsData, token);
      
      console.log('Saving settings:', settingsData);
      
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
      
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleReset = () => {
    setSettingsData({
      name: user?.name || 'Manager Name',
      email: user?.email || 'manager@restaurant.com',
      phone: '+1 (555) 123-4567',
      position: 'Restaurant Manager',
      restaurantName: 'Bistro Elegante',
      restaurantAddress: '123 Main Street, City, Country',
      restaurantPhone: '+1 (555) 987-6543',
      restaurantEmail: 'info@bistroelegante.com',
      website: 'www.bistroelegante.com',
      taxId: 'TAX-12345678',
      openingTime: '09:00',
      closingTime: '23:00',
      daysOpen: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      currency: 'ETB',
      taxRate: 15,
      serviceCharge: 10,
      acceptTips: true,
      tippingPolicy: 'optional',
      language: 'en',
      theme: 'light',
      timezone: 'Africa/Addis_Ababa',
      dateFormat: 'DD/MM/YYYY',
      notifications: true,
      emailAlerts: true,
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settingsData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={settingsData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settingsData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <button className="flex items-center justify-center px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition">
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'restaurant':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={settingsData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={settingsData.restaurantAddress}
                    onChange={(e) => handleInputChange('restaurantAddress', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Phone
                  </label>
                  <input
                    type="tel"
                    value={settingsData.restaurantPhone}
                    onChange={(e) => handleInputChange('restaurantPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Email
                  </label>
                  <input
                    type="email"
                    value={settingsData.restaurantEmail}
                    onChange={(e) => handleInputChange('restaurantEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={settingsData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    value={settingsData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={settingsData.openingTime}
                    onChange={(e) => handleInputChange('openingTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={settingsData.closingTime}
                    onChange={(e) => handleInputChange('closingTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Days Open</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {[
                  { id: 'monday', label: 'Monday' },
                  { id: 'tuesday', label: 'Tuesday' },
                  { id: 'wednesday', label: 'Wednesday' },
                  { id: 'thursday', label: 'Thursday' },
                  { id: 'friday', label: 'Friday' },
                  { id: 'saturday', label: 'Saturday' },
                  { id: 'sunday', label: 'Sunday' }
                ].map((day) => (
                  <button
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`px-3 py-3 rounded-lg border-2 font-medium transition ${
                      settingsData.daysOpen.includes(day.id)
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settingsData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ETB">ETB - Ethiopian Birr</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settingsData.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settingsData.serviceCharge}
                    onChange={(e) => handleInputChange('serviceCharge', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center justify-between md:col-span-2">
                  <div>
                    <p className="font-medium text-gray-900">Accept Tips</p>
                    <p className="text-sm text-gray-600">Allow customers to leave tips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.acceptTips}
                      onChange={() => handleToggle('acceptTips')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                {settingsData.acceptTips && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipping Policy
                    </label>
                    <select
                      value={settingsData.tippingPolicy}
                      onChange={(e) => handleInputChange('tippingPolicy', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="optional">Optional</option>
                      <option value="suggested">Suggested Amounts</option>
                      <option value="included">Included in Bill</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settingsData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settingsData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settingsData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Africa/Addis_Ababa">Addis Ababa (GMT+3)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={settingsData.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Notifications</p>
                    <p className="text-sm text-gray-600">Receive system notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.notifications}
                      onChange={() => handleToggle('notifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Alerts</p>
                    <p className="text-sm text-gray-600">Receive important alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.emailAlerts}
                      onChange={() => handleToggle('emailAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.twoFactorAuth}
                      onChange={() => handleToggle('twoFactorAuth')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={settingsData.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value) || 30)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Automatically log out after inactivity</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Login Alerts</p>
                    <p className="text-sm text-gray-600">Get notified of new logins to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.loginAlerts}
                      onChange={() => handleToggle('loginAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurant & Profile Settings</h2>
          <p className="text-gray-600 mt-1">Manage your profile and restaurant configuration</p>
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
            onClick={handleSave}
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

      {/* User Info Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-gray-900">{settingsData.name}</h3>
            <p className="text-sm text-gray-600">{settingsData.position} • {settingsData.restaurantName}</p>
            <p className="text-xs text-gray-500 mt-1">{settingsData.email} • {settingsData.phone}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition ${
                  isActive
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}