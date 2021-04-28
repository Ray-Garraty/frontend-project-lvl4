import React from 'react';
import i18next from 'i18next';
import { isNil } from 'lodash';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { useSelector, Provider } from 'react-redux';
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
const store = configureStore({ reducer });

export default () => {
  socket.on('newChannel', (data) => {
    // console.log('Данные, поступившие при оповещении сокетом о создании нового канала: ', data);
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
  const MainComponent = () => {
    const userAuthToken = useSelector((state) => state.authState.activeUser.token);
    const isLoggedIn = !isNil(userAuthToken);
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? <Slack /> : <Redirect to="/login" />}
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
  };
  i18next
    .init({
      lng: 'ru',
      resources: locales,
    })
    .then(() => {
      const container = document.querySelector('#chat');
      ReactDOM.render(
        <Provider store={store}>
          <SocketContext.Provider value={socket}>
            <MainComponent />
          </SocketContext.Provider>
        </Provider>,
        container,
      );
    });
};
