// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import en from './translations/en.js';
import ru from './translations/ru.js';
import '../assets/application.scss';
import runApp from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const locales = { en, ru };
export default locales;

runApp();
