import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import uk from '@/locales/uk.json';

type MessageSchemaEN = typeof en;
type MessageSchemaRU = typeof ru;
type MessageSchemaUK = typeof uk;

export const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: {
    en: en as MessageSchemaEN,
    ru: ru as MessageSchemaRU,
    uk: uk as MessageSchemaUK,
  },
});
