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
  CreditCard,
  UserCircle,
  Edit2,
  Save
} from 'lucide-react';

export default function SettingsView() {
  const { t, i18n } = useTranslation('manager');
  const { user: authUser, logout } = useAuth();
  
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

  // State for editable profile info
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (authUser) {
      setProfile(authUser);
      setProfileData({
        first_name: authUser.first_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        username: authUser.username || ''
      });
    }
  }, [authUser]);

  const fetchProfile = async () => {
    try {
      const token = AuthService.getToken();
      if (!token) return;
      
      const data = await authAPI.getProfile(token);
      if (data && data.user) {
        setProfile(data.user);
        setProfileData({
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          email: data.user.email || '',
          username: data.user.username || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = AuthService.getToken();
      const response = await authAPI.updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name
      }, token);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update local profile
        if (response.user) {
          setProfile(response.user);
        }
        
        // Exit edit mode
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
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
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset to original values when canceling
      setProfileData({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || '',
        username: profile?.username || ''
      });
    }
    setIsEditing(!isEditing);
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
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-500 flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('settings.profile')}</h4>
                <p className="text-gray-600 text-sm">{t('settings.profileDescription')}</p>
              </div>
            </div>
            <button
              onClick={toggleEditMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition ${
                isEditing 
                  ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name - Editable */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.firstName')}
                </label>
                <div className="flex items-center">
                  <UserCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-gray-900"
                      placeholder="First Name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profileData.first_name || 'Not set'}</p>
                  )}
                </div>
              </div>
              
              {/* Last Name - Editable */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.lastName')}
                </label>
                <div className="flex items-center">
                  <UserCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-gray-900"
                      placeholder="Last Name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profileData.last_name || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Username - Read Only */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-500">{t('settings.username')}</p>
              </div>
              <p className="font-medium text-gray-900 text-lg">{profileData.username || 'N/A'}</p>
            </div>
            
            {/* Email - Read Only */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-500">{t('settings.email')}</p>
              </div>
              <p className="font-medium text-gray-900 text-lg">{profileData.email || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role - Read Only */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500">{t('settings.role')}</p>
                </div>
                <p className="font-medium text-gray-900 text-lg capitalize">{profile?.role || 'Manager'}</p>
              </div>
              
              {/* Member Since - Read Only */}
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

            {/* Save Button (only shows in edit mode) */}
            {isEditing && (
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('settings.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {t('settings.saveProfile')}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200  text-blac">
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
                  className="w-full pl-10 pr-10 px-4 py-3  text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              <div className="relative text-black">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 px-4 py-3  text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  className="w-full pl-10 pr-10 px-4 py-3 border  text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                disabled={isSaving}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving ? (
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