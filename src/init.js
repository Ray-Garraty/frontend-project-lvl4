import i18next from 'i18next';
import app from './app/index.jsx';
import { en, ru } from './app/translations.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    resources: { en, ru },
  });
};
