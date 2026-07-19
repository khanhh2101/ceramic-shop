import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import vi from './locales/vi/translation';
import en from './locales/en/translation';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en }
    },
    fallbackLng: 'en', // Default to English if browser lang is unknown
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // cache user language on
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
