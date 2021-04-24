import React from 'react';
import i18next from 'i18next';
import { isNil } from 'lodash';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector, Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import store from './store.js';
import en from './translations/en.js';
import ru from './translations/ru.js';
import Slack from './components/Slack.jsx';
import LoginPage from './components/LoginPage.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import SignupPage from './components/SignupPage.jsx';
import {
  addMessageSuccess,
  addChannelSuccess,
  removeChannelSuccess,
  renameChannelSuccess,
} from './slices/chatSlice.js';

const isProduction = process.env.NODE_ENV === 'production';
const domain = isProduction ? '' : 'http://localhost:5000';
export const socket = io(domain);

export default () => {
  const MainComponent = () => {
    const dispatch = useDispatch();
    const userAuthToken = useSelector((state) => state.authState.activeUser.token);
    const isLoggedIn = !isNil(userAuthToken);
    socket.on('newChannel', (data) => {
      // console.log('Данные, поступившие при оповещении сокетом о создании нового канала: ', data);
      dispatch(addChannelSuccess({ ...data, messagesIds: [] }));
    });
    socket.on('newMessage', (data) => {
      dispatch(addMessageSuccess(data));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannelSuccess(id));
    });
    socket.on('renameChannel', (data) => {
      dispatch(renameChannelSuccess(data));
    });
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
  // i18nextInstance почему-то не работает. Оставлю пока просто i18next.init(), с ним всё нормально
  i18next
    .init({
      lng: 'ru',
      resources: { en, ru },
    })
    .then(() => {
      const container = document.querySelector('#chat');
      ReactDOM.render(
        <Provider store={store}>
          <MainComponent />
        </Provider>,
        container,
      );
    });
};
