// @ts-check
import gon from 'gon';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import app from './app/index.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

app(gon);
