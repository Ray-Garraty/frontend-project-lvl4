import React from 'react';
import axios from 'axios';
import { get } from 'lodash';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import reducer, { actions } from './slices/index.js';
import Slack from './components/Slack.jsx';
import locales from './translations/index.js';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import { SocketContext, AuthContext } from './contexts.js';

const isProduction = process.env.NODE_ENV === 'production';
const domain = isProduction ? '' : 'http://localhost:5000';
const socket = io(domain);
const user = JSON.parse(window.localStorage.getItem('user'));
const store = configureStore({ reducer });

const initializeChannels = async (token) => axios
  .get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } })
  .then((res) => {
    const { currentChannelId, channels, messages } = res.data;
    channels.forEach((channel) => {
      store.dispatch(actions.addChannelSuccess(channel));
    });
    store.dispatch(actions.activateChannel(currentChannelId));
    messages.forEach((msg) => {
      store.dispatch(actions.addMessageSuccess(msg));
    });
  })
  .catch((err) => console.log('Ошибка при запросе к серверу на получение списка каналов и сообщений: ', err));

export default async () => {
  socket.on('newChannel', (data) => {
    store.dispatch(actions.addChannelSuccess(data));
  });
  socket.on('newMessage', (data) => {
    store.dispatch(actions.addMessageSuccess(data));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannelSuccess(id));
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(actions.renameChannelSuccess(data));
  });

  if (user) {
    await initializeChannels(user.token);
  }

  const MainComponent = () => (
    <AuthContext.Consumer value={user}>
      {(value) => {
        const token = get(value, 'token', null);
        console.log('токен: ', token);
        return (
          <Router>
            <Switch>
              <Route exact path="/">
                {token ? <Slack /> : <Redirect to="/login" />}
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/signup">
                <SignupPage />
              </Route>
              <Route>
                <PageNotFound />
              </Route>
            </Switch>
          </Router>
        );
      }}
    </AuthContext.Consumer>
  );

  await i18next.init({ lng: 'ru', resources: locales });

  const container = document.querySelector('#chat');
  ReactDOM.render(
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <AuthContext.Provider value={user}>
          <MainComponent />
        </AuthContext.Provider>
      </SocketContext.Provider>
    </Provider>,
    container,
  );
};
