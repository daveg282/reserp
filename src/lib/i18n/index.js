import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from './locales/en/common.json';
import enWaiter from './locales/en/waiter.json';
import enChef from './locales/en/chef.json'; // Add this

// Amharic translations
import amCommon from './locales/am/common.json';
import amWaiter from './locales/am/waiter.json';
import amChef from './locales/am/chef.json'; // Add this

const resources = {
  en: {
    common: enCommon,
    waiter: enWaiter,
    chef: enChef, // Add this
  },
  am: {
    common: amCommon,
    waiter: amWaiter,
    chef: amChef, // Add this
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // Enable debug to see what's happening
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });

export default i18n;