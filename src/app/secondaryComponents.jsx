/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import axios from 'axios';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import cn from 'classnames';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isNil } from 'lodash';
import routes from '../routes.js';
import {
  setUserStatus,
  login,
  setInitialChannels,
  makeSignupUserFormInvalid,
} from './slice.js';

const LoginPage = () => {
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
            errors.username = 'Введите имя пользователя';
          }
          if (!password) {
            errors.password = 'Введите пароль';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .post(routes.loginPath(), values)
            .then((response) => {
              const { username, token } = response.data;
              dispatch(login({ status: 'valid', username, token }));
              window.localStorage.setItem('userAuthToken', token);
              axios
                .get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                  dispatch(setInitialChannels(res.data));
                })
                .catch((err) => console.log('Ошибка при запросе к серверу на получение списка каналов и сообщений: ', err))
                .finally(() => {
                  history.push('/');
                });
            })
            .catch((error) => {
              if (error.response.status === 401) {
                console.log('Такого пользователя не существует');
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

const PageNotFound = () => (
  <div className="d-flex flex-column h-100">
    <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
      <a className="mr-auto navbar-brand" href="/">Hexlet Chat</a>
    </nav>
    <h1>{i18next.t('404')}</h1>
  </div>
);

const SignupPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const doesUserAlreadyExist = useSelector((state) => state.uiState.signupForm.userAlreadyExists);
  // console.dir(doesUserAlreadyExist);
  return (
    <div className="d-flex flex-column h-100">
      <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
        <a className="mr-auto navbar-brand" href="/">{i18next.t('hexletChat')}</a>
      </nav>
      <Formik
        initialValues={{
          username: '',
          password: '',
          passwordConfirmation: '',
        }}
        validate={({ username, password, passwordConfirmation }) => {
          const errors = {};
          if (!username) {
            errors.username = i18next.t('required');
          } else if (username.length < 3 || username.length > 20) {
            errors.username = i18next.t('from3to20symbols');
          }
          if (!password) {
            errors.password = i18next.t('required');
          }
          if (password.length < 6) {
            errors.password = i18next.t('6symbolsOrMore');
          }
          if (!passwordConfirmation) {
            errors.passwordConfirmation = i18next.t('required');
          }
          if (password !== passwordConfirmation) {
            errors.passwordConfirmation = i18next.t('passwordsMustMatch');
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const { username, password } = values;
          axios
            .post(routes.sighUpPath(), { username, password })
            .then((response) => {
              const { username, token } = response.data;
              // console.log('Пришло с сервера: ', response.data);
              dispatch(login({ status: 'valid', username, token }));
              window.localStorage.setItem('userAuthToken', token);
              axios
                .get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                  dispatch(setInitialChannels(res.data));
                })
                .catch((err) => console.log('Ошибка при запросе к серверу на получение списка каналов и сообщений: ', err))
                .finally(() => {
                  history.push('/');
                });
            })
            .catch((error) => {
              if (error.response.status === 409) {
                // console.log('Такой пользователь уже существует');
                dispatch(makeSignupUserFormInvalid());
              } else {
                console.log(error);
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          const usernameInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.username && touched.username) || doesUserAlreadyExist });
          const passwordInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.password && touched.password) || doesUserAlreadyExist });
          const passwordConfirmationInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.passwordConfirmation && touched.passwordConfirmation) || doesUserAlreadyExist });
          return (
            <div className="container-fluid">
              <div className="row justify-content-center pt-5">
                <div className="col-sm-4">
                  <Form className="p-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="username">{i18next.t('userName')}</label>
                      <Field className={usernameInputClassNames} type="username" name="username" id="username" placeholder={i18next.t('from3to20symbols')} required />
                      <div className="invalid-feedback">
                        {errors.username}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="password">{i18next.t('password')}</label>
                      <Field className={passwordInputClassNames} type="password" name="password" id="password" placeholder={i18next.t('6symbolsOrMore')} required />
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="passwordConfirmation">{i18next.t('confirmPassword')}</label>
                      <Field className={passwordConfirmationInputClassNames} type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder={i18next.t('passwordsMustMatch')} required />
                      <div className="invalid-feedback">
                        {errors.passwordConfirmation}
                        {doesUserAlreadyExist ? i18next.t('userAlreadyExists') : null}
                      </div>
                    </div>
                    <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                      {i18next.t('signUp')}
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export { LoginPage, SignupPage, PageNotFound };
