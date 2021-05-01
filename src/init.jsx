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
import reducer from './slices/index.js';
import locales from './index.js';
import Slack from './components/Slack.jsx';
import LoginPage from './components/LoginPage.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import SignupPage from './components/SignupPage.jsx';
import { activateChannel } from './slices/uiState.js';
import {
  addMessageSuccess,
  addChannelSuccess,
  removeChannelSuccess,
  renameChannelSuccess,
} from './slices/chat.js';

const isProduction = process.env.NODE_ENV === 'production';
const domain = isProduction ? '' : 'http://localhost:5000';
const socket = io(domain);
export const SocketContext = React.createContext();
const AuthContext = React.createContext();
const user = JSON.parse(window.localStorage.getItem('user'));
const store = configureStore({ reducer });

const initializeChannels = async (token) => axios
  .get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } })
  .then((res) => {
    const { currentChannelId, channels, messages } = res.data;
    channels.forEach((channel) => {
      store.dispatch(addChannelSuccess({ ...channel, messagesIds: [] }));
    });
    store.dispatch(activateChannel(currentChannelId));
    messages.forEach((msg) => {
      store.dispatch(addMessageSuccess(msg));
    });
  })
  .catch((err) => console.log('Ошибка при запросе к серверу на получение списка каналов и сообщений: ', err));

export default async () => {
  socket.on('newChannel', (data) => {
    store.dispatch(addChannelSuccess({ ...data, messagesIds: [] }));
  });
  socket.on('newMessage', (data) => {
    store.dispatch(addMessageSuccess(data));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannelSuccess(id));
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(renameChannelSuccess(data));
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
