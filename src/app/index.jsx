import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from './reactRouter.jsx';
import store from './store.js';

export default () => {
  const container = document.querySelector('#chat');
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    container,
  );
};
