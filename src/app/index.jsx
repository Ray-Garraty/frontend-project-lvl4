import React from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import store from './store';
import Slack from '../components.jsx';

export default () => {
  const container = document.querySelector('#chat');

  const socket = io();
  socket.on('connection', () => console.log('A new user connected!'));

  ReactDOM.render(
    <Provider store={store}>
      <Slack />
    </Provider>,
    container,
  );
};
