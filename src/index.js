// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

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
