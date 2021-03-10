import React from 'react';
import ReactDOM from 'react-dom';
import faker from 'faker';
import Cookies from 'js-cookie';
import { Provider } from 'react-redux';
import store from './store';
import Slack, { AuthorContext } from '../components.jsx';

const author = Cookies.get('userName') || faker.name.findName();
Cookies.set('userName', author, { expires: 365 });

export default () => {
  const container = document.querySelector('#chat');

  ReactDOM.render(
    <AuthorContext.Provider value={author}>
      <Provider store={store}>
        <Slack />
      </Provider>
    </AuthorContext.Provider>,
    container,
  );
};
