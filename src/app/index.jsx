import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Slack from '../components.jsx';

export default () => {
  const container = document.querySelector('#chat');

  ReactDOM.render(
    <Provider store={store}>
      <Slack />
    </Provider>,
    container,
  );
};
