import { User, Shield, Bell, Palette, Globe, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap = {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  ChefHat
};

const settingsOptions = [
  {
    id: 1,
    icon: 'User',
    titleKey: 'profileSettings',
    descriptionKey: 'profileSettingsDesc', 
    buttonKey: 'manageProfile',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    icon: 'Shield',
    titleKey: 'securitySettings',
    descriptionKey: 'securitySettingsDesc',
    buttonKey: 'manageSecurity',
    color: 'bg-green-500'
  },
  {
    id: 3,
    icon: 'Bell',
    titleKey: 'notificationSettings',
    descriptionKey: 'notificationSettingsDesc',
    buttonKey: 'manageNotifications',
    color: 'bg-amber-500'
  },
  {
    id: 4,
    icon: 'ChefHat',
    titleKey: 'kitchenSettings',
    descriptionKey: 'kitchenSettingsDesc',
    buttonKey: 'manageKitchen',
    color: 'bg-orange-500'
  }
];

export default function SettingsView() {
  const { t, i18n } = useTranslation('chef');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t('title')}</h3>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-xl bg-blue-500 flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('language')}</h4>
            <p className="text-gray-600 text-sm">{t('chooseLanguage')}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => changeLanguage('en')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
              i18n.language === 'en' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('english')}
          </button>
          <button
            onClick={() => changeLanguage('am')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
              i18n.language === 'am' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('amharic')}
          </button>
        </div>
      </div>

      {/* Chef Settings Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsOptions.map((option) => {
          const IconComponent = iconMap[option.icon];
          return (
            <div key={option.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${option.color} flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t(option.titleKey)}</h4>
                  <p className="text-gray-600 text-sm mb-4">{t(option.descriptionKey)}</p>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium text-sm transition-colors">
                    {t(option.buttonKey)}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kitchen Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('kitchenPreferences')}</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">{t('autoStockAlert')}</p>
              <p className="text-sm text-gray-500">{t('autoStockAlertDesc')}</p>
            </div>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-600 transition-colors duration-200 ease-in-out">
              <span className="sr-only">{t('autoStockAlert')}</span>
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{t('orderNotifications')}</p>
              <p className="text-sm text-gray-500">{t('orderNotificationsDesc')}</p>
            </div>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-600 transition-colors duration-200 ease-in-out">
              <span className="sr-only">{t('orderNotifications')}</span>
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{t('prepTimeWarnings')}</p>
              <p className="text-sm text-gray-500">{t('prepTimeWarningsDesc')}</p>
            </div>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out">
              <span className="sr-only">{t('prepTimeWarnings')}</span>
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}