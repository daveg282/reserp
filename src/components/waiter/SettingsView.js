'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';
import { authAPI } from '@/lib/api';
import AuthService from '@/lib/auth-utils';
import { 
  User, 
  Shield, 
  Lock, 
  Mail, 
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Key,
  Calendar,
  Briefcase,
  LogOut
} from 'lucide-react';

export default function SettingsView() {
  const { t, i18n } = useTranslation('waiter');
  const { user, logout } = useAuth();
  
  // State for profile
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for show/hide passwords
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = AuthService.getToken();
      if (!token) return;
      
      const data = await authAPI.getProfile(token);
      if (data && data.user) {
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    
    if (!passwordData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });
      
      const token = AuthService.getToken();
      const response = await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        token
      );
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Auto-logout after password change for security
        setTimeout(() => {
          alert('Please login again with your new password');
          logout();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h3>
          <p className="text-gray-600 mt-1">{t('settings.subtitle')}</p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`rounded-xl p-4 flex items-center ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
          )}
          <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </span>
          <button 
            onClick={() => setMessage({ type: '', text: '' })} 
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section - Display Only */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500 flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('settings.profile')}</h4>
              <p className="text-gray-600 text-sm">{t('settings.profileDescription')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500">{t('settings.username')}</p>
                </div>
                <p className="font-medium text-gray-900 text-lg">{profile?.username || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500">{t('settings.role')}</p>
                </div>
                <p className="font-medium text-gray-900 text-lg capitalize">{profile?.role || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-500">{t('settings.email')}</p>
              </div>
              <p className="font-medium text-gray-900 text-lg">{profile?.email || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-500">{t('settings.memberSince')}</p>
              </div>
              <p className="font-medium text-gray-900 text-lg">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-red-500 flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('settings.security')}</h4>
              <p className="text-gray-600 text-sm">{t('settings.securityDescription')}</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.currentPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.newPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('settings.passwordRequirements')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('settings.updating')}
                  </>
                ) : (
                  t('settings.changePassword')
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <LogOut className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900">{t('settings.session')}</p>
                </div>
                <p className="text-sm text-gray-500">{t('settings.sessionDescription')}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('settings.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-xl bg-green-500 flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('settings.language')}</h4>
            <p className="text-gray-600 text-sm">{t('settings.chooseLanguage')}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => changeLanguage('en')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors flex items-center justify-center ${
              i18n.language === 'en' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('am')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors flex items-center justify-center ${
              i18n.language === 'am' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            አማርኛ
          </button>
        </div>
      </div>
    </div>
  );
}