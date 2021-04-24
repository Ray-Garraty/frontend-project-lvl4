import React from 'react';
import axios from 'axios';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import cn from 'classnames';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import routes from '../routes.js';
import { login, setUserStatus } from '../slices/authSlice.js';
import { activateChannel } from '../slices/uiStateSlice.js';
import { addChannelSuccess, addMessageSuccess } from '../slices/chatSlice.js';

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isUserInvalid = useSelector((state) => state.authState.activeUser.status === 'invalid');
  const inputClassNames = cn('form-control', { 'is-invalid': isUserInvalid });
  return (
    <div className="d-flex flex-column h-100">
      <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
        <a className="mr-auto navbar-brand" href="/">Hexlet Chat</a>
      </nav>
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={({ username, password }) => {
          const errors = {};
          if (!username) {
            errors.username = i18next.t('enterUsername');
          }
          if (!password) {
            errors.password = i18next.t('enterPassword');
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .post(routes.loginPath(), values)
            .then((response) => {
              const { username, token } = response.data;
              dispatch(login({ status: 'valid', username, token }));
              axios
                .get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                  history.push('/');
                  const { currentChannelId, channels, messages } = res.data;
                  channels.forEach((channel) => {
                    dispatch(addChannelSuccess({ ...channel, messagesIds: [] }));
                  });
                  dispatch(activateChannel(currentChannelId));
                  messages.forEach((msg) => {
                    dispatch(addMessageSuccess(msg));
                  });
                })
                .catch((err) => console.log('Ошибка при запросе к серверу на получение списка каналов и сообщений: ', err));
            })
            .catch((error) => {
              if (error.response.status === 401) {
                // console.log('Такого пользователя не существует');
                dispatch(setUserStatus('invalid'));
              } else {
                console.log(error);
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <div className="container-fluid">
            <div className="row justify-content-center pt-5">
              <div className="col-sm-4">
                <Form className="p-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="username">{i18next.t('username')}</label>
                    <Field className={inputClassNames} type="username" name="username" id="username" required />
                    <ErrorMessage name="username" component="div" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">{i18next.t('password')}</label>
                    <Field className={inputClassNames} type="password" name="password" id="password" required />
                    <div className="invalid-feedback">{i18next.t('wrongUsernameOrPassword')}</div>
                    <ErrorMessage name="password" component="div" />
                  </div>
                  <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                    {i18next.t('signin')}
                  </button>
                  <div className="d-flex flex-column align-items-center">
                    <span className="small mb-2">{i18next.t('noAccount')}</span>
                    <a href="/signup">{i18next.t('signUpPage')}</a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};
