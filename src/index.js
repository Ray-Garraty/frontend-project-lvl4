// @ts-check
import i18next from 'i18next';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import app from './app/index.jsx';
import '../assets/application.scss';
import { en, ru } from './app/translations.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

i18next.init({
  lng: 'ru',
  debug: true,
  resources: { en, ru },
}).then(() => {
  app();
});
