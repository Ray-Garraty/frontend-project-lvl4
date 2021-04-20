import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { isNil } from 'lodash';
import { useSelector } from 'react-redux';
import Slack from './primaryComponents.jsx';
import { LoginPage, SignupPage, PageNotFound } from './secondaryComponents.jsx';

export const AuthContext = React.createContext(false);

const App = () => {
  const userAuthToken = useSelector((state) => state.authState.activeUser.token);
  const isLoggedIn = !isNil(userAuthToken);
  // console.log('Токен, сохранённый в браузере: ', userAuthToken);
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

export default App;
